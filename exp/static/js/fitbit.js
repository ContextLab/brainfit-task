//retrieve vars sent from browser window
var client_id = window.opener.client_id;
var scope = window.opener.scope;
var redirect_uri = window.opener.redirect_uri;

var auth_url = 'https://fitbit.com/oauth2/authorize?response_type=code&client_id=' + client_id +'&scope=' + scope //+ "'&redirect_uri='+ redirect_uri + &state="+state

window.location.replace(auth_url);
