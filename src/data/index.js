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
            // const folderObj = DatabaseItem()
            // console.log(folderObj)
            // folderObj.createObj('folder', _folder)

            const folderObj = FolderItem('folder', _folder, {name: _folder, items: [], canDelete: false})
            // folderObj.createDataObj(_folder)
            // folderObj.createObj('folder', _folder, {name: _folder, items: [], canDelete: false})
            // const folderObj = FolderItem('folder', _folder, {name: _folder, items: [], canDelete: false})
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
        return
    }

    function _filterFolder(folderId) {
        let [theItemFolder] = _foldersDB.filter(_folder => _folder.getId() == folderId)
        return theItemFolder
    }

    // --- ITEMS
    function _addItemToFolderById(folderName, item) {
        console.log(item.getName())
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
        if (item.getFolder() !== 'none') {
            _addItemToFolderById(item.getFolder(), item)
        }
        _addItemToAllFolder(item)
        _addItemToDefaultFolder(defaultFormName, item)
        return
    }

    function addItem(item) {
        const { type, data } = item
        const theItemModel = _createItemModelByType(type, data)
        // --- Update the Database and 
        //     Add item to it's folders
        _itemsDB.push(theItemModel)
        _addItemToFolders(theItemModel, data, `${type}s`)
        return
    }

    function _createItemModelByType(type, data) {
        const dataObj = _createDataObjForModel(type, data)
        switch (type) {
            case 'todo':
                return ToDoItem(type, _itemsCounter(), dataObj)
            case 'note':
                return NoteItem(type, _itemsCounter(), dataObj)
            case 'checklist':
                return CheckListItem(type, _itemsCounter(), dataObj)
        }
    }

    function _createDataObjForModel(type, data) {
        let dataObj = {}
        switch (type) {
            case 'todo':
                data.forEach(_dataItem => {
                    const key = _dataItem[0]
                    const value = _dataItem[1]
                    if (key.includes('Name')) {
                        dataObj.name = value
                    }
                    if (key.includes('Note')) {
                        dataObj.todoNote = value
                    }
                    if (key.includes('date')) {
                        dataObj.duedate = value
                    }
                    if (key.includes('time')) {
                        dataObj.duetime = value
                    }
                    if (key.includes('priority')) {
                        dataObj.priority = value
                    }
                    if (key.includes('Folder')) {
                        dataObj.folderId = value
                    }
                })
                break
            case 'note':
                data.forEach(_dataItem => {
                    const key = _dataItem[0]
                    const value = _dataItem[1]
                    if (key.includes('Name')) {
                        dataObj.name = value
                    }
                    if (key.includes('Note')) {
                        dataObj.noteNote = value
                    }
                    if (key.includes('Folder')) {
                        dataObj.folderId = value
                    }
                })
                break
        }
        return dataObj
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
        console.log(folderId)
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