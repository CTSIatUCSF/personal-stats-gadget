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

	var vccLastYear 		= document.getElementById('view_count_last_year');
	var vccLastYearCount 	= personalStats.calculateViewCountLastYear(personalStats.aggregatedByMonthLastYear);
	vccLastYearCount.count 	= vccLastYearCount.count.toLocaleString(); // adds thousands separators
	vccLastYear.innerHTML 	= firstNameToDisplay + " profile has been viewed " + vccLastYearCount.count + " times since " + vccLastYearCount.start;
	
	var vccThisMonth 		= document.getElementById("view_count_this_month");
	vccThisMonthCount 		= personalStats.calculateViewCountThisMonth(personalStats.aggregatedByMonthAll);
	vccThisMonthCount 		= vccThisMonthCount.toLocaleString(); // adds thousands separators
	vccThisMonth.innerHTML 	= vccThisMonthCount;

	var vccBestMonth 		= document.getElementById("view_count_best_month");
	vccBestMonthCount 		= personalStats.calculateViewCountBestMonth(personalStats.aggregatedByMonthAll);
	vccBestMonthCount 		= vccBestMonthCount.toLocaleString(); // adds thousands separators
	vccBestMonth.innerHTML 	= vccBestMonthCount;

	var vccAllTime 			= document.getElementById("view_count_all_time");
	vccAllTimeCount 		= personalStats.calculateViewCountAllTime(personalStats.aggregatedByMonthAll);
	vccAllTimeCount.count 	= vccAllTimeCount.count.toLocaleString(); // adds thousands separators
	vccAllTime.innerHTML 	= vccAllTimeCount.count;

	var vccAllTimeSince 	= document.getElementById("view_count_all_time_since");
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
		countryCode = personalStats.util.getCountryCode(countryName);
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
	var hostname = personalStats.util.getHostname();

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
		personalStats.aggregatedByMonthLastYear 	= personalStats.aggregateDataByMonth(data.rows, 	personalStats.util.getYearMonthOneYearAgoMonthStart());
		personalStats.aggregatedByCityLastYear 		= personalStats.aggregateDataByCity(data.rows, 		personalStats.util.dateOneYearAgo().yyyymmdd());
		personalStats.aggregatedByCityLastMonth 	= personalStats.aggregateDataByCity(data.rows,		personalStats.util.dateThirtyDaysAgo().yyyymmdd());
		personalStats.aggregatedByStateLastYear 	= personalStats.aggregateDataByState(data.rows, 	personalStats.util.dateOneYearAgo().yyyymmdd());
		personalStats.aggregatedByStateLastMonth 	= personalStats.aggregateDataByState(data.rows, 	personalStats.util.dateThirtyDaysAgo().yyyymmdd());
		personalStats.aggregatedByCountryLastYear 	= personalStats.aggregateDataByCountry(data.rows, 	personalStats.util.dateOneYearAgo().yyyymmdd());
		personalStats.aggregatedByCountryLastMonth 	= personalStats.aggregateDataByCountry(data.rows, 	personalStats.util.dateThirtyDaysAgo().yyyymmdd());
		personalStats.aggregatedByDomainLastYear 	= personalStats.aggregateDataByDomain(data.rows, 	personalStats.util.dateOneYearAgo().yyyymmdd());
		personalStats.aggregatedByDomainLastMonth 	= personalStats.aggregateDataByDomain(data.rows, 	personalStats.util.dateThirtyDaysAgo().yyyymmdd());
		
		personalStats.drawColumnChart(personalStats.aggregatedByMonthLastYear);
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
		dataTableRow[0] = personalStats.util.formatMonthYear(row[0]);
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
	var thisYearMonth = personalStats.util.convertDateToYearMonthString(today);

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

	personalStats.util.fixCountryNames(arrayToReturn);

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

	personalStats.util.fixCountryNames(arrayToReturn);

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
	var viewersPage = "/" + personalStats.util.getViewerId();
      		
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
	start = personalStats.util.formatMonthYear(start);
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
	start = personalStats.util.formatMonthYear(start);
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

// hide the overlay when user presses the esc key
$(document).keyup(function(e) {
    if (e.keyCode == 27) { // if user presses esc key
        personalStats.closeOverlay();
    }
});

//====================================================================================



