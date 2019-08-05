var db = firebase.firestore();
var jobListingRole = {};
var jobListingExpiry = {};
var jobListingExpiryDummy = {};
var expiryArray = [];
var jobListingArray = [];



function generateJobListingExpiry() {
      expiryArray.sort();
      for (var i = 0; i < expiryArray.length; i ++) {
          for (key in jobListingExpiryDummy) {
              if (jobListingExpiryDummy[key] == expiryArray[i]) {
                console.log("=============================OOOOH YEAH===================");
                  jobListingArray.push(key);
                  delete jobListingExpiryDummy[key];
                  console.log(expiryArray);
                  console.log("REAL", jobListingArray);
                  console.log("DUMMY", jobListingExpiryDummy);
                  
                  
              }
          }
      }
} 





function onLoad() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
            populateDict(user.uid);
            populateData(user.uid);
            
              
        } else {
            window.alert('No user signed in');
            window.location.assign('index.html');
        }
    });
    

}

function populateDict(userUID) {
        db.collection("jobListing").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log("Hi");
            if (doc.data().lecturer == userUID) {
                jobListingRole[doc.id] = doc.data().courseCode + " " + doc.data().role;
                console.log(`${doc.id} => ${doc.data()}`);
                expiryArray[expiryArray.length] = doc.data().expiryDate;
                
                jobListingExpiryDummy[doc.id] = doc.data().expiryDate;
            }  
          });
        }).then(function() {
            console.log("HELP");
            generateJobListingExpiry();
        });
}

function populateData(userUID) {
  var counter = 1;
  db.collection("jobApplication").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          if(doc.data().lecturer == userUID && counter <= 3) {
            console.log("Counter: ",counter);
            
              var applicantAndRoleID = "applicantAndRole" + counter;
              var applicantStatusID = "applicantStatus" + counter;
              var applicantProgressBarID = "applicantProgressBar" + counter;
              var viewDetailsID = "viewDetails" + counter;

              var applicantAndRole = document.getElementById(applicantAndRoleID);
              var applicantStatus = document.getElementById(applicantStatusID);
              var applicantProgressBar = document.getElementById(applicantProgressBarID);
              var viewDetails = document.getElementById(viewDetailsID);


              applicantAndRole.innerHTML = doc.data().applicantName + "<br>" + jobListingRole[doc.data().jobListing];
              applicantStatus.innerHTML = "Status: " + doc.data().status;

              var jobListingRef = db.collection('jobListing').doc(doc.data().jobListing);
              // var applicantRef = db.collection('applicant').doc(doc.data().applicant);
              var status = doc.data().status;


    
              if (status == "Pending") {
              
                  applicantProgressBar.setAttribute('style', 'width:20%;');
                  //applicantProgressBar.innerHTML = "Pending";
              } else if (status == "Interview Pending") {
                
                  applicantProgressBar.setAttribute('style', 'width:40%;');
                  //applicantProgressBar.innerHTML = "Interview Offered";
              } else if (status == "Interview Completed - Under Review") {
                
                  applicantProgressBar.setAttribute('style', 'width:60%;');
                  //applicantProgressBar.innerHTML = "Under Review";
              } else if (status == "Accepted - Allocate Class") {
                
                  applicantProgressBar.setAttribute('style', 'width:80%;');
                  //applicantProgressBar.innerHTML = "Allocating Classes";
              } else if (status == "Accepted") {
                
                  applicantProgressBar.setAttribute('style', 'width:80%;');
                  //applicantProgressBar.innerHTML = "Accepted";
              } else {
          
                  applicantProgressBar.setAttribute('style', 'width:100%;');
                    //applicantProgressBar.innerHTML = "Rejected";
              }      
              console.log(`${doc.id} => ${doc.data()}`);

              var theLink = 'applicationDetailed.html?' + doc.id;
              viewDetails.setAttribute('href',theLink);

              counter ++;
          }
      });
  }).then(function() {
      populateTheOtherData(userUID);
  });
}

function populateTheOtherData(userUID) {
      console.log("OOOOOOOO");
      var counter = 0;
      var counterTwo = 1;
      db.collection("jobListing").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log("Hi");
          if (doc.data().lecturer == userUID && counterTwo <= 3) {
              if (counter < jobListingArray.length && jobListingArray[counter] == doc.id) {
                  var listingTitleID = 'listingTitle' + counterTwo;
                  var expiryDateID = 'expiryDate' + counterTwo;
                  var noOfApplicationID = 'noOfApplication' + counterTwo;
                  var progressBarID = 'listingProgressBar' + counterTwo;
                  var viewDetailsID = 'listingViewDetail' + counterTwo;


                  var listingTitle = document.getElementById(listingTitleID);
                  var expiryDate = document.getElementById(expiryDateID);
                  var noOfApplication = document.getElementById(noOfApplicationID);
                  var progressBar = document.getElementById(progressBarID);
                  var viewDetails = document.getElementById(viewDetailsID);
                  
                  listingTitle.innerHTML = doc.data().courseCode + " " + doc.data().role + "<br>" + doc.data().courseName;
                  expiryDate.innerHTML = "Expiry Date: " + timeStampConverter(doc.data().expiryDate);
                  viewDetails.setAttribute('href','jobListingDetail_static.html?' + doc.id);
                  counter ++;
                  counterTwo ++;
              }
          }  
        });
      });
}


function timeStampConverter(unix_timestamp) {
  console.log(unix_timestamp);
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  var date = new Date(unix_timestamp * 1000);
  // Hours part from the timestamp
  var day = date.getDate();

  var month = date.getMonth();

  var year = date.getFullYear();
  // Minutes part from the timestamp
  const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];

  
  // Will display time in 10:30:23 format
  var formattedTime = day + " " + monthNames[month] + " " + year;
  return formattedTime;
}



function logout() {
    firebase.auth().signOut().then(function() {
        console.log('A user successfully logged out');
        window.location.assign("index.html");
      }).catch(function(error) {
        window.alert('Something happened!');
      });
}

function navBarClick(something) {
  console.log(something);
  window.location.assign(something);
}

