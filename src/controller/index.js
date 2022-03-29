import Header from "../components/header/Header"
import Main from "../components/main/Main"
import Database from "../data"
import { Folders, Items } from "../data/data"
import PageView from "../view"

const Controller = (() => {
    let _state = { folder: null, item: null }
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
    const changeHeaderTitle = (action, state) => {
        const headerTitle = Header.getHeaderTitle()
        const subHeaderTitle = Header.getSubHeaderTitle()

        switch(action) {
            case 'open-folder':
                headerTitle.innerText = 'Folders'
                headerTitle.classList.remove('main-title')
                headerTitle.classList.add('back-button')
                if (_state.folder) {
                    headerTitle.removeEventListener('click', changeHeaderTitle())
                    _state = { folder: state.folder, item: null }
                    headerTitle.addEventListener('click', () => {
                        changeHeaderTitle('default', state)
                    })
                }
                subHeaderTitle.classList.remove('hidden')
                subHeaderTitle.classList.add('main-title')
                subHeaderTitle.innerText = state.folder
                break
            case 'open-item':
                headerTitle.innerText = state.folder
                subHeaderTitle.innerText = state.item
                headerTitle.removeEventListener('click', changeHeaderTitle())
                headerTitle.addEventListener('click', () => {
                    changeHeaderTitle('open-folder', state)
                })
                break
            case 'default':
                console.log(_state)
                subHeaderTitle.classList.remove('main-title')
                subHeaderTitle.classList.add('hidden')
                headerTitle.classList.remove('back-button')
                headerTitle.classList.add('main-title')
                headerTitle.removeEventListener('click', changeHeaderTitle())
                subHeaderTitle.innerText = ''
                break
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
    const toggleTable = (action) => {
        const { type, value, title } = action
        let data
        let visibleTable
        let hiddenTable
        switch(type) {
            case 'folder':
                // - change the header title for opening a folder
                _state.folder = title
                changeHeaderTitle('open-folder', _state)
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
        // - change the header title
        _state.item = title
        changeHeaderTitle('open-item', _state)
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