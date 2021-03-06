import { EditPopUp } from "../components/elements"
import Footer from "../components/footer/Footer"
// import { AddFolderForm, AddFormToModal, AddNoteFormToModal, CreateToDoForm } from "../components/forms"
import FormController from "../components/forms/FormController"
// import FormController from '../components/forms/index'
import { CurrentCalendar } from "../components/forms/DatePicker/index"
import DateSelector from "../components/forms/inputs/DateSelector"
import Header from "../components/header/Header"
import Main from "../components/main/Main"
import Database from "../data"
import { Folders, Items } from "../data/data"
import { capitalizeString, dateValueToString, getDateAnswerAsString, getDayText, getMonthText, getTodaysDate } from "../functions"
import PageView from "../view"
import StateControl from "./StateControl"
import PageViewControl from "./PageViewControl"

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
    // --- Get the type of the item by the states itemId value
    const getStateItemTypeByItemId = () => {
        const _itemType = Database.getItemTypeById(_state.folder.id, _state.item.id)
        return _itemType
    }
    // --- Create items
    const handleCreation = (itemType, data) => {
        let dataObj
        switch(itemType) {
            // case 'folder':
            //     const folderName = data[0].value
            //     Database.addFolder(folderName)
            //     break
            // case 'todo':
            //     const name = data[0].value
            //     const todoNote = data[1].value
            //     const duedate = data[2].value
            //     const duetime = data[3].value
            //     const priority = data[4].value
            //     const folder = data[5].value
            //     const test = Database.getFolder('name', folder)
            //     console.log(test)
            //     dataObj = {name, todoNote, duedate, duetime, priority}
            //     Database.addItem({type: 'todo', data: dataObj})
            //     break
            case 'item':
                console.log("DFSDFSDF")
        }
        updateFolderCounts()
    }
    // --- Update the Table View with accurate count of database items in each folder
    //     after a database item (folder or item) is created
    const updateFolderCounts = () => {
        let countElements = document.querySelectorAll('.countBox')
        let boxes = []
        let textBox
        countElements.forEach(countBox => {
            const obj = {textBox: countBox.children[0], boxId: countBox.id}
            boxes.push(obj) 
        })
        const folders = Database.getFolders()
        const folderIds = folders.map(folder => {
            const obj = {compareId: folder.getId() + 'CountBox', id: folder.getId()}
            return obj
        })
        folderIds.forEach(folder => {
            const { id, compareId } = folder
            boxes.forEach(box => {
                if (box.boxId === compareId) {
                    textBox = box.textBox
                    const count = Database.getFolderItemCountById(id)
                    textBox.innerText = count.getItemCount()
                }
                return
            })
        })
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
            // const folderExists = checkIfFolderExists(e.target.value)
            submitBtn.removeAttribute('disabled')

            // if (folderExists.length > 0) {
            //     console.log('FOLDER EXISTS ALREADY ERROR TO USER TOGGLED HERE')
            //     submitBtn.setAttribute('disabled', true)
            // } else {
            //     submitBtn.removeAttribute('disabled')
            // }
        } else {
            submitBtn.setAttribute('disabled', true)
        }
    }

    function loadItemsTableData() {
        // const data = getItemsByFolderId(_state.folder.id)
        // Main.loadItemsTable(data, title)
        console.log("SDFSDFS")
        return
    }

    // --- DOM HANDLERS --- //
    // --- Handle changing the page titles when a table item
    //     is clicked. If it is a folder that is clicked, the
    //     page title will change to the name of the folder
    const changeHeaderTitle = (action, state, tableAction) => {
        if (_popUpOpen) {
            togglePopUp()
        }
        const dataTableAction = {name: 'data-table-action', value: tableAction}
        const dataValue = {name: 'data-value', value: state.folder.id}
        const dataTitle = {name: 'data-title', value: tableAction}

        switch(action) {
            case 'open-folder':
            case 'back-to-folder-items':
                Header.setTitles({header: 'Folders', subHeader: state.folder.name})
                Header.handleClasses(0)
                Header.setHeaderTitleAttributes([dataTableAction, dataValue, dataTitle], true)
                return
            case 'open-item':
                Header.setTitles({header: state.folder.name, subHeader: state.item.name})
                Header.setHeaderTitleAttributes([dataTableAction, dataValue, dataTitle], true)
                return
            case 'create-note':
                // Header.setTitles({header: 'Folders', subHeader: state.item.name})
                // if (Header.getSubHeaderTitle() instanceof HTMLHeadingElement) {
                //     Header.appendSubTitleAndEditCheckBox('input', state.item.name)
                // }
                const noteData = Database.getItem(_state.item.id)
                console.log(noteData)
                PageView.loadAddNoteForm()
                // const headerElement = Header.getHeaderContainer(false)
                // console.log(headerElement)
                // const appContainer = document.getElementById('appContainer')
                // appContainer.children[0].remove()
                // appContainer.children[0].appendChild(Header.init('secondary'))
                Header.handleClasses(0)
                Header.setHeaderTitleAttributes([dataTableAction, dataValue, dataTitle], true)
                return
            case 'back-to-folders':
                Header.setTitles({header: 'Folders', subHeader: ''})
                if (Header.getSubHeaderTitle() instanceof HTMLInputElement) {
                    Header.changeSubTitleToText(state.item.name)
                    Header.appendSubTitleAndEditCheckBox()
                }
                Header.handleClasses(1)
                Header.setHeaderTitleAttributes([dataTableAction, dataValue, dataTitle], false)
                return
        }
    }
    // --- Update the tables when new data is added
    const updateTable = (tableType) => {
        return PageView.loadTable(tableType, _state.folder.id)
    }
    const updateDatabaseForTableViews = () => {
        Main.loadFoldersTable(Database.getFolders())
        Main.loadItemsTable(Database.getItems())
    }
    // --- Remove the Main Container Children
    const removeMainContainerChildren = () => {
        const mainContainer = document.getElementById('mainContainer')
        console.log(mainContainer)
        while (mainContainer.children.length > 0) {
            mainContainer.children[0].remove()
        }
        return
    }
    // --- Append Form to Main Container
    const appendToMainContainer = (form) => {
        const mainContainer = document.getElementById('mainContainer')
        mainContainer.appendChild(form)
        return
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

        _handleCreateFolderButtonVisibility(type)

        switch(type) {
            case 'folder':
                // - change the header title for opening a folder
                _state.folder.name = title
                _state.folder.id = value
                changeHeaderTitle('open-folder', _state, 'back-to-folders')
                visibleTable = Main.getItemsTable()
                hiddenTable = Main.getFoldersTable()
                // - get data
                data = getItemsByFolderId(_state.folder.id)
                // - load the table with the data
                Main.loadItemsTable(data, title)
                visibleTable.classList.remove('hidden')
                hiddenTable.classList.add('hidden')
                // createFolderButton.classList.toggle('hidden')
                // createFolderButton.children[0].setAttribute('disabled', true)
                toggleEdit('force')
                return
            case 'back-to-folders':
                removeMainContainerChildren()
                _state = {folder: {id: null, name: null }, item: {id: null, name: null}}
                changeHeaderTitle('open-home', _state)
                const searchBar = Main.getSearchBar()
                const tableContainer = Main.getTableContainer()
                const foldersTable = Main.getFoldersTable()
                const itemsTable = Main.getItemsTable()
                visibleTable = foldersTable
                hiddenTable = itemsTable
                visibleTable.classList.remove('hidden')
                hiddenTable.classList.add('hidden')
                tableContainer.appendChild(foldersTable)
                tableContainer.appendChild(itemsTable)
                appendToMainContainer(searchBar)
                appendToMainContainer(tableContainer)
                return
            case 'item':
                _state.folder.name = title
                if (value === 'create-note') {
                    removeMainContainerChildren()
                    const formControlObj = FormController.createForm('note')
                    const { form, inputs } = formControlObj
                    visibleTable = form
                    if (!title) {
                        hiddenTable = Main.getFoldersTable()
                    }
                    const [subTitleInput] = inputs[0]
                    _state.item.name = subTitleInput
                    changeHeaderTitle(value, _state, 'back-to-folders')
                    visibleTable.classList.remove('hidden')
                    hiddenTable.classList.add('hidden')
                    appendToMainContainer(visibleTable)
                }
                return
        }
    }
    // --- Toggle Item
    const toggleItem = ({ type, value, title, itemType }) => {
        // - change the header title
        console.log("TITLE: " + title)
        _state.item.name = title
        _state.item.id = value
        changeHeaderTitle('open-item', _state, 'folder')
        // !!! TODO !!!
        // COMPLETE THE FUNCTIONS TO OPEN THE EDIT VIEW OF THE SELECTED ITEM
        console.log("OPEN ITEM: " + title)
        console.log("ITEM ID: " + value)
        console.log("ITEM TYPE: " + itemType)
    }
    // --- Toggle modal
    const toggleModal = (e, type) => {
        let value
        let isOpen = !_modalOpen
        _modalOpen = isOpen
        const modalContainer = document.querySelector('.modal-container')
        PageView.toggleModalVisibilityClasses()
        PageView.toggleSmallPopUpMenuVisibilityClasses(_popUpOpen)
        if (_popUpOpen) {
            togglePopUp()
        }
        
        if (e) {
            value = e.currentTarget.value ? e.currentTarget.value : e.currentTarget.dataset.action ? e.currentTarget.dataset.action : e === 'close' ? 'close' : null
        } else {
            value = 'close'
        }

        // if (isOpen) {
        //     modalContainer.classList.remove('hidden')
        // } else {
        //     while (modalContainer.children.length > 0) {
        //         modalContainer.children[0].remove()
        //     }
        //     modalContainer.classList.add('hidden')
        // }

        switch(value) {
            case 'create-folder':
                if (isOpen) {
                    const createFolderForm = FormController.createForm('folder')
                    modalContainer.appendChild(createFolderForm.parentContainer)
                    return true
                }
            case 'create-todo':
                if (isOpen) {
                    const createToDoForm = FormController.createForm('todo')
                    modalContainer.appendChild(createToDoForm.parentContainer)
                }
                return
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
    const togglePopUp = (open) => {
        // const smallPopUp = Footer.getSmallPopUpMenu()
        // if (open) {
        //     smallPopUp.classList.remove('hidden')
        //     smallPopUp.children[0].classList.remove('hidden')
        // } else {
        //     smallPopUp.classList.add('hidden')
        //     smallPopUp.children[0].classList.add('hidden')
        // }
        _popUpOpen = !_popUpOpen
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
        let value = e.currentTarget.value
        if (e) {
            value = e.currentTarget.value ? e.currentTarget.value : e.currentTarget.dataset.action ? e.currentTarget.dataset.action : e === 'close' ? 'close' : null
        } else {
            value = 'close'
        }
        switch (value) {
            case 'create-folder':
                PageView.controlFormView(value)
                // PageView.toggleModalVisibilityClasses(e)
                // toggleModal(e)
                return
            case 'create-item':
                PageView.toggleSmallPopUpMenuVisibilityClasses()
                return
        }
    }
    // --- Controll What Form gets Appended and How
    const controlFormView = (e) => {
        const value = e.currentTarget.value
        PageView.controlFormView(value)
        // switch (value) {
        //     case 'create-todo':
        //         PageView.toggleSmallPopUpMenuVisibilityClasses(true)

        //         toggleModal(e)
        //         return
        //     case 'create-note':
        //         _changeTableView({type: 'note', value: 'create-note', title: null})
        //         return
        //     case 'create-checklist':
        //         console.log("CREATE A CHECKLIST")
        //         return
        // }
    }
    // --- Change the View of the Table
    const _changeTableView = (_action) => {
        const { type, value, title } = _action
        const FOLDERSTABLE = Main.getFoldersTable()
        const ITEMSTABLE = Main.getItemsTable()
        const NOTEFORMTABLE = Main.getNoteFormTable()
        let data
        let visibleTable
        let hiddenTable
        let hiddenFormTable = NOTEFORMTABLE
        console.log(_action)

        function toggleVisibleTableClasses() {
            visibleTable.classList.remove('hidden')
            hiddenTable.classList.add('hidden')
            hiddenFormTable.classList.add('hidden')
            return
        }

        function toggleNoteFormVisibility() {
            visibleTable.classList.remove('hidden')
            hiddenFormTable.classList.add('hidden')
            Main.toggleSearchBar(true)
            return
        }

        function loadItemsTableData() {
            data = getItemsByFolderId(_state.folder.id)
            Main.loadItemsTable(data, _state.folder.id)
            return
        }

        if (_popUpOpen) {
            togglePopUp()
        }

        _handleCreateFolderButtonVisibility(type)
        changeHeaderTitle(value, _state, _getSecondaryAction(value))

        switch (value) {
            case 'open-folder':
            case 'back-to-folder-items':
                visibleTable = ITEMSTABLE
                hiddenTable = FOLDERSTABLE
                loadItemsTableData()
                toggleVisibleTableClasses()
                toggleEdit('force')
                return
            case 'open-item':
                // DETERMINE THE TYPE OF ITEM TO DECIDE WHAT VIEW TO OPEN
                visibleTable = FOLDERSTABLE
                hiddenTable = ITEMSTABLE
                const theItem = Database.getItem('id', _state.item.id)
                // _changeTableView({type: theItem.getType(), value})
                // PageView.loadItemViewFromItemType(itemType, _state.item.id)
                toggleNoteFormVisibility()
                return
            case 'back-to-folders':
                visibleTable = FOLDERSTABLE
                hiddenTable = ITEMSTABLE
                toggleVisibleTableClasses()
                return
            case 'create-note':
                visibleTable = NOTEFORMTABLE
                hiddenTable = ITEMSTABLE
                hiddenFormTable = FOLDERSTABLE
                console.log("HSFDSDF")
                toggleNoteFormVisibility()
                return
        }
        return
    }
    // --- Control The View of the Table When a Table List Item is Clicked
    const controlTableView = (controllerFunction, e) => {
        // const test = StateControl.getFolder()
        // console.log(test)
        const { folderId, itemId } = e.currentTarget.dataset
        switch (controllerFunction) {
            case 'toggle-folder':
                _updateState(controllerFunction, folderId)
                _changeTableView({type: 'folder', value: 'open-folder'})
                break
            case 'toggle-item':
                console.log("START CONTROL TABLE VIEW")
                _updateState(controllerFunction, itemId)
                _changeTableView({type: 'item', value: 'open-item'})
                break
            case 'back':
                const { tableAction } = e.currentTarget.dataset
                if (tableAction === 'back-to-folders') {
                    _updateState(tableAction, false)
                    _updateState('item', false)
                    const itemType = getStateItemTypeByItemId()
                    _changeTableView({type: 'folder', value: tableAction})
                } else if (tableAction === 'back-to-folder-items') {
                    _updateState('folder', _state.folder.id)
                    _updateState('item', false)
                    _changeTableView({type: 'item', value: 'open-folder'})
                }
                break
        }
        return
    }
    // --- Handle State Update
    const _updateState = (stateType, stateValue) => {
        if (stateType.includes('folder')) {
            if (stateValue) {
                _state.folder.name = capitalizeString(Database.getFolderNameById(stateValue))
                _state.folder.id = stateValue
            } else {
                _state.folder.name = null
                _state.folder.id = null
            }
        }
        if (stateType.includes('item')) {
            if (stateValue) {
                _state.item.name = capitalizeString(Database.getItemNameById(_state.folder.id, stateValue))
                _state.item.id = stateValue
            } else {
                _state.item.name = null
                _state.item.id = null
            }
        }
        return
    }
    // --- Handle State Reset
    const _resetState = (stateType) => {
        if (stateType.includes('folders')) {
            _state.folder.name = null
            _state.folder.id = null
            return
        }
    }
    // --- Get Secondary Action
    const _getSecondaryAction = (previousAction) => {
        return previousAction === 'open-folder' ? 'back-to-folders' : previousAction === 'open-item' ? 'back-to-folder-items' : ''
    }
    // --- Handle Visibility of CREATE FOLDER button
    const _handleCreateFolderButtonVisibility = () => {
        const createFolderButton = document.getElementById('create-folderAction')
        if (_state.folder.name !== null) {
            createFolderButton.classList.add('hidden')
            createFolderButton.children[0].setAttribute('disabled', true)
        } else {
            createFolderButton.classList.remove('hidden')
            createFolderButton.children[0].removeAttribute('disabled')
        }
        return
    }
    // --- Toggle Question Visibility
    const updateQuestionAnswerDisplay = (element, value, isHidden) => {
        if (isHidden && !value) {
            element.classList.remove('active')
        } else if (!isHidden && !element.classList.contains('active')) {
            element.classList.add('active')
        }

        if (value) {
            element.innerText = value.string
        } else {
            element.innerText = ''
        }
    }
    const toggleQuestionVisibility = (questionId, answerValue, isActive) => {
        let questionElement
        let answerElement
        let isHidden
        let theValue
        let hiddenInput

        switch(questionId) {
            case 'todo-dateToggle':
                questionElement = document.getElementById('todoDueDateInput')
                answerElement = document.getElementById('todo-dateAnswerDisplay')
                hiddenInput = document.getElementById('dateHiddenInput')
                break
            case 'todo-timeToggle':
                questionElement = document.getElementById('todoDueTimeInput')
                questionElement.classList.toggle('hidden')
                break
        }

        if (isActive) {
            questionElement.classList.toggle('hidden')
            isHidden = false
            if (answerValue && typeof answerValue === 'string') {
                answerValue = reformatDateValue(answerValue)
            } else {
                handleStyleOfDateSelection(false, 1)
            }
            theValue = getDateAsObj(answerValue)
            updateQuestionAnswerDisplay(answerElement, theValue, isHidden)
        }

        if (!isActive) {
            if (!questionElement.classList.contains('hidden')) {
                handleStyleOfDateSelection()
                questionElement.classList.add('hidden')
            }
            console.log("HIII")
            isHidden = true
            hiddenInput.removeAttribute('value')
            updateQuestionAnswerDisplay(answerElement, null, isHidden)
            CurrentCalendar.setCalendarObj(getTodaysDate().monthNumber, getTodaysDate().year)
            CurrentCalendar.getCalendarView(true)
        }
        return
    }
    // --- Set the styles of the selected date
    const handleStyleOfDateSelection = (elementData, x) => {
        const calendarDateElements = document.querySelectorAll('.calendar-day-option')
        calendarDateElements.forEach(calendarDate => {
            const dateData = calendarDate.dataset.dateOfWeek
            if (elementData) {
                if (calendarDate.classList.contains('active') && dateData == elementData) {
                    return
                } else if (calendarDate.classList.contains('active') && dateData !== elementData) {
                    calendarDate.classList.remove('active')
                } else if (dateData == elementData && !calendarDate.classList.contains('active')){
                    calendarDate.classList.add('active')
                }
            } else if (!elementData) {
                if (calendarDate.dataset.dateOfWeek == x) {
                    calendarDate.classList.add('active')
                } else {
                    calendarDate.classList.remove('active')
                }
            }
        })
        return
    }
    // --- Day of Week Selection from DatePicker
    const handleDayOfWeekSelection = (dateSelected, monthIndex) => {
        const today = new Date()
        const yesterday = new Date()
        const tomorrow = new Date()
        yesterday.setDate(today.getDate() - 1)
        tomorrow.setDate(today.getDate() + 1)
        const dateInput = document.getElementById('dateHiddenInput')
        const answerElement = document.getElementById('todo-dateAnswerDisplay')

        const theValue = getDateAsObj(dateSelected)
        monthIndex++

        let monthValue = monthIndex < 10 ? '0' + monthIndex : monthIndex
        let dayValue = theValue.date < 10 ? '0' + theValue.date : theValue.date
        dateInput.setAttribute('value', theValue.year + '-' + monthValue  + '-' + dayValue)

        updateQuestionAnswerDisplay(answerElement, theValue, false)
        return theValue
    }
    const getDateAsObj = (dateSelected) => {
        const today = new Date()
        const yesterday = new Date()
        const tomorrow = new Date()
        yesterday.setDate(today.getDate() - 1)
        tomorrow.setDate(today.getDate() + 1)

        let selectedDayOfWeek
        let selectedMonth
        let selectedDayOfMonth
        let selectedYear
        let answerString
        
        if (dateSelected) {
            let theValue = typeof dateSelected === 'string' ? new Date(dateSelected) : dateSelected
            selectedDayOfWeek = getDayText(theValue.getDay())
            selectedMonth = getMonthText(theValue.getMonth())
            selectedDayOfMonth = theValue.getDate()
            selectedYear = theValue.getFullYear()

            if (theValue.toDateString() === today.toDateString()) {
                answerString = 'Today'
            } else if (theValue.toDateString() === yesterday.toDateString()) {
                answerString = 'Yesterday'
            } else if (theValue.toDateString() === tomorrow.toDateString()) {
                answerString = 'Tomorrow'
            } else {
                answerString = `${selectedDayOfWeek}, ${selectedMonth} ${selectedDayOfMonth}, ${selectedYear}`
            }
        } else if (!dateSelected) {
            selectedDayOfWeek = getDayText(today.getDay())
            selectedMonth = getMonthText(today.getMonth())
            selectedDayOfMonth = today.getDate()
            selectedYear = today.getFullYear()
            answerString = `Today`
        }
        
        let answerObj = {
            day: selectedDayOfWeek,
            month: selectedMonth,
            date: selectedDayOfMonth,
            year: selectedYear,
            string: answerString
        }

        return answerObj
    }
    const reformatDateValue = (dateSelected) => {
        const year = dateSelected.substring(0, 4)
        const month = dateSelected.substring(5, 7)
        const day = dateSelected.substring(8, 10)
        return month + '-' + day + '-' + year
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
        toggleQuestionVisibility: toggleQuestionVisibility,
        startItemCreation: startItemCreation,
        controlFormView: controlFormView,
        controlTableView: controlTableView,
        handleStyleOfDateSelection: handleStyleOfDateSelection,
        handleDayOfWeekSelection: handleDayOfWeekSelection,
        getFoldersFromDb: getFoldersFromDb
    }
})(PageView)

export default Controller