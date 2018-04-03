// TODO: load in vars separately here since separate window ***
var client_id="22CV44"
var client_secret = "181ad1d21458261e54e979a8e65e85c9"
var scope="activity heartrate sleep weight nutrition"
var redirect_uri = 'http://localhost:22364/redirect.html' // needs to match app settings on dev.fitbit.com (and mturk server url)
var fitbitSuccess = false; //initialize

// need code within auth url to access data
urlstring = String(window.location.href)
urlsplit = urlstring.split('code=')
hash_auth_code = urlsplit[1];
split_hash = hash_auth_code.split('#')
auth_code = split_hash[0]



// TODO: make this into a function that is called upon until scope lengths match
// define access url with the code and client_id
acc_url = 'https://api.fitbit.com/oauth2/token?code='+auth_code+'&client_id='+client_id+'&grant_type=authorization_code' //base url https://api.fitbit.com/oauth2/token

function fitbit_data_auth(){
  fetch(acc_url, { //'https://api.fitbit.com/oauth2/token'
  method: 'POST',
  headers: new Headers({
  'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': 'Basic '+btoa('22CV44:181ad1d21458261e54e979a8e65e85c9'),
  })
  //data: client_string,
}).then(function(response){
  promise_obj = response.json()
  //console.log(promise_obj)
  return promise_obj // returns resolved promise
}).then(function(resp){
  promise_val = resp //returns values in object
  //console.log(promise_val) //access_token = promise_val['access_token']
  return promise_val
}).then(function(pV){ //TODO: ****separate out this processing part from following retrieval section ****
  access_token = pV['access_token']
  //also need to check which variables authorized in scope
  auth_scope = pV['scope']
  indiv_auth_scope = auth_scope.split(" ")
  console.log(indiv_auth_scope)
  //compare to initial array of scope
  indiv_scope = scope.split(" ") //produces vector of all possible choices
  console.log(indiv_scope)
  if (indiv_scope.length !== indiv_auth_scope.length) { //if all the boxes (scope elements) were not checked, revoke current access and request to try again
    fitbitSuccess = false;
    alert('You must select all boxes in order to proceed with the experiment. Please try again.')
    rev_url = 'https://api.fitbit.com/oauth2/revoke?token=' + access_token
    fetch(rev_url, { //'https://api.fitbit.com/oauth2/token'
      method: 'POST',
      headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic '+btoa('22CV44:181ad1d21458261e54e979a8e65e85c9'),
      })
     })
    //fitbit_data_auth()
    window.history.back() //can reuse same code to reauthorize data access *** double check this**

    /* // need to restart process
    fetch(acc_url, { //'https://api.fitbit.com/oauth2/token'
      method: 'POST',
      headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic '+btoa('22CV44:181ad1d21458261e54e979a8e65e85c9'),
      })
      //data: client_string,
    })*/
   } else { //otherwise, looks good and can continue back to experiment
    fitbitSuccess = true
    var successHTML =  document.createElement ('div');
    successHTML.innerHTML   = ' \
      <div id="success-text"> \
      <center> \
      <h1>Thank you for providing access to your Fitbit data!</h1> \
      <br /> \
      <br /> \
      <button type="button" onclick="window.close();console.log(fitbitSuccess)">Close window and return to the experiment</button> \
      </center> \
      </div> \
      ';
    document.body.appendChild(successHTML);
   }
 }
)
}

fitbit_data_auth() //return success or failure flag

////////////////////
/*
  //console.log(typeof(access_token))
  //test this **make sure have scope selected for profile or whatever extracting, otherwise will get error (need to catch if didnt grant permissions )
  // TODO: determine which parameters to extract
  fetch('https://api.fitbit.com/1/user/-/activities/heart/date/2017-03-01/2018-03-01.json', //https://api.fitbit.com/1/user/-/profile.json', //'https://api.fitbit.com/1/user/-/activities/heart/date/2018-03-19/1d/1sec/time/11:00/12:00.json', //now that have access code, should be able to access data! //'https://api.fitbit.com/1/user/-/profile.json',  //
      {
        method: 'GET',
        headers: new Headers({
          'Authorization': 'Bearer ' + access_token
        }),
        //mode:'cors',
      }
  ).then(function(response){
    data_fetch = response.json()
    //console.log(data_fetch)
    return data_fetch
  }).then(function(resp){
    console.log(resp) //look at data in console
    return resp
  })
// }
//)
*/
///////////////////////////////

//TODO: have some check of whether data successfully authorized and accessed (set minimum scope parameters to allow to proceed)
/*
if (indiv_scope.length === indiv_auth_scope.length) {//(auth_code){
  var fitbitSuccess = true;
}
  else {
  var fitbitSuccess = false;
}
*/


console.log(fitbitSuccess) //return some success value if acquired data properly
