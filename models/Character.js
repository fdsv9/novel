const DataModel = require('./DataModel');

class CharacterModel extends DataModel {
    constructor() {
        super('characters.json');
    }

    createCharacter(characterData) {
        const character = {
            name: characterData.name || 'Unnamed Character',
            description: characterData.description || '',
            personality: characterData.personality || '',
            background: characterData.background || '',
            appearance: characterData.appearance || '',
            role: characterData.role || 'supporting',
            novelId: characterData.novelId || null
        };
        return this.create(character);
    }

    getCharactersByNovel(novelId) {
        const characters = this.getAll();
        return characters.filter(char => char.novelId === novelId);
    }
}

module.exports = CharacterModel;