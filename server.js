/**
 * Serveur Express - API pour l'agent d'actualités
 * Expose les endpoints pour récupérer les news et résumés
 */

const express = require('express');
const path = require('path');
require('dotenv').config();

const { fetchAllNews, fetchTopArticles } = require('./news-fetcher');
const { generateAllSummaries, generateCategorySummary } = require('./ai-summarizer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Cache pour éviter de refetch trop souvent
let newsCache = {
    data: null,
    timestamp: null,
    summaries: null,
    marketRecap: null
};

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Récupère les news (avec cache)
 */
async function getNews(forceRefresh = false) {
    const now = Date.now();

    if (!forceRefresh && newsCache.data && newsCache.timestamp) {
        const cacheAge = now - newsCache.timestamp;
        if (cacheAge < CACHE_DURATION) {
            console.log('📦 Returning cached news');
            return newsCache.data;
        }
    }

    console.log('🔄 Fetching fresh news...');
    const minScore = 6.0; // Abaissé à 6.0 pour permettre les catégories de niche
    const newsData = await fetchAllNews({
        category: 'all',
        minImportanceScore: minScore,
        maxArticlesPerCategory: 10,
        onlyYesterday: true
    });

    newsCache.data = newsData;
    newsCache.timestamp = now;
    newsCache.summaries = null; // Reset summaries cache

    return newsData;
}

/**
 * Récupère les résumés (avec cache)
 */
async function getSummaries(forceRefresh = false) {
    if (!forceRefresh && newsCache.summaries) {
        console.log('📦 Returning cached summaries');
        return newsCache.summaries;
    }

    const newsData = await getNews(forceRefresh);
    console.log('🤖 Generating summaries...');
    const summaries = await generateAllSummaries(newsData.articlesByCategory);

    newsCache.summaries = summaries;
    newsCache.marketRecap = summaries.marketRecap;
    return summaries;
}

// ===== ROUTES API =====

/**
 * GET /api/news
 * Récupère tous les articles importants
 */
app.get('/api/news', async (req, res) => {
    try {
        const forceRefresh = req.query.refresh === 'true';
        const newsData = await getNews(forceRefresh);

        res.json({
            success: true,
            data: {
                articles: newsData.articles,
                articlesByCategory: newsData.articlesByCategory,
                stats: newsData.stats
            },
            cached: !forceRefresh && newsCache.timestamp !== null,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in /api/news:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/news/:category
 * Récupère les articles d'une catégorie spécifique
 */
app.get('/api/news/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const forceRefresh = req.query.refresh === 'true';
        const newsData = await getNews(forceRefresh);

        const categoryArticles = newsData.articlesByCategory[category] || [];

        res.json({
            success: true,
            data: {
                category,
                articles: categoryArticles,
                count: categoryArticles.length
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error(`Error in /api/news/${req.params.category}:`, error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/summary
 * Récupère le résumé quotidien global
 */
app.get('/api/summary', async (req, res) => {
    try {
        const forceRefresh = req.query.refresh === 'true';
        const summaries = await getSummaries(forceRefresh);

        res.json({
            success: true,
            data: {
                summary: summaries.daily,
                type: 'daily'
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in /api/summary:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/summary/:category
 * Récupère le résumé d'une catégorie spécifique
 */
app.get('/api/summary/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const forceRefresh = req.query.refresh === 'true';
        const summaries = await getSummaries(forceRefresh);

        const categorySummary = summaries.byCategory[category];

        if (!categorySummary) {
            return res.status(404).json({
                success: false,
                error: `No summary found for category: ${category}`
            });
        }

        res.json({
            success: true,
            data: {
                category,
                summary: categorySummary
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error(`Error in /api/summary/${req.params.category}:`, error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/market-recap
 * Récupère le market recap (Equity, FX, Credit, Rates)
 */
app.get('/api/market-recap', async (req, res) => {
    try {
        const forceRefresh = req.query.refresh === 'true';
        const summaries = await getSummaries(forceRefresh);

        if (!summaries.marketRecap) {
            return res.status(404).json({
                success: false,
                error: 'Market recap not available'
            });
        }

        res.json({
            success: true,
            data: {
                marketRecap: summaries.marketRecap
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in /api/market-recap:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/stats
 * Récupère les statistiques
 */
app.get('/api/stats', async (req, res) => {
    try {
        const newsData = await getNews();

        res.json({
            success: true,
            data: {
                stats: newsData.stats,
                categoryCounts: Object.entries(newsData.articlesByCategory).map(([cat, arts]) => ({
                    category: cat,
                    count: arts.length,
                    avgScore: (arts.reduce((sum, a) => sum + a.importanceScore, 0) / arts.length).toFixed(1)
                })),
                cacheAge: newsCache.timestamp ? Math.floor((Date.now() - newsCache.timestamp) / 1000) : null
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in /api/stats:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/chat
 * Chat avec l'IA sur les actualités
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(503).json({
                success: false,
                error: 'Gemini API key not configured'
            });
        }

        // Récupérer les actualités pour le contexte
        const newsData = await getNews();
        const summaries = await getSummaries();

        // Préparer le contexte des actualités
        const topArticles = newsData.articles.slice(0, 20);
        const newsContext = topArticles.map((article, idx) =>
            `${idx + 1}. [${article.category.toUpperCase()}] ${article.title}\n` +
            `   Source: ${article.source} | Score: ${article.importanceScore}/10\n` +
            `   ${article.contentSnippet.substring(0, 150)}...`
        ).join('\n\n');

        // Construire l'historique de conversation
        const conversationText = conversationHistory.map(msg =>
            `${msg.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}`
        ).join('\n\n');

        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Tu es un assistant IA expert en actualités financières, technologiques et mondiales. Tu aides les utilisateurs à comprendre et analyser l'actualité.

CONTEXTE - ACTUALITÉS DU JOUR (${new Date().toLocaleDateString('fr-FR')}):
${newsContext}

RÉSUMÉ QUOTIDIEN:
${summaries.daily.substring(0, 500)}...

${conversationHistory.length > 0 ? `HISTORIQUE DE CONVERSATION:\n${conversationText}\n\n` : ''}QUESTION DE L'UTILISATEUR:
${message}

INSTRUCTIONS:
1. Réponds en français de manière professionnelle et concise
2. Utilise les actualités ci-dessus comme contexte principal
3. Si la question porte sur une actualité spécifique, cite la source
4. Si tu ne trouves pas l'info dans les actualités, dis-le clairement
5. Sois précis, factuel, et professionnel
6. Limite ta réponse à 200-300 mots maximum

Réponds maintenant:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResponse = response.text();

        console.log(`💬 Chat response generated for: "${message.substring(0, 50)}..."`);

        res.json({
            success: true,
            data: {
                response: aiResponse,
                articlesCount: topArticles.length,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error in /api/chat:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/refresh
 * Force le rafraîchissement du cache
 */
app.post('/api/refresh', async (req, res) => {
    try {
        console.log('🔄 Manual refresh requested');
        const newsData = await getNews(true);
        const summaries = await getSummaries(true);

        res.json({
            success: true,
            message: 'Cache refreshed successfully',
            data: {
                articlesCount: newsData.articles.length,
                stats: newsData.stats
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in /api/refresh:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Route principale - sert l'interface web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 Daily News Agent Server Started!');
    console.log('='.repeat(60));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🌐 Open in browser: http://localhost:${PORT}`);
    console.log('\n📊 API Endpoints:');
    console.log(`   GET  /api/news              - All important articles`);
    console.log(`   GET  /api/news/:category    - Articles by category`);
    console.log(`   GET  /api/summary           - Daily summary`);
    console.log(`   GET  /api/summary/:category - Category summary`);
    console.log(`   GET  /api/market-recap      - Market recap (Equity, FX, Credit, Rates)`);
    console.log(`   GET  /api/stats             - Statistics`);
    console.log(`   POST /api/refresh           - Force refresh`);
    console.log('\n💡 Categories: finance, ai, healthcare, tech, general');
    console.log('='.repeat(60) + '\n');

    // Pré-charger les news au démarrage
    console.log('🔄 Pre-loading news...\n');
    getNews().then(() => {
        console.log('✅ News pre-loaded and ready!\n');
    }).catch(err => {
        console.error('❌ Error pre-loading news:', err.message);
    });
});

module.exports = app;
