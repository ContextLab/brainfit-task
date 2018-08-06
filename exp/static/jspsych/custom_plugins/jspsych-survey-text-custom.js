/**
 * code based on jspsych-survey-text - modified by G. Notaro
 * the modified jspsych free-response survey plugin for entering free-response text and disappearing when certain keys pressed
 *
 */

//set up for recording uneditable free-recall text

jsPsych.plugins['survey-text-custom'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'survey-text-custom',
    description: '',
    parameters: {
      recall_time: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Timer',
        default: 60000, //60 seconds
        description: 'Time to enter recall responses before continuing on to next page (in seconds)'
      },
      button_appear_time: {
        type:  jsPsych.plugins.parameterType.INT, //number of seconds to wait before button appears if can no longer recall
        pretty_name: 'Button Timer',
        default: 0, // won't appear if set == 0
        description: 'Time to wait before displaying button to continue on to the next page (in seconds, typically shorter than recall_time)'
      },
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        default: undefined,
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'Prompts for the subject to response'
          },
          value: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Value',
            array: true,
            default: null,
            description: 'The strings will be used to populate the response fields with editable answers.'
          },
          recall_mode: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Mode',
            default: 'word',
            description: 'This will switch between word recall mode and narrative recall mode.'
          },
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
        description: 'The text that appears on the button to finish the trial.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    if (typeof trial.questions[0].value == 'undefined') {
      trial.questions[0].value = [];
      for (var i = 0; i < trial.questions.length; i++) {
        trial.questions[i].value.push("");
      }
    }

    var html = '';
    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-survey-text-custom-preamble" class="jspsych-survey-text-custom-preamble">'+trial.preamble+'</div>';
    }

    // NEW VERSION
    for (var i = 0; i < trial.questions.length; i++) { //TODO: change this to number of responses
      html += '<div id="jspsych-survey-text-custom-"'+i+'" class="jspsych-survey-text-custom-question" style="margin: 2em 0em;">';
      html += '<p class="jspsych-survey-text-custom">' + trial.questions[i].prompt + '</p>';
      //if(trial.questions[i].rows == 1){ //check this case too
      if (trial.questions[i].recall_mode == 'word'){
      html += '<input type="text" id = "recall-box" onkeyup=writeWords(this) style="text-transform:uppercase" name="#jspsych-survey-text-custom-response-' + i + '" size="'+50+'" value="'+trial.questions[i].value+'" required></input><br />';
    } else if (trial.questions[i].recall_mode == 'narrative') { //movie/story recall
          html += '<input type="text" id = "recall-box" onkeyup=writeNarrative(this) name="#jspsych-survey-text-custom-response-' + i + '" size="'+150+'" value="'+trial.questions[i].value+'" required></input><br />';
      }
      html += '</div>';
    }

    //put button on page but disable until timer up
    html += '<button id="jspsych-survey-text-custom-next" class="jspsych-btn jspsych-survey-text-custom" disabled>'+trial.button_label+'</button>'
    display_element.innerHTML = html;

    // add submit button after nseconds
    var stopTimer = false // need this

    if(trial.button_appear_time!==0){ //don't make clickable at all if set to 0, can change to be anything else **
      setTimeout(function(){
        document.getElementById("jspsych-survey-text-custom-next").disabled = false; //enable after timer
        //also need event listener for button click to finish trial (only after button has appeared)
        display_element.querySelector('#jspsych-survey-text-custom-next').addEventListener('click',recallTimer) }, trial.button_appear_time*1000) //needs to be in ms, less than duration of trial (trial.recall_time)
      }

      display_element.innerHTML = html

    var recallTimer = function() {
      if(stopTimer === false){ //only run if recall timer has not yet been run (i.e. via a button click)
        // measure response time
        var endTime = (new Date()).getTime();
        var response_time = endTime - startTime;

        stopTimer = true

        // create object to hold responses
        var question_data = {};
        var matches = display_element.querySelectorAll('div.jspsych-survey-text-custom-question');
        for(var index=0; index<matches.length; index++){
          var id = "Q" + index;
          allwordsrecalled.push(matches[index].querySelector('textarea, input').value)
          allwordtimings.push(Date.now()) //add end time
          var val = allwordsrecalled //also add in whatever was left in text entry area
          var obje = {};
          obje[id] = val;
          Object.assign(question_data, obje);
        }
        // save data
        var trialdata = {
          "rt": response_time,
          "responses": JSON.stringify(question_data), //typed responses
          "response_times": allwordtimings //array of response times
        };

        allwordsrecalled = []
        allwordtimings = []

        display_element.innerHTML = '';

        //save data
        jsPsych.finishTrial(trialdata);
      }
    };

    jsPsych.pluginAPI.setTimeout(recallTimer,trial.recall_time*1000) // converted to ms

    var startTime = (new Date()).getTime();

  };

  return plugin;
})();
