/**
 * code based on jspsych-survey-text
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
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
          // rows: {
          //   type: jsPsych.plugins.parameterType.INT,
          //   pretty_name: 'Rows',
          //   array: true,
          //   default: 1,
          //   description: 'The number of rows for the response text box.'
          // },
          // columns: {
          //   type: jsPsych.plugins.parameterType.INT,
          //   pretty_name: 'Columns',
          //   array: true,
          //   default: 40,
          //   description: 'The number of columns for the response text box.'
          // }
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

    // if (typeof trial.questions[0].rows == 'undefined') {
    //   trial.questions[0].rows = [];
    //   for (var i = 0; i < trial.questions.length; i++) {
    //     trial.questions[i].rows.push(1);
    //   }
    // }
    // if (typeof trial.questions[0].columns == 'undefined') {
    //   trial.questions[0].columns = [];
    //   for (var i = 0; i < trial.questions.length; i++) {
    //     trial.questions[i].columns.push(40);
    //   }
    // }
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

    // see exp.html file for writeText function

    // add questions and text entry fields
    // for (var i = 0; i < trial.questions.length; i++) {
    //   html += '<div id="jspsych-survey-text-custom-"'+i+'" class="jspsych-survey-text-custom-question" style="margin: 2em 0em;">';
    //   html += '<p class="jspsych-survey-text-custom">' + trial.questions[i].prompt + '</p>';
    //   if(trial.questions[i].rows == 1){ //check this case too
    //     html += '<input type="text" id = "recall-text" name="#jspsych-survey-text-custom-response-' + i + '" size="'+trial.questions[i].columns+'" value="'+trial.questions[i].value+'" required></input>';
    //   } else {
    //     html += '<textarea id = "recall-text" onkeyup=writeText(this) name="#jspsych-survey-text-custom-response-' + i + '" cols="' + trial.questions[i].columns + '" rows="' + trial.questions[i].rows + '" required>'+trial.questions[i].value+'</textarea>';
    //   }
    //   html += '</div>';
    // }

    // NEW VERSION
    for (var i = 0; i < trial.questions.length; i++) { //TODO: change this to number of responses
      html += '<div id="jspsych-survey-text-custom-"'+i+'" class="jspsych-survey-text-custom-question" style="margin: 2em 0em;">';
      html += '<p class="jspsych-survey-text-custom">' + trial.questions[i].prompt + '</p>';
      //if(trial.questions[i].rows == 1){ //check this case too
      if (trial.questions[i].recall_mode == 'word'){
      html += '<input type="text" id = "recall-box" onkeyup=writeWords(this) style="text-transform:uppercase" name="#jspsych-survey-text-custom-response-' + i + '" size="'+50+'" value="'+trial.questions[i].value+'" required></input><br />';
      //} else {
      //  html += '<textarea id = "recall-text" onkeyup=writeText(this) name="#jspsych-survey-text-custom-response-' + i + '" cols="' + trial.questions[i].columns + '" rows="' + trial.questions[i].rows + '" required>'+trial.questions[i].value+'</textarea>';
      //}
    } else if (trial.questions[i].recall_mode == 'narrative') { //movie/story recall
          html += '<input type="text" id = "recall-box" onkeyup=writeNarrative(this) name="#jspsych-survey-text-custom-response-' + i + '" size="'+150+'" value="'+trial.questions[i].value+'" required></input><br />';
      }
      html += '</div>';
    }


    // add submit button (removed since on timer)
    //html += '<button id="jspsych-survey-text-custom-next" class="jspsych-btn jspsych-survey-text-custom">'+trial.button_label+'</button>';

    display_element.innerHTML = html;


    //display_element.querySelector('#jspsych-survey-text-custom-next').addEventListener('click', function() {
    var recallTimer = function() {
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      var matches = display_element.querySelectorAll('div.jspsych-survey-text-custom-question');
      for(var index=0; index<matches.length; index++){
        var id = "Q" + index;
        //var val = matches[index].querySelector('textarea, input').value;
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

      //NOTE: ADDED RESET or will just keep appending values in new trials
      allwordsrecalled = []
      //alltextrecalled =[]

      display_element.innerHTML = '';

      //save data
      jsPsych.finishTrial(trialdata);
    };

    // ADDED: move on to next trial after timer finished (set recall time in config file)
    jsPsych.pluginAPI.setTimeout(recallTimer,trial.recall_time*1000) //needs to be converted to ms

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
