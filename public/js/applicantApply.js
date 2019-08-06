var db = firebase.firestore();
var applicationTitle = document.getElementById('applicationTitle');
var courseDescription = document.getElementById('courseDescription');
var responsibilities = document.getElementById('responsibilities');
var experienceRequirement = document.getElementById('experienceRequirement');
var skillsRequirement = document.getElementById('skillsRequirement');
var marksRequirement = document.getElementById('marksRequirement');
var applicantName = document.getElementById('applicantName');
var applicantEmail = document.getElementById('applicantEmail');
var applicantExperience = document.getElementById('applicantExperience');
var applicantSkills = document.getElementById('applicantSkills');
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var jobListingRef = db.collection('jobListing').doc(queryString);
var classTimes = [];
var insertCheckBoxHere = document.getElementById('insertCheckBoxHere');

var applicantID;
var appName;
var lecturerID;
var appliedJobs = [];


function onLoad() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
            dataPopulationManager(user.uid);
        } else {
            window.alert('No user signed in');
            window.location.assign('applicantSignin.html');
        }
    });
}

function dataPopulationManager(userUID) {
    applicantID = userUID;
    jobListingRef.get().then(function(doc) {
        if (doc.exists) {
            applicationTitle.innerHTML = doc.data().courseCode + " " + doc.data().role + " Application Form";
            courseDescription.innerHTML = doc.data().courseDescription;
            responsibilities.innerHTML = doc.data().responsibilities;
            experienceRequirement.innerHTML = doc.data().experienceRequirement;
            skillsRequirement.innerHTML = doc.data().skillsRequirement;
            marksRequirement.innerHTML = doc.data().marksRequirement;
            classTimes = doc.data().classTimes;
            lecturerID = doc.data().lecturer;
            
            console.log("YAS");
        } else {
            // doc.data() will be undefined in this case
            
            console.log("No such document!");
        }
    }).then(function() {
        createCheckBox();
        //console.log(applicantID);
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    db.collection('applicant').doc(userUID).get().then(function(doc) {
        if (doc.exists) {
            appName = doc.data().name;
            applicantName.value = doc.data().name;
            applicantEmail.value = doc.data().email;
            appliedJobs = appliedJobs;
            console.log("YAS");
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });


}

function createCheckBox () {
    classTimes.sort();
    for (var i = 0; i < classTimes.length; i ++) {
        console.log("Class Times length is ", classTimes.length);
        var div = document.createElement('div');
        div.setAttribute('class', 'form-check');
        div.setAttribute('style', 'height:37px;');

        var input = document.createElement('input');
        input.setAttribute('class','form-check-input checks');
        input.setAttribute('type','checkbox');
        input.setAttribute('id', classTimes[i]);
        input.value = classTimes[i];

        var label = document.createElement('label');
        label.setAttribute('class','form-check-label');
        label.setAttribute('for',classTimes[i]);
        label.innerHTML = "Class " + (i + 1) + ": " + classTimesConverter(classTimes[i]);

        div.appendChild(input);
        div.appendChild(label);
        insertCheckBoxHere.appendChild(div);
    }
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

function onSubmit() {
    var applicantAvailabilities =[];
    appliedJobs.push(queryString);
    
    var checks = document.getElementsByClassName('checks');
    for (var i = 0; i < classTimes.length; i ++) {
        if (checks[i].checked === true) {
            applicantAvailabilities.push(checks[i].value);
        }
    }
    

    db.collection("jobApplication").doc().set({
        applicant:applicantID,
        applicantAvailabilities:applicantAvailabilities,
        applicantName:appName,
        jobListing:queryString,
        lecturer:lecturerID,
        status:'Pending'
    }).then(function() {
        console.log("Document successfully written!");
        //window.location.assign('applicantJobListings.html');
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
    });

    db.collection('applicant').doc(applicantID).set({
        appliedJobs:appliedJobs
    }, { merge: true }).then(function() {
        window.location.assign('applicantJobListings.html');
    });

}