window.personalStats  = window.personalStats || {};
personalStats.buttons = personalStats.buttons || {};
buttons = personalStats.buttons;

buttons.countryToggle      = $(".geo.date-toggle .toggle-btn input[type=radio]");
buttons.countryMonthButton = buttons.countryToggle.first();
buttons.countryYearButton  = buttons.countryToggle.last();

buttons.domainToggle       = $(".domain.date-toggle .toggle-btn input[type=radio]");
buttons.domainMonthButton  = buttons.domainToggle.first();
buttons.domainYearButton   = buttons.domainToggle.last();

personalStats.buttons.setupToggleButtons = function() {
    console.log("setup toggle buttons");

    $(".toggle-btn input[type=radio]").addClass("visuallyhidden"); // hide the radio button circle on all buttons

    $(".date-toggle .toggle-btn input[type=radio]").change(function() {
        if( $(this).attr("name")) {
            $(this).parent().addClass("success").siblings().removeClass("success")
        } else {
            $(this).parent().toggleClass("success");
        }
    });

    buttons.countryMonthButton.click(function() {
        gadgetEventTrack("country_toggle");
        showViewsByCity(aggregatedByCityLastMonth, "geo-list", onlyShow);
    });

    buttons.countryYearButton.click(function() {
        gadgetEventTrack("country_toggle");
        showViewsByCity(aggregatedByCityLastYear, "geo-list", onlyShow);
    });
    buttons.domainMonthButton.click(function() {
        gadgetEventTrack("domain_toggle");
        showViewsByDomain(aggregatedByDomainLastMonth, "domain-list", onlyShow);
    });

    buttons.domainYearButton.click(function() {
        gadgetEventTrack("domain_toggle");
        showViewsByDomain(aggregatedByDomainLastYear, "domain-list", onlyShow);
    });

    // Turn on the first toggle button for each panel
    buttons.countryMonthButton.parent().addClass("success");
    buttons.domainMonthButton.parent().addClass("success");
}

personalStats.buttons.setupMapButtons = function() {
    console.log("setup map buttons");

    $("#map-world").click(function() {
        gadgetEventTrack("map_world");
        if ($(".geo.date-toggle .toggle-btn input[type=radio]").first().parent().hasClass("success")) {
            drawGeoChart_World(aggregatedByCountryLastMonth);
        } else {
            drawGeoChart_World(aggregatedByCountryLastYear);
        }
        showOverlay("map-world");
    });

    $("#map-usa").click(function() {
        gadgetEventTrack("map_usa");
        if ($(".geo.date-toggle .toggle-btn input[type=radio]").first().parent().hasClass("success")) {
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