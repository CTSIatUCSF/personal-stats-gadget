window.personalStats  = window.personalStats || {};
personalStats.buttons = personalStats.buttons || {};

personalStats.buttons.setButtonVariables = function() {

    personalStats.buttons.geoToggle         = $(".geo.date-toggle .toggle-btn input[type=radio]");
    personalStats.buttons.geoMonthButton    = personalStats.buttons.geoToggle.first();
    personalStats.buttons.geoYearButton     = personalStats.buttons.geoToggle.last();

    personalStats.buttons.domainToggle      = $(".domain.date-toggle .toggle-btn input[type=radio]");
    personalStats.buttons.domainMonthButton = personalStats.buttons.domainToggle.first();
    personalStats.buttons.domainYearButton  = personalStats.buttons.domainToggle.last();

    personalStats.buttons.mapWorldButton    = $("#map-world");
    personalStats.buttons.mapUsaButton      = $("#map-usa");
}

personalStats.buttons.toggleButtonActive = function($button) {
    if($button.parent().hasClass("success")) {
        return true;
    }
    return false;
}

personalStats.buttons.setupToggleButtons = function() {
    console.log("setup toggle buttons");

    personalStats.buttons.setButtonVariables();

    $(".toggle-btn input[type=radio]").addClass("visuallyhidden"); // hide the radio button circle on all buttons

    $(".date-toggle .toggle-btn input[type=radio]").change(function() {
        if( $(this).attr("name")) {
            $(this).parent().addClass("success").siblings().removeClass("success")
        } else {
            $(this).parent().toggleClass("success");
        }
    });

    // setup click events
    personalStats.buttons.geoToggle.first().click(function() {
        gadgetEventTrack("country_toggle");
        showViewsByCity(aggregatedByCityLastMonth, "geo-list", onlyShow);
    });

    personalStats.buttons.geoToggle.last().click(function() {
        gadgetEventTrack("country_toggle");
        showViewsByCity(aggregatedByCityLastYear, "geo-list", onlyShow);
    });
    personalStats.buttons.domainMonthButton.click(function() {
        gadgetEventTrack("domain_toggle");
        showViewsByDomain(aggregatedByDomainLastMonth, "domain-list", onlyShow);
    });

    personalStats.buttons.domainYearButton.click(function() {
        gadgetEventTrack("domain_toggle");
        showViewsByDomain(aggregatedByDomainLastYear, "domain-list", onlyShow);
    });

    // Turn on the first toggle button for each panel
    personalStats.buttons.geoMonthButton.parent().addClass("success");
    personalStats.buttons.domainMonthButton.parent().addClass("success");
}

personalStats.buttons.setupMapButtons = function() {
    console.log("setup map buttons");

    personalStats.buttons.setButtonVariables();

    personalStats.buttons.mapWorldButton.click(function() {
        gadgetEventTrack("map_world");
        if (personalStats.buttons.toggleButtonActive(geoMonthButton) {
            drawGeoChart_World(aggregatedByCountryLastMonth);
        } else {
            drawGeoChart_World(aggregatedByCountryLastYear);
        }
        showOverlay("map-world");
    });

    personalStats.buttons.mapUsaButton.click(function() {
        gadgetEventTrack("map_usa");
        if (personalStats.buttons.toggleButtonActive(geoMonthButton) {
            drawGeoChart_USA(aggregatedByStateLastMonth);
        } else {
            drawGeoChart_USA(aggregatedByStateLastYear);
        }
        showOverlay("map-usa");
    });
}

personalStats.buttons.setupSeeAllButtons = function() {
    console.log("setup see all buttons");

    // See All (geo) button shows all for Month or Year (based on current selection)
    $(".geo.show-all.toggle-btn").click(function() {
        gadgetEventTrack("country_see_all");
        if ($(".geo.date-toggle .toggle-btn input[type=radio]").first().parent().hasClass("success")) {
            showViewsByCity(aggregatedByCityLastMonth, "geo-list-all");
        } else {
            showViewsByCity(aggregatedByCityLastYear, "geo-list-all");
        }
        showOverlay("geo-list");
    });

    // See All (domain) button shows all for Month or Year (based on current selection)
    $(".domain.show-all.toggle-btn").click(function() {
        gadgetEventTrack("domain_see_all");
        if ($(".domanin.date-toggle .toggle-btn input[type=radio]").first().parent().hasClass("success")) {
            showViewsByDomain(aggregatedByDomainLastMonth, "domain-list-all");
        } else {
            showViewsByDomain(aggregatedByDomainLastYear, "domain-list-all");
        }
        showOverlay("domain-list");
    });

    // See All (related people) button shows all
    $(".related-people.show-all.toggle-btn").click(function() {
        gadgetEventTrack("related_people_see_all");
        showRelatedPeople(aggregatedByAlsoViewed, "related-people-list-all");
        showOverlay("related-people-list");
    });
}