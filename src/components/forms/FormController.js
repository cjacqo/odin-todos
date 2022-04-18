import './styles.css'
import { Forms } from "../../data/data"
import DateSelector from "./inputs/DateSelector"
import TextInput from "./inputs/TextInput"
import TimeSelector from "./inputs/TimeSelector"
import PrioritySelector from "./inputs/PrioritySelector"
import Controller from '../../controller'
import FolderSelector from './inputs/FolderSelector'

const FormController = (function() {
    let _todoForm
    let _todoFormInputs = []
    let _noteForm
    let _noteFormInputs = []

    function _getFormMetaData(_formId) {
        const data = Forms.filter((form) => {
            return form.formId === _formId && form
        })
        return data
    }

    function _setAtts(input, attributes) {
        input.setAttribute('autocomplete', 'off')
        input.setAttribute('required', true)
        attributes.forEach(attribute => {
            const { name, value } = attribute
            if (value) {
                input.setAttribute(`${name}`, `${value}`)
            }
        })
        input.addEventListener('input', (e) => {
            Controller.handleTextInput(e)
        })
        return
    }

    function _appendChildToParent(parent, child) {
        parent.appendChild(child)
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

    function _createFieldSet(_fieldSet, _formName) {
        let inputs = []
        const { id, questions } = _fieldSet
        const fieldSet = _createFieldSetElement(`add${_formName}fieldSet${id}`)
        questions.forEach(question => {
            const { inputType, attributes, options, title } = question
            const formInput = _createInput(inputType, attributes, options)
            inputs.push(formInput)
            fieldSet.appendChild(formInput)
        })
        return {fieldSet, inputs}
    }

    function _createFormContainer(id) {
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

    function _createTodoForm() {
        let formInputs = []
        const [formData] = _getFormMetaData('todo')
        const { fieldSets, formId, formName, formInfo, buttons } = formData
        const formContainerElements = _createFormContainer('addTodoForm')
        const { parentContainer, formContainer, formLegend, formTitle, formSubTitle, buttonsContainer } = formContainerElements
    
        formTitle.innerText = formInfo[0]
        formLegend.appendChild(formTitle)
    
        if (formInfo.length > 1) {
            formSubTitle.innerText = formInfo[1]
            formLegend.appendChild(formSubTitle)
        }
        
        formContainer.appendChild(formLegend)

        fieldSets.forEach(_fieldSet => {
            const { fieldSet, inputs } = _createFieldSet(_fieldSet, formName)
            inputs.forEach(input => {
                formInputs.push(input)
            })
            _appendChildToParent(formContainer, fieldSet)
        })

        buttons.forEach(button => {
            const { type, value, text, creationValue } = button
            const btn = document.createElement('button')
            btn.setAttribute('type', type)
            btn.innerText = text
            console.log(type)
    
            if (type == 'submit') {
                btn.classList.add('form-button', 'form-submit-button')
                btn.setAttribute('disabled', true)
                btn.addEventListener('click', (e) => {
                    e.preventDefault()
                    Controller.handleCreation(`${creationValue}`, formInputs)
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
            buttonsContainer.appendChild(btn)
        })

        _appendChildToParent(parentContainer, formContainer)
        _todoFormInputs = formInputs
        return parentContainer
    
        // fieldSets.forEach(fieldSet => {
        //     const { questions } = fieldSet
    
        //     const formFieldSet = document.createElement('fieldset')
        //     formFieldSet.classList.add('form-fieldset', 'flex', 'col')
        //     formFieldSet.setAttribute('id', `addNotefieldSet${fieldSet.id}`)
            
        //     if (questions.length > 0) {
        //         questions.forEach(question => {
        //             const { title, autocomplete, required, minlength, maxlength, type, id, placeholder, name, label, options } = question
        //             let formControl
        //             const inputTitleContainer = document.createElement('div')
        //             const inputTitle = document.createElement('p')
        //             inputTitleContainer.classList.add('input-title-container')
        //             inputTitle.classList.add('input-title')
        //             inputTitle.innerText = title
        //             inputTitleContainer.appendChild(inputTitle)
        //             switch(type) {
        //                 case 'text':
        //                 case 'textarea':
        //                     formControl = document.createElement('div')
        //                     let formInput = document.createElement(`${type === 'textarea' ? type : 'input'}`)
        //                     formInputs.push(formInput)
        //                     formControl.classList.add('form-control')
        //                     formControl.setAttribute('id', `${name}Control`)
        //                     if (type === 'text') {
        //                         formInput.setAttribute('type', type)
        //                     }
        //                     formInput.setAttribute('autocomplete', autocomplete ? 'on' : 'off')
        //                     formInput.setAttribute('required', required ? required : false)
        //                     formInput.setAttribute('minlength', minlength ? minlength : 1)
        //                     formInput.setAttribute('maxlength', maxlength ? maxlength : 20)
        //                     formInput.setAttribute('placeholder', placeholder)
        //                     formInput.addEventListener('input', (e) => {
        //                         Controller.handleTextInput(e)
        //                     })
        //                     formControl.appendChild(formInput)
        //                     break
        //                 case 'date':
        //                     formControl = DateSelector.init()
        //                     formInputs.push(DateSelector.getInput())
        //                     break
        //                 case 'time':
        //                     formControl = TimeSelector.init()
        //                     formInputs.push(TimeSelector.getInput())
        //                     break
        //                 case 'radio':
        //                     formControl = PrioritySelector.init()
        //                     formInputs.push(PrioritySelector.getInput())
        //                     break
        //                 case 'select':
        //                     formControl = document.createElement('div')
        //                     formControl.classList.add('form-control', 'flex')
        //                     formControl.setAttribute('id', id)
        //                     formControl.appendChild(inputTitleContainer)
        //                     const selectContainer = document.createElement('select')
        //                     selectContainer.setAttribute('name', name)
        //                     options.forEach(option => {
        //                         const selectOption = document.createElement('option')
        //                         selectOption.setAttribute('value', option.getName())
        //                         selectOption.innerText = option.getName()
        //                         selectContainer.appendChild(selectOption)
        //                     })
        //                     formInputs.push(selectContainer)
        //                     formControl.appendChild(selectContainer)
        //                     break
        //                 default:
        //                     console.log(type)
        //             }
        //             console.log(formControl)
        //             formFieldSet.appendChild(formControl)
        //         })
        //     }
        //     formContainer.appendChild(formFieldSet)
        // })
    }

    function _createNoteForm() {
        let formInputs = []
        const [formData] = _getFormMetaData('note')
        const { fieldSets, formId, formName } = formData
        const formContainerElements = _createFormContainer('addNoteForm')
        const { parentContainer, formContainer, buttonsContainer } = formContainerElements

        fieldSets.forEach(_fieldSet => {
            const { fieldSet, inputs } = _createFieldSet(_fieldSet, formName)
            formInputs.push(inputs)
            _appendChildToParent(formContainer, fieldSet)
        })
        _appendChildToParent(parentContainer, formContainer)
        _noteFormInputs = formInputs
        return parentContainer
    }

    function createForm(formType) {
        let formObj = {}
        switch(formType) {
            case 'todo':
                _todoForm = _createTodoForm()
                formObj.form = _todoForm
                formObj.inputs = _todoFormInputs
                break
            case 'note':
                _noteForm = _createNoteForm()
                formObj.form = _noteForm
                formObj.inputs = _noteFormInputs
                break
        }
        return formObj
    }

    return {
        createForm: createForm
    }
})()

export default FormController