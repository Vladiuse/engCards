

// добавить из обьекта ошибки в форму
function addErrorsInForm(form, data) {
    // non_field_errors
    for (var [key, value] of Object.entries(data)) {
        if (key == 'non_field_errors') {
            var errorTextBlock = form.querySelector('.non-field-invalid-feedback')
            var inputElem = form
        } else {
            var errorTextBlock = form.querySelector(`input[name="${key}"] + .invalid-feedback`) // нет поддержки других типов элементов
            var inputElem = form.querySelector(`input[name="${key}"]`)
        }
        if (errorTextBlock){
            errorTextBlock.innerHTML = value
            inputElem.classList.add('is-invalid')
        } else {
            console.info(`Error_block for key "${key}"" not found\n${value}`)
        }
        
    }
}


var bsSpiner = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="false" ></span>'

function addSpinerInSubmitButton(button) {
    var currentText = button.innerHTML
    button.innerHTML = bsSpiner + 'Загрузка'
    return currentText
}
function removeSpinerFromButton(button, text) {
    button.innerHTML = text
}

// убрать клас is-invalid с элемента и также убрать с формы
function removeIsInvalid(elem){
    elem.classList.remove('is-invalid')
    var form = elem.closest('form')
    form.classList.remove('is-invalid')
}


function toggleForm(form, disable = true) {
    const elements = form.querySelectorAll("input, textarea, select, button");
    elements.forEach(el => el.disabled = disable);
}

// Отключить форму
function disableForm(form) {
    toggleForm(form, true);
}

// Включить форму
function enableForm(form) {
    toggleForm(form, false);
}


class BsJsonForm{
    constructor(elem){
        this.elem = elem
        this.is_disabled = false
        this._btn_old_text = ''
        this._add_events()

    }

    _add_events(){
        this.elem.querySelectorAll('input.form-control').forEach(elem => {  // нет поддержки других типов элементов
            elem.addEventListener('input', () => removeIsInvalid(elem))
        })
    }

    get submitButton(){
        return this.elem.querySelector('button[type=submit]')
    }

    toDict(formData) {
        if (this.is_disabled){
            throw new Error("Cant get data - form disabled");
        }
        var formData = new FormData(this.elem)
        return Object.fromEntries(formData.entries());
    }
    
    disable(){
        this._btn_old_text = addSpinerInSubmitButton(this.submitButton)
        disableForm(this.elem)
        this.is_disabled = true
    }
    enable(){
        removeSpinerFromButton(this.submitButton, this._btn_old_text)
        enableForm(this.elem)
        this.is_disabled = false
    }

    showErrors(data) {
        // non_field_errors
        for (var [key, value] of Object.entries(data)) {
            if (key == 'non_field_errors') {
                var errorTextBlock = this.elem.querySelector('.non-field-invalid-feedback')
                var inputElem = this.elem
            } else {
                var errorTextBlock = this.elem.querySelector(`input[name="${key}"] + .invalid-feedback`) // нет поддержки других типов элементов
                var inputElem = this.elem.querySelector(`input[name="${key}"]`)
            }
            if (errorTextBlock){
                errorTextBlock.innerHTML = value
                inputElem.classList.add('is-invalid')
            } else {
                console.info(`Error_block for key "${key}"" not found\n${value}`)
            }
            
        }
    }

    feed(data) {
        for (var [key, value] of Object.entries(data)) {
            var elem = this.elem.querySelector(`*[name="${key}"]`)
            if (elem) {
                if (elem.nodeName == 'SELECT') {
                    console.log(key, value)
                    var options = elem.querySelectorAll('option')
                    options.forEach(option => {
                        console.log(option, option.value, value)
                        if (option.value == value) {
                            console.log('TRUE')
                            option.selected = true
                            return
                        }
                    })
                } else if (elem.nodeName == 'INPUT') {
                    elem.value = value
                }
            } else {
                console.warn('Elem not found', key)
            }
        }
    }
}