import Database from "../data"

const StateControl = (() => {
    const _state = {
        folderOpen: false,
        itemOpen: false,
        formOpen: false,
        editOpen: false,
        modalOpen: false,
        popUpOpen: false,
        backClicked: false
    }
    let _folder = { id: null, name: null, data: null }
    let _item = { id: null, name: null, data: null }
    let _form = { toggledOpen: false, name: null, canSubmit: false }
    let _tableState = { tableValue: 'home', folder: null, item: null }
    let _editItemState = { window: 'modal', item: null }

    function _getFirstStringParam(str) { return str.substring(0, str.indexOf('-')) }
    function _getSecondStringParam(str) { return str.split('-').pop() }

    function _getDataObjectFromDatabase(stateChange, id) {
        let data
        switch(stateChange) {
            case 'folder':
                data = Database.getFolder('id', id)
                _setFolderState(data)
                break
            case 'item':
                data = Database.getItem('id', id)
                _setItemState(data)
                break
        }
        return data
    }
    function _resetItemState() {
        return _item = { id: null, name: null, data: null }
    }
    function _setTableState(openTable) {
        switch(openTable) {
            case 'open-folder':
                _state.folderOpen = true
                _state.itemOpen = false
                return
            case 'open-item':
                _state.itemOpen = true
                _state.folderOpen = false
                return
        }
    }
    function _setTableData(tableType, id) {
        _tableState.tableValue = tableType
        switch(tableType) {
            case 'folder':
                _resetItemState()
                _setFolderState(id)
                _tableState.folder = _folder
                return
            case 'item':
                const intId = parseInt(id)
                _setItemState(intId)
                _tableState.item = _item
                return
        }
    }
    function _removeTableData(tableType) {
        if (tableType === 'folder') {
            _tableState.folder = {}
        } else if (tableType === 'item') {
            _tableState.item = {}
        }
        return
    }
    function _setFolderState(folderId) {
        const folder = Database.getFolder('id', folderId)
        _folder.id   = folder ? folder.getId() : null
        _folder.name = folder ? folder.getName() : null
        _folder.data = folder ? folder.getItems() : null
        return 
    }
    function _setItemState(itemId) {
        const item = Database.getItem('id', itemId)
        _item.type = item ? item.getType() : null
        _item.id   = item ? item.getId() : null
        _item.name = item ? item.getName() : null
        _item.data = item ? item.getData() : null
        return
    }
    function _setFormState(name) {
        _form.name = name
        _form.toggledOpen = _state.formOpen
        return
    }
    function _setEditState() {
        if (_state.formOpen) {
            _state.formOpen = false
        }
        _state.editOpen = !_state.editOpen
        return
    }
    function _setModalState() {
        const isPopUpOpen = _state.popUpOpen
        if (isPopUpOpen) {
            _state.popUpOpen = !isPopUpOpen
        }
        _state.modalOpen = !_state.modalOpen
        return
    }
    function _setPopUpState() {
        if (_state.modalOpen) {
            _state.modalOpen = false
        }
        _state.popUpOpen = !_state.popUpOpen
        return
    }

    function _getActiveStateProperty() {
        for (const property in _state) {
            if (_state[property]) {
                return property
            }
        }
    }
    function _getPropertyForNextState(nextState) {
        for (const property in _state) {
            if (property === nextState) {
                return property
            }
        }
    }
    function _setActiveStateBoolean(type) {
        console.log(type)
        // const compare = type.includes('folder') ? 'folder' : 'item'
        for (const property in _state) {
            if (property.includes(type)) {
                _state[property] = true
            } else {
                _state[property] = false
            }
        }
        return
    }
    function _setSecondaryActiveStateBoolean(type) {
        if (type) {
            for (const property in _state) {
                if (property.includes(type)) {
                    _state[property] = true
                }
            }
        }
        return
    }
    function _setBooleanState(action, value) {
        const isToggled = action === 'open'
        for (const property in _state) {
            if (property.includes(value)) {
                _state[property] = isToggled
            } else {
                _state[property] = false
            }
        }
        return
    }
    function _setDefaultStateBooleans() {
        for (const property in _state) {
            _state[property] = false
        }
        return
    }

    function handleStateChange(stateChange, isToggled, windowState) {
        console.log(stateChange)
        switch(stateChange) {
            case 'back':
                _handleTableStateChange()
                break
            case 'folder':
            case 'item':
                let id = isToggled
                _handleTableStateChange(_getDataObjectFromDatabase(stateChange, id))
                break
            // case 'create-folder':
            // case 'create-item':
            //     break _handleFormStateChange(stateChange, isToggled)
            case 'create-folder':
            case 'create-todo':
            case 'create-checklist':
            case 'create-note':
                const isFormOpen = !_state.formOpen
                _state.formOpen = isFormOpen
                const formName = _getSecondStringParam(stateChange)
                _setPopUpState(false)
                _setFormState(isFormOpen, formName)
                if (windowState == 'modal') {
                    _setModalState()
                } else {
                    // DO SOMETHING
                }
                break 
            case 'toggle-popup':
                _setPopUpState(!_state.popUpOpen)
                break
            case 'toggle-modal':
                _setModalState()
                break
            case 'close':
                _state.formOpen = false
                _state.modalOpen = false
                _state.popUpOpen = false
                _state.editOpen = false
                break
        }

        console.log(_state)
        return
    }

    function getStateBooleans() { return _state }
    function getActiveStateProperty() { return _getActiveStateProperty()}
    function getFolderState() { return _folder }
    function getOpenFolderName() { return _folder.name }
    function getFolderOpen() { return _state.folderOpen }
    function getItemState() { return _item }
    function getOpenItemName() { return _item.name }
    function getItemOpen() { return _state.itemOpen }
    function getFormOpen() { return _state.formOpen }
    function getFormState() { return _form }
    function getEditState() { return _state.editOpen }
    function getEditItemState() { return _editItemState }
    function getModalState() { return _state.modalOpen }
    function getPopUpState() { return _state.popUpOpen }
    function getBackState() { return _state.backClicked }
    function getTableState() { return _tableState }
    function getTableFolderState() { 
        const folder = _tableState.folder
        const { id, name, data } = folder
        return { id, name, data } 
    }
    function getTableItemState() { 
        const item = _tableState.item
        const { id, name, data } = item
        return { id, name, data, type } 
    }
    function getTableObjIds() {
        const folderId = _tableState.folder.id
        const itemId = _tableState.item.id
        return [folderId, itemId]
    }
    function getActiveTableObj() {
        let data
        let arr
        if (_tableState.tableValue === 'home') {
            return Database.getFolders()
        } else if (_tableState.tableValue === 'folder') {
            data = _tableState.folder
            arr = data.data
            return arr
        } else if (_tableState.tableValue === 'item') {
            console.log("ITEM CLICKED")
            return arr
        }
    }

    function setWindowState(window) {
        switch(window) {
            case 'modal':
                if (_state.popUpOpen) {
                    _state.popUpOpen = false
                }
                _state.modalOpen = !_state.modalOpen
                break
            case 'popup':
                if (_state.modalOpen) {
                    _state.modalOpen = false
                }
                _state.popUpOpen = !_state.popUpOpen
                break
        }
        if (_state.editOpen) {
            _state.editOpen = false
        }
        return
    }
    function getWindowState() {
        const { modalOpen, popUpOpen, editOpen } = _state
        return { modalOpen, popUpOpen, editOpen }
    }
    function setTableState(tableAction, data) {
        let id
        let type
        if (data) {
            id = data.id
            type = data.type
        }
        console.log(tableAction)
        switch (tableAction) {
            case 'open':
                _setTableData(type, id)
                break
            case 'close':
                _removeTableData(value)
                break
        }
        console.log(tableAction)
        _setTableState(tableAction)
        return
    }
    function setModalState(isToggled) {
        if (_state.popUpOpen) {
            _state.popUpOpen = false
        }
        _state.modalOpen = isToggled
        return
    }
    function setPopUpState(isToggled) {
        if (_state.modalOpen) {
            _state.modalOpen = false
        }
        console.log(_state.editOpen)
        if (_state.editOpen) {
            _state.editOpen = false
        }
        _state.popUpOpen = isToggled
        return
    }
    function setFormState(formName) {
        if (formName !== 'clear') {
            _state.formOpen = true
            _form.toggledOpen = true
            _form.name = _form.toggledOpen && formName ? formName : null
        } else if (formName === 'clear') {
            _state.formOpen = false
            _form.toggledOpen = false
            _form.name = null
        }
        console.log(_form)
        return
    }
    function setEditCheckedState(checked) { return _state.editOpen = checked }
    function setEditItemState(checked) {
        if (_state.modalOpen) {
            _state.modalOpen = false
        }
        if (_state.popUpOpen) {
            _state.popUpOpen = false
        }
        _state.editOpen = checked
        return
    }
    function setEditItem(type, id) {
        let data
        switch(type) {
            case 'home':
                data = Database.getFolder('id', id)
                break
            case 'folder':
                data = Database.getItem('id', id)
                break
        }
        _editItemState.item = data
        return
    }
    function resetTableState() {
        _tableState = { tableValue: 'home', folder: null, item: null }
        return
    }
    function resetTableItemState() {
        _tableState.item = null
        return
    }
    function resetState() { return _setDefaultStateBooleans() }
    function clearWindowStates() {
        _state.modalOpen = false
        _state.popUpOpen = false
        _form = { toggledOpen: false, name: null }
        _state.editOpen = false
        return
    }
    function closeFormState(currentTable) {
        const { tableValue, folder } = currentTable
        setModalState(false)
        setFormState('clear')
        switch(tableValue) {
            case 'home':
                return resetTableState()
            default:
                return setTableState('open', {type: 'folder', id: folder.id})
        }
    }
    
    return {
        handleStateChange: handleStateChange,
        getStateBooleans: getStateBooleans,
        getActiveStateProperty: getActiveStateProperty,
        getFolderState: getFolderState,
        getFolderOpen: getFolderOpen,
        getOpenFolderName: getOpenFolderName,
        getItemState: getItemState,
        getOpenItemName: getOpenItemName,
        getItemOpen: getItemOpen,
        getFormOpen: getFormOpen,
        getFormState: getFormState,
        getEditState: getEditState,
        getEditItemState: getEditItemState,
        getModalState: getModalState,
        getPopUpState: getPopUpState,
        getBackState: getBackState,
        getTableState: getTableState,
        getTableFolderState: getTableFolderState,
        getTableItemState: getTableItemState,
        getTableObjIds: getTableObjIds,
        getActiveTableObj: getActiveTableObj,
        getWindowState: getWindowState,
        setTableState: setTableState,
        setWindowState: setWindowState,
        setModalState: setModalState,
        setPopUpState: setPopUpState,
        setFormState: setFormState,
        setEditItemState: setEditItemState,
        setEditCheckedState: setEditCheckedState,
        setEditItem: setEditItem,
        resetState: resetState,
        resetTableState: resetTableState,
        resetTableItemState: resetTableItemState,
        clearWindowStates: clearWindowStates,
        closeFormState: closeFormState
    }
})()

export default StateControl