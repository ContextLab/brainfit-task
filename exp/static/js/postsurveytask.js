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

    var options_instr_clarity = ['Very Clear','Clear','Unclear','Very Unclear']

    var instr_clarity_qs = {
        type: 'survey-multi-select-custom',
        preamble: '<b>The first set of questions is related to how clear (or confusing) you thought the instructions questions were for each section. </b>',
        questions: [{prompt: "<b>Overall Instructions</b>", options: options_instr_clarity, horizontal: false},
                    {prompt: "<b>Fitbit Data Authorization</b>", options: options_instr_clarity, horizontal: false},
                    {prompt: "<b>Survey Questions</b>", options: options_instr_clarity, horizontal: false},
                    {prompt: "<b>Word List Recall</b>", options: options_instr_clarity, horizontal: false},
                    {prompt: "<b>Movie Recall and Quiz</b>", options: options_instr_clarity, horizontal: false},
                    {prompt: "<b>Vocabulary Pairs Quiz</b>", options: options_instr_clarity, horizontal: false},
                    {prompt: "<b>Spatial Shapes Task</b>", options: options_instr_clarity, horizontal: false},
                    {prompt: "<b>Delayed Word List Recall</b>", options: options_instr_clarity, horizontal: false},
                    {prompt: "<b>Delayed Movie Recall</b>", options: options_instr_clarity, horizontal: false},
                    {prompt: "<b>Delayed Vocabulary Pairs Quiz</b>", options: options_instr_clarity, horizontal: false},
                  ],
         required: true,
    };
    postSurveyTimeline.push(instr_clarity_qs)

    var options_multi_task = ['Overall Instructions', 'Survey Questions', 'Word List Recall', 'Movie Recall and Quiz', 'Vocabulary Pairs Quiz', 'Spatial Shapes Task','Delayed Word List Recall', 'Delayed Movie Recall', 'Delayed Vocabulary Pairs Quiz']

    var task_q_array = []
    for (var q = 0; q < options_multi_task.length; q++ ){
      task_q_array.push({prompt: '<b>' + options_multi_task[q] + '</b>', value: ' ', rows: 4, columns: 50})
    }
    //console.log(task_q_array)

    var instr_clarity_text = {
        type: 'survey-text',
        preamble: '<b>If you marked any of the sections as "Very Unclear" or "Unclear", please describe what you found confusing. Also indicate whether (and how) you feel it affected your performance on the task. </b>',
        questions: task_q_array,
    };
    postSurveyTimeline.push(instr_clarity_text)

    var options_instr_difficulty = ['Very Difficult', 'Difficult', 'Medium', 'Easy', 'Very Easy']

    var instr_difficulty_qs = {
        type: 'survey-multi-select-custom',
        preamble: '<b>Now we would like to know how difficult you found each task section to be. </b>',
        questions: [{prompt: "<b>Word List Recall</b>", options: options_instr_difficulty, horizontal: false},
                    {prompt: "<b>Movie Recall and Quiz</b>", options: options_instr_difficulty, horizontal: false},
                    {prompt: "<b>Vocabulary Pairs Quiz</b>", options: options_instr_difficulty, horizontal: false},
                    {prompt: "<b>Spatial Shapes Task</b>", options: options_instr_difficulty, horizontal: false},
                    {prompt: "<b>Delayed Word List Recall</b>", options: options_instr_difficulty, horizontal: false},
                    {prompt: "<b>Delayed Movie Recall</b>", options: options_instr_difficulty, horizontal: false},
                    {prompt: "<b>Delayed Vocabulary Pairs Quiz</b>", options: options_instr_difficulty, horizontal: false},
                  ],
         required: true,
    };
    postSurveyTimeline.push(instr_difficulty_qs)

    var options_multi_task_diff = ['Word List Recall','Movie Recall and Quiz','Vocabulary Pairs Quiz','Spatial Shapes Task','Delayed Word List Recall','Delayed Movie Recall','Delayed Vocabulary Pairs Quiz']
    var task_q_array_diff = []
    for (var q = 0; q < options_multi_task_diff.length; q++ ){
      task_q_array_diff.push({prompt: '<b>' + options_multi_task_diff[q] + '</b>', value: ' ', rows: 4, columns: 50})
    }
    //console.log(task_q_array_diff)


    var instr_difficulty_text = {
        type: 'survey-text',
        preamble: '<b>If you marked any of the sections as "Very Difficult" or "Difficult", please describe which aspects were challenging. Also indicate whether (and how) you feel it affected your performance on the task, and what we can do to improve these sections. </b>',
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
