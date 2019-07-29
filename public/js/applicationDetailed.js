var db = firebase.firestore();
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
console.log("Document ID ", queryString);
var docRef = db.collection("jobApplication").doc(queryString);
var email = "mailto:";
var subject = "?subject=Interview%20for%20";
var body = "&body=Hi%20";
var LiC = "";


function onLoad() {
    
    var applicantName = document.getElementById("applicantName");
    var applicationName = document.getElementById('applicationName');
    var applicantExperience = document.getElementById('applicantExperience');
    var applicantSkills = document.getElementById('applicantSkills');
    var applicantAvailabilties = document.getElementById('applicantAvailabilities');
    var applicantStatus = document.getElementById('applicantStatus');
    var buttonsDiv = document.getElementById("buttons");

    docRef.get().then(function(doc) {
        if (doc.exists) {
            var jobListingRef = db.collection("jobListing").doc(doc.data().jobListing);
            var applicantRef = db.collection("applicant").doc(doc.data().applicant);
            var lecturerRef = db.collection("lecturer").doc(doc.data().lecturer);
            
            
            applicantAvailabilties.innerHTML = prepareClassTimes(doc.data().applicantAvailabilities,"<br>");
            applicantStatus.innerHTML = "Status: " + doc.data().status;

            createButtons(doc.data().status, buttonsDiv);
          
            applicantRef.get().then(function(doc) {
                if (doc.exists) {
                    applicantName.innerHTML = doc.data().name;
                    applicantExperience.value = doc.data().experience;
                    applicantSkills.value = doc.data().skills;

                    email += doc.data().email;
                    subject = "mailto:" + doc.data().email + subject;
                    var name = doc.data().name.split(' ');
                    body += name[0];
                    body += ',%0A%0ACongratulations!%20You%20have%20been%20offered%20an%20interview%20for%20';
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });


            jobListingRef.get().then(function(doc) {
                if (doc.exists) {
                    applicationName.innerHTML = doc.data().role + " for " + doc.data().courseCode;
                    subject += doc.data().courseCode;
                    subject += "%20";
                    subject += doc.data().role + "%20role";
                    

                    body += doc.data().courseCode;
                    body += "%20";
                    body += doc.data().role;
                    body += "%20role,%20which%20you%20applied%20for%20via%20TOM.%20Below%20are%20the%20times%20I%20will%20be%20available%20for%20an%20interview,%20please%20reply%20back%20with%20your%20preferred%20interview%20slot.%0A%0A";
                    ctrl = true;
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });

            
            lecturerRef.get().then(function(doc) {
                console.log("LIMA");
                if (doc.exists) {
                    body += prepareInterviewTimes(doc.data().myAvailabilities,"%0A");
                    body += "%0A%0AWarm%20regards,%0A%0A";
                    body += doc.data().name;

                    LiC += doc.id;
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
                ctrl = false;
            });
            
            
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function classTimesConverter(inputDate) {
    var days = ['Monday', 'Tuesday','Wednesday','Thursday','Friday'];
    var fromHours = Math.floor((inputDate % 100000000) / 10000);
    var toHours = (inputDate % 10000);
    var day = days[Math.floor(inputDate / 100000000) - 1];

    
    console.log(fromHours, toHours, day);

    if (fromHours == 900) {
        return day + " " + "0" + fromHours + " - " + toHours;
      
    } else {
        return day + " "  + fromHours + " - " + toHours;
       
    }
}

function prepareClassTimes (inputClassTimes, joiner) {
    var classTimesConverted = [];
    for (var i = 0; i <inputClassTimes.length; i ++) {
        classTimesConverted[i] = classTimesConverter(inputClassTimes[i]);
    }
    console.log(classTimesConverted);
    classTimesConverted.sort();
    var sessionTimesCol = classTimesConverted.join(joiner);
    return sessionTimesCol;
}

async function createButtons (status, div) {
    if (status == 'Pending' || status == 'pending') {
        var acceptOffer = document.createElement('button');
        acceptOffer.setAttribute('class','btn btn-primary bg-success border-success');
        acceptOffer.setAttribute('type','button');
        acceptOffer.innerHTML = 'Offer Interview';
        acceptOffer.setAttribute('onclick', 'offerInterview()');

        var reject = document.createElement('button');
        reject.setAttribute('class','btn btn-primary bg-danger border-danger');
        reject.setAttribute('type', 'button');
        reject.innerHTML = 'Reject';
        reject.setAttribute('onclick', 'reject()');
        
        div.appendChild(acceptOffer);
        div.appendChild(reject);
    } else if (status == 'Interview Pending') {
        var mailMyInterviewAvailabilities = document.createElement('button');
        mailMyInterviewAvailabilities.setAttribute('class', 'btn btn-primary border rounded');
        mailMyInterviewAvailabilities.setAttribute('type','button');
        mailMyInterviewAvailabilities.innerHTML = 'Mail My Availabilities';
        mailMyInterviewAvailabilities.setAttribute('onclick', 'sendEmail()');


        var br = document.createElement('br');

        var goToMyInterviews = document.createElement('button');
        goToMyInterviews.setAttribute('class', 'btn btn-primary border rounded');
        goToMyInterviews.setAttribute('type','button');
        goToMyInterviews.setAttribute('onclick','window.location.href="myInterviews.html"');
        goToMyInterviews.innerHTML = "myInterviews";

        div.appendChild(mailMyInterviewAvailabilities);
        div.appendChild(br);
        div.appendChild(goToMyInterviews);
    } else if (status == 'Interview Completed - Under Review') {
        var accept = document.createElement('button');
        accept.setAttribute('class','btn btn-primary bg-success border-success');
        accept.setAttribute('type','button');
        accept.innerHTML = 'Accept';
        accept.setAttribute('onclick', 'accept()');

        var reject = document.createElement('button');
        reject.setAttribute('class','btn btn-primary bg-danger border-danger');
        reject.setAttribute('type', 'button');
        reject.innerHTML = 'Reject';
        reject.setAttribute('onclick', 'reject()');
        
        div.appendChild(accept);
        div.appendChild(reject);
    } else if (status == "Accepted - Allocate Class") {
        var allocateClass = document.createElement('button');
        allocateClass.setAttribute('class', 'btn btn-secondary');
        allocateClass.setAttribute('type', 'button');
        allocateClass.setAttribute('onclick','allocateClass()');
        allocateClass.innerHTML = "Allocate Class";

        var mailApplicant = document.createElement('button');
        mailApplicant.setAttribute('class', 'btn btn-secondary');
        mailApplicant.setAttribute('type','button');
        mailApplicant.setAttribute('onclick', 'mailApplicant()');
        mailApplicant.innerHTML = "Mail";

        var br = document.createElement('br');
        div.appendChild(allocateClass);
        div.appendChild(br);
        div.appendChild(mailApplicant);


    }
}

function mailApplicant() {
    window.location.href = email;
}

function sendEmail() {
    console.log("ENAM");
    console.log(subject + body);
    window.location.href = subject + body;
}

function accept() {
    docRef.update({
        status: 'Accepted - Allocate Class'
    }).then(function() {
        window.location.reload();
    }).catch(function(error) {
        console.error("Error updating document: ", error);
    });
}


function allocateClass() {
    window.location.assign('classAllocations.html');
}



function offerInterview() {
    
    docRef.update({
        status: 'Interview Pending'
    }).catch(function(error) {
        console.error("Error updating document: ", error);
    });

    var setWithMerge = docRef.set({
        interviewTime:0,
        interviewLocation:''
    }, { merge: true }).then(function() {
        window.location.reload();
    });

    console.log(setWithMerge);                        
    
}

function reject() {
    docRef.update({
        status: 'Rejected'
    }).catch(function(error) {
        console.error("Error updating document: ", error);
    }).finally(function() {
        window.location.assign('allApplications.html');
    });
}


function interviewTimesConverter (inputInterviewTimes, joiner) {
    var days = ['Monday', 'Tuesday','Wednesday','Thursday','Friday'];
    var day = days[Math.floor(inputInterviewTimes / 10000) - 1];
    var hour = inputInterviewTimes % 10000;
    
    console.log(day, hour);

    if (hour == 900) {
        return day + joiner + "0" + hour;
      
    } else {
        return day + joiner  + hour;
    }

    
}

function prepareInterviewTimes (inputInterviewTimes, joiner) {
    var interviewTimesConverted = [];
    for (var i = 0; i <inputInterviewTimes.length; i ++) {
        interviewTimesConverted[i] = interviewTimesConverter(inputInterviewTimes[i], "%20");
    }
    console.log(interviewTimesConverted);
    var sessionTimesCol = interviewTimesConverted.join(joiner);
    return sessionTimesCol;
}