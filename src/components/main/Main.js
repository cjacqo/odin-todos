import Controller from "../../controller"

const Main = (function() {
    let _mainContainer
    let _tableContainer
    let _foldersTable
    let _itemsTable

    // --- Initializes the DOM elements and returns the newly create DOM element
    function _init(data) {
        // - create the elements for the Main DOM element
        _mainContainer  = document.createElement('main')
        _tableContainer = document.createElement('div')
        _foldersTable = document.createElement('div')
        _itemsTable = document.createElement('div')
        // - set id's of each DOM element
        _mainContainer.setAttribute('id', 'mainContainer')
        _tableContainer.setAttribute('id', 'tableContainer')
        _foldersTable.setAttribute('id', 'foldersTable')
        _itemsTable.setAttribute('id', 'itemsTable')

        // - take the data being passed by the Controller where the function chain started
        data.forEach(folder => {
            const li = document.createElement('div')
            li.setAttribute('data-folder-id', folder.id)
            li.innerText = folder.name
            li.addEventListener('click', (e) => {
                Controller.toggleTable({type: 'folder', value: e.target.dataset, title: folder.name})
            })
            _foldersTable.appendChild(li)
        })

        // - DEFAULT CLASS NAME: add a class of hidden to the _itemsTable DOM element
        //   to ensure that it is not visible on the screen on initial load
        _itemsTable.classList.add('hidden')

        // - append the elements
        _tableContainer.appendChild(_foldersTable)
        _tableContainer.appendChild(_itemsTable)
        _mainContainer.appendChild(_tableContainer)
        // - return container
        return _mainContainer
    }

    // --- Generates the items table and it's data to be displayed on the DOM
    function _loadItemsTable(data, folderName) {
        // - clear the itemsTable
        while (_itemsTable.children.length > 0) {
            _itemsTable.children[0].remove()
        }

        // - check if the length of the data is greater then 0
        if (data.length > 0) {
            // TRUE: create table elements to append to the table
            data.forEach(item => {
                const li = document.createElement('div')
                li.setAttribute('data-item-id', item.id)
                li.innerText = item.name
                li.addEventListener('click', (e) => {
                    // @TODO: BUILD FUNCTION TO OPEN AN ITEM ON CLICK
                    // Controller.openItem()
                    console.log("ITEM IS CLICKED: Build function to open the item")
                })
                // - append table element to the table
                _itemsTable.appendChild(li)
            })
        } else {
            // FALSE: create a message to the user that will prompt them to create a new
            //        item that will assign it's folderId to the currently open folder
            let createItemInFolderMessage = document.createElement('h5')
            createItemInFolderMessage.innerText = `There are no items in ${folderName}. Would you like to create an item?`
            _itemsTable.appendChild(createItemInFolderMessage)
        }
    }

    function init(data) { return _init(data) }
    function getMainContainer() { return _mainContainer }
    function getFoldersTable() { return _foldersTable }
    function getItemsTable() { return _itemsTable }
    function loadItemsTable(data, folderName) { return _loadItemsTable(data, folderName) }

    return {
        init: init,
        getMainContainer: getMainContainer,
        getFoldersTable: getFoldersTable,
        getItemsTable: getItemsTable,
        loadItemsTable: loadItemsTable
    }
})()

export default Main