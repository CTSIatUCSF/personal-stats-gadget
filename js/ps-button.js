var PERSONALSTATS.Button = (function ($) {

    // Variables
    var name;

    // Functions
    function setName(nameToSet) {
        name = nameToSet;
    }

    function getName() {
        return name;
    }

    function click() {
        console.log( "Button " + name + " was clicked!" );
    }

    // Reveal public pointers to
    // private functions and properties
    return {
        setName: setName,
        getName: getName,
        click:   buttonClicked
    };
 
})();