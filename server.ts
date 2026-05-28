import express from "express";
import path from "path";
import dns from "dns";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";
import { PROJECT_DATA } from "./src/data/projects.js";

// Ensure DNS resolution defaults to ipv4 to prevent local connection delays
dns.setDefaultResultOrder("ipv4first");

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API: Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

// 2. API: Projects list (proxy or direct)
app.get("/api/projects", (req, res) => {
  res.json(PROJECT_DATA);
});

// 3. API: Dynamic Cost Estimator and Proposal Generator
app.post("/api/estimate", (req, res) => {
  try {
    const { projectType, builtUpArea, location, floors, quality, additionalFeatures } = req.body;

    const area = parseFloat(builtUpArea) || 1000;
    const storyCount = parseInt(floors) || 1;

    // Standard rate per sqft in India/Telangana context
    let baseRate = 1700; 
    if (quality === "premium") baseRate = 2200;
    if (quality === "luxury") baseRate = 2900;

    // Adjusted for commercial complexity
    if (projectType === "Commercial") baseRate *= 1.15;
    if (projectType === "Specialized") baseRate *= 1.25;

    // Floors multiplier
    const floorMultiplier = 1 + (storyCount - 1) * 0.04;
    const finalRate = Math.round(baseRate * floorMultiplier);
    
    // Core cost in Crores (1 Crore = 10,000,000 Rupees)
    const baseCostRupees = area * finalRate;
    const baseCostCrores = parseFloat((baseCostRupees / 10000000).toFixed(4));

    // Detailed breakdown
    const civil = parseFloat((baseCostCrores * 0.45).toFixed(4));
    const finishing = parseFloat((baseCostCrores * 0.25).toFixed(4));
    const mep = parseFloat((baseCostCrores * 0.18).toFixed(4));
    const consultancyAndDesign = parseFloat((baseCostCrores * 0.06).toFixed(4));
    const permitsAndGovt = parseFloat((baseCostCrores * 0.06).toFixed(4));

    // Duration calculation (months)
    const baseMonths = Math.min(36, Math.max(6, Math.round(Math.sqrt(area) * 0.08 * (storyCount * 0.4 + 0.6))));

    res.json({
      success: true,
      data: {
        baseCostCrores,
        perSqFtRate: finalRate,
        durationMonths: baseMonths,
        breakdown: {
          civil,
          finishing,
          mep,
          consultancyAndDesign,
          permitsAndGovt,
        },
        recommendations: [
          "Suggest utilizing RCC monolithic shear-wall frames to increase load capacity and safety margin.",
          "We recommend integrating rainwater harvesting recharging pits to augment sustainable water structures.",
          "Propose introducing solar grid installations matching up to 30% of average building energy consumption.",
          "Ensure pre-construction termite treatment is handled before foundation footing pours.",
        ]
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. API: AI Chat Assistant (Consultancy Representative)
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, currentCalculation } = req.body;
    const client = getGeminiClient();

    if (!client) {
      // Friendly mock response when API key is missing
      const lastMsg = messages[messages.length - 1]?.text || "";
      const lower = lastMsg.toLowerCase();
      let reply = "Hello! I am Mitra, Nirmanmitra's AI Construction Consultant. Let me help you with our outstanding project portfolio and engineering capabilities.";
      
      if (lower.includes("cost") || lower.includes("estimate") || lower.includes("price") || lower.includes("budget")) {
        reply = "I would be happy to help you map out your estimates! Based on typical Telangana parameters, premium commercial builds rate around ₹2,200/sq.ft and luxury residential towers range from ₹2,900/sq.ft. Try selecting our 'Cost Estimator' tab above to run precise breakdowns directly, or provision a Gemini API Key via the Secrets Panel to unlock my fully custom AI response engine!";
      } else if (lower.includes("beccun") || lower.includes("largest")) {
        reply = "Ah, Beccun Life Style is our largest residential project! Spanning 8,20,000 sq.ft in Kompally with 5 elegant high-rise towers of G+10 floors. It houses 546 dwelling units with a project value of ₹492 Crores. Truly a monumental blueprint!";
      } else if (lower.includes("saipuri") || lower.includes("current")) {
        reply = "Our current headline project is the Saipuri Residential Building at Sainikpuri. It is a premium G+4 luxury residential complex with single-unit-per-floor layouts, built-up of 9,720 sq.ft and valued at ₹6.8 Crores.";
      } else {
        reply = "I'm running in standby mode. Nirmanmitra is recognized for delivering over 16.5 Lakhs Sq.Ft of elite spaces in Telangana. Some of our landmark projects include the Suvarna Kuteer Township (₹450 Cr) and the high-rise GoldenKey Meraki (₹376.8 Cr). Feel free to ask details about any of these, or activate my API key in Settings to discuss customized material bills or structural consulting!";
      }

      return res.json({
        success: true,
        text: reply,
      });
    }

    // Standard high-level system prompt about company and projects context
    const systemPrompt = `You are 'Mitra Representative', an elite senior structural consultant, estimate planner, and client counselor representing Nirmanmitra, Telangana's stellar architectural engineering and construction company.
Your goal is to guide clients on Nirmanmitra's structural capabilities, historic record of premium landmarks, and technical engineering advice.

Nirmanmitra's project database:
${JSON.stringify(PROJECT_DATA, null, 2)}

Company Records:
- Total Built-up Area: 16.5 Lakhs+ sq.ft across commercial complexes, towers, and estates.
- Cumulative Value: ₹1,500+ Crores.
- Total Units: 1,600+ premium residential plots/units & commercial layouts.
- Key strengths: RCC high-rise expertise, pre-cast slab frameworks, structural glazing, water planning (STPs, tanks), and solar efficiency designs.

Context of active calculation/cost inputs (if any):
${currentCalculation ? JSON.stringify(currentCalculation, null, 2) : "None"}

Guidelines:
1. Always maintain a highly professional, welcoming, precise architectural consulting style. Avoid generic sales-fluff; be technical, precise, and supportive.
2. Form your answers with clean visual hierarchy, markdown lists, bold terms, and specific project references from the database.
3. If asked for cost estimation or technical advice, provide clear reference metrics (such as typical rates of ₹1,750 for standard, ₹2,200 for premium, or ₹2,900 for luxury layouts) and explain structural items like excavation, steel reinforcement, MEP, and finishings.
4. Keep paragraphs short and elegant, optimized for pleasant reading in a neat side conversation drawer. Do NOT mention any internal file names or system variables. Keep the conversation focused purely on construction real-world topics.`;

    // Process chat using ai.models.generateContent
    // Build standard message exchange or format the conversation history
    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      text: response.text || "I apologize, but I couldn't process that. Can you please frame your architectural query again?",
    });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. API: Contact Us Mail Dispatcher
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields (name, email, message) are required."
      });
    }

    // Load fresh environment variables from .env dynamically
    dotenv.config({ override: true });

    const rawEmailUser = process.env.EMAIL_USER;
    const rawEmailPass = process.env.EMAIL_PASS;
    const rawEmailTo = process.env.EMAIL_TO || rawEmailUser || "mmrocktu@gmail.com";

    const emailUser = rawEmailUser ? rawEmailUser.replace(/^["']|["']$/g, "").trim() : "";
    const emailPass = rawEmailPass ? rawEmailPass.replace(/^["']|["']$/g, "").trim() : "";
    const emailTo = rawEmailTo ? rawEmailTo.replace(/^["']|["']$/g, "").trim() : "";

    const isMockMode = !emailUser || !emailPass || emailPass === "YOUR_GMAIL_APP_PASSWORD" || emailPass === "";

    if (isMockMode) {
      console.log("\n==========================================");
      console.log("[Nirmanmitra Server] CONTACT FORM INQUIRY (DEV MODE MOCK)");
      console.log(`From:    ${name} <${email}>`);
      console.log(`To:      ${emailTo}`);
      console.log("Subject: New Inquiry (Nirmanmitra Contact Form)");
      console.log("Message:");
      console.log(message);
      console.log("==========================================\n");
      
      return res.json({ 
        success: true, 
        message: "Inquiry simulated successfully! (Developer Mock Mode: email printed to server console.)",
        mocked: true
      });
    }

    // Configure nodemailer transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: `"${name}" <${emailUser}>`,
      replyTo: email,
      to: emailTo,
      subject: `New Inquiry from ${name} (Nirmanmitra Contact Form)`,
      text: `New Contact Inquiry:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n\nSent at: ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="background-color: #0f172a; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="color: #f59e0b; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">NIRMANMITRA</h2>
            <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">New Website Inquiry</p>
          </div>
          <div style="padding: 24px; color: #334155; line-height: 1.6;">
            <p style="margin-top: 0; font-size: 16px;">You have received a new contact form submission with the following details:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #64748b; width: 120px; border-bottom: 1px solid #f1f5f9;">Sender Name:</td>
                <td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9; font-weight: 550;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #64748b; border-bottom: 1px solid #f1f5f9;">Email Address:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email}" style="color: #d97706; text-decoration: none; font-weight: 550;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #64748b; border-bottom: 1px solid #f1f5f9;">Received At:</td>
                <td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
              </tr>
            </table>

            <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin-top: 20px;">
              <h4 style="margin: 0 0 8px 0; color: #475569; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Message Detail:</h4>
              <p style="margin: 0; color: #334155; font-size: 14px; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; color: #94a3b8; font-size: 11px;">
            This email was sent automatically from the Nirmanmitra website contact form system.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Nirmanmitra Server] Inquiry email successfully sent to ${emailTo} from ${email}`);
    
    return res.json({ success: true, message: "Inquiry sent successfully!" });
  } catch (error: any) {
    console.error("[Nirmanmitra Server] Error sending email:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to send email." });
  }
});


// Start server initialization async to set up Vite Dev Server cleanly or static hosting
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Nirmanmitra Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

start();
