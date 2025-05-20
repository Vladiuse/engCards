function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrf = getCookie('csrftoken');

function getRandomElementsFromArray(arr, num) {
    if (typeof num !== 'number') {
        console.error('Incorrect random elems count');
        return [];
    } else if (num < 0) {
        console.error('Num must be positive');
        return [];
    } else if (num > arr.length) {
        console.error('Num must be less than array length');
        return [];
    }

    let result = [];
    let tempArr = [...arr];

    for (let i = 0; i < num; i++) {
        let randomIndex = Math.floor(Math.random() * tempArr.length);
        result.push(tempArr[randomIndex]);
        tempArr.splice(randomIndex, 1);
    }

    return result;
}
class CardTrainerApi {
    constructor(getCardUrl, updateCardStatusUrl) {
        this.getCardUrl = getCardUrl
        this.updateCardStatusUrl = updateCardStatusUrl
    }
    async getCardData(langDirection, vocabulary_type, level) {
        // const url = new URL(`{{ request.scheme }}://{{ request.META.HTTP_HOST }}{%url 'card_trainer:get_card'%}`);
        const url = new URL(this.getCardUrl);
        var data = {
            lang_direction: langDirection,
            vocabulary_type: vocabulary_type,
            level: level
        }
        const params = {
            lang_direction: langDirection,
            vocabulary_type: vocabulary_type,
            level: level
        };
        url.search = new URLSearchParams(params).toString();
        var response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrf,
            },
            // body: JSON.stringify(data),
        })
        if (response.ok) {
            return await response.json()
        } else {
            await alert(response.text())
        }
    }

    async updateCardStatus(cardId, status) {
        // const url = new URL(`{{ request.scheme }}://{{ request.META.HTTP_HOST }}{%url 'vocabulary:words-list'%}${cardId}/`);
        const url = new URL(`${this.updateCardStatusUrl}${cardId}/`);
        var data = {
            'status': status,
        }
        var response = await fetch(url, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrf,
            },
            body: JSON.stringify(data),
        })
        if (response.ok) {
            return await response.json()
        } else {
            await alert(await response.text())
        }
    }
}
class Card {
    // static CARD_STATUS_LEARNED = '{{CARD_STATUS_LEARNED}}'
    // static CARD_STATUS_POSTPONED = '{{CARD_STATUS_POSTPONED}}'
    // static CARD_STATUS_LEARNING = '{{CARD_STATUS_LEARNING}}'
    static CARD_STATUS_LEARNED = window.cardStatuses.LEARNED;
    static CARD_STATUS_POSTPONED = window.cardStatuses.POSTPONED;
    static CARD_STATUS_LEARNING = window.cardStatuses.LEARNING;

    constructor(cardId, word, translation, langDirection) {
        this.cardId = cardId
        this.word = word
        this.translate = translation
        this.langDirection = langDirection
    }

    static dataToCard(cardData) {
        return new Card(
            cardData.id,
            cardData.word,
            cardData.translation,
            cardData.lang_direction,
        )
    }
}
class CardView {
    static FLIP_TRANSITION = '1s'
    static FRONT_SIDE = 'front'
    static BACK_SIDE = 'back'

    constructor(elem) {
        this.elem = elem
        this._currentSide = CardView.FRONT_SIDE
        this.frontCard = this.elem.querySelector('.front-card')
        this.backCard = this.elem.querySelector('.back-card')

        this.cardWord = document.getElementById('card-word')
        this.cardWordtranslate = document.getElementById('card-word-translate')
        this.cardIncorrectAnswer = document.getElementById('card-incorrect-answer')

        this.sentense = document.getElementById('sentense')
        this.sentenseTranslate = document.getElementById('sentense-translate')

        this.correctBadge = document.querySelector('.correct-badge')
        this.wrongeBadge = document.querySelector('.wronge-badge')
    }

    set flipTransition(time) {
        this.frontCard.style.transition = time
        this.backCard.style.transition = time
    }

    set backCardSideClickEvent(callback) {
        this.backCard.addEventListener('click', callback)
    }

    flip(quick = false) {
        if (this._currentSide == CardView.FRONT_SIDE) {
            this.showBack(quick)
        } else {
            this.showFront(quick)
        }
    }

    showBack(quick = false) {
        this._showSide(CardView.BACK_SIDE, quick)
    }
    showFront(quick = false) {
        this._showSide(CardView.FRONT_SIDE, quick)
    }
    _showSide(side, quick = false) {
        if (quick) {
            this.flipTransition = '0s'
        } else {
            this.flipTransition = CardView.FLIP_TRANSITION
        }
        if (side == CardView.FRONT_SIDE) {
            $(this.frontCard).css("transform", "rotateY(0deg)");
            $(this.backCard).css("transform", "rotateY(180deg)");
            this._currentSide = CardView.FRONT_SIDE
        } else if (side == CardView.BACK_SIDE) {
            $(this.frontCard).css("transform", "rotateY(180deg)");
            $(this.backCard).css("transform", "rotateY(0deg)");
            this._currentSide = CardView.BACK_SIDE
        } else {
            alert(`Incorrect card side: ${side}`)
        }
    }
    showNextCard(card) {
        $(this.elem).slideUp(() => {
            this.showFront(true)
            this.setCard(card)
        }).slideDown()
    }

    hide() {
        return new Promise(resolve => {
            $(this.elem).slideUp(() => resolve());
        });
    }
    show() {
        $(this.elem).slideDown()
    }

    setCard(card) {
        this.cardWord.innerHTML = `<b>${card.word}</b>`
        this.cardWordtranslate.innerHTML = `<b>${card.word}</b> - ${card.translate}`
        this.cardIncorrectAnswer.style.display = 'none'
        this.correctBadge.style.display = 'none'
        this.wrongeBadge.style.display = 'none'
    }

    setCorrectAnswer() {
        this.correctBadge.style.display = 'block'
        this.wrongeBadge.style.display = 'none'
    }

    setWrongAnswer(wrongeCard) {
        this.cardIncorrectAnswer.innerHTML = `<b>${wrongeCard.word}</b> - ${wrongeCard.translate}`

        this.cardIncorrectAnswer.style.display = 'block'
        this.correctBadge.style.display = 'none'
        this.wrongeBadge.style.display = 'block'
    }

    setSentense(sentense) {
        this.sentense.innerHTML = sentense.text
        this.sentenseTranslate.innerHTML = sentense.translate
    }

    clean() {
        //
    }
}
class CardTrainerButtonsView {
    constructor(elem) {
        this.elem = elem
        this.answersButtonsContainer = this.elem.querySelector('.answers-buttons-wrapper')
        this.nextCardButton = document.getElementById('next-card-button')
        this.dontKnowButton = document.getElementById('dont-know-btn')
        this.button5050 = document.getElementById('5050-btn')
        this.learningButton = document.getElementById('card-learned')
        this.postponedButton = document.getElementById('card-postponed')
        this.backButtonsContainer = document.getElementById('back-buttons')
        this.frontButtonsContainer = document.getElementById('front-buttons')
        this._answerClickCallback = null

        this.lockNextButton()
        this.showFrontButtons()
    }

    set setCardLearnedEventCallback(callback) {
        this.learningButton.addEventListener('click', callback)
    }
    set setCardPostponedButtonEventCallback(callback) {
        this.postponedButton.addEventListener('click', callback)
    }

    set nextCardClickEventCallback(callback) {
        this.nextCardButton.addEventListener('click', callback)
    }

    set answerClickEventCallback(callback) {
        this._answerClickCallback = callback
    }

    set button5050ClickEventCallback(callback) {
        this.button5050.addEventListener('click', callback)
    }

    set dontKnowClickEventCallBack(callback) {
        this.dontKnowButton.addEventListener('click', callback)
    }

    get answersButtons() {
        return this.answersButtonsContainer.querySelectorAll('button')
    }

    addAnswersButtons(answers) { // Cards list
        if (this._answerClickCallback != null) {
            answers.forEach(card => {
                if (!(card instanceof Card)) {
                    throw new Error('Answers must be Card instatce')
                }
                var button = document.createElement('button')
                button.classList.add('btn')
                button.classList.add('btn-grey')
                button.dataset.cardId = card.cardId
                button.textContent = card.word
                button.style.display = 'none'
                button.addEventListener('click', this._answerClickCallback)
                this.answersButtonsContainer.append(button)
            });
            $(this.answersButtons).fadeOut(0)
            $(this.answersButtons).fadeIn()

        } else {
            alert('No callback for answer button')
        }
    }
    showFrontButtons() {
        $(this.backButtonsContainer).fadeOut(250, () => {
            $(this.frontButtonsContainer).fadeIn(250)
        })
    }
    showBackButtons() {
        $(this.frontButtonsContainer).fadeOut(500, () => {
            $(this.backButtonsContainer).fadeIn(500)
        })
    }
    _removeAnswers() {
        $(this.answersButtons).fadeOut(() => {
            this.answersButtonsContainer.innerHTML = ''
        })

    }

    hideAnswerButtonsByIds(ids) { // list
        ids.forEach(id => {
            var button = this.getAnswerButtonById(id)
            button.remove()
        })
    }

    getAnswerButtonById(cardId) {
        return this.answersButtonsContainer.querySelector(`[data-card-id="${cardId}"]`)
    }

    disable5050button() {
        this._disableButton(this.button5050)
    }

    lockActionButtons() {
        this._disableButton(this.dontKnowButton)
        this._disableButton(this.button5050)
        this._disableButton(this.learningButton)
        this._disableButton(this.postponedButton)
    }

    unlockActionButtons() {
        this._enableButton(this.dontKnowButton)
        this._enableButton(this.button5050)
        this._enableButton(this.learningButton)
        this._enableButton(this.postponedButton)
    }

    unlockNextButton() {
        this._enableButton(this.nextCardButton)
    }

    lockNextButton() {
        this._disableButton(this.nextCardButton)
    }

    _disableButton(button) {
        if (button.dataset.btnClass) {
            var origClass = button.dataset.btnClass
        }
        else {
            var origClass = 'btn-primary'
        }
        button.disabled = true
        button.classList.remove(origClass)
        button.classList.add('btn-secondary')
    }
    _enableButton(button) {
        if (button.dataset.btnClass) {
            var origClass = button.dataset.btnClass
        }
        else {
            var origClass = 'btn-primary'
        }
        button.disabled = false
        button.classList.remove('btn-secondary')
        button.classList.add(origClass)
    }
}
class LangDirectionView {
    constructor(elem, defaultOption) {
        this.elem = elem
        this.defaultOption = defaultOption
        this.options = this.elem.querySelectorAll('.option')

        this._init()
    }

    set changeLangEventClickCallback(callback) {
        this.options.forEach(option => {
            option.addEventListener('click', () => callback(option))
        });
    }

    _init() {
        if (this.defaultOption) {
            this.setOption(this.defaultOption)
        }
        this.elem.querySelector('.selected-option').addEventListener('click', () => {
            this.elem.classList.toggle('open');
        });
    }

    setOption(option) {
        if (typeof option === "string") {
            option = this.elem.querySelector(`.option[data-direction="${option}"]`)
            if (option == undefined) {
                throw new Error(`Option direction ${option} not found`)
            }
        }
        const direction = option.dataset.direction;
        const flag = option.dataset.flag;
        const text = option.dataset.text;

        this.elem.querySelector('.selected-option .selected-flag').textContent = flag;
        this.elem.querySelector('.selected-option .selected-text').textContent = text;
        this.updateOptionVisibility(direction);
        document.querySelector('.custom-select').classList.remove('open');
    }

    updateOptionVisibility(selectedDirection) {
        this.options.forEach(option => {
            if (option.dataset.direction === selectedDirection) {
                option.classList.add('hidden');
            } else {
                option.classList.remove('hidden');
            }
        });
    }
}

class CardTrainer {
    constructor(state, buttonView, cardView, cardsApi, langDirectionView, DEFAULT_VOCABULARY) {
        this.state = state
        this.cardsApi = cardsApi
        this.buttonView = buttonView
        this.cardView = cardView
        this.langDirectionView = langDirectionView
        this.DEFAULT_VOCABULARY = DEFAULT_VOCABULARY
    }

    async loadCardData() {
        if (this.state.nextCardData) {
            alert(`not empty next card: ${this.state.nextCardData}`)
        }
        var langDirection = this.state.langDirection
        var vocabularyType = this.state.vocabularyType
        var level = this.state.level
        var cardData = await this.cardsApi.getCardData(langDirection, vocabularyType, level)
        this.state.nextCardData = cardData
    }

    async getCardData() {
        if (this.state.nextCardData == null) {
            console.info('Load Card')
            await this.loadCardData()
        } else {
            console.info('GET EXISTS Card')
        }
        var cardData = this.state.nextCardData
        this.state.nextCardData = null
        return cardData
    }

    async showCard() {
        var cardData = await this.getCardData()
        var card = Card.dataToCard(cardData.card)
        console.info('Current card:', card)
        var answersCards = []
        cardData.answers.forEach(answerCardData => {
            var answerCard = Card.dataToCard(answerCardData)
            answersCards.push(answerCard)
        })
        this.state.setCardData(card, answersCards, cardData.lang_direction)
        this.cardView.setCard(card)
        this.cardView.show()
        this.buttonView.addAnswersButtons(answersCards)
        this.buttonView.showFrontButtons()
        if (answersCards.length <= 2) {
            this.buttonView.disable5050button()
        }
        this.buttonView.unlockActionButtons()
    }

    async backClickEvent() {
        await this.nextCard()
    }

    async handleEventNextCard() {
        await this.nextCard()
    }

    async nextCard() {
        this.buttonView.lockNextButton()
        this.buttonView.lockActionButtons()
        await this.cardView.hide()
        this.cardView.showFront(true)
        this.showCard()
    }

    handle5050() {
        if (!this.state.getIsUse5050()) {
            var answersIds = []
            var answers = this.state.getAnswers()
            var currentCard = this.state.getCurrentCard()
            answers.forEach(card => {
                if (card.cardId != currentCard.cardId) {
                    answersIds.push(card.cardId)
                }
            })
            var answersIdsTodelete = getRandomElementsFromArray(answersIds, answersIds.length - 1)
            this.buttonView.hideAnswerButtonsByIds(answersIdsTodelete)
            this.buttonView.disable5050button()
            this.state.setIsUse5050Used()
        }
    }

    async handleChangeCardStatus(status) {
        var cardId = this.state.getCurrentCard().cardId
        this.buttonView.lockActionButtons()
        await this.cardsApi.updateCardStatus(cardId, status)
        this.nextCard()
        this.buttonView.showFrontButtons()
    }

    async handleCardLearned() {
        this.handleChangeCardStatus(Card.CARD_STATUS_LEARNED)
    }

    async handleCardPostponed() {
        this.handleChangeCardStatus(Card.CARD_STATUS_POSTPONED)
    }

    hanleDontKnow() {
        this.cardView.showBack()
        this.buttonView.lockActionButtons()
        this.buttonView.unlockNextButton()
        this.buttonView._removeAnswers()
    }

    setLangDirection(langDirection) {
        this.langDirectionView.setOption(langDirection)
        this.state.langDirection = langDirection
    }

    handleChangeLangDirection(optionElem) {
        this.buttonView.lockNextButton()
        var langDirection = optionElem.dataset.direction
        this.setLangDirection(langDirection)
        this.state.nextCardData = null
        this.buttonView._removeAnswers()
        this.nextCard()
        this.buttonView.showFrontButtons()
    }

    getcardById(cardId) {
        var answers = this.state.getAnswers()
        var resultCard = null
        answers.forEach(card => {
            if (card.cardId == cardId) {
                return resultCard = card
            }
        })
        if (resultCard) {
            return resultCard
        }
        throw new Error(`Cant find card in state with id: ${cardId}`)
    }

    handleUserAnswer(event) {
        this.loadCardData()
        var answerCardBlock = event.currentTarget
        var answerCardId = answerCardBlock.dataset.cardId
        var answerCardcard = this.getcardById(answerCardId)
        this.state.setUserAnswer(answerCardcard)
        if (answerCardcard.cardId == this.state.getCurrentCard().cardId) {
            this.state.setIsCorrect(true)
            this.cardView.setCorrectAnswer()
        } else {
            this.state.setIsCorrect(false)
            this.cardView.setWrongAnswer(answerCardcard)
            this.buttonView._disableButton(this.buttonView.learningButton)
        }
        this.cardView.showBack()
        this.buttonView.unlockNextButton()
        if (this.state.vocabularyType != this.DEFAULT_VOCABULARY) {
            this.buttonView.showBackButtons()
        } else {
            this.buttonView.lockActionButtons()
        }
        this.buttonView._removeAnswers()
    }
}

class StateManager {
    constructor(vocabularyType, level) {
        this.nextCardData = null
        this.langDirection = null
        this.vocabularyType = vocabularyType
        this.level = level
        this.state = {
            currentCard: null,
            answers: [],
            langDirection: null,
            isCorrect: null,
            userAnswer: null,
            isUse5050: false,
        };
    }

    setIsUse5050Used() {
        this.state.isUse5050 = true
    }

    getIsUse5050() {
        return this.state.isUse5050
    }

    setCardData(card, answers, langDirection) {
        this.clear()
        this.state.currentCard = card;
        this.state.answers = answers;
        this.state.langDirection = langDirection;
    }

    setUserAnswer(userAnswer) {
        this.state.userAnswer = userAnswer;
    }

    setIsCorrect(isCorrect) {
        this.state.isCorrect = isCorrect;
    }

    setAnswers(answers) {
        this.state.answers = answers;
    }

    getCurrentCard() {
        return this.state.currentCard;
    }

    getAnswers() {
        return this.state.answers;
    }

    getLangDirection() {
        return this.state.langDirection;
    }

    getAnswerResult() {
        return this.state.isCorrect;
    }

    clear() {
        this.state.currentCard = null;
        this.state.answers = [];
        this.state.langDirection = null;
        this.state.isCorrect = null;
        this.state.userAnswer = null;
        this.state.isUse5050 = null;
    }
}