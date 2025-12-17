// api/chat.js
export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Get the user's message history from the frontend
  const { messages } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing API Key in Server Configuration' });
  }

  try {
    // 3. Send the request to OpenAI (using the hidden key)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Key is used here securely
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7, // Adjusted slightly higher for Chef Gusteau's creativity
        max_tokens: 1024
      })
    });

    const data = await response.json();

    // 4. Send OpenAI's answer back to your frontend
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Error communicating with OpenAI' });
  }
}
