////////////////////////////////////////////////////////////////////////////////
// INITIALIZE EXPERIMENT ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// collects custom ID and experimenter name if run in the lab
//mode = 'debug';
mode = 'lab';

// initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var serverport = '22364'; // should match psiturk config.txt file // TODO: retrieve this from local text file instead of manually add
var serverporturl = 'http://localhost:'+serverport+'/';

// path to wordpool file
var wordStimPath = 'static/files/wordpool.csv'
var vocabStimPath = 'static/files/vocabpool.csv'
var movieStimPath = 'static/files/moviepool.csv'
var spatialStimPath = 'static/files/spatialpool.csv'
var returnSpeech = false;

// create empty folders for audio and fitbit files named with subject's ID

$.post('/create-folders', {
    'data': uniqueId
})


////////////////////////////////////////////////////////////////////////////////
// SET FITBIT PARAMETERS ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//load Fitbit credentials file (need to keep client secret out of public code!)

var fit_creds_loc = '/static/credentials/credentials_fitbit.json'
// initialize at higher scope so accessible
var client_id
var client_secret
var scope
var redirect_uri
//var prompt_flag = "login" //none is default_value
//var expires_in = 86400 for 1 day, 604800 for 1 week, 2592000 for 30 days, 31536000 for 1 year


fit_json = $.getJSON(fit_creds_loc, function (data) {
  console.log('Loading Fitbit credentials ...') //data
}).done(function(fit_creds){ //then when done, assign vals

  console.log('Fitbit credentials loaded.')
  client_id= fit_creds['client_id']
  client_secret = fit_creds['client_secret']
  scope = fit_creds['scope']
  redirect_uri = fit_creds['redirect_uri']

  return fit_creds //if need to re-ref
}).fail(function(){
  console.log('JSON credentials file failed to load.')
});


////////////////////////////////////////////////////////////////////////////////
// SET EXPERIMENTAL PARAMETERS /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// set stimulus parameters for each task

//word list practice
var practiceWords = ["OPTIMAL", "MEMORY", "ABSOLUTE"]; // words for practice block
var recPracticeWords = []; // initialize array to hold recorded practice words - needed? defined below
var practiceRecordTime = 10; // amount of time given to recite practice words, in seconds
//var instructionsTimeline = []; //initialize


//word list
//var font = 'Arial' // font
//var fontSize = '5vw' // font size
var listLength = 16; // how long you want each list to be (e.g. 16 words in each of 16 lists)
var numberOfLists = 4; // number of lists/test blocks
var recordTime = 60; //record time NOTE: 60 secs is the max google speech can handle per request
var wordPresTime = 2; // presentation duration
var wordIntertrialTime = 2; // ITI
var totalListNumber = 16; // total number of lists in the loaded csv file
//var listReps = 1; //number of repeats of each word list

//movie
var movieNumber = 1;  //number of movies to display from provided csv file
var movieRecallSecs = 120; //number of seconds to give individuals to recall movie
var movieShuffle = false; // flag whether want to return shuffled movie array or not

//vocab pairs
var vocabNumber = 10; // number of word-image pairs to use, depends on provided csv file
var numQuizQs = 10; // number of quiz questions (probably want equal to vocabNumber, but not greater or will crash)
var numVocabOptions = 4; // number of options for quiz q's
var vocabPresTime = 4; // presentation duration
var vocabIntertrialTime = 3; // ITI
var vocabReps = 1; //number of repeats of vocab pairs

//spatial task
var spatialPresTime = 10; //seconds to display image of icons for matching arrangement
var spatialIntertrialTime = 2; //seconds
var minSpatialNumber = 2; //min number of icons on screen to arrange
var maxSpatialNumber = 7; //**NOTE: need to make stimuli smaller if want more than 10 on the screen, currently a bug
var spatialReps = 3; //number of times to repeat spatial task segments

//delayed word list recall

var delayRecordTime = 120; //seconds, currently 2 minutes to account for all the words they can recall
