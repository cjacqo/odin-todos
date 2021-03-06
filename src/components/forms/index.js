import './styles.css'
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import Controller from "../../controller"
import DateSelector from './inputs/DateSelector'
import TimeSelector from './inputs/TimeSelector'
import PrioritySelector from './inputs/PrioritySelector'
import FormInputControl from './inputs'
import TextInput from './inputs/TextInput'
import { Forms } from '../../data/data'

const CreateFormContainer = (id) => {
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

const CreateFieldSet = (id, fieldSetId) => {
    const formFieldSet = document.createElement('fieldset')
    formFieldSet.classList.add('form-fieldset', 'flex', 'col')
    formFieldSet.setAttribute('id', `${id}fieldSet${fieldSetId}`)
    return formFieldSet
}

const AppendChildToParent = (parent, child) => {
    console.log(parent)
    parent.appendChild(child)
    return
}

const AddFormToModal = (formData) => {
    const { fieldSets, id, formInfo, buttons  } = formData

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

    let formInputs = []

    formTitle.innerText = formInfo[0]
    formLegend.appendChild(formTitle)

    if (formInfo.length > 1) {
        formSubTitle.innerText = formInfo[1]
        formLegend.appendChild(formSubTitle)
    }
    
    formContainer.appendChild(formLegend)

    fieldSets.forEach(fieldSet => {
        const { questions } = fieldSet

        const formFieldSet = document.createElement('fieldset')
        formFieldSet.classList.add('form-fieldset', 'flex', 'col')
        formFieldSet.setAttribute('id', `${id}fieldSet${fieldSet.id}`)
        
        if (questions.length > 0) {
            questions.forEach(question => {
                const { title, autocomplete, required, minlength, maxlength, type, id, placeholder, name, label, options } = question
                let formControl
                const inputTitleContainer = document.createElement('div')
                const inputTitle = document.createElement('p')
                inputTitleContainer.classList.add('input-title-container')
                inputTitle.classList.add('input-title')
                inputTitle.innerText = title
                inputTitleContainer.appendChild(inputTitle)
                switch(type) {
                    case 'text':
                    case 'textarea':
                        formControl = document.createElement('div')
                        let formInput = document.createElement(`${type === 'textarea' ? type : 'input'}`)
                        formInputs.push(formInput)
                        formControl.classList.add('form-control')
                        formControl.setAttribute('id', `${name}Control`)
                        if (type === 'text') {
                            formInput.setAttribute('type', type)
                        }
                        formInput.setAttribute('autocomplete', autocomplete ? 'on' : 'off')
                        formInput.setAttribute('required', required ? required : false)
                        formInput.setAttribute('minlength', minlength ? minlength : 1)
                        formInput.setAttribute('maxlength', maxlength ? maxlength : 20)
                        formInput.setAttribute('placeholder', placeholder)
                        formInput.addEventListener('input', (e) => {
                            Controller.handleTextInput(e)
                        })
                        formControl.appendChild(formInput)
                        break
                    case 'date':
                        formControl = DateSelector.init()
                        formInputs.push(DateSelector.getInput())
                        break
                    case 'time':
                        formControl = TimeSelector.init()
                        formInputs.push(TimeSelector.getInput())
                        break
                    case 'radio':
                        formControl = PrioritySelector.init()
                        formInputs.push(PrioritySelector.getInput())
                        break
                    case 'select':
                        formControl = document.createElement('div')
                        formControl.classList.add('form-control', 'flex')
                        formControl.setAttribute('id', id)
                        formControl.appendChild(inputTitleContainer)
                        const selectContainer = document.createElement('select')
                        selectContainer.setAttribute('name', name)
                        options.forEach(option => {
                            const selectOption = document.createElement('option')
                            selectOption.setAttribute('value', option.getName())
                            selectOption.innerText = option.getName()
                            selectContainer.appendChild(selectOption)
                        })
                        formInputs.push(selectContainer)
                        formControl.appendChild(selectContainer)
                        break
                    default:
                        console.log(type)
                }
                console.log(formControl)
                formFieldSet.appendChild(formControl)
            })
        }
        formContainer.appendChild(formFieldSet)
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

    formContainer.appendChild(buttonsContainer)
    parentContainer.appendChild(formContainer)

    return parentContainer
}

const AddNoteFormToModal = () => {
    const questions = [ 
        {
            type: 'text', 
            attributes: [
                {name: 'minlength', value: 3}, {name: 'maxlength', value: 30}, {name: 'placeholder', value: null}
            ]
        }, 
        {
            type: 'textarea', 
            attributes: [
                {name: 'minlength', value: 1}, {name: 'maxlength', value: null}, {name: 'placeholder', value: null}
            ]
        } 
    ]
    const formContainerElements = CreateFormContainer('addNoteForm')
    const formFieldSet = CreateFieldSet('addNote', 0)
    const noteNameInputControl = FormInputControl.createFormControl('note-name', questions[0])
    const noteNoteInputControl = FormInputControl.createFormControl('note-note', questions[1])
    const noteNameInput = TextInput.init({type: 'text', attributes: questions[0].attributes})
    const noteNoteInput = TextInput.init({type: 'textarea', attributes: questions[1].attributes})
    console.log(noteNameInput)
    console.log(noteNoteInput)
    // AppendChildToParent(formFieldSet, noteFormInputControl)
    // AppendChildToParent(formContainerElements, formFieldSet)

    let formInputs = []
    console.log(formContainer)
}

// export {AddFormToModal, AddNoteFormToModal}