const removeSpacesToLowerCase = (str) => {
    return str.replace(/\s/g, '').toLowerCase()
}

const handlePageSelection = (page, container) => {
    container.innerHTML = page
}

export {removeSpacesToLowerCase, handlePageSelection}