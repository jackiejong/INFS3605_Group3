function onLoad() {
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
}

function onSubmit() {
    var myAvailabilities = [];
    var checks = document.getElementsByClassName('checks');
    for (var i = 0; i < 45; i ++) {
        if (checks[i].checked === true) {
            myAvailabilities.push(checks[i].value);
        }
    }

    console.log(myAvailabilities);
}