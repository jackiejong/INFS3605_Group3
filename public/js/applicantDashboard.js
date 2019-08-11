var db = firebase.firestore();
var jobListingRole = {};
var jobListingExpiry = {};
var jobListingExpiryDummy = {};
var expiryArray = [];
var jobListingArray = [];
var appliedJobs = [];



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
            getAppliedJob(user.uid);
        } else {
            window.alert('No user signed in');
            window.location.assign('index.html');
        }
    });
}
function getAppliedJob(userUID) {
    db.collection('applicant').doc(userUID).get().then(function(doc) {
        appliedJobs = doc.data().appliedJobs;
    }).then(function() {
        actuallyCreatingTables(userUID);  
    }).catch(function(error) {
        console.log(error);
    })
}
function populateDict() {
        db.collection("jobListing").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log("Hi");
            
                jobListingRole[doc.id] = doc.data().courseCode + " " + doc.data().role;
                console.log(`${doc.id} => ${doc.data()}`);
                expiryArray[expiryArray.length] = doc.data().expiryDate;
                
                jobListingExpiryDummy[doc.id] = doc.data().expiryDate;
            
          });
        }).then(function() {
            console.log("HELP");
            generateJobListingExpiry();
            populateTheOtherData();
        });
}


function logout() {
    firebase.auth().signOut().then(function() {
        console.log('A user successfully logged out');
        window.location.assign("index.html");
      }).catch(function(error) {
        window.alert('Something happened!');
      });
}


function populateTheOtherData() {
    
  db.collection("jobListing").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log("===================Hi===================");
     
      console.log(`${doc.id} => ${doc.data()}`);
      if (!appliedJobs.includes(doc.id)) {
            if (jobListingArray[0] == doc.id) {

                var listingTitleID = 'listingTitle1';
                var expiryDateID = 'expiryDate1';
                var noOfApplicationID = 'noOfApplication1';
                var progressBarID = 'listingProgressBar1';
                var viewDetailsID = 'listingViewDetail1';


                var listingTitle = document.getElementById(listingTitleID);
                var expiryDate = document.getElementById(expiryDateID);
                
                var viewDetails = document.getElementById(viewDetailsID);
                
                listingTitle.innerHTML = doc.data().courseCode + " " + doc.data().role + "<br>" + doc.data().courseName;
                expiryDate.innerHTML = "Expiry Date: " + timeStampConverter(doc.data().expiryDate);
                viewDetails.setAttribute('onclick','window.location.href="applicantApply.html?' + doc.id + '"');
                    
            } else if (jobListingArray[1] == doc.id) {
                var listingTitleID = 'listingTitle2';
                var expiryDateID = 'expiryDate2';
                var noOfApplicationID = 'noOfApplication2';
                var progressBarID = 'listingProgressBar2';
                var viewDetailsID = 'listingViewDetail2';


                var listingTitle = document.getElementById(listingTitleID);
                var expiryDate = document.getElementById(expiryDateID);
            
                var viewDetails = document.getElementById(viewDetailsID);
                
                listingTitle.innerHTML = doc.data().courseCode + " " + doc.data().role + "<br>" + doc.data().courseName;
                expiryDate.innerHTML = "Expiry Date: " + timeStampConverter(doc.data().expiryDate);
                viewDetails.setAttribute('onclick','window.location.href="applicantApply.html?' + doc.id + '"');

            } else if(jobListingArray[2] == doc.id) {
                var listingTitleID = 'listingTitle3';
                var expiryDateID = 'expiryDate3';
                var noOfApplicationID = 'noOfApplication3';
                var progressBarID = 'listingProgressBar3';
                var viewDetailsID = 'listingViewDetail3';


                var listingTitle = document.getElementById(listingTitleID);
                var expiryDate = document.getElementById(expiryDateID);
            
                var viewDetails = document.getElementById(viewDetailsID);
                
                listingTitle.innerHTML = doc.data().courseCode + " " + doc.data().role + "<br>" + doc.data().courseName;
                expiryDate.innerHTML = "Expiry Date: " + timeStampConverter(doc.data().expiryDate);
                viewDetails.setAttribute('onclick','window.location.href="applicantApply.html?' + doc.id + '"');
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

function classTimesConverter(inputDate) {
  var days = ['Monday', 'Tuesday','Wednesday','Thursday','Friday'];
  var fromHours = Math.floor((inputDate % 100000000) / 10000);
  var toHours = (inputDate % 10000);
  var day = days[Math.floor(inputDate / 100000000) - 1];

  
  console.log(fromHours, toHours, day);

  if (fromHours == 900) {
      if (toHours == 900) {
          return day + " " + "0" + fromHours + " - 0" + toHours;
      } else {
          return day + " " + "0" + fromHours + " - " + toHours;
      }
      
    
  } else {
      return day + " "  + fromHours + " - " + toHours;
     
  }
}

function prepareClassTimes (inputClassTimes) {
  var classTimesConverted = [];
  for (var i = 0; i <inputClassTimes.length; i ++) {
      classTimesConverted[i] = classTimesConverter(inputClassTimes[i]);
  }
  console.log(classTimesConverted);
  var sessionTimesCol = classTimesConverted.join("<br>") ;
  return sessionTimesCol;
}



function actuallyCreatingTables(userUID) {
  var arrHead = new Array();
  arrHead = ['Role', 'Course Code', 'My Availabilities','Status'];      // SIMPLY ADD OR REMOVE VALUES IN THE ARRAY FOR TABLE HEADERS.

  // FIRST CREATE A TABLE STRUCTURE BY ADDING A FEW HEADERS AND
  // ADD THE TABLE TO YOUR WEB PAGE.
  
      var empTable = document.createElement('table');
      empTable.setAttribute('id', 'empTable'); 
      empTable.setAttribute('class', 'table table-striped table-hover');
      empTable.setAttribute('style','padding-top: 100px;');           

      var tr = empTable.insertRow(-1);

      for (var h = 0; h < arrHead.length; h++) {
          var th = document.createElement('th');          // TABLE HEADER.
          th.innerHTML = arrHead[h];
          tr.appendChild(th);
      }
      
      db.collection("jobApplication").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              if(doc.data().applicant == userUID) {
                  var tr = empTable.insertRow(-1);
                  
                  var roleCol = document.createElement('td');
                  roleCol.setAttribute('style','vertical-align:middle;');

                  var courseCodeCol = document.createElement('td');
                  courseCodeCol.setAttribute('style','vertical-align:middle;');

                  var sessionTimesCol = document.createElement('td');
                  sessionTimesCol.setAttribute('style','vertical-align:middle;');

                  var statusCol = document.createElement('td');
                  statusCol.setAttribute('style','vertical-align:middle; width:45%;');
                  

                  var jobListingRef = db.collection('jobListing').doc(doc.data().jobListing);
                  var applicantRef = db.collection('applicant').doc(doc.data().applicant);

                  console.log(`${doc.id} => ${doc.data()}`);

                  jobListingRef.get().then(function(doc) {
                      if (doc.exists) {
                          console.log("jobListing data:", doc.data());
                          roleCol.innerHTML = doc.data().role;
                          courseCodeCol.innerHTML = doc.data().courseCode;
          

                      } else {
                          // doc.data() will be undefined in this case
                          console.log("No such document!");
                      }
                  }).catch(function(error) {
                      console.log("Error getting document:", error);
                  });

                  var classTimes = prepareClassTimes(doc.data().applicantAvailabilities);
                  sessionTimesCol.innerHTML = classTimes;
                  var progressBar = generateProgressBar(doc.data().status);
                  statusCol.appendChild(progressBar);
                  //statusCol.innerHTML = doc.data().status;

                  
                  tr.appendChild(roleCol);
                  tr.appendChild(courseCodeCol);
                  tr.appendChild(sessionTimesCol);
                  tr.appendChild(statusCol);
              }
          });
      }).then(function() {
        populateDict();
      });

      var div = document.getElementById('insertTableHere');
      div.appendChild(empTable);
}

function generateProgressBar(status) {
  var divUpper = document.createElement('div');
  divUpper.setAttribute('class','progress');
  var div = document.createElement('div');
  

  if (status == "Pending") {
      div.setAttribute('class','progress-bar bg-warning');
      div.setAttribute('style', 'width:20%;');
      div.innerHTML = "Pending";
  } else if (status == "Interview Pending") {
      div.setAttribute('class','progress-bar bg-warning');
      div.setAttribute('style', 'width:40%;');
      div.innerHTML = "Interview Offered";
  } else if (status == "Interview Completed - Under Review") {
      div.setAttribute('class','progress-bar bg-warning');
      div.setAttribute('style', 'width:60%;');
      div.innerHTML = "Under Review";
  } else if (status == "Accepted - Allocate Class") {
      div.setAttribute('class','progress-bar bg-warning');
      div.setAttribute('style', 'width:80%;');
      div.innerHTML = "Allocating Classes";
  } else if (status == "Accepted") {
      div.setAttribute('class','progress-bar bg-success');
      div.setAttribute('style', 'width:100%;');
      div.innerHTML = "Accepted";
  } else {
      div.setAttribute('class','progress-bar bg-danger');
      div.setAttribute('style', 'width:100%;');
      div.innerHTML = "Rejected";
  }

  divUpper.appendChild(div);
  return divUpper;
}
