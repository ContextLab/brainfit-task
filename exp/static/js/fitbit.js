// TODO: load in vars separately here since separate window ***
var client_id="22CV44"
var client_secret = "181ad1d21458261e54e979a8e65e85c9"
var scope="activity heartrate sleep weight nutrition"
var redirect_uri = 'http://localhost:22364/redirect.html' // needs to match app settings on dev.fitbit.com (and mturk server url)

var auth_url = 'https://fitbit.com/oauth2/authorize?response_type=code&client_id=' + client_id +'&scope=' + scope //+ "'&redirect_uri='+ redirect_uri + &state="+state

window.location.replace(auth_url);
