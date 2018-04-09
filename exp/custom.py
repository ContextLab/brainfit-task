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
from pydub import AudioSegment

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
