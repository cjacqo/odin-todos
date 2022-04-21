import Header from "../components/header/Header"
import Main from "../components/main/Main"
import Footer from "../components/footer/Footer"
import { Modal } from "../components/elements"
import FormController from "../components/forms/FormController"
import Database from "../data"

const PageView = (() => {
    let _appContainer
    let _header
    let _main
    let _footer
    let _modal
    let _hideModal = true
    let _hideForm = true
    let _popUpOpen
    let _formComponent

    function _clearAppContainer() {
        while (_appContainer.children.length > 0) {
            _appContainer.children[0].remove()
        }
        return
    }

    function _clearParentContainer(parentContainer) {
        while (parentContainer.children.length > 0) {
            parentContainer.children[0].remove()
        }
        return
    }

    function _getFormComponent(formType) {
        switch(formType) {
            case 'create-folder':
                return FormController.createForm('folder')
            case 'create-todo':
                return FormController.createForm('todo')
            case 'create-note':
                return FormController.createForm('note')
        }
    }

    function _appendFormToModal() {
        _clearParentContainer(_modal)
        _modal.appendChild(_formComponent.parentContainer)
        console.log(_modal)
        return
    }

    function loadItemViewFromItemType(itemType, itemId) {
        switch(itemType) {
            case 'todo':

                console.log("LOAD THE TODO FOLDER AND POPULATE VALUES")
                return
            case 'note':
                return
            case 'checklist':
                return
        }
    }
    
    const loadAddNoteForm = (data) => {
        _clearAppContainer()
        _header = Header.getHeaderContainer(false)
        _main = Main.loadNoteFormTable()
        console.log(_main)
        // _main = Main.getNoteFormTable()

        // - append the DOM elements to the app container
        _appContainer.appendChild(_header)
        _appContainer.appendChild(_main)
        _appContainer.appendChild(_footer)
        _appContainer.appendChild(_modal)
    }

    // --- Initializes the DOM elements of the app and appends to the DOM
    const init = (data, state) => {
        Header.init()
        _main = Main
        _footer = Footer
        _modal = Modal()
        // - create the parent container for the app
        _appContainer = document.createElement('div')
        _appContainer.classList.add('flex', 'col')
        _appContainer.setAttribute('id', 'appContainer')

        // - initialize the DOM elements for each section and pass data where
        //   needed
        _header = Header.getHeaderContainer(true)
        _main = _main.init(data)
        _footer = _footer.init()
        _modal = Modal()

        // - append the DOM elements to the app container
        _appContainer.appendChild(_header)
        _appContainer.appendChild(_main)
        _appContainer.appendChild(_footer)
        _appContainer.appendChild(_modal)
        document.body.appendChild(_appContainer)
    }

    function toggleModalVisibilityClasses() {
        if (!_hideModal) {
            _modal.classList.remove('hidden')
            _appendFormToModal()
        } else {
            _modal.classList.add('hidden')
            _clearParentContainer(_modal)
        }
        return
    }

    function toggleSmallPopUpMenuVisibilityClasses(popUpOpen) {
        const smallPopUp = Footer.getSmallPopUpMenu()
        _popUpOpen = popUpOpen !== undefined ? popUpOpen : !_popUpOpen
        if (_popUpOpen) {
            smallPopUp.classList.remove('hidden')
            smallPopUp.children[0].classList.remove('hidden')
        } else {
            smallPopUp.classList.add('hidden')
            smallPopUp.children[0].classList.add('hidden')
        }
        return
    }

    function controlFormView(value) {
        _formComponent = _getFormComponent(value)
        switch(value) {
            case 'create-folder':
            case 'create-todo':
            case 'create-checklist':
                _hideModal = !_hideModal
                toggleModalVisibilityClasses(value)
                break
            case 'create-note':
                break
        }
        return
    }
    function handleViewAfterFormSubmission() {
        _formComponent = null
        _hideModal = true
        toggleSmallPopUpMenuVisibilityClasses(false)
        return toggleModalVisibilityClasses()
    }
    function handleViewAfterCancel() {
        _formComponent = null
        _hideModal = true
        return toggleModalVisibilityClasses()
    }

    function updateTableElements() {

    }

    function loadTable(tableType, folderId) {
        Main.loadFoldersTable(Database.getFolders())
        if (folderId !== null) {
            Main.loadItemsTable(Database.getItemsByFolderId(folderId))
        }
        return
    }

    return {
        init: init,
        loadAddNoteForm: loadAddNoteForm,
        loadItemViewFromItemType: loadItemViewFromItemType,
        toggleModalVisibilityClasses: toggleModalVisibilityClasses,
        toggleSmallPopUpMenuVisibilityClasses: toggleSmallPopUpMenuVisibilityClasses,
        controlFormView: controlFormView,
        handleViewAfterFormSubmission: handleViewAfterFormSubmission,
        handleViewAfterCancel: handleViewAfterCancel,
        updateTableElements: updateTableElements,
        loadTable: loadTable
    }
})()

export default PageView