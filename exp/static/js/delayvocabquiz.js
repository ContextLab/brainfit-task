
var delayVocabQuizTask = function() {
    var delayVocabQuizTimeline = [];
    var instructions_vocab = {
      type: 'instructions',
      pages: ['<h1> Part VII. Delayed travel flashcards quiz </h1> <br/><p>Let’s recall some of the vocabulary we learned earlier on our trip to Ireland! As before, select the vocabulary word that matches with the presented image meaning. Please press Next > to continue.</p>'],
      show_clickable_nav: true
    };
    delayVocabQuizTimeline.push(instructions_vocab)

    imageIdxLog = [];
      for (var q = 0; q<numQuizQs; q++ ) {

          // choose a random index out of all possible choices
          //use underscore library to generate random indexes for selecting vocab options

          var randomIdxs =[];
          while(randomIdxs.length < numVocabOptions) {
              randomIdxs.push(Math.floor(Math.random()*(stimVocabArray[0].length)))
              randomIdxs = _.uniq(randomIdxs); //want a unique set of options
              };

          // if all the indexes in the array have already been displayed as images
          while(_.difference(randomIdxs, imageIdxLog).length === 0) {
              var randomIdxs =[];
              while(randomIdxs.length < numVocabOptions) { // then generate a new array until this is not the case (at least one new item)
                  randomIdxs.push(Math.floor(Math.random()*(stimVocabArray[0].length)))
                  randomIdxs = _.uniq(randomIdxs); // want a unique set of options
                  };
          }

          //need at least one index to be novel
          var imageIdx = randomIdxs[Math.floor(Math.random()*(randomIdxs.length))]

          while(_.contains(imageIdxLog,imageIdx)){ //but if image was already shown, generate unique idx
              imageIdx = randomIdxs[Math.floor(Math.random()*(randomIdxs.length))]
          }
          imageIdxLog.push(imageIdx); //push unique index to log of displayed images

          var imageOption = stimVocabArray[0][imageIdx][4]; // needs to match one of the random indexes; use to determine correct response
          var corrResp = stimVocabArray[0][imageIdx][5]; //also record correct response

          var options_vocab = [];
          for (var op = 0; op<randomIdxs.length; op++){
              options_vocab.push(stimVocabArray[0][randomIdxs[op]][1])
          }

          var imageDir = '/static/images/' //directory of images
          var quiz_vocab = {
            type: 'survey-multi-choice',
            questions: [{prompt: "<center>Match the following image to its word:<br /> <img src=" + imageDir + imageOption + " height = 200></img></center>", options: options_vocab, required:true}],
            data: {
                      task_name: 'delayed_vocab_quiz',
                      vocab_options: options_vocab,
                      image_shown: imageOption,
                      correct_resp: corrResp,
                  },
          };

          delayVocabQuizTimeline.push(quiz_vocab)
      }

      return delayVocabQuizTimeline
    }
