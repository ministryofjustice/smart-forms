/* jshint evil: true */

var $, validate;
var flow = {};
var i;

flow.history = [];
flow.data = {};

flow.buildHistoryFromData = function() {
  "use strict";
  // from the existing state of the data, recalculate the history
  var currentBlockId = "start", i, state, transitions, t, nextBlockId;
  flow.history = [];
  while (true) {
    flow.history.push(currentBlockId);

    state = $("#"+currentBlockId);

    if (flow.data[currentBlockId]) {

      // this block has data, move to next block
      transitions = $("#"+currentBlockId+" transition");
      for (i in transitions) {
        if (transitions.hasOwnProperty(i)) {
          t = transitions[i];
          if ($(t).attr("if")===undefined) {
            nextBlockId = $(t).attr("target");
            break;
          } else {
            if (eval($(t).attr("if"))) {
              nextBlockId = $(t).attr("target");
              break;
            }
          }
        }
      }
      if (nextBlockId) {
        currentBlockId = nextBlockId;
      } else {
        console.log("error. No transition found");
        return;
      }
    } else {
      // no data for this state. Move to transition
      transitions = $("#"+currentBlockId+" transition");
      t = transitions[0];
      nextBlockId = $(t).attr("target");
      return;
    }
  }
};

flow.formatAnswer = function(answer) {
  "use strict";
  var key, keys=[], result=[];
  if (Object.keys) {
    keys = Object.keys(answer);
  } else {
    alert("Object.keys not available. You're probably using an old browser.");
  }
  if (keys.length === 1) {
    // if there's only one form item in the block, don't show the answer's key, as the block's title (h2) suffices
    result.push(answer[keys[0]]);
  } else {
    for (key in answer) {
      result.push(key+": "+answer[key]);
    }
  }
  return result.join("<br/>");
};

flow.buildViewFromHistory = function() {
  "use strict";
  // walk down the history and write the data of each block
  var items = [], i, blockId;
  $("#summary").html();

  // Summary of previous answers
  for (i=0; i<flow.history.length - 1; i++) { // history includes the current block. Don't include it.
    blockId = flow.history[i];
    items.push("<li class='done'><h3 class='question'>"+flow.data[blockId].question+"</h3><div class='answer'>"+flow.formatAnswer(flow.data[blockId].answer)+"</div><p class='undo' onclick='flow.deleteData(\""+blockId+"\")' href='#'>Change this answer</p></li>");
  }
  $("#summary").html(items.join(''));
  $(".done-questions").css("display","block");

  // current state
  blockId = flow.history[flow.history.length-1];
  $(".block input[type='button']").off("click");
  $("#"+blockId+" input[type='button']").on("click", function() {
    if (validate.validateForm(blockId)) {
      // update data model
      flow.data[blockId] = {"question":$("#"+blockId+" h2").text(), "answer":{}};
      $("#"+blockId+" textarea").each(function(index, textarea) { flow.data[blockId].answer[textarea.name] = textarea.value; });
      $("#"+blockId+" input:text").each(function(index, text) { flow.data[blockId].answer[text.name] = text.value; });
      $("#"+blockId+" input:radio:checked").each(function(index, radioButton) {
        flow.data[blockId].answer[radioButton.name] = radioButton.value;
      });
      flow.buildHistoryFromData();
      flow.buildViewFromHistory();
    }
  });
  $(".block").css("display","none");
  flow.showBlock(blockId);
};


flow.deleteData = function(blockId) {
  "use strict";
  delete flow.data[blockId];
  flow.start();
};

flow.showBlock = function(blockId) {
  "use strict";
  var thisBlock = $("#"+blockId),
      conditionalText = $("#"+blockId+" p[cond], #"+blockId+" label[cond]"),
      item;

  for (i=0; i<conditionalText.length;i++) {
    item = conditionalText[i];
    item.style.display = eval(item.getAttribute("cond")) ? "block" : "none";
  }
  thisBlock.css("display", "block");
};


flow.start = function() {
  "use strict";
  flow.buildHistoryFromData();
  flow.buildViewFromHistory();
};

