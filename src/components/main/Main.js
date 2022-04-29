import StateControl from "../../controller/StateControl"
import Database from "../../data"
import { capitalizeString } from "../../functions"
import { ListItem, Modal, SearchBar } from "../elements"
import FormController from "../forms/FormController"

const Main = (function() {
    let _mainContainer
    let _searchBar
    let _tableContainer
    let _foldersTable
    let _itemsTable
    let _noteFormTable

    function _appendFormToTable() {
        const form = FormController.createForm('note')
        _noteFormTable.appendChild(form.parentContainer)
        return
    }

    // --- Initializes the DOM elements and returns the newly create DOM element
    function _init(data) {
        // - create the elements for the Main DOM element
        _mainContainer  = document.createElement('main')
        _searchBar = SearchBar()
        _tableContainer = document.createElement('div')
        _foldersTable = document.createElement('div')
        _itemsTable = document.createElement('div')
        _noteFormTable = document.createElement('div')
        // - set id's of each DOM element
        _mainContainer.setAttribute('id', 'mainContainer')
        _tableContainer.setAttribute('id', 'tableContainer')
        _foldersTable.setAttribute('id', 'foldersTable')
        _itemsTable.setAttribute('id', 'itemsTable')
        _noteFormTable.setAttribute('id', 'noteFormTable')
        _tableContainer.classList.add('table', 'table-container', 'flex', 'col')
        _foldersTable.classList.add('table', 'folders-table', 'flex', 'col')
        _itemsTable.classList.add('table', 'items-table', 'flex', 'col')
        _noteFormTable.classList.add('table', 'notes-form-table', 'flex', 'col')

        _appendFormToTable()
        
        // - take the data being passed by the Controller where the function chain started
        if (data) {
            data.forEach(folder => {
                const folderName = capitalizeString(folder.getName())
                const dataAttributes = [ { attributeName: 'data-id', attributeValue: folder.getId() }, { attributeName: 'data-type', attributeValue: 'folder' } ]
                const folderData = { elementText: folderName }
                const li = ListItem(dataAttributes, folderData, 'open-folder')
                _foldersTable.appendChild(li)
            })
        }

        // - DEFAULT CLASS NAME: add a class of hidden to the _itemsTable DOM element
        //   to ensure that it is not visible on the screen on initial load
        _itemsTable.classList.add('hidden')
        _noteFormTable.classList.add('hidden')

        // - append the elements
        _tableContainer.appendChild(_foldersTable)
        _tableContainer.appendChild(_itemsTable)
        _tableContainer.appendChild(_noteFormTable)
        _mainContainer.appendChild(_searchBar)
        _mainContainer.appendChild(_tableContainer)
        // - return container
        return _mainContainer
    }

    // --- Generates the folders table and it's data to be displayed on the DOM
    function _loadFoldersTable() {
        _clearTable('folder')

        const data = Database.getFolders()
        data.forEach(folder => {
            const folderName = capitalizeString(folder.getName())
            const dataAttributes = [ { attributeName: 'data-id', attributeValue: folder.getId() }, { attributeName: 'data-type', attributeValue: 'folder' } ]
            const folderData = { elementText: folderName }
            const li = ListItem(dataAttributes, folderData)
            _foldersTable.appendChild(li)
        })
        return
    }
    // --- Generates the items table and it's data to be displayed on the DOM
    function _loadItemsTable() {
        // - clear the itemsTable
        _clearTable('item')

        const activeFolder = StateControl.getFolderState()
        const { name, data } = activeFolder

        // - check if the length of the data is greater then 0
        if (data.length > 0) {
            // TRUE: create table elements to append to the table
            data.forEach(item => {
                const itemName = capitalizeString(item.getName())
                const dataAttributes = [ { attributeName: 'data-id', attributeValue: item.getId() }, { attributeName: 'data-type', attributeValue: 'item' } ]
                const typeAttribute = { attName: 'data-type', attValue: item.getType() }
                const itemData = { elementText: itemName }
                const li = ListItem(dataAttributes, itemData)
                _itemsTable.appendChild(li)
            })
        } else {
            // FALSE: create a message to the user that will prompt them to create a new
            //        item that will assign it's folderId to the currently open folder
            let createItemInFolderMessage = document.createElement('h5')
            createItemInFolderMessage.innerText = `There are no items in ${capitalizeString(name)}. Would you like to create an item?`
            _itemsTable.appendChild(createItemInFolderMessage)
        }
        return
    }
    function _clearTable(table) {
        let theTable
        switch(table) {
            case 'item':
                theTable = _itemsTable
                break
            default:
                theTable = _foldersTable
                break
        }
        while (theTable.children.length > 0) {
            theTable.children[0].remove()
        }
        return
    }
    // --- Generates the notes form table
    function _loadNoteFormTable(data) {
        while (_mainContainer.children.length > 0) {
            _mainContainer.children[0].remove()
        }

        _mainContainer.appendChild(_noteFormTable)

        return _mainContainer
    }

    function _toggleSearchBar(hide) {
        if (hide) {
            _searchBar.style.display = 'none'
        }
        return
    }

    function _loadTable() {
        const activeTableData = StateControl.getActiveTableObj()
        const { tableValue } = StateControl.getTableState()
        if (tableValue === 'folder') {
            return _loadItemsTable(activeTableData)
        } else if (tableValue === 'item') {
            return _loadItemsTable(activeTableData)
        } else if (tableValue === 'home') {
            _clearTable('item')
            return _loadFoldersTable()
        }
    }

    function init(data) { return _init(data) }
    function getMainContainer() { return _mainContainer }
    function getSearchBar() { return _searchBar }
    function getTableContainer() { return _tableContainer }
    function getFoldersTable() { return _foldersTable }
    function getItemsTable() { return _itemsTable }
    function getNoteFormTable() { return _noteFormTable }
    function loadFoldersTable(data) {return _loadFoldersTable(data)}
    function loadItemsTable(data, folderName) { return _loadItemsTable(data, folderName) }
    function loadNoteFormTable(data) { return _loadNoteFormTable(data) }
    function toggleSearchBar(hide) { return _toggleSearchBar(hide) }
    function loadTable() { return _loadTable() }

    return {
        init: init,
        getMainContainer: getMainContainer,
        getSearchBar: getSearchBar,
        getTableContainer: getTableContainer,
        getFoldersTable: getFoldersTable,
        getItemsTable: getItemsTable,
        getNoteFormTable: getNoteFormTable,
        loadFoldersTable: loadFoldersTable,
        loadItemsTable: loadItemsTable,
        loadNoteFormTable: loadNoteFormTable,
        toggleSearchBar: toggleSearchBar,
        loadTable: loadTable
    }
})()

export default Main