const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataDir = path.join(__dirname, '..', 'data');

class DataModel {
    constructor(filename) {
        this.filename = filename;
        this.filePath = path.join(dataDir, filename);
    }

    readData() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    writeData(data) {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    }

    findById(id) {
        const data = this.readData();
        return data.find(item => item.id === id);
    }

    create(item) {
        const data = this.readData();
        const newItem = { ...item, id: uuidv4(), createdAt: new Date().toISOString() };
        data.push(newItem);
        this.writeData(data);
        return newItem;
    }

    update(id, updates) {
        const data = this.readData();
        const index = data.findIndex(item => item.id === id);
        if (index === -1) return null;
        
        data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
        this.writeData(data);
        return data[index];
    }

    delete(id) {
        const data = this.readData();
        const index = data.findIndex(item => item.id === id);
        if (index === -1) return false;
        
        data.splice(index, 1);
        this.writeData(data);
        return true;
    }

    getAll() {
        return this.readData();
    }
}

module.exports = DataModel;