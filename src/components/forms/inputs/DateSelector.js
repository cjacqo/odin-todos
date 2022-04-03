import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import { getDayText, getMonthText, getTodaysDate, getMonth, getDays, getMonthIndex } from "../../../functions"

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
    let _isHidden = true
    let _calendarDateElements = []
    const _placeholder = 'Date'
    const _today = getTodaysDate()

    function _handleStyleOfDateSelection(selectedDayNumber, selectedMonthNumber) {
        const calendarDateElements = document.querySelectorAll('.calendar-day-option')
        calendarDateElements.forEach(calendarDate => {
            const { dayNumber, monthNumber } = calendarDate.dataset
            if (selectedDayNumber && selectedMonthNumber) {
                if (calendarDate.classList.contains('active') && selectedDayNumber === dayNumber && selectedMonthNumber === monthNumber) {
                    return
                } else if (calendarDate.classList.contains('active')) {
                    if (selectedDayNumber !== dayNumber && selectedMonthNumber !== monthNumber) {
                        calendarDate.classList.remove('active')
                    }
                } else if (!calendarDate.classList.contains('active') && selectedDayNumber == dayNumber && selectedMonthNumber == monthNumber){
                    calendarDate.classList.add('active')
                }
            }
        })
        return
    }

    function _setAnswer(dateSelected) {
        _answer = _getDateAsObject(dateSelected)
        return _answer
    }

    function _getDateAsObject(dateSelected) {
        const today = new Date()

        let selectedDayOfWeek
        let selectedMonth
        let selectedMonthNumber
        let selectedDayNumber
        let selectedYear
        let answerString

        if (dateSelected) {
            let theDate = new Date(dateSelected)
            selectedDayOfWeek = getDayText(theDate.getDay())
            selectedMonth = getMonthText(theDate.getMonth())
            selectedMonthNumber = getMonthIndex(selectedMonth)
            selectedDayNumber = theDate.getDate()
            selectedYear = theDate.getFullYear()
            answerString = _dateToString(today, theDate, selectedDayOfWeek, selectedMonth, selectedDayNumber, selectedYear)
        } else if (!dateSelected) {
            selectedDayOfWeek = getDayText(today.getDay())
            selectedMonth = getMonthText(today.getMonth())
            selectedMonthNumber = getMonthIndex(selectedMonth)
            selectedDayNumber = today.getDate()
            selectedYear = today.getFullYear()
            answerString = `Today`
        }

        let answerObj = {
            day: selectedDayOfWeek,
            month: selectedMonth,
            monthNumber: selectedMonthNumber,
            dayNumber: selectedDayNumber,
            year: selectedYear,
            string: answerString
        }

        return answerObj
    }

    function _dateToString(today, dateSelected, selectedDayOfWeek, selectedMonth, selectedDayNumber, selectedYear) {
        const yesterday = new Date()
        const tomorrow = new Date()
        tomorrow.setDate(today.getDate() + 1)
        yesterday.setDate(today.getDate() - 1)

        if (dateSelected.toDateString() === today.toDateString()) {
            return 'Today'
        } else if (dateSelected.toDateString() === yesterday.toDateString()) {
            return 'Yesterday'
        } else if (dateSelected.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow'
        } else {
            return `${selectedDayOfWeek}, ${selectedMonth} ${selectedDayNumber}, ${selectedYear}`
        }
    }

    function _setHiddenInputValue() {
        const copy = _answer
        let { monthNumber, dayNumber, year } = copy
        monthNumber = monthNumber < 10 ? '0' + monthNumber : monthNumber
        dayNumber = dayNumber < 10 ? '0' + dayNumber : dayNumber
        _hiddenInput.setAttribute('value', `${year}-${monthNumber}-${dayNumber}`)
        return
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
        let dateObj = getTodaysDate()
        if (_calendarObj) {
            dateObj = _getDateAsObject(_answer)
        }

        if (dayNumber === _answer.dayNumber && monthNumber === _answer.monthNumber) {
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
            dateObj = _getDateAsObject(_answer)
            _setHiddenInputValue(dayNumber, monthNumber, dateObj.year)
            _handleStyleOfDateSelection(dayNumber, monthNumber)
            _updateQuestionAnswerDisplay(dateObj)
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

        if (!_answer) {
            _setAnswer()
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
    
    function _toggleQuestionVisibility(isChecked) {
        // HIDE
        if (_isHidden) {
            _dateSelectorInput.classList.add('hidden')
            if (_hiddenInput.value && !isChecked) {
                _setAnswer()
                _createCalendarObj()
                _createCalendar()
                _updateTitle()
                _hiddenInput.removeAttribute('value')
            }
        } else { // SHOW
            _dateSelectorInput.classList.remove('hidden')
            _createBottomRow(true)
            if (!_hiddenInput.value && isChecked) {
                _answer = _getDateAsObject()
                _setHiddenInputValue()
            }
        }
        _updateQuestionAnswerDisplay()
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
        _dateSelectorInput.classList.add('date-picker-container', 'collapsible-input', 'hidden')
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

        _questionTitle.innerText = _placeholder

        _questionTitleContainer.appendChild(_questionTitle)
        _questionTitleContainer.appendChild(_questionAnswer)

        _toggleInput.addEventListener('click', (e) => {
            e.stopImmediatePropagation()
            const isChecked = e.target.checked
            _isHidden = !isChecked
            _toggleQuestionVisibility(isChecked)
        })

        _questionTitleContainer.addEventListener('click', (e) => {
            e.stopImmediatePropagation()
            if (_toggleInput.checked) {
                _isHidden = !_isHidden
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
    function getAnswer() { return _hiddenInput.value }

    return {
        init: init,
        getInput: getInput,
        getAnswer: getAnswer
    }
})()

export default DateSelector