var experimentTimeline = []; //create the jsPsych experimentTimeline variable
var stimArray = [];
var stimVocabArray = [];
var stimMovieArray = [];
var stimSpatialArray = [];

var fscreen = true; //toggle fullscreen, otherwise will resize to % of screen size
var fitbitSuccess = false; //don't initially have fitbit data so will be false

var runExperiment = function (trials, options) {
    stimArray = trials[0];
    vocabArray = trials[1];
    movieArray = trials[2];
    spatialArray = trials[3];

    //console.log(currentStimArray)

////////////////////////////////////////////////////////////////////////////////
// INSTRUCTIONS AND SCREENING QUESTIONS ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var start_time = jsPsych.startTime(); //save this
//innerWidth and innerHeight
window.resizeTo(Math.round(window.screen.availWidth*0.8), Math.round(window.screen.availHeight*0.95));

/*
if(mode == 'lab'){

    var subjectID = {
        type: 'survey-text',
        questions: [{prompt: "Subject ID: ", value: 'BFM-1.0-MMDDYY-SN', rows: 1, columns: 20}, {prompt: "Experimenter Initials: ", value: ' ',rows: 1, columns: 7},],
    };
    experimentTimeline.push(subjectID)
}*/

//switch taskName for debugging a section
//var taskName = 'delay'; //choices: 'screen', 'practiceWord','word','movie','vocab','spatial','delay'

 //switch(taskName) {  //comment out switch/cases when done debugging

/*

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
    fullscreen_mode: true
   });
  }

 // case 'screen':
    var screeningTimeline = screeningPages();
    screeningTimeline.forEach(function(screeningPage) {
            experimentTimeline.push(screeningPage)
            //console.log('skipped screening')
        });
    //break;

////////////////////////////////////////////////////////////////////////////////
// PART 0. WORD LIST FREE RECALL PRACTICE /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//NOTE: only include if recording audio (presently only in-lab tasks)
/*
 // case 'practiceWord':
   var wordListPracticeTimeline = wordListPractice();
        wordListPracticeTimeline.forEach(function(wordListPracticePage) {
            experimentTimeline.push(wordListPracticePage)
        });
   // break;
//} // only run screening, fullscreen, and word list practice if in lab mode
*/


/*
////////////////////////////////////////////////////////////////////////////////
// PART I. WORD LIST FREE RECALL TASK /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
 // case 'word':
    var wordListTimeline = wordListTask();
        wordListTimeline.forEach(function(wordListPage) {
            experimentTimeline.push(wordListPage)
        });

   // break;


////////////////////////////////////////////////////////////////////////////////
// PART II. MOVIE //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

 // case 'movie':
    var movieTimeline = movieTask();
      movieTimeline.forEach(function(moviePage) {
          experimentTimeline.push(moviePage)
      });
   // break;



////////////////////////////////////////////////////////////////////////////////
// PART III. VOCABULARY-IMAGE PAIRS ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


 // case 'vocab':
      var vocabTimeline = vocabTask();
        vocabTimeline.forEach(function(vocabPage) {
            experimentTimeline.push(vocabPage)
        });
   //break;

////////////////////////////////////////////////////////////////////////////////
// PART IV. SPATIAL TASK ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

 // case 'spatial':
    var spatialTimeline = spatialTask();
        spatialTimeline.forEach(function(spatialPage) {
            experimentTimeline.push(spatialPage)
        });

 // break;

////////////////////////////////////////////////////////////////////////////////
// PART V. DELAYED WORD FREE RECALL ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

 // case 'delay':
    var delayRecallTimeline = delayRecallTask();
        delayRecallTimeline.forEach(function(delayRecallPage) {
            experimentTimeline.push(delayRecallPage)
        });
  //  break;

// } //switch end

//added in following sections before debrief to extend duration of study (TODO: split into separate functions instead of in-line text)

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
// PART VIII. STRESS AND ANXIETY SURVEY ////////////////////////////////////////
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

*/
////////////////////////////////////////////////////////////////////////////////
// POST-SURVEY /////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//get feedback on task design (optional?)

var postSurveyTimeline = postSurveyTask();
    postSurveyTimeline.forEach(function(postSurveyTaskPage) {
        experimentTimeline.push(postSurveyTaskPage)
    });


////////////////////////////////////////////////////////////////////////////////
// DEBRIEFING & WRAPUP /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//need to save data when reaches this screen, or next ***

var block_debrief = {
    type: "instructions",
    pages: ["<h1>Thank you for participating in this study!</h1> <p> Press Next to complete the task. </p>"],
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
            if (mode == 'lab'){
              psiTurk.recordTrialData(data) //jsPsych.data.getLastTrialData()); //data
              //psiTurk.saveData();
              }
            },
    on_finish: function() {
        //experimentTimeline.push(block_debrief)
        //console.log(jsPsych.totalTime()); // see time elapsed
        //jsPsych.data.displayData(); //for debugging
        //jsPsych.data.get().localSave('csv',uniqueId+'_data.csv'); //save locally for now
        console.log('Saving data...')
        if (mode === 'lab' || mode === 'mturk') {
          psiTurk.saveData({
              success: function() {
                  console.log('Data saved!')
                  psiTurk.completeHIT();
              }
            })
      } // TODO: also save when online
    },
});
}
