import { EditCheckBox } from "../elements"

const Header = (function() {
    let _title
    let _headerContainer
    let _headerTitle
    let _subHeaderTitle
    let _editCheckBox

    // --- Initializes the DOM elements and returns the newly create DOM element
    function _init() {
        // - create the parent container and its children elements for the Header
        _headerContainer = document.createElement('header')
        _headerTitle = document.createElement('h4')
        _subHeaderTitle = document.createElement('h6')
        _editCheckBox = EditCheckBox()

        _headerContainer.setAttribute('id', 'headerContainer')
        _headerTitle.setAttribute('id', 'headerTitle')
        _subHeaderTitle.setAttribute('id', 'subTitle')
        _headerTitle.classList.add('main-title')
        _subHeaderTitle.classList.add('hidden')
        // - set the title of the page to the default title on page load
        _title = 'Folders'
        _headerTitle.innerText = _title
        // - set the text of the edit check box
        // _editCheckBox.innerText = 'Edit'
        // - append the child elements to the Header container
        _headerContainer.appendChild(_headerTitle)
        _headerContainer.appendChild(_subHeaderTitle)
        _headerContainer.appendChild(_editCheckBox)
        // - return container
        return _headerContainer
    }

    function init() { return _init() }
    function getHeaderContainer() { return _headerContainer }
    function getHeaderTitle() { return _headerTitle }
    function getSubHeaderTitle() { return _subHeaderTitle }
    function getTitle() { return _title }

    return {
        init: init,
        getHeaderContainer: getHeaderContainer,
        getHeaderTitle: getHeaderTitle,
        getSubHeaderTitle: getSubHeaderTitle,
        getTitle: getTitle
    }
})()

export default Header