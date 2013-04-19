var $;
var flow = {};
var i;

flow.history = [];
flow.data = {};

flow.buildHistoryFromData = function() {
  console.log("buildHistoryFromData");
  // from the existing state of the data, recalculate the history
  var currentStepId = "start", i;
  flow.history = [];
  console.log("history");
  while (true) {
    flow.history.push(currentStepId);
    console.log("adding to history: "+currentStepId);

    state = $("#"+currentStepId);

    if (flow.data[currentStepId]) {

      // this step has data, move to next step
      transitions = $("#"+currentStepId+" transition");
      for (i in transitions) {
        t = transitions[i];
        if ($(t).attr('if')===undefined) {
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
        currentStepId = nextStepId;
      } else {
        console.log("error. No transition found");
        return;
      }
    } else {
      // no data for this state
      return;
    }
  }
};

flow.formatAnswer = function(answer) {
  var key, keys=[], result=[];
  if (Object.keys) {
    keys = Object.keys(answer);
  } else {
      alert("Object.keys not available. You're probably using an old browser.");
  }
  if (keys.length === 1) {
    // if there's only one form item in the step, don't show the answer's key, as the step's title (h2) suffices
    result.push(answer[keys[0]]);
  } else {
    for (key in answer) {
      result.push(key+": "+answer[key]);
    }
  }
  return result.join('<br/>');
};

flow.buildViewFromHistory = function() {
  // walk down the history and write the data of each step
  var items = [], i;
  $("#summary").html();

  // Summary of previous answers
  for (i=0; i<flow.history.length - 1; i++) { // history includes the current step. Don't include it.
    stepId = flow.history[i];
    items.push("<li class='done'><h3 class='question'>"+flow.data[stepId].question+"</h3><div class='answer'>"+flow.formatAnswer(flow.data[stepId]['answer'])+"</div><p class='undo' onclick='flow.deleteData(\""+stepId+"\")' href='#'>Change this answer</p></li>");
  }
  $("#summary").html(items.join(''));
  $(".done-questions").css("display","block");

  // current state
  stepId = flow.history[flow.history.length-1];
  $("div.step > button:submit").off("click");
  $("#"+stepId+" > button:submit").on("click", function() {
    var i;
    // update data model
    console.log("creating data["+stepId+"]");
    flow.data[stepId] = {"question":$("#"+stepId+" h2").text(), "answer":{}};
    $("#"+stepId+" textarea").each(function(index, textarea) { flow.data[stepId]['answer'][textarea.name] = textarea.value; });
    $("#"+stepId+" input:text").each(function(index, text) { flow.data[stepId]['answer'][text.name] = text.value; });
    $("#"+stepId+" input:radio:checked").each(function(index, radioButton) {
      flow.data[stepId]['answer'][radioButton.name] = radioButton.value;
    });
    flow.buildHistoryFromData();
    flow.buildViewFromHistory();
  });
  $("div.step").css("display","none");
  flow.showStep(stepId);
};


flow.deleteData = function(stepId) {
  delete flow.data[stepId];
  flow.start();
};

flow.showStep = function(stepId) {
  var thisStep = $("#"+stepId);
  var conditionalText = $("#"+stepId+" p[cond], #"+stepId+" label[cond]");

  for (i=0; i<conditionalText.length;i++) {
    item = conditionalText[i];
    item.style.display = eval(item.getAttribute("cond")) ? "block" : "none";
  }
  thisStep.css("display", "block");
};


flow.start = function() {
  flow.buildHistoryFromData();
  flow.buildViewFromHistory();
};

