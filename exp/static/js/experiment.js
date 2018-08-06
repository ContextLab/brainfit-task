var experimentTimeline = []; //create the jsPsych experimentTimeline variable
var stimArray = [];
var stimVocabArray = [];
var stimMovieArray = [];
var stimSpatialArray = [];

var fscreen = true; //toggle fullscreen, otherwise will resize to % of screen size
var fitbitSuccess = false; //don't initially have users' fitbit data so will be false

var runExperiment = function (trials, options) {
    stimArray = trials[0];
    vocabArray = trials[1];
    movieArray = trials[2];
    spatialArray = trials[3];

////////////////////////////////////////////////////////////////////////////////
// INSTRUCTIONS AND SCREENING QUESTIONS ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//record start date and time of experiment to associate with fitbit data
var getDateTime = {
    type: 'datetime',
};

experimentTimeline.push(getDateTime)

//in case exit fullscreen, have a default large screen size
window.resizeTo(Math.round(window.screen.availWidth*0.8), Math.round(window.screen.availHeight*0.95));

/* //uncomment if running in lab, set participant ID and experimenter ID
if(mode == 'lab'){ //from config.js

    var subjectID = {
        type: 'survey-text',
        questions: [{prompt: "Subject ID: ", value: 'BFM-1.0-MMDDYY-SN', rows: 1, columns: 20}, {prompt: "Experimenter Initials: ", value: ' ',rows: 1, columns: 7},],
    };
    experimentTimeline.push(subjectID)
}*/

var instructions_main = {
    type: 'instructions',
    pages: ["<h1> Thank you for joining our study! </h1>"+
    "<p>You may already know that exercise is good for your health-- but did you also know that exercise is good for your brain? Us researchers at the Contextual Dynamics Lab at Dartmouth College are interested in studying how exercise can help our brains function better, and we need your help!</p><p>On the next screens, we'll ask you to provide access to your Fitbit data from the past year.  The information you provide us will be anonymous (not associated with your name, precise location, or other information that could be used to personally identify you) and kept private.  Then we will ask you some survey questions to learn a bit more about you.  Finally, we'll ask you to play some short memory games to help get a sense of how you learn and remember different types of information.  Ultimately we want to know whether people who do particular types of exercise are better (or worse) at different types of memory tasks.</p>"+
    "<p>The entire HIT should take you approximately 45 minutes.  If you're ready to proceed, please press 'Next >' to continue to the Fitbit data authorization page.</p>", ],
    show_clickable_nav: true
};
experimentTimeline.push(instructions_main);

// create initial fitbit timeline as early exclusion (if don't authorize data)
w = false;
w.fitbitSuccess = false; //initialize as false since wont have data immediately

var check_fitbit = function(elem) {
    if (($('#fitbit_checkbox').is(':checked'))& (w.fitbitSuccess)) { //have boolean flag to confirm if data authorized
          return true;
      }
        else {
          alert("If you wish to participate, you must provide access to your Fitbit data and check the box confirming this authorization.");
          return false;
        }
};

var block_fitbit = {
    type: 'external-html',
    url: '/fitbit.html',
    cont_btn: 'start',
    check_fn: check_fitbit,
}
experimentTimeline.push(block_fitbit);

//now can make fullscreen once fitbit data provided (otherwise popup will disrupt authorization process)
if(fscreen) {
  //fullscreen mode
  experimentTimeline.push({
    type: 'fullscreen',
    message: '<p>We’d like you to really focus on this HIT so that we can collect clean data. Please turn off any music (but keep your volume turned on), close any additional open tabs in your browser (or any other open programs), remove any distractions around you (e.g. phone), and make yourself comfortable. When you are ready, please press the following button to switch your browser to fullscreen mode. (Your browser will remain in fullscreen for the duration of the HIT.  If you need to exit the HIT early, you may press ESCAPE (esc) to exit fullscreen mode and return your browser back to normal.</p>',
    button_label: 'Enter fullscreen mode',
    fullscreen_mode: true
   });
  }

////////////////////////////////////////////////////////////////////////////////
// SURVEY Q'S //////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  var screeningTimeline = screeningPages();
    screeningTimeline.forEach(function(screeningPage) {
          experimentTimeline.push(screeningPage)
          //console.log('skipped screening')
  });

////////////////////////////////////////////////////////////////////////////////
// PART I. WORD LIST FREE RECALL TASK //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  var wordListTimeline = wordListTask();
    wordListTimeline.forEach(function(wordListPage) {
      experimentTimeline.push(wordListPage)
  });

////////////////////////////////////////////////////////////////////////////////
// PART II. MOVIE //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  var movieTimeline = movieTask();
    movieTimeline.forEach(function(moviePage) {
        experimentTimeline.push(moviePage)
    });

////////////////////////////////////////////////////////////////////////////////
// PART III. VOCABULARY-IMAGE PAIRS ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  var vocabTimeline = vocabTask();
    vocabTimeline.forEach(function(vocabPage) {
        experimentTimeline.push(vocabPage)
    });

////////////////////////////////////////////////////////////////////////////////
// PART IV. SPATIAL TASK ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  var spatialTimeline = spatialTask();
      spatialTimeline.forEach(function(spatialPage) {
          experimentTimeline.push(spatialPage)
      });

////////////////////////////////////////////////////////////////////////////////
// PART V. DELAYED WORD FREE RECALL ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  var delayRecallTimeline = delayRecallTask();
      delayRecallTimeline.forEach(function(delayRecallPage) {
          experimentTimeline.push(delayRecallPage)
      });

////////////////////////////////////////////////////////////////////////////////
// PART VI. DELAYED MOVIE RECALL ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  var delayRecallMovieTimeline = delayRecallMovieTask();
      delayRecallMovieTimeline.forEach(function(delayRecallMoviePage) {
          experimentTimeline.push(delayRecallMoviePage)
      });

////////////////////////////////////////////////////////////////////////////////
// PART VII. DELAYED VOCAB QUIZ ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  var delayVocabQuizTimeline = delayVocabQuizTask();
      delayVocabQuizTimeline.forEach(function(delayVocabQuizPage) {
          experimentTimeline.push(delayVocabQuizPage)
      });

////////////////////////////////////////////////////////////////////////////////
// POST-SURVEY /////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  //get feedback on experiment

  var postSurveyTimeline = postSurveyTask();
      postSurveyTimeline.forEach(function(postSurveyTaskPage) {
          experimentTimeline.push(postSurveyTaskPage)
      });

////////////////////////////////////////////////////////////////////////////////
// DEBRIEFING & WRAPUP /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

  //debriefing

  var block_debrief = {
      type: "instructions",
      pages: ["<h2>Debriefing</h2>" +
      "<p>Thank you for contributing to research in LABORATORY (http://www.YOURLABWEBSITE.com/) at UNIVERSITY!</p>" +
      "<p>You will receive a base payment of $AMOUNT for your participation in the task, along with a performance-based bonus (up to $AMOUNT) that will be computed upon submission of this HIT.</p>" +
      "<p>Our lab is interested in ...  </p>" +
      "<p>We've taken great care to design this task appropriately for Amazon Mechanical Turk and your enjoyment as a Worker, and securely store your data on our servers without any personally-identifiable information. If for any reason you would like to contact us to ask further questions or comment on this experiment, please call the LABORATORY at (###) ###-#### during normal business hours (9 — 5 PM, Monday — Friday), or send an email to YOURLABEMAIL@someemailsite.com with the title 'AMT Experiment Inquiry'. If you have questions, concerns, complaints, or suggestions about human research at UNIVERSITY, you may call IRB ORGANIZATION AT UNIVERSITY at (###) ###-####. Otherwise, thank you for your contributions to scientific research and enjoy your day! </p>"],
      show_clickable_nav: true,
  }
  experimentTimeline.push(block_debrief)

/*start experiment*/
jsPsych.init({
    timeline: experimentTimeline,
    show_progress_bar: false,
    on_data_update: function(data) {
          psiTurk.recordTrialData(data)
            },
    on_finish: function() {
        console.log('Saving data...')

        //define functions to use below (modified from https://github.com/NYUCCL/psiTurk/blob/master/psiturk/example/static/js/task.js)
        var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

        prompt_resubmit = function() {
          document.body.innerHTML = error_message;
          $("#resubmit").click(resubmit);
        }

        resubmit = function() {
          document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
          reprompt = setTimeout(prompt_resubmit, 10000);
          psiTurk.saveData({
            success: function() {
                clearInterval(reprompt);
                      psiTurk.computeBonus('compute_bonus', function(){
                        psiTurk.completeHIT(); // when finished saving, compute bonus, then quit
                      });
            },
            error: prompt_resubmit //if error saving data, try again
          });
        };

          psiTurk.saveData({
              success: function() {
                  console.log('Data saved!')
                   psiTurk.computeBonus('compute_bonus', function(){
                     psiTurk.completeHIT();
                })
              },
              error: prompt_resubmit}) //if error saving data, try again
      //}
    },
});
}
