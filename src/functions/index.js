const removeSpacesToLowerCase = (str) => {
    return str.replace(/\s/g, '').toLowerCase()
}

const capitalizeString = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const handlePageSelection = (page, container) => {
    container.innerHTML = page
}

export {removeSpacesToLowerCase, capitalizeString, handlePageSelection}