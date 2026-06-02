const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
let geminiClient = null;

const getGeminiClient = () => {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return geminiClient;
};

// Local fallback responses for common queries
const localFallbackResponses = {
  greeting: `Hello! I'm the AI Civic Benefits Navigator assistant. I can help you with:

• **Finding eligible benefits** — Tell me your age, income, and state to get recommendations
• **Understanding schemes** — Ask me to explain any government scheme in simple English
• **Application guidance** — I'll walk you through the application process step by step
• **Document requirements** — Learn what documents you need for any benefit
• **Status inquiries** — Understand what different application statuses mean

How can I help you today?`,

  eligibility: `To check your eligibility for government benefits, use our **Eligibility Checker** tool. Here's what you'll typically need:

1. **Age** — Many schemes have age requirements
2. **Annual Income** — Most benefits target specific income brackets
3. **State/Region** — Some schemes are state-specific
4. **Category** — SC/ST/OBC/EWS/General
5. **Special Status** — Student, unemployed, or disability status

Navigate to the **Eligibility Check** page from the menu to get personalized recommendations!`,

  documents: `Here are the most commonly required documents for government benefit applications:

📄 **Identity Proof:** Aadhaar Card, Voter ID, PAN Card
📄 **Address Proof:** Utility bills, Ration Card, Passport
📄 **Income Proof:** Income Certificate from Tehsildar/Revenue Office
📄 **Age Proof:** Birth Certificate, School Leaving Certificate
📄 **Category Certificate:** Caste certificate (if applicable)
📄 **Bank Details:** Bank Passbook or Cancelled Cheque
📄 **Photographs:** Recent passport-size photos

💡 **Tip:** Keep scanned copies (PDF/JPG) ready for online applications!`,

  application: `Here's how the application process typically works:

1. **Check Eligibility** — Use our eligibility checker to find matching benefits
2. **Review Requirements** — Check the documents needed for the benefit
3. **Submit Application** — Fill out the application form on our platform
4. **Upload Documents** — Attach required supporting documents
5. **Track Status** — Monitor your application through the dashboard

**Application Statuses:**
• 🟡 Submitted — Your application has been received
• 🔵 Under Review — A caseworker is reviewing your application
• 🟠 Documents Requested — Additional documents are needed
• 🟢 Approved — Congratulations! Your benefit has been approved
• 🔴 Rejected — Unfortunately, your application was not approved
• ⚪ On Hold — Your application is temporarily paused`,

  general: `I'm the AI Civic Benefits Navigator, here to help you navigate government benefits and schemes. Here are some things you can do on our platform:

1. 🔍 **Browse Benefits** — View all available government schemes
2. ✅ **Check Eligibility** — Find benefits you qualify for
3. 📝 **Apply Online** — Submit applications directly
4. 📎 **Upload Documents** — Attach required paperwork
5. 📊 **Track Applications** — Monitor your application status

For specific questions, try being more detailed in your query, or visit the relevant section of our platform!`,
};

// Determine fallback category based on user message
const getFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help'))
    return localFallbackResponses.greeting;
  if (lowerMessage.includes('eligible') || lowerMessage.includes('qualify') || lowerMessage.includes('eligibility'))
    return localFallbackResponses.eligibility;
  if (lowerMessage.includes('document') || lowerMessage.includes('paper') || lowerMessage.includes('proof'))
    return localFallbackResponses.documents;
  if (lowerMessage.includes('apply') || lowerMessage.includes('application') || lowerMessage.includes('status'))
    return localFallbackResponses.application;
  return localFallbackResponses.general;
};

// @desc    AI Assistant — chat with Gemini AI
// @route   POST /api/ai/assistant
// @access  Private
const aiAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const client = getGeminiClient();

    if (client) {
      try {
        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemPrompt = `You are an AI assistant for the "AI Civic Benefits Navigator" platform — a government technology platform that helps citizens discover and apply for public benefits and schemes in India.

Your role:
- Help citizens understand government benefits and schemes in simple, clear English
- Guide users through the application process
- Explain eligibility criteria in easy-to-understand terms
- Provide information about required documents
- Answer questions about application status and timelines
- Be empathetic, patient, and supportive

Guidelines:
- Always be accurate and helpful
- Use simple language, avoid jargon
- If unsure, recommend the user check the official portal or contact a caseworker
- Keep responses concise but informative
- Use bullet points for clarity`;

        const chat = model.startChat({
          history: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }],
            },
            {
              role: 'model',
              parts: [{ text: 'Understood! I am ready to help citizens navigate government benefits in India.' }],
            },
          ],
        });

        const result = await chat.sendMessage(message);
        const aiResponse = result.response.text();

        return res.json({ response: aiResponse, source: 'ai' });
      } catch (apiError) {
        console.error('Gemini API error:', apiError.message);
      }
    }

    // Local fallback
    return res.json({
      response: getFallbackResponse(message),
      source: 'local',
      note: 'AI service temporarily unavailable. Showing pre-configured response.',
    });
  } catch (error) {
    console.error('AI assistant error:', error.message);
    res.status(500).json({ message: 'Error processing AI request' });
  }
};

// @desc    AI Benefit Explanation using Gemini
// @route   POST /api/ai/explain-benefit
// @access  Private
const explainBenefit = async (req, res) => {
  try {
    const { benefitName, benefitDescription } = req.body;
    if (!benefitName) return res.status(400).json({ message: 'Benefit name is required' });

    const client = getGeminiClient();

    if (client) {
      try {
        const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Explain this Indian government benefit in very simple English that anyone can understand. Use bullet points and simple words.

Scheme Name: ${benefitName}
Description: ${benefitDescription || 'A government benefit scheme'}

Structure your response with these sections:
1. **What is this scheme?** (2-3 simple sentences)
2. **Who can apply?** (bullet points)
3. **What do you get?** (bullet points)
4. **How to apply?** (numbered steps)
5. **Documents needed** (bullet points)
6. **Important tips** (bullet points)`;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        if (aiResponse) return res.json({ explanation: aiResponse, source: 'ai' });
      } catch (apiError) {
        console.error('Gemini API error for benefit explanation:', apiError.message);
      }
    }

    // Fallback explanation
    return res.json({
      explanation: `## ${benefitName}\n\n**What is this scheme?**\n${benefitDescription || 'This is a government benefit program designed to help eligible citizens.'}\n\n**How to apply:**\n1. Check your eligibility using our Eligibility Checker\n2. Gather all required documents\n3. Submit your application through this platform\n4. Upload supporting documents\n5. Track your application status on the dashboard\n\n**Tips:**\n• Keep all original documents handy for verification\n• Apply as early as possible before deadlines\n• Track your application regularly for updates`,
      source: 'local',
      note: 'AI service temporarily unavailable. Showing basic explanation.',
    });
  } catch (error) {
    console.error('Explain benefit error:', error.message);
    res.status(500).json({ message: 'Error generating benefit explanation' });
  }
};

module.exports = { aiAssistant, explainBenefit };
