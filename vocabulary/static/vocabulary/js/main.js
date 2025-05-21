/* global getCookie, bootstrap, BsJsonForm */
var csrf = getCookie('csrftoken');

class CardsAPI {
    constructor(baseUrl = window.cardApiUrl ) {
        this.baseUrl = baseUrl;
    }

    async getWord(wordId) {
        return await this._request(`${this.baseUrl}${wordId}/`, 'GET',);
    }

    async updateWord(wordId, data) {
        return await this._request(`${this.baseUrl}${wordId}/`, 'PUT', data);
    }

    async createWord(data) {
        return await this._request(`${this.baseUrl}`, 'POST', data);
    }

    async deleteWord(wordId) {
        return await this._request(`${this.baseUrl}${wordId}/`, 'DELETE');
    }

    async _request(url, method, data = null) {
        try {
            const options = {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrf,
                },
            };
            // Если есть данные (для POST или PUT), добавляем их в body
            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }
            const response = await fetch(url, options);
            return response
        } catch (error) {
            console.error(`API Error (${method}):`, error);
            throw error;
        }
    }
}

class Card {
    constructor(elem, onEditCallback) {
        this.elem = elem;
        this.onEditCallback = onEditCallback;
        this._init();
    }

    _init() {
        this.elem.addEventListener('click', this.edit.bind(this));
    }

    get id() {
        return this.elem.dataset.cardId;
    }

    get status() {
        return this.elem.dataset.cardStatus;
    }

    edit() {
        this.onEditCallback(this.id);
    }

    remove() {
        this.elem.remove();
    }

    update(data) {
        this.elem.querySelector('[data-card-en]').textContent = data.en;
        this.elem.querySelector('[data-card-ru]').textContent = data.ru;
        this.elem.dataset.cardStatus = data.status
    }

    hide() {
        this.elem.style.display = 'none';
    }

    show() {
        this.elem.style.display = 'block'
    }
}
class CardView {
    constructor(templateSelector, containerSelector) {
        this.template = document.getElementById(templateSelector).innerHTML;
        this.container = document.getElementById(containerSelector);
        this.cards = new Map()
    }

    addCardsFromPage(onEditCallback) {
        this.container.querySelectorAll('.col').forEach(card => {
            this._addCardInstance(card, onEditCallback);
        });
    }

    addCardElemToContainer(data, onEditCallback) {
        console.log(data)
        var html = this._renderTemplate(data)
        var elem = this._createElementFormHtml(html)
        this._addCardInstance(elem, onEditCallback)
        this.container.prepend(elem)
    }

    updateCard(cardId, data) {
        var card = this.cards.get(cardId + '')
        card.update(data)
    }

    getCard(cardId) {
        return this.cards.get(cardId + '');
    }

    deleteCard(cardId) {
        const card = this.getCard(cardId);
        if (card) {
            card.remove();
            this.cards.delete(cardId + '');
        }
    }

    _renderTemplate(data) {
        let result = this.template;
        console.log(result)
        for (const [key, value] of Object.entries(data)) {
            result = result.replaceAll(`{${key}}`, value);
        }
        return result;
    }

    _createElementFormHtml(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.children[0];
    }

    _addCardInstance(elem, onEditCallback) {
        const card = new Card(elem, onEditCallback);
        this.cards.set(card.id, card);
    }

    filterByStatus(status) {
        if (status == 'all') {
            for (let card of this.cards.values()) {
                card.show()
            }
        } else {
            for (let card of this.cards.values()) {
                if (status == card.status) {
                    card.show()
                } else {
                    card.hide()
                }
            }
        }
    }
}

class ModalController {
    constructor(cardModalId, deleteModalId, cardFormSelector, deleteFormSelector, confirmCloseEditeedModalSelector) {
        this.cardModalBlock = document.getElementById(cardModalId)
        this.cardModal = new bootstrap.Modal(this.cardModalBlock)
        this.deleteModal = new bootstrap.Modal(document.getElementById(deleteModalId))
        this.cardForm = document.getElementById(cardFormSelector)
        this.deleteForm = document.getElementById(deleteFormSelector)
        this.confirmCloseEditeedModal = new bootstrap.Modal(document.getElementById(confirmCloseEditeedModalSelector))
        this.saveCardAndAddAnotherButton = document.getElementById('save-card-and-add-another')
        this.addEvents()
    }

    addEvents() {
        this.cardModalBlock.addEventListener('hide.bs.modal', (event) => {
            var formWrap = BsJsonForm.getInstance(this.cardForm);
            if (formWrap.was_changed) {
                this.confirmCloseEditeedModal.show();
            }
        });
    }
    showCreateModal(submitCallback) {
        this.cardModalBlock.querySelector('.modal-title').textContent = 'Создать карточку'
        this.cardModalBlock.querySelector('#delete-card-button').style.display = 'none'
        this.saveCardAndAddAnotherButton.style.display = 'inline-block'
        var form = new BsJsonForm(this.cardForm)
        form.submitFunction = submitCallback
        this.cardModal.show()
    }

    showEditModal(data, submitCallback) {
        this.cardModalBlock.querySelector('.modal-title').textContent = 'Редактировать карточку'
        this.cardModalBlock.querySelector('#delete-card-button').style.display = 'block'
        this.saveCardAndAddAnotherButton.style.display = 'none'
        var form = new BsJsonForm(this.cardForm)
        form.feed(data)
        form.submitFunction = submitCallback
        this.cardModal.show()
    }

    hideCardModal() {
        this.cardModal.hide()
    }

    showDeleteModal(data, submitCallback) {
        var form = new BsJsonForm(modalController.deleteForm)
        form.feed(data)
        form.submitFunction = submitCallback
        this.cardModal.hide()
        this.deleteModal.show()
    }
}

class CardManager {
    constructor(cardsAPI, cardsView, modalController) {
        this.cardsAPI = cardsAPI
        this.cardsView = cardsView
        this.modalController = modalController
    }

    async handleEdit(cardId) {
        const response = await this.cardsAPI.getWord(cardId);
        const data = await response.json();
        modalController.showEditModal(data, this.update.bind(this))
    }

    async update(e) {
        e.preventDefault()
        var form = BsJsonForm.getInstance(e.target)
        var data = form.toDict()
        form.disable()
        var cardId = data['id']
        const response = await this.cardsAPI.updateWord(cardId, data);
        var updated_card_data = await response.json();
        if (response.ok) {
            form.was_changed = false
            this.cardsView.updateCard(cardId, updated_card_data)
            modalController.hideCardModal()
        } else {
            form.showErrors(updated_card_data)
        }
        form.enable()

    }

    async create(e) {
        e.preventDefault()
        console.log(e.submitter)
        var form = BsJsonForm.getInstance(e.target)
        var data = form.toDict()
        form.disable()
        const response = await this.cardsAPI.createWord(data);
        var responce_json = await response.json()
        if (response.ok) {
            this.cardsView.addCardElemToContainer(responce_json, this.handleEdit.bind(this))
            form.was_changed = false
            if (e.submitter.id == this.modalController.saveCardAndAddAnotherButton.id) {
                form.clearFields()
            } else {
                modalController.cardModal.hide()
            }

        } else {
            form.showErrors(responce_json)
        }
        form.enable()
    }

    async delete(e) {
        e.preventDefault()
        var form = BsJsonForm.getInstance(e.target)
        var data = form.toDict()
        form.disable()
        var wordId = data['id']
        const response = await this.cardsAPI.deleteWord(wordId);
        if (response.ok) {
            this.cardsView.deleteCard(wordId)
            this.modalController.deleteModal.hide()
        } else {
            alert('Error')
        }
        form.enable()
    }
}
var createModalButton = document.getElementById('add-new-card')
var deleteCardButton = document.getElementById('delete-card-button')
const cardsApi = new CardsAPI()
const modalController = new ModalController('cardModal', 'deleteCardModal', 'cardForm', 'deleteCardForm', 'confirmCloseEditeedModal')
const cardsView = new CardView('card-template', 'cards-list')
const cardManager = new CardManager(cardsApi, cardsView, modalController)
cardsView.addCardsFromPage(cardManager.handleEdit.bind(cardManager))
createModalButton.addEventListener('click', () => {
    modalController.showCreateModal(cardManager.create.bind(cardManager))
})
deleteCardButton.addEventListener('click', (e) => {
    const formData = BsJsonForm.getInstance(modalController.cardForm)
    modalController.showDeleteModal(formData.toDict(), cardManager.delete.bind(cardManager))
})

// CARD STATUS FILTER SELECT
const statusFilter = document.getElementById('status-filter')

statusFilter.addEventListener('change', () => {
    const selectedOption = statusFilter.options[statusFilter.selectedIndex]
    hideOption(selectedOption)
    cardsView.filterByStatus(selectedOption.value)
})

function hideOption(target_option) {
    const options = statusFilter.querySelectorAll('option')
    options.forEach(option => {
        option.style.display = 'block'
    })
    target_option.style.display = 'none'
}