import Controller from "../../controller"
import { capitalizeString } from "../../functions"
import { ListItem, Modal, SearchBar } from "../elements"

const Main = (function() {
    let _mainContainer
    let _searchBar
    let _tableContainer
    let _foldersTable
    let _itemsTable

    // --- Initializes the DOM elements and returns the newly create DOM element
    function _init(data) {
        // - create the elements for the Main DOM element
        _mainContainer  = document.createElement('main')
        _searchBar = SearchBar()
        _tableContainer = document.createElement('div')
        _foldersTable = document.createElement('div')
        _itemsTable = document.createElement('div')
        // - set id's of each DOM element
        _mainContainer.setAttribute('id', 'mainContainer')
        _tableContainer.setAttribute('id', 'tableContainer')
        _foldersTable.setAttribute('id', 'foldersTable')
        _itemsTable.setAttribute('id', 'itemsTable')
        _tableContainer.classList.add('table-container', 'flex', 'col')
        _foldersTable.classList.add('folders-table', 'flex', 'col')
        _itemsTable.classList.add('items-table', 'flex', 'col')

        // - take the data being passed by the Controller where the function chain started
        data.forEach(folder => {
            const folderName = capitalizeString(folder.getName())
            const dataAttribute = { attributeName: 'data-folder-id', attributeValue: folder.getId() }
            const folderData = { elementText: folderName }
            const li = ListItem(dataAttribute, folderData, 'toggle-folder')
            _foldersTable.appendChild(li)
        })

        // - DEFAULT CLASS NAME: add a class of hidden to the _itemsTable DOM element
        //   to ensure that it is not visible on the screen on initial load
        _itemsTable.classList.add('hidden')

        // - append the elements
        _tableContainer.appendChild(_foldersTable)
        _tableContainer.appendChild(_itemsTable)
        _mainContainer.appendChild(_searchBar)
        _mainContainer.appendChild(_tableContainer)
        // - return container
        return _mainContainer
    }

    // --- Generates the folders table and it's data to be displayed on the DOM
    function _loadFoldersTable(data) {
        while (_foldersTable.children.length > 0) {
            _foldersTable.children[0].remove()
        }

        data.forEach(folder => {
            const folderName = capitalizeString(folder.getName())
            const dataAttribute = { attributeName: 'data-folder-id', attributeValue: folder.getId() }
            const folderData = { elementText: folderName }
            const li = ListItem(dataAttribute, folderData, 'toggle-folder')
            _foldersTable.appendChild(li)
        })
        return
    }
    // --- Generates the items table and it's data to be displayed on the DOM
    function _loadItemsTable(data, folderName) {
        // - clear the itemsTable
        while (_itemsTable.children.length > 0) {
            _itemsTable.children[0].remove()
        }

        // - check if the length of the data is greater then 0
        if (data.length > 0) {
            // TRUE: create table elements to append to the table
            data.forEach(item => {
                const itemName = capitalizeString(item.getName())
                const dataAttribute = { attributeName: 'data-item-id', attributeValue: item.getId() }
                const typeAttribute = { attName: 'data-type', attValue: item.getType() }
                const itemData = { elementText: itemName }
                const li = ListItem(dataAttribute, itemData, 'toggle-item', typeAttribute)
                _itemsTable.appendChild(li)
            })
        } else {
            // FALSE: create a message to the user that will prompt them to create a new
            //        item that will assign it's folderId to the currently open folder
            let createItemInFolderMessage = document.createElement('h5')
            createItemInFolderMessage.innerText = `There are no items in ${folderName}. Would you like to create an item?`
            _itemsTable.appendChild(createItemInFolderMessage)
        }
        return
    }

    function _updateCountOfFolderItems() {
        
    }

    function init(data) { return _init(data) }
    function getMainContainer() { return _mainContainer }
    function getSearchBar() { return _searchBar }
    function getTableContainer() { return _tableContainer }
    function getFoldersTable() { return _foldersTable }
    function getItemsTable() { return _itemsTable }
    function loadFoldersTable(data) {return _loadFoldersTable(data)}
    function loadItemsTable(data, folderName) { return _loadItemsTable(data, folderName) }

    return {
        init: init,
        getMainContainer: getMainContainer,
        getSearchBar: getSearchBar,
        getTableContainer: getTableContainer,
        getFoldersTable: getFoldersTable,
        getItemsTable: getItemsTable,
        loadFoldersTable: loadFoldersTable,
        loadItemsTable: loadItemsTable
    }
})()

export default Main