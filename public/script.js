// Global state
let currentNovel = null;
let currentChapter = null;
let novels = [];
let characters = [];

// DOM elements
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    loadNovels();
    loadCharacters();
    setupTabSwitching();
}

function setupEventListeners() {
    // Novel management
    document.getElementById('create-novel-btn').addEventListener('click', () => openNovelModal());
    document.getElementById('novel-form').addEventListener('submit', handleNovelSubmit);
    document.getElementById('cancel-novel-btn').addEventListener('click', () => closeModal('novel-modal'));

    // Character management
    document.getElementById('create-character-btn').addEventListener('click', () => openCharacterModal());
    document.getElementById('character-form').addEventListener('submit', handleCharacterSubmit);
    document.getElementById('cancel-character-btn').addEventListener('click', () => closeModal('character-modal'));

    // Editor
    document.getElementById('add-chapter-btn').addEventListener('click', addNewChapter);
    document.getElementById('save-chapter-btn').addEventListener('click', saveCurrentChapter);
    document.getElementById('chapter-content').addEventListener('input', updateWordCount);
    document.getElementById('ai-continue-btn').addEventListener('click', () => aiContinueStory());

    // AI Assistant
    document.getElementById('ai-continue-story-btn').addEventListener('click', () => aiContinueStoryFromTab());
    document.getElementById('ai-develop-character-btn').addEventListener('click', () => aiDevelopCharacter());
    document.getElementById('ai-plot-suggestions-btn').addEventListener('click', () => aiPlotSuggestions());

    // Modal close handlers
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            modal.classList.remove('show');
        });
    });

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
}

function setupTabSwitching() {
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    // Remove active class from all tabs and contents
    navTabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`${tabId}-tab`).classList.add('active');

    // Load data if needed
    if (tabId === 'characters') {
        loadCharacters();
    }
}

// API functions
async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(`/api${endpoint}`, { ...defaultOptions, ...options });
    
    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }
    
    return response.json();
}

// Novel management
async function loadNovels() {
    try {
        novels = await apiCall('/novels');
        renderNovels();
    } catch (error) {
        console.error('Failed to load novels:', error);
        showNotification('加载小说列表失败', 'error');
    }
}

function renderNovels() {
    const novelsList = document.getElementById('novels-list');
    
    if (novels.length === 0) {
        novelsList.innerHTML = `
            <div class="empty-state">
                <h3>还没有小说</h3>
                <p>点击"创建新小说"开始您的创作之旅</p>
            </div>
        `;
        return;
    }

    novelsList.innerHTML = novels.map(novel => `
        <div class="novel-card">
            <h3>${novel.title}</h3>
            <p>${novel.description || '暂无简介'}</p>
            <div class="novel-stats">
                <span>📚 ${novel.chapters.length} 章</span>
                <span>📝 ${novel.wordCount || 0} 字</span>
                <span>🏷️ ${getGenreLabel(novel.genre)}</span>
            </div>
            <div class="novel-actions">
                <button class="btn btn-primary btn-small" onclick="editNovel('${novel.id}')">编辑</button>
                <button class="btn btn-secondary btn-small" onclick="openNovelModal('${novel.id}')">设置</button>
                <button class="btn btn-danger btn-small" onclick="deleteNovel('${novel.id}')">删除</button>
            </div>
        </div>
    `).join('');
}

function getGenreLabel(genre) {
    const genres = {
        fantasy: '奇幻',
        romance: '言情',
        mystery: '悬疑',
        scifi: '科幻',
        historical: '历史',
        other: '其他'
    };
    return genres[genre] || genre;
}

async function editNovel(novelId) {
    const novel = novels.find(n => n.id === novelId);
    if (!novel) return;

    currentNovel = novel;
    currentChapter = null;

    // Switch to editor tab
    switchTab('editor');
    
    // Update editor UI
    document.getElementById('current-novel-title').textContent = novel.title;
    document.getElementById('current-novel-stats').textContent = `字数: ${novel.wordCount || 0}`;
    
    renderChapters();
    clearEditor();
}

function renderChapters() {
    const chaptersContainer = document.getElementById('chapters-container');
    
    if (!currentNovel || currentNovel.chapters.length === 0) {
        chaptersContainer.innerHTML = '<p class="text-muted">暂无章节</p>';
        return;
    }

    chaptersContainer.innerHTML = currentNovel.chapters.map(chapter => `
        <div class="chapter-item" onclick="loadChapter('${chapter.id}')">
            <div class="chapter-title">${chapter.title}</div>
            <div class="chapter-stats">${chapter.wordCount || 0} 字</div>
        </div>
    `).join('');
}

function loadChapter(chapterId) {
    if (!currentNovel) return;

    const chapter = currentNovel.chapters.find(ch => ch.id === chapterId);
    if (!chapter) return;

    currentChapter = chapter;

    // Update UI
    document.getElementById('chapter-title').value = chapter.title;
    document.getElementById('chapter-content').value = chapter.content || '';
    
    // Highlight active chapter
    document.querySelectorAll('.chapter-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.chapter-item').classList.add('active');
    
    updateWordCount();
}

async function addNewChapter() {
    if (!currentNovel) {
        showNotification('请先选择一个小说', 'error');
        return;
    }

    try {
        const chapterData = {
            title: `第 ${currentNovel.chapters.length + 1} 章`,
            content: ''
        };

        const updatedNovel = await apiCall(`/novels/${currentNovel.id}/chapters`, {
            method: 'POST',
            body: JSON.stringify(chapterData)
        });

        currentNovel = updatedNovel;
        renderChapters();
        
        // Load the new chapter
        const newChapter = updatedNovel.chapters[updatedNovel.chapters.length - 1];
        loadChapter(newChapter.id);
        
        showNotification('新章节已添加', 'success');
    } catch (error) {
        console.error('Failed to add chapter:', error);
        showNotification('添加章节失败', 'error');
    }
}

async function saveCurrentChapter() {
    if (!currentNovel || !currentChapter) {
        showNotification('请先选择章节', 'error');
        return;
    }

    try {
        const title = document.getElementById('chapter-title').value;
        const content = document.getElementById('chapter-content').value;

        const updatedNovel = await apiCall(`/novels/${currentNovel.id}/chapters/${currentChapter.id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, content })
        });

        currentNovel = updatedNovel;
        currentChapter = updatedNovel.chapters.find(ch => ch.id === currentChapter.id);
        
        renderChapters();
        document.getElementById('current-novel-stats').textContent = `字数: ${updatedNovel.wordCount || 0}`;
        
        showNotification('章节已保存', 'success');
    } catch (error) {
        console.error('Failed to save chapter:', error);
        showNotification('保存章节失败', 'error');
    }
}

function updateWordCount() {
    const content = document.getElementById('chapter-content').value;
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const charCount = content.length;
    
    document.getElementById('word-count').textContent = `字数: ${wordCount}`;
    document.getElementById('char-count').textContent = `字符: ${charCount}`;
}

function clearEditor() {
    document.getElementById('chapter-title').value = '';
    document.getElementById('chapter-content').value = '';
    updateWordCount();
}

// Novel modal
function openNovelModal(novelId = null) {
    const modal = document.getElementById('novel-modal');
    const form = document.getElementById('novel-form');
    
    if (novelId) {
        const novel = novels.find(n => n.id === novelId);
        if (novel) {
            document.getElementById('novel-modal-title').textContent = '编辑小说';
            document.getElementById('novel-id').value = novel.id;
            document.getElementById('novel-title').value = novel.title;
            document.getElementById('novel-description').value = novel.description || '';
            document.getElementById('novel-genre').value = novel.genre || 'other';
        }
    } else {
        document.getElementById('novel-modal-title').textContent = '创建新小说';
        form.reset();
    }
    
    modal.classList.add('show');
}

async function handleNovelSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const novelData = {
        title: formData.get('title') || document.getElementById('novel-title').value,
        description: formData.get('description') || document.getElementById('novel-description').value,
        genre: formData.get('genre') || document.getElementById('novel-genre').value
    };

    const novelId = document.getElementById('novel-id').value;

    try {
        let novel;
        if (novelId) {
            novel = await apiCall(`/novels/${novelId}`, {
                method: 'PUT',
                body: JSON.stringify(novelData)
            });
        } else {
            novel = await apiCall('/novels', {
                method: 'POST',
                body: JSON.stringify(novelData)
            });
        }

        closeModal('novel-modal');
        await loadNovels();
        showNotification(novelId ? '小说已更新' : '小说已创建', 'success');
    } catch (error) {
        console.error('Failed to save novel:', error);
        showNotification('保存小说失败', 'error');
    }
}

async function deleteNovel(novelId) {
    if (!confirm('确定要删除这个小说吗？此操作不可撤销。')) {
        return;
    }

    try {
        await apiCall(`/novels/${novelId}`, { method: 'DELETE' });
        await loadNovels();
        showNotification('小说已删除', 'success');
    } catch (error) {
        console.error('Failed to delete novel:', error);
        showNotification('删除小说失败', 'error');
    }
}

// Character management
async function loadCharacters() {
    try {
        characters = await apiCall('/characters');
        renderCharacters();
        updateCharacterSelect();
    } catch (error) {
        console.error('Failed to load characters:', error);
        showNotification('加载角色列表失败', 'error');
    }
}

function renderCharacters() {
    const charactersList = document.getElementById('characters-list');
    
    if (characters.length === 0) {
        charactersList.innerHTML = `
            <div class="empty-state">
                <h3>还没有角色</h3>
                <p>点击"创建新角色"开始塑造您的角色</p>
            </div>
        `;
        return;
    }

    charactersList.innerHTML = characters.map(character => `
        <div class="character-card">
            <div class="character-header">
                <span class="character-name">${character.name}</span>
                <span class="character-role role-${character.role}">${getRoleLabel(character.role)}</span>
            </div>
            <div class="character-description">${character.description || '暂无描述'}</div>
            <div class="character-actions">
                <button class="btn btn-primary btn-small" onclick="openCharacterModal('${character.id}')">编辑</button>
                <button class="btn btn-danger btn-small" onclick="deleteCharacter('${character.id}')">删除</button>
            </div>
        </div>
    `).join('');
}

function getRoleLabel(role) {
    const roles = {
        protagonist: '主角',
        antagonist: '反角',
        supporting: '配角',
        minor: '次要'
    };
    return roles[role] || role;
}

function updateCharacterSelect() {
    const select = document.getElementById('character-select');
    select.innerHTML = '<option value="">选择角色</option>' + 
        characters.map(char => `<option value="${char.id}">${char.name}</option>`).join('');
}

function openCharacterModal(characterId = null) {
    const modal = document.getElementById('character-modal');
    const form = document.getElementById('character-form');
    
    if (characterId) {
        const character = characters.find(c => c.id === characterId);
        if (character) {
            document.getElementById('character-modal-title').textContent = '编辑角色';
            document.getElementById('character-id').value = character.id;
            document.getElementById('character-name').value = character.name;
            document.getElementById('character-role').value = character.role;
            document.getElementById('character-description').value = character.description || '';
            document.getElementById('character-personality').value = character.personality || '';
            document.getElementById('character-background').value = character.background || '';
            document.getElementById('character-appearance').value = character.appearance || '';
        }
    } else {
        document.getElementById('character-modal-title').textContent = '创建新角色';
        form.reset();
    }
    
    modal.classList.add('show');
}

async function handleCharacterSubmit(e) {
    e.preventDefault();
    
    const characterData = {
        name: document.getElementById('character-name').value,
        role: document.getElementById('character-role').value,
        description: document.getElementById('character-description').value,
        personality: document.getElementById('character-personality').value,
        background: document.getElementById('character-background').value,
        appearance: document.getElementById('character-appearance').value,
        novelId: currentNovel ? currentNovel.id : null
    };

    const characterId = document.getElementById('character-id').value;

    try {
        if (characterId) {
            await apiCall(`/characters/${characterId}`, {
                method: 'PUT',
                body: JSON.stringify(characterData)
            });
        } else {
            await apiCall('/characters', {
                method: 'POST',
                body: JSON.stringify(characterData)
            });
        }

        closeModal('character-modal');
        await loadCharacters();
        showNotification(characterId ? '角色已更新' : '角色已创建', 'success');
    } catch (error) {
        console.error('Failed to save character:', error);
        showNotification('保存角色失败', 'error');
    }
}

async function deleteCharacter(characterId) {
    if (!confirm('确定要删除这个角色吗？')) {
        return;
    }

    try {
        await apiCall(`/characters/${characterId}`, { method: 'DELETE' });
        await loadCharacters();
        showNotification('角色已删除', 'success');
    } catch (error) {
        console.error('Failed to delete character:', error);
        showNotification('删除角色失败', 'error');
    }
}

// AI Assistant functions
async function aiContinueStory() {
    const content = document.getElementById('chapter-content').value;
    if (!content.trim()) {
        showNotification('请先输入一些内容', 'error');
        return;
    }

    try {
        const response = await apiCall('/ai/continue-story', {
            method: 'POST',
            body: JSON.stringify({
                currentText: content,
                context: currentNovel ? currentNovel.description : '',
                tone: 'neutral',
                length: 'medium'
            })
        });

        const textarea = document.getElementById('chapter-content');
        textarea.value += '\n\n' + response.suggestion;
        updateWordCount();
        showNotification('AI续写完成', 'success');
    } catch (error) {
        console.error('Failed to continue story:', error);
        showNotification('AI续写失败', 'error');
    }
}

async function aiContinueStoryFromTab() {
    const context = document.getElementById('ai-context').value;
    const tone = document.getElementById('tone-select').value;

    if (!context.trim()) {
        showNotification('请输入故事内容', 'error');
        return;
    }

    try {
        const response = await apiCall('/ai/continue-story', {
            method: 'POST',
            body: JSON.stringify({
                currentText: context,
                tone: tone,
                length: 'medium'
            })
        });

        const output = document.getElementById('ai-suggestions');
        output.innerHTML = `
            <div class="ai-suggestion">
                <h4>AI续写建议：</h4>
                <p>${response.suggestion}</p>
                <small>置信度: ${(response.confidence * 100).toFixed(1)}%</small>
            </div>
        `;
    } catch (error) {
        console.error('Failed to continue story:', error);
        showNotification('AI续写失败', 'error');
    }
}

async function aiDevelopCharacter() {
    const characterId = document.getElementById('character-select').value;
    const scenario = document.getElementById('scenario-input').value;

    if (!characterId || !scenario.trim()) {
        showNotification('请选择角色并描述情境', 'error');
        return;
    }

    const character = characters.find(c => c.id === characterId);
    if (!character) return;

    try {
        const response = await apiCall('/ai/develop-character', {
            method: 'POST',
            body: JSON.stringify({
                character: character,
                scenario: scenario
            })
        });

        const output = document.getElementById('character-suggestions');
        output.innerHTML = `
            <div class="ai-suggestion">
                <h4>角色发展建议：</h4>
                <ul>
                    ${response.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                </ul>
                <small>置信度: ${(response.confidence * 100).toFixed(1)}%</small>
            </div>
        `;
    } catch (error) {
        console.error('Failed to develop character:', error);
        showNotification('角色发展建议失败', 'error');
    }
}

async function aiPlotSuggestions() {
    const plotInput = document.getElementById('plot-input').value;

    if (!plotInput.trim()) {
        showNotification('请输入当前情节概要', 'error');
        return;
    }

    try {
        const response = await apiCall('/ai/plot-suggestions', {
            method: 'POST',
            body: JSON.stringify({
                currentPlot: plotInput,
                characters: characters.filter(c => c.novelId === (currentNovel ? currentNovel.id : null)),
                genre: currentNovel ? currentNovel.genre : 'other'
            })
        });

        const output = document.getElementById('plot-suggestions');
        output.innerHTML = `
            <div class="ai-suggestion">
                <h4>情节发展建议：</h4>
                <ul>
                    ${response.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                </ul>
                <small>置信度: ${(response.confidence * 100).toFixed(1)}%</small>
            </div>
        `;
    } catch (error) {
        console.error('Failed to get plot suggestions:', error);
        showNotification('情节建议失败', 'error');
    }
}

// Utility functions
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Add notification styles
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 250px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.notification-success {
    background: #48bb78;
}

.notification-error {
    background: #f56565;
}

.notification-info {
    background: #4299e1;
}

.notification button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}
`;

// Add styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);