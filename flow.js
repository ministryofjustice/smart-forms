/* exported flow */
/* jshint evil: true, unused: false */

var $, validate;

var flow = (function () {
  "use strict";
  var i, history = [];

  function buildHistoryFromData() {
    // from the existing state of the data, recalculate the history
    var currentBlockId = "start", i, state, transitions, t, nextBlockId;
    history = [];
    while (true) {
      history.push(currentBlockId);
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
  }

  function formatAnswer(answer) {
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
        if (answer.hasOwnProperty(key) && answer[key] !== "") {
          result.push(key+": "+answer[key]);
        }
      }
    }
    return result.join("<br/>");
  }

  function buildViewFromHistory() {
    // walk down the history list
    // for each history item (except last)
    // - if there's data, display it in summary form
    // - if there isn't data display the form and return

    var items = [], item, i, j, blockId, blockData, dataItem, conditionalText, attr, spans, span;
    $(".block form").css("display","none");
    $(".summary").css("display","none");


    // Summary of previous answers
    for (i=0; i<history.length - 1; i++) { // history includes the current block. Don't include it.
      blockId = history[i];
      blockData = flow.data[blockId];

      conditionalText = $("#"+blockId+" *[if]");
      for (j=0; j<conditionalText.length;j++) {
        item = conditionalText[j];
        item.style.display = eval(item.getAttribute("if")) ? "block" : "none";
      }

      spans = $("#"+blockId+" div.summary span");
      for (j=0; j<spans.length; j++) {
        span = $(spans[j]);
        span.html(blockData[span.attr("data")]);
      }
      $(".summary").css("display","block");

    }

    // current state
    $(".block input[type='button']").off("click");

    blockId = history[history.length-1];
    $("#"+blockId+" div.summary").css("display", "none");
    $("#"+blockId+" input[type='button']").on("click", function() {
      if (validate.validateForm(blockId)) {
        // update data model
        flow.data[blockId] = {};
        $("#"+blockId+" textarea").each(function(index, textarea) { flow.data[blockId][textarea.name] = textarea.value; });
        $("#"+blockId+" input:text").each(function(index, text) { flow.data[blockId][text.name] = text.value; });
        $("#"+blockId+" input:radio:checked").each(function(index, radioButton) {
          flow.data[blockId][$(radioButton).attr("name")] = $(radioButton).val();
        });
        buildHistoryFromData();
        buildViewFromHistory();
      }
    });
    showBlock(blockId);
  }



  function showBlock(blockId) {
    var thisBlock = $("#"+blockId),
        conditionalText = $("#"+blockId+" form:not(transition)[if]"),
        item;

    for (i=0; i<conditionalText.length;i++) {
      item = conditionalText[i];
      item.style.display = eval(item.getAttribute("if")) ? "block" : "none";
    }
    thisBlock.find("form").css("display", "block");
  }


  return {
    "data": {},

    "start": function() {
      buildHistoryFromData();
      buildViewFromHistory();
    },

    "deleteData": function(blockId) {
      delete flow.data[blockId];
      flow.start();
    }
  };
})();
