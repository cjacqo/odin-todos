// --- Returns a div
// --- Params
//          + dataAttribute
//              ~~ attributeName
//              ~~ attributeValue
//          + item data
//              ~~ elementText
//              ~~ 

import Controller from "../../controller"

//          + Controller Function
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

export {ListItem}