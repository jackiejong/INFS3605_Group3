var db = firebase.firestore();
function emptyTable() {
    var arrayHeader = new Array();
    arrayHeader = ['','Monday', 'Tuesday','Wednesday', 'Thursday','Friday'];

    var table = document.createElement('table');
    table.setAttribute('id', 'myAvailabilitiesTable');
    table.setAttribute('class', 'table table-striped table-hover');

    var tr = table.insertRow(-1);
    for (var h = 0; h < arrayHeader.length; h++) {
        var th = document.createElement('th');          // TABLE HEADER.
        th.innerHTML = arrayHeader[h];
        tr.appendChild(th);
    }

    var arrayColumn = new Array();
    arrayColumn = ['0900','1000','1100','1200','1300','1400','1500','1600','1700'];

    for (var c = 0; c < arrayColumn.length; c ++) {
        var tr = table.insertRow(-1);

        for (var h = 0; h < arrayHeader.length; h ++) {
            var td = document.createElement('td');
            if (h == 0) {
                td.innerHTML = arrayColumn[c];
            } else {
                var checkBox = document.createElement('input');
                checkBox.setAttribute('type', 'checkbox');
                checkBox.setAttribute('class', 'checks');
                var value = (h * 10000) + (100 * c + 900);
                checkBox.setAttribute('value', value); 
                td.appendChild(checkBox);
            }

            tr.appendChild(td);
        }
    }

    var div = document.getElementById('insertTableHere');
    div.appendChild(table);

    var button = document.createElement('button');
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-primary");
    button.setAttribute("onclick", "onSubmit()");
    button.innerHTML ="Submit";

    div.appendChild(button);
}

function onSubmit() {
    var myAvailabilities = [];
    var checks = document.getElementsByClassName('checks');
    for (var i = 0; i < 45; i ++) {
        if (checks[i].checked === true) {
            myAvailabilities.push(checks[i].value);
        }
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
            var user = firebase.auth().currentUser;
            console.log(user.uid);
            var docRef = db.collection("lecturer").doc(user.uid.toString());

            var setWithMerge = docRef.set({
                myAvailabilities: myAvailabilities
            }, { merge: true });

            console.log(setWithMerge);
            console.log(myAvailabilities);
        }
      });


    console.log(myAvailabilities);
    window.alert('myAvailabilities Submitted');
}

function onLoad() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
            var user = firebase.auth().currentUser;
            console.log(user.uid);
            var docRef = db.collection("lecturer").doc(user.uid.toString());

            docRef.get().then(function(doc) {
                if (doc.exists) {
                    console.log(doc.data().name);
                    if (doc.data().myAvailabilities == null) {
                        emptyTable();
                    } else {
                        fillTable();
                    }
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });

        }
    });
}


function fillTable() {
    var arrayHeader = new Array();
    arrayHeader = ['','Monday', 'Tuesday','Wednesday', 'Thursday','Friday'];

    var table = document.createElement('table');
    table.setAttribute('id', 'myAvailabilitiesTable');
    table.setAttribute('class', 'table table-striped table-hover');

    var tr = table.insertRow(-1);
    for (var h = 0; h < arrayHeader.length; h++) {
        var th = document.createElement('th');          // TABLE HEADER.
        th.innerHTML = arrayHeader[h];
        tr.appendChild(th);
    }

    var arrayColumn = new Array();
    arrayColumn = ['0900','1000','1100','1200','1300','1400','1500','1600','1700'];

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
            var user = firebase.auth().currentUser;
            console.log(user.uid);
            var docRef = db.collection("lecturer").doc(user.uid.toString());

            docRef.get().then(function(doc) {
                if (doc.exists) {
                   var currentAvailabilities = doc.data().myAvailabilities;

                   for (var c = 0; c < arrayColumn.length; c ++) {
                    var tr = table.insertRow(-1);
            
                    for (var h = 0; h < arrayHeader.length; h ++) {
                        var td = document.createElement('td');
                        if (h == 0) {
                            td.innerHTML = arrayColumn[c];
                        } else {
                            var checkBox = document.createElement('input');
                            checkBox.setAttribute('type', 'checkbox');
                            checkBox.setAttribute('class', 'checks');
                            var value = (h * 10000) + (100 * c + 900);

                            for (var a = 0; a < currentAvailabilities.length; a ++) {
                                if (currentAvailabilities[a] == value) {
                                    checkBox.setAttribute('checked', 'true');
                                }
                            }
                            checkBox.setAttribute('value', value); 
                            td.appendChild(checkBox);
                        }
            
                        tr.appendChild(td);
                    }
                }
            } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        }
    });

    var div = document.getElementById('insertTableHere');
    div.appendChild(table);

    var button = document.createElement('button');
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-primary");
    button.setAttribute("onclick", "onUpdate()");
    button.innerHTML ="Submit";

    div.appendChild(button);
}


function onUpdate() {
    var myAvailabilities = [];
    var checks = document.getElementsByClassName('checks');
    for (var i = 0; i < 45; i ++) {
        if (checks[i].checked === true) {
            myAvailabilities.push(checks[i].value);
        }
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
            var user = firebase.auth().currentUser;
            console.log(user.uid);
            var docRef = db.collection("lecturer").doc(user.uid.toString());

            var updateDoc = docRef.update({
                myAvailabilities: myAvailabilities
            }).then(function() {
                console.log("Document successfully updated!");
                window.alert("Your availabilities successfully updated!");
            })
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });

            console.log(updateDoc);
            console.log(myAvailabilities);
        }
      });


    console.log(myAvailabilities);
}


