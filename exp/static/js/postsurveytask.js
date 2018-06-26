var postSurveyTask = function() {
    var postSurveyTimeline = [];

    //var options_multi_task = ['Overall','Word List Recall', 'Movie Recall and Quiz', 'Vocab Pairs Quiz', 'Spatial Task','Delayed Word List Recall', 'Delayed Movie Recall', 'Delayed Vocab Pairs Quiz','None','Do not wish to provide feedback']

    // var ratings_q = {
    //     type: 'survey-multi-select-custom',
    //     preamble: '<b>Thank you for your time! Please answer a few questions on this study so that we can improve our task for future users.</b>',
    //     questions: [{prompt: "<b>The instructions for the following sections were clear (check all that apply):</b>", options: options_multi_task, horizontal: false},
    //                 {prompt: "<b>The instructions for the following sections were unclear (check all that apply):</b>", options: options_multi_task, horizontal: false},
    //                 {prompt: "<b>There was enough time to complete the following sections (check all that apply):</b>", options: options_multi_task, horizontal: false},
    //                 {prompt: "<b>There was too much time given in the following sections (check all that apply):</b>", options: options_multi_task, horizontal: false},
    //                 {prompt: "<b>There was too little time given in the following sections (check all that apply):</b>", options: options_multi_task, horizontal: false},
    //                 {prompt: "<b>The following sections were of moderate difficulty (check all that apply):</b>", options: options_multi_task, horizontal: false},
    //                 {prompt: "<b>The following sections were easy (check all that apply):</b>", options: options_multi_task, horizontal: false},
    //                 {prompt: "<b>The following sections were difficult (check all that apply):</b>", options: options_multi_task, horizontal: false},
    //               ],
    //     required: true,
    // };
    // postSurveyTimeline.push(ratings_q)
    var instr_postsurvey = {
      type: 'instructions',
      pages: ['<h1>Post-Survey</h1><p>Thank you for your time and your contributions to science! Please answer a few questions on this study so that we can improve our task for future participants. We will first ask you about how clear our instructions were, and then we will ask you to rate how difficult each of the task sections were. </p>'],
      show_clickable_nav: true
    }
    postSurveyTimeline.push(instr_postsurvey)

    var options_instr_clarity = ['Very clear','Clear','Unclear','Very unclear']

    var instr_clarity_qs1 = {
        type: 'survey-multi-choice',
        preamble: '<b>The first set of questions is related to how clear (or confusing) you thought the instructions questions were for each section. </b>',
        questions: [{prompt: "<b>Overall instructions</b>", options: options_instr_clarity, horizontal: false, required: true},
                    {prompt: "<b>Fitbit data authorization</b>", options: options_instr_clarity, horizontal: false, required: true},
                    {prompt: "<b>Survey questions</b>", options: options_instr_clarity, horizontal: false, required: true},
                    {prompt: "<b>Random word lists (word list recall)</b>", options: options_instr_clarity, horizontal: false, required: true},
                    {prompt: "<b>Story memory (movie recall and quiz)</b>", options: options_instr_clarity, horizontal: false, required: true},
                  ],
    };
    postSurveyTimeline.push(instr_clarity_qs1)

    var instr_clarity_qs2 = {
        type: 'survey-multi-choice',
        preamble: '<b>The first set of questions is related to how clear (or confusing) you thought the instructions questions were for each section. </b>',
        questions: [{prompt: "<b>Travel flashcards (vocabulary pairs)</b>", options: options_instr_clarity, horizontal: false, required: true},
                    {prompt: "<b>Locating objects (shapes task)</b>", options: options_instr_clarity, horizontal: false, required: true},
                    {prompt: "<b>Second (delayed) word list recall</b>", options: options_instr_clarity, horizontal: false, required: true},
                    {prompt: "<b>Second (delayed) movie recall</b>", options: options_instr_clarity, horizontal: false, required: true},
                    {prompt: "<b>Second (delayed) vocabulary quiz</b>", options: options_instr_clarity, horizontal: false, required: true},
                  ],
    };
    postSurveyTimeline.push(instr_clarity_qs2)

    var options_multi_task = ['Overall instructions', 'Fitbit data authorization', 'Survey questions', 'Random word lists (word list recall)','Story memory (movie recall and quiz)', 'Travel flashcards (vocabulary pairs)','Locating objects (shapes task)','Second (delayed) word list recall','Second (delayed) movie recall','Second (delayed) vocabulary quiz']

    var task_q_array = []
    for (var q = 0; q < options_multi_task.length; q++ ){
      task_q_array.push({prompt: '<b>' + options_multi_task[q] + '</b>', value: ' ', rows: 4, columns: 50})
    }
    //console.log(task_q_array)

    var instr_clarity_text = {
        type: 'survey-text',
        preamble: '<b>If you marked any of the sections as "Very unclear" or "Unclear", please describe what you found confusing. Also indicate whether (and how) you feel it affected your performance on the task. </b>',
        questions: task_q_array,
    };
    postSurveyTimeline.push(instr_clarity_text)


    var options_instr_difficulty = ['Very difficult', 'Difficult', 'Medium', 'Easy', 'Very easy']

    var instr_difficulty_qs1 = {
        type: 'survey-multi-choice',
        preamble: '<b>Now we would like to know how difficult you found each task section to be. </b>',
        questions: [{prompt: "<b>Random word lists (word list recall)</b>", options: options_instr_difficulty, horizontal: false, required: true},
                    {prompt: "<b>Story memory (movie recall and quiz)</b>", options: options_instr_difficulty, horizontal: false, required: true},
                    {prompt: "<b>Travel flashcards (vocabulary pairs)</b>", options: options_instr_difficulty, horizontal: false, required: true},
                    {prompt: "<b>Locating objects (shapes task)</b>", options: options_instr_difficulty, horizontal: false, required: true},
                  ],
         required: true,
    };
    postSurveyTimeline.push(instr_difficulty_qs1)

    var instr_difficulty_qs2 = {
        type: 'survey-multi-choice',
        preamble: '<b>Now we would like to know how difficult you found each task section to be. </b>',
        questions: [{prompt: "<b>Second (delayed) word list recall</b>", options: options_instr_difficulty, horizontal: false, required: true},
                    {prompt: "<b>Second (delayed) movie recall</b>", options: options_instr_difficulty, horizontal: false, required: true},
                    {prompt: "<b>Second (delayed) vocabulary quiz</b>", options: options_instr_difficulty, horizontal: false, required: true},
                  ],
         required: true,
    };
    postSurveyTimeline.push(instr_difficulty_qs2)

    var options_multi_task_diff = ['Random word lists (word list recall)','Story memory (movie recall and quiz)', 'Travel flashcards (vocabulary pairs)','Locating objects (shapes task)','Second (delayed) word list recall','Second (delayed) movie recall','Second (delayed) vocabulary quiz']
    var task_q_array_diff = []
    for (var q = 0; q < options_multi_task_diff.length; q++ ){
      task_q_array_diff.push({prompt: '<b>' + options_multi_task_diff[q] + '</b>', value: ' ', rows: 4, columns: 50})
    }
    //console.log(task_q_array_diff)

    var instr_difficulty_text = {
        type: 'survey-text',
        preamble: '<b>If you marked any of the sections as "Very difficult" or "Difficult", please describe which aspects were challenging. Also indicate whether (and how) you feel it affected your performance on the task, and what we can do to improve these sections. </b>',
        questions: task_q_array_diff,
    };
    postSurveyTimeline.push(instr_difficulty_text)

    // var compensate_q = {
    //   type: 'survey-multi-choice',
    //   questions: [{prompt: "<b>Do you feel you were appropriately compensated for your time?", options: ['Yes','No']},
    //               {prompt: "<b>If no, what is a more appropriate payment for this task?", options: ['N/A (compensation suitable)','$5','$10','$15','$20','More than $20']}]
    // }
    // postSurveyTimeline.push(compensate_q)

    var feedback_q = {
        type: 'survey-text',
        questions: [{prompt: '<b>Feel free to provide any additional comments or feedback below:</b>', value: ' ', rows: 4, columns: 50},]
    }
    postSurveyTimeline.push(feedback_q)

    return postSurveyTimeline
  }
