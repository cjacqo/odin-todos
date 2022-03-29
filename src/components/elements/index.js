import Controller from "../../controller"

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
    li.setAttribute(attributeName, attributeValue)
    li.innerText = elementText
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
    return li
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