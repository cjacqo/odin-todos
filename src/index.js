import _ from 'lodash'
import './styles.css'
import Controller from './controller'
import Database from './data'

const _app = (function() {
    Database.init()
    Controller.init()

    // let _state
    // let _appContainer
    // let _header
    // let _main
    // let _footer

    // // --- Renders the initial layout of the page on first load
    // //          + creates the main HTML element then appends to body
    // //          + a list of all the folders on initial load by calling _renderPage()
    // const _init = (function() {
    //     Controller.getView()
    //     _renderPage()
    // })()

    // // --- Removes elements from appContainer element and creates new elements based
    // //          on the state
    // function _renderPage() {
    //     console.log("Render Page")
    // }

    // return {
    // }
})()

export default _app