var experimentTimeline = []; //create the jsPsych experimentTimeline variable
var stimArray = [];
var stimVocabArray = [];
var stimMovieArray = [];
var stimSpatialArray = [];

var fscreen = true; //toggle fullscreen, otherwise will resize to % of screen size

//TODO: stylesheets?

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

if(mode == 'lab'){

  if(fscreen) {
    //fullscreen mode
    experimentTimeline.push({
      type: 'fullscreen',
      fullscreen_mode: true
     });
    }

    var subjectID = {
        type: 'survey-text',
        questions: [{prompt: "Subject ID: ", value: 'BFM-1.0-MMDDYY-SN', rows: 1, columns: 20}, {prompt: "Experimenter Initials: ", value: ' ',rows: 1, columns: 7},],
    };
    experimentTimeline.push(subjectID)
//switch taskName for debugging a section
//var taskName = 'delay'; //choices: 'screen', 'practiceWord','word','movie','vocab','spatial','delay'

 //switch(taskName) {  //comment out switch/cases when done debugging


 // case 'screen':
    var screeningTimeline = screeningPages();
    screeningTimeline.forEach(function(screeningPage) {
            experimentTimeline.push(screeningPage)
        });
    //break;

////////////////////////////////////////////////////////////////////////////////
// PART IA. WORD LIST FREE RECALL PRACTICE /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


 // case 'practiceWord':
   var wordListPracticeTimeline = wordListPractice();
        wordListPracticeTimeline.forEach(function(wordListPracticePage) {
            experimentTimeline.push(wordListPracticePage)
        });
   // break;
} // only run screening, fullscreen, and word list practice if in lab mode

////////////////////////////////////////////////////////////////////////////////
// PART IB. WORD LIST FREE RECALL TASK /////////////////////////////////////////
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

//TODO: need to load in selected stimuli pairs into stimuli.js like other function (make csv of image-word pairs)

 // case 'vocab':
      var vocabTimeline = vocabTask();
        vocabTimeline.forEach(function(vocabPage) {
            experimentTimeline.push(vocabPage)
        });
   //break;



////////////////////////////////////////////////////////////////////////////////
// PART IV. SPATIAL TASK ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//TODO: finalize format and create loop of images and responses, output initial and ending positions; add in stimuli just like word lists and vocab
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


////////////////////////////////////////////////////////////////////////////////
// DEBRIEFING & WRAPUP /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//need to save data when reaches this screen, or next ***

//    is impacted by fitness and exercise activities through examining both Fitbit data and task scores.</p><p>Each of these tasks examined a different aspect of memory so we can determine whether the relationship of fitness on memory is generalizable, or specific, across domains. Your participation will help us elucidate this connection. </p><p> Thank you again! Press Next > to exit and save your data. </p>"],

var block_debrief = {
    type: "instructions",
    pages: ["<h1>Thank you for participating in this study!</h1> <p>The general purpose of this research is to understand how performance on each of these memory domain tasks relate to each other. </p><p> Thank you again! Press Next > to exit and save your data. </p>"],
    show_clickable_nav: true,
}
experimentTimeline.push(block_debrief)

/*
var block_thankyou= {
    type: "html-keyboard-response",
    stimulus: "<p>Thank you for participating in this study!</p>",
    choices: jsPsych.NO_KEYS,
    //stimulus_duration: 5000, //5 secs
    trial_duration: 5000,
}
experimentTimeline.push(block_thankyou)*/


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
        if (mode === 'lab') {
          psiTurk.saveData({
              success: function() {
                  console.log('Data saved!')
                  psiTurk.completeHIT();
              }
        })
      }
    },
});
}
