import Controller from "../../controller"
import PageViewControl from "../../controller/PageViewControl"
import StateControl from "../../controller/StateControl"
import { EditCheckBox, SearchBar } from "../elements"

const Header = (function() {
    let _title
    let _headerContainer
    let _headerTitle
    let _mainTitleElement
    let _subTitleElement
    let _subHeaderTitle
    let _editCheckBoxElement
    let _editCheckBox

    function _getTitleElements() { return {_mainTitleElement, _subTitleElement} }
    function _createElements() {
        _mainTitleElement = document.createElement('h4')
        _subTitleElement = document.createElement('h4')
        _editCheckBoxElement = EditCheckBox()
        _mainTitleElement.classList.add('main-title')
        _mainTitleElement.setAttribute('id', 'headerTitle')
        _subTitleElement.setAttribute('id', 'subTitle')

        _mainTitleElement.addEventListener('click', (e) => {
            const { tableValue } = StateControl.getTableState()
            if (tableValue !== 'home') {
                _handleStateChange(tableValue)
            }
            return
        })
        return
    }
    function _createContainer() {
        _headerContainer = document.createElement('header')
        _headerContainer.setAttribute('id', 'headerContainer')
        _mainTitleElement.innerText = _title
        _headerContainer.appendChild(_mainTitleElement)
        _headerContainer.appendChild(_subTitleElement)
        _headerContainer.appendChild(_editCheckBoxElement)
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

    function _handleTitles(tableOpen) {
        let titleState
        if (tableOpen === 'home') {
            _mainTitleElement.innerText = 'Folders'
            _subTitleElement.innerText = ''
        } else if (tableOpen === 'folder') {
            titleState = StateControl.getTableFolderState()
            _subTitleElement.innerText = titleState.name
            _mainTitleElement.innerText = 'Folders'
        } else if (tableOpen === 'item') {
            console.log("ITEM CLICKED")
        }
        return
    }

    // --- Initializes the DOM elements and returns the newly create DOM element
    function _init() {
        _title = 'Folders'
        _createElements()
        _createContainer()
        return _headerContainer
    }

    function init() { return _init() }
    function getHeaderTitle() { return _headerTitle }
    function getSubHeaderTitle() { return _subHeaderTitle }
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

    function _addBackClickStyles() { return _mainTitleElement.classList.add('back-click') }
    function _handleStateChange(currentTable) {
        StateControl.clearWindowStates()
        if (currentTable === 'folder') {
            StateControl.resetTableState()
        } else if (currentTable === 'item') {
            const currentFolderId = StateControl.getTableObjIds()
            const data = { id: currentFolderId, type: 'folder'}
            StateControl.setTableState('open', data)
        }
        PageViewControl.setWindowView()
        return
    }
    function _swapMainClass(tableValue) {
        _mainTitleElement.removeAttribute('class')
        if (tableValue !== 'home') {
            _addBackClickStyles()
            _subTitleElement.classList.add('main-title')
        } else if (tableValue === 'home') {
            _subTitleElement.removeAttribute('class')
            _mainTitleElement.classList.add('main-title')
        }
        return
    }
    function updateHeader() {
        const { tableValue } = StateControl.getTableState()
        _handleTitles(tableValue)
        _swapMainClass(tableValue)
        return
    }
    function getTitleElements() { return _getTitleElements() }
    
    return {
        init: init,
        getHeaderTitle: getHeaderTitle,
        getSubHeaderTitle: getSubHeaderTitle,
        setHeaderTitleAttributes: setHeaderTitleAttributes,
        changeSubTitleToInput: changeSubTitleToInput,
        changeSubTitleToText: changeSubTitleToText,
        appendSubTitleAndEditCheckBox: appendSubTitleAndEditCheckBox,
        updateHeader: updateHeader,
        getTitleElements: getTitleElements
    }
})()

export default Header