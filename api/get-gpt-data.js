// api/get-gpt-data.js
export default async function handler(req, res) {
  const { brand, model } = req.query;

  const prompt = `Ти асистент, що заповнює характеристики духовок. Для моделі ${brand} ${model} знайди тільки ті атрибути, які входять у список. Якщо якесь значення не знайдено в дозволених — виводь його, але відмічай як нове. Формат: "Атрибут: Значення".`;

  const result = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}` // 🔐 Бере ключ з Vercel
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "system", content: prompt }]
    })
  });

  const data = await result.json();
  const content = data?.choices?.[0]?.message?.content || "";

  res.status(200).json({ content });
}