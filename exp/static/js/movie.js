var stimMovieArray = []; //create an array for movies

var movieTask = function() {

    var movieTimeline = [];

    var instructions_movie = {
      type: 'instructions',
      pages: ['<h1> Part II. Movie </h1> <br/><p> Now you will now watch an illustrated StoryCorps video so we can measure how well you recall a narrative. After the video you will be prompted to recall everything you remember from the video through typing sentences, and then answer some questions on what you watched. </p><p><b>NOTE: </b>Please make sure your volume is turned on for this section.</p><p>Press the button to begin playing the video.</p>'],
      show_clickable_nav: true
    };
    movieTimeline.push(instructions_movie); //debug

    for (var i = 0; i< movieNumber; i++){ //TODO: add randomization feature for movie stimuli
        var block_movie = {
           type: 'video',
           //sources: ['/static/video/Nature-Sunset.mp4'],
           sources: ['/static/video/' + movieArray[0][i][0]],
           //width: Math.round(window.innerWidth*0.8),
           //height: Math.round(window.innerHeight*0.8), //approximately X% of window
            //start: movieArray[0][i][2], // time to start video
            //stop: movieArray[0][i][3], //seconds
            height: 500,
            width: 880,
            //controls: true, //for debugging
        };
        movieTimeline.push(block_movie); //debug

        var block_pre_movie_recall = {
            type: 'instructions',
            pages: ["<p> You will now type sentences describing what you remember from the video. A prompt will appear on the next page to record your responses, and you will submit each sentence with either the Enter/Return key or the period key. You will have " + movieRecallSecs + " seconds to complete this recall. If you finish the recall prior to this time, please wait for the continue button to appear at the bottom of the screen, or for the page to automatically redirect. </p>"],
            show_clickable_nav: true,
        }

        movieTimeline.push(block_pre_movie_recall)

        // AUDIO
        // var recall_movie = {
        //     type: 'free-recall',
        //     stimulus: "<p class='mic' style='position:absolute;top:35%;left:47%;font-size:10vw;color:red'><i class='fa fa-microphone blink_me' style='color:red'></i></p>",
        //     //list_number: movieNumber,
        //     stim_duration: movieRecallSecs * 1000,
        //     trial_duration: movieRecallSecs * 1000, // +  2000,
        //     record_audio: true,
        //     identifier: 'movie-' + movieNumber, //save file with task and number
        //     //speech_recognizer: 'google', //later functionality
        //     data: {
        //         movieFile: movieArray[0][i][0],
        //         movieContent: movieArray[0][i][1], //save description
        //     },
        //     //on_finish: function() {
        //         //console.log('Saving data...')
        //         /*if (mode === 'lab') {
        //             psiTurk.saveData({
        //                 success: function() {
        //                     console.log('Data saved!')
        //                 }
        //             })
        //         }*/
        //     //}
        // }

         var recall_movie = {
             type: 'survey-text-custom',
             recall_time: movieRecallSecs, //in seconds, converted to ms within the plugin
             button_appear_time: movieRecallButton, //in seconds, less than movieRecallSecs
             questions: [{prompt: 'Please type what you remember happening in the video you just watched, in the form of sentences. \
             <p>Press Enter/Return or a period to submit each sentence.</p><p> \
             <p><b>NOTE:</b> The sentences will disappear once submitted. This text entry screen will continue after ' + movieRecallSecs + ' seconds, \
             regardless of how many sentences you recall. Please try hard to remember the movie, even if you think your memory has been exhausted. If you cannot remember anything else from the video, a button will appear after '+ movieRecallButton + ' seconds for you to continue to the next section. </p>', value: '', recall_mode: 'narrative'}]
          }

         movieTimeline.push(recall_movie);

         //page inbetween
         var instructions_movie_q = {
           type: 'instructions',
           pages: ['Now you will answer some questions on the movie you just viewed.<p>Press the Next button to continue.</p>'],
           show_clickable_nav: true
         }
         movieTimeline.push(instructions_movie_q)

        //create array of questions from length of csv file row
        var numBeginningVals = 4 //number corresponding to non-question columns before questions start
        qArray = [{prompt: 'Have you seen this movie before?', options: ['Yes','No'], required: true }] //initial question
        //create array of prompts for survey-multi-choice with loop
        for (var q = numBeginningVals; q < (movieArray[0][i].length) ; q += 2 ){ //exclude first 4 since descriptors, increment evey other since ordered question, response, question, response
          nextQ = {prompt: movieArray[0][i][q], options: movieArray[0][i][q+1].split(','), required:true}
          qArray.push(nextQ) //add this new question value to the array
        }


          var quiz_movie = {
            type: 'survey-multi-choice',
            questions: qArray,
          };
          movieTimeline.push(quiz_movie);

     }
  return movieTimeline ;
}
