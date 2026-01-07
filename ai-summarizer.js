/**
 * Module de résumé intelligent avec Gemini AI
 * Génère des résumés structurés et identifie les points clés
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialiser Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Génère un résumé quotidien global de tous les articles
 */
async function generateDailySummary(articles) {
    if (!process.env.GEMINI_API_KEY) {
        console.warn('⚠️  GEMINI_API_KEY not set, returning basic summary');
        return generateBasicSummary(articles);
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Préparer les articles pour le prompt
        const articlesText = articles.slice(0, 30).map((article, idx) =>
            `${idx + 1}. [${article.category.toUpperCase()}] ${article.title}\n` +
            `   Score: ${article.importanceScore}/10 | Source: ${article.source}\n` +
            `   ${article.contentSnippet.substring(0, 200)}...`
        ).join('\n\n');

        const prompt = `Tu es un analyste financier et technologique expert. Voici les actualités les plus importantes d'hier.

ARTICLES (${articles.length} au total, top 30 affichés):
${articlesText}

MISSION:
Génère un résumé quotidien structuré en français pour un professionnel de la finance qui se prépare à des entretiens. Le résumé doit être:
1. **Concis mais informatif** (300-400 mots maximum)
2. **Orienté finance et business** - mets l'accent sur l'impact économique
3. **Structuré** avec des sections claires
4. **Actionnable** - pourquoi ces infos sont importantes

STRUCTURE REQUISE:
📊 **FINANCE & ÉCONOMIE**
[2-3 phrases sur les événements financiers majeurs]

🤖 **TECHNOLOGIE & IA**
[2-3 phrases sur les développements tech importants]

🌍 **ÉVÉNEMENTS MAJEURS**
[2-3 phrases sur les autres actualités importantes]

💡 **POINTS CLÉS À RETENIR**
- [3-5 points essentiels à connaître pour un entretien]

Sois précis, factuel, et professionnel. Utilise des chiffres quand disponibles.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        console.log('✅ Daily summary generated with AI');
        return summary;

    } catch (error) {
        console.error('❌ Error generating AI summary:', error.message);
        return generateBasicSummary(articles);
    }
}

/**
 * Génère un résumé par catégorie
 */
async function generateCategorySummary(category, articles) {
    if (!process.env.GEMINI_API_KEY || articles.length === 0) {
        return generateBasicCategorySummary(category, articles);
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const articlesText = articles.slice(0, 15).map((article, idx) =>
            `${idx + 1}. ${article.title}\n` +
            `   Score: ${article.importanceScore}/10\n` +
            `   ${article.contentSnippet.substring(0, 150)}...`
        ).join('\n\n');

        const categoryNames = {
            finance: 'FINANCE & ÉCONOMIE',
            ai: 'INTELLIGENCE ARTIFICIELLE',
            healthcare: 'SANTÉ & BIOTECH',
            tech: 'TECHNOLOGIE',
            general: 'ACTUALITÉS GÉNÉRALES'
        };

        const prompt = `Tu es un expert en ${categoryNames[category] || category}. Voici les actualités les plus importantes d'hier dans ce domaine.

ARTICLES (${articles.length} au total):
${articlesText}

MISSION:
Génère un résumé concis et professionnel en français (150-200 mots) qui:
1. Identifie les 2-3 tendances ou événements majeurs
2. Explique pourquoi c'est important
3. Donne le contexte nécessaire pour comprendre l'impact
4. Utilise un ton professionnel adapté à un entretien en finance

Sois précis, factuel, et mets l'accent sur l'impact business/économique.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        console.log(`✅ Category summary generated for ${category}`);
        return summary;

    } catch (error) {
        console.error(`❌ Error generating summary for ${category}:`, error.message);
        return generateBasicCategorySummary(category, articles);
    }
}

/**
 * Analyse un article individuel et génère un résumé enrichi
 */
async function analyzeArticle(article) {
    if (!process.env.GEMINI_API_KEY) {
        return {
            ...article,
            aiSummary: article.contentSnippet.substring(0, 200) + '...',
            keyPoints: [],
            whyImportant: 'Article important basé sur le score d\'importance'
        };
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Analyse cet article et fournis une réponse JSON structurée.

ARTICLE:
Titre: ${article.title}
Catégorie: ${article.category}
Source: ${article.source}
Contenu: ${article.contentSnippet}

MISSION:
Fournis une analyse JSON avec:
{
  "summary": "Résumé en 2-3 phrases (français)",
  "keyPoints": ["Point clé 1", "Point clé 2", "Point clé 3"],
  "whyImportant": "Pourquoi c'est important en 1 phrase",
  "impact": "Impact économique/business en 1 phrase"
}

Réponds UNIQUEMENT avec le JSON, sans texte additionnel.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extraire le JSON de la réponse
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            return {
                ...article,
                aiSummary: analysis.summary,
                keyPoints: analysis.keyPoints || [],
                whyImportant: analysis.whyImportant,
                impact: analysis.impact
            };
        }

        return article;

    } catch (error) {
        console.error('❌ Error analyzing article:', error.message);
        return article;
    }
}

/**
 * Génère un résumé basique sans IA (fallback)
 */
function generateBasicSummary(articles) {
    const byCategory = {};
    articles.forEach(article => {
        if (!byCategory[article.category]) {
            byCategory[article.category] = [];
        }
        byCategory[article.category].push(article);
    });

    let summary = '# Résumé Quotidien\n\n';

    Object.entries(byCategory).forEach(([category, arts]) => {
        const categoryNames = {
            finance: '📊 FINANCE & ÉCONOMIE',
            ai: '🤖 INTELLIGENCE ARTIFICIELLE',
            healthcare: '🏥 SANTÉ & BIOTECH',
            tech: '💻 TECHNOLOGIE',
            general: '🌍 ACTUALITÉS GÉNÉRALES'
        };

        summary += `## ${categoryNames[category] || category}\n`;
        summary += `${arts.length} articles importants\n\n`;

        arts.slice(0, 3).forEach(article => {
            summary += `- **${article.title}** (${article.source}, score: ${article.importanceScore}/10)\n`;
        });
        summary += '\n';
    });

    summary += '\n💡 **Note**: Configurez GEMINI_API_KEY pour des résumés IA détaillés.\n';

    return summary;
}

/**
 * Génère un résumé basique par catégorie (fallback)
 */
function generateBasicCategorySummary(category, articles) {
    if (articles.length === 0) {
        return `Aucun article important trouvé dans la catégorie ${category}.`;
    }

    let summary = `${articles.length} articles importants dans ${category}:\n\n`;

    articles.slice(0, 5).forEach((article, idx) => {
        summary += `${idx + 1}. **${article.title}**\n`;
        summary += `   Score: ${article.importanceScore}/10 | ${article.source}\n`;
        summary += `   ${article.contentSnippet.substring(0, 150)}...\n\n`;
    });

    return summary;
}

/**
 * Génère tous les résumés (global + par catégorie)
 */
async function generateAllSummaries(articlesByCategory) {
    console.log('\n🤖 Generating AI summaries...\n');

    const allArticles = Object.values(articlesByCategory).flat();

    // Résumé global
    const dailySummary = await generateDailySummary(allArticles);

    // Résumés par catégorie
    const categorySummaries = {};
    for (const [category, articles] of Object.entries(articlesByCategory)) {
        if (articles.length > 0) {
            categorySummaries[category] = await generateCategorySummary(category, articles);
        }
    }

    console.log('✅ All summaries generated\n');

    return {
        daily: dailySummary,
        byCategory: categorySummaries
    };
}

module.exports = {
    generateDailySummary,
    generateCategorySummary,
    analyzeArticle,
    generateAllSummaries
};
