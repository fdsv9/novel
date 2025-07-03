const DataModel = require('./DataModel');

class NovelModel extends DataModel {
    constructor() {
        super('novels.json');
    }

    createNovel(novelData) {
        const novel = {
            title: novelData.title || 'Untitled Novel',
            description: novelData.description || '',
            genre: novelData.genre || '',
            chapters: [],
            wordCount: 0,
            status: 'draft'
        };
        return this.create(novel);
    }

    addChapter(novelId, chapterData) {
        const novel = this.findById(novelId);
        if (!novel) return null;

        const chapter = {
            id: require('uuid').v4(),
            title: chapterData.title || `Chapter ${novel.chapters.length + 1}`,
            content: chapterData.content || '',
            wordCount: this.countWords(chapterData.content || ''),
            createdAt: new Date().toISOString()
        };

        novel.chapters.push(chapter);
        novel.wordCount = this.calculateTotalWordCount(novel.chapters);
        
        return this.update(novelId, { chapters: novel.chapters, wordCount: novel.wordCount });
    }

    updateChapter(novelId, chapterId, updates) {
        const novel = this.findById(novelId);
        if (!novel) return null;

        const chapterIndex = novel.chapters.findIndex(ch => ch.id === chapterId);
        if (chapterIndex === -1) return null;

        novel.chapters[chapterIndex] = {
            ...novel.chapters[chapterIndex],
            ...updates,
            wordCount: this.countWords(updates.content || novel.chapters[chapterIndex].content),
            updatedAt: new Date().toISOString()
        };

        novel.wordCount = this.calculateTotalWordCount(novel.chapters);
        
        return this.update(novelId, { chapters: novel.chapters, wordCount: novel.wordCount });
    }

    deleteChapter(novelId, chapterId) {
        const novel = this.findById(novelId);
        if (!novel) return null;

        const chapterIndex = novel.chapters.findIndex(ch => ch.id === chapterId);
        if (chapterIndex === -1) return null;

        novel.chapters.splice(chapterIndex, 1);
        novel.wordCount = this.calculateTotalWordCount(novel.chapters);
        
        return this.update(novelId, { chapters: novel.chapters, wordCount: novel.wordCount });
    }

    countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    calculateTotalWordCount(chapters) {
        return chapters.reduce((total, chapter) => total + (chapter.wordCount || 0), 0);
    }
}

module.exports = NovelModel;