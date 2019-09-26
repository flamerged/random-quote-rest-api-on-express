const express = require('express');
const app = express();
const records = require('./records');

app.use(express.json());

// Actions that we want to enable:

// Send a GET request to /quotes to READ a list of quotes
app.get('/quotes', async (req, res, next) => {
    try {
        const quotes = await records.getQuotes();
        res.json(quotes);
    } catch (err) {
        next(err);
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
        next(err);
    }
});

// Send a POST request to /quotes/ to Create a quote
app.post('/quotes/', async (req, res, next) => {
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
        next(err);
    }
});
// Send a PUT request to /quotes/:id to UPDATE(edit) a quote
app.put('/quotes/:id', async (req, res, next) => {
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
        next(err);
    }
});
// Send a DELETE request to /quotes/:id to DELETE a quote

app.delete('/quotes/:id', async (req, res, next) => {
    try {
        const quote = await records.getQuote(req.params.id);
        if (quote) {
            await records.deleteQuote(quote);
            res.status(204).end();
        } else {
            res.status(404).json({ message: "Quote wasn't found" });
        }
    } catch (err) {
        next(err);
    }
});

// Send a GET request to /quotes/quote/random to READ (view) a random quote
app.get('/quotes/quote/random', async (req, res) => {
    try {
        const quote = await records.getRandomQuote();
        res.json(quote);
    } catch (err) {
        res.json({ message: err.message });
    }
});

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
});

app.listen(3000, () => console.log('Quote API listening on port 3000!'));
