class StepsProgress {
    constructor(elem, currentValue, max) {
        this.elem = elem
        this.stepsContainer = this.elem.querySelector('.progress-steps')
        this.bar = this.elem.querySelector('.progress-bar')
        this.min = 0
        this.max = max
        this.progressMax = max - 1
        this.currentValue = currentValue

        this._init()
    }

    _init() {
        this._addStepElem()
        this.bar.setAttribute('aria-valuemin', this.min)
        this.bar.setAttribute('aria-valuemax', this.progressMax)
        this.bar.setAttribute('aria-valuenow', this.currentValue)
        this.draw()
    }

    _addStepElem(){
        for (var i = 0; i < this.max; i++){
            var step = document.createElement('div')
            step.classList.add('step')
            step.textContent = i + 1
            this.stepsContainer.append(step)
        }
    }

    get progressWidth() {
        if (this.currentValue == 0) {
            return 0
        } else if (this.currentValue == this.max) {
            return 100
        } else {
            return Math.round((this.currentValue / this.progressMax ) * 100)
        }
    }

    get stepsElems(){
        return this.elem.querySelectorAll('.step')
    }
    
    draw() {
        this._drawProgressWidth()
        this._drawSteps()
    }

    _drawProgressWidth() {
        this.bar.style.width = this.progressWidth + '%'
    }

    _drawSteps() {
        var stepsElems = this.stepsElems
        for (var i = 0; i < this.max; i++) {
            var step = stepsElems[i]
            if (this.currentValue > i) {
                step.classList.add('active')
            } else {
                step.classList.remove('active')
            }
        }
    }

    set step(step) {
        if (step < 0) {
            throw new Error('step must be positive')
        }
        if (step > this.max) {
            throw new Error(`step can be more than max: ${this.max}`)
        }
        this.currentValue = step
        this.draw()
    }
    next() {
        if (this.currentValue < this.max) {
            this.currentValue++
            this.draw()
        }
    }
}