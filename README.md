# AI驱动的小说创作工具 📚

一个基于Node.js的AI驱动长篇小说创作工具，提供完整的前端界面来管理小说创作的各个环节。

![应用主界面](https://github.com/user-attachments/assets/0d1cd3c0-49ed-410c-a8de-2abd560d62c1)

## 功能特性

### 📖 小说管理
- 创建、编辑和删除小说
- 支持多种类型：奇幻、言情、悬疑、科幻、历史等
- 自动统计字数和章节数量
- 小说状态管理

### ✏️ 章节编辑器
- 富文本编辑界面
- 实时字数和字符统计
- 章节管理（添加、编辑、删除）
- 自动保存功能

### 🎭 角色管理
- 创建和管理小说角色
- 详细的角色信息：姓名、描述、性格、背景、外貌
- 角色类型分类：主角、反角、配角、次要角色
- 角色卡片展示

### 🤖 AI写作助手
- **故事续写**：基于当前内容智能续写故事
- **角色发展**：为特定角色和情境提供发展建议
- **情节建议**：根据当前情节提供发展方向
- **对话生成**：为角色生成合适的对话内容

![AI助手界面](https://github.com/user-attachments/assets/3e69bf33-6685-44e6-9eca-4abf47d57e76)

## 技术栈

### 后端
- **Node.js** + **Express.js** - Web服务器框架
- **JSON文件存储** - 轻量级数据持久化
- **UUID** - 唯一标识符生成
- **CORS** - 跨域资源共享

### 前端
- **原生HTML5/CSS3/JavaScript** - 无框架依赖
- **响应式设计** - 支持移动端和桌面端
- **模态框** - 用户友好的交互界面
- **实时更新** - 动态内容刷新

## 安装和运行

### 环境要求
- Node.js 14+ 
- npm 6+

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd novel
```

2. 安装依赖
```bash
npm install
```

3. 启动服务器
```bash
npm start
```

4. 访问应用
打开浏览器访问：`http://localhost:3000`

## 项目结构

```
novel/
├── server.js              # 主服务器文件
├── package.json           # 项目配置和依赖
├── models/                # 数据模型
│   ├── DataModel.js       # 基础数据模型
│   ├── Novel.js           # 小说模型
│   └── Character.js       # 角色模型
├── routes/                # API路由
│   ├── novels.js          # 小说相关API
│   ├── characters.js      # 角色相关API
│   └── ai.js              # AI助手API
├── public/                # 前端静态文件
│   ├── index.html         # 主页面
│   ├── style.css          # 样式文件
│   └── script.js          # 前端逻辑
├── data/                  # 数据存储目录
│   ├── novels.json        # 小说数据
│   └── characters.json    # 角色数据
└── README.md              # 项目说明
```

## API接口

### 小说管理
- `GET /api/novels` - 获取所有小说
- `POST /api/novels` - 创建新小说
- `GET /api/novels/:id` - 获取特定小说
- `PUT /api/novels/:id` - 更新小说
- `DELETE /api/novels/:id` - 删除小说

### 章节管理
- `POST /api/novels/:id/chapters` - 添加章节
- `PUT /api/novels/:novelId/chapters/:chapterId` - 更新章节
- `DELETE /api/novels/:novelId/chapters/:chapterId` - 删除章节

### 角色管理
- `GET /api/characters` - 获取所有角色
- `POST /api/characters` - 创建新角色
- `GET /api/characters/:id` - 获取特定角色
- `PUT /api/characters/:id` - 更新角色
- `DELETE /api/characters/:id` - 删除角色

### AI助手
- `POST /api/ai/continue-story` - 故事续写
- `POST /api/ai/develop-character` - 角色发展建议
- `POST /api/ai/plot-suggestions` - 情节建议
- `POST /api/ai/generate-dialogue` - 对话生成

## 使用指南

### 创建小说
1. 点击"创建新小说"按钮
2. 填写小说标题、简介和类型
3. 点击保存完成创建

### 编写章节
1. 在小说列表中点击"编辑"按钮
2. 点击"新增章节"添加章节
3. 在编辑器中输入章节标题和内容
4. 点击"保存"保存章节

### 使用AI助手
1. 切换到"AI助手"标签页
2. 选择相应的AI功能
3. 输入相关内容或选择角色
4. 点击对应按钮获取AI建议

### 管理角色
1. 切换到"角色管理"标签页
2. 点击"创建新角色"
3. 填写角色详细信息
4. 保存后可在AI助手中使用

## 特色功能

### 智能写作辅助
- 基于上下文的故事续写
- 个性化角色发展建议
- 多样化情节发展方向
- 自然的对话生成

### 用户友好界面
- 现代化的UI设计
- 直观的操作流程
- 实时反馈和提示
- 响应式布局支持

### 数据管理
- 自动保存和备份
- 结构化数据存储
- 高效的检索和更新
- 数据完整性保护

## 开发计划

### 即将推出
- [ ] 真实AI集成（OpenAI GPT-4）
- [ ] 小说导出功能（PDF、EPUB）
- [ ] 多用户支持
- [ ] 云存储同步
- [ ] 版本控制
- [ ] 写作目标和进度跟踪

### 未来功能
- [ ] 语音转文字
- [ ] 多语言支持
- [ ] 协作写作
- [ ] 写作模板
- [ ] 数据分析和洞察

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

ISC License

## 联系方式

如有问题或建议，请创建Issue或联系项目维护者。