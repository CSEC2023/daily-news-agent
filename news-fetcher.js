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
 * Calcule la similarité entre deux titres (0-1)
 * Utilise la distance de Levenshtein normalisée
 */
function calculateTitleSimilarity(title1, title2) {
    const s1 = title1.toLowerCase().trim();
    const s2 = title2.toLowerCase().trim();

    // Si les titres sont identiques
    if (s1 === s2) return 1.0;

    // Calculer la distance de Levenshtein
    const matrix = [];
    const len1 = s1.length;
    const len2 = s2.length;

    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    const distance = matrix[len1][len2];
    const maxLength = Math.max(len1, len2);
    return 1 - (distance / maxLength);
}

/**
 * Supprime les articles en double basés sur la similarité des titres
 */
function removeDuplicates(articles, similarityThreshold = 0.85) {
    const uniqueArticles = [];
    const seen = new Set();

    for (const article of articles) {
        let isDuplicate = false;

        // Vérifier si un article similaire existe déjà
        for (const uniqueArticle of uniqueArticles) {
            const similarity = calculateTitleSimilarity(article.title, uniqueArticle.title);

            if (similarity >= similarityThreshold) {
                isDuplicate = true;
                // Garder l'article avec le meilleur score
                if (article.importanceScore > uniqueArticle.importanceScore) {
                    // Remplacer l'article existant par le nouveau
                    const index = uniqueArticles.indexOf(uniqueArticle);
                    uniqueArticles[index] = article;
                }
                break;
            }
        }

        if (!isDuplicate) {
            uniqueArticles.push(article);
        }
    }

    return uniqueArticles;
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
        minImportanceScore = 6.0, // Abaissé à 6.0 pour permettre les catégories de niche
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

    // NOUVEAU: Supprimer les doublons basés sur la similarité des titres
    const uniqueArticles = removeDuplicates(importantArticles, 0.85);
    console.log(`🔍 After deduplication: ${uniqueArticles.length} unique articles`);

    // Définir des scores minimums par catégorie (plus indulgent pour les niches)
    const categoryMinScores = {
        adtech: 6.0,      // Catégorie de niche - très indulgent
        healthcare: 6.5,  // Catégorie de niche - plus indulgent
        tech: 7.0,        // Catégorie populaire mais spécialisée
        ai: 7.0,          // Catégorie populaire mais spécialisée
        finance: 7.5,     // Catégorie principale - strict
        bourse: 7.5,      // Catégorie principale - strict
        monde: 7.5,       // Catégorie principale - strict
        europe: 7.0,      // Catégorie régionale
        france: 7.0,      // Catégorie régionale
        general: 7.5      // Catégorie principale - strict
    };

    // Grouper par catégorie avec scores minimums adaptés
    const articlesByCategory = {};
    uniqueArticles.forEach(article => {
        const cat = article.category;
        const minScore = categoryMinScores[cat] || 7.0; // Score par défaut: 7.0

        // Appliquer le score minimum spécifique à la catégorie
        if (article.importanceScore >= minScore) {
            if (!articlesByCategory[cat]) {
                articlesByCategory[cat] = [];
            }
            if (articlesByCategory[cat].length < maxArticlesPerCategory) {
                articlesByCategory[cat].push(article);
            }
        }
    });

    // Afficher les statistiques
    console.log('\n📈 Articles by category:');
    Object.entries(articlesByCategory).forEach(([cat, articles]) => {
        const minScore = categoryMinScores[cat] || 7.0;
        console.log(`  ${cat}: ${articles.length} articles (min score: ${minScore})`);
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
            afterDeduplication: uniqueArticles.length,
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
        minImportanceScore: 6.0,
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
