import nodemailer from 'nodemailer';

let cachedTestAccount = null;

// Short socket and connection timeout to prevent hanging on cloud providers (e.g., Render free tier)
const SMTP_TIMEOUT_MS = 6000;

/**
 * Format numeric value to Indian currency string (₹ X,XX,XXX.XX)
 */
const formatCurrencyINR = (amount) => {
  const num = Number(amount) || 0;
  return `₹ ${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Creates or retrieves a configured Nodemailer transporter.
 * Automatically falls back to Ethereal SMTP with strict timeout guards.
 */
const getTransporter = async () => {
  const hasCustomCredentials =
    Boolean(process.env.EMAIL_USER) &&
    Boolean(process.env.EMAIL_PASS) &&
    process.env.EMAIL_USER !== 'your_email@gmail.com' &&
    process.env.EMAIL_USER.trim() !== '';

  if (hasCustomCredentials) {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || undefined,
      host: process.env.EMAIL_HOST || (process.env.EMAIL_SERVICE ? undefined : 'smtp.gmail.com'),
      port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: SMTP_TIMEOUT_MS,
      greetingTimeout: SMTP_TIMEOUT_MS,
      socketTimeout: SMTP_TIMEOUT_MS,
    });

    return { transporter, isEthereal: false };
  }

  // Fallback to Ethereal test account with timeout guard
  if (!cachedTestAccount) {
    console.log('[Email Service] Initializing Ethereal Test Account with 5s timeout guard...');
    const testAccountPromise = nodemailer.createTestAccount();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Ethereal test account creation timed out (5s limit)')), 5000)
    );
    cachedTestAccount = await Promise.race([testAccountPromise, timeoutPromise]);
    console.log(`[Email Service] Ethereal Account Active: ${cachedTestAccount.user}`);
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: cachedTestAccount.user,
      pass: cachedTestAccount.pass,
    },
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
  });

  return { transporter, isEthereal: true };
};

/**
 * Dispatches an automated executive corporate invoice email with in-memory PDF attachment
 * localized for the Indian B2B corporate market.
 * Wrapped in hard timeout so it never hangs if cloud host blocks outbound SMTP ports.
 *
 * @param {Object} client - Mongoose Client document
 * @param {Buffer} pdfBuffer - In-memory PDF buffer from PDFKit
 * @param {Object} invoiceMeta - Invoice number, issue date, due date
 * @returns {Promise<{success: boolean, messageId: string, previewUrl: string|null, isEthereal: boolean}>}
 */
export const sendInvoiceEmail = async (client, pdfBuffer, invoiceMeta = {}) => {
  const { transporter, isEthereal } = await getTransporter();

  const invoiceNumber = invoiceMeta.invoiceNumber || `INV-IN-${Date.now().toString().slice(-6)}`;
  
  // Financial GST calculations in INR (₹)
  const baseContractAmount = Number(client.totalCost) || 0;
  const totalGstAmount = Math.round(baseContractAmount * 0.18 * 100) / 100;
  const totalPayableAmount = Math.round((baseContractAmount + totalGstAmount) * 100) / 100;

  const formattedBaseAmount = formatCurrencyINR(baseContractAmount);
  const formattedGstAmount = formatCurrencyINR(totalGstAmount);
  const formattedTotalPayable = formatCurrencyINR(totalPayableAmount);

  const senderEmail = isEthereal
    ? (cachedTestAccount?.user || 'billing@ethereal.email')
    : (process.env.EMAIL_USER || 'billing@eventrisers.in');

  const senderName = 'Event Risers Corporate Billing & Treasury';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tax Invoice ${invoiceNumber} - Event Risers Corporate</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F1F5F9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #334155;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 620px;
      margin: 30px auto;
      background-color: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
      border: 1px solid #E2E8F0;
    }
    .header {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      padding: 34px 32px 28px;
      text-align: left;
      border-bottom: 4px solid #2563EB;
    }
    .brand {
      color: #FFFFFF;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand span {
      color: #38BDF8;
    }
    .tagline {
      color: #94A3B8;
      font-size: 11.5px;
      font-weight: 600;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-top: 5px;
    }
    .content {
      padding: 32px;
    }
    .greeting {
      font-size: 17.5px;
      font-weight: 700;
      color: #0F172A;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .intro {
      font-size: 14px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 22px;
    }
    .card {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 22px;
    }
    .card-row {
      display: flex;
      justify-content: space-between;
      padding: 7px 0;
      border-bottom: 1px solid #E2E8F0;
      font-size: 13.5px;
    }
    .card-row:last-child {
      border-bottom: none;
      padding-top: 12px;
      font-size: 15px;
      font-weight: 700;
      color: #0F172A;
    }
    .card-label {
      color: #64748B;
    }
    .card-val {
      color: #0F172A;
      font-weight: 600;
      text-align: right;
    }
    .amount-highlight {
      color: #2563EB;
      font-size: 18px;
    }
    .gst-tag {
      background-color: #EFF6FF;
      color: #1D4ED8;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      margin-left: 6px;
    }
    .notice {
      background-color: #EFF6FF;
      border-left: 4px solid #2563EB;
      padding: 14px 16px;
      border-radius: 0 6px 6px 0;
      font-size: 12.5px;
      color: #1E40AF;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .attachment-pill {
      display: inline-block;
      background-color: #F1F5F9;
      border: 1px dashed #94A3B8;
      border-radius: 6px;
      padding: 8px 14px;
      font-size: 12.5px;
      color: #334155;
      font-weight: 600;
      margin-bottom: 22px;
    }
    .footer {
      background-color: #0F172A;
      color: #64748B;
      padding: 24px 32px;
      font-size: 11px;
      line-height: 1.6;
      border-top: 1px solid #1E293B;
      text-align: center;
    }
    .footer a {
      color: #38BDF8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="brand">EVENT <span>RISERS</span></div>
      <div class="tagline">Event Risers Corporate Solutions Pvt. Ltd. &bull; India</div>
    </div>
    <div class="content">
      <h2 class="greeting">Dear ${client.contactPerson || 'Valued Corporate Partner'},</h2>
      <p class="intro">
        Thank you for choosing <strong>Event Risers Corporate Solutions Pvt. Ltd.</strong> for your enterprise event management. 
        Your official GST Tax Invoice for <strong>${client.eventType}</strong> has been generated and dispatched through our automated B2B billing engine.
      </p>

      <div class="card">
        <div class="card-row">
          <span class="card-label">Invoice Number</span>
          <span class="card-val" style="color: #2563EB;">${invoiceNumber}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Client Account</span>
          <span class="card-val">${client.companyName}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Engagement Category</span>
          <span class="card-val">${client.eventType}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Base Contract Value</span>
          <span class="card-val">${formattedBaseAmount}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Goods &amp; Services Tax <span class="gst-tag">18% GST</span></span>
          <span class="card-val">${formattedGstAmount}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Total Payable (INR ₹)</span>
          <span class="card-val amount-highlight">${formattedTotalPayable}</span>
        </div>
      </div>

      <div class="attachment-pill">
        📎 Attached: <strong>Tax_Invoice_${invoiceNumber}.pdf</strong> (Itemized Deliverables, SAC 998596 &amp; RTGS Wire Details)
      </div>

      <div class="notice">
        <strong>GST &amp; Payment Notice:</strong> Please find complete banking remittance details (HDFC Bank Current A/c &bull; IFSC: HDFC0000240) in the attached PDF. Kindly route NEFT / RTGS payments within 30 days. TDS may be deducted under Section 194C / 194J as applicable.
      </div>

      <p class="intro" style="margin-bottom: 6px;">
        For corporate billing inquiries or vendor onboarding formalities, please reply directly to this dispatch or contact your dedicated account director.
      </p>
      <p style="font-size: 13.5px; font-weight: 600; color: #0F172A; margin-top: 18px;">
        Warm regards,<br />
        <span style="font-weight: 400; color: #64748B;">Corporate Treasury &amp; Finance Directorate</span><br />
        Event Risers Corporate Solutions Pvt. Ltd. (India)
      </p>
    </div>
    <div class="footer">
      Event Risers Corporate Solutions Pvt. Ltd. &bull; Level 9, Cyber City, Gurugram, NCR 122002 | UB City, Bengaluru 560001, India<br />
      GSTIN: 07AAACE9821F1Z8 &bull; Corporate PAN: AAACE9821F &bull; SAC: 998596<br />
      Confidentiality Notice: Intended solely for the use of ${client.companyName}.
    </div>
  </div>
</body>
</html>
  `.trim();

  const mailOptions = {
    from: `"${senderName}" <${senderEmail}>`,
    to: client.email,
    subject: `Official GST Tax Invoice - [${invoiceNumber}] - ${client.eventType} - Event Risers`,
    text: `Dear ${client.contactPerson},\n\nPlease find attached the official GST Tax Invoice (${invoiceNumber}) for: ${client.eventType}.\n\nBase Contract Amount: ${formattedBaseAmount}\n18% GST: ${formattedGstAmount}\nTotal Payable: ${formattedTotalPayable}\n\nThank you for partnering with Event Risers Corporate Solutions Pvt. Ltd.\nBilling & Treasury Directorate (India)`,
    html: htmlContent,
    attachments: [
      {
        filename: `Tax_Invoice_${invoiceNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  // Hard timeout guard on sendMail so it never exceeds 7 seconds if outbound SMTP is blocked
  const sendMailPromise = transporter.sendMail(mailOptions);
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('SMTP connection timed out (outbound ports 465/587 restricted on cloud host)')), 7000)
  );

  const info = await Promise.race([sendMailPromise, timeoutPromise]);
  const previewUrl = isEthereal ? nodemailer.getTestMessageUrl(info) : null;

  if (previewUrl) {
    console.log(`[Email Dispatch] Ethereal Preview URL: ${previewUrl}`);
  } else {
    console.log(`[Email Dispatch] Email dispatched successfully to: ${client.email} (MessageID: ${info.messageId})`);
  }

  return {
    success: true,
    messageId: info.messageId,
    previewUrl: previewUrl || null,
    isEthereal,
  };
};
