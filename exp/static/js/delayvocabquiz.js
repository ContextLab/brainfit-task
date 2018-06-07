
var delayVocabQuizTask = function() {
    var delayVocabQuizTimeline = [];
    var instructions_vocab = {
      type: 'instructions',
      pages: ['<h1> Part VII. Delayed Vocabulary-Image Pair Questions </h1> <br/><p> We now would like you to recall the Irish language vocabulary pairs you learned earlier so we can examine whether fitness or recent exercise has influenced your ability to recall picture-word pairs.</p><p> Please press Next > to continue. </p>'],
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
          //console.log(randomIdxs)
          // if all the indexes in the array have already been displayed as images
          while(_.difference(randomIdxs, imageIdxLog).length === 0) {
              var randomIdxs =[];
              while(randomIdxs.length < numVocabOptions) { //then generate a new array until this is not the case (at least one new item)
                  randomIdxs.push(Math.floor(Math.random()*(stimVocabArray[0].length)))
                  randomIdxs = _.uniq(randomIdxs); //want a unique set of options
                  };
                  //console.log('innerloop')
          }

          //now shouldnt get stuck in this loop because at least one index will be novel
          var imageIdx = randomIdxs[Math.floor(Math.random()*(randomIdxs.length))] //try generating index once

          while(_.contains(imageIdxLog,imageIdx)){ //but if image was already shown, generate unique idx
              imageIdx = randomIdxs[Math.floor(Math.random()*(randomIdxs.length))]
          }
          imageIdxLog.push(imageIdx); //push unique index to log of displayed images
          //console.log(imageIdxLog)

          //NOTE: ADDED THIRD SET OF IMAGES HERE
          var imageOption = stimVocabArray[0][imageIdx][4]; // needs to match one of the random indexes; use to determine correct response
          var corrResp = stimVocabArray[0][imageIdx][5]; //also record correct response

          var options_vocab = [];
          for (var op = 0; op<randomIdxs.length; op++){
              options_vocab.push(stimVocabArray[0][randomIdxs[op]][1])
          }

          var imageDir = '/static/images/' //directory of images
          var quiz_vocab = {
            type: 'survey-multi-choice',
            questions: [{prompt: "<center> What is the word associated with: <br /> <img src=" + imageDir + imageOption + " height = 200></img></center>", options: options_vocab, required:true}],
            data: {
                      vocab_options: options_vocab,
                      image_shown: imageOption,
                      correct_resp: corrResp,
                  },
          };

          delayVocabQuizTimeline.push(quiz_vocab)
          //console.log(quiz_vocab.responses)
      }

      return delayVocabQuizTimeline
    }
