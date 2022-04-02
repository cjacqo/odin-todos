import './styles.css'
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import Controller from "../../controller"
import {CurrentCalendar} from './DatePicker.js'
import { changeMonth, getDays, getDaysOfMonth, getTodaysDate } from '../../functions'

const TimePicker = () => {
    const timePickerContainer = document.createElement('div')

    return timePickerContainer
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
            fieldSet.questions.forEach(question => {
                const { autocomplete, required, minlength, maxlength, type, id, placeholder, name, label, options } = question
                const formInputControl = document.createElement('div')
                const formInputLabel = document.createElement('label')
                const formInputSubLabel = document.createElement('small')
                let formInput

                formInputControl.classList.add('form-control')
                formInputControl.setAttribute('id', `${name}Control`)

                // Dependent Toggle Input
                const toggleInputOpen = document.createElement('input')
                toggleInputOpen.setAttribute('type', 'checkbox')
                toggleInputOpen.setAttribute('id', `${id}ToggleInput`)

                switch(type) {
                    case 'text':
                    case 'textarea':
                        formInput = type === 'text' ? document.createElement('input') : document.createElement('textarea')
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
                        break
                    case 'date':
                    case 'time':
                        // - Create the input, and add classes that hide the custom
                        //   input by default
                        formInput = type === 'date' ? CurrentCalendar.getCalendarView(false) : TimePicker()
                        formInput.classList.add('collapsible-input', 'hidden')

                        // - Create a hidden input element that will track the value from
                        //   the custom input
                        const hiddenInput = document.createElement('input')
                        hiddenInput.classList.add('hidden-input')
                        hiddenInput.setAttribute('id', `${type}HiddenInput`)
                        hiddenInput.setAttribute('type', type)

                        const theDate = getTodaysDate()

                        formInputControl.classList.add('flex')
                        toggleInputOpen.classList.add('toggle-input-visibility')
                        toggleInputOpen.setAttribute('id', `${name}Toggle`)

                        // - Create a toggle switch to show/hide the custom inputs
                        const checkBoxLabel = document.createElement('label')
                        const checkBoxSlider = document.createElement('div')
                        const iconContainer = document.createElement('div')
                        const icon = document.createElement('i')

                        const questionTitleContainer = document.createElement('div')
                        const questionTitle = document.createElement('p')
                        const questionAnswer = document.createElement('small')
                        
                        checkBoxLabel.setAttribute('for', `${name}Toggle`)
                        checkBoxLabel.classList.add('switch-label')
                        checkBoxSlider.classList.add('slider', 'round')
                        iconContainer.classList.add('input-icon-container')
                        iconContainer.setAttribute('id', `${type}IconContainer`)
                        icon.classList.add('fa-solid', type === 'date' ? 'fa-calendar-day' : 'fa-clock')
                        
                        questionTitleContainer.classList.add('question-title-container')
                        questionTitle.classList.add('question-title')
                        questionAnswer.classList.add('date-answer')
                        questionAnswer.setAttribute('id', `${name}AnswerDisplay`)

                        questionTitle.innerText = placeholder

                        questionTitleContainer.appendChild(questionTitle)
                        questionTitleContainer.appendChild(questionAnswer)
                        
                        // - Event listener for the custom input toggler
                        //      + when clicked to OFF, the value will be erased
                        toggleInputOpen.addEventListener('click', (e) => {
                            e.stopImmediatePropagation()
                            const questionId = e.target.getAttribute('id')
                            const isChecked = e.target.checked
                            Controller.toggleQuestionVisibility(questionId, hiddenInput.value, isChecked)
                        }, false)

                        // - Event listener for the question title container
                        questionTitleContainer.addEventListener('click', (e) => {
                            e.stopImmediatePropagation()
                            const questionId = toggleInputOpen.getAttribute('id')
                            if (toggleInputOpen.checked) {
                                Controller.toggleQuestionVisibility(questionId, hiddenInput.value, true)
                            }
                            return
                        })
                        
                        formInputLabel.innerText = placeholder

                        iconContainer.appendChild(icon)

                        checkBoxLabel.appendChild(toggleInputOpen)
                        checkBoxLabel.appendChild(checkBoxSlider)

                        formInputControl.appendChild(hiddenInput)
                        formInputControl.appendChild(iconContainer)
                        formInputControl.appendChild(questionTitleContainer)
                        formInputControl.appendChild(checkBoxLabel)
                        break
                    case 'select':
                        formInput = document.createElement('select')
                        toggleInputOpen.addEventListener('click', (e) => {
                            console.log("Toggle the selection options open")
                        })
                        options.forEach(option => {
                            const optionElement = document.createElement('option')
                            optionElement.setAttribute('value', option)
                            optionElement.innerText = typeof(option) === 'object' ? option.getName() : option
                            formInput.appendChild(optionElement)
                        })
                        formInputControl.appendChild(toggleInputOpen)
                        break
                        
                }

                formInput.classList.add('form-input')
                formInput.setAttribute('id', `${id}Input`)
                formInput.setAttribute('name', name)

                formInputs.push(formInput)

                if (label) {
                    formInputControl.appendChild(formInputLabel)
                    formInputControl.appendChild(formSubTitle)
                }
                formInputControl.appendChild(formInput)
                formFieldSet.appendChild(formInputControl)

                // Dependent HR
                if (questions.indexOf(question) !== questions.length - 1) {
                    const hr = document.createElement('hr')
                    hr.classList.add('question-hr')
                    formFieldSet.appendChild(hr)
                }
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

const CreateToDoForm = () => {
    const parentContainer = document.createElement('div')

    console.log("Hello from CreateToDoForm")
}

export {CreateToDoForm, AddFormToModal}