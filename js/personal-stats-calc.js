window.personalStats  = window.personalStats || {};
personalStats.calc = personalStats.calc || {};

//====================================================================================
// DATA AGGREGATION

personalStats.calc.aggregateDataByMonth = function aggregateDataByMonth(data, yearMonthStart) {

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

personalStats.calc.aggregateDataByCity = function aggregateDataByCity(data, dateStart) {

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

personalStats.calc.aggregateDataByState = function aggregateDataByState(data, dateStart) {
		
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

personalStats.calc.aggregateDataByCountry = function aggregateDataByCountry(data, dateStart) {
		
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

personalStats.calc.aggregateDataByDomain = function aggregateDataByDomain(data, dateStart) {

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

personalStats.calc.aggregateDataByAlsoViewed = function aggregateDataByAlsoViewed(data, dateStart) {

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

personalStats.calc.calculateViewCountLastYear = function calculateViewCountLastYear(data) {
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
		
personalStats.calc.calculateViewCountThisMonth = function calculateViewCountThisMonth(data) {
	var i, row, lastIndex, views;
	var count = 0;

	var firstRow  = data[0];
	var lastIndex = firstRow.length-1;

	for (i = 0; i < data.length; i++) {
		row = data[i];
		views = parseInt(row[lastIndex]);
		count = count + views;
	}
	return count;
}
			
personalStats.calc.calculateViewCountBestMonth = function calculateViewCountBestMonth(data) {
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
		
personalStats.calc.calculateViewCountAllTime = function calculateViewCountAllTime(data) {
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