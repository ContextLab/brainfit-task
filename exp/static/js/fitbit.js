//retrieve vars sent from browser window
var client_id = window.opener.client_id;
var scope = window.opener.scope;
var redirect_uri = window.opener.redirect_uri;
//var prompt_flag = window.opener.prompt_flag;

var auth_url = 'https://fitbit.com/oauth2/authorize?response_type=code&client_id=' + client_id +'&scope=' + scope; // + '&prompt=' + prompt_flag //+ "'&redirect_uri='+ redirect_uri + &state="+state

window.location.replace(auth_url);
