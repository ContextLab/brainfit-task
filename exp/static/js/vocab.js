var stimVocabArray = []; //create an array for vocab
//var currentListVocab = [];
var vocabTask = function() {

    var vocabTimeline = [];
    var instructions_vocab = {
      type: 'instructions',
      pages: ['<h1> Part III. Vocabulary-Image Pairs </h1> <br/><p> Now you will learn some Irish language vocabulary through image pairings.</p><p>You will be asked to match these vocabulary words to their respective images after the presentation. </p> <p> Please press Next > to continue. </p>'],
      show_clickable_nav: true
    };
    vocabTimeline.push(instructions_vocab)

         
    var imageDir = '/static/images/' //directory of images
    //presently Duolingo Irish lessons Basics 1 + 2
    
    //for (var r = 0; r < vocabReps; r++){
        currentVocabArray = jsPsych.randomization.shuffleNoRepeats(stimVocabArray[0]) //issue with file output**
        console.log(currentVocabArray);
        //vocabData.listWords.push([]);

        currentVocabArray.forEach(function(eachVocab){
            //console.log(eachVocab[0]) //image
            //console.log(eachVocab[1]) //word
            var imageName = imageDir + eachVocab[0]; //change movie above to match this ***
            var block_vocab = {
                type: 'html-keyboard-response',
                stimulus: "<img src=" + imageName + " height = 300></img>"+"<p> </p><p><div style='font-size:40px'>" + eachVocab[1].toUpperCase() + "</div></p>",
                //prompt: "<div style='font-size:36px'>" + eachVocab[1] + "</div>",
                choices: jsPsych.NO_KEYS,
                stimulus_duration: vocabPresTime*1000,//ms,1000,
                trial_duration: (vocabIntertrialTime+vocabPresTime)*1000,//ms, 1500, //stim dur + isi dur
                data: {
                    //listNumber: listNumber,
                    vocab: eachVocab[1],
                    image: eachVocab[0],
                    //trialNumber: ,
                },
                on_finish: function() {
                //currentListVocab.push(currentVocabArray[0][currentTrialNumber][0].text) //fix
                }
            }
                vocabTimeline.push(block_vocab);

        })
    //}
        //now prep quiz
    var randomVocabArray = stimVocabArray; //take random set of stimulus array for quiz
    //var numQuizQs = vocabNumber; // number of quiz questions to give users - currently equal to number vocab words
    var numVocabOptions = 4; // number of options for quiz q's
    var imageIdxLog = []; //keep track of images that have been displayed
         
    for (var q = 0; q<vocabNumber; q++ ) { 
        //use underscore library to generate random indexes for selecting vocab options
        var randomIdxs =[]; while(randomIdxs.length < numVocabOptions) {
            randomIdxs.push(Math.floor(Math.random()*stimVocabArray[0].length))
            randomIdxs = _.uniq(randomIdxs); //want a unique set of options
            };

        //start function, need to also have unique set of image indexes so not repeating questions
        var imageIdx = randomIdxs[Math.floor(Math.random()*randomIdxs.length)] //try generating index once
        while(_.contains(imageIdxLog,imageIdx)){ //but if image was already shown, generate unique idx
            imageIdx = randomIdxs[Math.floor(Math.random()*randomIdxs.length)]
        }  
        imageIdxLog.push(imageIdx); //push unique index to log of displayed images    
        var imageOption = stimVocabArray[0][imageIdx][0]; // needs to match one of the random indexes; use to determine correct response
        var corrResp = stimVocabArray[0][imageIdx][1]; //also record correct response

        var options_vocab_1 = [];
        for (var op = 0; op<randomIdxs.length; op++){
            options_vocab_1.push(stimVocabArray[0][randomIdxs[op]][1])
        }

        var quiz_vocab = {
          type: 'survey-multi-choice',
          questions: [{prompt: "<center> What is the word associated with: <br /> <img src=" + imageDir+ imageOption + " height = 200></img></center>", options: options_vocab_1, required:true}],
          data: {
                    vocab_options: options_vocab_1,
                    image_shown: imageOption,
                    correct_resp: corrResp,
                },
        };
        
        vocabTimeline.push(quiz_vocab)
        //console.log(quiz_vocab.responses)
    }

    
    return vocabTimeline
}