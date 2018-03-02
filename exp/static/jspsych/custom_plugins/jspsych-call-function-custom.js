/**
 * jspsych-call-function
 * plugin for calling an arbitrary function during a jspsych experiment
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins['call-function-custom'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'call-function-custom',
    description: '',
    parameters: {
      func: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Function',
        default: undefined,
        description: 'Function to call (custom)'
      },
      post_trial_gap: { //added this variable
          type: jsPsych.plugins.parameterType.INT, //manually added, enter in ms
          pretty_name: 'Duration of function',
          default: 1000, //one second
          description: 'Allows function to persist over period of time',
      },
    },
  }

  plugin.trial = function(display_element, trial) {
    //trial.post_trial_gap = 10000; //edited here
    var return_val = trial.func();

    var trial_data = {
      value: return_val
    };

    jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
