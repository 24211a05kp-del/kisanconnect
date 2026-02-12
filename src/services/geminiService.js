/**
 * Google Gemini API Service
 * Provides Vision-based disease detection for cotton plants
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';

/**
 * Analyze cotton plant image using Gemini Vision
 * @param {File} imageFile - The image file to analyze
 * @param {string} language - Language code (en, hi, te)
 * @returns {Promise<Object>} - Analysis result with disease name and recommendations
 */
export const analyzePlantImageWithGemini = async (imageFile, language = 'en') => {
  // Check if API key is configured
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  try {
    // Convert image to base64 (without data URL prefix)
    const base64Image = await fileToBase64WithoutPrefix(imageFile);
    const mimeType = imageFile.type || 'image/jpeg';
    
    console.log('Image converted to base64, length:', base64Image.length);
    console.log('Using Gemini 3 Flash Preview model');
    
    const prompt = buildVisionPrompt(language);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
          topP: 0.95,
        },
      }),
    });

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');
    
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!analysisText) {
      throw new Error('No response from Gemini Vision API');
    }

    console.log('Analysis text length:', analysisText.length);

    // Extract disease name and confidence from response
    const result = parseVisionResponse(analysisText);

    return {
      success: true,
      disease: result.disease,
      confidence: result.confidence,
      isHealthy: result.isHealthy,
      fullAnalysis: analysisText,
      method: 'gemini_vision',
    };
  } catch (error) {
    console.error('Gemini Vision API error:', error);
    throw error;
  }
};

/**
 * Convert File to base64 (without data URL prefix)
 */
async function fileToBase64WithoutPrefix(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Build the vision prompt for cotton plant analysis
 */
function buildVisionPrompt(language) {
  const basePrompt = `You are an expert agricultural pathologist. Analyze this cotton plant and provide COMPLETE treatment details with exact medications and dosages.

FORMAT (No asterisks/dashes in content):

Disease Status: [Healthy/Diseased]
Specific Disease: [Name]
Confidence: [0-100]%


🔍 Visual Assessment
Describe symptoms: spots, color, size, location, texture.


🦠 Disease Details
Name disease, pathogen type, how it spreads.


📊 Severity: [Mild/Moderate/Severe]


💊 TREATMENT (MUST COMPLETE ALL 3 OPTIONS)

OPTION 1: [Product Name - e.g., Mancozeb 75% WP]
Active Ingredient: [Chemical]
Dosage: [X grams per liter OR X kg per acre]
Mix: [How to prepare]
Apply: [Spray method, timing]
Frequency: [Every X days, X times]
Duration: [X weeks]
Water: [Liters per acre]
Cost: [Rs. X-Y per acre]

OPTION 2: [Product Name - e.g., Copper Oxychloride]
Active Ingredient: [Chemical]
Dosage: [Exact amount]
Mix: [Preparation]
Apply: [Method]
Frequency: [Schedule]
Duration: [Period]
Cost: [Price]

OPTION 3: [Product Name - e.g., Carbendazim]
Active Ingredient: [Chemical]
Dosage: [Exact amount]
Mix: [Preparation]
Apply: [Method]
Frequency: [Schedule]
Cost: [Price]

ORGANIC OPTIONS:

1. [Natural remedy]: [Ingredients with amounts], [Preparation], [Application]
2. [Second remedy]: [Details]

IMMEDIATE ACTIONS:
1. [Action]
2. [Action]
3. [Action]


🛡️ Prevention
1. [Practice]
2. [Practice]
3. [Practice]
4. [Practice]


📈 Recovery
Time: [X weeks]
Yield Impact: [Percentage]
Success Rate: [Percentage]


⚠️ Warnings
[Critical notes]


CRITICAL: Complete ALL treatment options with REAL Indian product names and EXACT dosages. Do not stop until all sections are complete.`;

  if (language === 'hi') {
    return basePrompt + '\n\nहिंदी में पूरा जवाब दें। सभी दवाओं के नाम और मात्रा बताएं।';
  } else if (language === 'te') {
    return basePrompt + '\n\nతెలుగులో పూర్తి సమాధానం ఇవ్వండి। అన్ని మందుల వివరాలు ఇవ్వండి।';
  }
  
  return basePrompt;
}

/**
 * Parse the vision model response to extract key information
 */
function parseVisionResponse(text) {
  // Extract disease status
  const statusMatch = text.match(/\*\*Disease Status:\s*([^*\n]+)\*\*/i);
  const status = statusMatch ? statusMatch[1].trim().toLowerCase() : '';
  const isHealthy = status.includes('healthy');

  // Extract specific disease name
  const diseaseMatch = text.match(/\*\*Specific Disease:\s*([^*\n]+)\*\*/i);
  let disease = diseaseMatch ? diseaseMatch[1].trim() : '';
  
  // Clean up disease name
  if (disease.toLowerCase().includes('none') || disease.toLowerCase().includes('healthy')) {
    disease = 'Healthy Cotton Plant';
  }

  // Extract confidence
  const confidenceMatch = text.match(/\*\*Confidence:\s*(\d+)%?\*\*/i);
  const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) / 100 : 0.85;

  return {
    disease,
    confidence,
    isHealthy,
  };
}

/**
 * Check if Gemini API is configured
 * @returns {boolean}
 */
export const isGeminiConfigured = () => {
  return GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key_here';
};

/**
 * Test Gemini API connection
 * @returns {Promise<boolean>}
 */
export const testGeminiConnection = async () => {
  if (!isGeminiConfigured()) {
    return false;
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Hello',
              },
            ],
          },
        ],
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Gemini connection test failed:', error);
    return false;
  }
};

/**
 * Send chat message to Gemini AI
 * @param {string} message - User's message
 * @param {string} language - Language code (en, hi, te)
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<Object>} - AI response with message and suggestions
 */
export const sendChatToGemini = async (message, language = 'en', conversationHistory = []) => {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const systemPrompt = buildChatSystemPrompt(language);
    
    // Build conversation context
    const contents = [
      {
        parts: [{ text: systemPrompt }],
      },
      ...conversationHistory.map(msg => ({
        parts: [{ text: msg.content }],
        role: msg.role === 'user' ? 'user' : 'model',
      })),
      {
        parts: [{ text: message }],
        role: 'user',
      },
    ];

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 2048,
          topP: 0.95,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error('No response from Gemini AI');
    }

    // Extract suggestions if present
    const suggestions = extractSuggestions(aiResponse, language);

    return {
      message: aiResponse,
      suggestions,
    };
  } catch (error) {
    console.error('Gemini chat error:', error);
    throw error;
  }
};

/**
 * Build system prompt for chat assistant
 */
function buildChatSystemPrompt(language) {
  const basePrompt = `You are KisanMitra AI, an expert agricultural assistant specializing in cotton farming in India. You help farmers with:

- Crop management and best practices
- Disease identification and treatment
- Pest control strategies
- Soil health and fertilization
- Irrigation and water management
- Weather-based farming advice
- Market prices and selling strategies
- Government schemes and subsidies
- Organic farming methods
- Seasonal planning

Provide practical, actionable advice that farmers can implement immediately. Use simple language and be encouraging. When discussing treatments or chemicals, provide specific product names and dosages. Always consider the Indian farming context.

Keep responses concise (2-3 paragraphs max) unless detailed explanation is requested. Be friendly and supportive.`;

  if (language === 'hi') {
    return basePrompt + '\n\nIMPORTANT: Respond in Hindi (Devanagari script). Use simple Hindi that farmers understand.';
  } else if (language === 'te') {
    return basePrompt + '\n\nIMPORTANT: Respond in Telugu script. Use simple Telugu that farmers understand.';
  }
  
  return basePrompt;
}

/**
 * Extract follow-up suggestions from AI response
 */
function extractSuggestions(text, language) {
  // Default suggestions based on language
  const defaultSuggestions = {
    en: [
      'Tell me more',
      'What about prevention?',
      'Show me alternatives',
      'Explain in detail',
    ],
    hi: [
      'और बताएं',
      'रोकथाम के बारे में',
      'विकल्प बताएं',
      'विस्तार से समझाएं',
    ],
    te: [
      'మరింత చెప్పండి',
      'నివారణ గురించి',
      'ప్రత్యామ్నాయాలు చూపించండి',
      'వివరంగా వివరించండి',
    ],
  };

  return defaultSuggestions[language] || defaultSuggestions.en;
}
