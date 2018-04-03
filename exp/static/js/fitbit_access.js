 //retrieve vars sent from browser window
var uniqueId = window.opener.uniqueId;
var client_id = window.opener.client_id;
var client_secret = window.opener.client_secret;
var scope = window.opener.scope;
var redirect_uri = window.opener.redirect_uri;

var fitbitSuccess = false; //initialize in outer scope
var access_token = 'string'

// need code provided within authorization url to access data
urlstring = String(window.location.href)
urlsplit = urlstring.split('code=')
hash_auth_code = urlsplit[1];
split_hash = hash_auth_code.split('#')
auth_code = split_hash[0]


////////////////////////////////////////////////////////////////////////////////
// FITBIT DATA AUTHORIZATION & DATA ACCESS /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// define access url with the code and client_id
acc_url = 'https://api.fitbit.com/oauth2/token?code='+auth_code+'&client_id='+client_id+'&grant_type=authorization_code' //base url https://api.fitbit.com/oauth2/token

function fitbit_data_auth(){
  fetch(acc_url, {
  method: 'POST',
  headers: new Headers({
  'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': 'Basic '+btoa(client_id+':'+client_secret),
  })
}).then(function(response){
  promise_obj = response.json()
  return promise_obj // returns resolved promise
}).then(function(resp){
  promise_obj_val = resp //returns values in object
  return promise_obj_val
}).then(function(promise_vals){
  access_token = promise_vals['access_token']
  //also need to check which variables authorized in scope
  auth_scope = promise_vals['scope']
  indiv_auth_scope = auth_scope.split(" ")
  //console.log(indiv_auth_scope)
  //compare to initial array of scope
  indiv_scope = scope.split(" ") //produces vector of all possible choices
  //console.log(indiv_scope)
  if (indiv_scope.length !== indiv_auth_scope.length) { //if all the boxes (scope elements) were not checked, revoke current access and request to try again
    fitbitSuccess = false; //data not properly authorized
    alert('You must select all boxes in order to proceed with the experiment. Please try again.')
    //access_token = promise_vals['access_token']

    /*
    rev_url = 'https://api.fitbit.com/oauth2/revoke?token=' + access_token
    fetch(rev_url, { //'https://api.fitbit.com/oauth2/token'
      method: 'POST',
      headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic '+btoa('22CV44:181ad1d21458261e54e979a8e65e85c9'),
      })
    })*/ //TODO: add in refresh token instead of this

    window.history.back() //TODO: double check this, seem to can reuse same code to reauthorize data access since code valid for certain period of time
   } else { //otherwise, looks good and can continue back to experiment
    fitbitSuccess = true //data properly authorized
    //access_token = promise_vals['access_token']
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
).then( //now access data
  function(r){
      // first define urls for each dataset to access (note: needs to be within scope or will get error); '-' is current user
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();

      if(dd<10) {
          dd = '0'+dd
      }

      if(mm<10) {
          mm = '0'+mm
      }

      today_date = yyyy+ '-' + mm + '-' + dd; //format according to fitbit urls (YYYY-MM-DD)

      year_ago_date = String(Number(yyyy)-1) + '-' + mm + '-' + dd;
      //console.log(year_ago_date)
      month_ago_date = yyyy + '-' + String(Number(mm)-1) + '-' + dd;
      //console.log(month_ago_date)
      //join_date = ; //need this in case dont have data within time limit requested
      // will get second level resolution later
      data_urls = ['https://api.fitbit.com/1/user/-/activities/heart/date/'+ year_ago_date + '/today.json', 'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec.json', 'https://api.fitbit.com/1/user/-/activities/heart/date/2018-03-27/1d/1sec.json'] // now for each url, access data and append to parameter to save
      fetch(data_urls[0],
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


         //if want like how saving audio - currently not working
        var fileType = 'fitbit';
        var fileName = uniqueId + '-' + 'heartrate' + '.txt';//'.json';
        var blob = new Blob([resp], { type: "json"});

        var formData = new FormData();
        formData.append(fileType + '-filename', fileName);
        formData.append(fileType + '-foldername', uniqueId);
        for ( var key in resp ) {
          console.log(key)
          formData.append(fileType + '-blob', new Blob(resp[key],{ type: "text"}));
        }
        //formData.append(fileType + '-blob', blob);

        var request = new XMLHttpRequest();
        request.timeout = 60000; // time in milliseconds

        request.open("POST", "/save-fitbit");
        request.send(formData);

        request.onreadystatechange = function() {
          console.log(request) //debug
          //if (request.readyState == XMLHttpRequest.DONE) {
          //  console.log('Saved!')
          //}
        }



        return resp

      })
  }
)}

fitbit_data_auth() //return success or failure flag
