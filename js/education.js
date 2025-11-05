// ============================================================
// MyHubCares - Health Education Resources
// ============================================================

const Education = {
    // Load education page
    loadEducationPage(container) {
        const modules = JSON.parse(localStorage.getItem('educationModules')) || [];
        const faqs = JSON.parse(localStorage.getItem('faqs')) || [];

        let html = `
            <div class="tabs">
                <div class="tab active" data-tab="modules">Learning Modules</div>
                <div class="tab" data-tab="faqs">FAQs</div>
                <div class="tab" data-tab="forum">Community Forum</div>
            </div>

            <div class="tab-content active" id="modulesTab">
                ${this.renderModules(modules)}
            </div>

            <div class="tab-content" id="faqsTab">
                ${this.renderFAQs(faqs)}
            </div>

            <div class="tab-content" id="forumTab">
                ${this.renderForum()}
            </div>
        `;

        container.innerHTML = html;

        // Setup tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                document.getElementById(tabName + 'Tab').classList.add('active');
            });
        });

        // Initialize accordion
        this.initializeAccordion();
    },

    // Render learning modules
    renderModules(modules) {
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Interactive Learning Modules</h3>
                    <div class="search-bar">
                        <input type="text" id="moduleSearch" class="search-input" placeholder="Search modules...">
                    </div>
                </div>
                <div class="card-body">
                    <div class="education-modules" id="moduleGrid">
                        ${modules.map(module => `
                            <div class="module-card">
                                <div class="module-thumbnail">
                                    ${this.getModuleIcon(module.category)}
                                </div>
                                <div class="module-content">
                                    <h3 class="module-title">${module.title}</h3>
                                    <p class="module-description">${module.description}</p>
                                    <div class="d-flex justify-between align-center">
                                        <span class="badge badge-primary">${module.category}</span>
                                        <span class="text-muted">⏱ ${module.readTime}</span>
                                    </div>
                                    <button class="btn btn-primary btn-sm mt-2" onclick="Education.viewModule(${module.id})">
                                        Start Learning
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // Get module icon
    getModuleIcon(category) {
        const icons = {
            basics: '📚',
            lifestyle: '🏃',
            treatment: '💊',
            prevention: '🛡️'
        };
        return icons[category] || '📖';
    },

    // Render FAQs
    renderFAQs(faqs) {
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Frequently Asked Questions</h3>
                </div>
                <div class="card-body">
                    <div id="faqAccordion">
                        ${faqs.map((faq, index) => `
                            <div class="accordion-item" data-id="${faq.id}">
                                <div class="accordion-header">
                                    <span>${faq.question}</span>
                                    <span class="accordion-icon">▼</span>
                                </div>
                                <div class="accordion-content">
                                    <div class="accordion-body">
                                        ${faq.answer}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // Render community forum
    renderForum() {
        const mockPosts = [
            {
                id: 1,
                author: 'Anonymous User',
                title: 'Tips for Managing Side Effects',
                content: 'I wanted to share some tips that have helped me manage medication side effects...',
                replies: 5,
                date: '2 days ago'
            },
            {
                id: 2,
                author: 'Community Member',
                title: 'Staying Positive and Healthy',
                content: 'Here are some daily habits that have improved my quality of life...',
                replies: 12,
                date: '5 days ago'
            },
            {
                id: 3,
                author: 'Support Group',
                title: 'Monthly Virtual Support Meeting',
                content: 'Join us for our monthly virtual support group meeting this Saturday...',
                replies: 8,
                date: '1 week ago'
            }
        ];

        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Community Forum</h3>
                    <button class="btn btn-primary btn-sm" onclick="Education.showNewPostModal()">
                        New Post
                    </button>
                </div>
                <div class="card-body">
                    <div class="alert alert-info">
                        <strong>Community Guidelines:</strong> This is a safe space for sharing experiences and support. Please be respectful and maintain confidentiality.
                    </div>
                    ${mockPosts.map(post => `
                        <div class="patient-card">
                            <div class="patient-info">
                                <div>
                                    <h3>${post.title}</h3>
                                    <p class="text-muted">${post.content}</p>
                                    <div class="patient-meta">
                                        <span>👤 ${post.author}</span>
                                        <span>💬 ${post.replies} replies</span>
                                        <span>📅 ${post.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="patient-actions">
                                <button class="btn btn-sm btn-primary" onclick="Education.viewPost(${post.id})">
                                    View Discussion
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // Initialize accordion
    initializeAccordion() {
        setTimeout(() => {
            document.querySelectorAll('.accordion-item').forEach(item => {
                const header = item.querySelector('.accordion-header');
                header.addEventListener('click', () => {
                    item.classList.toggle('active');
                });
            });
        }, 100);
    },

    // View module
    viewModule(moduleId) {
        const modules = JSON.parse(localStorage.getItem('educationModules')) || [];
        const module = modules.find(m => m.id === moduleId);

        if (!module) {
            App.showError('Module not found');
            return;
        }

        const content = `
            <div class="module-thumbnail" style="height: 150px; margin-bottom: 20px;">
                ${this.getModuleIcon(module.category)}
            </div>
            <div>
                <span class="badge badge-primary">${module.category}</span>
                <span class="text-muted">⏱ ${module.readTime}</span>
            </div>
            <h3 class="mt-2">${module.title}</h3>
            <p class="text-muted mb-3">${module.description}</p>
            <div class="accordion-item active">
                <div class="accordion-header">
                    <strong>Module Content</strong>
                    <span class="accordion-icon">▼</span>
                </div>
                <div class="accordion-content">
                    <div class="accordion-body">
                        ${module.content}
                    </div>
                </div>
            </div>
            <div class="alert alert-success mt-3">
                <strong>Key Takeaways:</strong>
                <ul>
                    <li>Understanding is the first step to effective management</li>
                    <li>Always consult with your healthcare provider</li>
                    <li>You are not alone in this journey</li>
                </ul>
            </div>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Close</button>
            <button class="btn btn-primary" onclick="App.closeModal()">Mark as Complete</button>
        `;

        App.showModal(module.title, content, footer);

        // Re-initialize accordion in modal
        setTimeout(() => {
            document.querySelectorAll('.modal .accordion-item').forEach(item => {
                const header = item.querySelector('.accordion-header');
                if (header) {
                    header.addEventListener('click', () => {
                        item.classList.toggle('active');
                    });
                }
            });
        }, 100);
    },

    // Show new post modal
    showNewPostModal() {
        const content = `
            <form id="newPostForm">
                <div class="form-group">
                    <label class="required">Title</label>
                    <input type="text" id="postTitle" required>
                </div>
                <div class="form-group">
                    <label class="required">Content</label>
                    <textarea id="postContent" rows="6" required></textarea>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" checked>
                        Post anonymously
                    </label>
                </div>
            </form>
        `;

        const footer = `
            <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="Education.submitPost()">Post</button>
        `;

        App.showModal('New Forum Post', content, footer);
    },

    // Submit post (simulated)
    submitPost() {
        const form = document.getElementById('newPostForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        App.closeModal();
        App.showSuccess('Your post has been submitted and is pending moderation');
    },

    // View post (simulated)
    viewPost(postId) {
        const content = `
            <div class="alert alert-info">
                This is a simulated community forum post. In a production environment, this would display the full discussion thread.
            </div>
            <p>Post content and replies would be displayed here.</p>
        `;

        App.showModal('Forum Discussion', content, '');
    }
};

