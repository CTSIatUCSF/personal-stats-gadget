window.personalStats  = window.personalStats || {};
personalStats.ga = personalStats.ga || {};

personalStats.ga.apiUrl     = "https://www.googleapis.com/analytics/v3/data/ga?";
personalStats.ga.profileId  = 23439892;

//====================================================================================
//GOOGLE ANALYTICS QUERIES 

personalStats.ga.requestParams = function gaRequestParams() {
	var params = {};		
    params[gadgets.io.RequestParameters.CONTENT_TYPE] 		  = gadgets.io.ContentType.TEXT;
    params[gadgets.io.RequestParameters.AUTHORIZATION] 		  = gadgets.io.AuthorizationType.OAUTH2;
    params[gadgets.io.RequestParameters.METHOD]		 		      = gadgets.io.MethodType.GET;
    params[gadgets.io.RequestParameters.OAUTH_SERVICE_NAME] = "googleAPIv3";
    params[gadgets.io.RequestParameters.REFRESH_INTERVAL] 	= "0";
    return params;
}

personalStats.ga.baseQuery = function gaBaseQuery(startDate) {
	var viewerId = personalStats.util.getViewerId();
	var pagePath = encodeURIComponent("=~/" + viewerId);

	var today = new Date().yyyy_mm_dd();

	var query =  {
		'ids': 'ga:' + personalStats.ga.profileId,
    	'metrics': 'ga:uniquePageviews',
        'dimensions': '',
        'filters': 'ga:pagePath' + pagePath,
        'start-date': startDate,
        'end-date': today,
        'samplingLevel': "HIGHER_PRECISION"
    }
    return query;
}

personalStats.ga.convertToQueryString = function convertToQueryString(queryObject) {
	var queryString = "";
	for (var key in queryObject) {
	   if (queryObject.hasOwnProperty(key)) {
	      queryString = queryString + key + "=" + queryObject[key] + "&"; 
	   }
	}
	queryString = queryString.slice(0,-1); // remove the "&" at the end of query_string

	return queryString;
}

personalStats.ga.fetchData = function fetchData(tryCountdown, startDate, successHandler, callback) {
	console.log("tryCountdown:");
  console.log(tryCountdown);
	var query =  personalStats.ga.baseQuery(startDate);
	query.dimensions = "ga:date,ga:country,ga:region,ga:city,ga:networkLocation";

	var query_string = personalStats.ga.convertToQueryString(query);
    var url = personalStats.ga.apiUrl + query_string;
    var params = personalStats.ga.requestParams();

    console.log("fetchData URL:");
    console.log(url);

    gadgets.io.makeRequest(url, function (response) {
      	if (response.oauthApprovalUrl) {
    		console.log("OAuth Approval URL:")
    		console.log(response.oauthApprovalUrl);
      	} else if (response.data) {
      		successHandler(response, callback);
      	} else {
      		personalStats.ga.fetchDataErrorHandler(response, tryCountdown, function() {
      			personalStats.ga.fetchData(tryCountdown, startDate, successHandler, callback);
  			});
      	}
    }, params);
}

personalStats.ga.fetchPagePathData = function fetchPagePathData(tryCountdown, startDate, successHandler, callback) {

	var query =  personalStats.ga.baseQuery(startDate);
	query.dimensions = "ga:date,ga:pagePathLevel1,ga:landingPagePath,ga:secondPagePath,ga:exitPagePath,ga:previousPagePath,ga:nextPagePath";

	var query_string = personalStats.ga.convertToQueryString(query);
    var url = personalStats.ga.apiUrl + query_string;
    var params = personalStats.ga.requestParams();

    gadgets.io.makeRequest(url, function (response) {
    	if (response.oauthApprovalUrl) {
    		console.log("OAuth Approval URL:")
    		console.log(response.oauthApprovalUrl);
        
      	} else if (response.data) {
      		successHandler(response, callback);

      	} else {
      		personalStats.ga.fetchDataErrorHandler(response, tryCountdown, function() {
      			personalStats.ga.fetchPagePathData(tryCountdown, startDate, successHandler, callback);
  			});
      	}
    }, params);
}

personalStats.ga.fetchDataErrorHandler = function fetchDataErrorHandler(response, tryCountdown, retryFunction) {
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

personalStats.ga.gadgetEventTrack = function gadgetEventTrack(action, label, value) {        
	var message = {'action' : action};
	if (label) {message.label = label;}
	if (value) {message.value = value;}
	gadgets.orng.reportGoogleAnalyticsEvent(message);
}

//====================================================================================