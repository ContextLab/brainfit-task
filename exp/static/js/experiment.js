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


if(mode == 'lab'){

    var subjectID = {
        type: 'survey-text',
        questions: [{prompt: "Subject ID: ", value: 'BFM-1.0-MMDDYY-SN', rows: 1, columns: 20}, {prompt: "Experimenter Initials: ", value: ' ',rows: 1, columns: 7},],
    };
    experimentTimeline.push(subjectID)
}

//switch taskName for debugging a section
//var taskName = 'delay'; //choices: 'screen', 'practiceWord','word','movie','vocab','spatial','delay'

 //switch(taskName) {  //comment out switch/cases when done debugging



//TODO: will need to change consent form to new one
//TODO: figure out changes needed prior to running on MTurk

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

//now can make fullscreen once fitbit data provided (otherwise popup will disrupt)

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
//} // only run screening, fullscreen, and word list practice if in lab mode



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

//added in following sections before debrief to extend duration of study (TODO: split into separate functions eventually)

////////////////////////////////////////////////////////////////////////////////
// PART VI. DELAYED MOVIE RECALL ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

delayMovieRecallSecs = 100;

var instr_delayRecall_movie = {
    type: 'instructions',
    pages: ["<h1> Part VI. Delayed Movie Recall </h1> <p> You will now recite aloud everything you remember seeing in the short movie you viewed earlier.</p> <p> When you see the <i style='color:red' class='fa fa-microphone'></i> icon on the next page, please begin. You will have " + delayMovieRecallSecs + " seconds to complete this recall. </p><p> Please remember to speak <strong>clearly</strong> about 1-2 feet from your computer.</p>"],
    show_clickable_nav: true,
}

experimentTimeline.push(instr_delayRecall_movie)


var delayRecall_movie = {
    type: 'free-recall',
    stimulus: "<p class='mic' style='position:absolute;top:35%;left:47%;font-size:10vw;color:red'><i class='fa fa-microphone blink_me' style='color:red'></i></p>",
    stim_duration: delayMovieRecallSecs * 1000,
    trial_duration: delayMovieRecallSecs * 1000, // +  2000,
    record_audio: true,
    identifier: 'delaymovie-' + 1,//movieNumber, //save file with task and number
    //data: {
    //    movieFile: movieArray[0][0][0], //assuming only one movie
    //    movieContent: movieArray[0][0][1], //save description
    //},
  }
 experimentTimeline.push(delayRecall_movie);

////////////////////////////////////////////////////////////////////////////////
// PART VII. DELAYED VOCAB QUIZ ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var instructions_vocab = {
  type: 'instructions',
  pages: ['<h1> Part VII. Delayed Vocabulary-Image Pair Questions </h1> <br/><p> Now you will be asked to recall the Irish language vocabulary pairs you learned earlier.</p><p> Please press Next > to continue. </p>'],
  show_clickable_nav: true
};
experimentTimeline.push(instructions_vocab)

imageIdxLog = [];
  for (var q = 0; q<numQuizQs; q++ ) {

      // choose a random index out of all possible choices
      //use underscore library to generate random indexes for selecting vocab options

      var randomIdxs =[];
      while(randomIdxs.length < numVocabOptions) {
          randomIdxs.push(Math.floor(Math.random()*(stimVocabArray[0].length)))
          randomIdxs = _.uniq(randomIdxs); //want a unique set of options
          };
      //console.log(randomIdxs)
      // if all the indexes in the array have already been displayed as images
      while(_.difference(randomIdxs, imageIdxLog).length === 0) {
          var randomIdxs =[];
          while(randomIdxs.length < numVocabOptions) { //then generate a new array until this is not the case (at least one new item)
              randomIdxs.push(Math.floor(Math.random()*(stimVocabArray[0].length)))
              randomIdxs = _.uniq(randomIdxs); //want a unique set of options
              };
              //console.log('innerloop')
      }

      //now shouldnt get stuck in this loop because at least one index will be novel
      var imageIdx = randomIdxs[Math.floor(Math.random()*(randomIdxs.length))] //try generating index once

      while(_.contains(imageIdxLog,imageIdx)){ //but if image was already shown, generate unique idx
          imageIdx = randomIdxs[Math.floor(Math.random()*(randomIdxs.length))]
      }
      imageIdxLog.push(imageIdx); //push unique index to log of displayed images
      //console.log(imageIdxLog)


      var imageOption = stimVocabArray[0][imageIdx][0]; // needs to match one of the random indexes; use to determine correct response
      var corrResp = stimVocabArray[0][imageIdx][1]; //also record correct response

      var options_vocab = [];
      for (var op = 0; op<randomIdxs.length; op++){
          options_vocab.push(stimVocabArray[0][randomIdxs[op]][1])
      }

      var imageDir = '/static/images/' //directory of images
      var quiz_vocab = {
        type: 'survey-multi-choice',
        questions: [{prompt: "<center> What is the word associated with: <br /> <img src=" + imageDir + imageOption + " height = 200></img></center>", options: options_vocab, required:true}],
        data: {
                  vocab_options: options_vocab,
                  image_shown: imageOption,
                  correct_resp: corrResp,
              },
      };

      experimentTimeline.push(quiz_vocab)
      //console.log(quiz_vocab.responses)
  }

////////////////////////////////////////////////////////////////////////////////
// PART VIII. STRESS AND ANXIETY SURVEY ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//if we want to have a stress-related component, here's a GAD survey (not included currently)

options_stress_survey = ['Not at all', 'Several days','Over half the days','Nearly every day','Prefer not to answer']

var stress_survey = {
    type: 'survey-multi-choice',
    preamble: 'Lastly, we want to interpret our results with respect to your self-reported stress levels. Over the last 2 weeks, how often have you been bothered by the following problems?',
    questions: [{prompt: '<b>Feeling nervous, anxious, or on edge?</b>', options: options_stress_survey, required:true,},
               {prompt: '<b>Not being able to stop or control worrying?</b>', options: options_stress_survey, required:true,},
               {prompt: '<b>Worrying too much about different things?</b>', options: options_stress_survey, required:true,},
               {prompt: "<b>Trouble relaxing?</b>", options:options_stress_survey,required:true,},
               {prompt: "<b>Being so restless that it's hard to sit still?</b>", options:options_stress_survey,required:true,},
               {prompt: '<b>Becoming easily annoyed or irritable?</b>', options:options_stress_survey, required:true},
               {prompt: '<b>Feeling afraid as if something awful might happen</b>', options:options_stress_survey, required:true},]

    };
//experimentTimeline.push(stress_survey);

////////////////////////////////////////////////////////////////////////////////
// DEBRIEFING & WRAPUP /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//need to save data when reaches this screen, or next ***

var block_debrief = {
    type: "instructions",
    pages: ["<h1>Thank you for participating in this study!</h1> <p>The general purpose of this research is to understand how performance on each of these memory domain tasks relate to each other, and how fitness and physical activity may modulate this relationship. </p><p> Thank you again! Press Next > to exit and save your data. </p>"],
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
        if (mode === 'lab') {
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
