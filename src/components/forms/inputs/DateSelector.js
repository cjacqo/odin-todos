import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import { getDayText, getMonthText, getTodaysDate, getMonth, getDays, getCalendarObj } from "../../../functions"

const DateSelector = (function() {
    let _formInputControl
    let _formInputLabel
    let _dateSelectorInput
    let _toggleInput
    let _checkBoxLabel
    let _checkBoxSlider
    let _iconContainer
    let _icon
    let _questionTitleContainer
    let _questionTitle
    let _questionAnswer
    let _calendarObj
    let _answer
    let _topRow
    let _monthTitleTextElement
    let _bottomRow
    let _hiddenInput
    let _calendarDateElements = []
    const _placeholder = 'Date'
    const _today = getTodaysDate()

    function _handleStyleOfDateSelection(selectedDayNumber, selectedMonthNumber) {
        const calendarDateElements = document.querySelectorAll('.calendar-day-option')
        calendarDateElements.forEach(calendarDate => {
            console.log(calendarDate)
            const { dayNumber, monthNumber } = calendarDate.dataset
            console.log(calendarDate.classList.contains('active'))
            console.log(selectedDayNumber !== dayNumber && selectedMonthNumber !== monthNumber)
            console.log(selectedDayNumber !== dayNumber)
            if (selectedDayNumber && selectedMonthNumber) {
                if (calendarDate.classList.contains('active') && selectedDayNumber === dayNumber && selectedMonthNumber === monthNumber) {
                    return
                } else if (calendarDate.classList.contains('active')) {
                    if (selectedDayNumber !== dayNumber && selectedMonthNumber !== monthNumber) {
                        console.log("HI")
                        calendarDate.classList.remove('active')
                    }
                } else if (!calendarDate.classList.contains('active') && selectedDayNumber == dayNumber && selectedMonthNumber == monthNumber){
                    calendarDate.classList.add('active')
                }
            }
        })
        console.log(calendarDateElements)
        return
    }

    function _setAnswer(dateSelected) {
        _answer = dateSelected
        return _answer
    }

    function _createCalendarObj(monthNumber, year) {
        if (!monthNumber && !year) {
            _calendarObj = {
                monthNumber: _today.monthNumber,
                monthName: _today.monthName,
                year: _today.year
            }
        } else {
            _calendarObj = {
                monthNumber: monthNumber,
                monthName: getMonth(monthNumber),
                year: year
            }
        }
        return _calendarObj
    }

    function _calendarDayElement(row, col, dayNumber, monthNumber, year) {
        const container = document.createElement('div')
        container.classList.add('calendar-day-option', `row-${row + 1}`, `col-${col}`)
        let dateObj
        if (_answer) {
            dateObj = getCalendarObj(_answer)
        } else {
            dateObj = getTodaysDate()
        }
        if (dayNumber === dateObj.dayNumber && monthNumber === dateObj.monthNumber) {
            container.classList.add('active')
        }
        if (dayNumber === _today.dayNumber && monthNumber === _today.monthNumber) {
            container.classList.add('today')
        }
        container.setAttribute('data-day-number', dayNumber)
        container.setAttribute('data-month-number', monthNumber)
        const daySelectionText = document.createElement('p')
        const dateSelected = new Date(`${getMonth(monthNumber)} ${dayNumber}, ${year}`)

        container.addEventListener('click', (e) => {
            e.preventDefault()
            _setAnswer(dateSelected)
            _handleStyleOfDateSelection(dayNumber, monthNumber)
        })
        daySelectionText.innerText = dayNumber
        container.appendChild(daySelectionText)
        return container
    }

    function _createCalendar() {
        let maxDays = 31

        if (!_calendarObj) {
            _createCalendarObj()
        }

        if (_calendarDateElements.length > 0) {
            _calendarDateElements = []
        }

        const { monthNumber, year } = _calendarObj
        if (monthNumber == 1) {
            maxDays = 28
        } else if (monthNumber == 3 || monthNumber == 5 || monthNumber == 8 || monthNumber == 10) {
            maxDays = 30
        }

        const temp = new Date(`${getMonth(monthNumber)} 1, ${year}`)
        const theFirst = temp.getDay()

        let countOfDays = 1
        for (let i = 0; i < 6; i++) {
            // --- Loop over how many days of the week there are
            //         + if it is the first row, subtract total number of days by the
            //           first variable (the index value of the day of first of the month)
            if (i === 0) {
                for (let j = 0; j < 7 - theFirst; j++) {
                    if (countOfDays !== 8 - theFirst) {
                        const element = _calendarDayElement(i, theFirst + j, countOfDays, monthNumber, year)
                        _calendarDateElements.push(element)
                        countOfDays++
                    }
                }
            } else {
                for (let j = 0; j < 7; j++) {
                    if (countOfDays <= maxDays) {
                        const element = _calendarDayElement(i, j, countOfDays, monthNumber, year)
                        _calendarDateElements.push(element)
                        countOfDays++
                    }
                }
            }
        }
    }

    function _updateTitle() {
        _monthTitleTextElement.innerText = _calendarObj.monthName + ' ' + _calendarObj.year
    }

    function _updateQuestionAnswerDisplay(value, isHidden) {
        if (isHidden && !value) {
            _dateSelectorInput.classList.remove('active')
        } else if (!isHidden && !_dateSelectorInput.classList.contains('active')) {
            _dateSelectorInput.classList.add('active')
        }

        if (value) {
            _dateSelectorInput.innerText = value.string
        } else {
            _dateSelectorInput.innerText = ''
        }
    }

    function _getDateAsObj(dateSelected) {
        const today = new Date()
        const yesterday = new Date()
        const tomorrow = new Date()
        yesterday.setDate(today.getDate() - 1)
        tomorrow.setDate(today.getDate() + 1)

        let selectedDayOfWeek
        let selectedMonth
        let selectedDayOfMonth
        let selectedYear
        let answerString
        
        if (dateSelected) {
            let theValue = typeof dateSelected === 'string' ? new Date(dateSelected) : dateSelected
            selectedDayOfWeek = getDayText(theValue.getDay())
            selectedMonth = getMonthText(theValue.getMonth())
            selectedDayOfMonth = theValue.getDate()
            selectedYear = theValue.getFullYear()

            if (theValue.toDateString() === today.toDateString()) {
                answerString = 'Today'
            } else if (theValue.toDateString() === yesterday.toDateString()) {
                answerString = 'Yesterday'
            } else if (theValue.toDateString() === tomorrow.toDateString()) {
                answerString = 'Tomorrow'
            } else {
                answerString = `${selectedDayOfWeek}, ${selectedMonth} ${selectedDayOfMonth}, ${selectedYear}`
            }
        } else if (!dateSelected) {
            selectedDayOfWeek = getDayText(today.getDay())
            selectedMonth = getMonthText(today.getMonth())
            selectedDayOfMonth = today.getDate()
            selectedYear = today.getFullYear()
            answerString = `Today`
        }
        
        let answerObj = {
            day: selectedDayOfWeek,
            month: selectedMonth,
            date: selectedDayOfMonth,
            year: selectedYear,
            string: answerString
        }

        return answerObj
    }
    
    function _reformatDateValue(dateSelected) {
        const year = dateSelected.substring(0, 4)
        const month = dateSelected.substring(5, 7)
        const day = dateSelected.substring(8, 10)
        return month + '-' + day + '-' + year
    }
    
    function _toggleQuestionVisibility(isActive) {
        let valueObj
        let value
        
        if (isActive) {
            _dateSelectorInput.classList.toggle('hidden')

            if (_hiddenInput.value && typeof _hiddenInput.value === 'string') {
                value = _reformatDateValue(_hiddenInput.value)
                valueObj = _getDateAsObj(value)
                _updateQuestionAnswerDisplay(valueObj, false)
            } else {
                // Set Answer Value to Todays Date
            }
        }

        if (!isActive) {
            if (!_dateSelectorInput.classList.contains('hidden')) {
                // Set Style of Date Selection
                _dateSelectorInput.classList.add('hidden')
            }
            _hiddenInput.removeAttribute('value')
            _updateQuestionAnswerDisplay(null, isHidden)
        }
    }

    function _createTopRow() {
        const topRowContainer = document.createElement('div')
        const monthTitleContainer = document.createElement('div')
        const monthSelectionArrowsContainer = document.createElement('div')
        _monthTitleTextElement = document.createElement('p')
        const prevMonthContainer = document.createElement('button')
        const nextMonthContainer = document.createElement('button')
        const prevMonthArrow = document.createElement('i')
        const nextMonthArrow = document.createElement('i')
    
        topRowContainer.classList.add('date-picker-row', 'flex')
        topRowContainer.setAttribute('id', 'topRow')
        monthTitleContainer.classList.add('month-title-container')
        _monthTitleTextElement.setAttribute('id', 'monthAndYearTitle')
        monthSelectionArrowsContainer.classList.add('month-selection-arrows-container', 'flex')

        _createCalendarObj()
        _updateTitle()
        
        prevMonthContainer.classList.add('month-selector-container', 'prev-month-selector-container')
        nextMonthContainer.classList.add('month-selector-container', 'next-month-selector-container')
        prevMonthArrow.classList.add('fa-solid', 'fa-chevron-left', 'month-selector')
        nextMonthArrow.classList.add('fa-solid', 'fa-chevron-right', 'month-selector')
        prevMonthArrow.setAttribute('id', 'prevMonthSelector')
        nextMonthArrow.setAttribute('id', 'nextMonthSelector')

        prevMonthContainer.appendChild(prevMonthArrow)
        nextMonthContainer.appendChild(nextMonthArrow)

        prevMonthContainer.addEventListener('click', (e) => {
            e.preventDefault()
            let { monthNumber, year } = _calendarObj
            monthNumber = monthNumber - 1
            if (monthNumber < 0) {
                monthNumber = 11
                year = year - 1
            }
            _createCalendarObj(monthNumber, year)
            _updateTitle()
            _createCalendar(_calendarObj)
            _createBottomRow(true)
        })

        nextMonthContainer.addEventListener('click', (e) => {
            e.preventDefault()
            let { monthNumber, year } = _calendarObj
            monthNumber = monthNumber + 1
            if (monthNumber > 11) {
                monthNumber = 0
                year = year + 1
            }
            _createCalendarObj(monthNumber, year)
            _updateTitle()
            _createCalendar(_calendarObj)
            _createBottomRow(true)
        })
        
        monthTitleContainer.appendChild(_monthTitleTextElement)
        monthSelectionArrowsContainer.appendChild(prevMonthContainer)
        monthSelectionArrowsContainer.appendChild(nextMonthContainer)
        topRowContainer.appendChild(monthTitleContainer)
        topRowContainer.appendChild(monthSelectionArrowsContainer)

        return topRowContainer
    }

    function _createBottomRow(append) {
        const removedContainer = document.getElementById('bottomRow')

        if (removedContainer) {
            removedContainer.remove()
        }

        const bottomRowContainer = document.createElement('div')
        bottomRowContainer.classList.add('date-picker-row', 'grid')
        bottomRowContainer.setAttribute('id', 'bottomRow')
        const days = getDays()

        if (!append) {
            _createCalendar()
        }

        days.forEach(day => {
            const dayContainer = document.createElement('div')
            const dayText = document.createElement('small')

            dayContainer.classList.add('calendar-day-container')
            dayContainer.setAttribute('id', day)
            dayText.classList.add('calendar-day')
            dayText.innerText = day

            dayContainer.appendChild(dayText)
            bottomRowContainer.appendChild(dayContainer)
        })

        if (bottomRowContainer.children.length > 0) {
            const dateOptions = document.querySelectorAll('.calendar-day-option')
            dateOptions.forEach(option => option.remove())
        }

        _calendarDateElements.forEach(element => {
            bottomRowContainer.appendChild(element)
        })

        if (!append) {
            return bottomRowContainer
        } else {
            _dateSelectorInput.appendChild(bottomRowContainer)
        }
    }

    function init() {
        _formInputControl = document.createElement('div')
        _formInputLabel = document.createElement('label')
        _dateSelectorInput = document.createElement('div')
        _hiddenInput = document.createElement('input')
        _toggleInput = document.createElement('input')
        _checkBoxLabel = document.createElement('label')
        _checkBoxSlider = document.createElement('div')
        _iconContainer = document.createElement('div')
        _icon = document.createElement('i')
        _questionTitleContainer = document.createElement('div')
        _questionTitle = document.createElement('p')
        _questionAnswer = document.createElement('small')
        _topRow = _createTopRow()
        _bottomRow = _createBottomRow()

        _formInputControl.classList.add('form-control', 'flex')
        _formInputControl.setAttribute('id', 'todo-dateControl')
        _dateSelectorInput.classList.add('date-picker-container')
        _dateSelectorInput.setAttribute('id', 'todoDueDateInput')
        _hiddenInput.classList.add('hidden-input')
        _hiddenInput.setAttribute('id', `dateHiddenInput`)
        _hiddenInput.setAttribute('type', 'date')
        _toggleInput.classList.add('toggle-input-visibility')
        _toggleInput.setAttribute('type', 'checkbox')
        _toggleInput.setAttribute('id', `todoDueDateToggle`)
        _checkBoxLabel.classList.add('switch-label')
        _checkBoxSlider.classList.add('slider', 'round')
        _checkBoxLabel.setAttribute('for', `todoDueDateToggle`)
        _iconContainer.classList.add('input-icon-container')
        _iconContainer.setAttribute('id', `dateIconContainer`)
        _icon.classList.add('fa-solid', 'fa-calendar-day')

        _questionTitleContainer.classList.add('question-title-container')
        _questionTitle.classList.add('question-title')
        _questionAnswer.classList.add('date-answer')
        _questionAnswer.setAttribute('id', `todoDueDateAnswerDisplay`)

        _bottomRow.classList.add('date-picker-row', 'grid')
        _bottomRow.setAttribute('id', 'bottomRow')

        console.log(_today)

        _questionTitle.innerText = _placeholder

        _questionTitleContainer.appendChild(_questionTitle)
        _questionTitleContainer.appendChild(_questionAnswer)

        _toggleInput.addEventListener('click', (e) => {
            e.stopImmediatePropagation()
            const isChecked = e.target.checked
            _toggleQuestionVisibility(isChecked)
        })

        _questionTitleContainer.addEventListener('click', (e) => {
            e.stopImmediatePropagation()
            if (_toggleInput.checked) {
                _toggleQuestionVisibility(true)
            }
        })

        _iconContainer.appendChild(_icon)
        _checkBoxLabel.appendChild(_toggleInput)
        _checkBoxLabel.appendChild(_checkBoxSlider)
        _dateSelectorInput.appendChild(_topRow)
        _dateSelectorInput.appendChild(_bottomRow)
        _formInputControl.appendChild(_hiddenInput)
        _formInputControl.appendChild(_iconContainer)
        _formInputControl.appendChild(_questionTitleContainer)
        _formInputControl.appendChild(_checkBoxLabel)
        _formInputControl.appendChild(_dateSelectorInput)
        return _formInputControl
    }

    function getInput() { return _formInputControl }
    function getAnswer() { return _answer }

    return {
        init: init,
        getInput: getInput,
        getAnswer: getAnswer
    }
})()

export default DateSelector