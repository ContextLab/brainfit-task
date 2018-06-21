var screeningPages = function() {

    var screeningTimeline = [];

    var instructions_screening = {
        type: 'instructions',
        pages: ["<h1>Survey Questions: Demographics</h1><p>Now that we have that setup step out of the way, we'd like to get to know you a bit better!  First we’ll ask you some general demographic questions so that we can better interpret the data we are collecting for our study.  When you are ready, press Next to continue.</p>"],
        show_clickable_nav: true
    };
    screeningTimeline.push(instructions_screening);

    //initialize options for all screening questions
    //var options_age = ['18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75 and older']; // TODO: dropdown list
    var options_birthyear = ['2000', '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991', '1990', '1989', '1988', '1987', '1986', '1985', '1984', '1983', '1982', '1981', '1980', '1979', '1978', '1977', '1976', '1975', '1974', '1973', '1972', '1971', '1970', '1969', '1968', '1967', '1966', '1965', '1964', '1963', '1962', '1961', '1960', '1959', '1958', '1957', '1956', '1955', '1954', '1953', '1952', '1951', '1950', '1949', '1948', '1947', '1946', '1945', '1944', '1943','1942','before 1942']
    var options_gender = ['Male','Female','Other','Prefer Not to Say'];
    //var options_ethnicity = ['Hispanic or Latino','Not Hispanic or Latino','Prefer Not to Say']
    var options_race = ['American Indian or Alaska Native', 'Asian', 'Native Hawaiian or Other Pacific Islander','Black or African American','White','Other', 'Prefer Not to Say'];
    var options_languages = ['English','Spanish','French','German', 'Italian', 'Chinese','Japanese','Korean','Vietnamese','Portugese','Turkish', 'Persian', 'Swedish', 'Norwegian Bokmål', 'Danish', 'Welsh','Scottish', 'Czech', 'Greek', 'Arabic', 'Hindi', 'Bengali','Urdu','Russian','Polish','Romanian','Ukranian','Hebrew','Irish','Other','None']; //Gaelic','Swahili','Indonesian'
    var options_sleep = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13 or more']
    var options_caffeine = ['0','1','2','3','4','5','6 or more'];
    var options_water = ['0','1','2','3','4','5','6 or more'];
    var options_exercise_freq = ['0 days per week','1 day per week','2 days per week','3 days per week','4 days per week','5 days per week','6 days per week','7 days per week','8-14 times per week','More than 14 times per week'];
    var options_alert = ['Very sluggish', 'A little sluggish', 'Neutral', 'A little alert', 'Very alert'];
    var options_job = ['Highly Active (e.g., heavy lifting)','Active','Slightly active','Sedentary (e.g., desk job)'];
    var options_residence = ['Rural','Small town','Suburban','Small city','Large city'];
    var options_stressed = ['Very stressed','A little stressed','Neutral','A little relaxed','Very relaxed'];
    var options_school = ['Some high school', 'High school graduate', "Associate's Degree", 'Some college', 'College graduate', 'Some graduate training', "Master's degree", 'Doctorate','Other Graduate/Professional School']
    var options_exercise_motiv = ['Physical Health', 'Mental Health/Wellness', 'Time with Friends/Family/Partner', 'External Pressure (Friends, Family, Partner)', 'Feel Like I Should']
    var options_fit_wear = ['Every Day','Most Days','Some Days','Rarely']
    var options_fitbit_feats = ['Step Counts', 'Activity Recording/Logging', 'Sleep Tracking', 'Food Logs', 'Water Logs', 'Weight Logs', 'Challenges/Badges', 'Guidance Feature', 'Community/Social', 'Alarms/Reminders/Notifications']


   //  var block_screening_p1 = {
   //      type: 'survey-multi-choice',
   //      questions: [ {prompt: '<b> What is your age? </b>', options: options_age, required: true}, {prompt: '<b>Gender</b>', options: options_gender, required:true,},]
   //  };
   // screeningTimeline.push(block_screening_p1);

/* //Alternative display: multiple choice version
   var block_screening_p0 = {
       type: 'survey-multi-choice',
       questions: [{prompt: '<b>What year were you born?</b>', options: options_birthyear, required:true,}]
   };
  screeningTimeline.push(block_screening_p0);
*/

  //dropdown version
  var block_screening_p0 = {
      type: 'survey-dropdown',
      questions: [{prompt: '<b>What year were you born?</b>', options: options_birthyear, default_text: 'Select year'}],
  };
 screeningTimeline.push(block_screening_p0);

   var block_screening_p1 = {
       type: 'survey-multi-choice',
       questions: [{prompt: '<b>Gender</b>', options: options_gender, required:true}]
   };
  screeningTimeline.push(block_screening_p1);


   /* //Alternative multi choice version
   var block_screening_p2 = {
       type: 'survey-multi-choice',
       questions: [{prompt: '<b>Highest Degree Achieved:</b>', options: options_school, required:true,}] //       {prompt: '<b>Ethnicity:</b>', options: options_ethnicity, required:true,},]
   };
   screeningTimeline.push(block_screening_p2);
   */

   //dropdown version
   var block_screening_p2 = {
       type: 'survey-dropdown',
       questions: [{prompt: '<b>Highest Degree Achieved:</b>', options: options_school, default_text: 'Select degree'}] //{prompt: '<b>Ethnicity:</b>', options: options_ethnicity, required:true,},]
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
        questions: [{prompt: "<b>Are you fluent in any of the following languages (check all that apply)?</b>", options: options_languages, horizontal: true},],
        required: true,
    };
    screeningTimeline.push(block_screening_p4);

    var block_screening_p5 = {
        type: 'survey-multi-select-custom',
        questions: [{prompt: "<b>Have you ever learned (formally or informally) any words or phrases in any of the following languages, even if you are not fluent?  (Please check all that apply)</b>", options: options_languages, horizontal: true}],
        required: true,
    };
    screeningTimeline.push(block_screening_p5);

    var health_screening = {
        type: 'instructions',
        pages: ['<h1>Survey Questions: Health</h1><p>Next we’d like to ask you some questions about medical conditions that could potentially affect your performance on the memory games.  When you are ready to continue, please press Next.</p>'],
        show_clickable_nav: true
    };
    screeningTimeline.push(health_screening);

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

   /*var state_screening = {
       type: 'instructions',
       pages: ['<h1>Lifestyle</h1><p>We will now ask you some questions related to your lifestyle. Press Next to continue. </p>'],
       show_clickable_nav: true
   };
   screeningTimeline.push(state_screening);*/

    var block_screening_p8a = {
        type: 'survey-multi-choice',
        questions: [{prompt: '<b>How alert are you feeling?</b>', options: options_alert, required:true,},
                   {prompt: '<b>How stressed do you typically feel?</b>', options: options_stressed, required:true,},
                   {prompt: '<b>How stressed do you feel now?</b>', options: options_stressed, required:true,}],
        };
    screeningTimeline.push(block_screening_p8a);

    var block_screening_p8b = {
        type: 'survey-dropdown',
        questions: [{prompt: '<b>How many hours of sleep did you get last night (round to the nearest hour)?<b>',options: options_sleep, default_text:'Hours'},] //dropdown option
    };
    screeningTimeline.push(block_screening_p8b);

    //only putting 2 questions per page since won't scroll to top of each page upon submission
    var block_screening_p9a = {
        type: 'survey-multi-choice',
        questions: [//{prompt: '<b>How many hours of sleep did you get last night (round to the nearest hour)?<b>',options: options_sleep, required:true,}, //alternative multiple choice option
                    {prompt: '<b>How many cups of coffee and/or caffeinated beverages (e.g. tea, soda) have you had today?</b>', options: options_caffeine, required:true,},
                    {prompt: '<b>How many cups of water (8 oz) have you had today?</b>', options: options_water, required:true,},]
    };
    screeningTimeline.push(block_screening_p9a);

    var block_screening_p9b = {
        type: 'survey-multi-choice',
        questions: [{prompt: '<b>Which type of setting do you live in?</b>', options:options_residence,required:true,},
                    {prompt: '<b>How much activity does your job typically require?</b>', options:options_job,required:true,},]
    };
    screeningTimeline.push(block_screening_p9b);

    /*var exercise_screening = {
        type: 'instructions',
        pages: ['<h1>Exercise and Fitness Tracker</h1><p>Lastly, we will ask a few questions on your exercise habits and reasons for wearing your fitness tracker. Press Next to continue. </p>'],
        show_clickable_nav: true
    };
    screeningTimeline.push(exercise_screening);*/

    var block_screening_p10a = {
        type: 'survey-multi-choice',
        questions: [{prompt: '<b>Have you exercised today?</b>', options: ['Yes','No'], required:true,}, {prompt: '<b>Do you plan to exercise later?</b>', options: ['Yes','No'], required:true,},] //{prompt: '<b>How many days a week do you typically exercise?</b>', options: options_exercise_freq,required:true}
    };
    screeningTimeline.push(block_screening_p10a);

    var block_screening_p10aa = {
        type: 'survey-dropdown',
        questions: [{prompt: '<b>How many days a week do you typically exercise?</b>', options: options_exercise_freq, default_text: 'Number of Days',}] //dropdown option
    };
    screeningTimeline.push(block_screening_p10aa);


    var block_screening_p10b = {
        type: 'survey-multi-choice',
        questions: [{prompt: '<b>What motivates you to exercise? </b>', options: options_exercise_motiv, required: true, },
                    {prompt: '<b>How often do you remember to wear your fitness tracker?</b>', options: options_fit_wear, required:true,},
                    {prompt: '<b>Have you synced your fitness tracker data to your app today?</b>', options: ['Yes','No'], required:true,},]
    };
    screeningTimeline.push(block_screening_p10b);

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

    var block_screening_end = {
      type: 'instructions',
      pages: ["<p>Thanks for providing that information for us! We enjoyed learning a bit more about you and your health and exercise habits. Next we’d like to learn about your memory specifically. We’ll ask you to perform a series of short memory 'games', and we’ll use your performance in those games (along with the information you just provided us about yourself) to try to understand how different aspects of your memory might relate to different aspects of your health and exercise habits. Ready to continue?</p>"],
      show_clickable_nav: true,
      button_label_next: 'Continue'
    };
    screeningTimeline.push(block_screening_end);

 return screeningTimeline
}
