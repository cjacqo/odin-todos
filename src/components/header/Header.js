const Header = (function() {
    let _title
    let _headerContainer
    let _headerTitle
    let _subHeaderTitle

    // --- Initializes the DOM elements and returns the newly create DOM element
    function _init() {
        // - create the parent container and its children elements for the Header
        _headerContainer = document.createElement('header')
        _headerTitle = document.createElement('h4')
        _headerContainer.setAttribute('id', 'headerContainer')
        _headerTitle.setAttribute('id', 'headerTitle')
        _subHeaderTitle = document.createElement('h6')
        // - set the title of the page to the default title on page load
        _title = 'Folders'
        _headerTitle.innerText = _title
        // - append the child elements to the Header container
        _headerContainer.appendChild(_headerTitle)
        // - return container
        return _headerContainer
    }

    function init() { return _init() }
    function getHeaderContainer() { return _headerContainer }
    function getHeaderTitle() { return _headerTitle }
    function getTitle() { return _title }

    return {
        init: init,
        getHeaderContainer: getHeaderContainer,
        getHeaderTitle: getHeaderTitle,
        getTitle: getTitle
    }
})()

export default Header