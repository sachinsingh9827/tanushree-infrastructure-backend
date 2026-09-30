import { Contact } from "../models/Contact.js";
import { SupportTicket } from "../models/SupportTicket.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { failure, success } from "../utils/apiResponse.js";
import { buildMeta, getPagination } from "../utils/pagination.js";
import { getAdminSort } from "../utils/sort.js";

export const listContacts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { archivedAt: null };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.customerType) filter.customerType = req.query.customerType;
  if (req.query.search) {
    filter.$or = [
      { name: new RegExp(req.query.search, "i") },
      { email: new RegExp(req.query.search, "i") },
      { subject: new RegExp(req.query.search, "i") },
      { customerType: new RegExp(req.query.search, "i") }
    ];
  }
  const sort = getAdminSort(req.query);

  const [items, total] = await Promise.all([
    Contact.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter)
  ]);

  success(res, "Contacts fetched successfully", items, buildMeta(page, limit, total));
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  if (!contact) return failure(res, "Contact not found", [], 404);
  success(res, "Contact status updated successfully", contact);
});

export const archiveContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { archivedAt: new Date() },
    { new: true }
  );

  if (!contact) return failure(res, "Contact not found", [], 404);
  success(res, "Contact archived successfully");
});

export const listSupportTickets = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.search) {
    filter.$or = [
      { ticketNumber: new RegExp(req.query.search, "i") },
      { name: new RegExp(req.query.search, "i") },
      { email: new RegExp(req.query.search, "i") },
      { subject: new RegExp(req.query.search, "i") }
    ];
  }
  const sort = getAdminSort(req.query);

  const [items, total] = await Promise.all([
    SupportTicket.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    SupportTicket.countDocuments(filter)
  ]);

  success(res, "Support tickets fetched successfully", items, buildMeta(page, limit, total));
});

export const updateSupportTicket = asyncHandler(async (req, res) => {
  const payload = {};
  if (req.body.status !== undefined) payload.status = req.body.status;
  if (req.body.priority !== undefined) payload.priority = req.body.priority;
  if (req.body.adminReply !== undefined) payload.adminReply = req.body.adminReply;

  const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, payload, { new: true });
  if (!ticket) return failure(res, "Support ticket not found", [], 404);

  success(res, "Support ticket updated successfully", ticket);
});

export const deleteSupportTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findByIdAndDelete(req.params.id);
  if (!ticket) return failure(res, "Support ticket not found", [], 404);

  success(res, "Support ticket deleted successfully");
});
