import './styles.css'
import { Forms } from "../../data/data"
import DateSelector from "./inputs/DateSelector"
import TextInput from "./inputs/TextInput"
import TimeSelector from "./inputs/TimeSelector"
import PrioritySelector from "./inputs/PrioritySelector"
import Controller from '../../controller'
import FolderSelector from './inputs/FolderSelector'
import Database from '../../data'
import Main from '../main/Main'

const FormController = (function() {
 
    function _getFormMetaData(_formId) {
        const data = Forms.find((form) => {
            return form.formId === _formId
        })
        return data
    }

    function _handleFormSubmission(_formType, _inputs) {
        let formData = []
        let formValues = []
        _inputs.forEach(_input => {
            const inputObj = {}
            inputObj.id = _input.id
            inputObj.value = _input.value
            formData.push(inputObj)
        })
        _inputs.forEach(_input => {
            const key = _input.id
            const value = _input.value
            const arrItem = [key, value]
            formValues.push(arrItem)
        })
        switch(_formType) {
            case 'folder':
                Database.addFolder(formData[0].value)
                break
            default:
                Database.addItem({type: _formType, data: formValues})
                break
        }
        return
    }

    function _appendChildToParent(parent, child) {
        parent.appendChild(child)
        return
    }

    function _getFormContainer(id) {
        const parentContainer = document.createElement('div')
        const formContainer = document.createElement('form')
        const formLegend = document.createElement('div')
        const formTitle = document.createElement('h6')
        const formSubTitle = document.createElement('p')
        const buttonsContainer = document.createElement('div')

        parentContainer.setAttribute('id', `${id}Parent`)
        formContainer.setAttribute('id', `${id}Form`)
        parentContainer.classList.add('form-parent')
        formContainer.classList.add('form-container')
        formLegend.classList.add('form-legend')
        formTitle.classList.add('form-title')
        formSubTitle.classList.add('form-sub-title')
        buttonsContainer.classList.add('form-buttons-container', 'flex')

        return {parentContainer, formContainer, formLegend, formTitle, formSubTitle, buttonsContainer}
    }

    function _createFormTitle(_elements, _data) {
        const { formContainer, formLegend, formTitle, formSubTitle } = _elements
        // -- write and append title
        formTitle.innerText = _data[0]
        formLegend.appendChild(formTitle)
        // -- write and append subTitle
        if (_data.length > 1) {
            formSubTitle.innerText = _data[1]
            formLegend.appendChild(formSubTitle)
        }
        formContainer.appendChild(formLegend)
        return
    }

    function _createInput(_inputType, attributes, options) {
        switch(_inputType) {
            case 'text':
                return TextInput.init({type: 'text', attributes})
            case 'textarea':
                return TextInput.init({type: 'textarea', attributes})
            case 'date':
                return DateSelector.init()
            case 'time':
                return TimeSelector.init()
            case 'priority':
                return PrioritySelector.init(options)
            case 'folder-select':
                return FolderSelector.init(attributes, options)
        }
    }

    function _createFieldSetElement(id) {
        const formFieldSet = document.createElement('fieldset')
        formFieldSet.classList.add('form-fieldset', 'flex', 'col')
        formFieldSet.setAttribute('id', `${id}`)
        return formFieldSet
    }

    function _getFieldSet(_fieldSet, _formName) {
        let inputs = []
        const { id, questions } = _fieldSet
        const fieldSet = _createFieldSetElement(`add${_formName}fieldSet${id}`)
        questions.forEach(_question => {
            const { inputType, attributes, options, title } = _question
            const formInput = _createInput(inputType, attributes, options)
            inputs.push(formInput)
            fieldSet.appendChild(formInput)
        })
        return {fieldSet, inputs}
    }

    function _createAllFieldSets(_formContainer, _formFieldSetsData, _formName) {
        let inputsArr = []
        _formFieldSetsData.forEach(_fieldSet => {
            const { fieldSet, inputs } = _getFieldSet(_fieldSet, _formName)
            inputs.forEach(_input => {
                inputsArr.push(_input)
            })
            _appendChildToParent(_formContainer, fieldSet)
        })
        return inputsArr
    }

    function _createAllButtons(_formContainer, _formButtonsContainer, _formButtonsData, _formInputs) {
        _formButtonsData.forEach(_formButton => {
            const { type, value, text, creationValue } = _formButton
            const btn = document.createElement('button')
            btn.setAttribute('type', type)
            btn.innerText = text
    
            if (type == 'submit') {
                btn.classList.add('form-button', 'form-submit-button')
                btn.setAttribute('disabled', true)
                btn.addEventListener('click', (e) => {
                    e.preventDefault()
                    _handleFormSubmission(`${creationValue}`, _formInputs)
                    Controller.handleCreation(`${creationValue}`, _formInputs)
                    Controller.toggleModal()
                })
            } else {
                btn.setAttribute('value', value)
                btn.classList.add('form-button', 'form-cancel-button')
                    btn.addEventListener('click', (e) => {
                    e.preventDefault()
                    Controller.toggleModal(e)
                })
            }
            _appendChildToParent(_formButtonsContainer, btn)
            _appendChildToParent(_formContainer, _formButtonsContainer)
        })
        return
    }

    function _createForm(formData) {
        let formInputs = []
        const { fieldSets, formId, formContainerName, formName, formInfo, buttons } = formData
        const formContainerElements = _getFormContainer(formContainerName)
        const { parentContainer, formContainer, formLegend, formTitle, formSubTitle, buttonsContainer } = formContainerElements

        // -- check if the formData has formInfo
        //    + used to set a legend if it exists
        if (formInfo) {
            const formTitleElements = { formContainer, formLegend, formTitle, formSubTitle }
            const formTitleData = formInfo
            _createFormTitle(formTitleElements, formTitleData)
        }

        // -- loop over formData fieldSets to create the inputs for the form
        formInputs = _createAllFieldSets(formContainer, fieldSets, formName)

        // -- loop over formData buttons to create the buttons for the form
        _createAllButtons(formContainer, buttonsContainer, buttons, formInputs)

        _appendChildToParent(parentContainer, formContainer)
        return { parentContainer, formInputs }
    }

    function createForm(formType) {
        let formData = _getFormMetaData(formType)
        let formObj = _createForm(formData)
        return formObj
    }

    return {
        createForm: createForm
    }
})()

export default FormController