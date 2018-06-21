/**
 * jspsych-survey-dropdown
 * a jspsych plugin for dropdown menus based on plugin for multiple choice survey questions
 *
 */


jsPsych.plugins['survey-dropdown'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'survey-dropdown',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        nested: {
          prompt: {type: jsPsych.plugins.parameterType.STRING,
                     pretty_name: 'Prompt',
                     default: undefined,
                     description: 'The strings that will be associated with a group of options.'},
          options: {type: jsPsych.plugins.parameterType.STRING,
                     pretty_name: 'Options',
                     array: true,
                     default: undefined,
                     description: 'Displays options for an individual question.'},
          default_text: {
                     type: jsPsych.plugins.parameterType.STRING,
                     pretty_name: 'Default Text',
                     array: true,
                     default: undefined,
                     description: 'Text that displays in dropdown by default, above options.'},
          required: {type: jsPsych.plugins.parameterType.BOOL,
                     pretty_name: 'Required',
                     default: false,
                     description: 'Subject will be required to pick an option for each question.'},
        }
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'Label of the button.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    var plugin_id_name = "jspsych-survey-dropdown";
    var plugin_id_selector = '#' + plugin_id_name;
    var _join = function( /*args*/ ) {
      var arr = Array.prototype.slice.call(arguments, _join.length);
      return arr.join(separator = '-');
    }

    // inject CSS for trial
    /*display_element.innerHTML = '<style id="jspsych-survey-dropdown-css"></style>';
    var cssstr = ".jspsych-survey-dropdown-question { margin-top: 2em; margin-bottom: 2em; text-align: left; }"+
      ".jspsych-survey-dropdown-text span.required {color: darkred;}"+
      ".jspsych-survey-dropdown-option { line-height: 2; }"+
      "label.jspsych-survey-dropdown-text input[type='radio'] {margin-right: 1em;}"*/

    //display_element.querySelector('#jspsych-survey-dropdown-css').innerHTML = cssstr;

    // form element
    var trial_form_id = _join(plugin_id_name, "form");
    display_element.innerHTML += '<form id="'+trial_form_id+'"></form>';
    var trial_form = display_element.querySelector("#" + trial_form_id);
    // show preamble text
    var preamble_id_name = _join(plugin_id_name, 'preamble');
    if(trial.preamble !== null){
      trial_form.innerHTML += '<div id="'+preamble_id_name+'" class="'+preamble_id_name+'">'+trial.preamble+'</div>';
    }
    // add multiple-choice questions
    for (var i = 0; i < trial.questions.length; i++) {
        // create question container
        var question_classes = [_join(plugin_id_name, 'question')];

        trial_form.innerHTML += '<div id="'+_join(plugin_id_name, i)+'" class="'+question_classes.join(' ')+'"></div>';

        var question_selector = _join(plugin_id_selector, i);

        // add question text
        display_element.querySelector(question_selector).innerHTML += '<p class="' + plugin_id_name + '-text survey-dropdown">' + trial.questions[i].prompt + '</p>';
        display_element.querySelector(question_selector).innerHTML += '<select id="dropDown"><option>' + trial.questions[i].default_text + '</option></select>'

      // create option dropdown (instead of radio buttons)
      for (var j = 0; j < trial.questions[i].options.length; j++) {

        var select = document.getElementById("dropDown");
        var opt = trial.questions[i].options[j];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);

      //   var option_id_name = _join(plugin_id_name, "option", i, j),
      //   option_id_selector = '#' + option_id_name;
      //
      //   // add radio button container
      //   display_element.querySelector(question_selector).innerHTML += '<div id="'+option_id_name+'" class="'+_join(plugin_id_name, 'option')+'"></div>';
      //
      //   // add label and question text
      //   var form = document.getElementById(option_id_name)
      //   var input_name = _join(plugin_id_name, 'response', i);
      //   var input_id = _join(plugin_id_name, 'response', i, j);
      //   //var label = document.createElement('label');
      //   //label.setAttribute('class', plugin_id_name+'-text');
      //   //label.innerHTML = trial.questions[i].options[j];
      //   //label.setAttribute('for', input_id)
      //
      //   if (j === 0) { //if first option in question, begin dropdown
      //     display_element.querySelector(question_selector).innerHTML += '<select id = "dropdown-list">'
      //   //}else if (j < trial.questions[i].options.length-1) { //otherwise if not last item
      //     //display_element.querySelector(question_selector).innerHTML += '<option value="' + trial.questions[i].options[j] + '">' + trial.questions[i].options[j] + '</option>'
      //   }else { //otherwise if last item, close off select
      //     //display_element.querySelector(question_selector).innerHTML += '<option value="' + trial.questions[i].options[j] + '">' + trial.questions[i].options[j] + '</option>'
      //     display_element.querySelector(question_selector).innerHTML += '</select>'
      //   }
      //   display_element.querySelector(question_selector).innerHTML += '<option value="' + trial.questions[i].options[j] + '">' + trial.questions[i].options[j] + '</option>'
      //
      //   /*// create radio button
      //   var input = document.createElement('input');
      //   input.setAttribute('type', "radio");
      //   input.setAttribute('name', input_name);
      //   input.setAttribute('id', input_id);
      //   input.setAttribute('value', trial.questions[i].options[j]);
      //   form.appendChild(label);
      //   form.insertBefore(input, label);*/
      // }
      //
      if (trial.questions[i].required) {
         // add "question required" asterisk
         display_element.querySelector(question_selector + " p").innerHTML += "<span class='required'>*</span>";
       }
        // add required property
        //display_element.querySelector(question_selector + " input[type=radio]").required = true;
      }
    }
    // add submit button
    trial_form.innerHTML += '<input id="'+plugin_id_name+'-next" class="'+plugin_id_name+' jspsych-btn"' + (trial.button_label ? ' value="'+trial.button_label + '"': '') + '></input>';
    //type="submit"

    document.getElementById(plugin_id_name+'-next').onclick = function() {
      //alert("button was clicked");
    //}​;​

    //trial_form.addEventListener('submit', function(event) {
      //var opt = document.getElementById("dropDown");
      //var val = opt.options[opt.selectedIndex].text;
      //if (val === trial.questions[0].default_text){ //if haven't selected an option for first q (currently only supports 1 question)
      //  alert('Please select an option on the dropdown menu.')
      //}else{
        event.preventDefault();
        var matches = display_element.querySelectorAll("div." + plugin_id_name + "-question");
        // measure response time
        var endTime = (new Date()).getTime();
        var response_time = endTime - startTime;

        // create object to hold responses
        var question_data = {};
        var matches = display_element.querySelectorAll("div." + plugin_id_name + "-question");
        for(var i=0; i<matches.length; i++){
          match = matches[i];
          var id = "Q" + i;
          //if(match.querySelector("input[type=radio]:checked") !== null){
          //  var val = match.querySelector("input[type=radio]:checked").value;
          //} else {
          //  var val = "";
          //}
          var opt = document.getElementById("dropDown");
          var val = opt.options[opt.selectedIndex].text;

          //if want to check whether response entered
          /*if(val === trial.questions[0].default_text){ //if no response was recorded, enter empty string
            val = ''
          }*/

          var obje = {};
          obje[id] = val;
          Object.assign(question_data, obje);
        }
        // save data
        var trial_data = {
          "rt": response_time,
          "responses": JSON.stringify(question_data)
        };
        display_element.innerHTML = '';

        // next trial
        jsPsych.finishTrial(trial_data);
      }
    //}//);

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
