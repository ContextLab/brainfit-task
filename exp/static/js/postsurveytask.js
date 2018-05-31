var postSurveyTask = function() {
    var postSurveyTimeline = [];

    var options_multi_task = ['Overall','Word List Recall', 'Movie Recall and Quiz', 'Vocab Pairs Quiz', 'Spatial Task','Delayed Word List Recall', 'Delayed Movie Recall', 'Delayed Vocab Pairs Quiz','None','Do not wish to provide feedback']

    var ratings_q = {
        type: 'survey-multi-select-custom',
        preamble: '<b>Thank you for your time! Please answer a few questions on this study so that we can improve our task for future users.</b>',
        questions: [{prompt: "<b>The instructions for the following sections were clear (check all that apply):</b>", options: options_multi_task, horizontal: false},
                    {prompt: "<b>The instructions for the following sections were unclear (check all that apply):</b>", options: options_multi_task, horizontal: false},
                    {prompt: "<b>There was enough time to complete the following sections (check all that apply):</b>", options: options_multi_task, horizontal: false},
                    {prompt: "<b>There was too much time given in the following sections (check all that apply):</b>", options: options_multi_task, horizontal: false},
                    {prompt: "<b>There was too little time given in the following sections (check all that apply):</b>", options: options_multi_task, horizontal: false},
                    {prompt: "<b>The following sections were of moderate difficulty (check all that apply):</b>", options: options_multi_task, horizontal: false},
                    {prompt: "<b>The following sections were easy (check all that apply):</b>", options: options_multi_task, horizontal: false},
                    {prompt: "<b>The following sections were difficult (check all that apply):</b>", options: options_multi_task, horizontal: false},
                  ],
        required: true,
    };
    postSurveyTimeline.push(ratings_q)


    var compensate_q = {
      type: 'survey-multi-choice',
      questions: [{prompt: "<b>Do you feel you were appropriately compensated for your time?", options: ['Yes','No']},
                  {prompt: "<b>If no, what is a more realistic payment for this task?", options: ['N/A (compensation suitable)','$5','$10','$15','$20','More than $20']}]
    }
    postSurveyTimeline.push(compensate_q)

    var feedback_q = {
        type: 'survey-text',
        questions: [{prompt: '<b>Any additional comments or feedback:</b>', value: ' ', rows: 4, columns: 50},]
    }
    postSurveyTimeline.push(feedback_q)


    // The instructions for the following sections were clear (check all that apply)
    // The instructions for the following sections were unclear (check all that apply)
    //
    // There was enough time to complete the following sections (check all that apply)
    // There was too much time given in the following sections (check all that apply)
    // There was too little time given in the following sections (check all that apply)
    //
    // The following sections were of moderate difficulty
    // The following sections were easy
    // The following sections were difficult
    //
    // Do you feel you were appropriately compensated for your time?
    //
    // Any additional comments or feedback:

    return postSurveyTimeline
  }
