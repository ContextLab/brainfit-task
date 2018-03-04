# BrainFit-MTurk

This repo contains a suite of memory tasks using JsPsych and PsiTurk. Thse tasks are aimed at probing several memory domains and relating these findings to individual's physical activity levels via Fitbit data acquired through the service Fitabase. 

## Introduction 

Exercise is long-reported to influence physical health and cognitive ability, specifically memory. Although the literature primarily describes these changes for hippocampal-dependent (i.e. spatial and relational memory), it remains unclear whether other aspects of memory are influenced by exercise and physical activity. Therefore, we present a method here to scale up data collection relating fitness tracker data to memory scores on the online Amazon Mechanical Turk platform.

## Installation and Running

This experiment requires Docker to run. Install here: https://docs.docker.com/install/ 

1. Clone the repository 
2. Navigate to the BrainFit-MTurk folder in the terminal
3. Enter 'docker-compose up -d' to build the docker image
4. Attach this image via 'docker attach brainfitmturk_psiturk_1'
5. This will open the terminal from within the docker image. From here, enter the command 'psiturk' to launch the server followed by 'server on'. To debug, enter 'debug' and paste the link into the browser (only tested with Google Chrome). **Note:** To use the speech recording feature, 0.0.0.0 in this link must be changed to localhost. 

<README under construction> 
