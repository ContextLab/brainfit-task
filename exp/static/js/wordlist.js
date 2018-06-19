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
            pages: ["<h1> Part I. Memorizing random word lists </h1>" +
            "<p>In this first game, we'll be giving you a series of 'shopping lists' of "
            + listLength +
            " random words to remember, sort of like you’re at the grocery store trying to remember what you’re supposed to buy. (Only, some of the words you see in this game might seem strange or out of place at a typical store.) We'll flash a list of words on the screen, one at a time, and your job is to remember the full list. After you've seen the words, we'll ask you to type any words that you remember into a prompt. It doesn't matter what order you remember the words in (just like it wouldn't matter what order you picked up your groceries in); the key is that you try your best not to forget any! You’ll have "
            + recordTime +
            " seconds to write as many words as you can remember. Even if you think you can't remember any more, it's important that you try hard throughout the entire "
            + recordTime +
            " seconds in case something comes to mind. This whole procedure will repeat several times, so that you commit a total of "
            + numberOfLists + " 'shopping lists' of random words to memory. </p> <p>Ready to memorize the first list?</p>" ],
            show_clickable_nav: true,
            button_label_next: 'Give me the list!'
        }
        wordListTimeline.push(instructions_beginwordlist);

    for (var listNumber = 0; listNumber <= numberOfLists - 1; listNumber++) {
        currentStimArray = stimArray[listNumber];
        //console.log(currentStimArray);
        wordData.listWords.push([]);

        if (listNumber === 0){ //if the first list
          //empty

          // var instructions_wordlist = {
          //     type: 'instructions',
          //     pages: ["<p>You will now view words from the first word list. </p> <p>Try to focus and remember as many as you can. </p>" + "Press the button to continue to list " + (listNumber + 1) + " of " + numberOfLists + ".</p>"],
          //     show_clickable_nav: true,
          // }
          // wordListTimeline.push(instructions_wordlist);
        }else if (listNumber === 1 ) { //second list
          var instructions_wordlist = {
              type: 'instructions',
              pages: ["<p>Nicely done! We’ll do this a few more times to get a stable estimate of this aspect of your memory.  Remember: during the memory test, even if you think you can’t remember any more words, it’s important that you try hard throughout the entire " + recordTime + " seconds in case something comes to mind.  Press the button when you’re ready to memorize list " + (listNumber+1) + " of " + numberOfLists + ".</p>"],
              show_clickable_nav: true,
              button_label_next: 'Give me the next list!'
          }
          wordListTimeline.push(instructions_wordlist);
        }else if (listNumber < (numberOfLists - 1)) { //middle lists
          var instructions_wordlist = {
              type: 'instructions',
              pages: ["<p>You’re doing great! Just like for the other lists, remember to keep trying hard throughout the entire " + recordTime + " second memory test, even if it seems like you can’t remember any more words. Press the button when you’re ready to memorize list " + (listNumber+1) + " of " + numberOfLists + ".</p>"],
              show_clickable_nav: true,
              button_label_next: 'Give me the next list!'
          }
          wordListTimeline.push(instructions_wordlist);
        }else if (listNumber === (numberOfLists - 1)) { //final list, offset by one since zero-idxed
          var instructions_wordlist = {
              type: 'instructions',
              pages: ["<p>Just one more to go! Just like for the other lists, remember to keep trying hard throughout the entire " + recordTime + " second memory test, even if it seems like you can’t remember any more words. Press the button when you’re ready to memorize list " + (listNumber+1) + " of " + numberOfLists + ".</p>"],
              show_clickable_nav: true,
              button_label_next: 'Give me my last list!'
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

        /*var block_pre_recall = {
            type: 'instructions',
            pages: ["<p> <b>Remember:</b> When you see the text box prompt, type as many words from the list you just viewed in any order, separated by pressing the Enter/Return key, spacebar, or the comma key. </p> <p> You will have " + recordTime + " seconds to recall as many words as you can before the screen progresses.</p>"],
            show_clickable_nav: true,
        }

        wordListTimeline.push(block_pre_recall)*/

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
            questions: [{prompt: "<p>Memory test time! You'll have " + recordTime + " seconds to remember as many words as you can. Please type each word you remember into the prompt, and then press enter/return, the spacebar, or the comma key to submit each word. You should try hard throughout the entire interval, even if you think you’ve written everything you remember, in case something comes to mind. You can write the words in any order they come to mind-- just try to get as many as you can!</p>", value: '', recall_mode: 'word'}],
            data: {
                     task_name: 'immed_word_recall',
            }
        }

        wordListTimeline.push(block_recall)

        if (listNumber === (numberOfLists - 1)) { //final list, concluding notes
          var concluding_wordlist = {
              type: 'instructions',
              pages: ["<h2>Random word list wrap-up</h2><p>That game you just played is called “free recall.” It tests your ability to memorize words, regardless of the order you learned them in. Next we’ll move on to testing a different aspect of your memory.</p>"],
              show_clickable_nav: true,
          }
          wordListTimeline.push(concluding_wordlist);
        }
    };

    return wordListTimeline;

};
