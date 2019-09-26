const express = require('express');
const app = express();
const records = require('./records');

app.use(express.json());

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}

// Actions that we want to enable:

// Send a GET request to /quotes to READ a list of quotes WITHOUT async handler
// app.get('/quotes', async (req, res, next) => {
//     try {
//         const quotes = await records.getQuotes();
//         res.json(quotes);
//     } catch (err) {
//         next(err);
//     }
// });

// Send a GET request to /quotes to READ a list of quotes WITH async handler

app.get(
    '/quotes',
    asyncHandler(async (req, res) => {
        const quotes = await records.getQuotes();
        res.json(quotes);
    })
);

// Send a GET request to /quotes/:id to READ(view) a quote
app.get(
    '/quotes/:id',
    asyncHandler(async (req, res) => {
        const quote = await records.getQuote(req.params.id);
        if (quote) {
            res.json(quote);
        } else {
            res.status(404).json({ message: "Quote wasn't found" });
        }
    })
);

// Send a POST request to /quotes/ to Create a quote
app.post(
    '/quotes/',
    asyncHandler(async (req, res) => {
        if (req.body.author && req.body.quote) {
            const quote = await records.createQuote({
                quote: req.body.quote,
                author: req.body.author
            });
            res.json(quote).status(201);
        } else {
            res.status(400).json({ message: 'Quote and author required' });
        }
    })
);

// Send a PUT request to /quotes/:id to UPDATE(edit) a quote
app.put(
    '/quotes/:id',
    asyncHandler(async (req, res) => {
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
    })
);
// Send a DELETE request to /quotes/:id to DELETE a quote

app.delete(
    '/quotes/:id',
    asyncHandler(async (req, res) => {
        const quote = await records.getQuote(req.params.id);
        if (quote) {
            await records.deleteQuote(quote);
            res.status(204).end();
        } else {
            res.status(404).json({ message: "Quote wasn't found" });
        }
    })
);

// Send a GET request to /quotes/quote/random to READ (view) a random quote
app.get(
    '/quotes/quote/random',
    asyncHandler(async (req, res) => {
        const quote = await records.getRandomQuote();
        res.json(quote);
    })
);

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
