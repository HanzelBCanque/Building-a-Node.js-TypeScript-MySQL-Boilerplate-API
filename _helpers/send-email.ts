import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import config from '../config.json';

export default async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM || config.emailFrom }: any) {
    // Override recipient for Resend sandbox to ensure delivery
    const sandboxRecipient = 'hansoy982@gmail.com';
    let targetEmail = to;
    
    if (from === 'onboarding@resend.dev' && to.toLowerCase() !== sandboxRecipient.toLowerCase()) {
        console.log(`[Resend Sandbox Override] Redirecting email from ${to} to sandbox recipient ${sandboxRecipient}`);
        targetEmail = sandboxRecipient;
    }

    // Use Resend HTTP API if RESEND_API_KEY is set (recommended for production on Render)
    if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({ from, to: targetEmail, subject, html });
        if (error) {
            console.error('Resend API Error:', error);
            throw new Error(`Resend Error: ${error.message}`);
        }
        return;
    }

    // Fallback to SMTP (for local/dev)
    const transporter = nodemailer.createTransport(config.smtpOptions);
    await transporter.sendMail({ from, to: targetEmail, subject, html });
}