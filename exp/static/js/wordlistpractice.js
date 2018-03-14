var recPracticeWords = [];
var nReps = 0;

// create a timer function that turns off the microphone
var startTimer = function(timeSecs) {
    console.log("timer started")
    setTimeout(function() {
        $(".mic").remove();
        annyang.abort();
        console.log('Microphone turned off.');
    }, timeSecs * 1000);
};

//begin code
var wordListPractice = function() {

    var wordListPracticeTimeline = [];
    var instructions_wordListPractice = {
        type: "instructions",
        pages: ["<h1> Part I. Word List Recall Practice </h1>"+
            "<p> In the initial task, you will see a sequence of words appear in the middle of the screen, one at a time. </p>" + "<p> Your task will be to remember these words and recite them out loud, in the order you saw them presented, to the best of your ability.</p> <p> Please make sure your speakers are turned up and microphone are turned on for this section and remain on for the remainder of the task. </p>",
            "<p> Following each word list, you will see the following icon: <i style='color:red' class='fa fa-microphone'></i>. This indicates that the computer microphone has started recording.</p> <p> From that point on, you will recite all of the words you remember from the list you just saw, in any order.</p>",
            "<p>Let's try a quick practice round. </p> <p>In this practice list, you will see a total of three words, presented one at a time.</p>" +
            "<p>Then, when you see the red microphone icon <i style='color:red' class='fa fa-microphone'></i>, try to recall as many words as you can. You will have have " + practiceRecordTime + " seconds to recite these words. </p>" +
            "<p> Please speak <strong>slowly</strong> and <strong>clearly</strong>, and close to your computer.</p>"
        ],
       show_clickable_nav: true

    };
    wordListPracticeTimeline.push(instructions_wordListPractice);



    // create an array of objects for the practice round
    practiceWords.forEach(function(word) {

    // create each practice trial
    var block_practiceWords = {
        type: 'html-keyboard-response',
        stimulus: "<div style='font-size:64px'>" + word + "</div>",
        choices: jsPsych.NO_KEYS,
        stimulus_duration: wordPresTime*1000, //ms,1000,
        trial_duration: (wordIntertrialTime+wordPresTime)*1000,//ms, 1500, //stim dur + isi dur
        };

    wordListPracticeTimeline.push(block_practiceWords);
    });

    // practice instructions
    var instructions_wordListRecite = {
        type: "instructions",
        pages: ["<p>Here is an example of how you should recite the words. Push the play button to listen.</p>" +
        "<audio id='sound1' src='static/files/practice.m4a' preload='auto'></audio>" +
        "<button style='background-color:white; outline:none' class='btn btn-large' onclick='document.getElementById(" + '"sound1"' + ").play();'><i class='fa fa-play-circle-o fa-5x'></i></button>" + "<p>Now you give it a try. Remember to speak <strong>slowly</strong> and <strong>clearly</strong>.</p>" +
        "<p> Please say <strong>"+
        practiceWords[0] + "..."
        + practiceWords[1] + "..."
        + practiceWords[2] + "</strong> on the next screen once the red microphone appears.</p>"],
        show_clickable_nav: true
    };
    wordListPracticeTimeline.push(instructions_wordListRecite);


    // create the practice test, which call the testPractice function
    var practiceTest = {
        type: 'call-function-custom',
        func: testPractice,
        post_trial_gap: practiceRecordTime * 1000, //updated to new jspysch
    };
    wordListPracticeTimeline.push(practiceTest);

    //if (typeof practicePass !== 'undefined') {
    try {

        /*
        if (nReps > 4) {
          display_element.querySelector(".fail-message").innerHTML = '<span style="color: red;" class="required"> You have failed the practice test. Please notify the experimenter.</span>';// if failed more than 5 times, alert and quit exp
          console.log('practice failed 5 times.')
          console.log(nReps)
        } else {
            nReps = nReps+1 // increment fail counter
            console.log(nReps)
        }
        */

        if (recPracticeWords.length === 0) { //also need condition if no words are spoken
                practicePass = false;
        }
        // go here if the practice test doesn't work
        var fail = {
            type: 'instructions',
            pages: ["<p> Oops! The practice test didn't work. </p> <p> Please say <strong>" + practiceWords[0] + "..."
            + practiceWords[1] + "..."
            + practiceWords[2] +
            "</strong> after the red microphone icon <i style='color:red' class='fa fa-microphone'> </i> appears on the next page. </p>"],
            show_clickable_nav: true,
            data: {
                passed: false,
                //recPracticeWords: recPracticeWords,
            },
        };

        // create practice fail loop
        var fail_loop = {
            timeline: [fail, practiceTest],
            loop_function: function() {
                if (practicePass === false) {
                    return true;
                } else if (practicePass === true) {
                    return false;
                }
            }
        };

        // only go into this loop if the practice test fails
        var if_failed = {
            timeline: [fail_loop],
            conditional_function: function() {
                if (practicePass === false) {
                    return true;
                } else if (practicePass === true) {
                    return false;
                }
            }
        };
        wordListPracticeTimeline.push(if_failed);


        var success = {
            type: 'instructions',
            pages: ["<p>That's it!</p> <p>Try to do the same for the next section when the red microphone icon <i style='color:red' class='fa fa-microphone'> </i> appears. You are now ready to start the task.</p>"],
            data: {
                passed: true,
                //recPracticeWords: recPracticeWords,
            },
            show_clickable_nav: true,
        };

        // create success condition
        var if_success = {
            timeline: [success],
            conditional_function: function() {
                if (practicePass === true) {
                    return true;
                } else if (practicePass === false) {
                    return false;
                }
            }
        };
        wordListPracticeTimeline.push(if_success);
    } catch (err) {
        //else{
        //console.log('practicePass undefined')
        console.log('practicePass likely is undefined. Error: ' ,err)
    }
    return wordListPracticeTimeline;
};

////////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var testPractice = function() {
    //if (practicePass === false) {
        var recPracticeWords = []; //wipes out from outputting so defined globally
    //}
    var $mic = $("<p class='mic' style='position:absolute;top:35%;left:47%;font-size:10vw;color:red'><i class='fa fa-microphone blink_me'></i></p>")
    $(".jspsych-display-element").append($mic);
    if (annyang) {
        var test = function(check) {
            splitWords = check.split(" ")
            for (word in splitWords) {
                recPracticeWords.push(splitWords[word].toUpperCase())
            }
            console.log('recorded:', recPracticeWords)
            console.log('practice words:', practiceWords)
            console.log(_.isEqual(recPracticeWords, practiceWords))
            if (_.isEqual(recPracticeWords, practiceWords)) {
                practicePass = true;
                console.log('test passed');
                $(".mic").remove();
                //var $micSuccessMessage = $("<div class='instructions'><p id='mic-success-message'><p>That's it!</p><p>Try to do the same throughout the experiment. You are now ready to start.</p><p>Let's move on.</p></div>")
                //$(".jspsych-display-element").append($micSuccessMessage);
                annyang.abort();
                return practicePass
            }else {
                //testPass = false;
                practicePass = false;
                return practicePass
            }
        }
    }
    var abort = function() {
        annyang.abort();
    };
    // Define commands
    var commandsPracticeTest = {
        '*shell': test,
        'turn off mic(rophone)': abort
    };

    annyang.debug(); // Debug info for the console
    annyang.removeCommands();
    annyang.addCommands(commandsPracticeTest); // Initialize annyang with our commands
    annyang.start();
    console.log('Microphone turned on.');
    startTimer(practiceRecordTime);

};
