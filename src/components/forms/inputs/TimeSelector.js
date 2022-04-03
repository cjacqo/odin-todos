import DateSelector from "./DateSelector"

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
    let _today = new Date()
    let _currentTimeObj
    let _hiddenInput
    let _dateSelectorIsHidden
    let _answer
    let _clockContainer
    let _hoursContainer
    let _minutesContainer
    let _ampmContainer
    let _spinnerElements = {
        _hourElements: [],
        _minuteElements: [],
        _ampmElements: []
    }
    let _hoursScrollPosition = 0
    let _minutesScrollPosition = 0

    function _getPosition(clockValue, currentValue, type) {
        switch (type) {
            case 'hours':
                if (clockValue === currentValue) {
                    return 0
                } else if (clockValue)
                break
            case 'minutes':
                break
            case 'ampm':
                break
        }
    }

    function _createOrder() {
        const { hours, minutes, ampm } = _currentTimeObj
        const { _hourElements, _minuteElements, _ampmElements } = _spinnerElements
        let minutePositionSet = false
        _hourElements.filter(el => {
            let position = el.dataset.hour - hours
            if (position === 0) {
                let offset = _hourElements.indexOf(el)
                for (let i = 0; i < _hourElements.length; i++) {
                    let pointer = (i + offset) % _hourElements.length
                    _hourElements[pointer].classList.add(`position-${i}`)
                }
            }
        })
        _minuteElements.filter(el => {
            let offset
            if (el.dataset.minute == minutes) {
                offset = _minuteElements.indexOf(el)
                minutePositionSet = true
                for (let i = 0; i < _minuteElements.length; i++) {
                    let pointer = (i + offset) % _minuteElements.length
                    _minuteElements[pointer].classList.add(`position-${i}`)
                }
            } else if (el.dataset.minute >= minutes - 5 && el.dataset.minute < minutes) {
                offset = _minuteElements.indexOf(el)
                for (let i = 0; i < _minuteElements.length; i++) {
                    let pointer = (i + offset) % _minuteElements.length
                    _minuteElements[pointer].classList.add(`position-${i}`)
                }
            }
        })
        _ampmElements.filter(el => {
            console.log(el)
            if (_currentTimeObj.ampm == el.dataset.ampm) {
                el.classList.add(`ampm-position-1`)
            } else {
                el.classList.add(`ampm-position-2`)
            }
        })
    }

    function _displaySpinnerElements() {
        const { _hourElements, _minuteElements, _ampmElements } = _spinnerElements
        _hourElements.forEach(el => {
            _hoursContainer.appendChild(el)
        })
        _minuteElements.forEach(el => {
            _minutesContainer.appendChild(el)
        })
        _ampmElements.forEach(el => {
            _ampmContainer.appendChild(el)
        })
        _clockContainer.appendChild(_hoursContainer)
        _clockContainer.appendChild(_minutesContainer)
        _clockContainer.appendChild(_ampmContainer)
    }

    function _createSpinnerElements(type) {
        let hourElements = []
        let minuteElements = []
        let ampmElements = []
        switch (type) {
            case 'hours':
                for (let i = 0; i < 12; i++) {
                    const element = document.createElement('div')
                    element.classList.add('spinner-element')
                    let hour = i
                    hour = hour % 12
                    hour = hour ? hour : 12
                    // let position = _getPosition(hour, _currentTimeObj.hours, 'hours')
                    element.setAttribute(`data-hour`, hour)
                    // element.setAttribute('data-position', position)
                    element.innerText = hour
                    hourElements.push(element)
                    _spinnerElements._hourElements.push(element)
                    // _hoursContainer.appendChild(element)
                }
                // _clockContainer.appendChild(_hoursContainer)
                // _createOrder(hourElements)
                break
            case 'minutes':
                let indexCount = 1
                for (let i = 0; i < 60; i++) {
                    if (i % 5 === 0) {
                        const element = document.createElement('div')
                        element.classList.add('spinner-element')
                        let minute = i
                        element.setAttribute(`data-minute`, minute)
                        element.setAttribute(`data-index`, indexCount)
                        element.innerText = minute < 10 ? '0'+minute : minute
                        minuteElements.push(element)
                        _spinnerElements._minuteElements.push(element)
                        indexCount++
                        // _minutesContainer.appendChild(element)
                        // _createOrder(minuteElements)
                    }
                }
                // _clockContainer.appendChild(_minutesContainer)
                break
            case 'ampm':
                const amElement = document.createElement('div')
                const pmElement = document.createElement('div')
                amElement.classList.add('ampm-element')
                pmElement.classList.add('ampm-element')
                amElement.setAttribute('data-ampm', 'am')
                pmElement.setAttribute('data-ampm', 'pm')
                amElement.innerText = 'AM'
                pmElement.innerText = 'PM'
                ampmElements.push(amElement)
                ampmElements.push(pmElement)
                // _createOrder(ampmElements)
                _spinnerElements._ampmElements.push(amElement)
                _spinnerElements._ampmElements.push(pmElement)
                break
        }
    }
    
    function _createTimeSpinner() {
    }

    function _updateQuestionAnswerDisplay() {
        if (_isHidden && !_hiddenInput.value) {
            _questionAnswer.classList.remove('active')
            _questionAnswer.innerText = ''
        } else if (!_isHidden && !_questionAnswer.classList.contains('active')) {
            _questionAnswer.classList.add('active')
        }

        if (_hiddenInput.value) {
            _questionAnswer.innerText = _answer.string
        }
    }

    function _toggleQuestionVisibility(isChecked, remainHidden) {
        if (_isHidden) {
            _timeSelectorInput.classList.add('hidden')
            if (_hiddenInput.value && !isChecked) {
                // RESET THE INPUT TO DEFAULT
            }
        } else {
            _timeSelectorInput.classList.remove('hidden')
            // DISPLAY THE CLOCK
            if (!_hiddenInput.value && isChecked) {
                // CREATE THE DEFAULT ANSWER (CLOSEST TIME WITHIN 5 MINUTES) 
                // WHEN THE INPUT IS TOGGLED ON
                // _answer = _getTimeAsObject()
            }
        }
        _updateQuestionAnswerDisplay()
    }

    function _getCurrentTime() {
        let timeValue = _today.toLocaleTimeString()
        let hours = _today.getHours()
        let minutes = _today.getMinutes()
        let ampm = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12
        hours = hours ? hours : 12
        let timeString = hours + ':' + minutes + ' ' + ampm
        return _currentTimeObj = {
            timeValue,
            hours,
            minutes,
            ampm,
            timeString
        }
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
        _clockContainer = document.createElement('div')
        _hoursContainer = document.createElement('div')
        _minutesContainer = document.createElement('div')
        _ampmContainer = document.createElement('div')

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

        _clockContainer.classList.add('spinner-container', 'grid')
        _hoursContainer.classList.add('spinner')
        _minutesContainer.classList.add('spinner')
        _ampmContainer.classList.add('spinner')
        _clockContainer.setAttribute('id', 'clockContainer')
        _hoursContainer.setAttribute('id', 'hoursContainer')
        _minutesContainer.setAttribute('id', 'minutesContainer')
        _ampmContainer.setAttribute('id', 'ampmContainer')
        
        _questionTitleContainer.classList.add('question-title-container')
        _questionTitle.classList.add('question-title')
        _questionAnswer.classList.add('time-answer')
        _questionAnswer.setAttribute('id', `todoDuetimeAnswerDisplay`)

        _questionTitle.innerText = 'Time'

        _questionTitleContainer.appendChild(_questionTitle)
        _questionTitleContainer.appendChild(_questionAnswer)

        _createSpinnerElements('hours')
        _createSpinnerElements('minutes')
        _createSpinnerElements('ampm')
        _createOrder()
        _displaySpinnerElements()

        // _createOrder()
        // _displaySpinnerElements()

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

        _hoursContainer.addEventListener('scroll', (e) => {
            let threshold = 173
            let div = e.currentTarget
            console.log(div.scrollHeight)
            if (div.scrollHeight < threshold) {
                let node = div.firstElementChild
                
                // WORK OUT HOW TO CHANGE CLASS NAMES HERE
                
                console.log(node)
                div.appendChild(node)
            } else if (div.scrollY < threshold) {
                let node = div.lastElementChild
                div.insertBefore(node, div.firstElementChild)
                div.scrollY = 2
            }
        }, false)
        
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