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
            const folderObj = FolderItem('folder', _folder, {name: _folder, items: [], canEdit: false, canDelete: false})
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
    // ~ Getter Functions ~
    //      + By ID
    //      + By Name
    function _getItemById(itemId) {
        const item = _itemsDB.find(_item => _item.getId() == itemId)
        return item
    }
    function _getItemByName(itemName) {
        return _itemsDB.find(_item => _item.getName() === itemName)
    }

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
    function _addItemToFolders(item, defaultFormName) {
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
        _addItemToFolders(theItemModel, `${type}s`)
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
                    const { id, value } = _dataItem
                    if (id === 'todoName') {
                        dataObj.name = value
                    }
                    if (id === 'todoNote') {
                        dataObj.todoNote = value
                    }
                    if (id === 'todo-dateControl') {
                        dataObj.duedate = value
                    }
                    if (id === 'todo-timeControl') {
                        dataObj.duetime = value
                    }
                    if (id === 'todo-priorityControl') {
                        dataObj.priority = value
                    }
                    if (id === 'todoFolderSelect') {
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
        dataObj.canEdit = true
        dataObj.canDelete = true
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
        let isString = typeof folderId === 'string'
        let theFolder = _filterFolder(folderId)
        switch (isString) {
            case true:
                if (!theFolder) {
                    folderId = folderId + 's'
                    theFolder = _filterFolder(folderId)
                }
                break
            default:
                break
                
        }
        return theFolder.getItems()
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
    function getItem(searchAttribute, searchValue) {
        switch(searchAttribute) {
            case 'name':
                return _getItemByName(searchValue)
            case 'id':
                return _getItemById(searchValue)
        }
    }
    function getCanEdit(itemType, searchAttribute, searchValue) {
        const item = itemType === 'folder' ? getFolder(searchAttribute, searchValue) : getItem(searchAttribute, searchValue)
        let res = item.getCanEdit() ? item.getCanEdit() : true
        return res
    }
    function getCanDelete(itemType, searchAttribute, searchValue) {
        const item = itemType === 'folder' ? getFolder(searchAttribute, searchValue) : getItem(searchAttribute, searchValue)
        return item.getCanDelete()
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

    function _turnValuesIntoObject(values) {
        let arr = []
        values.forEach(_value => {
            const valueObj = {}
            valueObj.id = _value.id
            valueObj.value = _value.value
            arr.push(valueObj)
        })
        return arr
    }

    function creationHandler(databaseItemType, values) {
        const itemDataArr = _turnValuesIntoObject(values)
        switch(databaseItemType) {
            case 'folder':
                addFolder(itemDataArr[0].value)
                break
            default:
                addItem({type: databaseItemType, data: itemDataArr})
                break
        }
        return
    }

    return {
        init: init,
        getFolder: getFolder,
        addFolder: addFolder,
        getItem: getItem,
        addItem: addItem,
        getFolders: getFolders,
        getFolderNameById: getFolderNameById,
        getFolderItemCountById: getFolderItemCountById,
        getItemNameById: getItemNameById,
        getItemTypeById: getItemTypeById,
        getCanEdit: getCanEdit,
        getCanDelete: getCanDelete,
        getEditableFolders: getEditableFolders,
        getItemsByFolderId: getItemsByFolderId,
        getEntireDB: getEntireDB,
        creationHandler: creationHandler
    }
})()

export default Database