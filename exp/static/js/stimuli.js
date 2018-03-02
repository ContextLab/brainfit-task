////////////////////////////////////////////////////////////////////////////////
// LOAD IN STIMULI AND PREPARE TRIALS //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var stimArray = [];
var stimVocabArray = [];
var stimMovieArray = [];
var stimSpatialArray = [];
// define a 'promise' to load in the data from csv files

//word list
var loadWordStimuli = new Promise(
    function(resolve, reject) {
        var wordData;
        Papa.parse(wordStimPath, {
            download: true,
            complete: function(results) {
                wordData = results.data;
                //console.log(wordData);
                resolve(wordData)
            }
        })
    }
);

//vocab pairs
var loadVocabStimuli = new Promise(
    function(resolve, reject) {
        var vocabData;
        Papa.parse(vocabStimPath, {
            delimiter: ',', //csv 
            download: true,
            complete: function(results) {
                vocabData = results.data;
                //console.log(vocabData);
                resolve(vocabData)
            }
        })
    }
);

//random movies and associated questions

var loadMovieStimuli = new Promise(
    function(resolve, reject) {
        var movieData;
        Papa.parse(movieStimPath, {
            delimiter: ',', //csv 
            download: true,
            complete: function(results) {
                movieData = results.data;
                //console.log(movieData);
                resolve(movieData)
            }
        })
    }
);

var loadSpatialStimuli = new Promise(
    function(resolve, reject) {
        var spatialData;
        Papa.parse(spatialStimPath, {
            delimiter: ',', //csv 
            download: true,
            complete: function(results) {
                spatialData = results.data;
                //console.log(spatialData);
                resolve(spatialData)
            }
        })
    }
);

/*
var loadStimuli = Promise.all([loadWordStimuli,loadVocabStimuli]).then(function(vals) {
    //console.log('array1: ' + vals[0]);
    //console.log('array2: ' + vals[1]);
    return vals;
});*/

//promise to load all stim sets prior to beginning experiment

var loadStimuli = Promise.all([loadWordStimuli,loadVocabStimuli,loadMovieStimuli,loadSpatialStimuli]);



// takes the wordpool and organizes it into an array of stim objects
var prepareWordTrials = function(wordData) {
    return new Promise(
        function(resolve, reject) {

            // the first element is a header, not data so let's get rid of it.
            wordData.shift()

            //sort each element of the data and label its properties
            for (var i = 0; i < numberOfLists; i++) {

                stimArray.push([]);
                var list_array = stimArray[i];

                for (var j = 0; j < listLength; j++) {

                    var item = wordData[0]; //first row in data

                    //elements of the first row of data
                    var word = item[0];
                    var stim = word;
                    //var wordSize = item[1];
                    //var wordCategory = item[2];
                    //var groupNumber = item[3];
                    //create a stimulus for each element of the data and push it to the stimArray
                    /*var stim = {
                        type: "p",
                        text: word, //inserts the word from each row of csv file
                    };*/

                    /*// here you can set the css styles of the stim
                    stim.style = [
                        "font-size:" + fontSize,
                        "font-family:" + font,
                        "position:absolute",
                        "top:50%",
                        "left:50%",
                        "transform: translateX(-50%) translateY(-50%)",
                    ];*/

                    list_array.push(stim)
                    wordData.shift();
                }
            }
            //console.log(stimArray)
            
            // shuffle list order across subjects
            //var repeatedSet = jsPsych.randomization.repeat(stimArray,nreps); //repeat each list r times

            var shuffledLists = jsPsych.randomization.shuffleNoRepeats(stimArray)

            // shuffle stim within each list
            var shuffledStimArray = [];
            shuffledLists.forEach(function(list, idx) {
                shuffledStimArray.push(jsPsych.randomization.shuffleNoRepeats(shuffledLists[idx]))
            })
            //console.log(shuffledStimArray)

            resolve(shuffledStimArray)
            reject(console.log('word data rejected - loaded in order but not shuffled'))

        })
};

var prepareVocabTrials = function(vocabData) {
    return new Promise(
        function(resolve, reject) {

            // the first element is a header, not data so let's get rid of it.
            vocabData.shift()
            //sort each element of the data and label its properties
            for (var i = 0; i < 1; i++) {
                //sort each element of the data and label its properties
                stimVocabArray.push([]);
                var list_vocab_array = stimVocabArray[i];
            //var list_image_array = stimImageArray[i];

                for (var j = 0; j < vocabNumber; j++) {

                    var item = vocabData[0]; 
                    //console.log('item ' + item)
                    //elements of the first row of data
                    //var image = item[0];
                    //var vocab = item[1];

                    //var stim = vocab;

                    list_vocab_array.push(item);
                    //console.log(list_vocab_array);
                    //list_vocab_array.push(vocab);
                    //list_image_array.push(image);
                    vocabData.shift();
                }
            }
            
            //list_vocab_array = [].concat.apply([], list_vocab_array) //fix odd structure
            list_vocab_array = [].concat([], list_vocab_array) //fix odd structure
            var shuffledVocabArray = jsPsych.randomization.shuffleNoRepeats(list_vocab_array)
            //console.log(shuffledVocabArray) //**not resolving properly*****
            
            resolve(shuffledVocabArray)//**not resolving properly*****
            reject(console.log('vocab data rejected - loaded in order but not shuffled'))
            //console.log(stimVocabArray)
            
            // shuffle list order across subjects
            //var repeatedSet = jsPsych.randomization.repeat(stimVocabArray,nreps); //repeat each list r times
            //**DEBUG HERE 02/16/18 ** figure out why not shuffling AND why only picking from 1st 2 word lists in other task
            //var shuffledVocabLists = jsPsych.randomization.shuffleNoRepeats(stimVocabArray)
            //var shuffledVocabLists = jsPsych.randomization.shuffleNoRepeats(list_vocab_array)
            //resolve(shuffledVocabLists)
            /*
            // shuffle stim within each list
            var shuffledVocabArray = [];
            shuffledVocabLists.forEach(function(list, idx) {
                shuffledVocabArray.push(jsPsych.randomization.shuffleNoRepeats(shuffledVocabLists[idx]))
                
                })
            console.log(shuffledVocabArray)

            resolve(shuffledVocabArray)*/
        })

    };

var prepareMovieTrials = function(movieData) {
    return new Promise(
        function(resolve, reject) {

            // the first element is a header, not data so let's get rid of it.
            movieData.shift()
            //sort each element of the data and label its properties
            for (var i = 0; i < 1; i++) {
            stimMovieArray.push([]);
            var list_movie_array = stimMovieArray[i];

                for (var j = 0; j < movieNumber; j++) {

                    var movie = movieData[0]; //first row in data

                    list_movie_array.push(movie);

                    movieData.shift();
                }
            }
            
            // movieShuffle = true will randomize movie display
            if (movieShuffle) {
              var shuffledMovieLists = jsPsych.randomization.shuffleNoRepeats(stimMovieArray)

            // shuffle stim within each list
              var shuffledMovieArray = [];
              shuffledMovieLists.forEach(function(list, idx) {
              shuffledMovieArray.push(jsPsych.randomization.shuffleNoRepeats(shuffledMovieLists[idx]))
                
                 })
             //console.log(shuffledMovieArray)

             resolve(shuffledMovieArray)
             reject(console.log('movie data rejected - loaded in order but not shuffled'))

            } else {
             resolve(stimMovieArray)
             reject(console.log('movie data rejected - loaded in order but not shuffled'))

            }
        })

    };

var prepareSpatialTrials = function(spatialData) {
    return new Promise(
        function(resolve, reject) {

            // the first element is a header, remove
            spatialData.shift()
            //sort each element of the data and label its properties
            for (var i = 0; i < 1; i++) {
            stimSpatialArray.push([]);
            var list_spatial_array = stimSpatialArray[i];

                for (var j = 0; j < maxSpatialNumber; j++) { //load in the max number of stimuli to be displayed

                    var icon = spatialData[0]; //first row in data
                    list_spatial_array.push(icon);
                    spatialData.shift();
                }
            }
            

            var shuffledSpatialLists = jsPsych.randomization.shuffleNoRepeats(stimSpatialArray)

            // shuffle stim within each list
            var shuffledSpatialArray = [];
            shuffledSpatialLists.forEach(function(list, idx) {
              shuffledSpatialArray.push(jsPsych.randomization.shuffleNoRepeats(shuffledSpatialLists[idx]))
                
                })

            resolve(shuffledSpatialArray)
            reject(console.log('spatial data rejected - loaded in order but not shuffled'))

        })

    };


/*
var prepareTrials = function (vals) {
    return Promise.all([prepareWordTrials(vals[0]),prepareVocabTrials(vals[1])]).then(function(newvals) {
        console.log(newvals[0]);
        console.log(newvals[1]);

        //return newvals;
    })
}*/

var prepareTrials = function (vals) {
    return Promise.all([prepareWordTrials(vals[0]),prepareVocabTrials(vals[1]),prepareMovieTrials(vals[2]),prepareSpatialTrials(vals[3])])
    }