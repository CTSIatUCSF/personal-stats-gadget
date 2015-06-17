window.personalStats  = window.personalStats || {};

//====================================================================================
//SHOW CONTENT

personalStats.populateInstructionsPanel = function populateInstructionsPanel() {
	var viewerHomepage = personalStats.viewerData[FOAF("workplaceHomepage")];
	var profilesLoginPage = "http://profiles.ucsf.edu/login/default.aspx?method=login&edit=true";

    $("#instructions-section-one").append("<p>Add <a id=\x22profile_link\x22 href=" + viewerHomepage + ">" + viewerHomepage + "</a> to your email footer, business card and department site.</p>");
    $("#instructions-section-one").append("<p>Add more personalized content (overview, awards, videos) to <a id=\x22add_content\x22 href=" + profilesLoginPage + "> your profile page.</p>");
	$("#instructions-section-one p").addClass("panel-text");

    $("#instructions-section-two").append("<p><a id=\x22add_sections\x22 href=" + profilesLoginPage + ">Add more sections</a> to your page.</p>");
	$("#instructions-section-two p").addClass("panel-text");

	// add click events to track events in google analytics
    $("#profile_link").click(function () {
    	personalStats.gadgetEventTrack($(this).attr("id"), viewerHomepage);
    });
    $("#add_content").click(function () {
    	personalStats.gadgetEventTrack($(this).attr("id"));
    });
    $("#add_sections").click(function () {
    	personalStats.gadgetEventTrack($(this).attr("id"));
    });
}

personalStats.showVisitorCountStats = function showVisitorCountStats() {
  	var viewerFirstName, firstNameToDisplay;
  	
  	viewerFirstName = personalStats.viewerData[FOAF("firstName")];
  	firstNameToDisplay = viewerFirstName + "'s";
  	if (viewerFirstName.slice(-1) == "s") {
  		firstNameToDisplay = firstNameToDisplay.slice(0, -1);
  	}

	var vccLastYear = document.getElementById('view_count_last_year');
	var vccLastYearCount = calculateViewCountLastYear(aggregatedByMonthLastYear);
	vccLastYearCount.count = vccLastYearCount.count.toLocaleString(); // adds thousands separators
	vccLastYear.innerHTML = firstNameToDisplay + " profile has been viewed " + vccLastYearCount.count + " times since " + vccLastYearCount.start;
	
	var vccThisMonth = document.getElementById("view_count_this_month");
	vccThisMonthCount = calculateViewCountThisMonth(aggregatedByMonthAll);
	vccThisMonthCount = vccThisMonthCount.toLocaleString(); // adds thousands separators
	vccThisMonth.innerHTML = vccThisMonthCount;

	var vccBestMonth = document.getElementById("view_count_best_month");
	vccBestMonthCount = calculateViewCountBestMonth(aggregatedByMonthAll);
	vccBestMonthCount = vccBestMonthCount.toLocaleString(); // adds thousands separators
	vccBestMonth.innerHTML = vccBestMonthCount;

	var vccAllTime = document.getElementById("view_count_all_time");
	vccAllTimeCount = calculateViewCountAllTime(aggregatedByMonthAll);
	vccAllTimeCount.count = vccAllTimeCount.count.toLocaleString(); // adds thousands separators
	vccAllTime.innerHTML = vccAllTimeCount.count;

	var vccAllTimeSince = document.getElementById("view_count_all_time_since");
	vccAllTimeSince.innerHTML = "Since " + vccAllTimeCount.start + "*";
}

personalStats.showViewsByCity = function showViewsByCity(data, tableToUpdateID, onlyShowN) {
	var dataToShow, index, item, countryName, countryCode, regionName, cityName, geoString, count;

	$("#" + tableToUpdateID + " tr").remove(); //Remove any existing rows before adding new ones

	// filter out data that we don't want to display
	if (onlyShowN > 0) {
		dataToShow = data.slice(0, onlyShowN);
		if (data.length > dataToShow.length) {
			$(".geo.show-all.toggle-btn").removeClass("visuallyhidden"); //Unhide the See All button 
		} else {
			dataToShow = data;
			$(".geo.show-all.toggle-btn").addClass("visuallyhidden"); //Hide the See All button 
		}
	} else {
		dataToShow = data;
	}

	// add table rows for dataToShow
	for (index in dataToShow) {
		item = dataToShow[index];
		countryName = item[0];
		countryCode = personalStats.getCountryCode(countryName);
		regionName = item[1];
		cityName = item[2];
		geoString = cityName  + ", " + regionName;
		if (geoString.indexOf("(not set)") > -1) {
			geoString = geoString.replace("(not set), ", "");
			geoString = geoString.replace(", (not set)", "");
		}
		count = item[3];

		//TODO: Fix this path
		$("#" + tableToUpdateID).append("<tr><td><img src=http://cranestylelabs.github.io/personal-stats-gadget/images/flag_icons/"+ countryCode + ".gif></img></td><td>" + geoString + "</td><td>" + count + "</td></tr>");
	}

	$("#" + tableToUpdateID + " tr").addClass("panel-list-row"); 					//Add CSS class to the table rows
	$("#" + tableToUpdateID + " tr td:first-child").addClass("panel-list-image"); 	//Add CSS class to the first item in each row
	$("#" + tableToUpdateID + " tr td:last-child").addClass("panel-list-count");  	//Add CSS class to the last item in each row
}

personalStats.getCountryCode = function getCountryCode(countryName) {
	var returnValue = "";
	var filteredList = countryCodeList.filter(function(item) { 
	    return item.name === countryName;
	});
	if (filteredList[0]) {
		return filteredList[0].code.toLowerCase()
	}
	return returnValue;
}

personalStats.showViewsByDomain = function showViewsByDomain(data, tableToUpdateID, onlyShowN) {
	var dataToShow, index, item, domainName, count;

	$("#" + tableToUpdateID + " tr").remove(); //Remove any existing rows before adding new ones

	// filter out data that we don't want to display
	if (onlyShowN > 0) {
		dataToShow = data.slice(0, onlyShowN);
		if (data.length > dataToShow.length) {
			$(".domain.show-all.toggle-btn").removeClass("visuallyhidden"); //Unhide the See All button 
		} else {
			dataToShow = data;
			$(".domain.show-all.toggle-btn").addClass("visuallyhidden"); //Hide the See All button 
		}
	} else {
		dataToShow = data;
	}

	// add table rows for dataToShow
	for (index in dataToShow) {
		item = dataToShow[index];
		domainName = item[0];
		count = item[1];

		$("#" + tableToUpdateID).append("<tr><td>" + domainName + "</td><td>" + count + "</td></tr>");
	}

	$("#" + tableToUpdateID + " tr").addClass("panel-list-row"); 					//Add CSS class to the table rows
	$("#" + tableToUpdateID + " tr td:last-child").addClass("panel-list-count"); 	//Add CSS class to the last item in each row
}

personalStats.showRelatedPeople = function showRelatedPeople(data, divToUpdateID, onlyShowN) {
	var dataToShow, index, item, link, count;
	var hostname = getHostname();

	$("#" + divToUpdateID + " div").remove(); //Remove any existing rows before adding new ones

	// filter out data that we don't want to display
	if (onlyShowN > 0) {
		dataToShow = data.slice(0, onlyShowN);
		if (data.length > dataToShow.length) {
			$(".related-people.show-all.toggle-btn").removeClass("visuallyhidden"); //Unhide the See All button 
		} else {
			dataToShow = data;
			$(".related-people.show-all.toggle-btn").addClass("visuallyhidden"); //Hide the See All button 
		}
	} else {
		dataToShow = data;
	}

	// add table rows for dataToShow
	for (index in dataToShow) {
		item = dataToShow[index];
		link = hostname + item[0];

		$("#" + divToUpdateID).append("<div><a href=http://" + link + ">" + link + "</a></div>");
	}

	$("#" + divToUpdateID + " div").addClass("panel-text"); 			//Add CSS class to divs
	$("#" + divToUpdateID + " div").addClass("related-people-link"); 	//Add CSS class to divs
}


personalStats.fetchDataSuccessHandler = function fetchDataSuccessHandler(response, callback) {
	var data = JSON.parse(response.data);
	
	 	personalStats.aggregatedByMonthAll 			= personalStats.aggregateDataByMonth(data.rows);
		personalStats.aggregatedByMonthLastYear 	= personalStats.aggregateDataByMonth(data.rows, 	personalStats.getYearMonthOneYearAgoMonthStart());
		personalStats.aggregatedByCityLastYear 		= personalStats.aggregateDataByCity(data.rows, 		personalStats.dateOneYearAgo().yyyymmdd());
		personalStats.aggregatedByCityLastMonth 	= personalStats.aggregateDataByCity(data.rows,		personalStats.dateThirtyDaysAgo().yyyymmdd());
		personalStats.aggregatedByStateLastYear 	= personalStats.aggregateDataByState(data.rows, 	personalStats.dateOneYearAgo().yyyymmdd());
		personalStats.aggregatedByStateLastMonth 	= personalStats.aggregateDataByState(data.rows, 	personalStats.dateThirtyDaysAgo().yyyymmdd());
		personalStats.aggregatedByCountryLastYear 	= personalStats.aggregateDataByCountry(data.rows, 	personalStats.dateOneYearAgo().yyyymmdd());
		personalStats.aggregatedByCountryLastMonth 	= personalStats.aggregateDataByCountry(data.rows, 	personalStats.dateThirtyDaysAgo().yyyymmdd());
		personalStats.aggregatedByDomainLastYear 	= personalStats.aggregateDataByDomain(data.rows, 	personalStats.dateOneYearAgo().yyyymmdd());
		personalStats.aggregatedByDomainLastMonth 	= personalStats.aggregateDataByDomain(data.rows, 	personalStats.dateThirtyDaysAgo().yyyymmdd());
		
		personalStats.drawColumnChart(aggregatedByMonthLastYear);
		personalStats.showVisitorCountStats();

		personalStats.showViewsByCity(personalStats.aggregatedByCityLastMonth, "geo-list", 10);
		personalStats.showViewsByDomain(personalStats.aggregatedByDomainLastMonth, "domain-list", 10);

		$("#count_area").removeClass("visuallyhidden");
		$("#geo-panel").removeClass("visuallyhidden");
		$("#domain-panel").removeClass("visuallyhidden");
		$("#related-people-panel").removeClass("visuallyhidden");
		$("#instructions-panel").removeClass("visuallyhidden");
		$("#loading").hide();

	callback();
}

personalStats.fetchPagePathDataSuccessHandler = function fetchPagePathDataSuccessHandler(response, callback) {	    		
	var data = JSON.parse(response.data);
	personalStats.aggregatedByAlsoViewed = personalStats.aggregateDataByAlsoViewed(data.rows);
	personalStats.showRelatedPeople(personalStats.aggregatedByAlsoViewed, "related-people-list", 5);
	$("#related-people-panel-content").removeClass("visuallyhidden");
		$("#related-people-loading").hide();

    callback();
}

//====================================================================================
// DRAW CHARTS 

personalStats.drawColumnChart = function drawColumnChart(data) {
    
    var data_table = new google.visualization.DataTable();
    data_table.addColumn('string', 'Month');
    data_table.addColumn('number', 'Views');
    data_table.addColumn({type: 'string', role: 'style'});
	personalStats.populateDataTable_ColumnChart(data_table, data);

    var options = {
		legend: {position: 'none'}
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_container'));
    chart.draw(data_table, options);
}

personalStats.drawGeoChart_World = function drawGeoChart_World(data) {
	
	var data_table = new google.visualization.DataTable();
	data_table.addColumn('string', 'Country');
	data_table.addColumn('number', 'Views');
	personalStats.populateDataTable_GeoChart(data_table, data);

	var options = {
	    colorAxis: {colors: ["#FFCC00", "#FF0000"]},
	};
	var chart = new google.visualization.GeoChart(document.getElementById("geo-chart-world"));
	chart.draw(data_table, options);
}

personalStats.drawGeoChart_USA = function drawGeoChart_USA(data) {
    // Create the data table.
    var data_table = new google.visualization.DataTable();
    data_table.addColumn('string', 'State');
    data_table.addColumn('number', 'Views');
	personalStats.populateDataTable_GeoChart(data_table, data);

	var options = {
		region: "US",
		resolution: "provinces",
        colorAxis: {colors: ["#FFCC00", "#FF0000"]},
	};
	var chart = new google.visualization.GeoChart(document.getElementById("geo-chart-usa"));
    chart.draw(data_table, options);
}

personalStats.populateDataTable_ColumnChart = function populateDataTable_ColumnChart(dataTable, dataToAdd) {
	for (idx in dataToAdd) {
		row = dataToAdd[idx];
		lastIndex = row.length-1;
		dataTableRow = new Array();
		dataTableRow[0] = personalStats.formatMonthYear(row[0]);
		dataTableRow[1] = row[lastIndex];
		dataTableRow[2] = "color: #F26D04";
		dataTable.addRow(dataTableRow);
	}
	// remove the last row, which contains data for this month (we show this data elsewhere)
	var lastItemIndex = dataTable.getNumberOfRows()-1;
	dataTable.removeRow(lastItemIndex);
}

personalStats.populateDataTable_GeoChart = function populateDataTable_GeoChart(dataTable, dataToAdd) {
	for (idx in dataToAdd) {
		row = dataToAdd[idx];
		lastIndex = row.length-1;
		dataTableRow = new Array();
		dataTableRow[0] = row[0];
		dataTableRow[1] = row[lastIndex];
		dataTable.addRow(dataTableRow);
	}
}

//====================================================================================
//GOOGLE ANALYTICS QUERIES 

personalStats.gaRequestParams = function gaRequestParams() {
	var params = {};		
    params[gadgets.io.RequestParameters.CONTENT_TYPE] 		= gadgets.io.ContentType.TEXT;
    params[gadgets.io.RequestParameters.AUTHORIZATION] 		= gadgets.io.AuthorizationType.OAUTH2;
    params[gadgets.io.RequestParameters.METHOD]		 		= gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.OAUTH_SERVICE_NAME] = "googleAPIv3";
    params[gadgets.io.RequestParameters.REFRESH_INTERVAL] 	= "0";
    return params;
}

personalStats.gaBaseQuery = function gaBaseQuery() {
	var query =  {
		'ids': 'ga:23439892',
    	'metrics': 'ga:uniquePageviews',
        'dimensions': '',
        'filters': 'ga:pagePath' + pagePath,
        'start-date': earliest_start_date,
        'end-date': today
    }
    return query;
}

personalStats.convertToQueryString = function convertToQueryString(queryObject) {
	var queryString = "";
	for (var key in queryObject) {
	   if (queryObject.hasOwnProperty(key)) {
	      queryString = queryString + key + "=" + queryObject[key] + "&"; 
	   }
	}
	queryString = queryString.slice(0,-1); // remove the "&" at the end of query_string

	return queryString;
}

personalStats.fetchData = function fetchData(tryCountdown, callback) {
	var viewerId = personalStats.getViewerId();
	var pagePath = encodeURIComponent("=~/" + viewerId);

	var earliest_start_date = "2009-12-01"
	var today = new Date().yyyy_mm_dd();

	var query =  personalStats.gaBaseQuery();
	query.dimensions = "ga:date,ga:country,ga:region,ga:city,ga:networkLocation";

	var query_string = personalStats.convertToQueryString(query);

    url = "https://www.googleapis.com/analytics/v3/data/ga?" + query_string;
    
    var params = personalStats.gaRequestParams();

    gadgets.io.makeRequest(url, function (response) {
      	if (response.oauthApprovalUrl) {
    		console.log("OAuth Approval URL:")
    		console.log(response.oauthApprovalUrl);
      	} else if (response.data) {
      		personalStats.fetchDataSuccessHandler(response, callback);
      	} else {
      		personalStats.fetchDataErrorHandler(response, tryCountdown, function() {
      			personalStats.fetchData(tryCountdown, callback);
  			});
      	}
    }, params);
}

personalStats.fetchPagePathData = function fetchPagePathData(tryCountdown, callback) {
	var viewerId = personalStats.getViewerId();
	var pagePath = encodeURIComponent("=~/" + viewerId);

	var earliest_start_date = "2009-12-01"
	var today = new Date().yyyy_mm_dd();

	var query =  personalStats.gaBaseQuery();
	query.dimensions = "ga:date,ga:pagePathLevel1,ga:landingPagePath,ga:secondPagePath,ga:exitPagePath,ga:previousPagePath,ga:nextPagePath";

	var query_string = personalStats.convertToQueryString(query);

    url = "https://www.googleapis.com/analytics/v3/data/ga?" + query_string;
    
    var params = personalStats.gaRequestParams();

    gadgets.io.makeRequest(url, function (response) {
    	if (response.oauthApprovalUrl) {
    		console.log("OAuth Approval URL:")
    		console.log(response.oauthApprovalUrl);
        
      	} else if (response.data) {
      		personalStats.fetchPagePathDataSuccessHandler(response, callback);

      	} else {
      		personalStats.fetchDataErrorHandler(response, tryCountdown, function() {
      			personalStats.fetchPagePathData(tryCountdown, callback);
  			});
      	}
    }, params);
}

personalStats.fetchDataErrorHandler = function fetchDataErrorHandler(response, tryCountdown, retryFunction) {
		console.log("Error:")
		console.log(response.rc);
		if (tryCountdown > 0) {
			retryFunction();
		}
		else {
			console.log("Done trying!!!!");
		}
}
//====================================================================================
// GOOGLE ANALYTICS EVENT TRACKING

personalStats.gadgetEventTrack = function gadgetEventTrack(action, label, value) {        
	var message = {'action' : action};
	if (label) {message.label = label;}
	if (value) {message.value = value;}
	console.log("gadgetEventTrack");
	console.log("action = " + action);
	console.log("label = " + label);
	gadgets.orng.reportGoogleAnalyticsEvent(message);
}

//====================================================================================
// DATES

personalStats.formatMonthYear =  function formatMonthYear(yearMonthString) {
	// Format Google Analytics yearMonth string (ex: 201506) as Mmm-YYYY (ex: Jun-2015)
  	var months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'); 
	var year, month_number, month;

	year = yearMonthString.substring(2, 4);
	month_number = yearMonthString.substring(4, 6) - 1;
	month = months[month_number];
	new_value = month + "-" + year;
	return new_value;
}

personalStats.dateOneYearAgo = function dateOneYearAgo() {
	var today = new Date();
 	var oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDay());
 	return oneYearAgo;
}

personalStats.dateThirtyDaysAgo = function dateThirtyDaysAgo() {
	var today = new Date();
	var thirtyDaysAgo = new Date(today.setDate(today.getDate()-30));
 	return thirtyDaysAgo;
}
			
personalStats.getYearMonthOneYearAgoMonthStart = function getYearMonthOneYearAgoMonthStart() {
	var today = new Date();
 	var start_date = new Date(today.getFullYear() - 1, today.getMonth(), 1);
 	var start_date_string = personalStats.convertDateToYearMonthString(start_date);
	return start_date_string;
}

personalStats.convertDateToYearMonthString = function convertDateToYearMonthString(date) {
 	var month_numbers = new Array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');
 	var date_string = date.getFullYear() + month_numbers[date.getMonth()];
 	return date_string;
}

//====================================================================================
// DATA AGGREGATION

personalStats.aggregateDataByMonth = function aggregateDataByMonth(data, yearMonthStart) {

	var start = yearMonthStart || 0;
	var lastItemIndex = data.length-1; 
	var lastIndex = data[0].length-1;

	var monthArray = data.map(function(elem) {
	    return elem[0].slice(0, -2);
	});

	var filteredMonthArray = monthArray.filter(function(elem, i, array) {
	        return array.indexOf(elem) === i && elem >= start;
	    }
	);

	var arrayToReturn = filteredMonthArray.map(function(month) {
	    var count = data.reduce(function(prevVal, elem) {
	        if(elem[0].slice(0, -2) == month) {
	            return prevVal + parseInt(elem[lastIndex]);
	        } 
	        else {
	            return prevVal;
	        }
	    }, 0);
	    return new Array(month, count); 
	});

	// add a row for the current month if one doesn't exist
	var today = new Date();
	var thisYearMonth = personalStats.convertDateToYearMonthString(today);

	var lastItem = data[lastItemIndex];
	if (lastItem[0].slice(0, -2) != thisYearMonth) {
		var rowToAdd = new Array(thisYearMonth, 0);
		arrayToReturn.push(rowToAdd);
	}

	return arrayToReturn;
}

personalStats.aggregateDataByCity = function aggregateDataByCity(data, dateStart) {

	var start = dateStart || 0
		var lastIndex = data[0].length-1;

	var dataFilteredByDate = data.filter(function(elem, i, array) {
	        return array.indexOf(elem) === i && elem[0] >= start;
	    }
	);

	var uniques = dataFilteredByDate.map(function(elem) {
	    return elem[1] + "_" + elem[2] + "_" + elem[3];
	});

	var filteredArray = uniques.filter(function(elem, i, array) {
	        return array.indexOf(elem) === i;
	    }
	);

	var arrayToReturn = filteredArray.map(function(unique_value) {
	    var count = dataFilteredByDate.reduce(function(prevVal, elem) {
	        if(elem[1] + "_" +elem[2] + "_" +elem[3] == unique_value) {
	            return prevVal + parseInt(elem[lastIndex]);
	        } 
	        else {
	            return prevVal;
	        }
	    }, 0);
	    var splits = unique_value.split("_");
	    return new Array(splits[0], splits[1], splits[2], count); 
	});

	// sort by views, descending
	arrayToReturn.sort(function(a,b) {
	    return b[3]-a[3]
	});

	fixCountryNames(arrayToReturn);

	return arrayToReturn;
}

personalStats.aggregateDataByState = function aggregateDataByState(data, dateStart) {
		
	var start = dateStart || 0
		var lastIndex = data[0].length-1;

	var dataFilteredByDate = data.filter(function(elem, i, array) {
	        return array.indexOf(elem) === i && elem[0] >= start;
	    }
	);

	var onlyUSA = dataFilteredByDate.filter(function(elem, i, array) {
	        return array.indexOf(elem) === i && elem [1]== "United States";
	    }
	);

	var uniques = onlyUSA.map(function(elem) {
	    return elem[2];
	});

	var filteredArray = uniques.filter(function(elem, i, array) {
	        return array.indexOf(elem) === i;
	    }
	);

	var arrayToReturn = filteredArray.map(function(unique_value) {
	    var count = dataFilteredByDate.reduce(function(prevVal, elem) {
	        if(elem[2] == unique_value) {
	            return prevVal + parseInt(elem[lastIndex]);
	        } 
	        else {
	            return prevVal;
	        }
	    }, 0);
	    return new Array(unique_value, count); 
	});

	// sort by views, descending
	arrayToReturn.sort(function(a,b) {
	    return b[3]-a[3]
	});

	return arrayToReturn;
}

personalStats.aggregateDataByCountry = function aggregateDataByCountry(data, dateStart) {
		
	var start = dateStart || 0
		var lastIndex = data[0].length-1;

	var dataFilteredByDate = data.filter(function(elem, i, array) {
	        return array.indexOf(elem) === i && elem[0] >= start;
	    }
	);

	var countryArray = dataFilteredByDate.map(function(elem) {
	    return elem[1];
	});

	var filteredCountryArray = countryArray.filter(function(elem, i, array) {
	        return array.indexOf(elem) === i;
	    }
	);

	var arrayToReturn = filteredCountryArray.map(function(country) {
	    var count = dataFilteredByDate.reduce(function(prevVal, elem) {
	        if(elem[1] == country) {
	            return prevVal + parseInt(elem[lastIndex]);
	        } 
	        else {
	            return prevVal;
	        }
	    }, 0);
	    return new Array(country, count); 
	});

	// sort by views, descending
	arrayToReturn.sort(function(a,b) {
	    return b[1]-a[1]
	});

	fixCountryNames(arrayToReturn);

	return arrayToReturn;
}

personalStats.aggregateDataByDomain = function aggregateDataByDomain(data, dateStart) {

	var start = dateStart || 0
		var lastIndex = data[0].length-1;

	var dataFilteredByDate = data.filter(function(elem, i, array) {
	        return array.indexOf(elem) === i && elem >= start;
	    }
	);

	var domainArray = dataFilteredByDate.map(function(elem) {
	    return elem[4];
	});

	var filteredDomainArray = domainArray.filter(function(elem, i, array) {
	        return array.indexOf(elem) === i;
	    }
	);

	var arrayToReturn = filteredDomainArray.map(function(domain) {
	    var count = dataFilteredByDate.reduce(function(prevVal, elem) {
	        if(elem[4] == domain) {
	            return prevVal + parseInt(elem[lastIndex]);
	        } 
	        else {
	            return prevVal;
	        }
	    }, 0);
	    return new Array(domain, count); 
	});

	// sort by views, descending
	arrayToReturn.sort(function(a,b) {
	    return b[1]-a[1]
	});

	return arrayToReturn;
}

personalStats.aggregateDataByAlsoViewed = function aggregateDataByAlsoViewed(data, dateStart) {

	var regEx = new RegExp("^/([a-z][a-z-\.]+)$");
	var viewersPage = "/" + getViewerId();
      		
	var start = dateStart || 0
		var lastIndex = data[0].length-1;

	var dataFilteredByDate = data.filter(function(elem, i, array) {
	    return array.indexOf(elem) === i && elem[0] >= start;
	});

	// clear out any values that are not profiles page ids, and clear out the viewer's page id
	var cleanedData = dataFilteredByDate.map(function (item) {
		return item.filter( function (elem) {
			return regEx.test(elem) && elem != viewersPage;
		});
	});

	// de-dupe each array returned above (we want arrays to contain no duplicates, but duplicates across arrays are fine)
	var dedupedData = cleanedData.map(function (item) {
		return item.filter( function (elem, i, array) {
			return array.indexOf(elem) === i;
		});
	});

	// remove any empty arrays returned above
	var validData = dedupedData.filter( function (elem) {
		return elem.length > 0;
	});

	var collapsed = [];
	collapsed = (collapsed.concat.apply(collapsed, validData)).filter(function(elem) {
		return elem;
	});

	var uniques = collapsed.filter(function(elem, i, array) {
	        return array.indexOf(elem) === i;
	    }
	);

	var arrayToReturn = uniques.map( function(uniqueVal, i) {
		var count = collapsed.reduce(function(prevVal, elem, i) {
	        if(elem == uniqueVal) {
	            return prevVal + 1;
	        } 
	        else {
	            return prevVal;
	        }
	    }, 0);
	    return new Array(uniqueVal, count); 
	});
	
	// sort by number of pageViews, descending
	arrayToReturn.sort(function(a,b) {
	    return b[1]-a[1];
	});

	return arrayToReturn;
}

//====================================================================================
// CALCULATE VIEW COUNTS

personalStats.calculateViewCountLastYear = function calculateViewCountLastYear(data) {
  	var i, row, lastIndex;
	
  	var firstRow = data[0];
	  	var lastIndex = firstRow.length-1;
	var count = data.reduce(function(prevVal, elem) {
	    return prevVal + parseInt(elem[lastIndex]);
	}, 0);

	  	var start = firstRow[0];
	start = personalStats.formatMonthYear(start);
	start = start.replace("-", " 20");
	
	var viewCount = {
		count: count,
		start: start
	}
	
	return viewCount;
}
		
personalStats.calculateViewCountThisMonth = function calculateViewCountThisMonth(data) {
	var lastRowIndex = data.length-1;
	var lastRow = data[lastRowIndex];
	var lastIndex = lastRow.length-1;
	return parseInt(lastRow[lastIndex]);
}
			
personalStats.calculateViewCountBestMonth = function calculateViewCountBestMonth(data) {
	var i, row, lastIndex;
	var highestCount = 0;
	
	for (i = 0; i < data.length; i++) {
	  	row = data[i];
	  	lastIndex = row.length-1;
		if (parseInt(row[lastIndex]) > highestCount) {
			highestCount = row[lastIndex];
		}
	}
	return parseInt(highestCount);
}
		
personalStats.calculateViewCountAllTime = function calculateViewCountAllTime(data) {
	var i, row, lastIndex, currentRowVal;
	var count = 0;
	var start = "";
	var checkStart = true;

	for (i = 0; i < data.length; i++) {
		  	row = data[i];
		  	lastIndex = row.length-1;
		currentRowVal = parseInt(row[lastIndex]);
		count = count + currentRowVal;
		
		// find the first month with data
		if (checkStart == true) {
			start = row[0];
			if (currentRowVal > 0) {
				checkStart = false;
			}
		}
	}

	// Format for viewing after counting is done
	start = personalStats.formatMonthYear(start);
	start = start.replace("-", " 20");
	
	var viewCount = {
		count: count,
		start: start
	}
	
	return viewCount;
}

//====================================================================================
// OVERLAYS

// function to show our overlays
personalStats.showOverlay = function showOverlay(whichoverlay){
    var docHeight = $(document).height(); //grab the height of the page
    var scrollTop = $(window).scrollTop(); //grab the px value from the top of the page to where you're scrolling
    $(".overlay-bg").show().css({"height" : docHeight}); //display your overlay background and set height to the page height
    $(".overlay-"+whichoverlay).show().css({"top": scrollTop+200+"px"}); //show the appropriate overlay and set the content 200px from the window top
}

// function to close our overlays
personalStats.closeOverlay = function closeOverlay(){
    $('.overlay-bg, .overlay-content').hide(); //hide the overlay
}
	  
// hide overlay when user clicks on close button or if user clicks anywhere outside the container
$('.close-btn, .overlay-bg').click(function(){
    personalStats.closeOverlay();
});

// hide the overlay when user presses the esc key
$(document).keyup(function(e) {
    if (e.keyCode == 27) { // if user presses esc key
        personalStats.closeOverlay();
    }
});

//====================================================================================
// UTILITY FUNCTIONS

personalStats.getViewerId = function getViewerId() {
	var viewerHomepage = personalStats.viewerData[FOAF("workplaceHomepage")];
	var viewerUrlParts = viewerHomepage.split("/");
	var viewerId = viewerUrlParts[viewerUrlParts.length-1];
	return viewerId;
}

personalStats.getHostname = function getHostname() {
	var viewerHomepage = personalStats.viewerData[FOAF("workplaceHomepage")];
	var hostname = viewerHomepage.replace(getViewerId(), "").slice(7, -1);
	return hostname;
}

personalStats.fixCountryNames = function fixCountryNames(arr) {
	var idx, item;
	for (idx in arr) {
		item = arr[idx];
		if(item[0] == "Côte d’Ivoire" || item[0] == "Côte d'Ivoire") {
			item[0] = "Cote d'Ivoire";
		}
	}
}

//====================================================================================



