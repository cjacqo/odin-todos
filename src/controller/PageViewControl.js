import { Modal, EditModal } from "../components/elements"
import Footer from "../components/footer/Footer"
import FormController from "../components/forms/FormController"
import Header from "../components/header/Header"
import Main from "../components/main/Main"
import Database from "../data"
import StateControl from "./StateControl"

const PageViewControl = (() => {
    let _appContainer
    let _header
    let _main
    let _footer
    let _modal

    // --- Initializes the DOM elements of the app and appends to the DOM
    const init = () => {
        _header = Header.init()
        _main = Main.init(Database.getFolders())
        _footer = Footer.init()
        _modal = Modal()
        // - create the parent container for the app
        _appContainer = document.createElement('div')
        _appContainer.classList.add('flex', 'col')
        _appContainer.setAttribute('id', 'appContainer')

        // - append the DOM elements to the app container
        _appContainer.appendChild(_header)
        _appContainer.appendChild(_main)
        _appContainer.appendChild(_footer)
        _appContainer.appendChild(_modal)
        document.body.appendChild(_appContainer)
        return
    }

    // - Manipulate DOM Functions
    function _getFirstStringParam(str) { return str.substring(0, str.indexOf('-')) }
    function _getSecondStringParam(str) { return str.split('-').pop() }
    function _changeModalClassName() {
        const formOpen = StateControl.getFormOpen()
        const { editOpen } = StateControl.getWindowState()
        _modal.removeAttribute('class')
        _modal.classList.add('modal-container')

        if (formOpen && !editOpen) {
            return _modal.classList.add('form-modal')
        } else if (!formOpen && editOpen) {
            return _modal.classList.add('edit-modal')
        } else if (!formOpen && !editOpen) {
            return
        }
    }
    function _changeModalComponent(component) {
        if (_modal.children.length > 0) {
            _modal.children[0].remove()
        }
        _modal.appendChild(component.parentContainer)
        return
    }
    function _clearModal(modalOpen) {
        return setTimeout(() => {
            if (!modalOpen) {
                while (_modal.children.length > 0) {
                    _modal.children[0].remove()
                }
            }
        }, 1000)
    }
    function _togglePopUpMenuClasses(popUpOpen) {
        const popUpMenuContainer = document.getElementById('footerPopUpMenu')
        const popUpMenu = popUpMenuContainer.children[0]
        _toggleVisibilityClasses(popUpMenuContainer, popUpOpen)
        _toggleVisibilityClasses(popUpMenu, popUpOpen)
        return
    }
    function _toggleVisibilityClasses(container, toggled) {
        switch(toggled) {
            case true:
                return container.classList.remove('hidden')
            case false:
                return container.classList.add('hidden')
        }
    }
    function _toggleModal() {
        const isModalOpen = StateControl.getModalState()
        _toggleVisibilityClasses(_modal, isModalOpen)
        _togglePopUpMenuClasses()
        return
    }
    function _getFormElement() {
        const formData = StateControl.getFormState()
        const { name } = formData
        const formElement = FormController.createForm(name)
        return formElement
    }
    function _getEditElement() {
        const { item } = StateControl.getEditItemState()
        const component = {
            parentContainer: EditModal(item.getName())
        }
        return component
    }
    function _openElement(what, value) {
        console.log(what, value)
        switch(what) {
            case 'form':
                if (value == 'folder' || value == 'checklist' || value == 'todo') {
                    _toggleModal()
                    _changeModalComponent(value)
                }
                return
            case 'folder':
                const tablesContainer = document.getElementById('tableContainer')
                const visibleTable = tablesContainer.children[1]
                const hiddenTable = tablesContainer.children[0]
                _toggleVisibilityClasses(visibleTable, true)
                _toggleVisibilityClasses(hiddenTable, false)
                return
            default:
                return
        }
    }
    function _openTable() {
        const { tableValue } = StateControl.getTableState()
        Main.loadTable()
        const foldersTable = Main.getFoldersTable()
        const itemsTable = Main.getItemsTable()
        const activeTable = tableValue === 'folder' ? itemsTable : tableValue === 'item' ? itemsTable : foldersTable
        const inActiveTable = activeTable === foldersTable ? itemsTable : foldersTable
        _toggleVisibilityClasses(activeTable, true)
        _toggleVisibilityClasses(inActiveTable, false)
        return
    }
    function _openItem() {
        const tableState = StateControl.getTableState()
        const itemData = StateControl.getItemState()
        const { tableValue } = tableState 
        if (tableValue === 'item') {
            const { type } = itemData
            _handleDisplayForm(type)
        }
        return
    }
    function _footerActionsHandler(action, what, value) {
        switch(action) {
            case 'open':
                return _openElement(what, value)
            case 'toggle':
                return _togglePopUpMenuClasses()
            default:
                return
        }
    }

    function _handleEditIconsOnTableItem() {
        const isEditOpen = StateControl.getEditState()
        const overlay = document.createElement('div')
        let cantDeleteItems = document.querySelectorAll('.cant-delete')
        let editContainers = document.querySelectorAll('.edit-icon-container')
        let countContainers = document.querySelectorAll('.countBox')
        if (isEditOpen === true) {
            console.log("EDIT ON")
            overlay.classList.add('overlay')
            editContainers.forEach(editContainer => editContainer.classList.remove('hidden'))
            countContainers.forEach(editContainer => editContainer.classList.add('hidden'))
            cantDeleteItems.forEach(cantDeleteItem => cantDeleteItem.classList.add('active'))
        } else {
            editContainers.forEach(editContainer => editContainer.classList.add('hidden'))
            countContainers.forEach(editContainer => editContainer.classList.remove('hidden'))
            cantDeleteItems.forEach(cantDeleteItem => cantDeleteItem.classList.remove('active'))
        }
        return
    }
    function _toggleEditCheckBox(editOpen) { return document.getElementById('editCheckBox').checked = editOpen }
    function _handleEditView(editOpen) {
        const { tableValue } = StateControl.getTableState()
        const { window, item } = StateControl.getEditItemState()

        _toggleEditCheckBox(editOpen)
        _handleEditIconsOnTableItem()
        console.log(window)

        if (editOpen) {
            switch(window) {
                case 'modal':
                    _handleDisplayModal(true)
                    break
            }
            // switch(tableValue) {
            //     case 'home':
            //         if (!item) {
            //         } else {
            //             console.log("OPEN THE ITEM THAT IS BEING EDITED")
            //             if (window === 'modal') {
            //                 _handleDisplayModal(true)
            //             }
            //         }
            //         break
            //     case 'folder':
            //         console.log("OPEN THE EDIT MODAL FOR THE CURRENT OPEN FOLDER")
            //         break
            // }
        }
        return
    }
    function _handleDisplayModal(modalOpen) {
        const isFormOpen = StateControl.getFormOpen()
        if (modalOpen) {
            const element = isFormOpen ? _getFormElement() : _getEditElement()
            _changeModalComponent(element)
        }
        _changeModalClassName()
        _toggleVisibilityClasses(_modal, modalOpen)
        return
    }
    function _handleDisplayForm(formName) {
        switch(formName) {
            case 'folder':
            case 'todo':
            case 'checklist':
                const isModalOpen = StateControl.getModalState()
                return _toggleVisibilityClasses(_modal, !isModalOpen)
        }
    }

    // - Load Data
    function _loadFoldersTable() { return Main.loadFoldersTable(Database.getFolders()) }
    function _loadItemsTable() {
        const folderId = StateControl.getFolderState()
        return
    }

    // - Handler Functions
    function handleChangeTableView(controllerFunction, e) {
        const { folderId, itemId } = e.currentTarget.dataset
        let tableAction
        let id = false
        if (controllerFunction.includes('toggle') || controllerFunction.includes('create')) {
            tableAction = controllerFunction.substring(controllerFunction.indexOf('-') + 1)
            id = tableAction === 'folder' ? folderId : itemId
        } else if (controllerFunction === 'back') {
            tableAction = controllerFunction
        }
        StateControl.handleStateChange(tableAction, id)
        _changeTableView()
        return
    }
    function handleChangeModalView(e) {
        const value = e.currentTarget.value
        const { isToggled } = e.currentTarget.dataset
        const closeModal = (isToggled === 'true')
        StateControl.handleStateChange(value, !closeModal)
        console.log(StateControl.getStateBooleans())
        _toggleModalVisibilityClasses(closeModal)
        _changeModalComponent()
        return
    }
    function handleChangeView(e, handlerValue, f) {
        let _actionValue
        let _changeValue
        let _changeValueType
        setTimeout(() => {
            _clearModal()
        }, 1000)
        switch(f) {
            case 'footer':
                const _value = e.currentTarget.value
                _actionValue = _getSecondStringParam(_value)
                _changeValue = _getFirstStringParam(handlerValue)
                _changeValueType =  _getSecondStringParam(handlerValue)
                console.log(_changeValueType)
                return _footerActionsHandler(_changeValue, _changeValueType, _actionValue)
            case 'open-folder':
            case 'open-item':
            case 'open-table':
                _openTable()
                return
                // const folderId = e
                // const itemId = handlerValue
                // return _openTable(folderId, itemId, _actionValue)
            default:
                return _toggleModal()
        }
    }
    function handleLoadTables(isFolderOpen, folderId) {
        _loadFoldersTable()
        if (isFolderOpen) {
            Header.setTitles({header: 'Folders', subHeader: Database.getFolderNameById(folderId) })
            Header.handleClasses(0)
            Header.setHeaderTitleAttributes([dataTableAction, dataValue, dataTitle], true)
            _updateHeader('open-folder', )
            _loadItemsTable(folderId)
            _openElement('folder', 'items')
        }
        return
    }
    function setWindowView() {
        const { modalOpen, popUpOpen, editOpen } = StateControl.getWindowState()
        _handleDisplayModal(modalOpen)
        _togglePopUpMenuClasses(popUpOpen)
        _handleEditView(editOpen)
        if (!modalOpen && !popUpOpen && !editOpen) {
            _openTable()
            _openItem()
            Header.updateHeader()
        }
        return
    }
    function setEditView() {
        const { editOpen } = StateControl.getWindowState()
        _handleEditView(editOpen)
        console.log(StateControl.getActiveStateProperty())
        return
    }

    return {
        init: init,
        handleChangeTableView: handleChangeTableView,
        handleChangeModalView: handleChangeModalView,
        handleChangeView: handleChangeView,
        handleLoadTables: handleLoadTables,
        setWindowView: setWindowView,
        setEditView: setEditView
    }

})()

export default PageViewControl