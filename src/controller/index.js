import Header from "../components/header/Header"
import Main from "../components/main/Main"
import Database from "../data"
import { Folders, Items } from "../data/data"
import PageView from "../view"

const Controller = (() => {
    let _state = { folder: '', item: '' }
    let _view = PageView

    // --- INIT --- //
    // --- Starts the app with initial view
    const init = () => { return _view.init(getFoldersFromDb()) }

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
    const changeHeaderTitle = (theCase, folderName) => {
        const headerTitle = Header.getHeaderTitle()
        _state.folder = folderName
        headerTitle.innerText = _state.folder
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
    const toggleTable = (action) => {
        const { type, value, title } = action
        let data
        let visibleTable
        let hiddenTable
        switch(type) {
            case 'folder':
                // - change the header title
                changeHeaderTitle('folder', title)
                visibleTable = Main.getItemsTable()
                hiddenTable = Main.getFoldersTable()
                // - get data
                data = getItemsByFolderId(value)
                // - load the table with the data
                Main.loadItemsTable(data, title)
                break
            case 'home':
                visibleTable = Main.getFoldersTable()
                hiddenTable = Main.getItemsTable()
                break
        }
        visibleTable.classList.toggle('hidden')
        hiddenTable.classList.toggle('hidden')
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
        // !!! TODO !!!
        // COMPLETE THE FUNCTIONS TO OPEN THE EDIT VIEW OF THE SELECTED ITEM
        console.log("OPEN ITEM: " + title)
        console.log("ITEM ID: " + value)
    }

    return {
        init: init,
        getFolders: getFolders,
        getItems: getItems,
        updateTable: updateTable,
        toggleTable: toggleTable,
        toggleModal: toggleModal,
        toggleItem: toggleItem,
        getFoldersFromDb: getFoldersFromDb
    }
})(PageView)

export default Controller