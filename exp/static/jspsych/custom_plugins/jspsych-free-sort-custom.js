/**
 * jspsych-free-sort
 * plugin for drag-and-drop sorting of a collection of images
 * modified by G Notaro from free-sort by Josh de Leeuw

 * documentation: docs.jspsych.org
 */


jsPsych.plugins['free-sort-custom'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('free-sort-custom', 'stimuli', 'image');

  plugin.info = {
    name: 'free-sort-custom',
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
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Done',
        description: 'The text that appears on the button to continue to the next trial.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var start_time = (new Date()).getTime();

    var html = "";
    // check if there is a prompt and if it is shown above
    if (trial.prompt !== null && trial.prompt_location == "above") {
      html += "<div id = 'instrpro'>" + trial.prompt + "</div>";
    }

    html += '<div '+
      'id="jspsych-free-sort-custom-arena" '+
      'class="jspsych-free-sort-custom-arena" '+
      'style="position: relative; width:'+trial.sort_area_width+'px; height:'+trial.sort_area_height+'px; border:2px solid #444;"'+
      '></div>';

    // check if prompt exists and if it is shown below
    if (trial.prompt !== null && trial.prompt_location == "below") {
      html += "<div id = 'instrpro'>" + trial.prompt + "</div>";
    }

    display_element.innerHTML = html;

    // store initial location data
    var init_locations = [];

    for (var i = 0; i < trial.stimuli.length; i++) {
        //**TODO: debug here ** only works for fewer then 10 stimuli
          var coords = initial_coordinate(Math.floor(((i+1)/(trial.stimuli.length+1))*trial.sort_area_width-(trial.stim_width/2)),Math.floor((trial.sort_area_height/2)-(trial.stim_height/2)))
      display_element.querySelector("#jspsych-free-sort-custom-arena").innerHTML += '<img '+
        'src="'+trial.stimuli[i]+'" '+
        'data-src="'+trial.stimuli[i]+'" '+
        'class="jspsych-free-sort-custom-draggable" '+
        'draggable="false" '+
        'style="position: absolute; cursor: move; width:'+trial.stim_width+'px; height:'+trial.stim_height+'px; top:'+coords.y+'px; left:'+coords.x+'px;">'+
        '</img>';

      init_locations.push({
        "src": trial.stimuli[i],
        "x": coords.x,
        "y": coords.y
      });
    }

    display_element.innerHTML += '<button id="jspsych-free-sort-custom-done-btn" class="jspsych-btn">'+trial.button_label+'</button>';

    var maxz = 1;

    var moves = [];

    var draggables = display_element.querySelectorAll('.jspsych-free-sort-custom-draggable');

    for(var i=0;i<draggables.length; i++){
      draggables[i].addEventListener('mousedown', function(event){
        var x = event.pageX - event.currentTarget.offsetLeft;
        var y = event.pageY - event.currentTarget.offsetTop - window.scrollY;
        var elem = event.currentTarget;
        elem.style.zIndex = ++maxz;

        var mousemoveevent = function(e){
          elem.style.top =  Math.min(trial.sort_area_height - trial.stim_height, Math.max(0,(e.clientY - y))) + 'px';
          elem.style.left = Math.min(trial.sort_area_width  - trial.stim_width,  Math.max(0,(e.clientX - x))) + 'px';
        }
        document.addEventListener('mousemove', mousemoveevent);

        var mouseupevent = function(e){
          document.removeEventListener('mousemove', mousemoveevent);
          moves.push({
            "src": elem.dataset.src,
            "x": elem.offsetLeft,
            "y": elem.offsetTop
          });
          document.removeEventListener('mouseup', mouseupevent);
        }
        document.addEventListener('mouseup', mouseupevent);
      });
    }

    display_element.querySelector('#jspsych-free-sort-custom-done-btn').addEventListener('click', function(){
    var final_locations = []; //move up scope, see if fixes //DEBUG

    if (moves.length<(draggables.length-1)) { //have boolean flag to check whether users moved shapes (n-1 shapes)
        document.getElementById("instrpro").innerHTML = "<p style='color:red'> <b>ALERT:</b> Please click and drag each shape to the positions displayed before continuing.</p>";

    }
    else {
      var end_time = (new Date()).getTime();
      var rt = end_time - start_time;
      // get final position of all objects
      var matches = display_element.querySelectorAll('.jspsych-free-sort-custom-draggable');
      for(var i=0; i<matches.length; i++){
        final_locations.push({
          "src": matches[i].dataset.src,
          "x": matches[i].offsetLeft, //style.position.left,
          "y": matches[i].offsetTop //style.position.top
        });
      }

      var trial_data = {
        "task_name": 'spatial_shapes',
        "init_locations": JSON.stringify(init_locations),
        "moves": JSON.stringify(moves),
        "final_locations": JSON.stringify(final_locations),
        "rt": rt
      };

      // advance to next part
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
      };
    });
  };


  function initial_coordinate(xi, yi) { //TODO: remove this later
    return {
      x: xi,
      y: yi,
    };
  }

  return plugin;
})();
