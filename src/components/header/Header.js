import Controller from "../../controller"
import { EditCheckBox, SearchBar } from "../elements"

const Header = (function() {
    let _title
    let _headerContainer
    let _headerTitle
    let _subHeaderTitle
    let _editCheckBox
    let _itemsCreated = false
    let _mainHeaderContainer
    let _secondaryHeaderContainer

    function _getTitleElements() {
        const titleElement = document.getElementById('headerTitle')
        const subTitleElement = document.getElementById('subTitle')
        return {titleElement, subTitleElement}
    }

    function _createElements() {
        const titleElement = document.createElement('h4')
        const subTitleElement = document.createElement('h4')
        const editCheckBoxElement = EditCheckBox()
        titleElement.classList.add('main-title')
        titleElement.setAttribute('id', 'headerTitle')
        subTitleElement.setAttribute('id', 'subTitle')

        titleElement.addEventListener('click', (e) => {
            if (e.target.dataset) {
                Controller.controlTableView('back', e)
            }
        })

        _itemsCreated = true
        return {titleElement, subTitleElement, editCheckBoxElement}
    }

    function _createMainHeaderContainer() {
        const elements = _createElements()
        const {titleElement, subTitleElement, editCheckBoxElement} = elements
        const headerContainer = document.createElement('header')
        headerContainer.setAttribute('id', 'headerContainer')
        titleElement.innerText = _title
        headerContainer.appendChild(titleElement)
        headerContainer.appendChild(subTitleElement)
        headerContainer.appendChild(editCheckBoxElement)
        return headerContainer
    }

    function _createSecondaryHeaderContainer() {
        const elements = _createElements()
        const {titleElement, subTitleElement} = elements
        const headerContainer = document.createElement('header')
        headerContainer.setAttribute('id', 'headerContainer')
        headerContainer.appendChild(titleElement)
        headerContainer.appendChild(subTitleElement)
        return headerContainer
    }

    function _handleForwardClasses() {
        const elements = _getTitleElements()
        const { titleElement, subTitleElement } = elements
        titleElement.classList.remove('main-title')
        titleElement.classList.add('back-button')
        subTitleElement.classList.remove('hidden')
        subTitleElement.classList.add('main-title')
        return
    }

    function _handleBackwardClasses() {
        const elements = _getTitleElements()
        const { titleElement, subTitleElement } = elements
        subTitleElement.classList.remove('main-title')
        subTitleElement.classList.add('hidden')
        titleElement.classList.remove('back-button')
        titleElement.classList.add('main-title')
        return
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

    function _appendSubTitleAndEditCheckBox(type, value) {
        _removeSubTitleAndEditCheckBox()
        switch (type) {
            case 'input':
                const test = _changeSubTitleToInput(value)
                break
            default:
                _changeSubTitleToText()
                break
        }
        _headerContainer.appendChild(_subHeaderTitle)
        _headerContainer.appendChild(_editCheckBox)
        return
    }

    function _setTitles(titles) {
        const { header, subHeader } = titles
        const titleElement = document.getElementById('headerTitle')
        const subTitleElement = document.getElementById('subTitle')
        titleElement.innerText = header
        subTitleElement.innerText = subHeader
        return
    }

    // --- Initializes the DOM elements and returns the newly create DOM element
    function _init() {
        _title = 'Folders'
        _mainHeaderContainer = _createMainHeaderContainer()
        _secondaryHeaderContainer = _createSecondaryHeaderContainer()
        return
    }

    function init() { return _init() }
    function getHeaderContainer(headerType) {
        if (!headerType) {
            return _secondaryHeaderContainer
        } else {
            return _mainHeaderContainer
        }
    }
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
        const { titleElement } = _getTitleElements()
        arr.forEach(obj => {
            const { name, value } = obj
            if (add) {
                titleElement.setAttribute(`${name}`, `${value}`)
            } else {
                titleElement.removeAttribute(`${name}`)
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
    function appendSubTitleAndEditCheckBox(type, value) { return _appendSubTitleAndEditCheckBox(type, value) }

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