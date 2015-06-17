window.personalStats  = window.personalStats || {};

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

personalStats.gaBaseQuery = function gaBaseQuery(pagePath) {
	var viewerId = personalStats.getViewerId();
	var pagePath = encodeURIComponent("=~/" + viewerId);

	var earliest_start_date = "2009-12-01"
	var today = new Date().yyyy_mm_dd();

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