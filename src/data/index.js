import Controller from "../controller"
import { CheckListItem, FolderItem, NoteItem, ToDoItem, DatabaseItem } from "../models/ModelItems"

// --- Fake Implementation of generating id's
//     + based on total count of database items ever added
const _uuid = () => {
    let _count = 0
    return () => {
        return _count++
    }
}

const Database = (function() {
    let _folderCounter = _uuid()
    let _itemsCounter = _uuid()
    let _defaultFolders = ['all', 'todos', 'notes', 'checklists']
    let _db
    let _foldersDB = []
    let _itemsDB = []

    const init = (function() {
        _defaultFolders.forEach(_folder => {
            const folderObj = FolderItem('folder', _folder, {name: _folder, items: [], canDelete: false})
            _foldersDB.push(folderObj)
        })
        return
    })

    // --- FOLDERS
    // ~ Getter Functions ~
    //      + By ID
    //      + By Name
    function _getFolderById(folderId) {
        return _foldersDB.find(_folder => _folder.getId() == folderId)
    }
    function _getFolderByName(folderName) {
        return _foldersDB.find(_folder => _folder.getName() === folderName)
    }
    function _getDefaultFolder(defaultFolderName) {
        return _foldersDB.find(_folder => _folder.getId() == defaultFolderName)
    }
    // ~ Create Functions ~
    //      + Add a folder
    function addFolder(folderName) {
        const folderObj = FolderItem('folder', _folderCounter(), {name: folderName, items: [], canDelete: true})
        _foldersDB.push(folderObj)
        Controller.updateTable('folder')
        return
    }

    function _filterFolder(folderId) {
        let [theItemFolder] = _foldersDB.filter(_folder => _folder.getId() == folderId)
        return theItemFolder
    }

    // --- ITEMS
    function _addItemToFolderById(folderName, item) {
        let theItemFolder = _getFolderByName(folderName)
        theItemFolder.setItems({items: item})
        return
    }
    function _addItemToAllFolder(item) {
        let allFolder = _filterFolder('all')
        allFolder.setItems({items: item})
        return
    }
    function _addItemToDefaultFolder(folderName, item) {
        let defaultFolder = _getDefaultFolder(folderName)
        defaultFolder.setItems({items: item})
        return
    }
    function _addItemToFolders(item, data, defaultFormName) {
        data.forEach(_data => {
            if (data[data.length - 1] !== 'none') {
                _addItemToFolderById(value)
            }
        })
        _addItemToAllFolder(item)
        _addItemToDefaultFolder(defaultFormName, item)
        return
    }

    function addItem(item) {
        const { type, data } = item
        const dataObj = Object.fromEntries(data)
        console.log(dataObj)
        let itemObj = DatabaseItem()
        console.log(data)
        itemObj.createObj(type, _itemsCounter(), data)
        // --- Add item to it's default folder, and add each item to All folder
        _addItemToFolders(itemObj, data, `${type}s`)
        _itemsDB.push(itemObj)
        return
    }

    function _getItemFromFolderById(items, itemId) {
        return items.find(item => item.getId() == itemId)
    }


    function getFolders() { return _foldersDB }
    function getFolderItemCountById(folderId) {return _filterFolder(folderId) }
    function getEditableFolders() {
        return _foldersDB.filter(folder => {
            return folder.getCanDelete() === true
        })
    }

    function getItemsByFolderId(folderId) {
        let theItemFolder = _filterFolder(folderId)
        return theItemFolder.getItems()
    }

    function getFolderNameById(folderId) {
        let theItemFolder = _filterFolder(folderId)
        return theItemFolder.getName()
    }

    function getFolder(searchAttribute, searchValue) {
        switch(searchAttribute) {
            case 'name':
                return _getFolderByName(searchValue)
            case 'id':
                return _getFolderById(searchValue)
        }
    }

    function getItemNameById(folderId, itemId) {
        let theItems = getItemsByFolderId(folderId)
        let theItem = _getItemFromFolderById(theItems, itemId)
        return theItem.getName()
    }

    function getItemTypeById(folderId, itemId) {
        let theItems = getItemsByFolderId(folderId)
        let theItem = _getItemFromFolderById(theItems, itemId)
        return theItem.getType()
    }

    function getEntireDB() {
        return _db
    }

    return {
        init: init,
        getFolder: getFolder,
        addFolder: addFolder,
        addItem: addItem,
        getFolders: getFolders,
        getFolderNameById: getFolderNameById,
        getFolderItemCountById: getFolderItemCountById,
        getItemNameById: getItemNameById,
        getItemTypeById: getItemTypeById,
        getEditableFolders: getEditableFolders,
        getItemsByFolderId: getItemsByFolderId,
        getEntireDB: getEntireDB
    }
})()

export default Database