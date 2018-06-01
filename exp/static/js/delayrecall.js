stimArray = [];
var delayRecallTask = function() {
    var delayRecallTimeline = [];

    var instructions_delayrecall = {
      type: 'instructions',
      pages: ["<h1> Part V. Delayed Recall </h1> <br/><p> Now you will recall as many words as you can remember from the word list task.</p> <p> When you see the prompt on the next page, please type in words in any order you recall them. </p> <p> You will have " + delayRecordTime + " seconds to recall as many words as you can remember. </p>"],
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
        questions: [{prompt: '<b>Please type each word you recall from all earlier word lists, in any order. <p>Press the Enter/Return key, the spacebar, or a comma key to submit each word.</p></b><p>(NOTE: the word will disappear once submitted and the screen will progress once time has run out)</p>', value: '', recall_mode: 'word'}]
    }

    delayRecallTimeline.push(block_delayrecall)


    return delayRecallTimeline;

    }
