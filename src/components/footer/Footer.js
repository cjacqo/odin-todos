import Controller from "../../controller"
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'

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

    // --- Initializes the DOM elements and returns the newly create DOM element
    function _init() {
        // - create the elements for the Footer DOM element
        _footerContainer = document.createElement('footer')
        _actionsContainer = document.createElement('div')
        // - set attributes
        _footerContainer.setAttribute('id', 'footerContainer')
        _actionsContainer.setAttribute('id', 'actionsContainer')
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

            actionIcon.classList.add('fa-solid', `${_action.icon}`, 'yellow')

            actionButton.appendChild(actionIcon)

            actionButton.addEventListener('click', (e) => {
                e.stopPropagation()
                Controller.toggleModal(e)
            })

            actionWrapper.appendChild(actionButton)
            _actionsContainer.appendChild(actionWrapper)
        })
        // - append the _actionsContainer to the _footerContainer
        _footerContainer.appendChild(_actionsContainer)
        // - return container
        return _footerContainer
    }

    function init() { return _init() }
    function getFooterContainer() { return _footerContainer }
    
    return {
        init: init,
        getFooterContainer: getFooterContainer
    }
})()

export default Footer