const DatabaseItem = (type, id, data) => {
    const getType = () => {return type}
    const getId   = () => {return id}
    const getName = () => {return data.name}
    const createObj = (type) => {
        switch(type) {
            case 'folder':
                return FolderItem(type, data)
            case 'todo':
                return ToDoItem(type, data)
            case 'note':
                return NoteItem(type, data)
            case 'checklist':
                return CheckList(type, data)
        }
    }
    return {getType, getId, getName, createObj}
}

const FolderItem = (type, id, data) => {
    let _items         = []
    const prototype    = DatabaseItem(type, id, data)
    const getId        = () => {return id}
    const getItems     = () => {return _items}
    const getItemCount = () => {return _items.length}
    const setItems     = (data) => {_items.push(data.items)}
    const getPinned    = () => {return data.items.filter(item => item.pinned)}
    const getCanDelete = () => {return data.canDelete}
    return Object.assign({}, prototype, {getId, getItems, getItemCount, setItems, getPinned, getCanDelete})
}

const ToDoItem = (type, id, data) => {
    const prototype   = DatabaseItem(type, id, data)
    const getNote     = () => {return data.todoNote}
    const getDueDate  = () => {return data.duedate}
    const getDueTime  = () => {return data.duetime}
    const getPriority = () => {return data.priority}
    const getFolder   = () => {return data.folderId}
    return Object.assign({}, prototype, {getNote, getDueDate, getDueTime, getPriority, getFolder})
}

const NoteItem = (type, id, data) => {
    const prototype = DatabaseItem(type, id, data)
    const getFolder   = () => {return data.folderId}
    const getNote   = () => {return data.note}
    return Object.assign({}, prototype, {getFolder, getNote})
}

const CheckListItem = (type, id, data) => {
    const prototype   = DatabaseItem(type, id, data)
    const getFolder   = () => {return data.folderId}
    const getItems    = () => {return data.items}
    const getQuantity = () => {return data.items.length}
    // ??? GETCOMPLETE: will accept a boolean and return items whose complete value match
    //                  that param
    const getComplete = (complete) => {return data.items.filter(item => item.complete === complete)}
    return Object.assign({}, prototype, {getFolder, getItems, getQuantity, getComplete})
}

export { FolderItem, ToDoItem, NoteItem, CheckListItem }