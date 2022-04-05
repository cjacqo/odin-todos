import DateSelector from "./DateSelector"

const TimeSelector = (function() {
    let _Carousel = {
        width: 100,
        numVisible: 7,
        duration: 600,
        padding: 2
    }
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
    let _today = new Date()
    let _currentTimeObj
    let _hiddenInput
    let _dateSelectorIsHidden
    let _answer
    let _clockContainer
    let _hoursContainer
    let _minutesContainer
    let _ampmContainer

    function _roundToNearestHour() {
        const tempDate = _today
        tempDate.setHours(tempDate.getHours() + Math.round(tempDate.getMinutes() / 30))
        tempDate.setMinutes(0, 0, 0)
        return tempDate
    }

    function _updateQuestionAnswerDisplay() {
        if (_isHidden && !_hiddenInput.value) {
            _questionAnswer.classList.remove('active')
            _questionAnswer.innerText = ''
        } else if (!_isHidden && !_questionAnswer.classList.contains('active')) {
            _questionAnswer.classList.add('active')
            _questionAnswer.innerText = _answer.timeString
        } else if (!_isHidden) {
            _questionAnswer.innerText = _answer.timeString
        }
    }

    function _toggleQuestionVisibility(isChecked, remainHidden) {
        if (_isHidden) {
            _timeSelectorInput.classList.add('hidden')
            _hiddenInput.removeAttribute('value')
            _answer = {}
            _currentTimeObj = {}
            if (_hiddenInput.value && !isChecked) {
                // RESET THE INPUT TO DEFAULT
                _hiddenInput.removeAttribute('value')
            }
            _updateQuestionAnswerDisplay()
        } else {
            _timeSelectorInput.classList.remove('hidden')
            // DISPLAY THE CLOCK
            if (!_hiddenInput.value && isChecked) {
                // CREATE THE DEFAULT ANSWER WHEN THE INPUT IS TOGGLED ON
                _handleAnswer()
                _hiddenInput.setAttribute('value', _answer.timeValue)
            }
        }
    }

    function _moduloFix(hours) {
        return ((hours % 12) + 12) % 12;
    }

    function _formatHours(hours, needZero) {
        hours = hours % 12
        hours = hours ? hours : 12
        if (needZero) {
            return hours >= 10 ? hours : '0' + hours
        }
        return hours
    }

    function _formatMinutes(minutes) {
        return minutes >= 10 ? minutes : '0' + minutes
    }

    function _timeToString(hours, minutes, ampm) {
        return hours + ':' + _formatMinutes(minutes) + ' ' + ampm
    }

    function _timeToValue(hours, minutes, ampm) {
        const answerAsDate = new Date()
        answerAsDate.setHours(+hours)
        answerAsDate.setMinutes(minutes)
        return hours + ':' + minutes + ' ' + ampm
    }

    function _formatAnswerObj(hours, minutes, ampm) {
        _answer = {
            hours,
            minutes,
            ampm,
            timeString: _timeToString(hours, minutes, ampm),
            timeValue: _timeToValue(_formatHours(hours, true), _formatMinutes(minutes), ampm)
        }
    }

    function _isAmPm(hours) {
        return hours >= 12 ? 'PM' : 'AM'
    }

    function _getCurrentTime() {
        let timeValue = _today.toLocaleTimeString()
        let hours = _today.getHours()
        let minutes = _today.getMinutes()
        let ampm = _isAmPm(hours)
        hours = _formatHours(hours)
        minutes = _formatMinutes(minutes)
        let timeString = hours + ':' + minutes + ' ' + ampm
        let roundedTime = _roundToNearestHour()
        let roundedHour = _formatHours(roundedTime.getHours())

        return _currentTimeObj = {
            timeValue,
            hours,
            minutes,
            ampm,
            timeString,
            roundedHour
        }
    }

    function _handleScrollUp(container) {
        let top = container.children[0].cloneNode(true)
        container.children[0].remove()
        container.appendChild(top)
        _handleStyles(container)
    }

    function _handleScrollDown(container) {
        let bottom = container.children[container.children.length - 1].cloneNode(true)
        container.children[container.children.length - 1].remove()
        container.prepend(bottom)
        _handleStyles(container)
    }

    function _handleAmPmScrollUp(container) {
        container.removeAttribute('class')
        container.classList.add('carousel')
        container.classList.add('pm-active')
        _handleStyles(container)
    }

    function _handleAmPmScrollDown(container) {
        container.removeAttribute('class')
        container.classList.add('carousel')
        container.classList.add('am-active')
        _handleStyles(container)
    }

    function _handleStyles(container) {
        if (container.children.length > 2) {
            for (let i = 0; i < container.children.length; i++) {
                const element = container.children[i]
                element.removeAttribute('class')
                element.classList.add('spinner-element')
                if (i === 3) {
                    element.classList.add('active')
                } else if (i < 3 || i >= 4 && i < 7) {
                    element.classList.add('toggle')
                } else {
                    element.classList.add('hidden')
                }
            }
        } else if (container.children.length <= 2) {
            let amElement = container.children[0]
            let pmElement = container.children[1]
            amElement.removeAttribute('class')
            pmElement.removeAttribute('class')
            amElement.classList.add('spinner-element')
            pmElement.classList.add('spinner-element')
            if (container.classList.contains('am-active')) {
                amElement.classList.add('active')
                pmElement.classList.add('inactive')
            } else if (container.classList.contains('pm-active')) {
                pmElement.classList.add('active')
                amElement.classList.add('inactive')
            }
        }
    }

    function _setHiddenInputValue() {
        _hiddenInput.setAttribute('value', _answer.timeValue)
    }

    function _handleAnswer() {
        let hourElements = _hoursContainer.children
        let minuteElements = _minutesContainer.children
        let ampmElements = _ampmContainer.children
        let hourAnswer = _findActive(hourElements)
        let minuteAnswer = _findActive(minuteElements)
        let ampmAnswer = _findActive(ampmElements)
        hourAnswer = parseInt(hourAnswer)
        minuteAnswer = parseInt(minuteAnswer)
        _formatAnswerObj(hourAnswer, minuteAnswer, ampmAnswer)
        _setHiddenInputValue()
        _updateQuestionAnswerDisplay()
    }

    function _findActive(elements) {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].classList.contains('active')) {
                return elements[i].innerText
            }
        }
    }
    
    function _createSpinner(type) {
        let container = document.createElement('div')
        container.classList.add('carousel')
        container.id = type + 'Carousel'
        let nearestHour = (_currentTimeObj.roundedHour - 3)
        
        switch(type) {
            case 'hours':
                _hoursContainer = container
                for (let i = 0; i < 12; i++) {
                    const element = document.createElement('div')
                    element.classList.add('spinner-element')
                    let elementText = nearestHour % 12
                    if (elementText < 0) {
                        elementText = _moduloFix(elementText)
                    }
                    elementText = elementText ? elementText : 12
                    nearestHour++
                    if (nearestHour > 12) {
                        nearestHour = 1
                    }
                    element.innerText = elementText
                    _hoursContainer.appendChild(element)
                }
                return _hoursContainer
            case 'minutes':
                _minutesContainer = container
                let elementText = 45
                for (let i = 0; i < 12; i++) {
                    const element = document.createElement('div')
                    element.classList.add('spinner-element')
                    let innerText = _formatMinutes(elementText)
                    element.innerText = innerText
                    elementText = elementText + 5
                    if (elementText > 55) {
                        elementText = 0
                    }
                    _minutesContainer.appendChild(element)
                }
                return _minutesContainer
            case 'ampm':
                _ampmContainer = container
                const amElement = document.createElement('div')
                const pmElement = document.createElement('div')
                amElement.classList.add('spinner-element')
                pmElement.classList.add('spinner-element')
                amElement.innerText = 'AM'
                pmElement.innerText = 'PM'
                if (_currentTimeObj.ampm == 'AM') {
                    _ampmContainer.classList.toggle('am-active')
                    amElement.classList.toggle('active')
                    pmElement.classList.toggle('inactive')
                } else {
                    _ampmContainer.classList.toggle('pm-active')
                    pmElement.classList.toggle('active')
                    amElement.classList.toggle('inactive')
                }
                _ampmContainer.appendChild(amElement)
                _ampmContainer.appendChild(pmElement)
                return _ampmContainer
        }
    }

    function _createClockSpinner() {
        let spinnerTypes = ['hours', 'minutes', 'ampm']
        const container = document.createElement('div')
        container.classList.add('spinner-container')
        container.setAttribute('id', 'clockContainer')
        
        spinnerTypes.forEach(type => {
            const spinnerTimeContainer = _createSpinner(type)

            spinnerTimeContainer.addEventListener('wheel', (e) => {
                if (e.wheelDelta < 0) {
                    if (type !== 'ampm') {
                        _handleScrollDown(spinnerTimeContainer)
                    } else {
                        _handleAmPmScrollDown(spinnerTimeContainer)
                    }
                } else {
                    if (type !== 'ampm') {
                        _handleScrollUp(spinnerTimeContainer)
                    } else {
                        _handleAmPmScrollUp(spinnerTimeContainer)
                    }
                }
                _handleAnswer()
            })

            _handleStyles(spinnerTimeContainer)

            container.appendChild(spinnerTimeContainer)
        })

        return container
    }

    function init() {
        _getCurrentTime()
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
        _clockContainer = _createClockSpinner()

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

            // check if the date input is hidden
            _dateSelectorIsHidden = DateSelector.getIsHidden()
            if (_dateSelectorIsHidden && !_isHidden) {
                DateSelector.toggleSelector()
            }
            
            _toggleQuestionVisibility(isChecked)
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

        _timeSelectorInput.appendChild(_clockContainer)
        
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