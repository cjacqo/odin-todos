import { changeMonth, getDays, getDaysOfMonth, getTodaysDate } from "../../../functions"

const DatePicker = () => {
    const theDate = getTodaysDate()

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
        monthSelectionArrowsContainer.classList.add('month-selection-arrows-container', 'flex')
    
        monthTitleTextElement.innerText = theDate.monthName
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
            changeMonth(-1)
            console.log("Previous Month")
        })

        nextMonthContainer.addEventListener('click', (e) => {
            e.preventDefault()
            changeMonth(1)
            console.log("Next Month")
        })
        
        monthTitleContainer.appendChild(monthTitleTextElement)
        monthSelectionArrowsContainer.appendChild(prevMonthContainer)
        monthSelectionArrowsContainer.appendChild(nextMonthContainer)
        topRowContainer.appendChild(monthTitleContainer)
        topRowContainer.appendChild(monthSelectionArrowsContainer)

        return topRowContainer
    }

    function createBottomRow() {
        const bottomRowContainer = document.createElement('div')
        bottomRowContainer.classList.add('date-picker-row', 'grid')
        bottomRowContainer.setAttribute('id', 'bottomRow')
        const days = getDays()
        const daysOfMonth = getDaysOfMonth(theDate.monthNumber, theDate.year)
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
        daysOfMonth.forEach(element => {
            bottomRowContainer.appendChild(element)
        })
        return bottomRowContainer
    }

    const topRow = createTopRow()
    const bottomRow = createBottomRow()

    calendarContainer.appendChild(topRow)
    calendarContainer.appendChild(bottomRow)
    datePickerContainer.appendChild(calendarContainer)
    return datePickerContainer
}

export default DatePicker