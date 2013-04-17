var $;
var flow = {};
var data = {};
var i;

flow.history = [];
flow.currentStepId = null;
flow.furthestStepId = null;


flow.buildHistoryFromData = function() {
  // from the existing state of the data, recalculate the history
  var currentStepId = "start", atTheEnd = false;
  flow.history = [];
  while (true) {
    flow.history.push(currentStepId);
    state = $("#"+currentStepId);
    if (!state.hasClass("final")) {
      transitions = $("#"+currentStepId+" transition");
      for (i in transitions) {
        t = transitions[i];
        if ($(t).attr('if')==undefined) {
          nextStepId = $(t).attr("target");
          break;
        } else {
          try {
            if (eval($(t).attr("if"))) {
              nextStepId = $(t).attr("target");
              break;
            }
          } catch (e) {
            // we've encountered non existing data. Abort
            return;
            break;
          }
        }
      }
        
      if (nextStepId) { 
        currentStepId = nextStepId;
      } else {
        console.log("error. No transition found");
        return;
      }
    }
  }
};

flow.buildViewFromHistory = function() {
  // walk down the history and write the data of each step
  var items = [];
  $("#summary").html();
  for (i=1; i<flow.history.length - 1; i++) { // history includes the current step. Don't include it.
    stepId = flow.history[i];
    items.push("<li class='done'><h3 class='question'>"+data[stepId].question+"</h3><div class='answer'>"+JSON.stringify(data[stepId]['answer'])+"</div><p class='undo' onclick='flow.rewindTo(\""+stepId+"\")' href='#'>Change this answer</p></li>");
  }
  $("#summary").html(items.join(''));
  $(".done-questions").css("display","block")

  // then, show the current state
  $("div.state").css("display","none");
  flow.showStep(flow.history[flow.history.length - 1]);
};



flow.hideStep = function(stepId) {
  $("#"+stepId).css("display", "none");
}

flow.showStep = function(stepId) {
  var thisStep = $("#"+stepId);
  var conditionalText = $("#"+stepId+" div[cond]");

  for (i=0; i<conditionalText.length;i++) {
    item = conditionalText[i];
    item.style.display = eval(item.getAttribute("cond")) ? "block" : "none";
  }
  thisStep.css("display", "block");
};


flow.rewindTo = function(targetStepId) {

  // hide the current state
  flow.hideStep(flow.currentStepId);

  // is rewindStepId a branch?
  if ($("#"+targetStepId+" transition[if]")) {
    // this is not a branch
    flow.enterStep(targetStepId, flow.currentStepId);
  }



};

flow.enterStep = function(stepId, comebackTo) {
  if (!comebackTo) {
    flow.buildHistoryFromData();
    flow.buildViewFromHistory();
  }

  console.log("history: "+JSON.stringify(flow.history));
  flow.currentStepId = stepId;

  if (!$("#"+stepId).hasClass("final")) {
    // if this isn't a final step, put an event handler on each button
    $("#"+stepId+" button[type=submit]").on("click", function() {
      // update data model
      data[stepId] = {"question":$("#"+stepId+" label").text(), "answer":{}};
      $("#"+stepId+" textarea").each(function(index, textarea) { data[stepId]['answer'][textarea.id] = textarea.value; });
      $("#"+stepId+" input:text").each(function(index, text) { data[stepId]['answer'][text.id] = text.value; });
      $("#"+stepId+" input:radio:checked").each(function(index, radioButton) { 
        data[stepId]['answer'][radioButton.name] = radioButton.value;
      }); 

      if (comebackTo) {
        // we've come back to this state from a rewind, so go back to where we were before
        flow.hideStep(stepId);
        flow.enterStep(comebackTo);
      } else {
        // normal flow: look for transitions

        transitions = $("#"+stepId+" transition");
        for (i in transitions) {
          t = transitions[i];
          if ($(t).attr('if')==undefined) {
            nextStepId = $(t).attr("target");
            break;
          } else {
            if (eval($(t).attr("if"))) {
              nextStepId = $(t).attr("target");
              break;
            }
          }
        }
        
        if (nextStepId) { 
          flow.hideStep(stepId);
          flow.history.push(stepId);
          flow.enterStep(nextStepId);
        } else {
          console.log("error. No transition found");
        }
      }
    });
  }
}
