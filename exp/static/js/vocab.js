var stimVocabArray = []; // create an array for vocab
var vocabTask = function() {

    var vocabTimeline = [];
    var instructions_vocab = {
      type: 'instructions',
      pages: ["<h1> Part III. Travel flashcards </h1> <br/><p> Have you ever wanted to travel to another country? Today you'll be taking a virtual flight to Ireland to learn some Irish foreign language vocabulary! You will first be presented with pairs of words and images of their meanings. After viewing these pairs, you will be asked to match these words to their respective translation images. Please press Next > to travel to Ireland! </p>"],
      show_clickable_nav: true
    };
    vocabTimeline.push(instructions_vocab)

    var imageDir = '/static/images/' //directory of images

    //presently Duolingo Irish lessons Basics 1 + 2

    currentVocabArray = jsPsych.randomization.shuffleNoRepeats(stimVocabArray[0]) // first image set

    currentVocabArray.forEach(function(eachVocab){
        var imageName = imageDir + eachVocab[0];
        var block_vocab = {
            type: 'html-keyboard-response',
            stimulus: "<img src=" + imageName + " height = 300></img>"+"<p> </p><p><div style='font-size:40px'>" + eachVocab[1].toUpperCase() + "</div></p>",
            choices: jsPsych.NO_KEYS,
            stimulus_duration: vocabPresTime*1000,//ms,1000,
            trial_duration: (vocabIntertrialTime+vocabPresTime)*1000,
            data: {
                vocab: eachVocab[1],
                image: eachVocab[0],
            },
        }
            vocabTimeline.push(block_vocab);

    })

    var instructions_vocabQuiz = {
      type: 'instructions',
      pages: ['<p>Ready to recall the words you learned on your travels? Please press Next > to show off your new language skills!</p>'],
      show_clickable_nav: true
     };
     vocabTimeline.push(instructions_vocabQuiz)


    var imageIdxLog = []; //keep track of images that have been displayed
    var imageRepCheck = false;

    for (var q = 0; q<numQuizQs; q++ ) {

        var randomIdxs =[];
        while(randomIdxs.length < numVocabOptions) {
            randomIdxs.push(Math.floor(Math.random()*(stimVocabArray[0].length)))
            randomIdxs = _.uniq(randomIdxs); //want a unique set of options
            };
        // if all the indexes in the array have already been displayed as images
        while(_.difference(randomIdxs, imageIdxLog).length === 0) {
            var randomIdxs =[];
            while(randomIdxs.length < numVocabOptions) { //then generate a new array until this is not the case (at least one new item)
                randomIdxs.push(Math.floor(Math.random()*(stimVocabArray[0].length)))
                randomIdxs = _.uniq(randomIdxs); //want a unique set of options
                };
        }

        // at least one novel index
        var imageIdx = randomIdxs[Math.floor(Math.random()*(randomIdxs.length))] //try generating index once

        while(_.contains(imageIdxLog,imageIdx)){ //but if image was already shown, generate unique idx
            imageIdx = randomIdxs[Math.floor(Math.random()*(randomIdxs.length))]
        }
        imageIdxLog.push(imageIdx); //push unique index to log of displayed images

        //second image set
        var imageOption = stimVocabArray[0][imageIdx][2]; // needs to match one of the random indexes; use to determine correct response
        var corrResp = stimVocabArray[0][imageIdx][3]; //also record correct response

        var options_vocab = [];
        for (var op = 0; op<randomIdxs.length; op++){
            options_vocab.push(stimVocabArray[0][randomIdxs[op]][1])
        }

        var quiz_vocab = {
          type: 'survey-multi-choice',
          questions: [{prompt: "<center> Match the following image to its word: <br /> <img src=" + imageDir + imageOption + " height = 200></img></center>", options: options_vocab, required:true}],
          data: {
                    task_name: 'immed_vocab_quiz',
                    vocab_options: options_vocab,
                    image_shown: imageOption,
                    correct_resp: corrResp,
                },
        };

        vocabTimeline.push(quiz_vocab)
    }


    return vocabTimeline
}
