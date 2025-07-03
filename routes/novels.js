const express = require('express');
const NovelModel = require('../models/Novel');

const router = express.Router();
const novelModel = new NovelModel();

// Get all novels
router.get('/', (req, res) => {
    try {
        const novels = novelModel.getAll();
        res.json(novels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific novel
router.get('/:id', (req, res) => {
    try {
        const novel = novelModel.findById(req.params.id);
        if (!novel) {
            return res.status(404).json({ error: 'Novel not found' });
        }
        res.json(novel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new novel
router.post('/', (req, res) => {
    try {
        const novel = novelModel.createNovel(req.body);
        res.status(201).json(novel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a novel
router.put('/:id', (req, res) => {
    try {
        const novel = novelModel.update(req.params.id, req.body);
        if (!novel) {
            return res.status(404).json({ error: 'Novel not found' });
        }
        res.json(novel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a novel
router.delete('/:id', (req, res) => {
    try {
        const success = novelModel.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Novel not found' });
        }
        res.json({ message: 'Novel deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a chapter to a novel
router.post('/:id/chapters', (req, res) => {
    try {
        const novel = novelModel.addChapter(req.params.id, req.body);
        if (!novel) {
            return res.status(404).json({ error: 'Novel not found' });
        }
        res.status(201).json(novel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a chapter
router.put('/:novelId/chapters/:chapterId', (req, res) => {
    try {
        const novel = novelModel.updateChapter(req.params.novelId, req.params.chapterId, req.body);
        if (!novel) {
            return res.status(404).json({ error: 'Novel or chapter not found' });
        }
        res.json(novel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a chapter
router.delete('/:novelId/chapters/:chapterId', (req, res) => {
    try {
        const novel = novelModel.deleteChapter(req.params.novelId, req.params.chapterId);
        if (!novel) {
            return res.status(404).json({ error: 'Novel or chapter not found' });
        }
        res.json(novel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;