# this file imports custom routes into the experiment server

from flask import Blueprint, render_template, request, jsonify, Response, abort, current_app
from jinja2 import TemplateNotFound
from functools import wraps
from sqlalchemy import or_

from psiturk.psiturk_config import PsiturkConfig
from psiturk.experiment_errors import ExperimentError
from psiturk.user_utils import PsiTurkAuthorization, nocache

# # Database setup
from psiturk.db import db_session, init_db
from psiturk.models import Participant
from json import dumps, loads

import sqlalchemy #will decide how to save later
import json

from base64 import b64encode
from fitbit.api import Fitbit
from oauthlib.oauth2.rfc6749.errors import MismatchingStateError, MissingTokenError

# # to call script on finish
from subprocess import call
import os
import csv
import sys
import traceback
import glob

cwd = os.getcwd()

# load the configuration options
config = PsiturkConfig()
config.load_config()
myauth = PsiTurkAuthorization(config)  # if you want to add a password protect route use this

# explore the Blueprint
custom_code = Blueprint('custom_code', __name__, template_folder='templates', static_folder='static')

# Google speech
import base64
import json
#from google.cloud import speech
#client = speech.Client()

# load in speech context
#with open('static/files/speech-context.csv', 'rb') as csvfile:
#    reader = csv.reader(csvfile, delimiter='\n')
#    speech_context = [row[0] for row in reader]

# audio processing package
#from pydub import AudioSegment

# import pickle to save google speech results
import pickle

# import quail for speech decoding
import quail



@custom_code.route('/create-folders',methods=['POST'])
def create_folder():
    print('creating data folders...')
    call('mkdir -p audio/' + request.form['data'],shell=True)
    call('mkdir -p fitbit/' + request.form['data'],shell=True)
    resp = {"foldersCreated": "success"}
    return jsonify(**resp)

@custom_code.route('/save-audio',methods=['POST'])
def save_audio():
    filename = request.form['audio-filename']
    foldername = request.form['audio-foldername']
    wav = request.files
    try:
        wav['audio-blob'].save("audio/" + foldername + "/" + filename)
        resp = {"audioSaved" : "success"}
    except:
        print('Error with saving audio.')
        resp = {"audioSaved" : "failed"}
    return jsonify(**resp)

@custom_code.route('/save-fitbit',methods=['POST'])
def save_fitbit():
    filename = request.form['fitbit-filename']
    foldername = request.form['fitbit-foldername']
    fit = request.files
    try:
        fit['fitbit-blob'].save("fitbit/" + foldername + "/" + filename)
        resp = {"fitbitSaved" : "success"}
    except:
        print('Error with saving fitbit data.')
        resp = {"fitbitSaved" : "failed"}
    return jsonify(**resp)


#function from #EL code
@custom_code.route('/speechtotext',methods=['POST'])
def saveAndDecode():
    filename = request.form['audio-filename']
    foldername = request.form['audio-foldername']
    wav = request.files
    wav['audio-blob'].save("audio/" + foldername + "/" + filename)
    resp = {"audioSaved": "success"}
    return jsonify(**resp)


#create auto-bonus function
#modified from https://github.com/NYUCCL/psiTurk/blob/master/psiturk/example/custom.py.txt to

#TODO: add compute_bonus to experiment.js or postsurveytask.js

@custom_code.route('/compute_bonus', methods=['GET']) #originally post
def compute_bonus():
    #get uniqueId
    if not request.args.has_key('uniqueId'):
        raise ExperimentError('improper_inputs')
    uniqueId = request.args['uniqueId']


    # try:
    #     # lookup user in database
    #     # user = Participant.query.filter(Participant.uniqueid == uniqueId).one()
    #     # user_data = loads(user.datastring) # load datastring from JSON
    #     # bonus = 0
    #     #
    #     # for record in user_data['data']: # for line in data file
    #     #     trial = record['trialdata'] #brainfitmemory?
    #     #     if trial['phase']=='TEST':
    #     #         if trial['hit']==True:
    #     #             bonus += 0.02
    #     #bonus = 0.1 #testing 123
    #     #user.bonus = bonus
    #     #db_session.add(user)
    #     #db_session.commit()
    #     resp = {"bonusComputed": "success"}
    #     return jsonify(**resp)
    #
    #     #read in daily Fitbit HR of this userID
    #     #bonus_dir = 'exp/fitbit/' + str(uniqueId) + '/' #get directory of fitbit data
    #     #bonus_dir_dailyHR = bonus_dir + str(uniqueId) + '-todayHR.json' #TODO: double check whether just userID or both hitID + userID
    #     #read in file
    #     #if len > len of summary alone, then synced fitbit
    # except:
    #     pass
    #     #error msg
    #
    #     #abort(404) #if using flask, throw error message

    #original unmodified
    try:
        # lookup user in database
        user = Participant.query.\
               filter(Participant.uniqueid == uniqueId).\
               one()
        user_data = loads(user.datastring) # load datastring from JSON
        bonus = 0 #this works at higher level

        #for testing, input fake data
        #user_data['data'] = [{"current_trial":0,"dateTime":1527605627409,"trialdata":{"rt":8465,"responses":"{\"Q0\":\"BFM-2.0-MMDDYY-SN\",\"Q1\":\" ML\"}","trial_type":"survey-text","trial_index":0,"time_elapsed":8469,"internal_node_id":"0.0-0.0"}}]

        # IMMEDIATE VOCAB QUIZ BONUS
        immedVocabTotal = 0 #initialize as zero

        for record in user_data['data']: # for line in data file
            #immedVocabTotal += 1 # works here
            trial = record['trialdata']

            #if (trial['internal_node_id'] == '0.0-0.0'):
            #    immedVocabTotal += 1 #works here
            try:
                if (trial['task_name'] == 'immed_vocab_quiz'):
                    qresponse = trial['responses']
                    #immedVocabTotal += 1 #works here
                    if str(trial['correct_resp']) in str(qresponse): #one question is saved at a time - should work for each q separately
                       immedVocabTotal += 1 #then tally correct
            except: #might throw error if field empty
                pass
            #qresponse = trial['responses']
            #if trial['task_name']=='immed_vocab_quiz': #might have error because some missing field
            #    immedVocabTotal += 1 #check here
                #if trial['correct_resp'] == qresponse['Q0']: #one question is saved at a time - should work for each q separately
                #    immedVocabTotal += 1 #then tally correct

        immedVocabBonus = (immedVocabTotal/10.)*0.5 #50 cents possible for immediate vocab recall; float convert

        #now compute bonus based on this total
        bonus = bonus + immedVocabBonus

        # DELAYED VOCAB QUIZ BONUS
        delayedVocabTotal = 0 #initialize as zero

        for record in user_data['data']: # for line in data file
            trial = record['trialdata']
            try:
                if (trial['task_name'] == 'delayed_vocab_quiz'):
                    qresponse = trial['responses']
                    if str(trial['correct_resp']) in str(qresponse): #one question is saved at a time - should work for each q separately
                       delayedVocabTotal += 1 #then tally correct
            except:
                pass

        delayedVocabBonus = (delayedVocabTotal/10.)*0.5 #50 cents possible for delayed vocab recall; float convert

        #now compute bonus based on this total
        bonus = bonus + delayedVocabBonus

        # IMMEDIATE MOVIE QUIZ BONUS
        immediateMovieTotal = 0 #initialize as zero

        for record in user_data['data']: # for line in data file
            trial = record['trialdata']
            try:
                if (trial['task_name'] == 'immed_movie_quiz'):
                    qresponse = trial['responses']
                    if str('library') in str(qresponse): #one question is saved at a time - will make more elegant later on
                       immediateMovieTotal += 1 #then tally correct
                    if str('custodian') in str(qresponse): #one question is saved at a time - will make more elegant later on
                       immediateMovieTotal += 1 #then tally correct
                    if str('reading') in str(qresponse): #one question is saved at a time - will make more elegant later on
                       immediateMovieTotal += 1 #then tally correct
                    if str('professor') in str(qresponse): #one question is saved at a time - will make more elegant later on
                       immediateMovieTotal += 1 #then tally correct
                    if str('1940s') in str(qresponse): #one question is saved at a time - will make more elegant later on
                       immediateMovieTotal += 1 #then tally correct
                    if str('3am') in str(qresponse): #one question is saved at a time - will make more elegant later on
                       immediateMovieTotal += 1 #then tally correct
                    if str('waxed the tops of bookshelves') in str(qresponse): #one question is saved at a time - will make more elegant later on
                       immediateMovieTotal += 1 #then tally correct
                    if str('never') in str(qresponse): #one question is saved at a time - will make more elegant later on
                       immediateMovieTotal += 1 #then tally correct
                    if str('less than high school') in str(qresponse): #one question is saved at a time - will make more elegant later on
                       immediateMovieTotal += 1 #then tally correct
                    if str('quiet') in str(qresponse): #one question is saved at a time - will make more elegant later on
                       immediateMovieTotal += 1 #then tally correct (note: missing number of people live with since didnt want it to pick up on 2am)
            except:
                pass

        immediateMovieBonus = (immediateMovieTotal/10.)*0.5 #50 cents possible for immediate movie quiz; float convert

        #now compute bonus based on this total
        bonus = bonus + immediateMovieBonus

        #check for fitbit data, read in daily Fitbit HR of this userID

        fcwd = os.getcwd()
        fitbit_dir = fcwd + '/fitbit/' + uniqueId.replace(":","-") + '/' #directory of fitbit data for current user
        fileCounter = len(glob.glob1(fitbit_dir,"*.json")) #count number of fitbit files in the directory

        fitbitBonus = (fileCounter/19.)*0.5 #19 possible files, make sure all there - 50 cents if all there

        bonus = bonus + fitbitBonus

        #bonus_dir_dailyHR = bonus_dir + str(uniqueId) + '-todayHR.json' #TODO: double check whether just userID or both hitID + userID


        #read in file
        #if len > len of summary alone, then synced fitbit

        user.bonus = bonus
        db_session.add(user)
        db_session.commit()
        resp = {"bonusComputed": "success"}
        return jsonify(**resp)
    except:
        abort(404)  # again, bad to display HTML, but...
