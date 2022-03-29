import { EditModal } from "../components/elements"
import { AddFolderForm } from "../components/forms"
import Header from "../components/header/Header"
import Main from "../components/main/Main"
import Database from "../data"
import { Folders, Items } from "../data/data"
import PageView from "../view"

const Controller = (() => {
    let _state = { folder: {id: null, name: null}, item: {id: null, name: null} }
    let _modalOpen = false
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
    }
    // --- Get count of items in a folder
    const getItemCountInFolder = (folderId) => {
        let _items = Database.getItemsByFolderId(folderId)
        return _items.length
    }
    // --- Create items
    const handleCreation = (itemType, data) => {
        console.log(itemType)
        switch(itemType) {
            case 'folder':
                Database.addFolder(data)
                return
            case 'item':
                console.log("DFSDFSDF")
        }
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
                Main.loadItemsTable(Database.getItemsByFolderId(_state.folder.id))
                return
        }
    }
    // --- Open Edit Modal
    const toggleEditModal = (folderId) => {

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
        let isOpen = !_modalOpen
        _modalOpen = isOpen
        let value

        // @@TEST: Test creating a folder and adding it to the database
        if (e) {
            value = e.currentTarget.value ? e.currentTarget.value : e.currentTarget.dataset.action ? e.currentTarget.dataset.action : 'close'
        } else {
            value = 'close'
        }
        const modalContainer = document.querySelector('.modal-container')

        switch(value) {
            case 'create-folder':
                if (isOpen) {
                    // - toggle the create folder form
                    const addFolderForm = AddFolderForm()
                    modalContainer.appendChild(addFolderForm)
                    modalContainer.classList.toggle('hidden')
                    return true
                } else if (!isOpen) {
                    modalContainer.children[0].remove()
                    modalContainer.classList.toggle('hidden')
                    return false
                }
            case 'create-item':
                if (!isOpen) {

                }
                let folderId = 'all'
                Database.addItem({type: 'note', data: {name: 'Test Note', folderId: folderId}})
                Main.loadFoldersTable(Database.getFolders())
                if (folderId == _state.folder.id) {
                    updateTable('item')
                }
                return
            case 'open-edit-modal':
                if (isOpen) {
                    const editFolderModal = EditModal(e.currentTarget.dataset.tableItemId)
                    modalContainer.appendChild(editFolderModal)
                } else {
                    while (modalContainer.children.length > 0) {
                        modalContainer.children[0].remove()
                    }
                }
                modalContainer.classList.toggle('hidden')
                return
            case 'close':
                while (modalContainer.children.length > 0) {
                    modalContainer.children[0].remove()
                }
                modalContainer.classList.add('hidden')
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
        const overlay = document.createElement('div')
        const appContainer = document.getElementById('appContainer')
        let editContainers = document.querySelectorAll('.edit-icon-container')
        let tableItems = document.querySelectorAll('.table-item')
        let countContainers = document.querySelectorAll('.countBox')

        if (isChecked) {
            overlay.classList.add('overlay')
            // appContainer.appendChild(overlay)
            editContainers.forEach(editContainer => editContainer.classList.remove('hidden'))
            countContainers.forEach(editContainer => editContainer.classList.add('hidden'))
            console.log("DO STUFF DEPENDING ON WHAT IS BEING EDITED")
        } else {
            _modalOpen = true
            toggleModal()
            editContainers.forEach(editContainer => editContainer.classList.add('hidden'))
            countContainers.forEach(editContainer => editContainer.classList.remove('hidden'))
            console.log("TURN OFF EDITING STATE & VIEW")
        }
    }

    
    return {
        init: init,
        getFolders: getFolders,
        getItems: getItems,
        getItemCountInFolder: getItemCountInFolder,
        handleCreation: handleCreation,
        updateTable: updateTable,
        toggleTable: toggleTable,
        toggleModal: toggleModal,
        toggleItem: toggleItem,
        toggleEdit: toggleEdit,
        getFoldersFromDb: getFoldersFromDb
    }
})(PageView)

export default Controller