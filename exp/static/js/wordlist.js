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
            pages: ["<h1> Part I. Word List Recall </h1>" + "<p> You've passed the microphone checks! Now let's begin the word list task. </p> <p>You will now proceed through " + numberOfLists + " lists of " + listLength + " words. The words from each list will appear in the middle of the screen, one at a time.</p> <p>Please proceed when you are ready. </p>" ],
            show_clickable_nav: true,
        }
        wordListTimeline.push(instructions_beginwordlist);
    
    for (var listNumber = 0; listNumber <= numberOfLists - 1; listNumber++) {
        currentStimArray = stimArray[listNumber];
        console.log(currentStimArray);
        wordData.listWords.push([]);

        
        // reminder before starting each list
        var instructions_wordlist = {
            type: 'instructions',
            pages: ["<p> You will now view words from a word list. </p> <p> Try to focus and remember as many as you can. </p>" + "Press the button to continue to list " + (listNumber + 1) + " of " + numberOfLists + ".</p>"],
            show_clickable_nav: true,
        }
        wordListTimeline.push(instructions_wordlist);
        
        currentStimArray.forEach(function(eachWord){
            console.log(eachWord)
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
            pages: ["<p> <b>Remember:</b> When you see the red microphone icon <i style='color:red' class='fa fa-microphone'></i>, recall as many words from the list you just viewed, in any order. </p> <p> You will have " + recordTime + " seconds to recall as many words as you can once the icon appears.</p> <p> Please speak <strong>clearly</strong> at a distance  1-2 feet away from your computer, and pause for about 1-2 seconds between each word. </p>"],
            show_clickable_nav: true,
        }
        
        wordListTimeline.push(block_pre_recall)
        
        //TODO: need to add microphone checks in warnings file?
        var block_recall = {
            type: 'free-recall',
            stimulus: "<p class='mic' style='position:absolute;top:35%;left:47%;font-size:10vw;color:red'><i class='fa fa-microphone blink_me' style='color:red'></i></p>",
            //list_number: currentListNumber,
            identifier: 'wordlist-' + (listNumber+1), //save file with task and list number, shift initial 0 idx to 1
            stim_duration: recordTime * 1000,
            trial_duration: recordTime * 1000, // +  2000,
            record_audio: true,
            //speech_recognizer: 'google',
            data: {
                listNumber: listNumber,
                list_words: currentStimArray,
            },
            //on_finish: function() {
                //console.log('Saving data...')
                /*if (mode === 'lab') {
                    psiTurk.saveData({
                        success: function() {
                            console.log('Data saved!')
                        }
                    }) */ // not sure if need until later
               // }
                //*** is the following necessary?
                //currentList = []; // reset currentList array
                //currentTrialNumber = 0; // reset trial number counter
                //currentListNumber++ // add to list counter
            //}
              

        };
        wordListTimeline.push(block_recall)
    };
    
    return wordListTimeline;

};