import Controller from "../controller"
import { CheckListItem, FolderItem, NoteItem, ToDoItem } from "../models/ModelItems"

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
            const folderObj = FolderItem('folder', _folderCounter(), {name: _folder, items: [], canDelete: false})
            _foldersDB.push(folderObj)
        })
        return
    })

    // --- FOLDERS
    function addFolder(folderName) {
        const folderObj = FolderItem('folder', _folderCounter(), {name: folderName, items: [], canDelete: true})
        _foldersDB.push(folderObj)
        Controller.updateTable('folder')
        return
    }

    function _filterFolder(folderId) {
        let [theItemFolder] = _foldersDB.filter(_folder => _folder.getId() === folderId)
        return theItemFolder
    }

    // --- ITEMS
    function addItemToFolderById(folderId, item) {
        let theItemFolder = _filterFolder(folderId)
        theItemFolder.setItems({items: item})
        return
    }

    function addItem(item) {
        const { type, data } = item
        let itemObj
        switch(type) {
            case 'todo':
                itemObj = ToDoItem('todo', _itemsCounter(), data)
                break
            case 'note':
                itemObj = NoteItem('note', _itemsCounter(), data)
                break
            case 'checklist':
                itemObj = CheckListItem('checklist', _itemsCounter(), data)
                break
        }

        // --- used to check to value of the form to add an item
        //     ~~ If user selects to add item to folder, call function
        //        to do so
        if (data.folderId !== null) {
            addItemToFolderById(data.folderId, itemObj)
        }
        
        _itemsDB.push(itemObj)
        return
    }


    function getFolders() { return _foldersDB }

    function getItemsByFolderId(folderId) {
        let theItemFolder = _filterFolder(folderId)
        return theItemFolder.getItems()
    }

    return {
        init: init,
        addFolder: addFolder,
        addItem: addItem,
        getFolders: getFolders,
        getItemsByFolderId: getItemsByFolderId
    }
})()

export default Database