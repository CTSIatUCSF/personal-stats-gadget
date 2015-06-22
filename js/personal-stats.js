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

	var lastYear 	= personalStats.calc.calculateViewCountLastYear(personalStats.aggregatedByMonthLastYear);
	lastYear.count 	= lastYear.count.toLocaleString(); // adds thousands separators
	$("#view_count_last_year").append(firstNameToDisplay + " profile has been viewed " + lastYear.count + " times since " + lastYear.start);
	
	var thisMonth 	= personalStats.calc.calculateViewCountThisMonth(personalStats.aggregatedByMonthAll);
	thisMonth 		= thisMonth.toLocaleString(); // adds thousands separators
	$("#view_count_this_month").append(thisMonth);

	var bestMonth 		= personalStats.calc.calculateViewCountBestMonth(personalStats.aggregatedByMonthAll);
	bestMonth 			= bestMonth.toLocaleString(); // adds thousands separators
	$("#view_count_best_month").append(bestMonth);

	var allTime 			= personalStats.calc.calculateViewCountAllTime(personalStats.aggregatedByMonthAll);
	allTime.count 			= allTime.count.toLocaleString(); // adds thousands separators
	$("#view_count_all_time").append(allTime.count);
	$("#view_count_all_time_since").append("Since " + allTime.start + "*");
}

personalStats.showViewsByCity = function showViewsByCity(data, tableToUpdateID, onlyShowN) {
	var dataToShow, index, item, countryName, countryCode, regionName, cityName, geoString, count;

	$("#" + tableToUpdateID + " tr").remove(); //Remove any existing rows before adding new ones

	// filter out data that we don't want to display
	if (onlyShowN > 0) {
		dataToShow = data.slice(0, onlyShowN);
		if (data.length > dataToShow.length) {
			personalStats.buttons.geoSeeAllButton.removeClass("visuallyhidden"); //Unhide the See All button 
		} else {
			dataToShow = data;
			personalStats.buttons.geoSeeAllButton.addClass("visuallyhidden"); //Hide the See All button 
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
		$("#" + tableToUpdateID).append("<tr><td><img src=" + ENV_STATS_PATH + "/images/flag_icons/"+ countryCode + ".gif></img></td><td>" + geoString + "</td><td>" + count + "</td></tr>");
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
			personalStats.buttons.domainSeeAllButton.removeClass("visuallyhidden"); //Unhide the See All button 
		} else {
			dataToShow = data;
			personalStats.buttons.domainSeeAllButton.addClass("visuallyhidden"); //Hide the See All button 
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
			personalStats.buttons.relatedPeopleSeeAllButton.removeClass("visuallyhidden"); //Unhide the See All button 
		} else {
			dataToShow = data;
			personalStats.buttons.relatedPeopleSeeAllButton.addClass("visuallyhidden"); //Hide the See All button 
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
	
	 	personalStats.aggregatedByMonthAll 			= personalStats.calc.aggregateDataByMonth(data.rows);
		personalStats.aggregatedByMonthLastYear 	= personalStats.calc.aggregateDataByMonth(data.rows, 	personalStats.util.getYearMonthOneYearAgoMonthStart());
		personalStats.aggregatedByCityLastYear 		= personalStats.calc.aggregateDataByCity(data.rows, 		personalStats.util.dateOneYearAgo().yyyymmdd());
		personalStats.aggregatedByCityLastMonth 	= personalStats.calc.aggregateDataByCity(data.rows,		personalStats.util.dateThirtyDaysAgo().yyyymmdd());
		personalStats.aggregatedByStateLastYear 	= personalStats.calc.aggregateDataByState(data.rows, 	personalStats.util.dateOneYearAgo().yyyymmdd());
		personalStats.aggregatedByStateLastMonth 	= personalStats.calc.aggregateDataByState(data.rows, 	personalStats.util.dateThirtyDaysAgo().yyyymmdd());
		personalStats.aggregatedByCountryLastYear 	= personalStats.calc.aggregateDataByCountry(data.rows, 	personalStats.util.dateOneYearAgo().yyyymmdd());
		personalStats.aggregatedByCountryLastMonth 	= personalStats.calc.aggregateDataByCountry(data.rows, 	personalStats.util.dateThirtyDaysAgo().yyyymmdd());
		personalStats.aggregatedByDomainLastYear 	= personalStats.calc.aggregateDataByDomain(data.rows, 	personalStats.util.dateOneYearAgo().yyyymmdd());
		personalStats.aggregatedByDomainLastMonth 	= personalStats.calc.aggregateDataByDomain(data.rows, 	personalStats.util.dateThirtyDaysAgo().yyyymmdd());
		
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
	personalStats.aggregatedByAlsoViewed = personalStats.calc.aggregateDataByAlsoViewed(data.rows);
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



