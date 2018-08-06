stimArray = [];
var delayRecallTask = function() {
    var delayRecallTimeline = [];

    var instructions_delayrecall = {
      type: 'instructions',
      pages: ["<h1> Part V. Recalling random word lists </h1> <br/><p> Remember your “shopping lists” from earlier? Looks like you got to the store and left the lists at home. Now you’ll have to remember as much as you can from all of the earlier lists. On the next page, You’ll have " + delayRecordTime + " seconds to remember as many words as you can from all of the previous lists. You should try hard throughout the entire interval, even if you think you’ve written everything you remember, in case something comes to mind.  You can write the words in any order they come to mind-- just try to get as many as you can! Even if you think you can’t remember any more, it’s important that you try hard throughout the entire duration in case something comes to mind. </p>"],
      show_clickable_nav: true
    };
    delayRecallTimeline.push(instructions_delayrecall);

    var block_delayrecall = {
        type: 'survey-text-custom',
        recall_time: delayRecordTime, //seconds, converted to ms within the plugin
        button_appear_time: 0, //make greater than section time if don't want button to appear
        questions: [{prompt: "<p>Timer started! Recall as many words as you can within the next " + delayRecordTime + " seconds.</p><br /><p>Please type each word you remember into the prompt, and then press enter/return, the spacebar, or the comma key to “submit” each word. </p>", value: '', recall_mode: 'word'}],
        data: {
                 task_name: 'delayed_word_recall',
        }
    }

    delayRecallTimeline.push(block_delayrecall)

    var block_delayrecall_timeup = {
      type: 'instructions',
      pages: ["<h3>Time's up!</h3><p>Thanks for recalling all of that! Click the button to continue to the next section.</p>"],
      show_clickable_nav: true,
    }
    delayRecallTimeline.push(block_delayrecall_timeup)


    return delayRecallTimeline;

    }
