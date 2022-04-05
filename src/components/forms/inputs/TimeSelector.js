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

    function _roundToNearestHour() {
        const tempDate = _today
        tempDate.setHours(tempDate.getHours() + 1)
        tempDate.setMinutes(0, 0, 0)
        console.log(tempDate.getHours())
        return tempDate
    }

    function _updateQuestionAnswerDisplay() {
        if (_isHidden && !_hiddenInput.value) {
            _questionAnswer.classList.remove('active')
            _questionAnswer.innerText = ''
        } else if (!_isHidden && !_questionAnswer.classList.contains('active')) {
            _questionAnswer.classList.add('active')
            _questionAnswer.innerText = _answer.timeString
        }
    }

    function _toggleQuestionVisibility(isChecked, remainHidden) {
        if (_isHidden) {
            _timeSelectorInput.classList.add('hidden')
            _hiddenInput.removeAttribute('value')
            if (_hiddenInput.value && !isChecked) {
                // RESET THE INPUT TO DEFAULT
                console.log(_hiddenInput)
            }
        } else {
            _timeSelectorInput.classList.remove('hidden')
            // DISPLAY THE CLOCK
            if (!_hiddenInput.value && isChecked) {
                // CREATE THE DEFAULT ANSWER (CLOSEST TIME WITHIN 5 MINUTES) 
                // WHEN THE INPUT IS TOGGLED ON
                _answer = _currentTimeObj
                _hiddenInput.setAttribute('value', _answer.timeValue)
            }
        }
        _updateQuestionAnswerDisplay()
    }

    function _moduloFix(hours) {
        return ((hours % 12) + 12) % 12;
    }

    function _formatHours(hours) {
        hours = hours % 12
        hours = hours ? hours : 12
        return hours
    }

    function _formatMinutes(minutes) {
        return minutes >= 10 ? minutes : '0' + minutes
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
        let roundedHour = _formatHours(roundedTime.getHours() % 12)

        return _currentTimeObj = {
            timeValue,
            hours,
            minutes,
            ampm,
            timeString,
            roundedHour
        }
    }

    function _handleScrollDown(container) {
        let top = container.children[0].cloneNode(true)
        container.children[0].remove()
        container.appendChild(top)
        _handleStyles(container)
    }

    function _handleScrollUp(container) {
        let bottom = container.children[container.children.length - 1].cloneNode(true)
        container.children[container.children.length - 1].remove()
        container.prepend(bottom)
        _handleStyles(container)
    }

    function _handleStyles(container) {
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
                break
        }
    }

    function _createClockSpinner() {
        // let spinnerTypes = ['hours', 'minutes', 'ampm']
        let spinnerTypes = ['hours', 'minutes']
        const container = document.createElement('div')
        container.classList.add('spinner-container')
        container.setAttribute('id', 'clockContainer')
        
        spinnerTypes.forEach(type => {
            const spinnerTimeContainer = _createSpinner(type)

            spinnerTimeContainer.addEventListener('wheel', (e) => {
                if (e.wheelDelta < 0) {
                    _handleScrollDown(spinnerTimeContainer)
                } else {
                    _handleScrollUp(spinnerTimeContainer)
                }
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