window.personalStats = window.personalStats || {};
personalStats.buttons = personalStats.buttons || {};

personalStats.buttons.setupToggleButtons = function() {
    // Set up the toggle buttons
    $(".toggle-btn input[type=radio]").addClass("visuallyhidden"); // hide the radio button circle on all buttons

    $(".date-toggle .toggle-btn input[type=radio]").change(function() {
        if( $(this).attr("name")) {
            $(this).parent().addClass("success").siblings().removeClass("success")
        } else {
            $(this).parent().toggleClass("success");
        }
    });

    $(".geo.date-toggle .toggle-btn input[type=radio]").first().click(function() {
        gadgetEventTrack("country_toggle");
        showViewsByCity(aggregatedByCityLastMonth, "geo-list", onlyShow);
    });

    $(".geo.date-toggle .toggle-btn input[type=radio]").last().click(function() {
        gadgetEventTrack("country_toggle");
        showViewsByCity(aggregatedByCityLastYear, "geo-list", onlyShow);
    });
    $(".domain.date-toggle .toggle-btn input[type=radio]").first().click(function() {
        gadgetEventTrack("domain_toggle");
        showViewsByDomain(aggregatedByDomainLastMonth, "domain-list", onlyShow);
    });

    $(".domain.date-toggle .toggle-btn input[type=radio]").last().click(function() {
        gadgetEventTrack("domain_toggle");
        showViewsByDomain(aggregatedByDomainLastYear, "domain-list", onlyShow);
    });

    // Turn on the first toggle button for each panel
    $(".geo.date-toggle .toggle-btn input[type=radio]").first().parent().addClass("success");
    $(".domain.date-toggle .toggle-btn input[type=radio]").first().parent().addClass("success");
}