window.personalStats  = window.personalStats || {};
personalStats.buttons = personalStats.buttons || {};

personalStats.buttons.setButtonVariables = function() {

    personalStats.buttons.geoToggle                 = $(".geo.date-toggle .toggle-btn input[type=radio]");
    personalStats.buttons.geoMonthButton            = personalStats.buttons.geoToggle.first();
    personalStats.buttons.geoYearButton             = personalStats.buttons.geoToggle.last();

    personalStats.buttons.domainToggle              = $(".domain.date-toggle .toggle-btn input[type=radio]");
    personalStats.buttons.domainMonthButton         = personalStats.buttons.domainToggle.first();
    personalStats.buttons.domainYearButton          = personalStats.buttons.domainToggle.last();

    personalStats.buttons.mapWorldButton            = $("#map-world");
    personalStats.buttons.mapUsaButton              = $("#map-usa");

    personalStats.buttons.geoSeeAllButton           = $(".geo.show-all.toggle-btn");
    personalStats.buttons.domainSeeAllButton        = $(".domain.show-all.toggle-btn");
    personalStats.buttons.relatedPeopleSeeAllButton = $(".related-people.show-all.toggle-btn");
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
        personalStats.gadgetEventTrack("country_toggle");
        personalStats.showViewsByCity(aggregatedByCityLastMonth, "geo-list", personalStats.onlyShow);
    });

    personalStats.buttons.geoToggle.last().click(function() {
        personalStats.gadgetEventTrack("country_toggle");
        personalStats.showViewsByCity(aggregatedByCityLastYear, "geo-list", personalStats.onlyShow);
    });
    personalStats.buttons.domainMonthButton.click(function() {
        personalStats.gadgetEventTrack("domain_toggle");
        personalStats.showViewsByDomain(aggregatedByDomainLastMonth, "domain-list", personalStats.onlyShow);
    });

    personalStats.buttons.domainYearButton.click(function() {
        personalStats.gadgetEventTrack("domain_toggle");
        personalStats.showViewsByDomain(aggregatedByDomainLastYear, "domain-list", personalStats.onlyShow);
    });

    // Turn on the first toggle button for each panel
    personalStats.buttons.geoMonthButton.parent().addClass("success");
    personalStats.buttons.domainMonthButton.parent().addClass("success");
}

personalStats.buttons.setupMapButtons = function() {
    console.log("setup map buttons");

    personalStats.buttons.setButtonVariables();

    personalStats.buttons.mapWorldButton.click(function() {
        personalStats.gadgetEventTrack("map_world");
        if (personalStats.buttons.toggleButtonActive(personalStats.buttons.geoMonthButton)) {
            personalStats.drawGeoChart_World(personalStats.aggregatedByCountryLastMonth);
        } else {
            personalStats.drawGeoChart_World(personalStats.aggregatedByCountryLastYear);
        }
        personalStats.showOverlay("map-world");
    });

    personalStats.buttons.mapUsaButton.click(function() {
        personalStats.gadgetEventTrack("map_usa");
        if (personalStats.buttons.toggleButtonActive(personalStats.buttons.geoMonthButton)) {
            personalStats.drawGeoChart_USA(personalStats.aggregatedByStateLastMonth);
        } else {
            personalStats.drawGeoChart_USA(personalStats.aggregatedByStateLastYear);
        }
        personalStats.showOverlay("map-usa");
    });
}

personalStats.buttons.setupSeeAllButtons = function() {
    console.log("setup see all buttons");

    personalStats.buttons.setButtonVariables();

    // See All (geo) button shows all for Month or Year (based on current selection)
    personalStats.buttons.geoSeeAllButton.click(function() {
        personalStats.gadgetEventTrack("country_see_all");
        if (personalStats.buttons.toggleButtonActive(personalStats.buttons.geoMonthButton)) {
            personalStats.showViewsByCity(personalStats.aggregatedByCityLastMonth, "geo-list-all");
        } else {
            personalStats.showViewsByCity(personalStats.aggregatedByCityLastYear, "geo-list-all");
        }
        personalStats.showOverlay("geo-list");
    });

    // See All (domain) button shows all for Month or Year (based on current selection)
    personalStats.buttons.domainSeeAllButton.click(function() {
        personalStats.gadgetEventTrack("domain_see_all");
        if (personalStats.buttons.toggleButtonActive(personalStats.buttons.domainMonthButton)) {
            personalStats.showViewsByDomain(personalStats.aggregatedByDomainLastMonth, "domain-list-all");
        } else {
            personalStats.showViewsByDomain(personalStats.aggregatedByDomainLastYear, "domain-list-all");
        }
        personalStats.showOverlay("domain-list");
    });

    // See All (related people) button shows all
    personalStats.buttons.relatedPeopleSeeAllButton.click(function() {
        personalStats.gadgetEventTrack("related_people_see_all");
        personalStats.showRelatedPeople(personalStats.aggregatedByAlsoViewed, "related-people-list-all");
        personalStats.showOverlay("related-people-list");
    });
}