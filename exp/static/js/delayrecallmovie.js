var delayRecallMovieTask = function() {
    var delayRecallMovieTimeline = [];
    var instr_delayRecall_movie = {
        type: 'instructions',
        pages: ["<h1> Part VI. Delayed Movie Recall </h1> <p> You will now recall what you remember seeing in the short movie you viewed earlier.</p> <p> When you see the prompt on the next page, please type what you recall from this video. You will have " + delayMovieRecallSecs + " seconds to complete this recall. </p><p> Please remember to speak <strong>clearly</strong> about 1-2 feet from your computer.</p>"],
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
         recall_time: delayMovieRecallSecs, //seconds, converted to ms within the plugin
         questions: [{prompt: '<b>Please type sentences of what you remember happening in the video you watched earlier. <p>Press Enter/Return or a period to submit each sentence.</p><p>(NOTE: the sentence will disappear once submitted and the screen will progress once time has run out)</p> </b>', value: '', recall_mode: 'narrative'}]
     }

     delayRecallMovieTimeline.push(delayRecall_movie);

     return delayRecallMovieTimeline;

}
