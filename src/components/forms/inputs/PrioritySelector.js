import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import { capitalizeString } from '../../../functions'

const PrioritySelector = (function() {
    const options = ['None', 'Low', 'Medium', 'High']
    let _formInputControl
    let _questionTitleContainer
    let _questionTitleElement
    let _answerTitleContainer
    let _answerTitleElement
    let _radioButtonsContainer
    let _radioButtons = []
    let _toggleInput
    let _checkBoxLabel
    let _checkBoxSlider
    let _answer
    let _isHidden = true

    function _setDefault() {
        _radioButtons.forEach(_radioButton => {
            const { radioButton } = _radioButton
            console.log(radioButton.value)
            if (radioButton.value == 'none') {
                radioButton.setAttribute('checked', true)
                _setAnswer(radioButton.value)
            }
        })
    }

    function _setAnswer(value) {
        _answer = capitalizeString(value)
    }
    
    function _createRadioButtonsContainer() {
        _radioButtonsContainer = document.createElement('div')
        _radioButtonsContainer.classList.add('radio-buttons-container', 'priority-buttons-container', 'hidden')
        _radioButtons.forEach(_radioButton => {
            const { radioButton, radioLabel } = _radioButton
            _radioButtonsContainer.appendChild(radioButton)
            _radioButtonsContainer.appendChild(radioLabel)
        })
    }
    
    function _createRadioButtons() {
        options.forEach(option => {
            const radioButton = document.createElement('input')
            const radioLabel = document.createElement('label')
            radioButton.classList.add('radio-button', 'priority-button')
            radioButton.setAttribute('id', `priority${option}Radio`)
            radioButton.setAttribute('type', 'radio')
            radioButton.setAttribute('name', 'priority-select')
            radioButton.setAttribute('value', option.toLowerCase())
            radioLabel.classList.add('radio-label', 'priority-label')
            radioLabel.setAttribute('id', `priority${option}Label`)
            radioLabel.setAttribute('for', option.toLowerCase())
            radioLabel.innerText = option
            _radioButtons.push({radioButton, radioLabel})
        })
        _setDefault()
    }

    function _createTitleContainer() {
        _questionTitleContainer = document.createElement('div')
        _questionTitleElement = document.createElement('p')
        _questionTitleContainer.classList.add('question-title-container', 'priority-question-title-container')
        _questionTitleElement.classList.add('question-title', 'priority-question-title')
        _questionTitleElement.innerText = 'Priority'
        _questionTitleContainer.appendChild(_questionTitleElement)
    }

    function _createAnswerTitleContainer() {
        _answerTitleContainer = document.createElement('div')
        _answerTitleElement = document.createElement('p')
        const chevron = document.createElement('i')
        _answerTitleContainer.classList.add('answer-title-container', 'priority-answer-title-container', 'flex')
        _answerTitleElement.classList.add('answer-title', 'priority-answer-title')
        chevron.classList.add('fa-solid', 'fa-chevron-right')
        _answerTitleElement.innerText = _answer
        _answerTitleContainer.appendChild(_answerTitleElement)
        _answerTitleContainer.appendChild(chevron)

        _answerTitleContainer.addEventListener('click', (e) => {
            _isHidden = !_isHidden
            _toggleVisibility()
            console.log("OPEN PRIORITY RADIO BUTTONS CONTAINER")
        })
    }

    function _createFormInputControl() {
        _formInputControl = document.createElement('div')
        _formInputControl.classList.add('form-control', 'flex')
        _formInputControl.setAttribute('id', 'todo-priorityControl')
        _appendAll()
    }

    function _appendAll() {
        _formInputControl.appendChild(_questionTitleContainer)
        _formInputControl.appendChild(_answerTitleContainer)
        _formInputControl.appendChild(_radioButtonsContainer)
    }

    function _toggleVisibility() {
        if (_isHidden && !_radioButtonsContainer.classList.contains('hidden')) {
            _radioButtonsContainer.classList.add('hidden')
        } else {
            _radioButtonsContainer.classList.remove('hidden')
        }
        return
    }

    function init() {
        _createRadioButtons()
        _createRadioButtonsContainer()
        _createTitleContainer()
        _createAnswerTitleContainer()
        _createFormInputControl()
        _appendAll()
        return _formInputControl
    }

    return {
        init: init
    }
    
})()

export default PrioritySelector