import Controller from "../../../controller"
import { changeCalendar, getTodaysDate, generateDayElement, getMonth, getDays, getDaysOfMonth, get, changeCalendarTodaysDate, getCalendarObj } from "../../../functions"

const createCalendarDays = (monthIndex, year) => {
    const today = getTodaysDate()
    let answer
    let totalDays = 31
    if (monthIndex == 1) {
        totalDays = 28
    } else if (monthIndex == 3 || monthIndex == 5 || monthIndex == 8 || monthIndex == 10) {
        totalDays = 30
    }

    // - find the day of the week for the first of the month
    const temp = new Date(`${getMonth(monthIndex)} 1, ${year}`)
    const theFirst = temp.getDay()

    let elements = []

    // --- Loop for number of rows there are in the calendar
    let countOfDays = 1
    for (let i = 0; i < 5; i++) {
        // --- Loop over how many days of the week there are
        //         + if it is the first row, subtract total number of days by the
        //           first variable (the index value of the day of first of the month)
        if (i === 0) {
            for (let j = 0; j < 7 - theFirst; j++) {
                if (countOfDays !== 8 - theFirst) {
                    const container = document.createElement('div')
                    container.classList.add('calendar-day-option', `row-${i + 1}`, `col-${theFirst + j}`, `${countOfDays === today.dayNumber && 'active'}`)
                    container.setAttribute('data-date-of-week', countOfDays)
                    const daySelectionText = document.createElement('p')
                    const dateSelected = new Date(`${getMonth(monthIndex)} ${countOfDays}, ${year}`)

                    container.addEventListener('click', (e) => {
                        const data = e.currentTarget.dataset.dateOfWeek
                        Controller.handleStyleOfDateSelection(data)
                        answer = Controller.handleDayOfWeekSelection(dateSelected, monthIndex)
                        e.stopPropagation()
                    })
                    daySelectionText.innerText = countOfDays
                    container.appendChild(daySelectionText)
                    elements.push(container)
                    countOfDays++
                }
            }
        } else {// + any other row. Will create 7 elements for the day of that week
            for (let j = 0; j < 7; j++) {
                if (countOfDays <= totalDays) {
                    const container = document.createElement('div')
                    container.classList.add('calendar-day-option', `row-${i + 1}`, `col-${j}`, `${countOfDays === today.dayNumber && 'active'}`)
                    container.setAttribute('data-date-of-week', countOfDays)
                    const daySelectionText = document.createElement('p')
                    const dateSelected = new Date(`${getMonth(monthIndex)} ${countOfDays}, ${year}`)
                    container.addEventListener('click', (e) => {
                        const data = e.currentTarget.dataset.dateOfWeek
                        Controller.handleStyleOfDateSelection(data)
                        answer = Controller.handleDayOfWeekSelection(dateSelected, monthIndex)
                        e.stopPropagation()
                    })
                    daySelectionText.innerText = countOfDays
                    container.appendChild(daySelectionText)
                    elements.push(container)
                    countOfDays++
                }
            }
        }
    }

    console.log(elements)
    
    generateDayElement(theFirst)

    return elements
}

const CurrentCalendar = (function() {
    let _calendarObj

    function _createCalendarObj(monthNumber, year) {
        let theDate
        let calendarObj
        if (!monthNumber && !year) {
            theDate = new Date()
            calendarObj = {
                monthNumber: theDate.getMonth(),
                monthName: getMonth(theDate.getMonth()),
                year: theDate.getFullYear()
            } 
        } else {
            calendarObj = {
                monthNumber: monthNumber,
                monthName: getMonth(monthNumber),
                year: year
            }
        }
        
        return calendarObj
    }

    function _createCalendarView() {
        let { monthNumber, monthName, year } = _calendarObj

        const calendarTitleText = document.getElementById('monthAndYearTitle')
        const calendarContainer = document.querySelector('.calendar-container')
        const removedContainer = document.getElementById('bottomRow')

        if (removedContainer) {
            removedContainer.remove()
        }

        calendarTitleText.innerText = monthName + ' ' + year
        
        const bottomRowContainer = document.createElement('div')
        bottomRowContainer.classList.add('date-picker-row', 'grid')
        bottomRowContainer.setAttribute('id', 'bottomRow')
        const days = getDays()
        const daysOfMonth = createCalendarDays(monthNumber, year)
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

        daysOfMonth.forEach(element => {
            bottomRowContainer.appendChild(element)
        })
        calendarContainer.appendChild(bottomRowContainer)
    }

    const _init = (function() {
        _calendarObj = _createCalendarObj()
    })()
    
    function getCalendarObj() {return _calendarObj}
    function setCalendarObj(monthNumber, year) {
        _calendarObj = _createCalendarObj(monthNumber, year)
    }
    function getCalendarView() {return _createCalendarView()}

    return {
        getCalendarObj,
        setCalendarObj,
        getCalendarView
    }
})()

const DatePicker = () => {
    let currentCalendar = CurrentCalendar.getCalendarObj()

    const datePickerContainer = document.createElement('div')
    const calendarContainer = document.createElement('div')

    datePickerContainer.classList.add('date-picker-container')
    calendarContainer.classList.add('calendar-container', 'flex', 'col')

    function createTopRow() {
        const topRowContainer = document.createElement('div')
        const monthTitleContainer = document.createElement('div')
        const monthSelectionArrowsContainer = document.createElement('div')
        const monthTitleTextElement = document.createElement('p')
        const prevMonthContainer = document.createElement('button')
        const nextMonthContainer = document.createElement('button')
        const prevMonthArrow = document.createElement('i')
        const nextMonthArrow = document.createElement('i')
    
        topRowContainer.classList.add('date-picker-row', 'flex')
        topRowContainer.setAttribute('id', 'topRow')
        monthTitleContainer.classList.add('month-title-container')
        monthTitleTextElement.setAttribute('id', 'monthAndYearTitle')
        monthSelectionArrowsContainer.classList.add('month-selection-arrows-container', 'flex')
    
        monthTitleTextElement.innerText = currentCalendar.monthName + ' ' + currentCalendar.year
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
            let { monthNumber, year } = currentCalendar
            monthNumber = monthNumber - 1
            if (monthNumber < 0) {
                monthNumber = 11
                year = year - 1
            }
            currentCalendar = CurrentCalendar.setCalendarObj(monthNumber, year)
            currentCalendar = CurrentCalendar.getCalendarObj()         
            CurrentCalendar.getCalendarView()
        })

        nextMonthContainer.addEventListener('click', (e) => {
            e.preventDefault()
            let { monthNumber, year } = currentCalendar
            monthNumber = monthNumber + 1
            if (monthNumber > 11) {
                monthNumber = 0
                year = year + 1
            }
            currentCalendar = CurrentCalendar.setCalendarObj(monthNumber, year)
            currentCalendar = CurrentCalendar.getCalendarObj()         
            CurrentCalendar.getCalendarView()
        })
        
        monthTitleContainer.appendChild(monthTitleTextElement)
        monthSelectionArrowsContainer.appendChild(prevMonthContainer)
        monthSelectionArrowsContainer.appendChild(nextMonthContainer)
        topRowContainer.appendChild(monthTitleContainer)
        topRowContainer.appendChild(monthSelectionArrowsContainer)

        return topRowContainer
    }

    function createBottomRow() {
        let { monthNumber, year } = currentCalendar

        const bottomRowContainer = document.createElement('div')
        bottomRowContainer.classList.add('date-picker-row', 'grid')
        bottomRowContainer.setAttribute('id', 'bottomRow')
        const days = getDays()
        const daysOfMonth = createCalendarDays(monthNumber, year)
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

        daysOfMonth.forEach(element => {
            bottomRowContainer.appendChild(element)
        })
        return bottomRowContainer
    }

    const topRow = createTopRow()
    const bottomRow = createBottomRow(currentCalendar)

    calendarContainer.appendChild(topRow)
    calendarContainer.appendChild(bottomRow)
    datePickerContainer.appendChild(calendarContainer)
    return datePickerContainer
}

export {DatePicker, CurrentCalendar}