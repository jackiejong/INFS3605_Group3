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
    arrHead = ['Applicant','Role', 'Course Code', 'Availabilities','Status',""];      // SIMPLY ADD OR REMOVE VALUES IN THE ARRAY FOR TABLE HEADERS.

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
                if(doc.data().lecturer == userUID) {
                    var tr = empTable.insertRow(-1);
                    var applicantCol = document.createElement('td');
                    var roleCol = document.createElement('td');
                    var courseCodeCol = document.createElement('td');
                    var sessionTimesCol = document.createElement('td');
                    var statusCol = document.createElement('td');

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

                    applicantRef.get().then(function(doc) {
                        if (doc.exists) {
                            console.log("applicant data:", doc.data());
                            applicantCol.innerHTML = doc.data().name;

                            


                            
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                        }
                    }).catch(function(error) {
                        console.log("Error getting document:", error);
                    });

                    var classTimes = prepareClassTimes(doc.data().applicantAvailabilities);
                    sessionTimesCol.innerHTML = classTimes;
                    statusCol.innerHTML = doc.data().status;

                    tr.appendChild(applicantCol);
                    tr.appendChild(roleCol);
                    tr.appendChild(courseCodeCol);
                    tr.appendChild(sessionTimesCol);
                    tr.appendChild(statusCol);

                    td = document.createElement('td');
                    var button = document.createElement('button');

                    var theLink = 'onClick("' + 'applicationDetailed.html?' + doc.id + '")';
                    button.setAttribute("onclick",theLink);
                    button.setAttribute("class","btn btn-dark");
                    button.innerHTML = "View Details";
                    td.appendChild(button);
                    tr.appendChild(td);
                }
            });
        });

        var div = document.getElementById('insertTableHere');
        div.setAttribute('class','clean-pricing-item');
        div.setAttribute('style','width: 1200px; margin:auto; height:fit-content; overflow:scroll; text-align: center;');
        

        div.appendChild(empTable);    // ADD THE TABLE TO YOUR WEB PAGE.
}