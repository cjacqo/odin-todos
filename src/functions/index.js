import Controller from "../controller"

const removeSpacesToLowerCase = (str) => {
    return str.replace(/\s/g, '').toLowerCase()
}

const capitalizeString = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const handlePageSelection = (page, container) => {
    container.innerHTML = page
}

/* HANDLE DATES */
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const getTodaysDate = () => {
    const theDate = new Date()
    const dateObj = {
        monthNumber: theDate.getMonth(),
        monthName: months[theDate.getMonth()],
        dayNumber: theDate.getDate(),
        dayName: days[theDate.getDay()],
        year: theDate.getFullYear()
    } 
    return dateObj
}

const getDays = () => {
    return days.map(day => day.substring(0, 3).toUpperCase())
}

const getDayText = (dayIndex) => {
    return days[dayIndex]
}

const getMonthText = (monthIndex) => {
    return months[monthIndex]
}

const getDaysOfMonth = (monthIndex, year) => {
    const today = getTodaysDate()
    let answer
    let totalDays = 31
    if (monthIndex == 1) {
        totalDays = 28
    } else if (monthIndex == 3 || monthIndex == 5 || monthIndex == 8 || monthIndex == 10) {
        totalDays = 30
    }

    // - find the day of the week for the first of the month
    const temp = new Date(`${months[monthIndex]} 1, ${year}`)
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
                    const dateSelected = new Date(`${months[monthIndex]} ${countOfDays}, ${year}`)

                    container.addEventListener('click', (e) => {
                        const data = e.currentTarget.dataset.dateOfWeek
                        answer = Controller.handleDayOfWeekSelection(dateSelected, data, monthIndex)
                        // console.log(dateInput)
                        // dateInput.setAttribute('value', answer.year + '-' + answer.month + '-' + answer.day)
                        // console.log(dateInput.value)
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
                    const dateSelected = new Date(`${months[monthIndex]} ${countOfDays}, ${year}`)
                    container.addEventListener('click', (e) => {
                        const data = e.currentTarget.dataset.dateOfWeek
                        answer = Controller.handleDayOfWeekSelection(dateSelected, data, monthIndex)
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
    
    generateDayElement(theFirst)

    return elements
}

const generateDayElement = (theFirstDayIndex) => {
    console.log(theFirstDayIndex)
}

const changeMonth = (value) => {
    console.log(value)
}

export {removeSpacesToLowerCase, capitalizeString, handlePageSelection, getTodaysDate, getDays, getDayText, getMonthText, getDaysOfMonth, changeMonth}