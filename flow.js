var $;
var flow = {};
var data = {};
var i;

flow.history = [];

flow.hideStep = function(stepId) {
  $("#"+stepId).css("display", "none");
}

flow.generateSummary = function() {
  // walk down the history and write the data of each step
  var items = [];
  $("#summary").html();
  for (i=0; i<flow.history.length; i++) {
    stepId = flow.history[i];
    console.log(data[stepId]);
    items.push("<li>"+stepId+": "+data[stepId]+"</li>");
  }
  $("#summary").html(items.join(''));
  $(".done-questions").css("display","block")
}

flow.showStep = function(stepId) {
  var thisStep = $("#"+stepId);
  var conditionalText = $("#"+stepId+" div[cond]");

  flow.generateSummary();
  for (i=0; i<conditionalText.length;i++) {
    item = conditionalText[i];
    item.style.display = eval(item.getAttribute("cond")) ? "block" : "none";
  }
  thisStep.css("display", "block");
}

flow.enterStep = function(stepId) {
  flow.showStep(stepId);
  if (!$("#"+stepId).hasClass("final")) {
    // if this isn't a final step, put an event handler on each button
    $("#"+stepId+" button[type=submit]").on("click", function() {
      // update data model
      data[stepId] = {};
      $("#"+stepId+" textarea").each(function(index, textarea) { data[stepId][textarea.id] = textarea.value; });
      $("#"+stepId+" input:text").each(function(index, text) { data[stepId][text.id] = text.value; });
      $("#"+stepId+" input:radio:checked").each(function(index, radioButton) { 
        data[stepId][radioButton.name] = radioButton.value;
      }); 
      // add to history
      flow.history.push(stepId);

      // find the next step
      next = eval($(this).attr("target"));
      if (next) { 
        flow.hideStep(stepId);
        flow.enterStep(next);
      } else {
        console.log("error. No transition found");
      }
    });
  }
}
