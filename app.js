const express = require('express');
const app = express();
const records = require('./records');

app.use(express.json());

// Actions that we want to enable:

// Send a GET request to /quotes to READ a list of quotes
app.get('/quotes', async (req, res) => {
    try {
        const quotes = await records.getQuotes();
        res.json(quotes);
    } catch (err) {
        res.json({ message: err.message });
    }
});

// Send a GET request to /quotes/:id to READ(view) a quote
app.get('/quotes/:id', async (req, res) => {
    try {
        const quote = await records.getQuote(req.params.id);
        if (quote) {
            res.json(quote);
        } else {
            res.status(404).json({ message: "Quote wasn't found" });
        }
    } catch (err) {
        res.json({ message: err.message }).status(500);
    }
});

// Send a POST request to /quotes/ to Create a quote
app.post('/quotes/', async (req, res) => {
    try {
        if (req.body.author && req.body.quote) {
            const quote = await records.createQuote({
                quote: req.body.quote,
                author: req.body.author
            });
            res.json(quote).status(201);
        } else {
            res.status(400).json({ message: 'Quote and author required' });
        }
    } catch (err) {
        res.json({ message: err.message });
    }
});
// Send a PUT request to /quotes/:id to UPDATE(edit) a quote
app.put('/quotes/:id', async (req, res) => {
    try {
        const quote = await records.getQuote(req.params.id);
        if (quote) {
            quote.quote = req.body.quote;
            quote.author = req.body.author;
            quote.year = req.body.year;
            await records.updateQuote(quote);
            res.status(204).end();
        } else {
            res.status(404).json({ message: "Quote wasn't found" });
        }
    } catch (err) {
        res.json({ message: err.message }).status(500);
    }
});
// Send a DELETE request to /quotes/:id to DELETE a quote

// Send a GET request to /quotes/quote/random to READ (view) a random quote
app.get('/quotes/quote/random', async (req, res) => {
    try {
        const quote = await records.getRandomQuote();
        res.json(quote);
    } catch (err) {
        res.json({ message: err.message });
    }
});

app.listen(3000, () => console.log('Quote API listening on port 3000!'));
