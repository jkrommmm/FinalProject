/*AUTHOR: Jacob Kromm jacobkromm0@gmail.com
 *VERSION: 1.0
 *CREATED: 05.29.2015
 *ASSIGNMENT: Final Project
 */

"use strict";

(function() {
	"use strict";

	angular.module('myApp', [])
		.controller('mainCtrl', MainCtrl);

	function MainCtrl($scope) {
		$scope.user = [];

		var filename = "list.csv";

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
				users[i] = lines[i].split(",");
			}
		}

		function addData() {
			users.push($scope.users);
		}

		function exportToCsv(filename, rows) {
			var processRow = function (row) {
				var finalVal = '';
				for (var j = 0; j < row.length; j++) {
					var innerValue = row[j] === null ? '' : row[j].toString();
					if (row[j] instanceof Date) {
						innerValue = row[j].toLocaleString();
					};
					var result = innerValue.replace(/"/g, '""');
					if (result.search(/("|,|\n)/g) >= 0)
						result = '"' + result + '"';
					if (j > 0)
						finalVal += ',';
					finalVal += result;
				}
				return finalVal + '\n';
			};

			var csvFile = '';
			for (var i = 0; i < rows.length; i++) {
				csvFile += processRow(rows[i]);
			}

			var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
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

		$scope.submit = function() {
			readCSV();
			addData();
			exportToCsv(filename, users);
		}
	}

})();