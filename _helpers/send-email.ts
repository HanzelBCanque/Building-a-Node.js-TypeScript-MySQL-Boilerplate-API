import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import config from '../config.json';

export default async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM || config.emailFrom }: any) {
    // Use Resend HTTP API if RESEND_API_KEY is set (recommended for production on Render)
    if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({ from, to, subject, html });
        return;
    }

    // Fallback to SMTP (for local/dev)
    const transporter = nodemailer.createTransport(config.smtpOptions);
    await transporter.sendMail({ from, to, subject, html });
}