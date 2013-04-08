var $;
var flow = {};
var datamodel = [];

flow.summarise = function() {
  var value, i, markup = [];
  if (datamodel.length>0) {
    for (i=0; i<datamodel.length; i++) {
      value = datamodel[i];
      var answer = util.objTextToString(value['answer']);
      markup.push("<li class='done'><h3 class='question'>" + value['question'] + "</h3><div class='answer'>" + answer + "</div><p class='undo'><a href='javascript:flow.gotoStep("+i+")'>Change this answer</a></p></li>");
    }
    $("#summary").html(markup.join(''));
    $(".done-questions").css("display","block");
  } else {
    $(".done-questions").css("display","none");
  }
};

flow.start = function (initialStepId) {
  $("div.step").on("click", "button[type=submit]", flow.stepSubmittedCallback);
  flow.showStep(initialStepId);
};

flow.showStep = function(stepId) {
  $("#" + stepId).css('display','block');
};

flow.hideStep = function(stepId) {
  $("#" + stepId).css('display','none');
};

flow.gotoStep = function(i) {
  datamodel.splice(i,datamodel.length-i+1);
  $(".step").css('display','none');
  $("div.step:nth("+(i+1)+")").css('display', 'block');
  flow.summarise();
};

flow.stepSubmittedCallback = function(e) {
  var stepsIds=[], next, i, is, cond, substeps, transition, transitions, parentStep;
  var stepId = $(e.target).closest(".step").attr("id");

  // collect data
  var data = {question:"", answer:{}};
  data['question'] = $("#"+stepId+" h2").html();
  $("#"+stepId+" textarea").each(function(index, textarea) { data['answer'][textarea.id] = textarea.value; });
  $("#"+stepId+" input:radio:checked").each(function(index, radioButton) { 
      data['answer'][radioButton.name] = radioButton.value; 
  });
  if (!$.isEmptyObject(data['answer'])) {
    datamodel.push(data);
  }

  flow.summarise();

  // transitions
  transitions = $("#" + stepId + " transition");
  for (i=0; i < transitions.length; i++) {
    transition = transitions[i];
    cond = transition.getAttribute("if");
    is = transition.getAttribute("is");
    if (cond) {
      if (is && data['answer'][cond] == is) {
        next = transition.getAttribute("target");
        break;
      }
    } else {
      next = transition.getAttribute("target");
    }
  }
  if (next) {
    flow.hideStep(stepId);
    flow.showStep(next);
  } else {
    next = $("#" + stepId).next("div.step");
    if (next) {
      flow.hideStep(stepId);
      flow.showStep(next.attr("id"));
    } else {
      console.log("error: no transition. Trying next step in document order");
    }
  }
};

var util = { };

util.objTextToString = function(object) {
  var result=[];
  $.each(object, function(key, val) {
    var t = typeof val;
    if (t==="number" || t==="string") { result.push(" "+val);}
    if (t==="object") { result.push(" "+util.objToString(val));}
  });
  return result.join('');
};

