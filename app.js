require('dotenv').config();
const express = require('express');
const request = require('request');
const exphbs = require('express-handlebars');
const config = require('config');

const app = express();

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));

// INDEX ROUTE
app.get('/', (req, res) => {
    res.render('index');
});

// SIGNUP ROUTE
app.post('/signup', (req, res) => {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
        res.render('fail');
        return;
    }

    // Construct req data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const postData = JSON.stringify(data);

    const options = {
        url: config.get('url'),
        method: 'POST',
        headers: {
            Authorization: config.get('key')
        },
        body: postData
    }

    request(options, (error, response, body) => {
        if (error) {
            res.render('fail');
        } else {
            if (response.statusCode === 200) {
                res.render('success');
            } else {
                res.render('fail');
            }
        }
    });
});





const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`APP LISTENING ON PORT ${PORT}`));