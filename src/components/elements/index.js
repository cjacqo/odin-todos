import './styles.css'
import Controller from "../../controller"
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import PageViewControl from '../../controller/PageViewControl'
import StateControl from '../../controller/StateControl'
import Database from '../../data'

// --- Returns a div
// --- Params
//          + dataAttribute
//              ~~ attributeName
//              ~~ attributeValue
//          + item data
//              ~~ elementText
//          + controllerFunction: string
const ListItem = (dataAttributes, itemData) => {
    let itemId
    let itemType
    const { elementText } = itemData

    const li = document.createElement('div')
    const iconBox = document.createElement('div')
    const textBox = document.createElement('div')
    const countBox = document.createElement('div')

    dataAttributes.forEach(att => {
        const { attributeName, attributeValue } = att
        li.setAttribute(attributeName, attributeValue)
        if (attributeName === 'data-id') {
            itemId = attributeValue
        } else {
            itemType = attributeValue
        }
    })

    const canDelete = Database.getCanDelete(itemType, 'id', itemId)

    iconBox.classList.add('small-flex')
    countBox.classList.add('small-flex', 'flex')
    textBox.classList.add('fill-item')

    switch(itemType) {
        case 'folder':
            const icon = document.createElement('i')
            const text = document.createElement('p')
            const countText = document.createElement('p')
            const chevron = document.createElement('i')
            icon.classList.add('fa-solid', 'fa-folder', 'yellow')
            chevron.classList.add('fa-solid', 'fa-chevron-right')
            countBox.classList.add('countBox')
            countBox.setAttribute('id', `${itemId}CountBox`)
            let count = Controller.getItemCountInFolder(itemId)
            countText.innerText = count
            iconBox.appendChild(icon)
            textBox.appendChild(text)
            countBox.appendChild(countText)
            countBox.appendChild(chevron)
            li.appendChild(iconBox)
            li.appendChild(countBox)
            break
    }

    li.setAttribute('value', `open-table`)
    li.classList.add('table-item', 'flex')
    if (!canDelete) {
        li.classList.add('cant-delete')
    }
    textBox.innerText = elementText
    li.appendChild(textBox)
    const editIconsContainer = document.createElement('div')
    editIconsContainer.classList.add('edit-icon-container', 'hidden', 'flex')
    const toggleEditMenuIcon = EditIcon({iconClass: 'fa-ellipsis', tableItemId: itemId, actionType: 'open-edit-modal', action: 'modal', isYellow: true, canDelete: canDelete })
    const dragEditItemIcon = EditIcon({iconClass: 'fa-bars', tableItemId: itemId, actionType: 'drag-table-item', action: 'drag', canDelete: canDelete })
    
    li.addEventListener('click', (e) => {
        const data = e.currentTarget.dataset
        const { modalOpen, popUpOpen, editOpen } = StateControl.getWindowState() 
        if (modalOpen || popUpOpen || editOpen) {
            return
        } else {
            StateControl.setTableState('open', data)
            PageViewControl.setWindowView()
        }
    })

    // - run check of database to make sure that edit buttons are not available for default folders
    editIconsContainer.appendChild(toggleEditMenuIcon)
    editIconsContainer.appendChild(dragEditItemIcon)
    li.appendChild(editIconsContainer)
    return li
}

const EditIcon = (editObj) => {
    const { iconClass, tableItemId, actionType, action, isYellow, canDelete } = editObj
    const editIconContainer = document.createElement('div')
    if (canDelete) {
        const editIcon = document.createElement('i')
        editIconContainer.setAttribute('data-table-item-id', tableItemId)
        editIconContainer.setAttribute('data-action', `${actionType}`)
        editIconContainer.classList.add('edit-icon-wrapper')
        editIcon.classList.add('fa-solid', `${iconClass}`, `${isYellow && 'yellow'}`)
    
        editIconContainer.addEventListener('click', (e) => {
            e.stopPropagation()
            e.stopImmediatePropagation()
            const { tableValue } = StateControl.getTableState()
            const windowType = actionType === 'open-edit-modal' ? 'modal' : 'popup'
            StateControl.setEditItem(tableValue, tableItemId, windowType)
            switch(actionType) {
                case 'open-edit-modal':
                    StateControl.setModalState(true)
                    PageViewControl.setEditView()
                    break
                case 'drag-table-item':
                    console.log("DRAG ITEM CLICKED")
                    break
            }
        })
    
        editIconContainer.appendChild(editIcon)
    }
    return editIconContainer
}

const EditCheckBox = () => {
    const checkBox = document.createElement('input')
    checkBox.setAttribute('id', 'editCheckBox')
    checkBox.setAttribute('type', 'checkbox')
    checkBox.addEventListener('click', (e) => {
        StateControl.clearWindowStates()
        StateControl.setEditCheckedState(e.currentTarget.checked)
        PageViewControl.setWindowView()
    })
    return checkBox
}

const EditPopUp = (data) => {
    const editOptionsContainer = document.createElement('div')
    editOptionsContainer.classList.add('edit-options-container')

}

const SearchBar = () => {
    const searchBarContainer = document.createElement('div')
    const magnifyingGlassWrapper = document.createElement('div')
    const searchInputWrapper = document.createElement('div')
    const microphoneWrapper = document.createElement('div')

    searchBarContainer.classList.add('search-bar-container', 'flex')
    magnifyingGlassWrapper.classList.add('search-bar-item-wrapper', 'search-bar-icon-wrapper', 'small-item')
    searchInputWrapper.classList.add('search-bar-item-wrapper', 'search-bar-input-wrapper', 'fill-item')
    microphoneWrapper.classList.add('search-bar-item-wrapper', 'search-bar-icon-wrapper', 'small-item')
    
    const magnifyingGlassIcon = document.createElement('i')
    const searchInput = document.createElement('input')
    const microphoneIcon = document.createElement('i')

    magnifyingGlassIcon.classList.add('fa-solid', 'fa-magnifying-glass')
    searchInput.classList.add('text-input')
    microphoneIcon.classList.add('fa-solid', 'fa-microphone')

    magnifyingGlassIcon.setAttribute('id', 'magnifyingGlassIcon')
    searchInput.setAttribute('id', 'searchInput')
    microphoneIcon.setAttribute('id', 'microphoneIcon')

    searchInput.setAttribute('type', 'search')
    searchInput.setAttribute('name', 'searc-bar-input')
    searchInput.setAttribute('placeholder', 'Search')

    magnifyingGlassWrapper.appendChild(magnifyingGlassIcon)
    searchInputWrapper.appendChild(searchInput)
    microphoneWrapper.appendChild(microphoneIcon)

    searchBarContainer.appendChild(magnifyingGlassWrapper)
    searchBarContainer.appendChild(searchInputWrapper)
    searchBarContainer.appendChild(microphoneWrapper)

    return searchBarContainer
}

const Modal = () => {
    const modalContainer = document.createElement('div')
    modalContainer.classList.add('modal-container', 'hidden')
    return modalContainer
}

const EditModal = (folderName) => {
    const options = [
        { name: 'Share Folder' },
        { name: 'Add Folder' },
        { name: 'Move Folder' },
        { name: 'Rename' },
        { name: 'Delete' },
    ]
    
    const editModal = document.createElement('div')
    const editModalWrapper = document.createElement('div')
    const titleContainer = document.createElement('div')
    const titleText = document.createElement('p')
    const optionsListContainer = document.createElement('div')
    const optionsListWrapper = document.createElement('ul')
    
    editModal.classList.add('edit-options-window-container', 'flex')
    editModalWrapper.classList.add('edit-options-window-wrapper')
    titleContainer.classList.add('edit-options-title-container')
    titleText.classList.add('edit-options-window-title')
    optionsListContainer.classList.add('edit-options-list-container')
    optionsListWrapper.classList.add('edit-options-list-wrapper')
    

    titleText.innerText = folderName
    titleContainer.appendChild(titleText)
    options.map(option => {
        const optionsListItem = document.createElement('li')
        const optionTitleBox = document.createElement('span')
        const optionText = document.createElement('p')
        const optionIconBox = document.createElement('span')
        optionsListItem.classList.add('edit-options-list-item-container')
        optionText.innerText = option.name
        optionTitleBox.appendChild(optionText)
        optionsListItem.appendChild(optionTitleBox)
        optionsListWrapper.appendChild(optionsListItem)
    })
    optionsListContainer.appendChild(optionsListWrapper)

    editModalWrapper.appendChild(titleContainer)
    editModalWrapper.appendChild(optionsListContainer)
    editModal.appendChild(editModalWrapper)

    return editModal
}

const SmallPopUpMenu = () => {
    const buttons = [
        { form: 'todo', window: 'modal', actionFunction: 'footer', action: 'open-form', valueName: 'create-todo', name: 'ToDo' },
        { form: 'note', window: 'page', actionFunction: 'footer', action: 'open-form', valueName: 'create-note', name: 'Note' },
        { form: 'checklist', window: 'modal', actionFunction: 'footer', action: 'open-form', valueName: 'create-checklist', name: 'Checklist' }
    ]
    const container = document.createElement('div')
    container.classList.add('small-popup-menu-container', 'hidden')

    buttons.forEach(button => {
        const btn = document.createElement('button')
        btn.setAttribute('value', button.valueName)
        btn.setAttribute('type', 'button')
        btn.innerText = button.name

        btn.addEventListener('click', (e) => {
            e.preventDefault()
            StateControl.clearWindowStates()
            StateControl.setWindowState(button.window)
            StateControl.setFormState(button.form)
            PageViewControl.setWindowView()
        })
        
        container.appendChild(btn)
    })
    
    return container
}

export {ListItem, EditCheckBox, SearchBar, Modal, EditPopUp, EditModal, SmallPopUpMenu}