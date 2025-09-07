import { RequestHandler } from "express";

export const handleChat: RequestHandler = async (req, res) => {
  const userMessage = req.body?.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Missing 'message' in request body" });
  }

  const key = "AIzaSyDF9HWIl-B8odnHaSXuLb9Xa4n6vBQCocU";
  if (!key) {
    return res
      .status(400)
      .json({
        error:
          "GEMINI_API_KEY is not set on the server. Please set it in environment variables.",
      });
  }

  try {
    console.info("[chat] incoming message length=", String(userMessage.length));
    // Use the newer generateContent endpoint for Gemini-style models
    const model = "gemini-2.5-flash";
    const base = "https://generativelanguage.googleapis.com";
    const apiUrl = `${base}/v1beta/models/${model}:generateContent?key=${key}`;

    const payload = {
      contents: [
        {
          parts: [{ text: String(userMessage) }],
        },
      ],
    };

    console.info("[chat] sending to Gemini", apiUrl, {
      length: String(userMessage.length),
    });
    const r = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const text = await r.text().catch(() => "");
      console.error("[chat] Gemini API error", r.status, text);
      return res
        .status(502)
        .json({ error: `Upstream API error: ${r.status}: ${text}` });
    }

    let data: any = null;
    try {
      data = await r.json();
    } catch (e) {
      const txt = await r.text().catch(() => "");
      console.error("[chat] failed to parse JSON from Gemini", txt);
      return res.status(502).json({ error: "Invalid JSON from upstream API" });
    }

    // Prefer the candidates -> content -> parts path
    let reply: string | null = null;

    try {
      // data.candidates[0].content.parts[0].text
      if (
        data?.candidates &&
        Array.isArray(data.candidates) &&
        data.candidates[0]
      ) {
        const c = data.candidates[0];
        // content may be string or object
        if (typeof c.content === "string") reply = c.content;
        else if (
          c.content?.parts &&
          Array.isArray(c.content.parts) &&
          c.content.parts[0]
        ) {
          reply = c.content.parts.map((p: any) => p.text).join("\n");
        }
      }

      // older shapes
      if (!reply && data?.output?.length) {
        reply = data.output
          .map((o: any) => o?.content?.map((c: any) => c.text).join("\n"))
          .join("\n");
      }

      if (
        !reply &&
        data?.outputs &&
        Array.isArray(data.outputs) &&
        data.outputs[0]?.outputText
      ) {
        reply = data.outputs[0].outputText;
      }
    } catch (e) {
      // ignore
    }

    if (!reply) reply = "No response from Gemini.";

    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error("Chat handler error:", error);
    return res.status(500).json({ error: error?.message || String(error) });
  }
};
