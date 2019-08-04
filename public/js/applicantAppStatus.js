var db = firebase.firestore();

function onLoad() {


    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
            actuallyCreatingTables(user.uid);
        } else {
            window.alert('No user signed in');
            window.location.assign('index.html');
        }
    });
    
}


function onClick(something) {
    //window.alert(something);
    window.location.href=something;
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

                    /*
                    applicantRef.get().then(function(doc) {
                        if (doc.exists) {
                            console.log("applicant data:", doc.data());
                 
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    }).catch(function(error) {
                        console.log("Error getting document:", error);
                    });

                    */ 

                    var classTimes = prepareClassTimes(doc.data().applicantAvailabilities);
                    sessionTimesCol.innerHTML = classTimes;
                    var progressBar = generateProgressBar(doc.data().status);
                    statusCol.appendChild(progressBar);
                    //statusCol.innerHTML = doc.data().status;

                    
                    tr.appendChild(roleCol);
                    tr.appendChild(courseCodeCol);
                    tr.appendChild(sessionTimesCol);
                    tr.appendChild(statusCol);

                    /*
                    td = document.createElement('td');
                    td.setAttribute('class','text-center');
                    td.setAttribute('style','vertical-align:middle;');
                    var button = document.createElement('button');
                
                    // Add Mail to
                    button.setAttribute("class","btn btn-warning");
                    button.innerHTML = "Mail LiC";
                    td.appendChild(button);
                    tr.appendChild(td);
                    */
                }
            });
        });

        var div = document.getElementById('insertTableHere');
        div.appendChild(empTable);    // ADD THE TABLE TO YOUR WEB PAGE.
}

function generateProgressBar(status) {
    var divUpper = document.createElement('div');
    divUpper.setAttribute('class','progress');
    

    //<div class="progress-bar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%;">20%</div>
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
        div.setAttribute('class','progress-bar bg-warning');
        div.setAttribute('style', 'width:80%;');
        div.innerHTML = "Accepted";
    } else {
        div.setAttribute('class','progress-bar bg-danger');
        div.setAttribute('style', 'width:100%;');
        div.innerHTML = "Rejected";
    }

    divUpper.appendChild(div);
    return divUpper;
}