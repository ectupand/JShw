const div = document.getElementById('form');
let countClicks = 2;
let countBeverage = 1;
let modalWindow = document.getElementById('modalWindow')
let span = document.getElementsByClassName("close")[0];
const modalText = document.getElementById("orderAccepted")

let dic = {
    "espresso": "Эспрессо",
    "capuccino": "Капучино",
    "cacao": "Какао",
    "usual": "Обычное",
    "no-fat": "Обезжиренное",
    "soy": "Соевое",
    "coconut": "Кокосовое",
    "whipped cream": "взбитые сливки",
    "marshmallow": "зефирки",
    "chocolate": "шоколад",
    "cinnamon": "корица"
};


div.querySelector(".submit-button").addEventListener('click', (e) => {
    e.preventDefault()
    modalWindow.style.display = "block";
    span.onclick = function() {
        modalWindow.style.display = "none";
    }
    fillModal()
    orderTable()
})

function fillModal(){
    modalText.innerHTML = `Заказ принят! Вы заказали ${countBeverage} `
    if (countBeverage%10 === 1){
        modalText.innerHTML += 'напиток'
    }else if ([2,3,4].includes(countBeverage%10)){
        modalText.innerHTML += 'напитка'
    }else {
        modalText.innerHTML += 'напитков'
    }
}

function orderTable(){
    let beverages = document.querySelectorAll(".beverage")
    for (let beverage of beverages){
        let newRow = modalWindow.querySelector('table').querySelector('tbody').insertRow();
        let cellName = newRow.insertCell();
        cellName.appendChild(document.createTextNode(dic[document.getElementsByTagName('select')[0].value]));

        let cellMilk = newRow.insertCell();
        cellMilk.appendChild(document.createTextNode(dic[beverage.querySelectorAll('input[type=radio]:checked')[0].value]));

        let cellExtra = newRow.insertCell();
        let selectedOptions = [...beverage.querySelectorAll('input[type=checkbox]:checked')];
        let cellInfo = [];
        for(let option of selectedOptions) {
            cellInfo.push(dic[option.value]);
        }
        cellExtra.appendChild(document.createTextNode(cellInfo.join(', ')));
    }
}

div.querySelector(".add-button").addEventListener('click', () => {
    countBeverage++
    let forms = div.querySelectorAll(".beverage");
    let newForm = forms[forms.length - 1].cloneNode(true);
    newForm.querySelector("h4").innerHTML = `Напиток №${countClicks++}`;
    forms[forms.length - 1].after(newForm)
    newForm.appendChild(closeButton())
    for(let form of newForm.querySelectorAll('input[type=radio]')){
        form.name = `milk${countBeverage}`;
    }
})

function closeButton() {
    let closeButton = document.createElement('button');
    closeButton.id = 'closeButton';
    closeButton.innerHTML = '&#x2717;';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '0';
    closeButton.style.top = '0';
    return closeButton;
}

div.addEventListener('click', event => {
    if (event.target.id === 'closeButton') {
        countClicks--;
        countBeverage--;
        event.target.parentElement.remove();
        for (const [index, fieldset] of div.querySelectorAll('fieldset').entries()) {
            fieldset.querySelector('.beverage-count').innerHTML = `Напиток №${index + 1}`;
        }}
});

textareaElement = document.getElementById('textarea')
textareaDuplicate = document.getElementById('textarea-duplicate')

textareaElement.addEventListener("change", function() {
    textareaDuplicate.innerHTML = textareaElement.value;
});

function makeBold(input, wordsToBold) {
    return input.replace(new RegExp('(\\b)(' + wordsToBold.join('|') + ')(\\b)','ig'), '$1<b>$2</b>$3');
}