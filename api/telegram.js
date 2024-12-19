import { Bot } from "grammy";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

async function getGroqResponse(query) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: query }],
      model: "llama3-70b-8192",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return "Sorry, I encountered an error processing your request.";
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { message } = req.body;
      if (message?.text) {
        const response = await getGroqResponse(message.text);
        await bot.api.sendMessage(message.chat.id, response);
      }
      res.status(200).json({ ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to process update" });
    }
  } else if (req.method === "GET") {
    res.status(200).json({ status: "Bot webhook endpoint is working" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}