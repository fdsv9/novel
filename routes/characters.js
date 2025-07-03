const express = require('express');
const CharacterModel = require('../models/Character');

const router = express.Router();
const characterModel = new CharacterModel();

// Get all characters
router.get('/', (req, res) => {
    try {
        const { novelId } = req.query;
        let characters;
        
        if (novelId) {
            characters = characterModel.getCharactersByNovel(novelId);
        } else {
            characters = characterModel.getAll();
        }
        
        res.json(characters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific character
router.get('/:id', (req, res) => {
    try {
        const character = characterModel.findById(req.params.id);
        if (!character) {
            return res.status(404).json({ error: 'Character not found' });
        }
        res.json(character);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new character
router.post('/', (req, res) => {
    try {
        const character = characterModel.createCharacter(req.body);
        res.status(201).json(character);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a character
router.put('/:id', (req, res) => {
    try {
        const character = characterModel.update(req.params.id, req.body);
        if (!character) {
            return res.status(404).json({ error: 'Character not found' });
        }
        res.json(character);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a character
router.delete('/:id', (req, res) => {
    try {
        const success = characterModel.delete(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Character not found' });
        }
        res.json({ message: 'Character deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;