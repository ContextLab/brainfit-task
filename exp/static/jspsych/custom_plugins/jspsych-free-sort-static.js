/**
 * jspsych-free-sort-static
 * display images for drag-and-drop sorting of a collection of images
 * modified by G Notaro from free-sort by Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 */

jsPsych.plugins['free-sort-static'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('free-sort-static', 'stimuli', 'image');

  plugin.info = {
    name: 'free-sort-static',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimuli',
        default: undefined,
        array: true,
        description: 'Images to be displayed.'
      },
      stim_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus height',
        default: 100,
        description: 'Height of images in pixels.'
      },
      stim_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus width',
        default: 100,
        description: 'Width of images in pixels'
      },
      sort_area_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Sort area height',
        default: 800,
        description: 'The height of the container that subjects can move the stimuli in.'
      },
      sort_area_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Sort area width',
        default: 800,
        description: 'The width of the container that subjects can move the stimuli in.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'It can be used to provide a reminder about the action the subject is supposed to take.'
      },
      prompt_location: {
        type: jsPsych.plugins.parameterType.SELECT,
        pretty_name: 'Prompt location',
        options: ['above','below'],
        default: 'above',
        description: 'Indicates whether to show prompt "above" or "below" the sorting area.'
      },
    stim_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: 1000,
        description: 'How long to show each stimulus for, in milliseconds.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var start_time = (new Date()).getTime();

    var html = "";
    // check if there is a prompt and if it is shown above
    if (trial.prompt !== null && trial.prompt_location == "above") {
      html += trial.prompt;
    }

    html += '<div '+
      'id="jspsych-free-sort-static-arena" '+
      'class="jspsych-free-sort-static-arena" '+
      'style="position: relative; width:'+trial.sort_area_width+'px; height:'+trial.sort_area_height+'px; border:2px solid #444;"'+
      '></div>';

    // check if prompt exists and if it is shown below
    if (trial.prompt !== null && trial.prompt_location == "below") {
      html += trial.prompt;
    }

    display_element.innerHTML = html;

    // store initial location data
    var init_locations = [];

    //initialize screen initializations
    var wdiv = [];
    var hdiv = [];
    var coords = [];

    for(var i = 0; i < Math.floor(trial.sort_area_width/trial.stim_width)-1; i++) {
          wdiv.push((2*i+1)*(trial.stim_width/2))
          hdiv.push((2*i+1)*(trial.stim_height/2))
         }

    // generate sequence of unique indexes for each stimuli so not overlapping
    var x_idx = []
    var y_idx = []

    while(x_idx.length < trial.stimuli.length){
        var xrandidx = Math.floor(Math.random()*wdiv.length);
        if(x_idx.indexOf(xrandidx) > -1) continue;
        x_idx[x_idx.length] = xrandidx;
    }

    while(y_idx.length < trial.stimuli.length){
        var yrandidx = Math.floor(Math.random()*hdiv.length);
        if(y_idx.indexOf(yrandidx) > -1) continue;
        y_idx[y_idx.length] = yrandidx;
    }

    for (var i = 0; i < trial.stimuli.length; i++) {

      coords.x = wdiv[x_idx[i]]
      coords.y = hdiv[y_idx[i]]

      display_element.querySelector("#jspsych-free-sort-static-arena").innerHTML += '<img '+
        'src="'+trial.stimuli[i]+'" '+
        'data-src="'+trial.stimuli[i]+'" '+
        'class="jspsych-free-sort-static-draggable" '+
        'draggable="false" '+
        'style="position: absolute; width:'+trial.stim_width+'px; height:'+trial.stim_height+'px; top:'+coords.y+'px; left:'+coords.x+'px;">'+
        '</img>';

      init_locations.push({
        "src": trial.stimuli[i],
        "x": coords.x,
        "y": coords.y,
      });
    }

    jsPsych.pluginAPI.setTimeout(function() {
      display_element.querySelector('.jspsych-free-sort-static-draggable').style.visibility = 'hidden';
      var end_time = (new Date()).getTime();
      //var rt = end_time - start_time;
      // gather data
      // get final position of all objects
      var final_locations = [];
      var matches = display_element.querySelectorAll('.jspsych-free-sort-static-draggable');
      for(var i=0; i<matches.length; i++){
        final_locations.push({
          "src": matches[i].dataset.src,
          "x": matches[i].style.position.left,
          "y": matches[i].style.position.top,
        });
      }

      var trial_data = {
        "icon_locations": JSON.stringify(init_locations),
      };

      // advance to next part
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
    }, trial.stim_duration);


  };

  return plugin;
})();
