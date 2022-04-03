const TimeSelector = (function() {
    let _formInputControl
    let _formInputLabel
    let _timeSelectorInput
    let _toggleInput
    let _checkBoxLabel
    let _checkBoxSlider
    let _iconContainer
    let _icon
    let _questionTitleContainer
    let _questionTitle
    let _questionAnswer
    let _isHidden = true
    let _hiddenInput

    function init() {
        _formInputControl = document.createElement('div')
        _formInputLabel = document.createElement('label')
        _timeSelectorInput = document.createElement('div')
        _hiddenInput = document.createElement('input')
        _toggleInput = document.createElement('input')
        _checkBoxLabel = document.createElement('label')
        _checkBoxSlider = document.createElement('div')
        _iconContainer = document.createElement('div')
        _icon = document.createElement('i')
        _questionTitleContainer = document.createElement('div')
        _questionTitle = document.createElement('p')
        _questionAnswer = document.createElement('small')

        _hiddenInput.setAttribute('type', 'time')

        _formInputControl.classList.add('form-control', 'flex')
        _formInputControl.setAttribute('id', 'todo-timeControl')
        _timeSelectorInput.classList.add('time-picker-container', 'collapsible-input', 'hidden')
        _timeSelectorInput.setAttribute('id', 'todoDueTimeInput')
        _hiddenInput.classList.add('hidden-input')
        _hiddenInput.setAttribute('id', `timeHiddenInput`)
        _hiddenInput.setAttribute('type', 'time')
        _toggleInput.classList.add('toggle-input-visibility')
        _toggleInput.setAttribute('type', 'checkbox')
        _toggleInput.setAttribute('id', `todoDueTimeToggle`)
        _checkBoxLabel.classList.add('switch-label')
        _checkBoxSlider.classList.add('slider', 'round')
        _checkBoxLabel.setAttribute('for', `todoDueTimeToggle`)
        _iconContainer.classList.add('input-icon-container')
        _iconContainer.setAttribute('id', `timeIconContainer`)
        _icon.classList.add('fa-solid', 'fa-clock')

        _questionTitleContainer.classList.add('question-title-container')
        _questionTitle.classList.add('question-title')
        _questionAnswer.classList.add('time-answer')
        _questionAnswer.setAttribute('id', `todoDuetimeAnswerDisplay`)

        _questionTitle.innerText = 'Time'

        _questionTitleContainer.appendChild(_questionTitle)
        _questionTitleContainer.appendChild(_questionAnswer)

        _toggleInput.addEventListener('click', (e) => {
            e.stopImmediatePropagation()
            const isChecked = e.target.checked
            _isHidden = !isChecked
            // _toggleQuestionVisibility(isChecked)
        })

        _questionTitleContainer.addEventListener('click', (e) => {
            e.stopImmediatePropagation()
            if (_toggleInput.checked) {
                _isHidden = !_isHidden
                // _toggleQuestionVisibility(true)
            }
        })

        _iconContainer.appendChild(_icon)
        _checkBoxLabel.appendChild(_toggleInput)
        _checkBoxLabel.appendChild(_checkBoxSlider)

        // _dateSelectorInput.appendChild(_topRow)
        // _dateSelectorInput.appendChild(_bottomRow)
        
        _formInputControl.appendChild(_hiddenInput)
        _formInputControl.appendChild(_iconContainer)
        _formInputControl.appendChild(_questionTitleContainer)
        _formInputControl.appendChild(_checkBoxLabel)
        _formInputControl.appendChild(_timeSelectorInput)
        return _formInputControl
    }
    
    return {
        init: init
    }
})()

export default TimeSelector