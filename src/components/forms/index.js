import './styles.css'
import Controller from "../../controller"

const AddFolderForm = () => {
    const parentContainer = document.createElement('div')
    const formContainer = document.createElement('form')
    const formFieldSet = document.createElement('fieldset')
    const formLegend = document.createElement('div')
    const formTitle = document.createElement('h6')
    const formSubTitle = document.createElement('p')
    const formInputControl = document.createElement('div')
    const textInput = document.createElement('input')

    const buttonsContainer = document.createElement('div')
    const cancelButton = document.createElement('button')
    const submitButton = document.createElement('button')

    parentContainer.classList.add('form-parent')
    parentContainer.setAttribute('id', 'addFolderFormParent')
    formContainer.setAttribute('id', 'addFolderForm')
    formContainer.classList.add('form-container')
    formFieldSet.classList.add('form-fieldset', 'flex', 'col')
    formLegend.classList.add('form-legend')
    formTitle.classList.add('form-title')
    formSubTitle.classList.add('form-sub-title')
    formInputControl.classList.add('form-control')
    textInput.classList.add('form-input')
    buttonsContainer.classList.add('form-buttons-container', 'flex')
    cancelButton.classList.add('form-button', 'form-cancel-button')
    submitButton.classList.add('form-button', 'form-submit-button')

    formTitle.innerText = 'New Folder'
    formSubTitle.innerText = 'Enter a name for this folder.'

    textInput.setAttribute('autocomplete', 'off')
    textInput.setAttribute('required', true)
    textInput.setAttribute('minlength', '1')
    textInput.setAttribute('maxlength', '20')
    textInput.setAttribute('type', 'text')
    textInput.setAttribute('id', 'folderNameInput')
    textInput.setAttribute('placeholder', 'Name')
    textInput.setAttribute('name', 'add-form-input')

    textInput.addEventListener('input', (e) => {
        Controller.handleTextInput(e)
    })

    cancelButton.innerText = 'Cancel'
    submitButton.innerText = 'Save'

    cancelButton.setAttribute('type', 'button')
    cancelButton.setAttribute('value', 'close')
    cancelButton.addEventListener('click', (e) => {
        e.preventDefault()
        Controller.toggleModal(e)
    })
    
    submitButton.setAttribute('type', 'submit')
    submitButton.setAttribute('disabled', true)
    submitButton.addEventListener('click', (e) => {
        e.preventDefault()
        Controller.handleCreation('folder', textInput.value)
        Controller.toggleModal()
    })

    buttonsContainer.appendChild(cancelButton)
    buttonsContainer.appendChild(submitButton)

    formLegend.appendChild(formTitle)
    formLegend.appendChild(formSubTitle)
    
    formInputControl.appendChild(textInput)
    formFieldSet.appendChild(formLegend)
    formFieldSet.appendChild(formInputControl)
    formContainer.appendChild(formFieldSet)
    formContainer.appendChild(buttonsContainer)
    parentContainer.appendChild(formContainer)
    return parentContainer
}

const CreateToDoForm = () => {
    console.log("Hello from CreateToDoForm")
}

export {AddFolderForm, CreateToDoForm}