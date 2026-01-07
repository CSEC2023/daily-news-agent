/**
 * Module de récupération et filtrage intelligent des actualités
 * Récupère les articles et calcule un score d'importance pour chacun
 */

const Parser = require('rss-parser');
const axios = require('axios');
const {
    getAllSourcesByPriority,
    getImportanceKeywords,
    getSourcesByCategory
} = require('./news-sources');

const parser = new Parser({
    timeout: 10000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsAgent/1.0)'
    }
});

/**
 * Calcule le score d'importance d'un article (0-10)
 * Basé sur: mots-clés, longueur, source, fraîcheur
 */
function calculateImportanceScore(article, source) {
    let score = source.priority || 5; // Score de base = priorité de la source

    const title = (article.title || '').toLowerCase();
    const content = (article.contentSnippet || article.content || '').toLowerCase();
    const fullText = `${title} ${content}`;

    // 1. Mots-clés d'importance (+0.5 par mot-clé, max +3)
    const keywords = getImportanceKeywords(source.category);
    let keywordMatches = 0;
    keywords.forEach(keyword => {
        if (fullText.includes(keyword.toLowerCase())) {
            keywordMatches++;
        }
    });
    score += Math.min(keywordMatches * 0.5, 3);

    // 2. Longueur du contenu (articles substantiels = +1 à +2)
    const contentLength = content.length;
    if (contentLength > 500) score += 1;
    if (contentLength > 1000) score += 1;

    // 3. Mots indiquant l'importance dans le titre (+1 à +2)
    const importanceIndicators = [
        'breaking', 'urgent', 'major', 'historic', 'unprecedented',
        'exclusive', 'revealed', 'announces', 'launches',
        'billion', 'trillion', 'milliard', 'record'
    ];
    importanceIndicators.forEach(indicator => {
        if (title.includes(indicator)) {
            score += 0.5;
        }
    });

    // 4. Fraîcheur (articles récents = +0.5)
    const pubDate = new Date(article.pubDate || article.isoDate);
    const now = new Date();
    const hoursSincePublished = (now - pubDate) / (1000 * 60 * 60);
    if (hoursSincePublished < 24) score += 0.5;

    // 5. Présence de chiffres/données (articles factuels = +0.5)
    const hasNumbers = /\d+%|\$\d+|\d+\s*(million|billion|trillion|milliard)/.test(fullText);
    if (hasNumbers) score += 0.5;

    // Normaliser entre 0 et 10
    return Math.min(Math.max(score, 0), 10);
}

/**
 * Vérifie si un article est du jour précédent
 */
function isFromYesterday(article) {
    const pubDate = new Date(article.pubDate || article.isoDate);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const tomorrow = new Date(now);
    tomorrow.setHours(0, 0, 0, 0);

    return pubDate >= yesterday && pubDate < tomorrow;
}

/**
 * Récupère les articles d'une source RSS
 */
async function fetchFromRSS(source) {
    try {
        console.log(`📡 Fetching from ${source.name}...`);
        const feed = await parser.parseURL(source.url);

        const articles = feed.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate || item.isoDate,
            content: item.content || item.contentSnippet || item.summary || '',
            contentSnippet: item.contentSnippet || item.summary || '',
            source: source.name,
            category: source.category,
            author: item.creator || item.author || '',
            image: item.enclosure?.url || item.image?.url || null
        }));

        console.log(`✅ Found ${articles.length} articles from ${source.name}`);
        return articles;
    } catch (error) {
        console.error(`❌ Error fetching ${source.name}:`, error.message);
        return [];
    }
}

/**
 * Récupère et filtre les actualités de toutes les sources
 */
async function fetchAllNews(options = {}) {
    const {
        category = 'all',
        minImportanceScore = 7,
        maxArticlesPerCategory = 10,
        onlyYesterday = true
    } = options;

    console.log('\n🚀 Starting news fetch...');
    console.log(`📊 Category: ${category}`);
    console.log(`⭐ Min importance score: ${minImportanceScore}`);
    console.log(`📰 Max articles per category: ${maxArticlesPerCategory}\n`);

    // Récupérer les sources
    const sources = category === 'all'
        ? getAllSourcesByPriority()
        : getSourcesByCategory(category);

    // Récupérer les articles de toutes les sources en parallèle
    const allArticlesPromises = sources.map(source => fetchFromRSS(source));
    const allArticlesArrays = await Promise.all(allArticlesPromises);
    const allArticles = allArticlesArrays.flat();

    console.log(`\n📊 Total articles fetched: ${allArticles.length}`);

    // Filtrer par date si nécessaire
    let filteredArticles = allArticles;
    if (onlyYesterday) {
        filteredArticles = allArticles.filter(isFromYesterday);
        console.log(`📅 Articles from yesterday: ${filteredArticles.length}`);
    }

    // Calculer le score d'importance pour chaque article
    const articlesWithScores = filteredArticles.map(article => {
        const source = sources.find(s => s.name === article.source);
        const importanceScore = calculateImportanceScore(article, source);
        return {
            ...article,
            importanceScore: Math.round(importanceScore * 10) / 10 // Arrondir à 1 décimale
        };
    });

    // Filtrer par score minimum
    const importantArticles = articlesWithScores.filter(
        article => article.importanceScore >= minImportanceScore
    );

    console.log(`⭐ Important articles (score >= ${minImportanceScore}): ${importantArticles.length}`);

    // Trier par score d'importance (décroissant)
    importantArticles.sort((a, b) => b.importanceScore - a.importanceScore);

    // Grouper par catégorie et limiter le nombre
    const articlesByCategory = {};
    importantArticles.forEach(article => {
        const cat = article.category;
        if (!articlesByCategory[cat]) {
            articlesByCategory[cat] = [];
        }
        if (articlesByCategory[cat].length < maxArticlesPerCategory) {
            articlesByCategory[cat].push(article);
        }
    });

    // Afficher les statistiques
    console.log('\n📈 Articles by category:');
    Object.entries(articlesByCategory).forEach(([cat, articles]) => {
        console.log(`  ${cat}: ${articles.length} articles`);
    });

    // Retourner les articles triés
    const finalArticles = Object.values(articlesByCategory).flat();
    finalArticles.sort((a, b) => b.importanceScore - a.importanceScore);

    console.log(`\n✨ Final selection: ${finalArticles.length} articles\n`);

    return {
        articles: finalArticles,
        articlesByCategory,
        stats: {
            totalFetched: allArticles.length,
            afterDateFilter: filteredArticles.length,
            afterImportanceFilter: importantArticles.length,
            final: finalArticles.length
        }
    };
}

/**
 * Récupère les top articles pour une catégorie spécifique
 */
async function fetchTopArticles(category, limit = 5) {
    const result = await fetchAllNews({
        category,
        minImportanceScore: 7,
        maxArticlesPerCategory: limit,
        onlyYesterday: true
    });

    return result.articles.slice(0, limit);
}

module.exports = {
    fetchAllNews,
    fetchTopArticles,
    calculateImportanceScore,
    isFromYesterday
};
