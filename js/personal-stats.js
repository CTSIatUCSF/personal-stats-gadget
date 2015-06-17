window.personalStats  = window.personalStats || {};


personalStats.populateInstructionsPanel = function (viewerData) {
	var viewerHomePage = viewerData[FOAF("workplaceHomepage")];
	var profilesLoginPage = "http://profiles.ucsf.edu/login/default.aspx?method=login&edit=true";

    $("#instructions-section-one").append("<p>Add <a id=\x22profile_link\x22 href=" + viewerHomePage + ">" + viewerHomePage + "</a> to your email footer, business card and department site.</p>");
    $("#instructions-section-one").append("<p>Add more personalized content (overview, awards, videos) to <a id=\x22add_content\x22 href=" + profilesLoginPage + "> your profile page.</p>");
	$("#instructions-section-one p").addClass("panel-text");

    $("#instructions-section-two").append("<p><a id=\x22add_sections\x22 href=" + profilesLoginPage + ">Add more sections</a> to your page.</p>");
	$("#instructions-section-two p").addClass("panel-text");

	// add click events to track events in google analytics
    $("#profile_link").click(function () {
    	gadgetEventTrack($(this).attr("id"), viewerHomePage);
    });
    $("#add_content").click(function () {
    	gadgetEventTrack($(this).attr("id"));
    });
    $("#add_sections").click(function () {
    	gadgetEventTrack($(this).attr("id"));
    });
}

personalStats.fetchData = function (tryCountdown, callback) {
	var viewerId = getViewerId();
	var pagePath = encodeURIComponent("=~/" + viewerId);

	var earliest_start_date = "2009-12-01"
	var today = new Date().yyyy_mm_dd();

	var query = {
		'ids': 'ga:23439892',
    	'metrics': 'ga:uniquePageviews',
        'dimensions': 'ga:date,ga:country,ga:region,ga:city,ga:networkLocation',
        'filters': 'ga:pagePath' + pagePath,
        'start-date': earliest_start_date,
        'end-date': today
    }

	var query_string = "";
	for (var key in query) {
	   if (query.hasOwnProperty(key)) {
	      query_string = query_string + key + "=" + query[key] + "&"; 
	   }
	}
	query_string = query_string.slice(0,-1); // remove the "&" at the end of query_string

    url = "https://www.googleapis.com/analytics/v3/data/ga?" + query_string;
    
    var params = {};		
    params[gadgets.io.RequestParameters.CONTENT_TYPE] =
      	gadgets.io.ContentType.TEXT;
    params[gadgets.io.RequestParameters.AUTHORIZATION] =
      	gadgets.io.AuthorizationType.OAUTH2;
    params[gadgets.io.RequestParameters.METHOD] =
      	gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.OAUTH_SERVICE_NAME] = "googleAPIv3";
    params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = "0";

    gadgets.io.makeRequest(url, function (response) {
      	if (response.oauthApprovalUrl) {
    		console.log("OAuth Approval URL:")
    		console.log(response.oauthApprovalUrl);
      	} else if (response.data) {
      		fetchDataSuccessHandler(response, callback);
      	} else {
      		fetchDataErrorHandler(response, tryCountdown, function() {
      			fetchData(tryCountdown, callback);
  			});
      	}
    }, params);
}

personalStats.fetchDataSuccessHandler = function (response, callback) {
	var data = JSON.parse(response.data);
	
	 	aggregatedByMonthAll = aggregateDataByMonth(data.rows);
		aggregatedByMonthLastYear = aggregateDataByMonth(data.rows, getYearMonthOneYearAgoMonthStart());
		aggregatedByCityLastYear = aggregateDataByCity(data.rows, dateOneYearAgo().yyyymmdd());
		aggregatedByCityLastMonth = aggregateDataByCity(data.rows, dateThirtyDaysAgo().yyyymmdd());
		aggregatedByStateLastYear = aggregateDataByState(data.rows, dateOneYearAgo().yyyymmdd());
		aggregatedByStateLastMonth = aggregateDataByState(data.rows, dateThirtyDaysAgo().yyyymmdd());
		aggregatedByCountryLastYear = aggregateDataByCountry(data.rows, dateOneYearAgo().yyyymmdd());
		aggregatedByCountryLastMonth = aggregateDataByCountry(data.rows, dateThirtyDaysAgo().yyyymmdd());
		aggregatedByDomainLastYear = aggregateDataByDomain(data.rows, dateOneYearAgo().yyyymmdd());
		aggregatedByDomainLastMonth = aggregateDataByDomain(data.rows, dateThirtyDaysAgo().yyyymmdd());
		
	drawColumnChart(aggregatedByMonthLastYear);
		showVisitorCountStats();

		showViewsByCity(aggregatedByCityLastMonth, "geo-list", 10);
		showViewsByDomain(aggregatedByDomainLastMonth, "domain-list", 10);

		$("#count_area").removeClass("visuallyhidden");
		$("#geo-panel").removeClass("visuallyhidden");
		$("#domain-panel").removeClass("visuallyhidden");
		$("#related-people-panel").removeClass("visuallyhidden");
		$("#instructions-panel").removeClass("visuallyhidden");
		$("#loading").hide();

	callback();
}

fetchDataErrorHandler = function (response, tryCountdown, retryFunction) {
		console.log("Error:")
		console.log(response.rc);
		if (tryCountdown > 0) {
			retryFunction();
		}
		else {
			console.log("Done trying!!!!");
		}
}

fetchPagePathData = function (tryCountdown, callback) {
	var viewerId = getViewerId();
	var pagePath = encodeURIComponent("=~/" + viewerId);

	var earliest_start_date = "2009-12-01"
	var today = new Date().yyyy_mm_dd();

	var query = {
		'ids': 'ga:23439892',
    	'metrics': 'ga:uniquePageviews',
        'dimensions': 'ga:date,ga:pagePathLevel1,ga:landingPagePath,ga:secondPagePath,ga:exitPagePath,ga:previousPagePath,ga:nextPagePath',
		'filters': 'ga:pagePath' + pagePath,
        'start-date': earliest_start_date,
        'end-date': today
    }

	var query_string = "";
	for (var key in query) {
	   if (query.hasOwnProperty(key)) {
	      query_string = query_string + key + "=" + query[key] + "&"; 
	   }
	}
	query_string = query_string.slice(0,-1); // remove the "&" at the end of query_string

    url = "https://www.googleapis.com/analytics/v3/data/ga?" + query_string;
    
    var params = {};		
    params[gadgets.io.RequestParameters.CONTENT_TYPE] =
      	gadgets.io.ContentType.TEXT;
    params[gadgets.io.RequestParameters.AUTHORIZATION] =
      	gadgets.io.AuthorizationType.OAUTH2;
    params[gadgets.io.RequestParameters.METHOD] =
      	gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.OAUTH_SERVICE_NAME] = "googleAPIv3";
    params[gadgets.io.RequestParameters.REFRESH_INTERVAL] = "0";

    gadgets.io.makeRequest(url, function (response) {
    	if (response.oauthApprovalUrl) {
    		console.log("OAuth Approval URL:")
    		console.log(response.oauthApprovalUrl);
        
      	} else if (response.data) {
      		fetchPagePathDataSuccessHandler(response, callback);

      	} else {
      		fetchDataErrorHandler(response, tryCountdown, function() {
      			fetchPagePathData(tryCountdown, callback);
  			});
      	}
    }, params);
}

fetchPagePathDataSuccessHandler = function (response, callback) {	    		
	var data = JSON.parse(response.data);
	aggregatedByAlsoViewed = aggregateDataByAlsoViewed(data.rows);
	showRelatedPeople(aggregatedByAlsoViewed, "related-people-list", 5);
	$("#related-people-panel-content").removeClass("visuallyhidden");
		$("#related-people-loading").hide();

    callback();
}