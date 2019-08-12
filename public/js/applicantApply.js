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

var coverLetterName = document.getElementById('coverLetterName');
var transcriptName = document.getElementById('transcriptName');
var coverLetterUpload = document.getElementById('uploadCoverLetter');
var transcriptUpload = document.getElementById('uploadTranscript');

var inputTranscript = document.getElementById('inputTranscript');
var inputCoverLetter = document.getElementById('inputCoverLetter');

var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var jobListingRef = db.collection('jobListing').doc(queryString);
var classTimes = [];
var insertCheckBoxHere = document.getElementById('insertCheckBoxHere');

var applicantID;
var applicantCourseCode;
var applicantRole;
var applicantEmailThis;
var appName;
var lecturerID;
var appliedJobs = [];
var lecturerNameThis;


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
            applicantCourseCode = doc.data().courseCode;
            applicantRole = doc.data().role;
            lecturerNameThis = doc.data().lecturerName;
            
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
            appliedJobs = doc.data().appliedJobs;
            applicantEmailThis = doc.data().email;
            console.log("YAS");
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
                // Create a reference to the file we want to download
            var transcriptRef = firebase.storage().ref(userUID + '/transcript.pdf');
            

            // Get the download URL
            transcriptRef.getDownloadURL().then(function(url) {
                transcriptName.innerHTML = 'Transcript.pdf';
                transcriptName.setAttribute('href',url);
                transcriptName.setAttribute('target','_blank');
            }).catch(function(error) {
                switch (error.code) {
                    case 'storage/object-not-found':
                    transcriptName.innerHTML = "No files uploaded";
                    break;
                }
            });


            var cvRef = firebase.storage().ref(userUID + '/coverLetter.pdf');
            

            // Get the download URL
            cvRef.getDownloadURL().then(function(url) {
                coverLetterName.innerHTML = 'Cover Letter.pdf';
                coverLetterName.setAttribute('href',url);
                coverLetterName.setAttribute('target','_blank');
            }).catch(function(error) {
                switch (error.code) {
                    case 'storage/object-not-found':
                    coverLetterName.innerHTML = "No files uploaded";
                    break;
                }
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
    console.log(appliedJobs);
    
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
        status:'Pending',
        courseCode: applicantCourseCode,
        role: applicantRole,
        applicantEmail:applicantEmailThis,
        lecturerName:lecturerNameThis
    }).then(function() {
            console.log("Document successfully written!");
            //window.location.assign('applicantJobListings.html');

            if(inputCoverLetter.files[0] != null) {
            
                var coverLetterStorageRef = firebase.storage().ref(applicantID + "/coverLetter.pdf");
                coverLetterStorageRef.put(inputCoverLetter.files[0]);
            }
        
            if (inputTranscript.files[0] != null) {
                var transcriptStorageRef = firebase.storage().ref(applicantID + "/transcript.pdf");
                transcriptStorageRef.put(inputTranscript.files[0]);
            }

            db.collection('applicant').doc(applicantID).set({
                appliedJobs:appliedJobs,
                skills: applicantSkills.value,
                experience: applicantExperience.value
            }, { merge: true }).then(function() {
                window.location.assign('applicantJobListings.html');
            });
      }).catch(function(error) {
        console.error("Error writing document: ", error);
    });    
    
}

function uploadCoverLetter() {
    var cvDiv = document.getElementById('coverLetterDiv');
    var uploadCVDiv = document.getElementById('uploadCoverLetterDiv');

    cvDiv.hidden = true;
    uploadCVDiv.hidden = false;
}

function uploadTranscript() {
    var transcriptDiv = document.getElementById('transcriptDiv');
    var uploadTranscriptDiv = document.getElementById('uploadTranscriptDiv');

    transcriptDiv.hidden = true;
    uploadTranscriptDiv.hidden = false;
}