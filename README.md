# Morning Agentic Task Screener 🤖☕

An intelligent interview system designed to identify and automate repetitive tasks through AI agents. This web application conducts a conversational interview to discover opportunities for task delegation, helping users save hours of manual work each day.

## 🎯 Purpose

The Morning Agentic Task Screener addresses a common problem: professionals spend significant time on repetitive tasks that could be automated. This tool helps identify these opportunities through an intelligent conversation, then generates actionable commands for AI agents to handle the work.

## 🚀 Live Demo

Access the application at: [https://morning-agentic-task-screener.vercel.app](https://morning-agentic-task-screener.vercel.app)

## ✨ Key Features

### Intelligent Interview System
- **Adaptive Questioning**: The system adapts its questions based on your responses
- **Context Building**: Gradually builds understanding of your workflow and pain points
- **Pattern Recognition**: Automatically identifies tasks suitable for AI automation
- **Confidence Scoring**: Rates each discovered task by automation potential

### Task Discovery & Analysis
- **Real-time Detection**: Identifies automation opportunities as you type
- **Categorization**: Groups tasks by confidence level and type
- **Time Savings**: Estimates minutes saved per task
- **Command Generation**: Creates ready-to-use AI agent commands

### User Experience
- **Split Interface**: Interview on the left, discovered tasks on the right
- **Quick Actions**: Pre-populated response options for faster interaction
- **Keyboard Shortcuts**: Number keys for quick selection
- **Progress Tracking**: Visual progress bar for interview completion
- **Session Persistence**: Saves your progress locally

## 🎭 How It Works

### 1. Interview Phase
The system starts with a warm greeting and asks about your daily focus. Through a series of targeted questions, it explores:
- Current priorities and deadlines
- Repetitive or time-consuming tasks
- Upcoming meetings and deliverables
- Common blockers and pain points

### 2. Pattern Detection
As you respond, the system analyzes your text for patterns indicating automatable tasks:
- Weekly status reports
- Proposal drafting
- Meeting note processing
- Client communications
- Documentation updates

### 3. Task Synthesis
After gathering information, the system:
- Presents discovered automation opportunities
- Shows confidence levels for each task
- Displays potential time savings
- Allows task selection and customization

### 4. Command Generation
Selected tasks are converted into:
- Structured AI agent commands
- Context from your responses
- Clear execution instructions
- Export-ready documentation

## 🛠️ Technology Stack

- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Styling**: CSS3 with CSS Variables for theming
- **Storage**: LocalStorage for session persistence
- **Deployment**: Vercel static hosting
- **Version Control**: GitHub

## 📦 Installation & Development

### Prerequisites
- Node.js (for local development server)
- Git

### Local Setup
```bash
# Clone the repository
git clone https://github.com/17871787/morning-agentic-task-screener.git
cd morning-agentic-task-screener

# Install dependencies (minimal - just for dev server)
npm install

# Start local development server
npm start
# or
npm run dev
```

### Project Structure
```
morning-agentic-task-screener/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # All styling
├── js/
│   ├── interview.js    # Core interview logic & state
│   └── app.js         # Application initialization
├── package.json       # Project metadata
├── vercel.json       # Deployment configuration
└── README.md         # Documentation
```

## 🎮 Usage Guide

### Starting an Interview
1. Visit the application URL
2. Read the welcome message
3. Click on quick actions or type your response
4. Continue answering questions to build context

### Keyboard Shortcuts
- `Enter` - Send message
- `Cmd/Ctrl + Enter` - Alternative send
- `1-9` - Select numbered quick actions
- `Tab` - Navigate between elements

### Managing Discovered Tasks
- Click task cards to select/deselect
- Review confidence scores (High/Medium/Low)
- Check estimated time savings
- Use "Select All Tasks" for bulk selection

### Exporting Results
- **Copy Commands**: One-click copy all generated commands
- **Export Plan**: Download complete automation plan as Markdown
- **Add Context**: Provide additional information for better commands

## 🧠 AI Task Categories

### Weekly Status Generator
- Automates Friday status reports
- Creates email drafts
- Time saved: ~30 minutes/week

### Proposal Pipeline
- Drafts initial proposals
- Handles revisions and refinements
- Time saved: ~90 minutes/proposal

### Meeting Processor
- Extracts action items
- Generates summaries
- Time saved: ~45 minutes/meeting

### Client Updates
- Creates stakeholder communications
- Maintains consistent messaging
- Time saved: ~25 minutes/update

### Documentation Builder
- Generates technical documentation
- Creates README files
- Time saved: ~40 minutes/document

## 🔒 Privacy & Security

- **Local Processing**: All interview data processed client-side
- **No Backend**: No server-side data collection
- **Session Storage**: Data persists only in browser localStorage
- **Daily Reset**: Session data expires after 24 hours
- **No Authentication**: No user accounts or personal data storage

## 🚀 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables
None required - pure static site

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Maintain the no-framework approach
2. Ensure mobile responsiveness
3. Test keyboard navigation
4. Preserve local storage functionality
5. Update documentation for new features

## 📈 Future Enhancements

- [ ] Additional task templates
- [ ] Custom command templates
- [ ] Integration with AI platforms
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Voice input support

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Designed for professionals seeking to optimize their workflow
- Built to complement AI agent platforms like Claude Code
- Inspired by the need to identify repetitive work patterns

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Visit the live application
- Review the documentation

---

**Built with ❤️ to save time and automate the repetitive**