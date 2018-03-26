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

#import fitbit related packages
import fitbit
import gather_keys_oauth2 as Oauth2
import pandas as pd
import datetime

@custom_code.route('/create-audio-folder',methods=['POST'])
def create_folder():
    print('creating audio folder...')
    call('mkdir -p audio/' + request.form['data'],shell=True)
    resp = {"folderCreated": "success"}
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

@custom_code.route('/access-fitbit-data',methods=['POST'])
def access_fitbit_data():

    CLIENT_ID = '22CV44'
    CLIENT_SECRET = '181ad1d21458261e54e979a8e65e85c9'

    server = Oauth2.OAuth2Server(CLIENT_ID, CLIENT_SECRET)
    server.browser_authorize()
    ACCESS_TOKEN = str(server.fitbit.client.session.token['access_token'])
    REFRESH_TOKEN = str(server.fitbit.client.session.token['refresh_token'])
    auth2_client = fitbit.Fitbit(CLIENT_ID, CLIENT_SECRET, oauth2=True, access_token=ACCESS_TOKEN, refresh_token=REFRESH_TOKEN)

    today = str(datetime.datetime.now().strftime("%Y%m%d"))

    fit_statsHR = auth2_client.intraday_time_series('activities/heart', base_date=today, detail_level='1sec')
    resp = fit_statsHR
    return jsonify(**resp)


#@custom_code.route('/decode-experiment',methods=['POST'])
#def decode_experiment():
#    foldername = request.form['data']
#    try:
#        words = quail.decode_speech(path='audio/' + foldername + '/',
#            keypath='google-credentials/credentials.json',
#            save=True,
#            speech_context=speech_context)
#        resp = {"audioDecoded" : "success"}
#    except:
#        print('Error decoding audio.')
#        traceback.print_exc()
#        resp = {"audioDecoded" : "failed"}
#    return jsonify(**resp)

#function from #EL code
@custom_code.route('/speechtotext',methods=['POST'])
def saveAndDecode():
    filename = request.form['audio-filename']
    foldername = request.form['audio-foldername']
    wav = request.files
    wav['audio-blob'].save("audio/" + foldername + "/" + filename)
    # song = AudioSegment.from_wav("audio/" + filename)
    # song.export("audio/data.flac",format = "flac",bitrate="44.1k")
    #
    # with open('/Users/Student/Documents/BitBucket/efficient-learning-code/audio/data.flac', 'rb') as speech:
    #     speech_content = base64.b64encode(speech.read())
    #     service = get_speech_service()
    #     service_request = service.speech().syncrecognize(
    #     body={
    #         'config': {
    #             'encoding': 'FLAC',  # raw 16-bit signed LE samples
    #             'sampleRate': 44100,  # 16 khz
    #             'languageCode': 'en-US',  # a BCP-47 language tag
    #         },
    #         'audio': {
    #             'content': speech_content.decode('UTF-8')
    #             }
    #         })
    # resp = service_request.execute()
    # # print(speech_content.decode('UTF-8'))
    # print(json.dumps(resp))
    resp = {"audioSaved": "success"}
    return jsonify(**resp)

# @custom_code.route('/save-audio-and-return-transcript',methods=['POST'])
# def save_audio_and_return():
#     filename = request.form['audio-filename']
#     foldername = request.form['audio-foldername']
#     wav = request.files
#     wav['audio-blob'].save("audio/" + foldername + "/" + filename)
#     audio = AudioSegment.from_wav("audio/" + foldername + "/" + filename)
#     audio.export("audio/" + foldername + "/" + filename + ".flac", format = "flac", bitrate="44.1k")
#     with open("audio/" + foldername + "/" + filename + ".flac", 'rb') as sc:
#         speech_content = sc.read()
#     sample = client.sample(content=speech_content,
#                         encoding=speech.Encoding.FLAC,
#                         sample_rate_hertz=44100)
#     try:
#         results = sample.recognize(language_code='en-US', max_alternatives=1,
#                                         speech_contexts=speech_context) #note: max 500 words for speech context
#         pickle.dump( results, open( "audio/" + foldername + "/" + filename + ".flac.pickle", "wb" ) )
#         words = []
#         for result in results:
#             for chunk in result.transcript.split(' '):
#                 print(chunk)
#                 if chunk != '':
#                     words.append(str(chunk).upper())
#         with open("audio/" + foldername + "/" + filename + ".flac.txt", 'wb') as myfile:
#             wr = csv.writer(myfile, quoting=csv.QUOTE_ALL)
#             wr.writerow(words)
#         resp = {"result" : json.dumps(words)}
#     except:
#         traceback.print_exc()
#         resp = {"result" : "Error"}
#     return jsonify(**resp)
