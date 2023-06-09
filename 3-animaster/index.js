addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000, {x: 100, y: 20})
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block, 1000, {x: 100, y: 20})
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000)
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating().start(block, 1000, 1);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating().stop(block, 1);
        });
}

function animaster(){
    this._steps = []
    return {
        resetFadeIn:function(element){
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        resetFadeOut:function(element){
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        resetMoveAndScale:function(element){
            element.style.transitionDuration = null;
            element.style.transform = null;
        },
        resetMoveAndHide:function(element){
            this.resetFadeOut(element)
            this.resetMoveAndScale(element)
        },

        moveAndHide:function(element, duration, translation){
            this.move(element, duration * 2 / 5, translation);
            this.fadeOut(element, duration * 3 / 5);
        },
        showAndHide:function(element, duration){
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration / 3);
        },

        heartBeating:function() {
            return {
                start: function (element, duration, ratio) {
                    element.style.transitionDuration = `${duration / 2}ms`;
                    element.style.transform = getTransform(null, ratio * 1.4);
                    smaller = setInterval(() => {
                        element.style.transitionDuration = `${duration / 2}ms`;
                        element.style.transform = getTransform(null, ratio);
                    }, duration / 2);
                    bigger = setInterval(() => {
                        element.style.transitionDuration = `${duration / 2}ms`;
                        element.style.transform = getTransform(null, ratio * 1.4);
                    }, duration);
                },
                stop: function (element, ratio) {
                    clearInterval(smaller)
                    clearInterval(bigger)
                    element.style.transitionDuration =  `${0}ms`;
                    element.style.transform = getTransform(null, ratio)
                }
            }
        },

        fadeOut:function(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn:function(element, duration){
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move: function(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale:function(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        play(element,  cycled = false) {
            let sum = 0;
            for (let step of steps) {
                setTimeout(() => this[step.animation](element, step.duration, ...step.other), sum);
                sum += step.duration;
            }
        },
        addMove:function (animation){
            steps.push(animation)
            return this;
        },


    }
}
function getTransform (translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}