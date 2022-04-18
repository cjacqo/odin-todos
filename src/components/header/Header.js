import Controller from "../../controller"
import { EditCheckBox, SearchBar } from "../elements"

const Header = (function() {
    let _title
    let _headerContainer
    let _headerTitle
    let _subHeaderTitle
    let _editCheckBox
    let _itemsCreated = false

    function _createElements() {
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
    }

    function _handleForwardClasses() {
        _headerTitle.classList.remove('main-title')
        _headerTitle.classList.add('back-button')
        _subHeaderTitle.classList.remove('hidden')
        _subHeaderTitle.classList.add('main-title')
        return
    }

    function _handleBackwardClasses() {
        _subHeaderTitle.classList.remove('main-title')
        _subHeaderTitle.classList.add('hidden')
        _headerTitle.classList.remove('back-button')
        _headerTitle.classList.add('main-title')
    }

    function _removeSubTitleAndEditCheckBox() {
        _subHeaderTitle.remove()
        _editCheckBox.remove()
        return
    }

    function _changeSubTitleToInput(input) {
        _subHeaderTitle = input
        _editCheckBox = EditCheckBox()
        return
    }

    function _changeSubTitleToText() {
        _subHeaderTitle = document.createElement('h6')
        _editCheckBox = EditCheckBox()
        return
    }

    function _appendSubTitleAndEditCheckBox() {
        _headerContainer.appendChild(_subHeaderTitle)
        _headerContainer.appendChild(_editCheckBox)
        return
    }

    function _setTitles(titles) {
        const { header, subHeader } = titles
        _headerTitle.innerText = header
        _subHeaderTitle.innerText = subHeader
    }

    // --- Initializes the DOM elements and returns the newly create DOM element
    function _init() {
        if (!_itemsCreated) {
            _createElements()
            // - set the text of the edit check box
            // _editCheckBox.innerText = 'Edit'
            // - append the child elements to the Header container
            _headerContainer.appendChild(_headerTitle)
            _headerContainer.appendChild(_subHeaderTitle)
            _headerContainer.appendChild(_editCheckBox)
            _itemsCreated = true
        }

        _headerTitle.addEventListener('click', (e) => {
            console.log(e.target.dataset)
            if (e.target.dataset) {
                Controller.toggleTable({type: e.target.dataset.tableAction, value: e.target.dataset.value, title: e.target.dataset.title})
            }
        })
        
        // - return container
        return _headerContainer
    }

    function init() { return _init() }
    function getHeaderContainer() { return _headerContainer }
    function getHeaderTitle() { return _headerTitle }
    function getSubHeaderTitle() { return _subHeaderTitle }
    function getTitle() { return _title }
    function handleClasses(direction) {
        switch (direction) {
            case 0:
                return _handleForwardClasses()
            case 1:
                return _handleBackwardClasses()
        }
    }
    function setTitles(titles) { return _setTitles(titles) }
    function setHeaderTitleAttributes(arr, add) {
        arr.forEach(obj => {
            const { name, value } = obj
            if (add) {
                _headerTitle.setAttribute(`${name}`, `${value}`)
            } else {
                _headerTitle.removeAttribute(`${name}`)
            }
        })
        return
    }
    function changeSubTitleToInput(input) { 
        _removeSubTitleAndEditCheckBox()
        return _changeSubTitleToInput(input) 
    }
    function changeSubTitleToText() {
        _removeSubTitleAndEditCheckBox()
        return _changeSubTitleToText()
    }
    function appendSubTitleAndEditCheckBox() { return _appendSubTitleAndEditCheckBox() }

    return {
        init: init,
        getHeaderContainer: getHeaderContainer,
        getHeaderTitle: getHeaderTitle,
        getSubHeaderTitle: getSubHeaderTitle,
        getTitle: getTitle,
        handleClasses: handleClasses,
        setTitles: setTitles,
        setHeaderTitleAttributes: setHeaderTitleAttributes,
        changeSubTitleToInput: changeSubTitleToInput,
        changeSubTitleToText: changeSubTitleToText,
        appendSubTitleAndEditCheckBox: appendSubTitleAndEditCheckBox
    }
})()

export default Header