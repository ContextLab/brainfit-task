 //retrieve vars sent from browser window
var uniqueId = window.opener.uniqueId;
var client_id = window.opener.client_id;
var client_secret = window.opener.client_secret;
var scope = window.opener.scope;
var redirect_uri = window.opener.redirect_uri;

var fitbitSuccess = false; //initialize in outer scope
var access_token = 'string'

var newuniqueId = uniqueId.replace(':','-') // need to change to dash because character issues when slash / used to replace


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
      var mm = today.getMonth()+1; //January is 0
      var m3 = today.getMonth()+1 - 3; // three months ago
      var yyyy = today.getFullYear();

      //need to add 0's to have in proper format
      if(dd < 10) {
          dd = '0' + dd
      }

      if(mm < 10) {
          mm = '0' + mm
      }

      if(m3 < 10){
          m3 = '0' + m3
      }

      today_date = yyyy+ '-' + mm + '-' + dd; //format according to fitbit urls (YYYY-MM-DD)

      year_ago_date = String(Number(yyyy)-1) + '-' + mm + '-' + dd; //TODO: make sure enough data to pull this request
      //three_month_ago_date = yyyy + '-' + m3 + '-' + dd; // probably want a scope like this
      //month_ago_date = yyyy + '-' + String(Number(mm)-1) + '-' + dd;

      //console.log(year_ago_date)
      //console.log(month_ago_date)
      //join_date = ; //need this in case dont have data within time limit requested
      // TODO will get second level resolution later
      //data_urls = ['https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec.json', 'https://api.fitbit.com/1/user/-/activities/steps/date/today/1d/1min.json', 'https://api.fitbit.com/1/user/-/activities/heart/date/'+ year_ago_date + '/today.json', 'https://api.fitbit.com/1/user/-/activities/steps/date/'+ year_ago_date + '/today.json', ] // now for each url, access data and append to parameter to save

      // now set which date we want to use for data
      var retrieve_date = year_ago_date
      //console.log(retrieve_date)

        // comment back in if need to retrieve user profile to determine whether year_ago_date prior to

        ////////// RETRIEVE USER'S START DATE FROM PROFILE ////////
        // fetch('https://api.fitbit.com/1/user/-/profile.json',
        //       {
        //         method: 'GET',
        //         headers: new Headers({
        //           'Authorization': 'Bearer ' + access_token
        //         }),
        //         //mode:'cors',
        //       }
        //   ).then(function(response){
        //     data_fetch = response.json()
        //     //console.log(data_fetch)
        //     return data_fetch
        //   }).then(function(resp){
            // //console.log(resp) //look at data in console
            // console.log('Profile data loaded.')
            // //var fileType = 'fitbit';
            // //var fileName = newuniqueId + '-' + 'profile' + '.json';//'.json'; //probably dont want to save all this info
            // //var blob = new Blob([JSON.stringify(resp)], {type: "text/json"});
            // jsonResp =  resp //JSON.stringify(resp)
            // //console.log(jsonResp)
            // //console.log(jsonResp['user']['memberSince'])
            // prof_date = jsonResp['user']['memberSince']
            // if(new Date(prof_date) > new Date(retrieve_date)){
            //   retrieve_date = prof_date // if the user joined more recently than the retrieval date, use the profile date instead
            //   //console.log(prof_date)
            //   //console.log(retrieve_date)
            //   //return retrieve_date
            //   }
            // }).then(function(respo){
            //   //console.log(retrieve_date) //make sure output right value
            //   console.log('Join date loaded.')

      ////////// RETRIEVE TODAY'S HEART RATE DATA  ////////
      fetch('https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec.json',
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
          //console.log(resp) //look at data in console
          console.log('Daily heart rate data loaded.')
          //var blob = new Blob([resp], { type: "text/json"});
          //nf = new File([blob], "./fitbit/thisisafilename.json", {type: "text/json;charset=utf-8"});
          //console.log(nf)

           //if want like how saving audio - currently not working
          //var data_labels = ['yearlyHR','todayHR']; //define filenames corresponding to urls
          var fileType = 'fitbit';

          //curr_label = data_labels[0];
          //console.log(curr_label)
          //data_labels.shift() // remove 1st element of array if used as label since loop too fast to index

          //need to edit uniqueId since /'s in name create issues when analyzing data (this matches audio names that do this automatically)

          var fileName = newuniqueId + '-' + 'todayHR' + '.json';//'.txt';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', newuniqueId);
          formData.append(fileType + '-blob', blob);

          var request = new XMLHttpRequest();
          //request.timeout = 30000; //60000; // time in milliseconds

          request.open("POST", "/save-fitbit");
          request.send(formData);

          //request.onreadystatechange = function() {
          //  console.log(request) //debug
            //if (request.readyState == XMLHttpRequest.DONE) {
            //  console.log('Saved!')
            //}
        //  }
          //function wait(ms){ //implement sleep to give time to call?
          //   var start = new Date().getTime();
          //   var end = start;
          //   while(end < start + ms) {
          //     end = new Date().getTime();
          //  }
          //}(10000)
      })

      ////////// RETRIEVE SUMMARY HEART RATE DATA  ////////
      fetch('https://api.fitbit.com/1/user/-/activities/heart/date/'+ retrieve_date + '/today.json',
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
          //console.log(resp) //look at data in console
          console.log('Yearly heart rate data loaded.')
          var fileType = 'fitbit';
          var fileName = newuniqueId + '-' + 'yearHR' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', newuniqueId);
          formData.append(fileType + '-blob', blob);

          var request = new XMLHttpRequest();
          //request.timeout = 30000; //60000; // time in milliseconds

          request.open("POST", "/save-fitbit");
          request.send(formData);

          //request.onreadystatechange = function() {
            //console.log(request) //debug
          //}
      })

      ////////// RETRIEVE SUMMARY STEP DATA  ///////////
      fetch('https://api.fitbit.com/1/user/-/activities/steps/date/'+ retrieve_date + '/today.json',
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
          //console.log(resp) //look at data in console
          console.log('Step data loaded.')
          var fileType = 'fitbit';
          var fileName = newuniqueId + '-' + 'yearSteps' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', newuniqueId);
          formData.append(fileType + '-blob', blob);

          var request = new XMLHttpRequest();
          //request.timeout = 30000; //60000; // time in milliseconds

          request.open("POST", "/save-fitbit");
          request.send(formData);

          //request.onreadystatechange = function() {
          //  console.log(request) //debug
        //  }
      })

      ////////// RETRIEVE SUMMARY DISTANCE ///////////
      fetch('https://api.fitbit.com/1/user/-/activities/distance/date/'+ retrieve_date + '/today.json',
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
          //console.log(resp) //look at data in console
          console.log('Distance data loaded.')
          var fileType = 'fitbit';
          var fileName = newuniqueId + '-' + 'yearDistance' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', newuniqueId);
          formData.append(fileType + '-blob', blob);

          var request = new XMLHttpRequest();
          //request.timeout = 30000; //60000; // time in milliseconds

          request.open("POST", "/save-fitbit");
          request.send(formData);

          //request.onreadystatechange = function() {
          //  console.log(request) //debug
          //}
      })

      ////////// RETRIEVE SUMMARY FLOORS ///////////
      fetch('https://api.fitbit.com/1/user/-/activities/floors/date/'+ retrieve_date + '/today.json',
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
          //console.log(resp) //look at data in console
          console.log('Floor data loaded.')
          var fileType = 'fitbit';
          var fileName = newuniqueId + '-' + 'yearFloors' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', newuniqueId);
          formData.append(fileType + '-blob', blob);

          var request = new XMLHttpRequest();
          //request.timeout = 30000; //60000; // time in milliseconds

          request.open("POST", "/save-fitbit");
          request.send(formData);

          //request.onreadystatechange = function() {
          //  console.log(request) //debug
        //  }
      })

      ////////// RETRIEVE SUMMARY ELEVATION ///////////
      fetch('https://api.fitbit.com/1/user/-/activities/elevation/date/'+ retrieve_date + '/today.json',
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
          //console.log(resp) //look at data in console
          console.log('Elevation data loaded.')
          var fileType = 'fitbit';
          var fileName = newuniqueId + '-' + 'yearElevation' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', newuniqueId);
          formData.append(fileType + '-blob', blob);

          var request = new XMLHttpRequest();
          //request.timeout = 30000; //60000; // time in milliseconds

          request.open("POST", "/save-fitbit");
          request.send(formData);

        //  request.onreadystatechange = function() {
          //  console.log(request) //debug
        //  }
      })

      ////////// RETRIEVE SUMMARY MINUTES SEDENTARY ///////////
      fetch('https://api.fitbit.com/1/user/-/activities/minutesSedentary/date/'+ retrieve_date + '/today.json',
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
          //console.log(resp) //look at data in console
          console.log('Minutes sedentary loaded.')
          var fileType = 'fitbit';
          var fileName = newuniqueId + '-' + 'yearMinsSed' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', newuniqueId);
          formData.append(fileType + '-blob', blob);

          var request = new XMLHttpRequest();
          //request.timeout = 30000; //60000; // time in milliseconds

          request.open("POST", "/save-fitbit");
          request.send(formData);

        //  request.onreadystatechange = function() {
          //  console.log(request) //debug
        //  }
      })

      ////////// RETRIEVE SUMMARY MINUTES LIGHTLY ACTIVE ///////////
      fetch('https://api.fitbit.com/1/user/-/activities/minutesLightlyActive/date/'+ retrieve_date + '/today.json',
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
          //console.log(resp) //look at data in console
          var fileType = 'fitbit';
          var fileName = newuniqueId + '-' + 'yearMinsLightAct' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', newuniqueId);
          formData.append(fileType + '-blob', blob);

          var request = new XMLHttpRequest();
          //request.timeout = 30000; //60000; // time in milliseconds

          request.open("POST", "/save-fitbit");
          request.send(formData);

        //  request.onreadystatechange = function() {
        //    console.log(request) //debug
        //  }
      })

      ////////// RETRIEVE SUMMARY MINUTES FAIRLY ACTIVE ///////////
      fetch('https://api.fitbit.com/1/user/-/activities/minutesFairlyActive/date/'+ retrieve_date + '/today.json',
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
          //console.log(resp) //look at data in console
          console.log('Minutes fairly active loaded.')
          var fileType = 'fitbit';
          var fileName = newuniqueId + '-' + 'yearMinsFairlyAct' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', newuniqueId);
          formData.append(fileType + '-blob', blob);

          var request = new XMLHttpRequest();
          //request.timeout = 30000; //60000; // time in milliseconds

          request.open("POST", "/save-fitbit");
          request.send(formData);

        //  request.onreadystatechange = function() {
        //    console.log(request) //debug
        //  }
      })

      ////////// RETRIEVE SUMMARY MINUTES VERY ACTIVE ///////////
      fetch('https://api.fitbit.com/1/user/-/activities/minutesVeryActive/date/'+ retrieve_date + '/today.json',
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
          //console.log(resp) //look at data in console
          console.log('Minutes very active loaded.')
          var fileType = 'fitbit';
          var fileName = newuniqueId + '-' + 'yearMinsVeryAct' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', newuniqueId);
          formData.append(fileType + '-blob', blob);

          var request = new XMLHttpRequest();
          //request.timeout = 30000; //60000; // time in milliseconds

          request.open("POST", "/save-fitbit");
          request.send(formData);

        //  request.onreadystatechange = function() {
        //    console.log(request) //debug
        //  }
      })

      ////////// RETRIEVE SUMMARY ALL CALORIES ///////////
      fetch('https://api.fitbit.com/1/user/-/activities/calories/date/'+ retrieve_date + '/today.json',
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
          //console.log(resp) //look at data in console
          console.log('All calorie data loaded.')
          var fileType = 'fitbit';
          var fileName = newuniqueId + '-' + 'yearCalories' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', newuniqueId);
          formData.append(fileType + '-blob', blob);

          var request = new XMLHttpRequest();
          //request.timeout = 30000; //60000; // time in milliseconds

          request.open("POST", "/save-fitbit");
          request.send(formData);

        //  request.onreadystatechange = function() {
        //    console.log(request) //debug
        //  }
      })

      ////////// RETRIEVE SUMMARY ALL CALORIES BMR ///////////
      fetch('https://api.fitbit.com/1/user/-/activities/caloriesBMR/date/'+ retrieve_date + '/today.json',
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
          //console.log(resp) //look at data in console
          console.log('BMR calorie data loaded.')
          var fileType = 'fitbit';
          var fileName = newuniqueId + '-' + 'yearCaloriesBMR' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', newuniqueId);
          formData.append(fileType + '-blob', blob);

          var request = new XMLHttpRequest();
          //request.timeout = 30000; //60000; // time in milliseconds

          request.open("POST", "/save-fitbit");
          request.send(formData);

          //request.onreadystatechange = function() {
        //    console.log(request) //debug
        //  }
      })


      ////////// RETRIEVE SUMMARY DEVICE DATA ///////////
      fetch('https://api.fitbit.com/1/user/-/devices.json',
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
          //console.log(resp) //look at data in console
          console.log('Device info loaded.')
          var fileType = 'fitbit';
          var fileName = newuniqueId + '-' + 'devices' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', newuniqueId);
          formData.append(fileType + '-blob', blob);

          var request = new XMLHttpRequest();
          //request.timeout = 30000; //60000; // time in milliseconds

          request.open("POST", "/save-fitbit");
          request.send(formData);

          //request.onreadystatechange = function() {
        //    console.log(request) //debug
        //  }
      })

        ////////// RETRIEVE WEIGHT DATA ///////////
        // 1/user/-/body/log/weight/date/today.json',
        fetch('https://api.fitbit.com/1/user/-/body/weight/date/' + retrieve_date + '/today.json',
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
            //console.log(resp) //look at data in console
            console.log('Weight data loaded.')
            var fileType = 'fitbit';
            var fileName = newuniqueId + '-' + 'yearWeight' + '.json';//todayWeight
            var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-foldername', newuniqueId);
            formData.append(fileType + '-blob', blob);

            var request = new XMLHttpRequest();
            //request.timeout = 30000; //60000; // time in milliseconds

            request.open("POST", "/save-fitbit");
            request.send(formData);

            //request.onreadystatechange = function() {
          //    console.log(request) //debug
          //  }
        })

        ////////// RETRIEVE BMI DATA ///////////
        fetch('https://api.fitbit.com/1/user/-/body/bmi/date/' + retrieve_date + '/today.json',
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
            //console.log(resp) //look at data in console
            console.log('BMI data loaded.')
            var fileType = 'fitbit';
            var fileName = newuniqueId + '-' + 'yearBMI' + '.json';//todayWeight
            var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-foldername', newuniqueId);
            formData.append(fileType + '-blob', blob);

            var request = new XMLHttpRequest();
            //request.timeout = 30000; //60000; // time in milliseconds

            request.open("POST", "/save-fitbit");
            request.send(formData);

            //request.onreadystatechange = function() {
          //    console.log(request) //debug
          //  }
        })

        ////////// RETRIEVE BODY FAT DATA ///////////
        fetch('https://api.fitbit.com/1/user/-/body/fat/date/' + retrieve_date + '/today.json',
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
            //console.log(resp) //look at data in console
            console.log('Body fat data loaded.')
            var fileType = 'fitbit';
            var fileName = newuniqueId + '-' + 'yearBodyFat' + '.json';//todayWeight
            var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-foldername', newuniqueId);
            formData.append(fileType + '-blob', blob);

            var request = new XMLHttpRequest();
            //request.timeout = 30000; //60000; // time in milliseconds

            request.open("POST", "/save-fitbit");
            request.send(formData);

            //request.onreadystatechange = function() {
          //    console.log(request) //debug
          //  }
        })

        ////////// RETRIEVE FOOD DATA ///////////
        //https://api.fitbit.com/1/user/-/foods/log/date/today.json
        fetch('https://api.fitbit.com/1/user/-/foods/log/caloriesIn/date/' + retrieve_date + '/today.json',
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
            //console.log(resp) //look at data in console
            console.log('Calories consumed data loaded.')
            var fileType = 'fitbit';
            var fileName = newuniqueId + '-' + 'yearFood' + '.json';//'.json';
            var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-foldername', newuniqueId);
            formData.append(fileType + '-blob', blob);

            var request = new XMLHttpRequest();
            //request.timeout = 30000; //60000; // time in milliseconds

            request.open("POST", "/save-fitbit");
            request.send(formData);

            //request.onreadystatechange = function() {
          //    console.log(request) //debug
          //  }
        })


        ////////// RETRIEVE WATER DATA ///////////
        //'https://api.fitbit.com/1/user/-/foods/log/water/date/today.json'
        fetch('https://api.fitbit.com/1/user/-/foods/log/water/date/' + retrieve_date + '/today.json',
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
            //console.log(resp) //look at data in console
            console.log('Water data loaded.')

            var fileType = 'fitbit';
            var fileName = newuniqueId + '-' + 'yearWater' + '.json';//'.json';
            var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-foldername', newuniqueId);
            formData.append(fileType + '-blob', blob);

            var request = new XMLHttpRequest();
            //request.timeout = 30000; //60000; // time in milliseconds

            request.open("POST", "/save-fitbit");
            request.send(formData);

            //request.onreadystatechange = function() {
          //    console.log(request) //debug
          //  }
        })


        ////////// RETRIEVE SLEEP DATA ///////////
        //https://api.fitbit.com/1.2/user/-/sleep/list.json
        //'https://api.fitbit.com/1.2/user/-/sleep/date/' + three_month_ago_date + '/today.json'
        //91 log limit for past 3 mos
        fetch('https://api.fitbit.com/1.2/user/-/sleep/list.json?beforeDate=today&sort=asc&offset=0&limit=100', //'Limit cannot be greater than 100'
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
            //console.log(resp) //look at data in console
            console.log('Sleep data loaded.')

            var fileType = 'fitbit';
            var fileName = newuniqueId + '-' + 'yearSleep' + '.json';//'.json';
            var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-foldername', newuniqueId);
            formData.append(fileType + '-blob', blob);

            var request = new XMLHttpRequest();
            //request.timeout = 30000; //60000; // time in milliseconds

            request.open("POST", "/save-fitbit");
            request.send(formData);

            //request.onreadystatechange = function() {
          //    console.log(request) //debug
          //  }
        })
        //return resp
})
      //}
  }
//)} 

fitbit_data_auth() //return success or failure flag
