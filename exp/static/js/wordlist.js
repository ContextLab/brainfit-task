// initialize counter for lists and trials
var currentListNumber = 0;
var currentTrialNumber = 0;
var currentListWords = [];
var wordsCorrect; //number of matched words for each trial
var stimArray = []; //create an array for words
var currentStimArray = stimArray[0];

var wordData = { //data object to keep track of recalled words
    listWords: [],
    recalledWords: [],
    correctWords: []
};

var wordListTask = function() {

    var wordListTimeline = [];

    var instructions_beginwordlist = {
            type: 'instructions',
            // pages: ["<h1> Part I. Word List Recall </h1>" + "<p> You've passed the microphone checks! Now let's begin the word list task. </p> <p>You will now proceed through " + numberOfLists + " lists of " + listLength + " words.</p><p>The words from each list will appear in the middle of the screen, one at a time. Then, when you see the red microphone icon <i style='color:red' class='fa fa-microphone'></i>, recall the words from the most recent list in <b> any order</b>.</p><p>Please proceed when you are ready. </p>" ],
            pages: ["<h1> Part I. Word List Recall </h1>" + "<p>Now we will begin with the first memory task to examine your recall accuracy and recall strategies for single items. In this task, we will present words to you one at a time in the center of the screen. You will then try your best to remember what these words were and type the words you remember seeing when prompted. </p> <p>You will see a total number of  " + numberOfLists + " lists of " + listLength + " words each. Following the prompt on the next page, the words from each list will appear in the middle of the screen, one at a time. Then, when you see the text box prompt on the following page, type all the words you remember from most recent list, one at a time, in <b> any order</b>. To submit each word, press the Enter/Return key, spacebar, or the comma key. </p><p>Please proceed when you understand these instructions and are ready to continue to the task. </p>" ],
            show_clickable_nav: true,
        }
        wordListTimeline.push(instructions_beginwordlist);

    for (var listNumber = 0; listNumber <= numberOfLists - 1; listNumber++) {
        currentStimArray = stimArray[listNumber];
        //console.log(currentStimArray);
        wordData.listWords.push([]);

        if (listNumber === 0){ //if the first list
          var instructions_wordlist = {
              type: 'instructions',
              pages: ["<p>You will now view words from the first word list. </p> <p>Try to focus and remember as many as you can. </p>" + "Press the button to continue to list " + (listNumber + 1) + " of " + numberOfLists + ".</p>"],
              show_clickable_nav: true,
          }
          wordListTimeline.push(instructions_wordlist);
        }else if (listNumber < (numberOfLists - 1)) { //if not the final list //NOTE: add in not first list too?
          var instructions_wordlist = {
              type: 'instructions',
              pages: ["<p>You will now view words from another word list. </p> <p>Try to focus and remember as many as you can. </p>" + "Press the button to continue to list " + (listNumber + 1) + " of " + numberOfLists + ".</p>"],
              show_clickable_nav: true,
          }
          wordListTimeline.push(instructions_wordlist);
        }else if (listNumber === (numberOfLists - 1)) { //if final list
          var instructions_wordlist = {
              type: 'instructions',
              pages: ["<p>You will now view words from the final word list. </p> <p>Try to focus and remember as many as you can. </p>" + "Press the button to continue to list " + (listNumber + 1) + " of " + numberOfLists + ".</p>"],
              show_clickable_nav: true,
          }
          wordListTimeline.push(instructions_wordlist);
        }

        currentStimArray.forEach(function(eachWord){
            //console.log(eachWord)
            var block_words = {
                type: 'html-keyboard-response',
                stimulus: "<div style='font-size:70px'>" + eachWord + "</div>",
                choices: jsPsych.NO_KEYS,
                stimulus_duration: wordPresTime*1000,//ms,1000,
                trial_duration: (wordIntertrialTime+wordPresTime)*1000,//ms, 1500, //stim dur + isi dur
                data: {
                    listNumber: listNumber,
                    word: eachWord,
                    //trialNumber: ,
                },
                on_finish: function() {
                currentListWords.push(currentStimArray[0].text) //check this ***
                //currentTrialNumber++ // update trial number after each trial

                }
            }
               wordListTimeline.push(block_words);

        })

        var block_pre_recall = {
            type: 'instructions',
            pages: ["<p> <b>Remember:</b> When you see the text box prompt, type as many words from the list you just viewed in any order, separated by pressing the Enter/Return key, spacebar, or the comma key. </p> <p> You will have " + recordTime + " seconds to recall as many words as you can before the screen progresses.</p>"],
            show_clickable_nav: true,
        }

        wordListTimeline.push(block_pre_recall)

        //AUDIO
        // var block_recall = {
        //     type: 'free-recall',
        //     stimulus: "<p class='mic' style='position:absolute;top:35%;left:47%;font-size:10vw;color:red'><i class='fa fa-microphone blink_me' style='color:red'></i></p>",
        //     //list_number: currentListNumber,
        //     identifier: 'wordlist-' + (listNumber+1), //save file with task and list number, shift initial 0 idx to 1
        //     stim_duration: recordTime * 1000,
        //     trial_duration: recordTime * 1000, // +  2000,
        //     record_audio: true,
        //     //speech_recognizer: 'google',
        //     data: {
        //         listNumber: listNumber,
        //         list_words: currentStimArray,
        //     },
        //     //on_finish: function() {
        //         //console.log('Saving data...')
        //         /*if (mode === 'lab') {
        //             psiTurk.saveData({
        //                 success: function() {
        //                     console.log('Data saved!')
        //                 }
        //             }) */ // not sure if need until later
        //        // }
        //         //*** is the following necessary?
        //         //currentList = []; // reset currentList array
        //         //currentTrialNumber = 0; // reset trial number counter
        //         //currentListNumber++ // add to list counter
        //     //}
        //
        //
        // };

        var block_recall = {
            type: 'survey-text-custom',
            recall_time: recordTime, //seconds, converted to ms within the plugin
            button_appear_time: 0, //make greater than time if don't want button to appear
            questions: [{prompt: 'Please type each word you recall from the most recent list, in any order. \
            <p>Press the Enter/Return key, the spacebar, or a comma key to submit each word.</p>\
            <p><b>NOTE:</b> The word will disappear once submitted. This text entry screen will continue after ' + recordTime + ' seconds, \
            regardless of how many words you recall. Please try hard to remember the words you saw throughout this interval, even if you think your memory has been exhausted. \
            You should enter the words in the order they come to mind (you do not need to remember the words in the order you studied them).</p>', value: '', recall_mode: 'word'}],
            data: {
                     task_name: 'immed_word_recall',
            }
        }

        wordListTimeline.push(block_recall)
    };

    return wordListTimeline;

};
