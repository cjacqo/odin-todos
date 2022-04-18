import FormInputControl from "."
import Controller from "../../../controller"

const TextInput = (function() {
    let _textInput
    let _textArea

    function _setAtts(input, attributes) {
        input.setAttribute('autocomplete', 'off')
        input.setAttribute('required', true)
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

    function _createTextInput() {
        const input = document.createElement('input')
        input.setAttribute('type', 'text')
        return input
    }

    function _createTextArea() {
        const input = document.createElement('textarea')
        return input
    }

    function init(inputObj) {
        const { type, attributes } = inputObj
        switch (type) {
            case 'text':
                _textInput = _createTextInput()
                _setAtts(_textInput, attributes)
                return _textInput
            case 'textarea':
                _textArea = _createTextArea()
                _setAtts(_textArea, attributes)
                return _textArea
        }
    }

    return {
        init: init
    }
})()

export default TextInput