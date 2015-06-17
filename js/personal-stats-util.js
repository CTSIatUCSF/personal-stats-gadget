window.personalStats  = window.personalStats || {};
personalStats.util = personalStats.util || {};

//====================================================================================
// UTILITY FUNCTIONS

personalStats.util.getViewerId = function getViewerId() {
	var viewerHomepage = personalStats.viewerData[FOAF("workplaceHomepage")];
	var viewerUrlParts = viewerHomepage.split("/");
	var viewerId = viewerUrlParts[viewerUrlParts.length-1];
	return viewerId;
}

personalStats.util.getHostname = function getHostname() {
	var viewerHomepage = personalStats.viewerData[FOAF("workplaceHomepage")];
	var hostname = viewerHomepage.replace(personalStats.util.getViewerId(), "").slice(7, -1);
	return hostname;
}

personalStats.util.fixCountryNames = function fixCountryNames(arr) {
	var idx, item;
	for (idx in arr) {
		item = arr[idx];
		if(item[0] == "Côte d’Ivoire" || item[0] == "Côte d'Ivoire") {
			item[0] = "Cote d'Ivoire";
		}
	}
}

personalStats.util.getCountryCode = function getCountryCode(countryName) {
	var returnValue = "";
	var filteredList = countryCodeList.filter(function(item) { 
	    return item.name === countryName;
	});
	if (filteredList[0]) {
		return filteredList[0].code.toLowerCase()
	}
	return returnValue;
}

//====================================================================================
// DATES

personalStats.util.formatMonthYear =  function formatMonthYear(yearMonthString) {
	// Format Google Analytics yearMonth string (ex: 201506) as Mmm-YYYY (ex: Jun-2015)
  	var months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'); 
	var year, month_number, month;

	year = yearMonthString.substring(2, 4);
	month_number = yearMonthString.substring(4, 6) - 1;
	month = months[month_number];
	new_value = month + "-" + year;
	return new_value;
}

personalStats.util.dateOneYearAgo = function dateOneYearAgo() {
	var today = new Date();
 	var oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDay());
 	return oneYearAgo;
}

personalStats.util.dateThirtyDaysAgo = function dateThirtyDaysAgo() {
	var today = new Date();
	var thirtyDaysAgo = new Date(today.setDate(today.getDate()-30));
 	return thirtyDaysAgo;
}
			
personalStats.util.getYearMonthOneYearAgoMonthStart = function getYearMonthOneYearAgoMonthStart() {
	var today = new Date();
 	var start_date = new Date(today.getFullYear() - 1, today.getMonth(), 1);
 	var start_date_string = personalStats.util.convertDateToYearMonthString(start_date);
	return start_date_string;
}

personalStats.util.convertDateToYearMonthString = function convertDateToYearMonthString(date) {
 	var month_numbers = new Array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');
 	var date_string = date.getFullYear() + month_numbers[date.getMonth()];
 	return date_string;
}

//====================================================================================