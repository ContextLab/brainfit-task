var delayRecallMovieTask = function() {
    var delayRecallMovieTimeline = [];
    var instr_delayRecall_movie = {
        type: 'instructions',
        pages: ["<h1> Part VI. Delayed Movie Recall </h1> <p> We now would like you to recall what you remember seeing in the short movie you watched earlier. This will help us understand how fitness and recent exercise may influence delayed memory for stories or narratives. </p> <p> When you see the prompt on the next page, please type sentences of what you recall from this video. You will have " + movieRecallSecs + " seconds to complete this section. </p>"],
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
           questions: [{prompt: 'Please type what you remember happening in the video you watched earlier, in the form of sentences. \
           <p>Press Enter/Return or a period to submit each sentence.</p><p> \
           <p><b>NOTE:</b> The sentences will disappear once submitted. This text entry screen will continue after ' + movieRecallSecs + ' seconds, \
           regardless of how many sentences you recall. Please try hard to remember the movie, even if you think your memory has been exhausted. If you cannot remember anything else from the video, a button will appear after '+ movieRecallButton + ' seconds for you to continue to the next section.</p>', value: '', recall_mode: 'narrative'}]
       }

     delayRecallMovieTimeline.push(delayRecall_movie);

     return delayRecallMovieTimeline;

}
