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
      three_month_ago_date = yyyy + '-' + m3 + '-' + dd; // probably want a scope like this
      //console.log(year_ago_date)
      month_ago_date = yyyy + '-' + String(Number(mm)-1) + '-' + dd;
      //console.log(month_ago_date)
      //join_date = ; //need this in case dont have data within time limit requested
      // will get second level resolution later
      //NOTE: need to go smaller files to bigger files (faster to slower) or labels will be off (TODO: check filename associations once second-level data access granted)
      //data_urls = ['https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1sec.json', 'https://api.fitbit.com/1/user/-/activities/steps/date/today/1d/1min.json', 'https://api.fitbit.com/1/user/-/activities/heart/date/'+ year_ago_date + '/today.json', 'https://api.fitbit.com/1/user/-/activities/steps/date/'+ year_ago_date + '/today.json', ] // now for each url, access data and append to parameter to save
      //var data_labels = ['todayHR','todaySteps','yearlyHR','yearlySteps']; //define filenames corresponding to urls
      //for (var u = 0; u<data_urls.length; u++){
        //var curr_label = data_labels[u]; //iterates too quickly
        //console.log(data_labels[u])

        //TODO: need to figure out how to get this into a loop in which urls match their labels (currently variable lag between fetch and saving)


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
          console.log(resp) //look at data in console

          //var blob = new Blob([resp], { type: "text/json"});
          //nf = new File([blob], "./fitbit/thisisafilename.json", {type: "text/json;charset=utf-8"});
          //console.log(nf)

           //if want like how saving audio - currently not working
          //var data_labels = ['yearlyHR','todayHR']; //define filenames corresponding to urls
          var fileType = 'fitbit';

          //curr_label = data_labels[0];
          //console.log(curr_label)
          //data_labels.shift() // remove 1st element of array if used as label since loop too fast to index
          var fileName = uniqueId + '-' + 'todayHR' + '.json';//'.txt';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', uniqueId);
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
      fetch('https://api.fitbit.com/1/user/-/activities/heart/date/'+ three_month_ago_date + '/today.json',
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
          var fileType = 'fitbit';
          var fileName = uniqueId + '-' + '3monthHR' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', uniqueId);
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
      fetch('https://api.fitbit.com/1/user/-/activities/steps/date/'+ three_month_ago_date + '/today.json',
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
          var fileType = 'fitbit';
          var fileName = uniqueId + '-' + '3monthSteps' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', uniqueId);
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
      fetch('https://api.fitbit.com/1/user/-/activities/distance/date/'+ three_month_ago_date + '/today.json',
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
          var fileType = 'fitbit';
          var fileName = uniqueId + '-' + '3monthDistance' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', uniqueId);
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
      fetch('https://api.fitbit.com/1/user/-/activities/floors/date/'+ three_month_ago_date + '/today.json',
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
          var fileType = 'fitbit';
          var fileName = uniqueId + '-' + '3monthFloors' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', uniqueId);
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
      fetch('https://api.fitbit.com/1/user/-/activities/elevation/date/'+ three_month_ago_date + '/today.json',
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
          var fileType = 'fitbit';
          var fileName = uniqueId + '-' + '3monthElevation' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', uniqueId);
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
      fetch('https://api.fitbit.com/1/user/-/activities/minutesSedentary/date/'+ three_month_ago_date + '/today.json',
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
          var fileType = 'fitbit';
          var fileName = uniqueId + '-' + '3monthMinsSed' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', uniqueId);
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
      fetch('https://api.fitbit.com/1/user/-/activities/minutesLightlyActive/date/'+ three_month_ago_date + '/today.json',
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
          var fileType = 'fitbit';
          var fileName = uniqueId + '-' + '3monthMinsLightAct' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', uniqueId);
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
      fetch('https://api.fitbit.com/1/user/-/activities/minutesFairlyActive/date/'+ three_month_ago_date + '/today.json',
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
          var fileType = 'fitbit';
          var fileName = uniqueId + '-' + '3monthMinsFairlyAct' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', uniqueId);
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
      fetch('https://api.fitbit.com/1/user/-/activities/minutesVeryActive/date/'+ three_month_ago_date + '/today.json',
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
          var fileType = 'fitbit';
          var fileName = uniqueId + '-' + '3monthMinsVeryAct' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', uniqueId);
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
      fetch('https://api.fitbit.com/1/user/-/activities/calories/date/'+ three_month_ago_date + '/today.json',
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
          var fileType = 'fitbit';
          var fileName = uniqueId + '-' + '3monthCalories' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', uniqueId);
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
      fetch('https://api.fitbit.com/1/user/-/activities/caloriesBMR/date/'+ three_month_ago_date + '/today.json',
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
          var fileType = 'fitbit';
          var fileName = uniqueId + '-' + '3monthCaloriesBMR' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', uniqueId);
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
          console.log(resp) //look at data in console
          var fileType = 'fitbit';
          var fileName = uniqueId + '-' + 'devices' + '.json';//'.json';
          var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

          var formData = new FormData();
          formData.append(fileType + '-filename', fileName);
          formData.append(fileType + '-foldername', uniqueId);
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
        fetch('https://api.fitbit.com/1/user/-/body/weight/date/' + three_month_ago_date + '/today.json',
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
            var fileType = 'fitbit';
            var fileName = uniqueId + '-' + '3monthWeight' + '.json';//todayWeight
            var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-foldername', uniqueId);
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
        fetch('https://api.fitbit.com/1/user/-/body/bmi/date/' + three_month_ago_date + '/today.json',
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
            var fileType = 'fitbit';
            var fileName = uniqueId + '-' + '3monthBMI' + '.json';//todayWeight
            var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-foldername', uniqueId);
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
        fetch('https://api.fitbit.com/1/user/-/body/fat/date/' + three_month_ago_date + '/today.json',
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
            var fileType = 'fitbit';
            var fileName = uniqueId + '-' + '3monthBodyFat' + '.json';//todayWeight
            var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-foldername', uniqueId);
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
        fetch('https://api.fitbit.com/1/user/-/foods/log/caloriesIn/date/' + three_month_ago_date + '/today.json',
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
            var fileType = 'fitbit';
            var fileName = uniqueId + '-' + '3monthFood' + '.json';//'.json';
            var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-foldername', uniqueId);
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
        fetch('https://api.fitbit.com/1/user/-/foods/log/water/date/' + three_month_ago_date + '/today.json',
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
            var fileType = 'fitbit';
            var fileName = uniqueId + '-' + '3monthWater' + '.json';//'.json';
            var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-foldername', uniqueId);
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
        fetch('https://api.fitbit.com/1.2/user/-/sleep/list.json?beforeDate=today&sort=asc&offset=0&limit=91',
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
            var fileType = 'fitbit';
            var fileName = uniqueId + '-' + '3monthsleep' + '.json';//'.json';
            var blob = new Blob([JSON.stringify(resp)], { type: "text/json"});

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-foldername', uniqueId);
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

      //}
  }
)} //maybe make into IEF

fitbit_data_auth() //return success or failure flag
