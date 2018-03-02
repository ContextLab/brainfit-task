////////////////////////////////////////////////////////////////////////////////
// RUN THE EXPERIMENT //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var options = {
  show: true,
  mode: mode
};



loadStimuli.then(function(loadedFileData) {
  //console.log('loaded file data 0 :' +loadedFileData[0]);
  //console.log('loaded file data 1 :' +loadedFileData[1]);
  prepareTrials(loadedFileData).then(function (trials) {
    //console.log('trials: ' + trials)
    runExperiment(trials, options)
  });
});

