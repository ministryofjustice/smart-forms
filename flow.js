var $;
var flow = {};
var i;

flow.history = [];
flow.data = {};

flow.buildHistoryFromData = function() {
  console.log("buildHistoryFromData");
  // from the existing state of the data, recalculate the history
  var currentBlockId = "start", i;
  flow.history = [];
  console.log("history");
  while (true) {
    flow.history.push(currentBlockId);
    console.log("adding to history: "+currentBlockId);

    state = $("#"+currentBlockId);

    if (flow.data[currentBlockId]) {

      // this block has data, move to next block
      transitions = $("#"+currentBlockId+" transition");
      for (i in transitions) {
        t = transitions[i];
        if ($(t).attr('if')===undefined) {
          nextBlockId = $(t).attr("target");
          break;
        } else {
          if (eval($(t).attr("if"))) {
            nextBlockId = $(t).attr("target");
            break;
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
    // if there's only one form item in the block, don't show the answer's key, as the block's title (h2) suffices
    result.push(answer[keys[0]]);
  } else {
    for (key in answer) {
      result.push(key+": "+answer[key]);
    }
  }
  return result.join('<br/>');
};

flow.buildViewFromHistory = function() {
  // walk down the history and write the data of each block
  var items = [], i;
  $("#summary").html();

  // Summary of previous answers
  for (i=0; i<flow.history.length - 1; i++) { // history includes the current block. Don't include it.
    blockId = flow.history[i];
    items.push("<li class='done'><h3 class='question'>"+flow.data[blockId].question+"</h3><div class='answer'>"+flow.formatAnswer(flow.data[blockId]['answer'])+"</div><p class='undo' onclick='flow.deleteData(\""+blockId+"\")' href='#'>Change this answer</p></li>");
  }
  $("#summary").html(items.join(''));
  $(".done-questions").css("display","block");

  // current state
  blockId = flow.history[flow.history.length-1];
  $("div.block > button:submit").off("click");
  $("#"+blockId+" > button:submit").on("click", function() {
    var i;
    // update data model
    console.log("creating data["+blockId+"]");
    flow.data[blockId] = {"question":$("#"+blockId+" h2").text(), "answer":{}};
    $("#"+blockId+" textarea").each(function(index, textarea) { flow.data[blockId]['answer'][textarea.name] = textarea.value; });
    $("#"+blockId+" input:text").each(function(index, text) { flow.data[blockId]['answer'][text.name] = text.value; });
    $("#"+blockId+" input:radio:checked").each(function(index, radioButton) {
      flow.data[blockId]['answer'][radioButton.name] = radioButton.value;
    });
    flow.buildHistoryFromData();
    flow.buildViewFromHistory();
  });
  $("div.block").css("display","none");
  flow.showBlock(blockId);
};


flow.deleteData = function(blockId) {
  delete flow.data[blockId];
  flow.start();
};

flow.showBlock = function(blockId) {
  var thisBlock = $("#"+blockId);
  var conditionalText = $("#"+blockId+" p[cond], #"+blockId+" label[cond]");

  for (i=0; i<conditionalText.length;i++) {
    item = conditionalText[i];
    item.style.display = eval(item.getAttribute("cond")) ? "block" : "none";
  }
  thisBlock.css("display", "block");
};


flow.start = function() {
  flow.buildHistoryFromData();
  flow.buildViewFromHistory();
};

