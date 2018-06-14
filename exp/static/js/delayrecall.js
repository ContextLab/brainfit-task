stimArray = [];
var delayRecallTask = function() {
    var delayRecallTimeline = [];

    var instructions_delayrecall = {
      type: 'instructions',
      pages: ["<h1> Part V. Delayed Recall </h1> <br/><p> We now want you to recall as many words as you can remember from all of the lists in the initial word list task to determine how much and which items you can recall following a delay. This will help us understand how fitness or recent exercise influences the ability to retain and retrieve information. </p> <p> When you see the prompt on the next page, please type in words in any order you recall them. </p> <p> You will have " + delayRecordTime + " seconds to recall as many words as you can remember from all previous lists. </p>"],
      show_clickable_nav: true
    };
    delayRecallTimeline.push(instructions_delayrecall);
    //AUDIO
    // var block_delayrecall = {
    //     type: 'free-recall',
    //     stimulus: "<p class='mic' style='position:absolute;top:35%;left:47%;font-size:10vw;color:red'><i class='fa fa-microphone blink_me' style='color:red'></i></p>",
    //     //list_number: currentListNumber,
    //     identifier: 'delayedRecall_allLists',
    //     stim_duration: delayRecordTime * 1000,
    //     trial_duration: delayRecordTime * 1000, // +  2000,
    //     record_audio: true,
    //     //speech_recognizer: 'google', //later functionality
    //     data: {
    //         totalListNumber: numberOfLists,
    //         allListWords: stimArray,
    //     },
    //     /*on_finish: function() {
    //         console.log('Saving data...')
    //         if (mode === 'lab') {
    //             psiTurk.saveData({
    //                 success: function() {
    //                     console.log('Data saved!')
    //                 }
    //             })
    //         }
    //
    //         currentList = []; // reset currentList array
    //         currentTrialNumber = 0; // reset trial number counter
    //         currentListNumber++ // add to list counter
    //     }*/
    //
    //
    // };
    // delayRecallTimeline.push(block_delayrecall)

    var block_delayrecall = {
        type: 'survey-text-custom',
        recall_time: delayRecordTime, //seconds, converted to ms within the plugin
        button_appear_time: 0, //make greater than time if don't want button to appear
        questions: [{prompt: 'Please type each word you recall from all previous word lists, in any order. \
        <p>Press the Enter/Return key, the spacebar, or a comma key to submit each word.</p>\
        <p><b>NOTE:</b> The word will disappear once submitted. This text entry screen will continue after ' + delayRecordTime + ' seconds, \
        regardless of how many words you recall. Please try hard to remember the words you saw throughout this interval, even if you think your memory has been exhausted. \
        You should enter the words in the order they come to mind (you do not need to remember the words in the order you studied them).</p>', value: '', recall_mode: 'word'}],
        data: {
                 task_name: 'delayed_word_recall',
        }
    }

    delayRecallTimeline.push(block_delayrecall)


    return delayRecallTimeline;

    }
