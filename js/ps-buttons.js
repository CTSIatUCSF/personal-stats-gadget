window.personalStats = window.personalStats || { };

personalStats.buttons.setupToggleButtons() {
    // Set up the toggle buttons
    $(".toggle-btn input[type=radio]").addClass("visuallyhidden");                          // hide the radio button circle on all buttons
    $(".see-more-less .toggle-btn input[type=radio]").parent().addClass("visuallyhidden");  // hide all buttons in see-more-less button groups

    $(".date-toggle .toggle-btn input[type=radio]").change(function() {
        if( $(this).attr("name")) {
            $(this).parent().addClass("success").siblings().removeClass("success")
        } else {
            $(this).parent().toggleClass("success");
        }
    });

    $(".see-more-less .toggle-btn input[type=radio]").change(function() {
        if( $(this).attr("name")) {
            $(this).parent().addClass("visuallyhidden").siblings().removeClass("visuallyhidden")
        } else {
            $(this).parent().toggleClass("visuallyhidden");
        }
    });

    $(".geo.date-toggle .toggle-btn input[type=radio]").first().click(function() {
        console.log("country-month selected");
        showViewsByCountry(aggregatedByCountryLastMonth, onlyShow);
        drawGeoChart(aggregatedByCountryLastMonth);
    });

    $(".geo.date-toggle .toggle-btn input[type=radio]").last().click(function() {
        console.log("country-year selected");
        showViewsByCountry(aggregatedByCountryLastYear, onlyShow);
        drawGeoChart(aggregatedByCountryLastYear);
    });
    $(".domain.date-toggle .toggle-btn input[type=radio]").first().click(function() {
        console.log("domain-month selected");
        showViewsByDomain(aggregatedByDomainLastMonth, onlyShow);
    });

    $(".domain.date-toggle .toggle-btn input[type=radio]").last().click(function() {
        console.log("domain-year selected");
        showViewsByDomain(aggregatedByDomainLastYear, onlyShow);
    });

    // Turn on the first toggle button for each panel
    $(".geo.date-toggle .toggle-btn input[type=radio]").first().parent().addClass("success");
    $(".domain.date-toggle .toggle-btn input[type=radio]").first().parent().addClass("success");

    // See All/Fewer (geo) button shows all for Month or Year (based on current selection)
    $(".geo.see-more-less .toggle-btn input[type=radio]").click(function() {

        if ($(this).parent().is(':first-child')) { // See All Button 
            console.log("see all button clicked");
            
            if ($(".geo.date-toggle .toggle-btn input[type=radio]").first().parent().hasClass("success")) {
                console.log("see all button clicked - last month");
                showViewsByCountry(aggregatedByCountryLastMonth);
            } else {
                console.log("see all button clicked - last year");
                showViewsByCountry(aggregatedByCountryLastYear);
            }
        } else { // See Fewer Button
            console.log("see fewer button clicked");
            
            if ($(".geo.date-toggle .toggle-btn input[type=radio]").first().parent().hasClass("success")) {
                console.log("see fewer button clicked - last month");
                showViewsByCountry(aggregatedByCountryLastMonth, onlyShow);
            } else {
                console.log("see fewer button clicked - last year");
                showViewsByCountry(aggregatedByCountryLastYear, onlyShow);
            }
        }
    });

    // See All/Fewer (domain) button shows all for Month or Year (based on current selection)
    $(".domain.see-more-less .toggle-btn input[type=radio]").click(function() {

        if ($(this).parent().is(':first-child')) { // See All Button 
            console.log("see all button clicked");
            
            if ($(".domain.date-toggle .toggle-btn input[type=radio]").first().parent().hasClass("success")) {
                console.log("see all button clicked - last month");
                showViewsByDomain(aggregatedByDomainLastMonth);
            } else {
                console.log("see all button clicked - last year");
                showViewsByDomain(aggregatedByDomainLastYear);
            }
        } else { // See Fewer Button
            console.log("see fewer button clicked");
            
            if ($(".domain.date-toggle .toggle-btn input[type=radio]").first().parent().hasClass("success")) {
                console.log("see fewer button clicked - last month");
                showViewsByDomain(aggregatedByDomainLastMonth, onlyShow);
            } else {
                console.log("see fewer button clicked - last year");
                showViewsByDomain(aggregatedByDomainLastYear, onlyShow);
            }
        }
    });
}