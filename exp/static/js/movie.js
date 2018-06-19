var stimMovieArray = []; //create an array for movies

var movieTask = function() {

    var movieTimeline = [];

    var instructions_movie = {
      type: 'instructions',
      pages: ["<h1> Part II. Story memory </h1><p>In this next game, you'll be like Sherlock Holmes, trying to remember as much detail as possible from an animated story narration. We’ll first show you the video, and your job is just to pay attention and try to absorb as much information as you can. When the video ends, we’ll test your memory in two ways. First we’ll have you write down (in sentence form) as much as you can remember from the movie in " + (movieRecallSecs/60) + "minutes.  Then we’ll ask you some multiple choice questions about the story. Before we start, let’s check to make sure your speakers are on and are adjusted to a comfortable volume. </p>"],
      show_clickable_nav: true
    };
    movieTimeline.push(instructions_movie);

    var soundcheck_movie = {
      type: "instructions",
      pages: ["<h2>Speaker adjustment</h2><p>Click the button to play the following sound clip:</p>" +
      "<audio id='soundTest' src='static/files/furelise.mp3' preload='auto'></audio>" +
      "<button style='background-color:white; outline:none' class='btn btn-large' onclick='document.getElementById(" + '"soundTest"' + ").play();'><i class='fa fa-play-circle-o fa-5x'></i></button>" +
      "<p>Take this time to adjust your speaker or headphone volume to a comfortable level. Continue to the next screen once you are ready.</p>"],
      show_clickable_nav: true,
      button_label_next: 'Sounds good!'
    }
    movieTimeline.push(soundcheck_movie);

    var postsoundcheck_movie = {
      type: 'instructions',
      pages: ["<p>Great! Thanks for adjusting those speakers for us. Ready to start the story?</p>"],
      show_clickable_nav: true,
      button_label_next: 'Tell me a story!'
    }
    movieTimeline.push(postsoundcheck_movie);

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
        movieTimeline.push(block_movie);

        /*var block_pre_movie_recall = {
            type: 'instructions',
            pages: ["<p> You will now describe what you remember from the video. A prompt will appear on the next page to record your responses, and you will submit each sentence with either the Enter/Return key or the period key. You will have " + movieRecallSecs + " seconds to complete this recall. If you finish the recall prior to this time, please wait for the continue button to appear at the bottom of the screen, or for the page to automatically redirect. </p>"],
            show_clickable_nav: true,
        }*/

        //movieTimeline.push(block_pre_movie_recall)

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
             questions: [{prompt: "<p>Ok Sherlock-- please tell us anything you remember about what happened in the video you just watched! Each time you type out a full sentence, it will be submitted to our server and you won’t be able to edit it further. It may help to take a few moments to think about how you want to frame your narrative before you start typing. You’ll have " + movieRecallSecs/60 +
             " minutes to type out your responses before the screen continues. Good luck! (And like with the word list game, you should continue to try hard throughout the " + (movieRecallSecs/60) + " minutes, even if it feels like you can’t remember anything else.)</p><br/><p><b>Type enter/return or '.' to submit each sentence.</b></p>", value: '', recall_mode: 'narrative'}],
             data: {
                      task_name: 'immed_movie_recall',
             }
          }

         movieTimeline.push(recall_movie);

         //page inbetween
         var instructions_movie_q = {
           type: 'instructions',
           pages: ['Now let’s see more of your detective abilities! Please answer a few questions on the story you just heard.'],
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
            data: {
                      task_name: 'immed_movie_quiz',
                  },
          };
          movieTimeline.push(quiz_movie);

     }
  return movieTimeline ;
}
