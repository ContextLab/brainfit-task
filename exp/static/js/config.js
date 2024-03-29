////////////////////////////////////////////////////////////////////////////////
// INITIALIZE EXPERIMENT ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// collects custom ID and experimenter name if run in the lab - internal use, not PsiTurk use
//mode = 'lab';
mode = 'mturk'

// initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

//local debugging - replace with static IP for online use!
var serverporturl = 'http://127.0.0.1/' //used in fitbit.html to open window

// path to task stimuli files
var wordStimPath = 'static/files/wordpool.csv'
var vocabStimPath = 'static/files/vocabpool.csv'
var movieStimPath = 'static/files/moviepool.csv'
var spatialStimPath = 'static/files/spatialpool.csv'

var newuniqueId = uniqueId.replace(':','-') // save folder with dash instead of slash to avoid issues with name during analysis

// create empty folders for fitbit files named with subject's ID

$.post('/create-folders', {
    'data': newuniqueId
})

////////////////////////////////////////////////////////////////////////////////
// SET FITBIT PARAMETERS ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//load Fitbit credentials file (keep client secret out of public code!)

var fit_creds_loc = '/static/credentials/credentials_fitbit.json'
// initialize at higher scope so accessible
var client_id
var client_secret
var scope
var redirect_uri
var prompt_flag //= "login" //none is default_value
var expires_in // = 86400 for 1 day, 604800 for 1 week, 2592000 for 30 days, 31536000 for 1 year

fit_json = $.getJSON(fit_creds_loc, function (data) {
  console.log('Loading Fitbit credentials ...') //data
}).done(function(fit_creds){ //then when done, assign to variables
  console.log('Fitbit credentials loaded.')
  client_id= fit_creds['client_id']
  client_secret = fit_creds['client_secret']
  scope = fit_creds['scope']
  redirect_uri = fit_creds['redirect_uri']
  prompt_flag = fit_creds['prompt_flag']
  expires_in = fit_creds['expires_in']
  return fit_creds
}).fail(function(){
  console.log('JSON credentials file failed to load.')
});

////////////////////////////////////////////////////////////////////////////////
// SET EXPERIMENTAL PARAMETERS /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// set stimulus parameters for each task

//word list
var listLength = 16; // how long you want each list to be (e.g. 16 words in each of 16 lists)
var numberOfLists = 4; // number of lists/test blocks
var recordTime = 90; // recall time
var wordPresTime = 2; // presentation duration
var wordIntertrialTime = 2; // ITI
var totalListNumber = 16; // total number of lists in the loaded csv file

//movie
var movieNumber = 1;  //number of movies to display from provided csv file
var movieRecallSecs = 600; //number of seconds to give individuals to recall movie
var movieRecallButton = 240; //number of seconds before button clickable
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
var delayRecordTime = 180; //seconds, currently 2 minutes to account for all the words they can recall
