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
        year: theDate.getFullYear(),
        theDate: theDate
    } 
    return dateObj
}
const getYesterdaysDate = () => {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)
    const dateObj = {
        monthNumber: yesterday.getMonth(),
        monthName: months[yesterday.getMonth()],
        dayNumber: yesterday.getDate(),
        dayName: days[yesterday.getDay()],
        year: yesterday.getFullYear()
    }
    return dateObj
}
const getTomorrowsDate = () => {
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    const dateObj = {
        monthNumber: tomorrow.getMonth(),
        monthName: months[tomorrow.getMonth()],
        dayNumber: tomorrow.getDate(),
        dayName: days[tomorrow.getDay()],
        year: tomorrow.getFullYear()
    }
    return dateObj
}
const getCalendarObj = (answer) => {
    const obj = {
        monthNumber: answer.getMonth(),
        monthName: months[answer.getMonth()],
        dayNumber: answer.getDate(),
        dayName: days[answer.getDay()],
        year: answer.getFullYear(),
        theDate: answer
    }
    return obj
}

const getMonth = (monthIndex) => {
    return months[monthIndex]
}

const getDateAnswerAsString = (answerDateObj) => {
    const todaysDate = getTodaysDate()
    const yesterdaysDate = getYesterdaysDate()
    const tomorrowsDate = getTomorrowsDate()
    if (todaysDate === answerDateObj) {
        return 'Today'
    } else if (yesterdaysDate === answerDateObj) {
        return 'Yesterday'
    } else if (tomorrowsDate === answerDateObj) {
        return 'Tomorrow'
    } else {
        console.log('Return date String Here')
    }
    console.log(answerDateObj)
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

const generateDayElement = (theFirstDayIndex) => {
    console.log(theFirstDayIndex)
}

const changeCalendar = (value, currentMonth, element) => {
    const monthIndex = months.indexOf(currentMonth)
    let setMonthIndex = (monthIndex + value)

    if (setMonthIndex == -1) {
        setMonthIndex = 11
    }
    if (setMonthIndex == 12) {
        setMonthIndex = 0
    }

    const newMonthText = months[setMonthIndex]
    element.innerText = newMonthText
}

const dateValueToString = (theDate) => {
    const today = new Date()
    const yesterday = new Date()
    const tomorrow = new Date()
    const theDateSelection = new Date(theDate)
    console.log(theDate)
}

export {removeSpacesToLowerCase, capitalizeString, getCalendarObj, handlePageSelection, getTodaysDate, getMonth, getDays, getDayText, getMonthText, changeCalendar, dateValueToString, getDateAnswerAsString, generateDayElement}