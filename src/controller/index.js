import { EditModal } from "../components/elements"
import Footer from "../components/footer/Footer"
import { AddFolderForm, CreateToDoForm } from "../components/forms"
import Header from "../components/header/Header"
import Main from "../components/main/Main"
import Database from "../data"
import { Folders, Items } from "../data/data"
import PageView from "../view"

const Controller = (() => {
    let _state = { folder: {id: null, name: null}, item: {id: null, name: null} }
    let _modalState = { currentModal: null, modalOpen: false }
    let _popUpOpen = false
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
        switch(itemType) {
            case 'folder':
                Database.addFolder(data)
                return
            case 'item':
                console.log("DFSDFSDF")
        }
    }
    // --- Check if exists
    const checkIfFolderExists = (name) => {
        const folder = getFoldersFromDb().filter(folder => {
            const fName = folder.getName()
            return fName.toLowerCase() === name.toLowerCase() && folder
        })
        return folder
    }
    // --- Check if folder can be deleted
    const checkCanDeleteFolder = (folderId) => {
        const [folder] = getFoldersFromDb().filter(folder => {
            return folder.getId() === folderId
        })
        // const canDelete = folder.getCanDelete()
        return folder ? folder.getCanDelete() : true
    }
    // --- Handle form validations before sumbission
    const handleTextInput = (e) => {
        // - change disabled value on submit button if length is greater then 0
        const submitBtn = document.querySelector('.form-submit-button')
        if (e.target.value.length !== 0) {
            const folderExists = checkIfFolderExists(e.target.value)
            if (folderExists.length > 0) {
                console.log('FOLDER EXISTS ALREADY ERROR TO USER TOGGLED HERE')
                submitBtn.setAttribute('disabled', true)
            } else {
                submitBtn.removeAttribute('disabled')
            }
        } else {
            submitBtn.setAttribute('disabled', true)
        }
    }

    // --- DOM HANDLERS --- //
    // --- Handle changing the page titles when a table item
    //     is clicked. If it is a folder that is clicked, the
    //     page title will change to the name of the folder
    const changeHeaderTitle = (action, state, tableAction) => {
        const headerTitle = Header.getHeaderTitle()
        const subHeaderTitle = Header.getSubHeaderTitle()
        if (_popUpOpen) {
            togglePopUp()
        }
        switch(action) {
            case 'open-folder':
                headerTitle.innerText = 'Folders'
                headerTitle.classList.remove('main-title')
                headerTitle.classList.add('back-button')
                headerTitle.setAttribute('data-table-action', tableAction)
                headerTitle.setAttribute('data-value', state.folder.id)
                headerTitle.setAttribute('data-title', state.folder.name)
                subHeaderTitle.classList.remove('hidden')
                subHeaderTitle.classList.add('main-title')
                subHeaderTitle.innerText = state.folder.name
                return
            case 'open-item':
                headerTitle.innerText = state.folder.name
                subHeaderTitle.innerText = state.item.name
                headerTitle.setAttribute('data-table-action', tableAction)
                headerTitle.setAttribute('data-value', state.folder.id)
                headerTitle.setAttribute('data-title', state.folder.name)
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

        if (_popUpOpen) {
            togglePopUp()
        }

        const createFolderButton = document.getElementById('create-folderAction')
        if (_state.folder.name !== null) {
            createFolderButton.classList.toggle('hidden')
            createFolderButton.children[0].removeAttribute('disabled')
        }
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
                createFolderButton.classList.toggle('hidden')
                createFolderButton.children[0].setAttribute('disabled', true)
                toggleEdit('force')
                return
            case 'back-to-folder':
                _state = {folder: {id: null, name: null }, item: {id: null, name: null}}
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
        let value
        let isOpen = !_modalOpen
        _modalOpen = isOpen
        const modalContainer = document.querySelector('.modal-container')
        if (_popUpOpen) {
            togglePopUp()
        }
        // !!! TODO !!!
        
        if (e) {
            value = e.currentTarget.value ? e.currentTarget.value : e.currentTarget.dataset.action ? e.currentTarget.dataset.action : e === 'close' ? 'close' : null
        } else {
            value = 'close'
        }

        if (isOpen) {
            modalContainer.classList.remove('hidden')
        } else {
            while (modalContainer.children.length > 0) {
                modalContainer.children[0].remove()
            }
            modalContainer.classList.add('hidden')
        }

        switch(value) {
            case 'create-folder':
                if (isOpen) {
                    // - toggle the create folder form
                    const addFolderForm = AddFolderForm()
                    modalContainer.appendChild(addFolderForm)
                    return true
                }
            case 'create-todo':
                if (isOpen) {
                    const createToDoForm = CreateToDoForm()
                    modalContainer.appendChild(createToDoForm)
                }
            case 'open-edit-modal':
                if (isOpen) {
                    const editFolderModal = EditModal(e.currentTarget.dataset.tableItemId)
                    modalContainer.appendChild(editFolderModal)
                }
                return
            case 'close':
                while (modalContainer.children.length > 0) {
                    modalContainer.children[0].remove()
                }
                modalContainer.classList.add('hidden')
                return
        }
    }
    // --- Toggle Popup
    const togglePopUp = () => {
        const smallPopUp = Footer.getSmallPopUpMenu()
        if (!_popUpOpen) {
            smallPopUp.classList.remove('hidden')
        } else {
            smallPopUp.classList.add('hidden')
        }
        _popUpOpen = !_popUpOpen
    }
    // --- Toggle Item
    const toggleItem = ({ type, value, title }) => {
        // - change the header title
        console.log("TITLE: " + title)
        _state.item.name = title
        _state.item.id = value
        changeHeaderTitle('open-item', _state, 'folder')
        // !!! TODO !!!
        // COMPLETE THE FUNCTIONS TO OPEN THE EDIT VIEW OF THE SELECTED ITEM
        console.log("OPEN ITEM: " + title)
        console.log("ITEM ID: " + value)
    }
    // --- Toggle Edit
    const toggleEdit = (isChecked) => {
        if (_popUpOpen) {
            togglePopUp()
        }
        const overlay = document.createElement('div')
        const appContainer = document.getElementById('appContainer')
        let cantDeleteItems = document.querySelectorAll('.cant-delete')
        let editContainers = document.querySelectorAll('.edit-icon-container')
        let tableItems = document.querySelectorAll('.table-item')
        let countContainers = document.querySelectorAll('.countBox')

        if (isChecked === true) {
            overlay.classList.add('overlay')
            // appContainer.appendChild(overlay)
            editContainers.forEach(editContainer => editContainer.classList.remove('hidden'))
            countContainers.forEach(editContainer => editContainer.classList.add('hidden'))
            cantDeleteItems.forEach(cantDeleteItem => cantDeleteItem.classList.add('active'))
            console.log("DO STUFF DEPENDING ON WHAT IS BEING EDITED")
        } else {
            _modalOpen = true
            toggleModal()
            editContainers.forEach(editContainer => editContainer.classList.add('hidden'))
            countContainers.forEach(editContainer => editContainer.classList.remove('hidden'))
            cantDeleteItems.forEach(cantDeleteItem => cantDeleteItem.classList.remove('active'))
            if (isChecked === 'force') {
                const checkBox = document.getElementById('editCheckBox')
                checkBox.checked = false
            }
            console.log("TURN OFF EDITING STATE & VIEW")
        }
    }
    // --- Start Item Creation
    const startItemCreation = (e) => {
        const value = e.currentTarget.value
        togglePopUp()
        switch (value) {
            case 'create-todo':
                toggleModal(e)
                console.log("CREATE A TODO")
                return
            case 'create-note':
                console.log("CREATE A NOTE")
                return
            case 'create-checklist':
                console.log("CREATE A CHECKLIST")
                return
        }
    }
    
    return {
        init: init,
        getFolders: getFolders,
        getItems: getItems,
        getItemCountInFolder: getItemCountInFolder,
        handleCreation: handleCreation,
        handleTextInput: handleTextInput,
        checkCanDeleteFolder: checkCanDeleteFolder,
        updateTable: updateTable,
        toggleTable: toggleTable,
        toggleModal: toggleModal,
        togglePopUp: togglePopUp,
        toggleItem: toggleItem,
        toggleEdit: toggleEdit,
        startItemCreation: startItemCreation,
        getFoldersFromDb: getFoldersFromDb
    }
})(PageView)

export default Controller