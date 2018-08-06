var delayRecallMovieTask = function() {
    var delayRecallMovieTimeline = [];
    var instr_delayRecall_movie = {
        type: 'instructions',
        pages: ["<h1> Part VI. Delayed story memory </h1> <p>Remember the animated story you watched earlier? We now would like you to show off your Sherlock skills again and recall what you remember happening in this story! When you see the prompt on the next page, please tell us anything you remember about what happened in the video you watched earlier. Each time you type out a full sentence, it will be submitted to our server and you won’t be able to edit it further. It may help to take a few moments to think about how you want to frame your narrative before you start typing." +
        "You’ll have " + movieRecallSecs/60 + " minutes to type out your responses before the screen continues. Good luck! (And like with the word list game, you should continue to try hard throughout the " + (movieRecallSecs/60) + " minutes, even if it feels like you can’t remember anything else. If you are certain you are done recalling, a the 'Continue' button will become clickable after " + movieRecallButton/60 + " minutes.)</p></p>"],
        show_clickable_nav: true,
    }
    delayRecallMovieTimeline.push(instr_delayRecall_movie)

     var delayRecall_movie = {
           type: 'survey-text-custom',
           recall_time: movieRecallSecs, //in seconds, converted to ms within the plugin
           button_appear_time: movieRecallButton, //in seconds, less than movieRecallSecs
           questions: [{prompt: "The timer has started! Please recall the story in the box below within the next " + (movieRecallSecs/60) + " minutes.<br/><p>Type enter/return, '.', '!', or '?' to submit each sentence.</p>", value: '', recall_mode: 'narrative'}],
           data: {
                    task_name: 'delayed_movie_recall',
           }
       }

     delayRecallMovieTimeline.push(delayRecall_movie);

     var block_delaymovierecall_timeup = {
       type: 'instructions',
       pages: ["<h3>Time's up!</h3><p>Thanks for recalling all of that! Click the button to continue to the next section.</p>"],
       show_clickable_nav: true,
     }
     delayRecallMovieTimeline.push(block_delaymovierecall_timeup)

     return delayRecallMovieTimeline;

}
