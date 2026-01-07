/**
 * Frontend JavaScript - Gère l'interface utilisateur
 */

// État de l'application
let currentCategory = 'all';
let newsData = null;
let summaries = null;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Daily News Agent initialized');

    // Configurer les event listeners
    setupEventListeners();

    // Charger les données initiales
    loadAllData();
});

/**
 * Configure tous les event listeners
 */
function setupEventListeners() {
    // Bouton de rafraîchissement
    document.getElementById('refreshBtn').addEventListener('click', () => {
        refreshData();
    });

    // Onglets de catégories
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            switchCategory(category);
        });
    });
}

/**
 * Charge toutes les données (news + summary)
 */
async function loadAllData() {
    showLoading();

    try {
        // Charger les news et le résumé en parallèle
        const [newsResponse, summaryResponse] = await Promise.all([
            fetch('/api/news'),
            fetch('/api/summary')
        ]);

        if (!newsResponse.ok || !summaryResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        const newsResult = await newsResponse.json();
        const summaryResult = await summaryResponse.json();

        newsData = newsResult.data;
        summaries = { daily: summaryResult.data.summary };

        // Afficher les données
        displaySummary(summaries.daily);
        displayStats(newsData);
        displayArticles(currentCategory);
        updateLastUpdate();

        console.log('✅ Data loaded successfully');

    } catch (error) {
        console.error('❌ Error loading data:', error);
        showError('Erreur lors du chargement des données. Veuillez réessayer.');
    }
}

/**
 * Rafraîchit les données
 */
async function refreshData() {
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = '<span class="btn-icon">⏳</span> Actualisation...';

    try {
        const response = await fetch('/api/refresh', { method: 'POST' });

        if (!response.ok) {
            throw new Error('Refresh failed');
        }

        // Recharger toutes les données
        await loadAllData();

        refreshBtn.innerHTML = '<span class="btn-icon">✅</span> Actualisé!';
        setTimeout(() => {
            refreshBtn.innerHTML = '<span class="btn-icon">🔄</span> Actualiser';
            refreshBtn.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('❌ Error refreshing:', error);
        refreshBtn.innerHTML = '<span class="btn-icon">❌</span> Erreur';
        setTimeout(() => {
            refreshBtn.innerHTML = '<span class="btn-icon">🔄</span> Actualiser';
            refreshBtn.disabled = false;
        }, 2000);
    }
}

/**
 * Change de catégorie
 */
function switchCategory(category) {
    currentCategory = category;

    // Mettre à jour les onglets actifs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        }
    });

    // Afficher les articles de la catégorie
    displayArticles(category);
}

/**
 * Affiche le résumé quotidien
 */
function displaySummary(summaryText) {
    const summaryCard = document.getElementById('dailySummary');

    // Convertir le markdown en HTML basique
    const htmlContent = summaryText
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    summaryCard.innerHTML = `<div class="summary-content">${htmlContent}</div>`;
}

/**
 * Affiche les statistiques
 */
function displayStats(data) {
    const totalArticles = data.articles.length;
    const avgScore = totalArticles > 0
        ? (data.articles.reduce((sum, a) => sum + a.importanceScore, 0) / totalArticles).toFixed(1)
        : 0;
    const categoriesCount = Object.keys(data.articlesByCategory).length;
    const topScore = totalArticles > 0
        ? Math.max(...data.articles.map(a => a.importanceScore)).toFixed(1)
        : 0;

    document.getElementById('totalArticles').textContent = totalArticles;
    document.getElementById('avgScore').textContent = avgScore;
    document.getElementById('categoriesCount').textContent = categoriesCount;
    document.getElementById('topScore').textContent = topScore;
}

/**
 * Affiche les articles
 */
function displayArticles(category) {
    const articlesGrid = document.getElementById('articlesGrid');

    let articles = [];
    if (category === 'all') {
        articles = newsData.articles;
    } else {
        articles = newsData.articlesByCategory[category] || [];
    }

    if (articles.length === 0) {
        articlesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <p>Aucun article important trouvé dans cette catégorie.</p>
            </div>
        `;
        return;
    }

    articlesGrid.innerHTML = articles.map(article => createArticleCard(article)).join('');

    // Ajouter les event listeners pour ouvrir les articles
    articlesGrid.querySelectorAll('.article-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            window.open(articles[index].link, '_blank');
        });
    });
}

/**
 * Crée une carte d'article
 */
function createArticleCard(article) {
    const categoryIcons = {
        finance: '💰',
        ai: '🤖',
        healthcare: '🏥',
        tech: '💻',
        general: '🌍'
    };

    const categoryColors = {
        finance: 'rgba(245, 158, 11, 0.2)',
        ai: 'rgba(139, 92, 246, 0.2)',
        healthcare: 'rgba(16, 185, 129, 0.2)',
        tech: 'rgba(59, 130, 246, 0.2)',
        general: 'rgba(107, 114, 128, 0.2)'
    };

    const categoryBorders = {
        finance: 'rgba(245, 158, 11, 0.3)',
        ai: 'rgba(139, 92, 246, 0.3)',
        healthcare: 'rgba(16, 185, 129, 0.3)',
        tech: 'rgba(59, 130, 246, 0.3)',
        general: 'rgba(107, 114, 128, 0.3)'
    };

    const icon = categoryIcons[article.category] || '📰';
    const bgColor = categoryColors[article.category] || categoryColors.general;
    const borderColor = categoryBorders[article.category] || categoryBorders.general;

    const date = new Date(article.pubDate);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });

    const scoreColor = article.importanceScore >= 9 ? '#ef4444' :
        article.importanceScore >= 8 ? '#f59e0b' :
            article.importanceScore >= 7 ? '#10b981' : '#6b7280';

    return `
        <div class="article-card">
            <div class="article-header">
                <span class="article-category" style="background: ${bgColor}; border-color: ${borderColor};">
                    ${icon} ${article.category}
                </span>
                <span class="article-score" style="color: ${scoreColor};">
                    ⭐ ${article.importanceScore}
                </span>
            </div>
            <h3 class="article-title">${article.title}</h3>
            <p class="article-snippet">${article.contentSnippet || 'Aucun aperçu disponible.'}</p>
            <div class="article-footer">
                <span class="article-source">${article.source}</span>
                <span class="article-date">${formattedDate}</span>
            </div>
        </div>
    `;
}

/**
 * Met à jour l'heure de dernière mise à jour
 */
function updateLastUpdate() {
    const now = new Date();
    const formatted = now.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    document.getElementById('lastUpdate').textContent = `Mis à jour: ${formatted}`;
}

/**
 * Affiche l'état de chargement
 */
function showLoading() {
    document.getElementById('dailySummary').innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Génération du résumé quotidien...</p>
        </div>
    `;

    document.getElementById('articlesGrid').innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Chargement des articles...</p>
        </div>
    `;
}

/**
 * Affiche une erreur
 */
function showError(message) {
    document.getElementById('dailySummary').innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">❌</div>
            <p>${message}</p>
        </div>
    `;

    document.getElementById('articlesGrid').innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">❌</div>
            <p>${message}</p>
        </div>
    `;
}

// Auto-refresh toutes les 30 minutes
setInterval(() => {
    console.log('🔄 Auto-refreshing data...');
    loadAllData();
}, 30 * 60 * 1000);

// ===== CHAT FUNCTIONALITY =====
let conversationHistory = [];
let isChatOpen = false;

// Initialiser le chat
function initChat() {
    const chatToggle = document.getElementById('chatToggle');
    const chatContainer = document.getElementById('chatContainer');
    const chatClose = document.getElementById('chatClose');
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');

    // Toggle chat window
    chatToggle.addEventListener('click', () => {
        isChatOpen = !isChatOpen;
        chatContainer.classList.toggle('active');
        if (isChatOpen) {
            chatToggle.style.display = 'none';
            chatInput.focus();
        }
    });

    // Close chat
    chatClose.addEventListener('click', () => {
        isChatOpen = false;
        chatContainer.classList.remove('active');
        chatToggle.style.display = 'flex';
    });

    // Send message on button click
    chatSend.addEventListener('click', () => {
        sendChatMessage();
    });

    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });
}

// Envoyer un message au chat
async function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const message = chatInput.value.trim();

    if (!message) return;

    // Ajouter le message de l'utilisateur
    addChatMessage(message, 'user');
    conversationHistory.push({ role: 'user', content: message });

    // Vider l'input
    chatInput.value = '';
    chatSend.disabled = true;

    // Afficher l'indicateur de frappe
    showTypingIndicator();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                conversationHistory: conversationHistory.slice(-10) // Garder les 10 derniers messages
            })
        });

        if (!response.ok) {
            throw new Error('Chat request failed');
        }

        const result = await response.json();
        const aiResponse = result.data.response;

        // Retirer l'indicateur de frappe
        removeTypingIndicator();

        // Ajouter la réponse de l'IA
        addChatMessage(aiResponse, 'ai');
        conversationHistory.push({ role: 'assistant', content: aiResponse });

    } catch (error) {
        console.error('❌ Error sending chat message:', error);
        removeTypingIndicator();
        addChatMessage('Désolé, une erreur s\'est produite. Veuillez réessayer.', 'ai');
    } finally {
        chatSend.disabled = false;
        chatInput.focus();
    }
}

// Ajouter un message au chat
function addChatMessage(content, role) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}-message`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll vers le bas
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Afficher l'indicateur de frappe
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai-message';
    typingDiv.id = 'typingIndicator';

    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Retirer l'indicateur de frappe
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Initialiser le chat au chargement
document.addEventListener('DOMContentLoaded', () => {
    initChat();
});
