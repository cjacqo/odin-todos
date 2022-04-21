import Header from "../components/header/Header"
import Main from "../components/main/Main"
import Footer from "../components/footer/Footer"
import { Modal } from "../components/elements"

const PageView = (() => {
    let _appContainer
    let _header
    let _main
    let _footer
    let _modal

    const loadAddNoteForm = (data) => {
        while (_appContainer.children.length > 0) {
            _appContainer.children[0].remove()
        }

        _header = Header.getHeaderContainer(false)
        _main = Main.loadNoteFormTable()
        console.log(_main)
        // _main = Main.getNoteFormTable()

        // - append the DOM elements to the app container
        _appContainer.appendChild(_header)
        _appContainer.appendChild(_main)
        _appContainer.appendChild(_footer)
        _appContainer.appendChild(_modal)
    }

    // --- Initializes the DOM elements of the app and appends to the DOM
    const init = (data, state) => {
        Header.init()
        _main = Main
        _footer = Footer
        _modal = Modal()
        // - create the parent container for the app
        _appContainer = document.createElement('div')
        _appContainer.classList.add('flex', 'col')
        _appContainer.setAttribute('id', 'appContainer')

        // - initialize the DOM elements for each section and pass data where
        //   needed
        _header = Header.getHeaderContainer(true)
        _main = _main.init(data)
        _footer = _footer.init()
        _modal = Modal()

        // - append the DOM elements to the app container
        _appContainer.appendChild(_header)
        _appContainer.appendChild(_main)
        _appContainer.appendChild(_footer)
        _appContainer.appendChild(_modal)
        document.body.appendChild(_appContainer)
    }

    return {
        init: init,
        loadAddNoteForm: loadAddNoteForm
    }
})()

export default PageView