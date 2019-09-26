const express = require('express');
const router = express.Router();
const records = require('./records');

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
// router.get('/quotes', async (req, res, next) => {
//     try {
//         const quotes = await records.getQuotes();
//         res.json(quotes);
//     } catch (err) {
//         next(err);
//     }
// });

// Send a GET request to /quotes to READ a list of quotes WITH async handler

router.get(
    '/quotes',
    asyncHandler(async (req, res) => {
        const quotes = await records.getQuotes();
        res.json(quotes);
    })
);

// Send a GET request to /quotes/:id to READ(view) a quote
router.get(
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
router.post(
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
router.put(
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

router.delete(
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
router.get(
    '/quotes/quote/random',
    asyncHandler(async (req, res) => {
        const quote = await records.getRandomQuote();
        res.json(quote);
    })
);

module.exports = router;
