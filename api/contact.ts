import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields (name, email, message) are required." });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const emailTo = process.env.EMAIL_TO || emailUser || "nmengineersandinfra2017@gmail.com";

    // Clean surrounding quotes
    const cleanUser = emailUser ? emailUser.replace(/^["']|["']$/g, "").trim() : "";
    const cleanPass = emailPass ? emailPass.replace(/^["']|["']$/g, "").trim() : "";
    const cleanTo = emailTo ? emailTo.replace(/^["']|["']$/g, "").trim() : "";

    const isMockMode = !cleanUser || !cleanPass || cleanPass === "YOUR_GMAIL_APP_PASSWORD" || cleanPass === "";

    if (isMockMode) {
      console.log("[Vercel Function] Running in Mock Mode - SMTP credentials missing.");
      return res.status(200).json({
        success: true,
        message: "Inquiry simulated successfully! (Vercel Serverless Function Dev Mode)"
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: cleanUser,
        pass: cleanPass,
      },
    });

    const mailOptions = {
      from: `"${name}" <${cleanUser}>`,
      replyTo: email,
      to: cleanTo,
      subject: `New Inquiry from ${name} (Nirmanmitra Contact Form)`,
      text: `New Contact Inquiry:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
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
            This email was sent automatically from the Nirmanmitra website contact form system on Vercel.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "Inquiry sent successfully!" });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to send email." });
  }
}
