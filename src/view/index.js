import Header from "../components/header/Header"
import Main from "../components/main/Main"
import Footer from "../components/footer/Footer"

const PageView = (() => {
    let _header = Header
    let _main   = Main
    let _footer = Footer

    // --- Initializes the DOM elements of the app and appends to the DOM
    const init = (data) => {
        // - create the parent container for the app
        let _appContainer = document.createElement('div')
        _appContainer.setAttribute('id', 'appContainer')

        // - initialize the DOM elements for each section and pass data where
        //   needed
        _header = _header.init()
        _main = _main.init(data)
        _footer = _footer.init()

        // - append the DOM elements to the app container
        _appContainer.appendChild(_header)
        _appContainer.appendChild(_main)
        _appContainer.appendChild(_footer)
        document.body.appendChild(_appContainer)
    }

    return {
        init
    }
})()

export default PageView