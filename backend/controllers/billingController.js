import Client from '../models/Client.js';
import { generateInvoicePDF } from '../utils/pdfGenerator.js';
import { sendInvoiceEmail } from '../utils/emailService.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * @desc    Generate itemized GST PDF in memory and dispatch corporate email with attachment
 * @route   POST /api/billing/process
 * @access  Public
 */
export const processBilling = asyncHandler(async (req, res) => {
  const { clientId } = req.body;

  if (!clientId) {
    res.status(400);
    throw new Error('Mandatory field "clientId" is missing from request body.');
  }

  const client = await Client.findById(clientId);
  if (!client) {
    res.status(404);
    throw new Error(`Client not found with identifier: ${clientId}`);
  }

  // Generate unique Indian B2B invoice sequence
  const invoiceNumber = `INV-IN-${Date.now().toString().slice(-6)}`;
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Step 1: Generate GST Tax PDF buffer completely in memory (Zero disk writes)
  const pdfBuffer = await generateInvoicePDF(client, { invoiceNumber, issueDate });

  // Step 2: Dispatch styled corporate email with attached PDF buffer
  const emailResult = await sendInvoiceEmail(client, pdfBuffer, { invoiceNumber, issueDate });

  // Step 3: Increment client analytics in MongoDB upon verified dispatch
  client.invoicesSent = (client.invoicesSent || 0) + 1;
  client.lastInvoicedAt = new Date();
  const updatedClient = await client.save();

  res.status(200).json({
    success: true,
    message: `Tax Invoice #${invoiceNumber} successfully generated and emailed to ${client.email}`,
    invoiceNumber,
    recipientEmail: client.email,
    previewUrl: emailResult.previewUrl,
    isTestAccount: emailResult.isEthereal,
    client: updatedClient,
  });
});

/**
 * @desc    Direct inline stream of generated GST PDF for real-time inspection/demo
 * @route   GET /api/billing/view-pdf/:clientId
 * @access  Public
 */
export const viewInvoicePdf = asyncHandler(async (req, res) => {
  const { clientId } = req.params;

  const client = await Client.findById(clientId);
  if (!client) {
    res.status(404);
    throw new Error(`Client with ID ${clientId} not found.`);
  }

  const invoiceNumber = `INV-IN-${client._id.toString().slice(-4).toUpperCase()}`;
  const pdfBuffer = await generateInvoicePDF(client, { invoiceNumber });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="Tax_Invoice_${invoiceNumber}.pdf"`);
  res.setHeader('Content-Length', pdfBuffer.length);
  res.send(pdfBuffer);
});
