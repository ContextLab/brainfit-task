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

//innerWidth and innerHeight

//in case exit fullscreen, have a default large screen size
window.resizeTo(Math.round(window.screen.availWidth*0.8), Math.round(window.screen.availHeight*0.95));

/* //uncomment if running in lab
if(mode == 'lab'){

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

// create initial fitbit timeline as early exclusion (if dont authorize data)
w = false;
w.fitbitSuccess = false; //initialize as false since wont have data immediately

var check_fitbit = function(elem) {
    if (($('#fitbit_checkbox').is(':checked'))& (w.fitbitSuccess)) { //have boolean flag to confirm if data authorized
          return true; // also add condition for returned
      }
        else {
          alert("If you wish to participate, you must provide access to your Fitbit data and check the box confirming this authorization.");
          return false;
        }
    //return false;
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
// WORD LIST FREE RECALL PRACTICE //////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//NOTE: only include if recording audio (presently only in-lab tasks)
/*
   var wordListPracticeTimeline = wordListPractice();
        wordListPracticeTimeline.forEach(function(wordListPracticePage) {
            experimentTimeline.push(wordListPracticePage)
        });
//} // only run screening, fullscreen, and word list practice if in lab mode
*/
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
// STRESS AND ANXIETY SURVEY ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//if we want to have a stress-related component, here's a GAD survey (not included currently)

// options_stress_survey = ['Not at all', 'Several days','Over half the days','Nearly every day','Prefer not to answer']
//
// var stress_survey = {
//     type: 'survey-multi-choice',
//     preamble: 'Lastly, we want to interpret our results with respect to your self-reported stress levels. Over the last 2 weeks, how often have you been bothered by the following problems?',
//     questions: [{prompt: '<b>Feeling nervous, anxious, or on edge?</b>', options: options_stress_survey, required:true,},
//                {prompt: '<b>Not being able to stop or control worrying?</b>', options: options_stress_survey, required:true,},
//                {prompt: '<b>Worrying too much about different things?</b>', options: options_stress_survey, required:true,},
//                {prompt: "<b>Trouble relaxing?</b>", options:options_stress_survey,required:true,},
//                {prompt: "<b>Being so restless that it's hard to sit still?</b>", options:options_stress_survey,required:true,},
//                {prompt: '<b>Becoming easily annoyed or irritable?</b>', options:options_stress_survey, required:true},
//                {prompt: '<b>Feeling afraid as if something awful might happen</b>', options:options_stress_survey, required:true},]
//
//     };
//experimentTimeline.push(stress_survey);

////////////////////////////////////////////////////////////////////////////////
// POST-SURVEY /////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//get feedback on task design

var postSurveyTimeline = postSurveyTask();
    postSurveyTimeline.forEach(function(postSurveyTaskPage) {
        experimentTimeline.push(postSurveyTaskPage)
    });


////////////////////////////////////////////////////////////////////////////////
// DEBRIEFING & WRAPUP /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//need to save data

var block_debrief = {
    type: "instructions",
    pages: ["<h1>Thank you for participating in this study!</h1> <p> Press Next to complete the task and view the debriefing page. </p>"],
    show_clickable_nav: true,
}
experimentTimeline.push(block_debrief)


/*start experiment*/
jsPsych.init({
    timeline: experimentTimeline,
    ///exclusions: {
       // min_width: 900,
        //min_height: 900,
        //audio: true,
    //},
    show_progress_bar: false,
    on_data_update: function(data) {
            //if (mode == 'lab' || mode == 'mturk'){
          psiTurk.recordTrialData(data) //jsPsych.data.getLastTrialData()); //data
              //psiTurk.saveData();
            //  }
            },
    on_finish: function() {
        //experimentTimeline.push(block_debrief)
        //console.log(jsPsych.totalTime()); // see time elapsed
        //jsPsych.data.displayData(); //for debugging
        //jsPsych.data.get().localSave('csv',uniqueId+'_data.csv'); //save locally for now
        console.log('Saving data...')

        //define functions to use below (from https://github.com/NYUCCL/psiTurk/blob/master/psiturk/example/static/js/task.js)
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


        //if (mode === 'lab' || mode === 'mturk' || mode == 'sandbox' || mode == 'live') {
          psiTurk.saveData({
              success: function() {
                  console.log('Data saved!')
                   psiTurk.computeBonus('compute_bonus', function(){ //accesses custom.py method to calculate bonus for users
                     psiTurk.completeHIT();
                     //jsPsych.data.get().localSave('csv',uniqueId+'_data.csv');
                })
              },
              error: prompt_resubmit}) //if error saving data, try again
      //}
    },
});
}
