var db = firebase.firestore();
function onLoad() {
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    console.log("Document ID ", queryString);

    var applicantName = document.getElementById("applicantName");
    var applicationName = document.getElementById('applicationName');
    var applicantExperience = document.getElementById('applicantExperience');
    var applicantSkills = document.getElementById('applicantSkills');
    var applicantAvailabilties = document.getElementById('applicantAvailabilities');

    var docRef = db.collection("jobApplication").doc(queryString);
    

    docRef.get().then(function(doc) {
        if (doc.exists) {
            var jobListingRef = db.collection("jobListing").doc(doc.data().jobListing);
            var applicantRef = db.collection("applicant").doc(doc.data().applicant);
            applicantAvailabilties.value = prepareClassTimes(doc.data().applicantAvailabilities);
            applicantRef.get().then(function(doc) {
                if (doc.exists) {
                    applicantName.innerHTML = doc.data().name;
                    applicantExperience.value = doc.data().experience;
                    applicantSkills.value = doc.data().skills;
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
                    
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
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

function prepareClassTimes (inputClassTimes) {
    var classTimesConverted = [];
    for (var i = 0; i <inputClassTimes.length; i ++) {
        classTimesConverted[i] = classTimesConverter(inputClassTimes[i]);
    }
    console.log(classTimesConverted);
    var sessionTimesCol = classTimesConverted.join("\n");
    return sessionTimesCol;
}