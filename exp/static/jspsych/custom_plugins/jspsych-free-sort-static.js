/**
 * jspsych-free-sort-static
 * display images for drag-and-drop sorting of a collection of images
 * modified from free-sort by Josh de Leeuw
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
      /*button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to continue to the next trial.'
      },*/
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


     /*for (var i = 0; i < trial.stimuli.length+1; i++) {
      wdiv.push(i*(trial.sort_area_width - trial.stim_width)/trial.stimuli.length); // divide screen into segments based on stim num
      hdiv.push(i*(trial.sort_area_height - trial.stim_height)/trial.stimuli.length); 
     }  */
    //var c = 0; //counter
   // while((Math.max(wdiv) < trial.sort_area_width) && (Math.max(hdiv) < trial.sort_area_height)){
    //for(var i = 0; i < Math.floor(trial.sort_area_width/trial.stimuli.width); i++) {
      
    for(var i = 0; i < Math.floor(trial.sort_area_width/trial.stim_width)-1; i++) { 
          wdiv.push((2*i+1)*(trial.stim_width/2))  
          hdiv.push((2*i+1)*(trial.stim_height/2))  
         }
    //console.log('w,h:',wdiv,hdiv)

    // generate sequence of unique indexes for each stimuli so not overlapping
    var x_idx = []
    var y_idx = []

    while(x_idx.length < trial.stimuli.length){
        var xrandidx = Math.floor(Math.random()*wdiv.length); 
        if(x_idx.indexOf(xrandidx) > -1) continue;
        x_idx[x_idx.length] = xrandidx;
    }  
    //console.log(x_idx)
      
    while(y_idx.length < trial.stimuli.length){
        var yrandidx = Math.floor(Math.random()*hdiv.length);
        if(y_idx.indexOf(yrandidx) > -1) continue;
        y_idx[y_idx.length] = yrandidx;
    }
    //console.log(y_idx)
    
    for (var i = 0; i < trial.stimuli.length; i++) {
      //wdiv.push(i*(trial.sort_area_width - trial.stim_width)/trial.stimuli.length); // divide screen into segments based on number stim
      //hdiv.push(i*(trial.sort_area_height - trial.stim_height)/trial.stimuli.length); 
        
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

    //display_element.innerHTML += '<button id="jspsych-free-sort-done-btn" class="jspsych-btn">'+trial.button_label+'</button>';

    //var maxz = 1;

    //var moves = [];

    //var draggables = display_element.querySelectorAll('.jspsych-free-sort-static-draggable');

    /*for(var i=0;i<draggables.length; i++){
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
    }*/

    //display_element.querySelector('#jspsych-free-sort-static-done-btn').addEventListener('click', function(){
      
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
        //"moves": JSON.stringify(moves),
        //"final_locations": JSON.stringify(final_locations),
        //"rt": rt
      };

      // advance to next part
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
    }, trial.stim_duration);


  };

  // helper functions

    
   

  /*function random_coordinate(wdiv, hdiv, x_idx,y_idx,i) {
      //for (var w = 0; w < numImgs; w++){
          //wdiv.push(w*max_width/numImgs); // divide screen into segments based on number stim
          //hdiv.push(w*max_height/numImgs); //** too many loops pushed
      //}
      //console.log('w,h:',wdiv,hdiv)
     //START HERE 2/16/18 ****
    
      //need set of unique indexes of length equal to number of possible positions
      //var rnd_x = Math.floor(Math.random()*numImgs);
      //var rnd_y = Math.floor(Math.random()*numImgs); 
    //var rnd_x = Math.floor(Math.random() * (max_width - 1));
    //var rnd_y = Math.floor(Math.random() * (max_height - 1));
      //console.log(rnd_x);
      //console.log(rnd_y); //will likely need to set these possible positions so they dont overlap
      //rnd_x = wdiv[x_idx[i]]
    wdiv.push(i*trial.sort_area_width - trial.stim_width/trial.stimuli.length); // divide screen into segments based on number stim
    hdiv.push(i*trial.sort_area_height - trial.stim_height/trial.stimuli.length); 
      
    return {
      //x: wdiv[rnd_x],
      x: wdiv[x_idx[i]],
      y: hdiv[x_idx[i]],
      //y: hdiv[rnd_y]
    };
  }*/

  return plugin;
})();
