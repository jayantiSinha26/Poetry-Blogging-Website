const express = require('express');
const router = express.Router();
const Poem = require('../models/Poem');

// Get all poems
router.get('/', async (req, res) => {
    try {
        const poems = await Poem.find().sort({ createdAt: -1 });
        res.json(poems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single poem
router.get('/:id', async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.id);
        if (!poem) {
            return res.status(404).json({ message: 'Poem not found' });
        }
        res.json(poem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new poem
router.post('/', async (req, res) => {
    const poem = new Poem({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        category: req.body.category
    });

    try {
        const newPoem = await poem.save();
        res.status(201).json(newPoem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a poem
router.patch('/:id', async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.id);
        if (!poem) {
            return res.status(404).json({ message: 'Poem not found' });
        }

        if (req.body.title) poem.title = req.body.title;
        if (req.body.content) poem.content = req.body.content;
        if (req.body.category) poem.category = req.body.category;

        const updatedPoem = await poem.save();
        res.json(updatedPoem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a poem
router.delete('/:id', async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.id);
        if (!poem) {
            return res.status(404).json({ message: 'Poem not found' });
        }
        await poem.remove();
        res.json({ message: 'Poem deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a comment to a poem
router.post('/:id/comments', async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.id);
        if (!poem) {
            return res.status(404).json({ message: 'Poem not found' });
        }

        poem.comments.push({
            text: req.body.text,
            author: req.body.author
        });

        const updatedPoem = await poem.save();
        res.json(updatedPoem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Like a poem
router.post('/:id/like', async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.id);
        if (!poem) {
            return res.status(404).json({ message: 'Poem not found' });
        }

        poem.likes += 1;
        const updatedPoem = await poem.save();
        res.json(updatedPoem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router; 