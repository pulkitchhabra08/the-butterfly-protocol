export default async function handler(req, res) {
    // Block unauthorized request types
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { topicA, topicB } = req.body;
    
    // Grabs your secret key from Vercel's secure environment settings dashboard
    const apiKey = process.env.GEMINI_API_KEY; 
    
    if (!apiKey) {
        return res.status(500).json({ error: "System Configuration Error: Missing Core API Authorization Key." });
    }
    
    // Master classified structural instructions for the AI engine
    const prompt = `You are the core intelligence network for 'The Butterfly Protocol'. A user has introduced two completely separate historical constants: "${topicA}" and "${topicB}". Your task is to write a highly engaging, slightly unhinged, sassy, and factually accurate historical briefing detailing how these two concepts collide in the cosmic timeline. Use structural layout tags like brief subheadings, styled blocks, and dramatic one-liner pull quotes. Keep the text punchy, incredibly smart, and format the output inside standard HTML paragraphs (<p>) without adding markdown tags like backticks or blocks. Length: Under 450 words.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            return res.status(500).json({ error: "Upstream Pipeline Disruption: Failed to query timeline data." });
        }

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        
        return res.status(200).json({ story: textResponse });
    } catch (error) {
        return res.status(500).json({ error: "Fatal Internal Loop: The AI kitchen caught fire." });
    }
}