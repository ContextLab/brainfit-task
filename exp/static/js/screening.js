var screeningPages = function() {

    var screeningTimeline = [];

    var instructions_main = {
        type: 'instructions',
        pages: ['<h1> Thank you for participating in our study! </h1> <p> We are interested in how memories for different types of information are related, and how memory is affected by fitness and exercise. </p><p>First, you will be asked to provide authorization to your fitness tracker data (specifically, Fitbit). Then, you will answer a few questions about you and your daily habits so we can better understand the data we are gathering.</p><p> Next, you will be presented with several short memory tasks, with task-specific instructions provided at the start of each section. </p>',
        '<h1>Task Overview </h1> <p> The first task involves learning and reciting aloud words from visually-presented word lists. </p> <p> The second task requires viewing a short movie, reciting what you recall from the video, and answering questions on the video content. </p> <p> The third task involves remembering and matching foreign language vocabulary-image pairs. </p> <p> For the fourth task, you will use the mouse to drag and drop shapes on the screen to match the presented arrangement. </p><p> The entire experiment should take approximately 40-50 minutes. Please press Next > to proceed to the initial screening section. </p>', ],
        show_clickable_nav: true
    };
    screeningTimeline.push(instructions_main);

    //initialize options for all screening questions
    var options_age = ['18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75 and older']; // TODO: dropdown list
    var options_gender = ['Male','Female','Other','Prefer Not to Say'];
    var options_ethnicity = ['Hispanic or Latino','Not Hispanic or Latino','Prefer Not to Say']
    var options_race = ['American Indian or Alaska Native', 'Asian', 'Native Hawaiian or Other Pacific Islander','Black or African American','White','Other', 'Prefer Not to Say'];
    var options_languages = ['English','Spanish','French','German', 'Italian', 'Chinese','Japanese','Korean','Vietnamese','Portugese','Turkish', 'Persian', 'Swedish', 'Norwegian Bokmål', 'Danish', 'Welsh','Scottish', 'Czech', 'Greek', 'Arabic', 'Hindi', 'Bengali','Urdu','Russian','Polish','Romanian','Ukranian','Hebrew','Irish','Other','None']; //Gaelic','Swahili','Indonesian'
    var options_caffeine = ['0','1','2','3','4','5','6 or more'];
    var options_water = ['0','1','2','3','4','5','6 or more'];
    var options_exercise_freq = ['0 days per week','1 day per week','2 days per week','3 days per week','4 days per week','5 days per week','6 days per week','7 days per week','8-14 times per week','More than 14 times per week'];
    var options_alert = ['Very sluggish', 'A little sluggish', 'Neutral', 'A little alert', 'Very alert'];
    var options_job = ['Highly Active (e.g., heavy lifting)','Active','Slightly active','Sedentary (e.g., desk job)'];
    var options_residence = ['Rural','Small town','Suburban','Small city','Large city'];
    var options_stressed = ['Very stressed','A little stressed','Neutral','A little relaxed','Very relaxed'];
    var options_school = ['Some high school', 'High school graduate', "Associate's Degree", 'Some college', 'College graduate', 'Some graduate training', "Master's degree", 'Doctorate','Other Graduate/Professional School']
    var options_exercise_motiv = ['Physical Health', 'Mental Health/Wellness', 'Social Reasons', 'External Pressure (Friends, Family, Partner)', 'Feel like I should']
    var options_fit_wear = ['Every Day','Most Days','Some Days','Rarely']
    var options_fitbit_feats = ['Activity Recording/Logging','Sleep Tracking','Food Logs','Water Logs','Weight Logs','Challenges/Badges','Guidance Feature','Community/Social','Alarms/Reminders/Notifcations',]


    var block_screening_p1 = {
        type: 'survey-multi-choice',
        questions: [ {prompt: '<b> What is your age? </b>', options: options_age, required: true}, {prompt: '<b>Gender</b>', options: options_gender, required:true,},]
    };
   screeningTimeline.push(block_screening_p1);

   // incorporate dropdown instead?
   // var age_schema = {
   // form: {form_title: 'Age Q'},
   //    "What is your age?": {type: "dropdown"}
   // };
   //
   // var block_screening_p1 = {
   // type: 'form',
   // schema: age_schema
   // };
   // screeningTimeline.push(block_screening_p1);

   var block_screening_p2 = {
       type: 'survey-multi-choice',
       questions: [{prompt: '<b>Highest Degree Achieved:</b>', options: options_school, required:true,},{prompt: '<b>Ethnicity:</b>', options: options_ethnicity, required:true,},]
   };
   screeningTimeline.push(block_screening_p2);

    var block_screening_p3 = {
        type: 'survey-multi-select-custom',
        questions: [{prompt: "<b>Race</b> (check all that apply):", options: options_race, horizontal: false},],
        required: true,
    };
    screeningTimeline.push(block_screening_p3);

    var block_screening_p4 = {
        type: 'survey-multi-select-custom',
        questions: [{prompt: "<b>Which of these languages are you <i>fluent</i> in?</b>", options: options_languages, horizontal: true},],
        required: true,
    };
    screeningTimeline.push(block_screening_p4);

    var block_screening_p5 = {
        type: 'survey-multi-select-custom',
        questions: [{prompt: "<b>Which of these languages have you learned previously, either formally or informally (even if you are not fluent)?</b>", options: options_languages, horizontal: true}],
        required: true,
    };
    screeningTimeline.push(block_screening_p5);


    var block_screening_p6 = {
        type: 'survey-multi-choice',
        questions: [{prompt: '<b>Do you have any reading impairments or uncorrected vision (e.g. dyslexia, uncorrected near- or far-sightedness, etc.)?</b>', options: ['Yes','No'], required:true,},
                   {prompt: '<b>Do you have normal color vision?</b>', options: ['Yes','No'], required:true,},],
        };
    screeningTimeline.push(block_screening_p6);

    var block_screening_p7 = {
        type: 'survey-text',
        questions: [{prompt: '<b>Are you taking any medications or have you had any recent injuries that could affect your memory or attention? If so, describe below:</b>', value: ' ', rows: 4, columns: 50},]
    };

   screeningTimeline.push(block_screening_p7);

    var block_screening_p8 = {
        type: 'survey-multi-choice',
        questions: [{prompt: '<b>How alert are you feeling?</b>', options: options_alert, required:true,},
                   {prompt: '<b>How stressed do you typically feel?</b>', options: options_stressed, required:true,},],
        };
    screeningTimeline.push(block_screening_p8);


    var block_screening_p9 = {
        type: 'survey-multi-choice',
        questions: [{prompt: '<b>How many cups of coffee and/or caffeinated beverages (e.g. tea, soda) have you had today?</b>', options: options_caffeine, required:true,},
                    {prompt: '<b>How many glasses of water do you consume on a typical day?</b>', options: options_water, required:true,},
                    {prompt: '<b>Which type of setting do you live in?</b>', options:options_residence,required:true,},
                    {prompt: '<b>How much activity does your job require?</b>', options:options_job,required:true,},]
    };

    screeningTimeline.push(block_screening_p9);

    //TODO: might want to split up these questions along two pages
    var block_screening_p10 = {
        type: 'survey-multi-choice',
        questions: [{prompt: '<b>Have you exercised today?</b>', options: ['Yes','No'], required:true,}, {prompt: '<b>Do you plan to exercise later?</b>', options: ['Yes','No'], required:true,},
                    {prompt: '<b>How many days a week do you typically exercise?</b>', options: options_exercise_freq, required:true,},
                    {prompt: '<b>What motivates you to exercise? </b>', options: options_exercise_motiv, required: true, },
                    {prompt: '<b>How often do you remember to wear your fitness tracker?</b>', options: options_fit_wear, required:true,},
                    {prompt: '<b>Have you synced your fitness tracker data to your app today, or is your phone`s Bluetooth currently on?</b>', options: ['Yes','No'], required:true,},
                  ]
    };

    screeningTimeline.push(block_screening_p10);

    var block_screening_p11 = {
        type: 'survey-multi-select-custom',
        questions: [{prompt: "<b>Which Fitbit features do you frequently track or use (check all that apply)?</b>", options: options_fitbit_feats, horizontal: false}],
        required: true,
    };
    screeningTimeline.push(block_screening_p11);

    var block_screening_p12 = {
      type: 'survey-text',
      questions: [{prompt: '<b>What motivates you to wear your fitness tracker?</b>', value: ' ', rows: 4, columns: 50},]
    };

    screeningTimeline.push(block_screening_p12);


 return screeningTimeline
}
