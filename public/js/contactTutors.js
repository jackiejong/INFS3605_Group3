var db = firebase.firestore();
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
console.log("Document ID ", queryString);
console.log(typeof queryString);

var dictJobListingCode = [];
var dictJobListingRole = {};
var jobListingDictionary = {};


function onLoad() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.

            createDict(user.uid);
            
            actuallyCreatingShit(user.uid);
        } else {
            window.alert('No user signed in');
            window.location.assign('index.html');
        }
    });
    
}


function actuallyCreatingShit(userUID) {
    var div = document.getElementById('insertTableHere');
    div.setAttribute('class','text-center');
    

    var arrayHeading = ['Applicant','Course','Role', 'Status' ,"Mail"];  


    var empTable = document.createElement('table');
    empTable.setAttribute('id', 'empTable'); 

    empTable.setAttribute('class', 'table table-striped table-hover');  
    empTable.setAttribute('style','padding-top: 100px; width:80%; margin-left:auto; margin-right:auto;'); 
    
    
    var rowHeading = empTable.insertRow(-1);

    for (var i = 0; i < arrayHeading.length; i ++) {
        var th = document.createElement('th');
        th.innerHTML = arrayHeading[i];
        rowHeading.appendChild(th);
    }

    db.collection('jobApplication').get().then((querySnapshot)=> {
        querySnapshot.forEach((doc) => {  
            if (queryString == doc.data().courseCode) {
                console.log(doc.id + " === " + doc.data);
                var row = empTable.insertRow(-1);
                var nameCol = document.createElement('td');
                var courseCodeCol = document.createElement('td');
                var roleCol = document.createElement('td');
                var statusCol = document.createElement('td');
                var checkBoxCol = document.createElement('td');
    

                createCheckbox(checkBoxCol,doc.data().applicantEmail);

                nameCol.innerHTML = doc.data().applicantName;
                courseCodeCol.innerHTML = doc.data().courseCode;
                roleCol.innerHTML = doc.data().role;
                statusCol.innerHTML = doc.data().status;

                row.appendChild(nameCol);
                row.appendChild(courseCodeCol);
                row.appendChild(roleCol);

                row.appendChild(statusCol);
                row.appendChild(checkBoxCol);
            }
        });
    }).then(function() {
        console.log("We are heree");
        div.appendChild(empTable);
        createMailButton(div);
        if(queryString == "") {
        
            div.hidden = true;
        } else {
            div.hidden = false;
            

        }
    });
    
}

function createMailButton(div) {
    var divSingleButton = document.createElement('div');
    divSingleButton.setAttribute('style','padding:20px;')
    var button = document.createElement('button');
    button.setAttribute('class','btn btn-primary');
    button.innerHTML = "Mail Applicants";
    button.setAttribute('onclick','mailApplicants()');
    divSingleButton.appendChild(button);
    div.appendChild(divSingleButton);
}

function mailApplicants() {
    var theLink = 'mailto:';
    var counter = 0;
    var checks = document.getElementsByClassName('form-check-input');

    
     for (var i = 0; i < checks.length; i ++) {
            if (checks[i].checked === true) {
                counter ++;
                if (counter == 1) {
                    theLink += '?bcc=' + checks[i].value;
                } else {
                    theLink += "," + checks[i].value;
                }
                console.log(checks[i].value);
            }
            
        }
    
    if(counter == 0) {
        window.alert('Please select a Tutor to email');
    } else {
        console.log(theLink);
        window.location.assign(theLink);
    }
}

function createCheckbox(col, docID) {
    var checkbox = document.createElement('input');
    checkbox.setAttribute('class','form-check-input');
    checkbox.setAttribute('type','checkbox');
    checkbox.value = docID;
    col.appendChild(checkbox);
}

function createInitialSelection() {
    var div = document.getElementById('insertInitialSelectionHere');
    div.setAttribute('class','text-center');
    var h3 = document.createElement('h5');
    h3.innerHTML = "Please Select a Course";
    div.appendChild(h3);

    for (var i = 0; i < dictJobListingCode.length; i ++) {
        var divSingleButton = document.createElement('div');
        divSingleButton.setAttribute('style','padding:20px;');
        var button = document.createElement('button');
        button.setAttribute('class','btn btn-primary');
        button.innerHTML = dictJobListingCode[i];
        button.setAttribute('onclick', 'submitInitialSelection("' + dictJobListingCode[i] + '")');
        divSingleButton.appendChild(button);
        div.appendChild(divSingleButton);
    }

    if(queryString != "") {
        div.hidden = true;
    } else {
        div.hidden = false;
    }
    console.log('done');
}

function submitInitialSelection(link) {
    link = 'contactTutors.html?' + link;
    window.location.assign(link);
}

function createDict(userUID) {
    db.collection("jobApplication").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().lecturer == userUID) {
                
               if(!dictJobListingCode.includes(doc.data().courseCode)) {
                   dictJobListingCode.push(doc.data().courseCode);
               }
               jobListingDictionary[doc.id] = doc.data().courseCode;
               dictJobListingRole[doc.id] = doc.data().role;
               console.log(dictJobListingCode);
            }
        });
    }).then(function() {
        createInitialSelection(userUID);
    });
}