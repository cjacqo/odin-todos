import Header from "../components/header/Header"
import Main from "../components/main/Main"
import Database from "../data"
import { Folders, Items } from "../data/data"
import PageView from "../view"

const Controller = (() => {
    let _state = { folder: {id: null, name: null}, item: {id: null, name: null} }
    let _prevState = { folder: null, item: null }
    let _view = PageView

    // --- INIT --- //
    // --- Starts the app with initial view
    const init = () => { return _view.init(getFoldersFromDb(), _state) }

    // --- DATA HANDLERS --- //
    const getFolders = () => { return Folders }
    const getFoldersFromDb = () => { return Database.getFolders()}
    const getItems = () => { return Items}
    // --- Get items by parent folder Id
    const getItemsByFolderId = (folderId) => {
        return Database.getItemsByFolderId(folderId)
        // return Items.filter(item => item.folder_id === folderId)
    }

    // --- DOM HANDLERS --- //
    // --- Handle changing the page titles when a table item
    //     is clicked. If it is a folder that is clicked, the
    //     page title will change to the name of the folder
    const changeHeaderTitle = (action, state, tableAction) => {
        const headerTitle = Header.getHeaderTitle()
        const subHeaderTitle = Header.getSubHeaderTitle()
        headerTitle.removeEventListener('click', changeHeaderTitle)

        switch(action) {
            case 'open-folder':
                headerTitle.innerText = 'Folders'
                headerTitle.classList.remove('main-title')
                headerTitle.classList.add('back-button')
                headerTitle.addEventListener('click', () => {
                    toggleTable({type: tableAction, value: state.folder.id, title: state.folder.title})
                })
                subHeaderTitle.classList.remove('hidden')
                subHeaderTitle.classList.add('main-title')
                subHeaderTitle.innerText = state.folder.name
                return
            case 'open-item':
                headerTitle.innerText = state.folder.name
                subHeaderTitle.innerText = state.item.name
                headerTitle.addEventListener('click', () => {
                    toggleTable({type: tableAction, value: state.folder.id, title: state.folder.name})
                })
                return
            case 'default':
                subHeaderTitle.classList.remove('main-title')
                subHeaderTitle.classList.add('hidden')
                headerTitle.classList.remove('back-button')
                headerTitle.classList.add('main-title')
                subHeaderTitle.innerText = ''
                return
        }
    }
    // --- Update the tables when new data is added
    const updateTable = (tableType) => {
        switch(tableType) {
            case 'folder':
                Main.loadFoldersTable(Database.getFolders())
                return
            case 'item':
                return
        }
    }
    // --- Toggle class names of hidden and visible table based
    //     on user click action
    //          + action { type, value }
    //                     type  = 'folder' or 'home'
    //                     value = folder or item name, or if the user goes back
    const toggleTable = (action, id) => {
        const { type, value, title } = action
        let data
        let visibleTable
        let hiddenTable
        switch(type) {
            case 'folder':
                // - change the header title for opening a folder
                _state.folder.name = title
                _state.folder.id = value
                changeHeaderTitle('open-folder', _state, 'back-to-folder')
                visibleTable = Main.getItemsTable()
                hiddenTable = Main.getFoldersTable()
                // - get data
                data = getItemsByFolderId(_state.folder.id)
                // - load the table with the data
                Main.loadItemsTable(data, title)
                visibleTable.classList.remove('hidden')
                hiddenTable.classList.add('hidden')
                return
            case 'back-to-folder':
                _state = {folder: {id: value, name: title }, item: {id: null, name: null}}
                changeHeaderTitle('default', _state)
                visibleTable = Main.getFoldersTable()
                hiddenTable = Main.getItemsTable()
                visibleTable.classList.remove('hidden')
                hiddenTable.classList.add('hidden')
                return
        }
    }
    // --- Toggle modal
    const toggleModal = (e) => {
        // !!! TODO !!!
        // COMPLETE THE FUNCTIONS TO HANDLE MODAL TOGGLES
        console.log(e.currentTarget.value)

        // @@TEST: Test creating a folder and adding it to the database
        const value = e.currentTarget.value

        switch(value) {
            case 'create-folder':
                Database.addFolder('Test Folder')
                return
            case 'create-item':
                Database.addItem({type: 'note', data: {name: 'Test Note', folderId: 0}})
                return
        }
    }
    // --- Toggle Item
    const toggleItem = ({ type, value, title }) => {
        // - change the header title
        _state.item.name = title
        _state.item.id = value
        console.log(_state)
        changeHeaderTitle('open-item', _state, 'folder')
        // !!! TODO !!!
        // COMPLETE THE FUNCTIONS TO OPEN THE EDIT VIEW OF THE SELECTED ITEM
        console.log("OPEN ITEM: " + title)
        console.log("ITEM ID: " + value)
    }

    // --- Toggle Edit
    const toggleEdit = (isChecked) => {
        let tableItems = Main.getFoldersTable()

        if (isChecked) {
            for (let item of tableItems.children) {
                item.classList.toggle('show-edit-options')
            }
            console.log("DO STUFF DEPENDING ON WHAT IS BEING EDITED")
        } else {
            for (let item of tableItems.children) {
                item.classList.toggle('show-edit-options')
            }
            console.log("TURN OFF EDITING STATE & VIEW")
        }
    }

    
    return {
        init: init,
        getFolders: getFolders,
        getItems: getItems,
        updateTable: updateTable,
        toggleTable: toggleTable,
        toggleModal: toggleModal,
        toggleItem: toggleItem,
        toggleEdit: toggleEdit,
        getFoldersFromDb: getFoldersFromDb
    }
})(PageView)

export default Controller