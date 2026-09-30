import nodemailer from "nodemailer";
import { env } from "../../config/env.js";

function canSendEmail() {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.password && env.smtp.mailFrom);
}

function createTransporter() {
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.password
    }
  });
}

async function sendMail({ to, subject, text }) {
  if (!canSendEmail() || !to) return null;

  const transporter = createTransporter();
  return transporter.sendMail({
    from: env.smtp.mailFrom,
    to,
    subject,
    text
  });
}

export async function sendContactNotification(contact) {
  return sendMail({
    to: env.smtp.adminEmail,
    subject: `New contact inquiry: ${contact.subject}`,
    text: [
      `Name: ${contact.name}`,
      `Email: ${contact.email}`,
      `Phone: ${contact.phone || "-"}`,
      `Subject: ${contact.subject}`,
      "",
      contact.message
    ].join("\n")
  });
}

export async function sendSupportNotification(ticket) {
  return sendMail({
    to: env.smtp.adminEmail,
    subject: `New support ticket ${ticket.ticketNumber}: ${ticket.subject}`,
    text: [
      `Ticket: ${ticket.ticketNumber}`,
      `Name: ${ticket.name}`,
      `Email: ${ticket.email}`,
      `Phone: ${ticket.phone || "-"}`,
      `Priority: ${ticket.priority}`,
      "",
      ticket.message
    ].join("\n")
  });
}
