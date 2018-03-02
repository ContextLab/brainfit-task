////////////////////////////////////////////////////////////////////////////////
// INITIALIZE EXPERIMENT ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// collects custom ID and experimenter name if run in the lab
mode = 'debug';
//mode = 'lab';

// initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

// path to wordpool file
var wordStimPath = 'static/files/wordpool.csv'
var vocabStimPath = 'static/files/vocabpool.csv'
var movieStimPath = 'static/files/moviepool.csv'
var spatialStimPath = 'static/files/spatialpool.csv'

var returnSpeech = false;

// create empty folder for audio files 
$.post('/create-audio-folder', {
    'data': uniqueId
})

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
//var listReps = 1; //number of repeats of each word list

//movie
var movieNumber = 1;  //number of movies to display from provided csv file
var movieRecallSecs = 120; //number of seconds to give individuals to recall movie
var movieShuffle = false; // flag whether want to return shuffled movie array or not 

//vocab pairs
var vocabNumber = 10; // number of word-image pairs to use, depends on provided csv file
var vocabPresTime = 4; // presentation duration
var vocabIntertrialTime = 3; // ITI
var vocabReps = 1; //number of repeats of vocab pairs

//spatial task
var spatialPresTime = 6; //seconds to display image of icons for matching arrangement
var spatialIntertrialTime = 2; //seconds
var minSpatialNumber = 3; //min number of icons on screen to arrange
var maxSpatialNumber = 6; //maximum number of stimuli that will be displayed on screen for sorting (i.e. most difficult level)
//var spatialReps = 1; //number of times to repeat spatial task segments

//delayed word list recall

var delayRecordTime = 120; //seconds, currently 2 minutes to account for all the words they can recall
