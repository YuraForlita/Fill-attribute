export default async function handler(req, res) {
  const { brand, model } = req.query;

  const prompt = `
  Ти асистент для заповнення характеристик духовок. 
  Бренд: ${brand}, модель: ${model}.
  Виведи значення виключно по цьому списку атрибутів у форматі:
  Атрибут: Значення
  
  Наприклад:
  Тип: Електричний
  Колір: Чорний
  Об'єм: 52 л
  ...
  
  Якщо не можеш знайти значення — не вигадуй.
  Пиши лише атрибути з дозволеного списку.
  `;

  try {
    const result = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await result.json();
    const content = data?.choices?.[0]?.message?.content || "";

    res.status(200).json({ content });
  } catch (err) {
    console.error("GPT fetch error:", err);
    res.status(500).json({ error: "GPT request failed" });
  }
}