var PERSONALSTATS = (function ($) {

    // Variables
    var moduleName = "PERSONALSTATS";

	// Functions
    function identifyYourself() {
        console.log( "Module Name = " + moduleName );
    }

    // Reveal public pointers to
    // private functions and properties
    return {
        identifyYourself: identifyYourself
    };

})();