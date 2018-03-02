stimArray = [];
var delayRecallTask = function() {
    var delayRecallTimeline = [];

    var instructions_delayrecall = {
      type: 'instructions',
      pages: ["<h1> Part V. Delayed Recall </h1> <br/><p> Now you will recall as many words as you can remember from the initial word list task (but <b>NOT</b> the initial three practice words).</p> <p> When you see the <i style='color:red' class='fa fa-microphone'></i> on the next page, please begin the word recall. </p> <p> Please remember to speak <strong>clearly</strong>, pausing for about 2 seconds between words. </p> <p> Press next to begin this recall. You will have " + delayRecordTime + " seconds to recall as many words as you can remember. </p>"],
      show_clickable_nav: true
    };
    delayRecallTimeline.push(instructions_delayrecall);
         
    // need to fix this part - account for separate lists?
    var block_delayrecall = {
        type: 'free-recall',
        stimulus: "<p class='mic' style='position:absolute;top:35%;left:47%;font-size:10vw;color:red'><i class='fa fa-microphone blink_me' style='color:red'></i></p>",
        //list_number: currentListNumber,
        identifier: 'delayedRecall_allLists',
        stim_duration: delayRecordTime * 1000,
        trial_duration: delayRecordTime * 1000, // +  2000,
        record_audio: true,
        //speech_recognizer: 'google', //later functionality
        data: {
            totalListNumber: numberOfLists,
            allListWords: stimArray, 
        },
        /*on_finish: function() {
            console.log('Saving data...')
            if (mode === 'lab') {
                psiTurk.saveData({
                    success: function() {
                        console.log('Data saved!')
                    }
                })
            }

            currentList = []; // reset currentList array
            currentTrialNumber = 0; // reset trial number counter
            currentListNumber++ // add to list counter
        }*/


    };
    delayRecallTimeline.push(block_delayrecall)
    
    return delayRecallTimeline;
    
    }