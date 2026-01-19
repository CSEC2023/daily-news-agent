/**
 * Configuration des sources d'actualités avec priorités et catégories
 * Ce module centralise toutes les sources RSS et APIs utilisées
 */

const NEWS_SOURCES = {
    // ===== FINANCE - Priorité maximale pour les entretiens =====
    finance: [
        {
            name: 'Financial Times - World Economy',
            url: 'https://www.ft.com/world-economy?format=rss',
            type: 'rss',
            priority: 10, // Priorité maximale
            category: 'finance',
            requiresAuth: false,
            description: 'Économie mondiale et marchés financiers'
        },
        {
            name: 'Financial Times - Companies',
            url: 'https://www.ft.com/companies?format=rss',
            type: 'rss',
            priority: 9,
            category: 'finance',
            requiresAuth: false,
            description: 'Actualités des grandes entreprises'
        },
        {
            name: 'Reuters Business',
            url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best',
            type: 'rss',
            priority: 9,
            category: 'finance',
            requiresAuth: false,
            description: 'Actualités business mondiales'
        },
        {
            name: 'Wall Street Journal - Markets',
            url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
            type: 'rss',
            priority: 9,
            category: 'finance',
            requiresAuth: false,
            description: 'Marchés financiers et investissements'
        },
        {
            name: 'Bloomberg Markets',
            url: 'https://www.bloomberg.com/feed/podcast/markets-daily.xml',
            type: 'rss',
            priority: 8,
            category: 'finance',
            requiresAuth: false,
            description: 'Analyse des marchés'
        },
        {
            name: 'The Economist',
            url: 'https://www.economist.com/finance-and-economics/rss.xml',
            type: 'rss',
            priority: 9,
            category: 'finance',
            requiresAuth: false,
            description: 'Finance et économie - analyse approfondie'
        }
    ],

    // ===== INTELLIGENCE ARTIFICIELLE =====
    ai: [
        {
            name: 'AI News',
            url: 'https://feeds.feedburner.com/ArtificialIntelligenceNews',
            type: 'rss',
            priority: 8,
            category: 'ai',
            requiresAuth: false,
            description: 'Actualités IA générales'
        },
        {
            name: 'TechCrunch AI',
            url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
            type: 'rss',
            priority: 8,
            category: 'ai',
            requiresAuth: false,
            description: 'IA et startups tech'
        },
        {
            name: 'VentureBeat AI',
            url: 'https://venturebeat.com/category/ai/feed/',
            type: 'rss',
            priority: 7,
            category: 'ai',
            requiresAuth: false,
            description: 'Business de l\'IA'
        },
        {
            name: 'MIT Technology Review AI',
            url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed',
            type: 'rss',
            priority: 9,
            category: 'ai',
            requiresAuth: false,
            description: 'Recherche et innovation IA'
        }
    ],

    // ===== HEALTHCARE & BIOTECH =====
    healthcare: [
        {
            name: 'Healthcare IT News - AI',
            url: 'https://www.healthcareitnews.com/artificial-intelligence/feed',
            type: 'rss',
            priority: 7,
            category: 'healthcare',
            requiresAuth: false,
            description: 'IA dans la santé'
        },
        {
            name: 'STAT News',
            url: 'https://www.statnews.com/feed/',
            type: 'rss',
            priority: 8,
            category: 'healthcare',
            requiresAuth: false,
            description: 'Actualités médicales et biotech'
        },
        {
            name: 'FierceBiotech',
            url: 'https://www.fiercebiotech.com/rss/xml',
            type: 'rss',
            priority: 7,
            category: 'healthcare',
            requiresAuth: false,
            description: 'Biotechnologie'
        }
    ],

    // ===== TECHNOLOGIE GÉNÉRALE =====
    tech: [
        {
            name: 'TechCrunch',
            url: 'https://techcrunch.com/feed/',
            type: 'rss',
            priority: 7,
            category: 'tech',
            requiresAuth: false,
            description: 'Actualités tech et startups'
        },
        {
            name: 'The Verge',
            url: 'https://www.theverge.com/rss/index.xml',
            type: 'rss',
            priority: 6,
            category: 'tech',
            requiresAuth: false,
            description: 'Tech et culture digitale'
        },
        {
            name: 'Ars Technica',
            url: 'https://feeds.arstechnica.com/arstechnica/index',
            type: 'rss',
            priority: 7,
            category: 'tech',
            requiresAuth: false,
            description: 'Tech et science'
        }
    ],

    // ===== ACTUALITÉS GÉNÉRALES IMPORTANTES =====
    general: [
        {
            name: 'BBC World News',
            url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
            type: 'rss',
            priority: 8,
            category: 'general',
            requiresAuth: false,
            description: 'Actualités mondiales majeures'
        },
        {
            name: 'The Guardian World',
            url: 'https://www.theguardian.com/world/rss',
            type: 'rss',
            priority: 7,
            category: 'general',
            requiresAuth: false,
            description: 'Actualités internationales'
        },
        {
            name: 'Reuters World News',
            url: 'https://www.reutersagency.com/feed/?best-topics=international-news',
            type: 'rss',
            priority: 8,
            category: 'general',
            requiresAuth: false,
            description: 'Actualités mondiales'
        }
    ],

    // ===== EUROPE - Actualités européennes et UE =====
    europe: [
        {
            name: 'Euronews',
            url: 'https://www.euronews.com/rss',
            type: 'rss',
            priority: 8,
            category: 'europe',
            requiresAuth: false,
            description: 'Actualités pan-européennes'
        },
        {
            name: 'Politico Europe',
            url: 'https://www.politico.eu/feed/',
            type: 'rss',
            priority: 8,
            category: 'europe',
            requiresAuth: false,
            description: 'Politique européenne'
        },
        {
            name: 'The Guardian Europe',
            url: 'https://www.theguardian.com/world/europe-news/rss',
            type: 'rss',
            priority: 7,
            category: 'europe',
            requiresAuth: false,
            description: 'Actualités européennes'
        },
        {
            name: 'EU Reporter',
            url: 'https://www.eureporter.co/feed/',
            type: 'rss',
            priority: 7,
            category: 'europe',
            requiresAuth: false,
            description: 'Affaires de l\'Union Européenne'
        }
    ],

    // ===== FRANCE - Actualités françaises =====
    france: [
        {
            name: 'Le Monde',
            url: 'https://www.lemonde.fr/rss/une.xml',
            type: 'rss',
            priority: 9,
            category: 'france',
            requiresAuth: false,
            description: 'Actualités françaises - Le Monde'
        },
        {
            name: 'Le Figaro',
            url: 'https://www.lefigaro.fr/rss/figaro_actualites.xml',
            type: 'rss',
            priority: 8,
            category: 'france',
            requiresAuth: false,
            description: 'Actualités françaises - Le Figaro'
        },
        {
            name: 'France 24',
            url: 'https://www.france24.com/fr/rss',
            type: 'rss',
            priority: 7,
            category: 'france',
            requiresAuth: false,
            description: 'Actualités françaises et internationales'
        },
        {
            name: 'RFI',
            url: 'https://www.rfi.fr/fr/rss',
            type: 'rss',
            priority: 7,
            category: 'france',
            requiresAuth: false,
            description: 'Radio France Internationale'
        }
    ],

    // ===== MONDE - Actualités internationales =====
    monde: [
        {
            name: 'BBC World',
            url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
            type: 'rss',
            priority: 9,
            category: 'monde',
            requiresAuth: false,
            description: 'Actualités mondiales BBC'
        },
        {
            name: 'Reuters International',
            url: 'https://www.reutersagency.com/feed/?best-topics=international-news',
            type: 'rss',
            priority: 9,
            category: 'monde',
            requiresAuth: false,
            description: 'Actualités internationales Reuters'
        },
        {
            name: 'Al Jazeera',
            url: 'https://www.aljazeera.com/xml/rss/all.xml',
            type: 'rss',
            priority: 7,
            category: 'monde',
            requiresAuth: false,
            description: 'Actualités mondiales - perspective internationale'
        },
        {
            name: 'DW News',
            url: 'https://rss.dw.com/xml/rss-en-all',
            type: 'rss',
            priority: 7,
            category: 'monde',
            requiresAuth: false,
            description: 'Deutsche Welle - actualités mondiales'
        }
    ],

    // ===== BOURSE - Marchés boursiers et trading =====
    bourse: [
        {
            name: 'MarketWatch',
            url: 'https://www.marketwatch.com/rss/topstories',
            type: 'rss',
            priority: 9,
            category: 'bourse',
            requiresAuth: false,
            description: 'Marchés boursiers et investissements'
        },
        {
            name: 'Investing.com',
            url: 'https://www.investing.com/rss/news.rss',
            type: 'rss',
            priority: 8,
            category: 'bourse',
            requiresAuth: false,
            description: 'Actualités boursières et trading'
        },
        {
            name: 'Yahoo Finance',
            url: 'https://finance.yahoo.com/news/rssindex',
            type: 'rss',
            priority: 8,
            category: 'bourse',
            requiresAuth: false,
            description: 'Finance et marchés boursiers'
        },
        {
            name: 'Seeking Alpha',
            url: 'https://seekingalpha.com/feed.xml',
            type: 'rss',
            priority: 7,
            category: 'bourse',
            requiresAuth: false,
            description: 'Analyse boursière et investissement'
        },
        {
            name: 'Les Echos Bourse',
            url: 'https://www.lesechos.fr/finance-marches/marches-financiers/rss',
            type: 'rss',
            priority: 8,
            category: 'bourse',
            requiresAuth: false,
            description: 'Marchés financiers français'
        }
    ],

    // ===== ADTECH / MEDIA - Marketing et publicité digitale =====
    adtech: [
        {
            name: 'AdAge',
            url: 'https://adage.com/rss',
            type: 'rss',
            priority: 10,
            category: 'adtech',
            requiresAuth: false,
            description: 'Actualités publicitaires et marketing'
        },
        {
            name: 'Marketing Dive',
            url: 'https://www.marketingdive.com/feeds/news/',
            type: 'rss',
            priority: 9,
            category: 'adtech',
            requiresAuth: false,
            description: 'Marketing et stratégies digitales'
        },
        {
            name: 'AdExchanger',
            url: 'https://www.adexchanger.com/feed/',
            type: 'rss',
            priority: 10,
            category: 'adtech',
            requiresAuth: false,
            description: 'Technologie publicitaire et programmatique'
        },
        {
            name: 'Digiday',
            url: 'https://digiday.com/feed/',
            type: 'rss',
            priority: 9,
            category: 'adtech',
            requiresAuth: false,
            description: 'Média et marketing digital'
        },
        {
            name: 'The Drum',
            url: 'https://www.thedrum.com/rss/news',
            type: 'rss',
            priority: 8,
            category: 'adtech',
            requiresAuth: false,
            description: 'Marketing, publicité et médias'
        },
        {
            name: 'Marketing Week',
            url: 'https://www.marketingweek.com/feed/',
            type: 'rss',
            priority: 8,
            category: 'adtech',
            requiresAuth: false,
            description: 'Stratégies marketing et tendances'
        }
    ]
};

/**
 * Mots-clés pour identifier les articles importants
 * Ces mots augmentent le score d'importance
 */
const IMPORTANCE_KEYWORDS = {
    // Finance - mots clés pour entretiens
    finance: [
        'fed', 'federal reserve', 'ecb', 'central bank', 'interest rate', 'taux',
        'inflation', 'recession', 'gdp', 'pib', 'market crash', 'rally',
        'ipo', 'merger', 'acquisition', 'bankruptcy', 'faillite',
        'earnings', 'résultats', 'profit', 'revenue', 'chiffre d\'affaires',
        'stock market', 'bourse', 'nasdaq', 'dow jones', 's&p 500',
        'crypto', 'bitcoin', 'ethereum', 'regulation', 'régulation',
        'trillion', 'billion', 'milliard', 'billion de dollars'
    ],

    // IA - développements majeurs
    ai: [
        'breakthrough', 'percée', 'gpt', 'chatgpt', 'gemini', 'claude',
        'openai', 'google ai', 'anthropic', 'deepmind',
        'agi', 'artificial general intelligence', 'superintelligence',
        'regulation', 'ai safety', 'sécurité ia', 'ethics', 'éthique',
        'autonomous', 'autonome', 'self-driving', 'conduite autonome'
    ],

    // Healthcare - innovations majeures
    healthcare: [
        'fda approval', 'clinical trial', 'essai clinique', 'cure', 'traitement',
        'vaccine', 'vaccin', 'pandemic', 'pandémie', 'outbreak', 'épidémie',
        'cancer', 'alzheimer', 'diabetes', 'diabète',
        'gene therapy', 'thérapie génique', 'crispr', 'stem cell',
        'drug approval', 'médicament', 'breakthrough therapy'
    ],

    // Général - événements majeurs
    general: [
        'war', 'guerre', 'conflict', 'conflit', 'crisis', 'crise',
        'election', 'élection', 'president', 'président', 'prime minister',
        'treaty', 'traité', 'sanctions', 'embargo',
        'climate', 'climat', 'disaster', 'catastrophe', 'emergency',
        'historic', 'historique', 'unprecedented', 'sans précédent'
    ],

    // Europe - affaires européennes
    europe: [
        'eu', 'european union', 'union européenne', 'brussels', 'bruxelles',
        'european commission', 'commission européenne', 'parliament', 'parlement',
        'euro', 'eurozone', 'zone euro', 'ecb', 'bce',
        'schengen', 'brexit', 'european council', 'conseil européen',
        'von der leyen', 'strasbourg', 'treaty', 'traité',
        'directive', 'regulation', 'règlement', 'member state', 'état membre'
    ],

    // France - actualités françaises
    france: [
        'macron', 'élysée', 'matignon', 'assemblée nationale', 'sénat',
        'gouvernement', 'ministre', 'paris', 'france', 'français',
        'république', 'loi', 'réforme', 'manifestation', 'grève',
        'cour', 'justice', 'conseil constitutionnel', 'premier ministre',
        'budget', 'fiscal', 'social', 'retraite', 'santé publique'
    ],

    // Monde - événements internationaux majeurs
    monde: [
        'international', 'global', 'world', 'mondial', 'nations unies', 'un',
        'summit', 'sommet', 'g7', 'g20', 'nato', 'otan',
        'treaty', 'traité', 'diplomacy', 'diplomatie', 'foreign policy',
        'china', 'chine', 'usa', 'états-unis', 'russia', 'russie',
        'conflict', 'conflit', 'peace', 'paix', 'sanctions',
        'humanitarian', 'humanitaire', 'refugee', 'réfugié'
    ],

    // Bourse - marchés boursiers
    bourse: [
        'stock', 'action', 'shares', 'trading', 'bourse', 'market',
        'nasdaq', 'dow', 'dow jones', 's&p 500', 'cac 40', 'dax', 'ftse',
        'earnings', 'résultats', 'quarterly', 'trimestriel',
        'ipo', 'introduction en bourse', 'dividend', 'dividende',
        'bull market', 'bear market', 'rally', 'correction',
        'volatility', 'volatilité', 'index', 'indice',
        'wall street', 'nyse', 'euronext', 'trading volume'
    ],

    // AdTech / Media - publicité et marketing digital
    adtech: [
        'advertising', 'publicité', 'ad tech', 'adtech', 'marketing',
        'programmatic', 'programmatique', 'rtb', 'real-time bidding',
        'dsp', 'ssp', 'ad exchange', 'media buying', 'achat média',
        'campaign', 'campagne', 'brand', 'marque', 'creative', 'créatif',
        'social media', 'réseaux sociaux', 'influencer', 'influenceur',
        'content marketing', 'marketing de contenu', 'seo', 'sem',
        'google ads', 'facebook ads', 'tiktok', 'instagram',
        'privacy', 'confidentialité', 'cookies', 'gdpr', 'tracking',
        'attribution', 'conversion', 'roi', 'cpm', 'cpc', 'ctr',
        'video advertising', 'publicité vidéo', 'streaming', 'ctv',
        'retail media', 'commerce media', 'amazon ads', 'walmart',
        'measurement', 'mesure', 'analytics', 'data', 'données'
    ]
};

/**
 * Obtient toutes les sources pour une catégorie donnée
 */
function getSourcesByCategory(category) {
    if (category === 'all') {
        return Object.values(NEWS_SOURCES).flat();
    }
    return NEWS_SOURCES[category] || [];
}

/**
 * Obtient toutes les sources triées par priorité
 */
function getAllSourcesByPriority() {
    const allSources = Object.values(NEWS_SOURCES).flat();
    return allSources.sort((a, b) => b.priority - a.priority);
}

/**
 * Obtient les mots-clés d'importance pour une catégorie
 */
function getImportanceKeywords(category) {
    if (category === 'all') {
        return Object.values(IMPORTANCE_KEYWORDS).flat();
    }
    return IMPORTANCE_KEYWORDS[category] || [];
}

module.exports = {
    NEWS_SOURCES,
    IMPORTANCE_KEYWORDS,
    getSourcesByCategory,
    getAllSourcesByPriority,
    getImportanceKeywords
};
