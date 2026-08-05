import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side Gemini AI setup
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", system: "ChronosCS Timetabling Engine" });
  });

  // AI Timetable Generation Route
  app.post("/api/ai/generate-schedule", async (req, res) => {
    try {
      const { courses, lecturers, venues, semester } = req.body;
      const ai = getAi();

      if (!ai) {
        return res.status(400).json({
          error: "GEMINI_API_KEY environment variable is missing.",
          fallbackUsed: true
        });
      }

      const prompt = `You are ChronosCS AI, an expert academic timetabling engine for the Department of Computer Science at University of Port Harcourt.
Given the following data for ${semester || 'First Semester 2023/2024'}:
- Courses: ${JSON.stringify(courses || [])}
- Lecturers: ${JSON.stringify(lecturers || [])}
- Venues: ${JSON.stringify(venues || [])}

Generate an optimized weekly timetable schedule (Monday to Friday, 08:00 to 18:00 in 2-hour slots).
Ensure no lecturer has double bookings, no venue has double bookings, and course credit units match assigned hours.

Return a JSON object containing:
1. "schedule": Array of items with { id, courseCode, courseTitle, lecturer, venue, day ('Monday'..'Friday'), timeSlot ('08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00'), level ('100','200','300','400') }
2. "efficiencyScore": Number from 0 to 100
3. "conflictsCount": Number (should be 0 if possible)
4. "optimizationInsights": Array of string summary bullet points explaining why this layout works well.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              efficiencyScore: { type: Type.NUMBER },
              conflictsCount: { type: Type.NUMBER },
              optimizationInsights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              schedule: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    courseCode: { type: Type.STRING },
                    courseTitle: { type: Type.STRING },
                    lecturer: { type: Type.STRING },
                    venue: { type: Type.STRING },
                    day: { type: Type.STRING },
                    timeSlot: { type: Type.STRING },
                    level: { type: Type.STRING },
                  },
                  required: ["id", "courseCode", "lecturer", "venue", "day", "timeSlot", "level"],
                },
              },
            },
            required: ["efficiencyScore", "conflictsCount", "optimizationInsights", "schedule"],
          },
        },
      });

      const text = response.text || "{}";
      const result = JSON.parse(text);
      res.json({ success: true, ...result });
    } catch (err: any) {
      console.error("Error in AI schedule generation:", err);
      res.status(500).json({ error: err.message || "Failed to generate schedule via AI." });
    }
  });

  // AI Conflict Analyzer & Assistant Route
  app.post("/api/ai/analyze-conflict", async (req, res) => {
    try {
      const { conflictDetails, schedule } = req.body;
      const ai = getAi();

      if (!ai) {
        return res.json({
          recommendation: "Ensure lecturer max hours are respected and relocate conflicting course to an open slot in OFR 2 at 14:00.",
          suggestedSlot: { day: "Wednesday", timeSlot: "14:00 - 16:00", venue: "OFR 2" }
        });
      }

      const prompt = `Analyze this scheduling conflict in the Computer Science department:
Conflict: ${JSON.stringify(conflictDetails)}
Current schedule state sample: ${JSON.stringify(schedule?.slice(0, 10))}

Provide an academic timetable conflict resolution strategy in JSON format with:
- "analysis": concise explanation of the root cause
- "recommendation": step-by-step resolution advice
- "suggestedSlot": { "day", "timeSlot", "venue" }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysis: { type: Type.STRING },
              recommendation: { type: Type.STRING },
              suggestedSlot: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  timeSlot: { type: Type.STRING },
                  venue: { type: Type.STRING },
                }
              }
            },
            required: ["analysis", "recommendation"]
          }
        }
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("Error analyzing conflict:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ChronosCS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
