#!/usr/bin/env python
import cherrypy
import os
import sys
import threading
import traceback
import webbrowser
import fitbit
import datetime
import time

import json

from base64 import b64encode
from fitbit.api import Fitbit
from oauthlib.oauth2.rfc6749.errors import MismatchingStateError, MissingTokenError


cherrypy.config.update({'server.socket_port': 9090})
#cherrypy.config.update({'server.shutdown_timeout': 10 })
#cherrypy.config.update({'engine.autoreload.on': False})
cherrypy.engine.restart()


class OAuth2Server:
    def __init__(self, client_id, client_secret,
                 redirect_uri='http://localhost:9090/'):
        """ Initialize the FitbitOauth2Client """
        self.success_html = """
            <h1>Thank you for providing access to your Fitbit data!</h1>
            <br/><button type="button" onclick = "window.close()">Close Window</button>"""
        self.failure_html = """
            <h1>ERROR: %s</h1><br/><h3>You can close this window</h3>%s"""

        self.fitbit = Fitbit(
            client_id,
            client_secret,
            redirect_uri=redirect_uri, #is this necessary?
            timeout=10,
        )

    def browser_authorize(self):
        """
        Open a browser to the authorization url and spool up a CherryPy
        server to accept the response
        """
        url, _ = self.fitbit.client.authorize_token_url(scope = ["activity", "heartrate","sleep","weight","nutrition","location"]) #TODO: test new scope after removing app
        #print(url)
        # Open the web browser in a new thread for command-line browser support
        #threading.Timer(1, webbrowser.open, args=(url,)).start()
        webbrowser.open(url,new=2) #Gina mod
        cherrypy.quickstart(self) #keeps looping, dont want thread****

    @cherrypy.expose
    def index(self, state, code=None, error=None):
        """
        Receive a Fitbit response containing a verification code. Use the code
        to fetch the access_token.
        """
        #cherrypy.engine.autoreload.on = False;

        error = None
        if code:
            try:
                self.fitbit.client.fetch_access_token(code)
                #self._shutdown_cherrypy() #GN add
            except MissingTokenError:
                error = self._fmt_failure(
                    'Missing access token parameter.</br>Please check that '
                    'you are using the correct client_secret')
            except MismatchingStateError:
                error = self._fmt_failure('CSRF Warning! Mismatching state')
        else:
            error = self._fmt_failure('Unknown error while authenticating')

        ACCESS_TOKEN = str(self.fitbit.client.session.token['access_token'])
        REFRESH_TOKEN = str(self.fitbit.client.session.token['refresh_token'])

        #figure out better way to add all this
        CLIENT_ID = '22CV44'
        CLIENT_SECRET = '181ad1d21458261e54e979a8e65e85c9'#9
        auth2_client = fitbit.Fitbit(CLIENT_ID, CLIENT_SECRET, oauth2=True, access_token=ACCESS_TOKEN, refresh_token=REFRESH_TOKEN)
        yesterday = str((datetime.datetime.now() - datetime.timedelta(days=1)).strftime("%Y-%m-%d"))
        today = str(datetime.datetime.now().strftime("%Y-%m-%d"))

        #now access and output variables of interest:

        # past year of daily average fitbit data (1w,1y,max is lifetime)
        summary_HR_yearly = auth2_client.time_series('activities/heart',period='1y')#,detail_level='1s')#, start_time=yesterday, end_time = today, detail_level='1min')
        #print summary_HR_yearly

        #today's more granular data (if available, might only be if have bluetooth on all the time***)
        today_HR= auth2_client.intraday_time_series('activities/heart',base_date=today,detail_level='1sec')#,start_time='12:00',end_time='12:30') #base_date='20180323',,base_date='20180201',detail_level='1sec')#,start_time=start_time,end_time=end_time)
        #print(today_HR)

        #similarly for steps - past year
        summary_steps_yearly = auth2_client.time_series('activities/tracker/steps',period='1y')
        #print(summary_steps_yearly)

        #look at minutes of activity levels
        summary_mins_sed = auth2_client.time_series('activities/tracker/minutesSedentary',period='1y')
        summary_mins_lightact = auth2_client.time_series('activities/tracker/minutesLightlyActive',period='1y')
        summary_mins_fairlyact = auth2_client.time_series('activities/tracker/minutesFairlyActive',period='1y')
        summary_mins_veryact = auth2_client.time_series('activities/tracker/minutesVeryActive',period='1y')

        print(summary_mins_veryact)

        #get idea of lifetime activities
        fav_activities = auth2_client.activity_stats(qualifier='frequent')
        #print(fav_activities)
        recent_activities = auth2_client.activity_stats(qualifier='recent')
        #print(recent_activities)


        #fit_badges = auth2_client.get_badges()
        #print(fit_badges)
        #print(today)#'20180201'
        #stats=auth2_client.intraday_time_series('activities/heart',base_date='20180326',detail_level='1sec',start_time='12:00',end_time='12:30')
        #print(stats)
        # Use a thread to shutdown cherrypy so we can return HTML first
        #time.sleep(10)
        self._shutdown_cherrypy()

        return error if error else self.success_html

    def _fmt_failure(self, message):
        tb = traceback.format_tb(sys.exc_info()[2])
        tb_html = '<pre>%s</pre>' % ('\n'.join(tb)) if tb else ''
        return self.failure_html % (message, tb_html)

    def _shutdown_cherrypy(self):
        """ Shutdown cherrypy in one second, if it's running """
        if cherrypy.engine.state == cherrypy.engine.states.STARTED:
            #threading.Timer(1, cherrypy.engine.exit).start()
            cherrypy.engine.exit #Gina mod

if __name__ == '__main__':

    if not (len(sys.argv) == 3):
        print("Arguments: client_id and client_secret")
        sys.exit(1)

    server = OAuth2Server(*sys.argv[1:])
    server.browser_authorize()

    profile = server.fitbit.user_profile_get()
    print('You are authorized to access data for the user: {}'.format(
        profile['user']['fullName']))

    print('TOKEN\n=====\n')
    for key, value in server.fitbit.client.session.token.items():
        print('{} = {}'.format(key, value))
