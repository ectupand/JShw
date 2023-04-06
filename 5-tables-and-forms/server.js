const express = require('express');
const app = express();
const port = 3000;
const constructPageBody = require('./checkOrder');


const pageHead =
`
<!DOCTYPE html>
<html lang="ru">
<head>
<title>Результат заказа питомца</title>
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<main>
<h1>Результат заказа питомца</h1>
`;

const pageFoot =
`
<a href="/">⃪ Вернуться к форме заказа</a>
</main>
</body>
</html>
`;

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});


app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.post('/pets/orders', (request, response) => {
    const reqBody = request.body;
    const pageBody = constructPageBody(reqBody);

    console.log(request.body);
    dataValidation(reqBody);
    response.send(`${pageHead}${pageBody}${pageFoot}`);
});

function dataValidation(requestBody) {
    const incorrectFields = {};

    const conditions = {
        petType: (value) => {
            let arr = ['cat', 'dog', 'tiger'];
            return arr.includes[value];
        },

        gender: (value) => {
            let arr = ['boy', 'girl', 'none'];
            return arr.includes[value];
        },

        eyeColor: () => {
            return true;
        },

        name: (value) => {
            const len = value.length;
            return (3 <= len && len <= 50);
        },

        tailLength: (value) => {
            if (isNaN(Number(value))) return false;
            value = Number(value);
            return (7 <= value && value <= 120);
        },

        dateOfBirth: (value) => {
            let today = new Date().getFullYear();
            let age = today - ++value.split('-')[0];
            return (5 < age && age < 110);
        },

        email: () => {
            return true;
        },

        phone: () => {
            return true;
        },

        rules: (value) => {
            return value === 'true';
        }
    };
    for (let key in conditions) {
        if (!conditions[key](requestBody[key]))
            incorrectFields[key] = requestBody[key];
    }
    console.log(incorrectFields);
    return incorrectFields;
}

