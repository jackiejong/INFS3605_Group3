var db = firebase.firestore();
var jobListingRole = {};
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
      if (doc.data().lecturer == userUID) {
          jobListingRole[doc.id] = doc.data().courseCode + " " + doc.data().role;
          console.log(`${doc.id} => ${doc.data()}`);
      }
    });
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

              var applicantAndRole = document.getElementById(applicantAndRoleID);
              var applicantStatus = document.getElementById(applicantStatusID);
              var applicantProgressBar = document.getElementById(applicantProgressBarID);


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
              counter ++;
          }
      });
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

function navBarClick(something) {
  console.log(something);
  window.location.assign(something);
}

