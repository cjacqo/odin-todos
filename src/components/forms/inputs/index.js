import DateSelector from "./DateSelector"
import PrioritySelector from "./PrioritySelector"
import SelectInput from "./FolderSelector"
import TextInput from "./TextInput"
import TimeSelector from "./TimeSelector"

const FormInputControl = (function() {
    let _formInputControlCreated = false
    let _formInputControlId
    let _formInputControl
    let _formInputLabel
    let _formInputs = []

    function _appendFormInputsToControl() {
        _formInputs.forEach(input => {
            _formInputControl.appendChild(input)
        })
        return
    }

    function _createFormInputControl(id) {
        const control = document.createElement('div')
        control.classList.add('form-control', 'flex')
        control.setAttribute('id', `${id}Control`)
        return control
    }

    function _createFormInput(inputObj) {
        const { type, attributes } = inputObj
        let inputElement
        console.log(type)
        switch (type) {
            case 'text':
            case 'textarea':
                inputElement = TextInput.init(type, attributes)
            case 'date':
                inputElement = DateSelector.init()
            case 'time':
                inputElement = TimeSelector.init()
            case 'radio':
                inputElement = PrioritySelector.init()
            case 'select':
                inputElement = SelectInput.init()
        }
        return inputElement
    }

    function _handleFormMeta(id, input) {
        _createFormInputControl(id)
        // _formInputs.push(_createFormInput(input))
        return
    }

    function createFormControl(id) {
        return _createFormInputControl(id)
    }

    function init(id, input) {
        _formInputControlId = id
        if (!_formInputControlCreated) {
            _handleFormMeta(id, input)
            _appendFormInputsToControl()
        }
        return _formInputControl
    }

    return {
        init: init,
        createFormControl: createFormControl
    }
})()

export default FormInputControl