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

#for fitbit functionality
import fitbit
#import gather_keys_oauth2 as Oauth2
#import pandas as pd
import datetime

#from oauth file
import cherrypy
#import threading
import traceback
import webbrowser
import fitbit
import datetime
import time

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

#import fitbit related packages ***
import fitbit
#import gather_keys_oauth2 as Oauth2
import pandas as pd
import datetime

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


#@custom_code.route('/create-fitbit-folder',methods=['POST'])
#def create_folder():
#    print('creating fitbit folder...')
#    call('mkdir -p fitbit/' + request.form['data'],shell=True) #creates folder with uniqueId
#    resp = {"folderCreated": "success"}
#    return jsonify(**resp)
#
# @custom_code.route('/test-access-fitbit-data',methods=['POST'])
# def test_access_fitbit_data():
#         webbrowser.open(url,new=2)
#         resp = {"windOpened" : "success"}
#         return jsonify(**resp)

# @custom_code.route('/access-fitbit-data',methods=['POST'])
# def access_fitbit_data():
#     #subID = request.form['uniqueId'] #need to send this from javascript on page
#     #console.log(subID)
#
#
#     ####
#     cherrypy.config.update({'server.socket_port': 8080})
#     #cherrypy.config.update({'server.shutdown_timeout': 10 })
#     #cherrypy.config.update({'engine.autoreload.on': False})
#     cherrypy.engine.restart()
#
#
#     class OAuth2Server:
#         def __init__(self, client_id, client_secret,
#                      redirect_uri='http://localhost:8080/'):#9090
#             """ Initialize the FitbitOauth2Client """
#             self.success_html = """
#                 <h1>Thank you for providing access to your Fitbit data!</h1>
#                 <br/><button type="button" onclick = "window.close()">Close Window</button>"""
#             self.failure_html = """
#                 <h1>ERROR: %s</h1><br/><h3>You can close this window</h3>%s"""
#
#             self.fitbit = Fitbit(
#                 client_id,
#                 client_secret,
#                 redirect_uri=redirect_uri, #is this necessary?
#                 timeout=10,
#             )
#
#         def browser_authorize(self):
#             """
#             Open a browser to the authorization url and spool up a CherryPy
#             server to accept the response
#             """
#             url, _ = self.fitbit.client.authorize_token_url(scope = ["activity", "heartrate","sleep","weight","nutrition","location"]) #TODO: test new scope after removing app
#             #print(url)
#             # Open the web browser in a new thread for command-line browser support
#             #threading.Timer(1, webbrowser.open, args=(url,)).start()
#             webbrowser.open(url,new=2) #Gina mod
#             cherrypy.quickstart(self) #keeps looping, dont want thread****
#
#         @cherrypy.expose
#         def index(self, state, code=None, error=None):
#             """
#             Receive a Fitbit response containing a verification code. Use the code
#             to fetch the access_token.
#             """
#             #cherrypy.engine.autoreload.on = False;
#
#             error = None
#             if code:
#                 try:
#                     self.fitbit.client.fetch_access_token(code)
#                     #self._shutdown_cherrypy() #GN add
#                 except MissingTokenError:
#                     error = self._fmt_failure(
#                         'Missing access token parameter.</br>Please check that '
#                         'you are using the correct client_secret')
#                 except MismatchingStateError:
#                     error = self._fmt_failure('CSRF Warning! Mismatching state')
#             else:
#                 error = self._fmt_failure('Unknown error while authenticating')
#
#             ACCESS_TOKEN = str(self.fitbit.client.session.token['access_token'])
#             REFRESH_TOKEN = str(self.fitbit.client.session.token['refresh_token'])
#
#             #now make folder to save data if doesnt exist already
#
#             #if not os.path.exists('fitbit/'):
#             #    os.makedirs('fitbit/')
#
#             #TODO: add separate file to import that define these global vars (or define within docker image)
#             CLIENT_ID = '22CV44'
#             CLIENT_SECRET = '181ad1d21458261e54e979a8e65e85c9'#9
#             auth2_client = fitbit.Fitbit(CLIENT_ID, CLIENT_SECRET, oauth2=True, access_token=ACCESS_TOKEN, refresh_token=REFRESH_TOKEN)
#             yesterday = str((datetime.datetime.now() - datetime.timedelta(days=1)).strftime("%Y-%m-%d"))
#             today = str(datetime.datetime.now().strftime("%Y-%m-%d"))
#
#             #now access and output variables of interest:
#
#             # past year of daily average fitbit data (1w,1y,max is lifetime)
#             summary_HR_yearly = auth2_client.time_series('activities/heart',period='1y')#,detail_level='1s')#, start_time=yesterday, end_time = today, detail_level='1min')
#             #print summary_HR_yearly
#
#             #today's more granular data (if available, might only be if have bluetooth on all the time***)
#             today_HR= auth2_client.intraday_time_series('activities/heart',base_date=today,detail_level='1sec')#,start_time='12:00',end_time='12:30') #base_date='20180323',,base_date='20180201',detail_level='1sec')#,start_time=start_time,end_time=end_time)
#             #print(today_HR)
#             #activities-heart-intraday"
#             #print(auth2_client.intraday_time_series('activities/heart',base_date=today,detail_level='15min'))
#             #TODO: figure out why not getting granular data
#             #example: >>> url = 'https://www.api.fitbit.com/1/user/-/activities/heart/date/2015-06-02/1d/1sec/time/09:00/13:00.json'
#
#             #print(auth2_client.heart(date=today)) #doesn't work, prints out zeros
#             #print(auth2_client.get_bodyweight())
#
#             #similarly for steps - past year
#             summary_steps_yearly = auth2_client.time_series('activities/tracker/steps',period='1y')
#             #print(type(summary_steps_yearly)) #dictionary type
#
#             #json_summary_steps_yearly = json.dumps(summary_steps_yearly) #test output****
#             #print(type(json_summary_steps_yearly)) #string type
#             #print json.loads(json_summary_steps_yearly)
#             #print(summary_steps_yearly)
#             #print(type(json.loads(json_summary_steps_yearly))) #dictionary type
#
#             #look at minutes of activity levels
#             summary_mins_sed = auth2_client.time_series('activities/tracker/minutesSedentary',period='1y')
#             summary_mins_lightact = auth2_client.time_series('activities/tracker/minutesLightlyActive',period='1y')
#             summary_mins_fairlyact = auth2_client.time_series('activities/tracker/minutesFairlyActive',period='1y')
#             summary_mins_veryact = auth2_client.time_series('activities/tracker/minutesVeryActive',period='1y')
#
#             #print(summary_mins_veryact)
#
#             #similarly,floors and distance
#             summary_mins_floors = auth2_client.time_series('activities/tracker/floors',period='1y')
#             #print(summary_mins_floors)
#             summary_mins_distance = auth2_client.time_series('activities/tracker/distance',period='1y')
#
#             #if want calories (check whether in scope if including this)
#             #summary_mins_activitycalories = auth2_client.time_series('activities/tracker/activitycalories',period='1y')
#             #summary_mins_calories = auth2_client.time_series('activities/tracker/calories',period='1y')
#             #summary_mins_BMRcalories = auth2_client.time_series('activities/tracker/caloriesBMR',period='1y')
#
#             fav_activities = auth2_client.frequent_activities()
#             #print(fav_activities)
#             recent_activities = auth2_client.recent_activities()
#             #print(recent_activities)
#             #activities_list = auth2_client.activities_list()
#             #print(activities_list)
#             #activity_detail_run = auth2_client.activity_detail('51007') # each activity has a code associated, view via activities_list (check whether consistent)
#             #print(activity_detail_run)
#
#             #get idea of lifetime activities (might not need this)
#             #fav_activities = auth2_client.activity_stats(qualifier='frequent')
#             #print(fav_activities)
#             #recent_activities = auth2_client.activity_stats(qualifier='recent')
#             #print(recent_activities)
#
#             #TODO: output JSON to db, combine with psiturk data struct or link MTurk user id if need to save separately
#             #TODO: THEN integrate feedback into experiment on whether user gave fitbit authorization
#
#             #fit_badges = auth2_client.get_badges()
#             #print(fit_badges)
#             #print(today)#'20180201'
#             #stats=auth2_client.intraday_time_series('activities/heart',base_date='20180326',detail_level='1sec',start_time='12:00',end_time='12:30')
#             #print(stats)
#             # Use a thread to shutdown cherrypy so we can return HTML first
#             #time.sleep(10)
#
#             #write selected data to file:
#             w = csv.writer(open("fitbit/fitbit-IDCODE.csv", "w"))
#             allvals = [summary_steps_yearly,summary_HR_yearly,summary_mins_floors,summary_mins_distance,summary_mins_sed,summary_mins_lightact,summary_mins_fairlyact,summary_mins_veryact,fav_activities,recent_activities]#,today_HR]
#             #print allvals
#             for i in allvals:
#                 #continue
#                 print i
#                 w.writerow([i]) #TODO:`get second level resolution `
#                 #for key, val in i.items():
#                 #    w.writerow([key, val])
#
#             self._shutdown_cherrypy()
#
#             return error if error else self.success_html
#
#         def _fmt_failure(self, message):
#             tb = traceback.format_tb(sys.exc_info()[2])
#             tb_html = '<pre>%s</pre>' % ('\n'.join(tb)) if tb else ''
#             return self.failure_html % (message, tb_html)
#
#         def _shutdown_cherrypy(self):
#             """ Shutdown cherrypy in one second, if it's running """
#             if cherrypy.engine.state == cherrypy.engine.states.STARTED:
#                 #threading.Timer(1, cherrypy.engine.exit).start()
#                 cherrypy.engine.exit #Gina mod
#
#     ####
#
#
#     CLIENT_ID = '22CV44'
#     CLIENT_SECRET = '181ad1d21458261e54e979a8e65e85c9'
#
#     server = OAuth2Server(CLIENT_ID, CLIENT_SECRET)
#     server.browser_authorize()
#
#     #TODO: add try and except - return success if fitbit data retrieved
#     resp = {"fitbitDataRetrieved": "success"}
#
#     return jsonify(**resp)


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
