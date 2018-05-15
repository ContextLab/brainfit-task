# BrainFit-MTurk

This repo contains a suite of memory tasks developed using JsPsych and PsiTurk, including a word list task with spoken recall, a naturalistic movie clip and spoken recall, a vocabulary-image pair learning task, and a spatial task in which users drag icons across the screen to locations they were presented in. These tasks are aimed at probing several memory domains and relating these findings to individual's physical activity levels via Fitbit data acquired through the Fitbit web API. 

## Introduction 

Exercise is long-reported to influence physical health and cognitive ability, specifically memory. Although the literature describes these changes primarily for hippocampal-dependent (i.e. spatial and relational memory), it remains unclear whether other aspects of memory are influenced by exercise and physical activity. Therefore, we present a method here to scale up data collection relating fitness tracker data to memory scores on the online Amazon Mechanical Turk platform. Users first allow authorization to their Fitbit data, and then complete a battery of memory tasks probing different aspects of memory. This approach is easily transferrable to examining other domains of cognition (e.g. executive function, attention). 

## Installation and Quick Start

This experiment requires Docker to run. Install here: https://docs.docker.com/install/ 

1. Clone the repository 'git clone URL'
2. Navigate to the BrainFit-MTurk folder in the terminal
3. Enter 'docker-compose up -d' to build the docker image
4. Attach this image via 'docker attach brainfit-mturk_psiturk_1'
5. This will open the terminal from within the docker image. From here, enter the command 'psiturk' to launch the server followed by 'server on'. To debug, enter 'debug' and paste the link into the browser (only tested with Google Chrome). 

## Requirements

TODO: add list of requirements, min versions, and links
* Docker


### Local Use

For testing or collecting data locally, the following accounts are needed: 

* Create project Gmail account to link up all of the following accounts 
* Create Fitbit account
	* https://www.fitbit.com/
* Register App on Fitbit developer site to gain Fitbit credentials for authorization link generation 
	* https://dev.fitbit.com/apps 
	* add ClientID, ClientSecret, and CallBack URL to a JSON file in exp/static/credentials/credentials_fitbit.json (TODO: update this with screencap and more detailed description)
	* NOTE: if want second- or minute-resolution data access for research use, must contact Fitbit directly for this access and explain intended use
* Create Google Account for speech transcription (get credentials for automatic transcription foranalysis)
	* https://console.cloud.google.com/

### Web Use 

For acquiring data on the Amazon Mechanical Turk platform, the following accounts are needed in addition to the ones listed above: 

* Create Psiturk Account (free)
	* https://psiturk.org
* Create Amazon Web Services (AWS) account (keys ? create a user account and give this user permissions to RDS and MTurk to generate keys)
	* https://aws.amazon.com/console/
* Create Amazon MTurk Sandbox Account and link to AWS account (for testing prior to going live) 
	* https://requestersandbox.mturk.com/developer
* Create Amazon MTurk Account and link to AWS account
	* https://requester.mturk.com/developer


## Additional Notes
(will update later)

* make sure your adblocker is not interfering with the experiment 
* if you are not seeing new files, delete Google Chrome cache (e.g. if updating credentials file)
* don't share any private keys (e.g. Fitbit, Google) 

## Additional References

The following packages are utilized in this project:
* psiturk: https://github.com/NYUCCL/psiTurk
* quail: https://github.com/ContextLab/quail
* psiturk-docker: https://github.com/mvdoc/psiturk-docker



<README under construction> 
