import './styles.css'
import Controller from "../../controller"

const AddFormToModal = (formData) => {
    const { fieldSets, id, formInfo, buttons  } = formData

    const parentContainer = document.createElement('div')
    const formContainer = document.createElement('form')
    const formLegend = document.createElement('div')
    const formTitle = document.createElement('h6')
    const formSubTitle = document.createElement('p')
    const buttonsContainer = document.createElement('div')

    parentContainer.setAttribute('id', `${id}Parent`)
    formContainer.setAttribute('id', `${id}`)
    parentContainer.classList.add('form-parent')
    formContainer.classList.add('form-container')
    formLegend.classList.add('form-legend')
    formTitle.classList.add('form-title')
    formSubTitle.classList.add('form-sub-title')
    buttonsContainer.classList.add('form-buttons-container', 'flex')

    let formInputs = []

    formTitle.innerText = formInfo[0]
    formSubTitle.innerText = formInfo[1]
    formLegend.appendChild(formTitle)
    formLegend.appendChild(formSubTitle)

    formContainer.appendChild(formLegend)
    
    fieldSets.forEach(fieldSet => {
        const { questions, id } = fieldSet
        const formFieldSet = document.createElement('fieldset')
        formFieldSet.classList.add('form-fieldset', 'flex', 'col')
        formFieldSet.setAttribute('id', `fieldSet${id}`)
        if (questions.length > 0) {
            fieldSet.questions.forEach(question => {
                const { autocomplete, required, minlength, maxlength, type, id, placeholder, name, label } = question
                const formInputControl = document.createElement('div')
                const formInputLabel = document.createElement('label')
                const formInputSubLabel = document.createElement('small')
                const formInput = document.createElement('input')
                formInputControl.classList.add('form-control')
                formInput.classList.add('form-input')
                formInput.setAttribute('id', `${id}Input`)
                formInput.setAttribute('type', type)
                formInput.setAttribute('name', name)

                switch(type) {
                    case 'text':
                        formInput.setAttribute('autocomplete', autocomplete ? 'on' : 'false')
                        formInput.setAttribute('required', required ? required : false)
                        formInput.setAttribute('minlength', minlength ? minlength : 1)
                        formInput.setAttribute('maxlength', maxlength ? maxlength : 20)
                        formInput.setAttribute('placeholder', placeholder ? placeholder : 'Say something...')
                        formInput.addEventListener('input', (e) => {
                            Controller.handleTextInput(e)
                        })
                        break
                    case 'date':
                        const toggleInputOpen = document.createElement('input')
                        toggleInputOpen.setAttribute('checked', false)
                        toggleInputOpen.addEventListener('click', (e) => {
                            console.log("Toggle the date question open")
                        })
                        
                        formInputLabel.innerText = 'Date'
                        if (formInput.value.lentgh > 0) {
                            formInputSubLabel.innerText = formInput.value
                        }

                        formInput.addEventListener('click', (e) => {
                            console.log("Click handler for date pickher")
                        })

                        formInputControl.appendChild(toggleInputOpen)
                        break
                }

                formInputs.push(formInput)

                if (label) {
                    formInputControl.appendChild(formInputLabel)
                    formInputControl.appendChild(formSubTitle)
                }
                formInputControl.appendChild(formInput)
                formFieldSet.appendChild(formInputControl)
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