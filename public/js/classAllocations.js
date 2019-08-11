var db = firebase.firestore();

var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
console.log("Document ID ", queryString);
console.log(typeof queryString);


var divDropdown = document.getElementById('insertDropdownHere');
var divButtonDropdown = document.getElementById('insertButtonDropdownHere');
var divTable = document.getElementById('insertTableHere');
var dictionary = {};
var dictionary2 = {};
var classAllocationDict = {};
var courseCodeArr = [];
var divButtons = document.createElement('div');
divButtons.setAttribute('class','text-center');

function onLoad() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
            actuallyCreatingShit(user.uid);
        } else {
            window.alert('No user signed in');
            window.location.assign('index.html');
        }
    });
}

function createDict () {
    var i = 1;
    db.collection('jobApplication').get().then((querySnapshot)=> {
        querySnapshot.forEach((doc) => {  
            //console.log("-------------------Accepted No " + i + "----------------------");

            if (doc.data().status == "Accepted - Allocate Class") {
                for (var h = 0; h < doc.data().applicantAvailabilities.length; h ++) {              
                    var keyDict = doc.id + "?" + doc.data().jobListing + "?" + doc.data().applicantAvailabilities[h] ;
                    var valueDict = doc.data().applicantName;
                    dictionary[keyDict] = valueDict;
                    dictionary2[keyDict] = doc.data().role +"?" + doc.data().courseCode + "?" + doc.data().lecturerName + "?" + doc.data().applicantEmail;                    
                }  
            }  
            i ++;
        });

    }).catch(function(error) {
        console.log(error);
    });
}

function createClassAllocationDict () {
    
    db.collection('classAllocation').get().then((querySnapshot)=> {
        querySnapshot.forEach((doc) => {  
            
            classAllocationDict[doc.id] = doc.data().applicantName;
        });

    }).catch(function(error) {
        console.log(error);
    });
}

function appendOptionsToSelect (jobListingID, selectTag, classTime) {
    var ada = false;
    var magneto = 0;
    var optioned = false;
    
    for (var key in dictionary) {
        var keySplits = key.split('?');
        console.log(keySplits[1] + " == " + keySplits[2], " == ", dictionary[key] );
        if (keySplits[1] == jobListingID && classTime == keySplits[2]) {
            var anotherID = keySplits[1] + "?" + keySplits[2];
            magneto = key;
            var option = document.createElement('option');
            option.value = key;
            for (something in classAllocationDict) {
                if (classAllocationDict[something] == dictionary[key] && anotherID == something) {
                    option.selected = true;
                    optioned = true;
                }
            }

            option.innerHTML = dictionary[key];
            selectTag.appendChild(option);
        }
    }

    selectTag.setAttribute('id',jobListingID+"?"+classTime);
    
    if (magneto == 0) {
        var option = document.createElement('option');
        option.value = 0;
        option.innerHTML = "No Candidate";
        option.selected = true;
        option.disabled = true;
        selectTag.appendChild(option);
    } else {
        if (optioned == false) {
            var option = document.createElement('option');
            option.value = 0;
            option.innerHTML = "Select Candidate";
            option.selected = true;
            option.disabled = true;
            selectTag.appendChild(option);
        }
    }

    return magneto;
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

function submitFilter() {
    var selectValue = document.getElementById('courseFilter').value;
    var theLink = 'classAllocations.html?' + selectValue;
    window.location.assign(theLink);
}

function actuallyCreatingShit(userUID) {

    // Select
    createDict();
    createClassAllocationDict();
    var select = document.createElement('select');
    select.setAttribute('id', 'courseFilter');
    select.setAttribute('class', 'form-control');
    var option = document.createElement('option');
    option.value = 0;
    option.selected = true;
    option.disabled = true;
    option.innerHTML = "Filter By Job Listing"
    select.appendChild(option);

    var submitFilterButton = document.createElement('button');
    submitFilterButton.innerHTML = "Go";
    submitFilterButton.setAttribute('class', 'btn btn-secondary');
    submitFilterButton.setAttribute('onclick','submitFilter()');


    
    
    // Table
    var arrayHeading = ['Course Code','Role','Class Times', 'Tutor',''];
    var table = document.createElement('table');
    table.setAttribute('id', 'empTable'); 
    table.setAttribute('class', 'table table-striped table-hover');
    table.setAttribute('style','margin:auto;')
    

    var rowHeading = table.insertRow(-1);

    

    
    for (var h = 0; h < arrayHeading.length; h ++) {
        var th = document.createElement('th');
        th.innerHTML = arrayHeading[h];
        rowHeading.appendChild(th);
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.  
            var user = firebase.auth().currentUser;
            db.collection("jobListing").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().lecturer == userUID) {

                        if (!courseCodeArr.includes(doc.data().courseCode))  {

                            var divSingleButton = document.createElement('div');
                            divSingleButton.setAttribute('style','padding:20px;');

                            var button = document.createElement('button');
                            button.setAttribute('class','btn btn-primary');

                            var theLink = 'classAllocations.html?' + doc.id;
                            button.setAttribute('onclick','submitInitialCourseSelection("' + theLink + '")');
                            button.innerHTML = doc.data().courseCode + " " + doc.data().role;
                            divSingleButton.appendChild(button);
                            divButtons.appendChild(divSingleButton);

                            var option = document.createElement('option');
                            option.value = doc.id;
                            option.innerHTML = doc.data().courseCode + " " + doc.data().role;
                            select.appendChild(option);
                            courseCodeArr.push(doc.data().courseCode);
                            console.log("ARRAY COURSE CODE ", courseCodeArr);
                        }
                            
                            if (queryString == "" || queryString == "0") {
                                for (var i = 0; i < doc.data().classTimes.length; i ++) {
                                    console.log("========================EACH ROW====================");
                                    console.log("STEP ", i);
                                    var tr = table.insertRow(-1);   
                                    var selectTutor = document.createElement('select');
                                    selectTutor.setAttribute('class','form-control');
                                
                                    var courseCodeCol = document.createElement('td');
                                    courseCodeCol.setAttribute('style','vertical-align:middle;');
                                    var roleCol = document.createElement('td');
                                    roleCol.setAttribute('style','vertical-align:middle;');
                                    var classTimeCol = document.createElement('td');
                                    classTimeCol.setAttribute('style','vertical-align:middle;');
                                    var tutorAllocationCol = document.createElement('td');
                                    tutorAllocationCol.setAttribute('style','vertical-align:middle;');
                                    var saveButtonCol = document.createElement('td');
                                    saveButtonCol.setAttribute('style','vertical-align:middle;');
                                    
                                    courseCodeCol.innerHTML = doc.data().courseCode;
                                    roleCol.innerHTML = doc.data().role;
                                    classTimeCol.innerHTML = classTimesConverter(doc.data().classTimes[i]);
                            
                                    var magneto = appendOptionsToSelect(doc.id,selectTutor,doc.data().classTimes[i]);
                                    tutorAllocationCol.appendChild(selectTutor);

                                    tr.appendChild(courseCodeCol);
                                    tr.appendChild(roleCol);
                                    tr.appendChild(classTimeCol);
                                    tr.appendChild(tutorAllocationCol);
                                    
                                    if (magneto != 0) {
                                        var saveSingleButton = document.createElement('button');
                                        saveSingleButton.setAttribute('class','btn btn-secondary');
                                        saveSingleButton.innerHTML = "Save";
                                        saveSingleButton.setAttribute('onclick',"saveSingleButton('" + magneto + "')");
                                        saveButtonCol.appendChild(saveSingleButton);
                                        
                                    }

                                    tr.appendChild(saveButtonCol);
                                }
                            } else {
                                for (var i = 0; i < doc.data().classTimes.length; i ++) {
                                    if(doc.id == queryString) {
                                        console.log("========================EACH ROW====================");
                                        console.log("STEP ", i);
                                        var tr = table.insertRow(-1);   
                                        var selectTutor = document.createElement('select');
                                        selectTutor.setAttribute('class','form-control');

                                        var courseCodeCol = document.createElement('td');
                                        courseCodeCol.setAttribute('style','vertical-align:middle;');
                                        var roleCol = document.createElement('td');
                                        roleCol.setAttribute('style','vertical-align:middle;');
                                        var classTimeCol = document.createElement('td');
                                        classTimeCol.setAttribute('style','vertical-align:middle;');
                                        var tutorAllocationCol = document.createElement('td');
                                        tutorAllocationCol.setAttribute('style','vertical-align:middle;');
                                        var saveButtonCol = document.createElement('td');
                                        saveButtonCol.setAttribute('style','vertical-align:middle;');

                                        courseCodeCol.innerHTML = doc.data().courseCode;
                                        roleCol.innerHTML = doc.data().role;
                                        classTimeCol.innerHTML = classTimesConverter(doc.data().classTimes[i]);
                                
                                        var magneto = appendOptionsToSelect(doc.id,selectTutor,doc.data().classTimes[i]);
                                        tutorAllocationCol.appendChild(selectTutor);

                                        tr.appendChild(courseCodeCol);
                                        tr.appendChild(roleCol);
                                        tr.appendChild(classTimeCol);
                                        tr.appendChild(tutorAllocationCol);

                                        if (magneto != 0) {
                                            var saveSingleButton = document.createElement('button');
                                            saveSingleButton.setAttribute('class','btn btn-secondary');
                                            saveSingleButton.innerHTML = "Save";
                                            saveSingleButton.setAttribute('onclick',"saveSingleButton('" + magneto + "')");
                                            saveButtonCol.appendChild(saveSingleButton);
                                        }
    
                                        tr.appendChild(saveButtonCol);
                                    }
                                }
                            }
                    }
             
                });
            }).catch(function(error) {
                console.log(error);
            }).finally(function() {
                var h3 = document.getElementById('classAllocationsTitle');
                if (queryString == "" || queryString == "0") {
                    console.log("Last Step");

                    //divDropdown.appendChild(select);
                    //divButtonDropdown.appendChild(submitFilterButton);
                    h3.innerHTML = "Please Select a Job Listing";
                    divTable.appendChild(divButtons);
                    
                    console.log(dictionary);
                    console.log(classAllocationDict);
                } else {
                    console.log("Last Step");
                    divDropdown.appendChild(select);
                    divButtonDropdown.appendChild(submitFilterButton);
                    divTable.appendChild(table);
                    h3.innerHTML = "Class Allocations";
                    createMailButton(divTable);
                    console.log(dictionary);
                    console.log(classAllocationDict);
                }
            });  
        
          } else {
            console.log("no user signed in");
          }
    });
}

function createMailButton(div) {
    var buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('class','text-center');
    buttonDiv.setAttribute('style','padding:20px;');

    var button = document.createElement('button');
    button.setAttribute('class','btn btn-secondary');
    button.setAttribute('onclick','prepareEmail()');

    button.innerHTML = "Mail Applicants";

    var spinnerDiv = document.createElement('div');
    spinnerDiv.setAttribute('class','spinner-border text-center');
    spinnerDiv.setAttribute('role','status');
    spinnerDiv.id = "spinnerLoading";

    var span = document.createElement('span');
    span.setAttribute('class','sr-only');
    span.innerHTML = "Loading...";

    spinnerDiv.appendChild(span);
    spinnerDiv.hidden = true;
    buttonDiv.appendChild(button);

    div.appendChild(buttonDiv);
    div.appendChild(spinnerDiv);
}

function prepareEmail() {
    var spinner = document.getElementById('spinnerLoading');
    spinner.hidden = false;
    var arrayOfEmails = [];
    var roleEmail;
    var courseCodeEmail;
    var classAllocationEmail = [];
    var lecturerNameEmail;
    var counter = 0;

    db.collection("classAllocation").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var theID = doc.id;
            var IDSplits = theID.split('?');
            if (IDSplits[0] == queryString) {
                counter ++;
                arrayOfEmails.push(doc.data().applicantEmail);
                roleEmail = doc.data().role;
                courseCodeEmail = doc.data().courseCode;
                classAllocationEmail.push(doc.data().applicantName + " | " + doc.data().applicantEmail + " | " +classTimesConverter(doc.data().classTime));
                lecturerNameEmail = doc.data().lecturerName;
            }
        });
    }).then(function() {
        var bcc = "mailto:?bcc=" + arrayOfEmails.join(',');
        var body = "&body=Hi%20Applicants,%0D%0A%0D%0AYou%20have%20been%20allocated%20to%20tutor/lead/teach%20the%20following%20classes%20in%20the%20upcoming%20teaching%20period%20for%20" + 
                    roleEmail + "%20for%20" + courseCodeEmail +
                    ".%20Below%20you%20will%20find%20details%20on%20which%20class%20you%20have%20been%20allocated%20to.%0D%0A%0D%0A%0D%0A" + 
                    classAllocationEmail.join('%0D%0A') + 
                    "%0D%0A%0D%0A%0D%0APlease%20complete%20the%20following%20as%20soon%20as%20possible:%0D%0A%0D%0A-%20Reply%20back%20to%20this%20email%20to%20confirm%20you%20have%20seen%20your%20allocation%0D%0A%0D%0A" + 
                    "-%20Let%20me%20know%20ASAP%20if%20this%20allocation%20will%20not%20work%20for%20you%20and%20why%0D%0A%0D%0A-%20Keep%20on%20the%20lookout%20for%20future%20emails%20regarding%20onboarding,%20training," +
                    "%20etc%0D%0A%0D%0A%0D%0ACongratulations%20and%20I%20look%20forward%20to%20working%20with%20you.%0D%0A%0D%0A%0D%0A" + 
                    lecturerNameEmail;
        if (counter != 0) {
            window.location.assign(bcc + body);
        } else {
            window.alert('No tutor is allocated to any class!');
        }
        setTimeout(function(){
            window.location.reload();
        }, 500);
    });
}

function saveSingleButton(theValue) {
    var theValueSplits = theValue.split('?');
    var theSelectID =  theValueSplits[1] + "?" + theValueSplits[2];
    var theSelect = document.getElementById(theSelectID);

    var resultDict = dictionary2[theSelect.value];
    var resultDictSplits = resultDict.split('?');
    var newRole = resultDictSplits[0];
    var newCourseCode = resultDictSplits[1];
    var newLecturerName = resultDictSplits[2];
    var newApplicantEmail = resultDictSplits[3];


    db.collection("classAllocation").doc(theSelectID).set({
        jobApplication: theValueSplits[0],
        jobListing: theValueSplits[1],
        classTime: theValueSplits[2],
        applicantName: dictionary[theSelect.value],
        role: newRole,
        courseCode: newCourseCode,
        lecturerName:newLecturerName,
        applicantEmail:newApplicantEmail
      }).then(function() {
        console.log("Document successfully written!");
        window.alert('Class Allocated!');
        window.location.reload();
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
      
    console.log(theSelect);
    console.log(theSelect.value);
}

function submitInitialCourseSelection(link) {
    window.location.assign(link); 
}