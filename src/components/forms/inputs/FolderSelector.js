const FolderSelector = (function() {
    let _selectInput
    let _options = []

    function _setAtts(input, attributes) {
        attributes.forEach(attribute => {
            const { name, value } = attribute
            if (value) {
                input.setAttribute(`${name}`, `${value}`)
            }
        })
        input.addEventListener('input', (e) => {
            Controller.handleTextInput(e)
        })
        return
    }

    function init(attributes, options) {
        _options = options
        _selectInput = document.createElement('select')
        _selectInput.setAttribute('name', name)
        console.log(options)
        _options.forEach(_option => {
            const selectOption = document.createElement('option')
            selectOption.setAttribute('value', _option.getName())
            selectOption.innerText = _option.getName()
            _selectInput.appendChild(selectOption)
        })
        _setAtts(_selectInput, attributes)
        return _selectInput
    }

    return {
        init: init
    }
})()

export default FolderSelector