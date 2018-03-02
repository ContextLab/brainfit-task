/*
* Custom Free Recall plugin
*/

jsPsych.plugins["free-recall"] = (function() {

  var plugin = {};

     plugin.info = {
        name: "free-recall",
        parameters: {
          stimulus: {
            type: jsPsych.plugins.parameterType.HTML_STRING, 
            default_value: "<p>stimulus</p>",
          },
          stim_duration: {
            type: jsPsych.plugins.parameterType.INT,
            default_value: 1000, //one second, in ms
          },
         /* list_words: {
            type: jsPsych.plugins.parameterType.STRING,
            default_value: ' ',
            array: true,
          },*/
          record_audio: {
            type: jsPsych.plugins.parameterType.BOOL,
            default_value: false,
          },
          /*speech_recognizer: {
            type: jsPsych.plugins.parameterType.STRING,
            default_value: 'annyang', //or google
          },*/ //add functionality at later point
          /*decode_after_list: {
            type: jsPsych.plugins.parameterType.BOOL,
            default_value: false,
          },
          recalled_words: {
            type: jsPsych.plugins.parameterType.STRING,
            default_value: [],
            array: true,
          },*/
        /*list_number: {
              type: jsPsych.plugins.parameterType.INT,
              default_value: 0,
            }*/ // including list number in identifier
        identifier: {
            type: jsPsych.plugins.parameterType.STRING,
            default_value: 'word-list',
        }
      }
     }
    
    
  plugin.trial = function(display_element, trial) {
    // set default values for parameters
    //trial.list_words = [];
    trial.decode_after_list = false; //is this used?
    trial.recalled_words = [];

      /*
    // set default values for parameters
    trial.trial_duration = trial.trial_duration || 60;
    trial.stim_duration = trial.stim_duration || 60;
    trial.list_words = trial.list_words || [];
    trial.record_audio = trial.record_audio || false;
    trial.speech_recognizer = trial.speech_recognizer || 'annyang';
    trial.decode_after_list = trial.decode_after_list || false;

    trial.recalled_words = [];
    */
      
    // allow variables as functions
    // this allows any trial variable to be specified as a function
    // that will be evaluated when the trial runs. this allows users
    // to dynamically adjust the contents of a trial as a result
    // of other trials, among other uses. you can leave this out,
    // but in general it should be included

    //trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    var setTimeoutHandlers = [];
    
      display_element.innerHTML = trial.stimulus;
    /*display_element.append($('<div>', {
      html: trial.stimulus,
      id: 'jspsych-free-recall-stimulus'
    }));*/

    // hide image if timing is set
    if (trial.stim_duration > 0) {
      var t1 = setTimeout(function() {
        $('#jspsych-free-recall-stimulus').css('visibility', 'hidden');
      }, trial.stim_duration);
      setTimeoutHandlers.push(t1);
    }

    // end trial if time limit is set
    if (trial.trial_duration > 0) {
      var t2 = setTimeout(function() {
        mediaRecorder.stop();;
      }, trial.trial_duration);
      setTimeoutHandlers.push(t2);
    };

    var mediaConstraints = {
      audio: true
    };

    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

    function onMediaSuccess(stream) {
      mediaRecorder = new MediaStreamRecorder(stream);
      mediaRecorder.mimeType = 'audio/wav'; // audio/webm or audio/ogg or audio/wav
      mediaRecorder.audioChannels = 1;
      mediaRecorder.sampleRate = 44100;
      mediaRecorder.ondataavailable = function (blob) {
        var fileType = 'audio'; // or "audio"
        var fileName = uniqueId + '-' + trial.identifier + '.wav';  // or "wav" //trial.list_number + '-' 

        var formData = new FormData();
        formData.append(fileType + '-filename', fileName);
        formData.append(fileType + '-foldername', uniqueId);
        formData.append(fileType + '-blob', blob);

        var request = new XMLHttpRequest();
        request.timeout = 60000; // time in milliseconds

        request.open("POST", "/save-audio");
        //request.open("POST", "/speechtotext"); //from EL
        request.send(formData);

        /*display_element.append($('<div>', {
          html: "<p class='loading'><i class='fa fa-cog fa-spin '></i></p>"
        }));*/
        
        // FOR LIVE DECODING
        //display_element.innerHTML = "<p class='loading'><i class='fa fa-cog fa-spin '></i></p>";
        
        request.onreadystatechange = function() {
          console.log(request) //debug
          if (request.readyState == XMLHttpRequest.DONE) {
            //processAndFinishTrial(request.responseText); //fails here ** replace with quail function
            //request.open("POST", "/quail_decode"); //**need to create function
            console.log('Saved!')

          }
        }
      };
      mediaRecorder.start(99999999999)
      return mediaRecorder
    }

    function onMediaError(e) {
      console.error('media error', e);
    }

      // wont be called unless live decoding
    function processAndFinishTrial(data){
        //original code
      if (data){
        try{
          resp=JSON.parse(data);
          console.log(resp.result) //undefined so throws error 
          trial.recalled_words = JSON.parse(resp.result)
          console.log(trial.recalled_words)
        }catch(e){
          trial.recalled_words = [];
          console.log("Error",e)
        }
      } 
        
        //from EL code //**here
        /*if (data){
            try{
              result=JSON.parse(data);
              trial.recalled_words = [];
              result.results.forEach(function(result){
                result.alternatives[0].transcript.toUpperCase().split(" ")
                .forEach(function(chunk){
                  if(chunk!==''){
                    trial.recalled_words.push(chunk)
                  }
                })
              })
              console.log(trial.recalled_words)
            }catch(e){
              trial.recalled_words = [];
              console.log("Error",e)
            }
        }  */
        

      // kill any remaining setTimeout handlers
      for (var i = 0; i < setTimeoutHandlers.length; i++) {
        clearTimeout(setTimeoutHandlers[i]);
      }

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "stimulus": trial.stimulus,
        //"list_words": trial.list_words,
          "list_words": [],
        "recalled_words": trial.recalled_words,
      };

      jsPsych.data.write(trial_data);

      // clear the display
      display_element.innerHTML = ' ';

      // move on to the next trial
      //** throws error
      jsPsych.finishTrial(trial_data);

    };
  }
return plugin;
})();
