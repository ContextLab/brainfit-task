import fitbit
import gather_keys_oauth2 as Oauth2
import pandas as pd
import datetime


CLIENT_ID = '22CV44'
CLIENT_SECRET = '181ad1d21458261e54e979a8e65e85c9'#9

print(1)
server = Oauth2.OAuth2Server(CLIENT_ID, CLIENT_SECRET)
#server = OAuth2Server(CLIENT_ID, CLIENT_SECRET)
print(2)
server.browser_authorize() #fails here
#url https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22CV44&redirect_uri=http%3A%2F%2F127.0.0.1%3A8099%2F&scope=heartrate&state=Cp35h0p5MU1m32PO9VUpOWCL21h5Sr
print(3)
ACCESS_TOKEN = str(server.fitbit.client.session.token['access_token'])
print(4)
REFRESH_TOKEN = str(server.fitbit.client.session.token['refresh_token'])
print(5)
auth2_client = fitbit.Fitbit(CLIENT_ID, CLIENT_SECRET, oauth2=True, access_token=ACCESS_TOKEN, refresh_token=REFRESH_TOKEN)
print(6)

#yesterday = str((datetime.datetime.now() - datetime.timedelta(days=1)).strftime("%Y%m%d"))
#yesterday2 = str((datetime.datetime.now() - datetime.timedelta(days=1)).strftime("%Y-%m-%d"))
today = str(datetime.datetime.now().strftime("%Y%m%d"))

fit_statsHR = auth2_client.intraday_time_series('activities/heart', base_date=today, detail_level='1sec')
print fit_statsHR
