var delayRecallMovieTask = function() {
    var delayRecallMovieTimeline = [];
    var instr_delayRecall_movie = {
        type: 'instructions',
        pages: ["<h1> Part VI. Delayed story memory </h1> <p>Remember the animated story you watched earlier? We now would like you to show off your Sherlock skills again and recall what you remember happening in this story. When you see the prompt on the next page, please type sentences of what you recall from this video. You will have " + movieRecallSecs/60 + " minutes to complete this section.</p>"],
        show_clickable_nav: true,
    }
    delayRecallMovieTimeline.push(instr_delayRecall_movie)

    //AUDIO
    // var delayRecall_movie = {
    //     type: 'free-recall',
    //     stimulus: "<p class='mic' style='position:absolute;top:35%;left:47%;font-size:10vw;color:red'><i class='fa fa-microphone blink_me' style='color:red'></i></p>",
    //     stim_duration: delayMovieRecallSecs * 1000,
    //     trial_duration: delayMovieRecallSecs * 1000, // +  2000,
    //     record_audio: true,
    //     identifier: 'delaymovie-' + 1,//movieNumber, //save file with task and number
    //     //data: {
    //     //    movieFile: movieArray[0][0][0], //assuming only one movie
    //     //    movieContent: movieArray[0][0][1], //save description
    //     //},
    //   }

     var delayRecall_movie = {
           type: 'survey-text-custom',
           recall_time: movieRecallSecs, //in seconds, converted to ms within the plugin
           button_appear_time: movieRecallButton, //in seconds, less than movieRecallSecs
           questions: [{prompt: "Please tell us anything you remember about what happened in the video you watched earlier! Each time you type out a full sentence, it will be submitted to our server and you won’t be able to edit it further. It may help to take a few moments to think about how you want to frame your narrative before you start typing. You’ll have " + movieRecallSecs/60 +
           " minutes to type out your responses before the screen continues. Good luck! (And like with the word list game, you should continue to try hard throughout the " + (movieRecallSecs/60) + " minutes, even if it feels like you can’t remember anything else.)</p><br/><p><b>Type enter/return or '.' to submit each sentence.</b></p>", value: '', recall_mode: 'narrative'}],
           data: {
                    task_name: 'delayed_movie_recall',
           }
       }

     delayRecallMovieTimeline.push(delayRecall_movie);

     return delayRecallMovieTimeline;

}
