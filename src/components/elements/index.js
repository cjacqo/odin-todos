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
    const textBox = document.createElement('p')
    li.classList.add('table-item', 'flex')
    li.setAttribute(attributeName, attributeValue)
    textBox.innerText = elementText
    li.appendChild(textBox)
    const editIconsContainer = document.createElement('div')
    editIconsContainer.classList.add('edit-icon-container', 'hidden', 'flex')
    const toggleEditMenuIcon = EditIcon({iconClass: 'fa-ellipsis', tableItemId: attributeValue, actionType: 'open-edit-modal'})
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
    const { iconClass, tableItemId, actionType } = editObj
    const editIconContainer = document.createElement('div')
    const editIcon = document.createElement('i')
    editIconContainer.setAttribute('data-table-item-id', tableItemId)
    editIconContainer.classList.add('edit-icon-container')
    editIcon.classList.add('fa-solid', `${iconClass}`)
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

export {ListItem, EditCheckBox}