
//window.location.replace('https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22CV44&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F&scope=activity+heartrate+sleep+weight+nutrition+location+profile&state=Cp35h0p5MU1m32PO9VUpOWCL21h5Sr');

//TODO: create function to import these params instead of just typing out

client_id="22CV44"
clientSecret="181ad1d21458261e54e979a8e65e85c9"
scope="activity heartrate sleep weight nutrition location profile"
state = "?assignmentId=debug9T7WEH&hitId=debug1PYWT6&workerId=debugA1RQEH&mode=debug" //retrieve specific IDs from other file
redirect_uri = 'http://localhost:22364/redirect.html' //match mturk

//ex_redir_uri =http://localhost:22364/exp?hitId=debug1PYWT6&assignmentId=debug9T7WEH&workerId=debugA1RQEH&mode=debug

url = 'https://fitbit.com/oauth2/authorize?response_type=code&client_id=' + client_id +'&scope=' + scope //+ "'&redirect_uri='+ redirect_uri + &state="+state

//url='https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=22CV44&redirect_uri=http://localhost:8080/&scope=activity%20nutrition%20heartrate%20location%20profile%20settings%20sleep%20weight'

window.location.replace(url);
