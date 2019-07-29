var db = firebase.firestore();


function onLoad() {
    var arrayHeading = ['Applicant', 'Interview Time', 'Interview Location', '',''];
    var table = document.createElement('table');
    table.setAttribute('id', 'empTable'); 
    table.setAttribute('class', 'table table-striped table-hover');

    var rowHeading = table.insertRow(-1);
    
    for (var h = 0; h < arrayHeading.length; h ++) {
        var th = document.createElement('th');
        th.innerHTML = arrayHeading[h];
        rowHeading.appendChild(th);
    }

    db.collection("jobApplication").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
                if (doc.data().status == "Interview Pending") {
                    var jobAppID = doc.id;
                    var tr = empTable.insertRow(-1);
                    var applicantCol = document.createElement('td');
                    var interviewTimeCol = document.createElement('td');
                    var interviewLocationCol = document.createElement('td');
                    var makeDecisionButtonCol = document.createElement('td');
                    var saveButtonCol = document.createElement('td');

                    if(doc.data().interviewTime == 0) {
                        createDropDown(doc.id,interviewTimeCol);
                    } else {
                        createDropDown(doc.id,interviewTimeCol);
                    }

                    if (doc.data().interviewLocation == "") {
                        createTextField(doc.id, interviewLocationCol, false);
                    } else {
                        createTextField(doc.id, interviewLocationCol, true);
                    }

                    createMakeDecisionButton(doc.id, makeDecisionButtonCol);
                    createSaveButton(doc.id, saveButtonCol);
                   

                    var lecturerRef = db.collection('jobListing').doc(doc.data().lecturer);
                    var applicantRef = db.collection('applicant').doc(doc.data().applicant);
                    
                    console.log(`${doc.id} => ${doc.data()}`);
                    
                
                    applicantRef.get().then(function(doc) {
                        if (doc.exists) {
                            console.log("applicant data:", doc.data());
                            var a = document.createElement('a');
                            a.innerHTML = doc.data().name;
                            a.setAttribute('href', "applicationDetailed.html?" +jobAppID);
                            applicantCol.appendChild(a);
                                        
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    }).catch(function(error) {
                        console.log("Error getting document:", error);
                    });

                    tr.appendChild(applicantCol);
                    tr.appendChild(interviewTimeCol);
                    tr.appendChild(interviewLocationCol);
                    tr.appendChild(makeDecisionButtonCol);
                    tr.appendChild(saveButtonCol);
                }

        });
    });
        var div = document.getElementById('insertTableHere');
        div.appendChild(table);
}

function createDropDown(jobAppID,div) {
    console.log(jobAppID);
    var select = document.createElement('select');
    select.setAttribute('id', jobAppID + "Time");
    var theJobAppRef = db.collection("jobApplication").doc(jobAppID);

    theJobAppRef.get().then(function(doc) {
        if (doc.exists) {
            var interviewTime = doc.data().interviewTime;

            var lecturerRef = db.collection('lecturer').doc(doc.data().lecturer);
            lecturerRef.get().then(function(doc) {
                if (doc.exists) {
                
                    //console.log("HELLLLOOOO" + doc.data().myAvailabilities);
                    for (var i = 0; i < doc.data().myAvailabilities.length; i ++) {
                        var option = document.createElement('option');
                        option.value = doc.data().myAvailabilities[i];
                        option.innerHTML = interviewTimesConverter(doc.data().myAvailabilities[i]," ");
                        if (interviewTime == doc.data().myAvailabilities[i]) {
                            option.selected = true;
                        }
                        select.appendChild(option);
                        //console.log("HELLLLOOOO" + doc.data().myAvailabilities);
                    }     
                    
                    
                    
                    
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).then(function() {
                if (interviewTime == 0) {
                    var option = document.createElement('option');
                    option.selected = true;
                    option.disabled = true;
                    option.value = 0;
                    option.innerHTML = "Interview Time";
                    select.appendChild(option);
                       
                }
                div.appendChild(select);  
                
                
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });         
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).then(function() {
        
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function createTextField(jobAppID, div, check) {

    var theJobAppRef = db.collection("jobApplication").doc(jobAppID);
    var field = document.createElement('input');
    field.setAttribute('id', jobAppID + 'Location');
    field.type = 'text';
    field.required = true;
    
    
    if (check) {
        theJobAppRef.get().then(function(doc) {
            if (doc.exists) {

                field.value = doc.data().interviewLocation;
                    
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).then(function() {
            div.appendChild(field);
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    } else {
        field.placeholder = 'Interview Location';
        div.appendChild(field);
    }

    
    // console.log(div, field);
    
    
}



function createMakeDecisionButton(jobAppID, div) {
    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class','btn btn-primary');
    button.setAttribute('onclick', 'makeDecision("' + jobAppID + '")');
    button.innerHTML = "Make Decision";
    div.appendChild(button);
}

function createSaveButton(jobAppID, div) {
    var button = document.createElement('button');
    button.setAttribute('type','button');
    button.setAttribute('class','btn btn-secondary');
    button.setAttribute('onclick','saveInterviewTimeLoc("' + jobAppID +'")');
    button.innerHTML = "Save";
    div.appendChild(button);
}

function saveInterviewTimeLoc(jobAppID) {
    var timeID = jobAppID + "Time"
    var locID = jobAppID + "Location";

    var timeValue = document.getElementById(timeID).value;
    var locationValue = document.getElementById(locID).value;

    db.collection("jobApplication").doc(jobAppID).update({
        interviewTime:timeValue,
        interviewLocation:locationValue
    }).catch(function(error) {
        console.error("Error updating document: ", error);
    }).finally(function() {
        window.location.reload();
    });

}

function makeDecision(jobAppID) {
    var theLink = "applicationDetailed.html?" + jobAppID; 
    
    db.collection("jobApplication").doc(jobAppID).update({
        status: 'Interview Completed - Under Review'
    }).catch(function(error) {
        console.error("Error updating document: ", error);
    }).finally(function() {
        window.location.assign(theLink);
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
