const Footer = (function() {
    let _footerContainer

    // --- Initializes the DOM elements and returns the newly create DOM element
    function _init() {
        // - create the elements for the Footer DOM element
        _footerContainer = document.createElement('footer')
        _footerContainer.setAttribute('id', 'footerContainer')
        // - return container
        return _footerContainer
    }

    function init() { return _init() }
    function getFooterContainer() { return _footerContainer }
    
    return {
        init: init,
        getFooterContainer: getFooterContainer
    }
})()

export default Footer