import Controller from "../../controller"
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'

// --- Returns a div
// --- Params
//          + dataAttribute
//              ~~ attributeName
//              ~~ attributeValue
//          + item data
//              ~~ elementText
//          + controllerFunction: string
const ListItem = (dataAttribute, itemData, controllerFunction) => {
    const { attributeName, attributeValue } = dataAttribute
    const { elementText } = itemData

    const li = document.createElement('div')
    const iconBox = document.createElement('div')
    const textBox = document.createElement('div')
    const countBox = document.createElement('div')

    iconBox.classList.add('small-flex')
    countBox.classList.add('small-flex', 'flex')
    textBox.classList.add('fill-item')

    switch(attributeName) {
        case 'data-folder-id':
            const icon = document.createElement('i')
            const text = document.createElement('p')
            const countText = document.createElement('p')
            const chevron = document.createElement('i')
            icon.classList.add('fa-solid', 'fa-folder', 'yellow')
            chevron.classList.add('fa-solid', 'fa-chevron-right')
            countBox.classList.add('countBox')
            let count = Controller.getItemCountInFolder(attributeValue)
            countText.innerText = count
            iconBox.appendChild(icon)
            textBox.appendChild(text)
            countBox.appendChild(countText)
            countBox.appendChild(chevron)
            li.appendChild(iconBox)
            li.appendChild(countBox)
            break
    }

    li.classList.add('table-item', 'flex')
    li.setAttribute(attributeName, attributeValue)
    textBox.innerText = elementText
    li.appendChild(textBox)
    const editIconsContainer = document.createElement('div')
    editIconsContainer.classList.add('edit-icon-container', 'hidden', 'flex')
    const toggleEditMenuIcon = EditIcon({iconClass: 'fa-ellipsis', tableItemId: attributeValue, actionType: 'open-edit-modal', isYellow: true})
    const dragEditItemIcon = EditIcon({iconClass: 'fa-bars', tableItemId: attributeValue, actionType: 'drag-table-item'})
    li.addEventListener('click', () => {
        switch(controllerFunction) {
            case 'toggle-table':
                Controller.toggleTable({type: 'folder', value: attributeValue, title: elementText})
                break
            case 'toggle-item':
                Controller.toggleItem({type: 'item', value: attributeValue, title: elementText})
                break
        }
    })
    editIconsContainer.appendChild(toggleEditMenuIcon)
    editIconsContainer.appendChild(dragEditItemIcon)
    li.appendChild(editIconsContainer)
    return li
}

const EditIcon = (editObj) => {
    const { iconClass, tableItemId, actionType, isYellow } = editObj
    const editIconContainer = document.createElement('div')
    const editIcon = document.createElement('i')
    editIconContainer.setAttribute('data-table-item-id', tableItemId)
    editIconContainer.classList.add('edit-icon-wrapper')
    editIcon.classList.add('fa-solid', `${iconClass}`, `${isYellow && 'yellow'}`)
    editIconContainer.appendChild(editIcon)
    return editIconContainer
}

const EditCheckBox = () => {
    const checkBox = document.createElement('input')
    checkBox.setAttribute('id', 'editCheckBox')
    checkBox.setAttribute('type', 'checkbox')
    checkBox.addEventListener('click', (e) => {
        Controller.toggleEdit(e.target.checked)
    })
    return checkBox
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

    searchInput.setAttribute('type', 'text')
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

export {ListItem, EditCheckBox, SearchBar, Modal}