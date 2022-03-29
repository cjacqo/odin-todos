import Controller from "../../controller"

const AddFolderForm = () => {
    const formContainer = document.createElement('form')
    const formFieldSet = document.createElement('fieldset')
    const formLegend = document.createElement('legend')
    const formControl = document.createElement('div')
    const inputLabel = document.createElement('label')
    const textInput = document.createElement('input')
    const submitButton = document.createElement('button')

    formContainer.setAttribute('id', 'addFolderForm')
    formContainer.classList.add('form-container')
    formFieldSet.classList.add('form-fieldset')
    formLegend.classList.add('form-legend')
    formControl.classList.add('form-control')
    inputLabel.classList.add('input-label')
    textInput.classList.add('form-input')
    submitButton.classList.add('form-submit-btn')

    textInput.setAttribute('type', 'text')
    textInput.setAttribute('id', 'folderNameInput')
    inputLabel.setAttribute('for', 'folderNameInput')

    formLegend.innerText = 'Add Folder'
    inputLabel.innerText = 'Folder Name'
    submitButton.innerText = 'Create'

    submitButton.addEventListener('click', (e) => {
        e.preventDefault()
        Controller.handleCreation('folder', textInput.value)
        Controller.toggleModal()
    })

    formControl.appendChild(inputLabel)
    formControl.appendChild(textInput)
    formControl.appendChild(submitButton)
    formLegend.appendChild(formControl)
    formFieldSet.appendChild(formLegend)
    formFieldSet.appendChild(formControl)
    formContainer.appendChild(formFieldSet)
    return formContainer
}

export {AddFolderForm}