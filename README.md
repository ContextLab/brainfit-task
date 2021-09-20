# Brainfit Experiment

This package is aimed at investigating the effects of fitness on cognition by acquiring both Fitbit data and cognitive task data through the Amazon Mechanical Turk platform. More specifically, this repo contains a suite of memory tasks developed using JsPsych and PsiTurk, including a word list task with spoken recall, a naturalistic movie clip and spoken recall, a vocabulary-image pair learning task, and a spatial task in which users drag icons across the screen to locations they were presented in. These tasks are aimed at probing several memory domains and relating these findings to individual's physical activity measures via Fitbit data acquired through the Fitbit web API.

## Introduction

Exercise is long-reported to influence physical health and cognitive ability, with a large body of literature focused on benefits to memory. Although the literature describes these changes primarily for hippocampal-dependent (i.e. spatial and relational memory), it remains unclear whether other aspects of memory are influenced by exercise and physical activity. Therefore, we present a method here to scale up data collection relating fitness tracker data to memory scores on the online Amazon Mechanical Turk platform. Users first provide authorization to their Fitbit data, and then complete a battery of memory tasks probing different aspects of memory. This approach is also readily adaptable to investigating interactions of exercise with other domains of cognition (e.g. executive function, attention).

## Installation and Quick Start

This package requires Docker (v3) to run. Install here: https://docs.docker.com/install/

1. Clone the repository `git clone https://github.com/ContextLab/brainfit-task.git`
2. Navigate to the brainfit-task folder in the terminal
3. Enter `docker-compose up -d` to build the docker image
4. Attach this image via `docker attach fitbrain_psiturk_1`
5. This will open the terminal from within the docker image. From here, enter the command `psiturk` to launch the server followed by `server on`. To debug, enter `debug` and paste the link into the browser (developed with Google Chrome, other browsers may require additional considerations).
6. For full functionality, you must create accounts and acquire credentials for using locally (Local Use - Accounts Required) and online (Web Use - Accounts Required)
7. Make sure to update the consent form (`exp/static/templates/consent.html`), lab/university images(`exp/static/favicon.ico`,`exp/static/files/lablogo.png`,`exp/static/files/university.png`) and tasks (`exp/static/js`) as needed for your experiment!

## Components

All required components for running this experiment will be installed when building the docker container. For more information on each of the components used, refer to the official sites below:

* Docker, v3 (https://www.docker.com/)
* MySQL, v5.7 (https://www.mysql.com/)
* Adminer (https://www.adminer.org/en/)
* NGNIX (https://www.nginx.com/)
* Psiturk (http://psiturk.org/)
* Fitbit API (https://dev.fitbit.com/)
* JsPsych (https://www.jspsych.org/)

### Local Use - Accounts Required

For testing or collecting data locally, the following accounts and registration steps are required:

* Create a project [Gmail](https://www.gmail.com) account to link up all of the following accounts
* Create a [Fitbit](https://www.fitbit.com) account
* Register App on the Fitbit developer site to gain Fitbit credentials for authorization link generation:
	* https://dev.fitbit.com/apps
	* add ClientID, ClientSecret, and Callback URL to a the JSON file in `exp/static/credentials/credentials_fitbit.json`
	* NOTE: if second- or minute-resolution data access is required for research use, you must contact Fitbit directly for this access and explain its intended use

### Web Use - Additional Accounts Required

For acquiring data on the Amazon Mechanical Turk platform, the following accounts are needed in addition to those listed above:

* [Psiturk](https://psiturk.org) (free)
* [Amazon Web Services (AWS)](https://aws.amazon.com/console/) (create a user account and give this user permissions to RDS and MTurk to generate keys)
* [Amazon MTurk Sandbox Account](https://requestersandbox.mturk.com/developer): link to your AWS account (for testing prior to going live)
* [Amazon MTurk Account](https://requester.mturk.com/developer): link to your AWS account

#### Experiment Walkthrough

The structure of the current experiment layout, and associated file(s) for each component:

1. Ad
	* `exp/templates/ad.html` & `exp/templates/default.html`
2. Consent form (must accept to proceed)
	* `exp/templates/consent.html`
3. Introductory screen
	* part of `exp/static/js/experiment.js`
4. Fitbit authorization description and pop-up (must log in to Fitbit account and provide data to proceed)
	* `exp/templates/fitbit.html`, `exp/templates/fitbit_auth.html`, `exp/static/js/fitbit.js`, `exp/static/js/fitbit_access.js`
6. Survey questions - demographics, lifestyle, exercise and fitness tracker questions
	* `exp/static/js/screening.js`
7. Word list task - presentation and recall words
	* `exp/static/js/wordlist.js`
8. Story task - watch movie, recall sentences, quiz questions
	* `exp/static/js/movie.js`
9. Vocabulary pairs - see image-word pairs of Irish vocabulary words and English translations, take quiz on pairs
	* `exp/static/js/vocab.js`
10. Spatial shapes task - view shapes arranged on the screen and drag these shapes to where they were located
	* `exp/static/js/spatialtask.js`
11. Delayed word list recall - recall words from initial word list presentation
	* `exp/static/js/delayrecall.js`
12. Delayed movie recall - recall sentences from what happened in movie they viewed
	* `exp/static/js/delayrecallmovie.js`
13. Delayed vocabulary-pairs quiz - take another quiz on the Irish vocabulary pairs
	* `exp/static/js/delayvocabquiz.js`
14. Post-survey - get feedback on the experiment - how clear or difficult was each section?
	* `exp/static/js/postsurveytask.js`
15. Debriefing - overview of experiment and payment, then participant submits HIT
	* part of `exp/static/js/experiment.js`

A few files are implemented to catch errors. If an error occurs during the experiment, the error code will be piped through `exp/templates/error.html` and display to the user. If a person tries to complete the experiment more than once (and you have the repeats_allowed flag in the config file set to False), then `exp/templates/thanks.html` will display.

Parameters for the tasks are set up in `exp/static/js/config.js`, while stimuli are loaded in for the word list, movie, vocabulary, and spatial tasks from csv files in `exp/static/files`. The stimuli are loaded in `exp/static/js/run.js`. The file `exp/static/js/utils.js` also contains a few functions used in the experiment.

All pages/scripts/dependencies are loaded in `exp/templates/exp.html`. The tasks are added to the experiment timeline in `exp/static/js/experiment.js`, along with any intermediate pages needed. The tasks are noted by section headers, so you can easily remove or add-in other tasks as needed, depending on your investigation and cognitive domain(s) of interest. These tasks depend on built-in (`exp/static/jspsych/plugins`) and custom-made (`exp/static/jspsych/custom_plugins`) JsPsych plugins.

### Testing or Collecting Data Locally

Once you've cloned the repo (`git clone https://github.com/ContextLab/fitbrain.git`) and successfully built the docker container (`docker-compose up -d`), you can begin testing locally. The files are currently setup to run on the local host (127.0.0.1), but if you want to run online you'll have to change this to a public IP address (see the section below about running online).

To test locally or run experiments in-lab, check that the URL in each of the following is set to 127.0.0.1:

* Check your Fitbit app online and change the field 'Callback URL' to http://127.0.0.1/redirect.html
* Update all of the fields on your Fitbit app in `exp/credentials/credentials_fitbit.json`
* Change `adserver_revproxy_host` to 127.0.0.1 in `config.txt`
* Update `serverporturl` in `config.js` to 127.0.0.1

You'll also want to check `exp\config.txt`:
* Update experiment title, keywords, and experimenter contact
* Create a name for your database
* If debugging or in-lab collection, set `debug = true`
* Also check that `launch_in_sandbox_mode = True` (otherwise you might accidentally create live links during testing that could cost you if you have your Amazon credentials in the file as well)
* If you are testing on the Sandbox site, it might be good to also set `allow_repeats = true` for now since you want to be able to retake the experiment and debug - just make sure you flip this back before going live!
* For more information on this config file, refer to: http://psiturk.readthedocs.io/en/latest/configuration.html#local-configuration-file

First run `docker attach fitbrain_psiturk_1` to attach the Docker container, then type `psiturk` followed by `server on` to start the PsiTurk server. Type `debug` to generate an experiment link and test your experiment locally on your own computer. This is also one way to run experiments locally, in the lab. Upon completing the task, Fitbit data is saved as separate .json files for each metric to a folder with the unique user ID and hit number, and data should be saved to your local database and can be accessed and exported to .csv files via the Adminer browser (see later section for more information).

### Testing or Collecting Data Online

Before you run your experiment online, you'll need to acquire a static public IP address (ask your University's IT department if you are not sure how to do this). Once you have this all set up and all accounts created (as well as a computer that will be capable of running multiple copies of your experiment simultaneously) then you'll be good to go! (Note: I'd also suggest that if you are simultaneously running both in-lab participants and online participants, you should create two separate Fitbit apps so that you don't need to keep changing the callback/redirect URL on the Fitbit app and in the files between the local 127.0.0.1 and your public IP address.)

To test run experiments online in either the Sandbox (developer) or live mode, check that the URL in each of the following is set to your public IP address (referred to as PUBLICIPADDRESS):

* Check your Fitbit app online and change the field 'Callback URL' to http://PUBLICIPADDRESS/redirect.html
* Update all of the fields on your Fitbit app in `exp/credentials/credentials_fitbit.json`
* Change `adserver_revproxy_host` to PUBLICIPADDRESS in `config.txt`
* Update `serverporturl` in `config.js` to PUBLICIPADDRESS

You'll also want to check `exp\config.txt`:
* Update experiment title, keywords, and experimenter contact
* Make sure you've added your PsiTurk and Amazon Web Services credentials
* Create a name for your database
* If debugging in Sandbox mode, set `debug = true`; otherwise if live set `debug = false`
* If debugging in Sandbox mode set `launch_in_sandbox_mode = True`, otherwise to create live links set `launch_in_sandbox_mode = True`
* Check that `allow_repeats = false` so you don't get repeat participants!
* For more information on this config file, refer to: http://psiturk.readthedocs.io/en/latest/configuration.html#local-configuration-file

#### Amazon Mechanical Turk, Sandbox Mode

Sandbox mode is a neat way to test out what your experiment (and MTurk interface) looks like before you post any live links - and it's free to use. Once you've set up your account for this and configured your experiment to run in Sandbox mode (see above) you can begin testing!

Once you've run your Docker container and started your Psiturk server, you can see which mode you are in by the text before the prompt (made sure the mode is 'sdbx' and not live). You can also check whether you are in Sandbox mode by checking your account balance using `amt_balance` (you should see $10000 in Monopoly money).

Now type `hit create`, and then fill out the number of participants, base pay amount, and time to give participants to complete your experiment. Once you create this HIT, you can view the live experiment links with `hit list`.
You can also type, for example, `hit create 1 5 1.5` to create a link for one participant, paying $5 and giving them 1.5 hours to complete the task. The time should be reasonable enough for them to accept and complete all parts of your task, but not too long that they are leaving to grab lunch in the middle of your experiment. For additional information on the command-line interface, see http://psiturk.readthedocs.io/en/latest/command_line_overview.html.

Creating a HIT will prompt the generation of two links - one to view your ad (psiturk URL - you can't actually complete your experiment this way, just view your ad), and the other to go to the Amazon Sandbox site to take your experiment (Note: Although the link looks like it'll search for your experiment, it actually just brings you to the main page of experiments. You'll have to search for your experiment using the keywords you've specified in your config file - sometimes it takes a few minutes for this to appear). You can then test this on a separate computer, have your friend take it, and get some feedback - did everything work as expected? Was there anything weird or broken? This might also be a good time to test for cross-browser compatibility, which you can set exclusions for in `config.txt`.

Once you're done testing the experiment, you can check on your hits through the command line, use `hit expire` to end any unused links, and then look at the workers who completed your task through `worker list`. This is how you'll end up accepting and bonusing participants in live mode. To get rid of all HIT links, type `hit dispose` after `hit expire`.

#### Amazon Mechanical Turk, Live Mode

When you are confident your experiment is good to go, and you've double-checked all of your credentials and files, update your config file as noted above. I'd also run `docker attach fitbrain_mysql_1`,`docker attach fitbrain_nginx_1`, and `docker attach fitbrain_adminer_1`, since sometimes these components can be fussy and not start automatically. Next run the Docker container using `docker attach fitbrain_psiturk_1` and start your Psiturk server, then type `mode` to switch to `live` if you've launched in sandbox mode. Add money to your Amazon Web Services account, if you haven't already, and check the balance through `amt_balance`.

Begin by using the command line interface to generate a couple HITs, and check to make sure everything is running smoothly. When you'd like to approve participants after all HITs have been expired, type `worker list` to see who has submitted data, and `worker approve --hit HITNUMBERSTRINGGOESHERE`. There should also be a bonus associated with each worker computed by `custom.py` for performance on each task (which may not appear until you've restarted the PsiTurk server, or can be viewed in the database file by running Adminer). When you want to bonus participants, type `worker bonus --auto --hit HITNUMBERSTRINGGOESHERE` to use the value associated with each participant who completed that task, as calculated during the experiment. (NOTE: This will not bonus the same person multiple times, but if you bonus individual participants based on their worker ID you can bonus them multiple times - so I would just stick to bonuses based on the HITs).

## Viewing and Intepreting Data

Data can be viewed in the browser using the Adminer feature. To view the data, type `docker start fitbrain-mturk_adminer_1` to make sure adminer is running, then type `localhost:8080` in your browser. This should bring you to a login screen, where you can view the data by logging in to the account specified by the database name, username and password specified in `docker-compose.yml`. Upon logging in, you should see a row corresponding to each participant (named with their AMT ID - HIT #). In the columns, the field 'datastring' holds all of the task data as specified by your JsPsych files and PsiTurk commands, while 'beginhit' and 'endhit' show the date and timestamps (in UTC timezone) of when participants completed the experiment. The bonus values, as computed by `custom.py` can also be viewed here. Another column is 'status', which can show which participants have been approved, credited, or bonused for the experiment, according to the following codes:
* NOT_ACCEPTED = 0. ALLOCATED = 1. STARTED = 2. COMPLETED = 3. SUBMITTED = 4. CREDITED = 5. QUITEARLY = 6. BONUSED = 7

## Troubleshooting Notes

* If you are not seeing new files display or keep getting an error you know you fixed when debugging, delete the Google Chrome (or other browser) cache (e.g. if updating credentials file, restarting the server/browser doesn't always update things)
* Make sure not to share any private keys (e.g. Fitbit, Psiturk, AMT) in the documents - add these to your `.gitignore` file!
* Turn off your ad-blocker when testing to make sure it is not interfering with the experiment.
* You should also probably set the usonly flag in the `config.txt` file to true - this way you'll avoid strange/low-quality datasets from MTurk "farms" trying to take advantage of the platform

## Additional References

For more information on incorporating the NGNIX, Adminer, and MySQL components, refer to the package below:
* psiturk-docker: https://github.com/mvdoc/psiturk-docker
