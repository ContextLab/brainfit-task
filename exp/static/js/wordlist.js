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
            " random words to remember, sort of like you’re at the grocery store trying to remember what you’re supposed to buy. (Only, some of the words you see in this game might seem strange or out of place at a typical store.) We'll flash a list of words on the screen, one at a time, and your job is to remember the full list.</p><p>After you've seen the words, we'll ask you to type any words that you remember into a prompt. It doesn't matter what order you remember the words in (just like it wouldn't matter what order you picked up your groceries in); the key is that you try your best not to forget any! You’ll have "
            + recordTime +
            " seconds during the prompt to write as many words as you can remember. Even if you think you can't remember any more, it's important that you try hard throughout the entire "
            + recordTime +
            " seconds in case something comes to mind. This whole procedure will repeat several times, so that you commit a total of "
            + numberOfLists + " 'shopping lists' of random words to memory.</p><p>Ready to memorize the first list?</p>" ],
            show_clickable_nav: true,
            button_label_next: 'Give me the list!'
        }
        wordListTimeline.push(instructions_beginwordlist);

    for (var listNumber = 0; listNumber <= numberOfLists - 1; listNumber++) {
        currentStimArray = stimArray[listNumber];
        //console.log(currentStimArray);
        wordData.listWords.push([]);

        if (listNumber === 0){ //if the first list
          //pass
        }else if (listNumber === 1 ) { //second list
          var instructions_wordlist = {
              type: 'instructions',
              pages: ["<p>Nicely done! We’ll do this a few more times to get a stable estimate of this aspect of your memory.  Remember: during the memory test section, it’s important that you try hard throughout the entire " + recordTime + " seconds, even if you think you can’t remember any more words, in case something comes to mind.  Press the button when you’re ready to memorize list " + (listNumber+1) + " of " + numberOfLists + ".</p>"],
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
            var block_words = {
                type: 'html-keyboard-response',
                stimulus: "<div style='font-size:70px'>" + eachWord + "</div>",
                choices: jsPsych.NO_KEYS,
                stimulus_duration: wordPresTime*1000,//ms,1000,
                trial_duration: (wordIntertrialTime+wordPresTime)*1000,//ms, 1500, //stim dur + isi dur
                data: {
                    listNumber: listNumber,
                    word: eachWord,
                },
                on_finish: function() {
                currentListWords.push(currentStimArray[0].text) //check this ***
                }
            }
               wordListTimeline.push(block_words);

        })

        var block_recall = {
            type: 'survey-text-custom',
            recall_time: recordTime, //seconds, converted to ms within the plugin
            button_appear_time: 0, //don't want button to appear so set to 0
            questions: [{prompt: "<p>Timer started! Recall words below for the next " + recordTime + " seconds.</p><p>Press enter/return, the spacebar, or the comma key to submit each word you remember.</p>", value: '', recall_mode: 'word'}],
            data: {
                     task_name: 'immed_word_recall',
            }
        }

        wordListTimeline.push(block_recall)

        if (listNumber === (numberOfLists - 1)) { //final list, concluding notes
          var concluding_wordlist = {
              type: 'instructions',
              pages: ["<h3>Time's up!</h3><p>That game you just played is called 'free recall'. It tests your ability to memorize words, regardless of the order you learned them in. Next we’ll move on to testing a different aspect of your memory.</p>"],
              show_clickable_nav: true,
          }
          wordListTimeline.push(concluding_wordlist);
        }
    };

    return wordListTimeline;

};
