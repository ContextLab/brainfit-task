var stimMovieArray = []; //create an array for movies

var movieTask = function() {

    var movieTimeline = [];

    var instructions_movie = {
      type: 'instructions',
      pages: ["<h1> Part II. Story memory </h1><p>In this next game, you'll be like Sherlock Holmes, trying to remember as much detail as possible from an animated story narration. We’ll first show you the video, and your job is just to pay attention and try to absorb as much information as you can. When the video ends, we’ll test your memory in two ways.</p>" +
      "<p>First, we’ll have you write down (in sentence form) as much as you can remember from the movie in " + (movieRecallSecs/60) + " minutes. Each time you type out a full sentence, it will be submitted to our server and you won’t be able to edit it further. It may help to take a few moments to think about how you want to frame your narrative before you start typing (And like with the word list game, you should continue to try hard throughout the " + (movieRecallSecs/60) + " minutes, even if it feels like you can’t remember anything else. If you are certain you are done recalling, a the 'Continue' button will become clickable after " + movieRecallButton/60 + " minutes.) Then, we’ll ask you some multiple choice questions about the story. Before we start, let’s check to make sure your speakers are on (or headphones are plugged in) and are adjusted to a comfortable volume. </p>"],
      show_clickable_nav: true,
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

    for (var i = 0; i< movieNumber; i++){ // select movies in order
        var block_movie = {
           type: 'video',
           sources: ['/static/video/' + movieArray[0][i][0]],
            height: 500,
            width: 880,
        };
        movieTimeline.push(block_movie);

         var recall_movie = {
             type: 'survey-text-custom',
             recall_time: movieRecallSecs, //in seconds, converted to ms within the plugin
             button_appear_time: movieRecallButton, //in seconds, less than movieRecallSecs
             questions: [{prompt: "<p>Ok Sherlock-- the timer has started! Please tell us anything you remember about what happened in the video you just watched within the next " + (movieRecallSecs/60) + " minutes.</p><br/>" +
             "<p>Type enter/return, '.', '!', or '?' to submit each sentence.</p>", value: '', recall_mode: 'narrative'}],
             data: {
                      task_name: 'immed_movie_recall',
             }
          }

         movieTimeline.push(recall_movie);

         //page in between
         var instructions_movie_q = {
           type: 'instructions',
           pages: ["<h3>Time's up!</h3><p>Awesome job! Now let’s see more of your detective abilities. Please answer a few questions on the story you just heard."],
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
