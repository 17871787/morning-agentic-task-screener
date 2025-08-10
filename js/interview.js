// Interview System
const interview = {
    // Interview state
    state: {
        currentQuestion: 0,
        responses: {},
        tasks: [],
        selectedTasks: [],
        context: {
            hasProposals: false,
            hasClientWork: false,
            hasMeetings: false,
            hasBacklog: false,
            priorities: [],
            blockers: [],
            timeframe: 'today'
        },
        phase: 'greeting', // greeting, discovery, deep-dive, synthesis
        messageHistory: []
    },

    // Question flow
    questions: {
        greeting: {
            text: "Good morning! ☀️ Ready to find some tasks we can delegate to agents today? Let's start with a quick check-in. What's your main focus for today?",
            quickActions: ["Client deliverables", "Internal operations", "Proposals", "Planning & strategy", "Catching up"],
            followUp: 'focus'
        },
        focus: {
            text: "Got it. Now, what's been on your mind this morning that feels repetitive or time-consuming?",
            quickActions: ["Status reports", "Email drafts", "Document updates", "Meeting prep", "Data analysis"],
            followUp: 'timeframe'
        },
        timeframe: {
            text: "What's your deadline pressure looking like?",
            quickActions: ["Due today", "Due this week", "Due this month", "No specific deadline"],
            followUp: 'meetings'
        },
        meetings: {
            text: "Any meetings or reviews coming up that need preparation?",
            quickActions: ["Client meeting today", "Team standup", "Steering committee", "QBR this week", "None planned"],
            followUp: 'blockers'
        },
        blockers: {
            text: "What's currently blocking you or eating up too much time?",
            quickActions: ["Writing/drafting", "Data gathering", "Status updates", "Email responses", "Documentation"],
            followUp: 'documents'
        },
        documents: {
            text: "Which documents or deliverables are you working with? (You can list multiple)",
            quickActions: ["Proposals", "Status reports", "Meeting notes", "Client updates", "Technical docs"],
            followUp: 'automation'
        },
        automation: {
            text: "What would you love to never have to do manually again?",
            quickActions: ["Weekly status emails", "Meeting summaries", "Action item extraction", "Progress reports", "Document formatting"],
            followUp: 'deep_dive'
        },
        deep_dive: {
            text: "Let me dig deeper. Which of these resonates most with your morning?",
            quickActions: [
                "I have unprocessed meeting notes",
                "I need to write multiple updates",
                "I'm behind on proposals", 
                "I need to prep for a review",
                "I have routine reports due"
            ],
            followUp: 'synthesis'
        }
    },

    // Command templates
    commandTemplates: {
        weekly_status: {
            name: "Weekly Status Generator",
            commands: [".claude/commands/weekly_status.md", ".claude/commands/email_weekly_update.md"],
            time_saved: 30,
            pattern: /weekly|status|Friday|update/gi
        },
        proposal_pipeline: {
            name: "Proposal Pipeline",
            commands: [".claude/commands/r0_draft.md", ".claude/commands/r3_finalize.md"],
            time_saved: 90,
            pattern: /proposal|SOW|RFP|draft/gi
        },
        meeting_processor: {
            name: "Meeting Notes Processor",
            commands: [".claude/commands/action_extractor.md", ".claude/commands/summary_generator.md"],
            time_saved: 45,
            pattern: /meeting|notes|actions|transcript/gi
        },
        client_updates: {
            name: "Client Update Suite",
            commands: [".claude/commands/context_distiller_client.md", ".claude/commands/daily_heartbeat.md"],
            time_saved: 25,
            pattern: /client|Long Clawson|account|stakeholder/gi
        },
        documentation: {
            name: "Documentation Builder",
            commands: [".claude/commands/doc_generator.md", ".claude/commands/readme_builder.md"],
            time_saved: 40,
            pattern: /documentation|readme|technical|guide/gi
        }
    },

    // Initialize
    init() {
        this.loadState();
        this.setupEventListeners();
        this.startInterview();
    },

    // Setup event listeners
    setupEventListeners() {
        const input = document.getElementById('userInput');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserInput();
            }
        });

        // Auto-resize textarea
        input.addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + Enter to send
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                this.handleUserInput();
            }
            // Number keys for quick actions
            if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey) {
                const quickActions = document.querySelectorAll('.quick-action');
                const index = parseInt(e.key) - 1;
                if (quickActions[index] && document.activeElement.tagName !== 'TEXTAREA') {
                    quickActions[index].click();
                }
            }
        });
    },

    // Start interview
    startInterview() {
        this.addMessage('assistant', this.questions.greeting.text);
        this.showQuickActions(this.questions.greeting.quickActions);
        this.updateProgress(10);
    },

    // Add message to chat
    addMessage(sender, text, skipAnimation = false) {
        const chatArea = document.getElementById('chatArea');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${sender}`;
        if (!skipAnimation) messageDiv.style.animation = 'slideIn 0.3s ease';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;

        const meta = document.createElement('div');
        meta.className = 'message-meta';
        meta.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        messageDiv.appendChild(bubble);
        messageDiv.appendChild(meta);
        chatArea.appendChild(messageDiv);

        // Scroll to bottom
        chatArea.scrollTop = chatArea.scrollHeight;

        // Save to history
        this.state.messageHistory.push({ sender, text, timestamp: new Date() });
    },

    // Show thinking indicator
    showThinking() {
        const chatArea = document.getElementById('chatArea');
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'thinking';
        thinkingDiv.id = 'thinking';
        thinkingDiv.innerHTML = `
            <div class="thinking-dot"></div>
            <div class="thinking-dot"></div>
            <div class="thinking-dot"></div>
        `;
        chatArea.appendChild(thinkingDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
    },

    // Hide thinking indicator
    hideThinking() {
        const thinking = document.getElementById('thinking');
        if (thinking) thinking.remove();
    },

    // Show quick actions
    showQuickActions(actions) {
        const container = document.getElementById('quickActions');
        container.innerHTML = actions.map((action, index) => `
            <button class="quick-action" onclick="interview.handleQuickAction('${action}')">
                <span style="opacity: 0.5; margin-right: 0.25rem;">${index + 1}</span>
                ${action}
            </button>
        `).join('');
    },

    // Handle quick action click
    handleQuickAction(action) {
        this.handleUserInput(action);
    },

    // Handle user input
    handleUserInput(quickText = null) {
        const input = document.getElementById('userInput');
        const text = quickText || input.value.trim();
        
        if (!text) return;

        // Add user message
        this.addMessage('user', text);
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';

        // Process response
        this.showThinking();
        setTimeout(() => {
            this.processResponse(text);
        }, 800);
    },

    // Process user response
    processResponse(text) {
        this.hideThinking();

        // Analyze the response for task patterns
        this.detectTasks(text);

        // Determine next question
        const currentQ = Object.values(this.questions).find(q => 
            q.text === this.state.messageHistory.filter(m => m.sender === 'assistant').pop()?.text
        );

        if (currentQ && currentQ.followUp) {
            const nextQ = this.questions[currentQ.followUp];
            if (nextQ) {
                // Add contextual response before next question
                const contextualResponse = this.getContextualResponse(text);
                this.addMessage('assistant', contextualResponse);
                
                setTimeout(() => {
                    this.addMessage('assistant', nextQ.text);
                    this.showQuickActions(nextQ.quickActions);
                    this.updateProgress(this.state.messageHistory.length * 10);
                }, 1000);
            } else {
                // End of questions - synthesize
                this.synthesizeTasks();
            }
        } else {
            // Continue with synthesis
            this.synthesizeTasks();
        }
    },

    // Get contextual response based on user input
    getContextualResponse(text) {
        const responses = {
            proposals: "Proposals can definitely be streamlined with agents. Let me understand your timeline better.",
            status: "Status reports are perfect for automation - we can save you hours each week.",
            meeting: "Meeting prep is a great candidate for delegation. Let's explore what you need.",
            client: "Client work often has repeatable patterns we can automate.",
            email: "Email drafting is something agents excel at. Let's dig deeper.",
            default: "Interesting - I can see some opportunities there."
        };

        for (const [key, response] of Object.entries(responses)) {
            if (text.toLowerCase().includes(key)) {
                return response;
            }
        }
        return responses.default;
    },

    // Detect tasks from text
    detectTasks(text) {
        Object.entries(this.commandTemplates).forEach(([key, template]) => {
            const matches = text.match(template.pattern);
            if (matches && matches.length > 0) {
                const confidence = Math.min(0.95, 0.6 + (matches.length * 0.1));
                const task = {
                    id: `task_${Date.now()}_${key}`,
                    title: template.name,
                    description: `Detected from: "${text.slice(0, 100)}..."`,
                    commands: template.commands,
                    confidence: confidence,
                    timeSaved: template.time_saved,
                    category: key,
                    source: text
                };
                
                // Avoid duplicates
                if (!this.state.tasks.find(t => t.category === key)) {
                    this.state.tasks.push(task);
                    this.renderTasks();
                }
            }
        });
    },

    // Synthesize discovered tasks
    synthesizeTasks() {
        if (this.state.tasks.length === 0) {
            this.addMessage('assistant', 
                "Hmm, I haven't identified specific agentic tasks yet. Could you tell me more about what's taking up most of your time today? For example, any documents you need to write or data you need to process?"
            );
            this.showQuickActions(["Writing proposals", "Processing emails", "Creating reports", "Updating documentation"]);
        } else {
            const timeSaved = this.state.tasks.reduce((sum, task) => sum + task.timeSaved, 0);
            this.addMessage('assistant', 
                `Excellent! I've identified ${this.state.tasks.length} tasks we can automate, potentially saving you ${timeSaved} minutes today. Select the tasks on the right that you'd like to delegate, and I'll prepare the Claude Code commands for you.`
            );
            
            // Show action buttons
            const chatArea = document.getElementById('chatArea');
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'action-buttons';
            actionsDiv.innerHTML = `
                <button class="action-btn primary" onclick="interview.selectAllTasks()">Select All Tasks</button>
                <button class="action-btn" onclick="interview.addMoreContext()">Add More Context</button>
                <button class="action-btn" onclick="interview.exportPlan()">Export Plan</button>
            `;
            chatArea.appendChild(actionsDiv);
        }
        
        this.updateProgress(100);
    },

    // Render tasks
    renderTasks() {
        const container = document.getElementById('tasksContainer');
        
        if (this.state.tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🤖</div>
                    <div>No tasks discovered yet</div>
                    <div style="font-size: 0.875rem; margin-top: 0.5rem;">
                        Answer the questions to identify agentic opportunities
                    </div>
                </div>
            `;
            document.getElementById('commandOutput').style.display = 'none';
            return;
        }

        // Group tasks by confidence
        const highConfidence = this.state.tasks.filter(t => t.confidence >= 0.8);
        const mediumConfidence = this.state.tasks.filter(t => t.confidence >= 0.6 && t.confidence < 0.8);
        const lowConfidence = this.state.tasks.filter(t => t.confidence < 0.6);

        let html = '';
        
        if (highConfidence.length > 0) {
            html += this.renderTaskSection('High Confidence', highConfidence, 'confidence-high');
        }
        if (mediumConfidence.length > 0) {
            html += this.renderTaskSection('Medium Confidence', mediumConfidence, 'confidence-medium');
        }
        if (lowConfidence.length > 0) {
            html += this.renderTaskSection('Review Needed', lowConfidence, 'confidence-low');
        }

        container.innerHTML = html;
        
        // Update stats
        document.getElementById('taskCount').textContent = this.state.tasks.length;
        document.getElementById('commandCount').textContent = 
            this.state.tasks.reduce((sum, t) => sum + t.commands.length, 0);
        document.getElementById('timeEstimate').textContent = 
            this.state.tasks.reduce((sum, t) => sum + t.timeSaved, 0) + 'm';

        // Show command output if tasks selected
        if (this.state.selectedTasks.length > 0) {
            this.updateCommandOutput();
        }
    },

    // Render task section
    renderTaskSection(title, tasks, confidenceClass) {
        return `
            <div class="task-section">
                <div class="section-header">
                    <div class="section-title">${title}</div>
                    <div class="section-badge">${tasks.length}</div>
                </div>
                ${tasks.map(task => `
                    <div class="task-card ${this.state.selectedTasks.includes(task.id) ? 'selected' : ''}" 
                         onclick="interview.toggleTask('${task.id}')">
                        <div class="task-header">
                            <div class="task-title">${task.title}</div>
                            <div class="task-confidence ${confidenceClass}">
                                ${Math.round(task.confidence * 100)}%
                            </div>
                        </div>
                        <div class="task-context">${task.description}</div>
                        <div class="task-commands">
                            ${task.commands.map(cmd => 
                                `<div class="command-chip">${cmd.split('/').pop()}</div>`
                            ).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Toggle task selection
    toggleTask(taskId) {
        const index = this.state.selectedTasks.indexOf(taskId);
        if (index > -1) {
            this.state.selectedTasks.splice(index, 1);
        } else {
            this.state.selectedTasks.push(taskId);
        }
        this.renderTasks();
        this.updateCommandOutput();
    },

    // Select all tasks
    selectAllTasks() {
        this.state.selectedTasks = this.state.tasks.map(t => t.id);
        this.renderTasks();
        this.updateCommandOutput();
    },

    // Update command output
    updateCommandOutput() {
        const selected = this.state.tasks.filter(t => 
            this.state.selectedTasks.includes(t.id)
        );
        
        if (selected.length === 0) {
            document.getElementById('commandOutput').style.display = 'none';
            return;
        }

        document.getElementById('commandOutput').style.display = 'block';
        
        const commands = [];
        selected.forEach((task, index) => {
            commands.push(`# Task ${index + 1}: ${task.title}`);
            commands.push('');
            task.commands.forEach(cmd => {
                commands.push(`## Command: ${cmd.split('/').pop()}`);
                commands.push(`.Open ${cmd}`);
                commands.push(`Context from: ${task.source.slice(0, 50)}...`);
                commands.push('Write outputs to registry/');
                commands.push('Minimal response, files only.');
                commands.push('');
            });
            commands.push('---');
            commands.push('');
        });

        document.getElementById('commandText').textContent = commands.join('\n');
    },

    // Copy commands
    copyCommands() {
        const text = document.getElementById('commandText').textContent;
        navigator.clipboard.writeText(text).then(() => {
            const btn = event.target;
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    },

    // Add more context
    addMoreContext() {
        this.addMessage('assistant', 
            "Tell me more about your workload. What else is on your plate that feels repetitive?"
        );
        this.showQuickActions([
            "Data analysis",
            "Report generation", 
            "Email responses",
            "Meeting scheduling",
            "Documentation updates"
        ]);
    },

    // Export plan
    exportPlan() {
        const selected = this.state.tasks.filter(t => 
            this.state.selectedTasks.includes(t.id)
        );
        
        let markdown = `# Morning Agentic Plan\n`;
        markdown += `## ${new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n\n`;
        markdown += `## Interview Summary\n\n`;
        
        // Add conversation highlights
        markdown += `### Key Points Discussed:\n`;
        this.state.messageHistory
            .filter(m => m.sender === 'user')
            .slice(-5)
            .forEach(m => {
                markdown += `- ${m.text}\n`;
            });
        
        markdown += `\n## Discovered Tasks (${selected.length})\n\n`;
        selected.forEach((task, index) => {
            markdown += `### ${index + 1}. ${task.title}\n`;
            markdown += `- **Confidence**: ${Math.round(task.confidence * 100)}%\n`;
            markdown += `- **Time Saved**: ${task.timeSaved} minutes\n`;
            markdown += `- **Commands**: ${task.commands.join(', ')}\n\n`;
        });
        
        markdown += `## Total Time Saved: ${selected.reduce((sum, t) => sum + t.timeSaved, 0)} minutes\n\n`;
        markdown += `## Commands to Execute\n\n\`\`\`\n${document.getElementById('commandText').textContent}\n\`\`\``;

        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `morning-plan-${new Date().toISOString().split('T')[0]}.md`;
        a.click();
    },

    // Update progress bar
    updateProgress(percent) {
        document.getElementById('progressBar').style.width = percent + '%';
    },

    // Save state
    saveState() {
        localStorage.setItem('morningInterviewState', JSON.stringify(this.state));
    },

    // Load state
    loadState() {
        const saved = localStorage.getItem('morningInterviewState');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Only load if from today
                const today = new Date().toDateString();
                const savedDate = new Date(parsed.messageHistory[0]?.timestamp).toDateString();
                if (today === savedDate) {
                    this.state = parsed;
                    // Restore conversation
                    this.state.messageHistory.forEach(msg => {
                        this.addMessage(msg.sender, msg.text, true);
                    });
                    this.renderTasks();
                }
            } catch (e) {
                console.error('Failed to load state:', e);
            }
        }
    }
};