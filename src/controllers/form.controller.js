import { Contact } from "../models/Contact.js";
import { SupportTicket } from "../models/SupportTicket.js";
import {
  sendContactNotification,
  sendSupportNotification
} from "../services/email/email.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";

function ticketNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TIN-${date}-${random}`;
}

export const submitContact = asyncHandler(async (req, res) => {
  const contact = await Contact.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    customerType: req.body.customerType || "Owner",
    subject: req.body.subject,
    message: req.body.message
  });

  await sendContactNotification(contact);

  success(res, "Contact inquiry submitted successfully", {
    id: contact._id,
    status: contact.status
  }, undefined, 201);
});

export const submitSupport = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.create({
    ticketNumber: ticketNumber(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    subject: req.body.subject,
    message: req.body.message,
    priority: req.body.priority || "Medium"
  });

  await sendSupportNotification(ticket);

  success(res, "Support request submitted successfully", {
    id: ticket._id,
    ticketNumber: ticket.ticketNumber,
    status: ticket.status
  }, undefined, 201);
});
