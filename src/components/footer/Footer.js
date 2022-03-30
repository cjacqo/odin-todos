import './styles.css'
import Controller from "../../controller"
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import { SmallPopUpMenu } from '../elements'

const Footer = (function() {
    let _footerContainer
    let _actionsContainer
    let _actions = [
        {
            name: 'create-folder',
            icon: 'fa-folder-plus'
        },
        {
            name: 'create-item',
            icon: 'fa-pen-to-square'
        }
    ]
    let _popUpMenuContainer
    let _smallPopUpMenu

    // --- Initializes the DOM elements and returns the newly create DOM element
    function _init() {
        // - create the elements for the Footer DOM element
        _footerContainer = document.createElement('footer')
        _popUpMenuContainer = document.createElement('div')
        _actionsContainer = document.createElement('div')
        _smallPopUpMenu = SmallPopUpMenu()
        // - set attributes
        _footerContainer.setAttribute('id', 'footerContainer')
        _popUpMenuContainer.setAttribute('id', 'footerPopUpMenu')
        _actionsContainer.setAttribute('id', 'actionsContainer')
        _footerContainer.classList.add('flex')
        _popUpMenuContainer.classList.add('hidden')
        _actionsContainer.classList.add('flex')
        // - create buttons and append to the _actionsContainer
        _actions.forEach(_action => {
            const actionWrapper = document.createElement('div')
            const actionButton = document.createElement('button')
            const actionIcon = document.createElement('i')

            actionWrapper.classList.add('footer-action-button-wrapper')
            actionWrapper.setAttribute('id', `${_action.name}Action`)

            actionButton.setAttribute('type', 'button')
            actionButton.setAttribute('value', `${_action.name}`)
            actionButton.setAttribute('data-is-toggled', 'false')

            actionIcon.classList.add('fa-solid', `${_action.icon}`, 'yellow')

            actionButton.appendChild(actionIcon)

            actionButton.addEventListener('click', (e) => {
                let res
                if (_action.name === 'create-folder') {
                    res = Controller.toggleModal(e)
                } else {
                    res = Controller.togglePopUp(e)
                }
                actionButton.setAttribute('data-is-toggled', `${res}`)
            })

            actionWrapper.appendChild(actionButton)
            _actionsContainer.appendChild(actionWrapper)
        })
        // - append the _actionsContainer to the _footerContainer
        _popUpMenuContainer.appendChild(_smallPopUpMenu)
        _footerContainer.appendChild(_popUpMenuContainer)
        _footerContainer.appendChild(_actionsContainer)
        // - return container
        return _footerContainer
    }

    function init() { return _init() }
    function getFooterContainer() { return _footerContainer }
    function getSmallPopUpMenu() { return _popUpMenuContainer }
    
    return {
        init: init,
        getFooterContainer: getFooterContainer,
        getSmallPopUpMenu: getSmallPopUpMenu
    }
})()

export default Footer