var stimMovieArray = []; //create an array for movies

var movieTask = function() {

    var movieTimeline = [];

    var instructions_movie = {
      type: 'instructions',
      pages: ['<h1> Part II. Movie </h1> <br/><p> You will now watch a short video. After the video you will be prompted to recite out loud everything you remember in the video, and then answer some questions on what you watched. </p><p>Press the button to begin playing the video.</p>'],
        show_clickable_nav: true
    };
    movieTimeline.push(instructions_movie);

    for (var i = 0; i< movieNumber; i++){ //TODO: add randomization feature for movie stimuli
        var block_movie = {
           type: 'video',
           //sources: ['/static/video/Nature-Sunset.mp4'],
           sources: ['/static/video/' + movieArray[0][i][0]],
           //width: Math.round(window.innerWidth*0.8),
           //height: Math.round(window.innerHeight*0.8), //approximately X% of window
            start: movieArray[0][i][2], // time to start video
            stop: movieArray[0][i][3], //seconds
            height: 500,
            width: 880,
            //controls: true, //for debugging
        };
        movieTimeline.push(block_movie);

        var block_pre_movie_recall = {
            type: 'instructions',
            pages: ["<p> You will now recite aloud everything you remember seeing in the video. When you see the <i style='color:red' class='fa fa-microphone'></i> icon on the next page, please begin. You will have " + movieRecallSecs + " seconds to complete this recall. </p><p> Please remember to speak <strong>clearly</strong> about 1-2 feet from your computer.</p>"],
            show_clickable_nav: true,
        }

        movieTimeline.push(block_pre_movie_recall)


        var recall_movie = {
            type: 'free-recall',
            stimulus: "<p class='mic' style='position:absolute;top:35%;left:47%;font-size:10vw;color:red'><i class='fa fa-microphone blink_me' style='color:red'></i></p>",
            //list_number: movieNumber,
            stim_duration: movieRecallSecs * 1000,
            trial_duration: movieRecallSecs * 1000, // +  2000,
            record_audio: true,
            identifier: 'movie-' + movieNumber, //save file with task and number
            //speech_recognizer: 'google', //later functionality
            data: {
                movieFile: movieArray[0][i][0],
                movieContent: movieArray[0][i][1], //save description
            },
            //on_finish: function() {
                //console.log('Saving data...')
                /*if (mode === 'lab') {
                    psiTurk.saveData({
                        success: function() {
                            console.log('Data saved!')
                        }
                    })
                }*/
            //}
        }
         movieTimeline.push(recall_movie);

         //for(var q = 2; q < movieArray[0][i].length) { //assuming 3 qs for each movie

        //TODO: determine number of questions from length of array, use that to increment rather than hard-code

            var quiz_movie = {
              type: 'survey-multi-choice',
              preamble: 'Now answer the following questions on the movie you just viewed.',
              questions: [
                  {prompt: 'Have you seen this movie before?', options: ['Yes','No'], required: true },
                  {prompt: movieArray[0][i][4], options: movieArray[0][i][5].split(','), required:true}, {prompt: movieArray[0][i][6], options: movieArray[0][i][7].split(','), required: true},
                  {prompt: movieArray[0][i][8], options: movieArray[0][i][9].split(','), required: true},
              ],
            };
            movieTimeline.push(quiz_movie);

         //}
     }
  return movieTimeline ;
}
