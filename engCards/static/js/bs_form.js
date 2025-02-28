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
            console.info(`Error_block for key "${key}"" not found`)
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
