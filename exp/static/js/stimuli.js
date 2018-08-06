////////////////////////////////////////////////////////////////////////////////
// LOAD IN STIMULI AND PREPARE TRIALS //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var stimArray = [];
var stimVocabArray = [];
var stimMovieArray = [];
var stimSpatialArray = [];

// define a promise to load in the data from csv files

//word list
var loadWordStimuli = new Promise(
    function(resolve, reject) {
        var wordData;
        Papa.parse(wordStimPath, {
            download: true,
            complete: function(results) {
                wordData = results.data;
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
                resolve(spatialData)
            }
        })
    }
);

//promise to load all stim sets prior to beginning experiment

var loadStimuli = Promise.all([loadWordStimuli,loadVocabStimuli,loadMovieStimuli,loadSpatialStimuli]);

// NOTE: prepare functions only load but don't shuffle stimuli **

// takes the wordpool and organizes it into an array of stim objects
var prepareWordTrials = function(wordData) {
    return new Promise(
        function(resolve, reject) {

            // the first element is a header, get rid of it
            wordData.shift()

            //sort each element of the data and label its properties
            for (var i = 0; i < totalListNumber ; i++) { //number of lists - load in all for now

                stimArray.push([]);
                var list_array = stimArray[i];

                for (var j = 0; j < listLength; j++) {

                    var item = wordData[0]; //first row in data

                    //elements of the first row of data
                    var word = item[0];
                    var stim = word;

                    list_array.push(stim)
                    wordData.shift();
                }
            }

            var shuffledLists = jsPsych.randomization.shuffleNoRepeats(stimArray)

            // shuffle stim within each list
            var shuffledStimArray = [];
            shuffledLists.forEach(function(list, idx) {
                shuffledStimArray.push(jsPsych.randomization.shuffleNoRepeats(shuffledLists[idx]))
            })

            resolve(shuffledStimArray)
            reject(console.log('word data loaded in order but not shuffled'))

        })
};

var prepareVocabTrials = function(vocabData) {
    return new Promise(
        function(resolve, reject) {

            // the first element is a header, get rid of it
            vocabData.shift()
            //sort each element of the data and label its properties
            for (var i = 0; i < 1; i++) {
                //sort each element of the data and label its properties
                stimVocabArray.push([]);
                var list_vocab_array = stimVocabArray[i];

                for (var j = 0; j < vocabNumber; j++) {

                    var item = vocabData[0];
                    list_vocab_array.push(item);
                    vocabData.shift();
                }
            }

            list_vocab_array = [].concat([], list_vocab_array) //fix odd structure
            var shuffledVocabArray = jsPsych.randomization.shuffleNoRepeats(list_vocab_array)

            resolve(shuffledVocabArray) // **not resolving properly**
            reject(console.log('vocab data loaded in order but not shuffled'))
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

             resolve(shuffledMovieArray)
             reject(console.log('movie data loaded in order but not shuffled'))

            } else {
             resolve(stimMovieArray)
             reject(console.log('movie data loaded in order but not shuffled'))

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

                for (var j = 0; j < maxSpatialNumber; j++) { // load in the max number of stimuli to be displayed

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
            reject(console.log('spatial data loaded in order but not shuffled'))

        })

    };



var prepareTrials = function (vals) {
    return Promise.all([prepareWordTrials(vals[0]),prepareVocabTrials(vals[1]),prepareMovieTrials(vals[2]),prepareSpatialTrials(vals[3])])
    }
