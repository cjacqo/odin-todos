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
    li.classList.add('table-item', 'flex')
    li.setAttribute(attributeName, attributeValue)
    li.innerText = elementText
    const editIcon = EditIcon(attributeValue)
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
    li.appendChild(editIcon)
    return li
}

const EditIcon = (tableItemId) => {
    const editIconContainer = document.createElement('div')
    const editIcon = document.createElement('i')
    editIconContainer.setAttribute('data-table-item-id', tableItemId)
    editIconContainer.classList.add('edit-icon-container', 'hidden')
    editIcon.classList.add('fa-solid', 'fa-ellipsis')
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