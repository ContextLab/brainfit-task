/**
 * plugin for accessing experiment start date and time
 * G Notaro
 **/
jsPsych.plugins['datetime'] = (function(){

  var plugin = {};

  plugin.info = {
    name: 'datetime',
    parameters: {
    }
  }

  plugin.trial = function(display_element, trial){

    // save data
    var trialdata = {
      "startDateTime": jsPsych.startTime(),
    };

    jsPsych.finishTrial(trialdata);
  }

  return plugin;

})();
