/*AUTHOR: Jacob Kromm jacobkromm0@gmail.com
 *VERSION: 1.3
 *CREATED: 05.29.2015
 *ASSIGNMENT: Final Project
 */

"use strict";

/** @type {Array} */
var emailList = [];

/** @type {string} */
var filename = "data/list.csv";

function readCSV() {
    /** @type {Array.<string>} */
    var lines = [];
    $.ajax({
        url: 'data/list.csv',
        contentType: "text/csv",
        async: false,
        success: function(text) {
            lines = text.split(/\n/);
        }
    });
    for (var i = 0; i < lines.length; i++) {
        emailList[i] = lines[i].split(", ");
    }
    console.log(emailList);
}

function populateEmailList() {
    emailList.push( $("#name").val());
    emailList.push( $("#email").val());
    emailList.push( $("#company").val());
}

function submitBtn() {
    $("#submitButton").click(function() {
        populateEmailList();
        exportToCsv(filename, emailList)
    });
}

function exportToCsv(filename, emailList) {
    var processRow = function (emailList) {
        var finalVal = '';
        for (var j = 0; j < emailList.length; j++) {
            var innerValue = emailList[j] === null ? '' : emailList[j].toString();
            if (emailList[j] instanceof Date) {
                innerValue = emailList[j].toLocaleString();
            }
            ;
            var result = innerValue.replace(/"/g, '","');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += '';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < emailList.length; i++) {
        csvFile += processRow(emailList[i]);
    }

    var blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

window.onload = function() {
    readCSV();
    submitBtn();
};

