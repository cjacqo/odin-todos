import './styles.css'
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import Controller from "../../controller"
import DateSelector from './inputs/DateSelector'
import TimeSelector from './inputs/TimeSelector'
import PrioritySelector from './inputs/PrioritySelector'

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
                        break
                    case 'time':
                        formControl = TimeSelector.init()
                        break
                    case 'radio':
                        formControl = PrioritySelector.init()
                        // formControl = document.createElement('div')
                        // formControl.classList.add('form-control', 'flex')
                        // formControl.setAttribute('id', id)
                        // formControl.appendChild(inputTitleContainer)
                        // const radioContainer = document.createElement('div')
                        // const radioSelectionContainer = document.createElement('div')
                        // radioContainer.classList.add('radio-buttons-container')
                        // options.forEach(option => {
                        //     const radioButton = document.createElement('input')
                        //     const radioLabel = document.createElement('label')
                        //     if (option === 'none') {
                        //         radioButton.checked = true
                        //     }
                        //     radioButton.setAttribute('type', 'radio')
                        //     radioButton.setAttribute('id', option)
                        //     radioButton.setAttribute('name', name)
                        //     radioButton.setAttribute('value', option)
                        //     radioLabel.setAttribute('for', option)
                        //     radioLabel.innerText = option
                        //     radioContainer.appendChild(radioButton)
                        //     radioContainer.appendChild(radioLabel)
                        // })
                        // formControl.appendChild(radioContainer)
                        break
                    case 'select':
                        formControl = document.createElement('div')
                        formControl.classList.add('form-control', 'flex')
                        formControl.setAttribute('id', id)
                        formControl.appendChild(inputTitleContainer)
                        const selectContainer = document.createElement('select')
                        selectContainer.setAttribute('name', name)
                        console.log(options)
                        options.forEach(option => {
                            const selectOption = document.createElement('option')
                            selectOption.setAttribute('value', option.getName())
                            selectOption.innerText = option.getName()
                            selectContainer.appendChild(selectOption)
                        })
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

export {AddFormToModal}