import PDFDocument from 'pdfkit';
import fs from 'fs';

/**
 * Format number into Indian Rupee currency representation with en-IN comma grouping.
 * e.g., 450000 -> "₹ 4,50,000.00"
 */
export const formatINR = (amount, includeSymbol = true) => {
  const num = Number(amount) || 0;
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return includeSymbol ? `₹ ${formatted}` : formatted;
};

/**
 * Generates an in-memory executive corporate invoice PDF buffer for the Indian B2B market.
 * Includes complete GST tax breakdown (Base Amount + 18% GST = Total Payable).
 * Zero files are written to disk.
 *
 * @param {Object} client - The Mongoose client document
 * @param {Object} options - Invoice metadata (invoiceNumber, issueDate, dueDate)
 * @returns {Promise<Buffer>}
 */
export const generateInvoicePDF = (client, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        info: {
          Title: `Tax Invoice - ${client.companyName}`,
          Author: 'Event Risers Corporate Solutions Pvt. Ltd.',
          Subject: `B2B Tax Invoice for ${client.eventType}`,
        },
      });

      // Prefer Windows native Arial with true Rupee symbol glyph; fallback gracefully to Helvetica
      const hasArial = fs.existsSync('C:/Windows/Fonts/arial.ttf');
      const hasArialBold = fs.existsSync('C:/Windows/Fonts/arialbd.ttf');

      const regularFont = hasArial ? 'C:/Windows/Fonts/arial.ttf' : 'Helvetica';
      const boldFont = hasArialBold ? 'C:/Windows/Fonts/arialbd.ttf' : 'Helvetica-Bold';

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const invoiceNumber = options.invoiceNumber || `INV-IN-${Date.now().toString().slice(-6)}`;
      const issueDate = options.issueDate || new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      const dueDateObj = new Date();
      dueDateObj.setDate(dueDateObj.getDate() + 30);
      const dueDate = options.dueDate || dueDateObj.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      // GST Calculations: Base Amount + 18% GST (9% CGST + 9% SGST) = Total Payable
      const baseContractAmount = Number(client.totalCost) || 0;
      const cgstRate = 0.09;
      const sgstRate = 0.09;
      const totalGstRate = 0.18;

      const cgstAmount = Math.round(baseContractAmount * cgstRate * 100) / 100;
      const sgstAmount = Math.round(baseContractAmount * sgstRate * 100) / 100;
      const totalGstAmount = Math.round(baseContractAmount * totalGstRate * 100) / 100;
      const totalPayableINR = Math.round((baseContractAmount + totalGstAmount) * 100) / 100;

      // Color Palette (Enterprise Navy & Cobalt)
      const primaryColor = '#0F172A'; // Slate 900
      const accentColor = '#2563EB';  // Blue 600
      const darkSlate = '#1E293B';    // Slate 800
      const textMuted = '#64748B';    // Slate 500
      const lightBg = '#F8FAFC';      // Slate 50
      const borderColor = '#E2E8F0';  // Slate 200

      // ==========================================
      // 1. TOP HEADER & INDIAN CORPORATE IDENTITY
      // ==========================================
      // Brand Bar
      doc.rect(40, 36, 515, 6).fill(accentColor);

      // Company Title & Corporate Registration
      doc.fillColor(primaryColor)
        .fontSize(20)
        .font(boldFont)
        .text('EVENT RISERS CORPORATE SOLUTIONS PVT. LTD.', 40, 52);

      doc.fillColor(accentColor)
        .fontSize(8.5)
        .font(boldFont)
        .text('ENTERPRISE EVENT MANAGEMENT & CONCLAVE PRODUCTION (PAN INDIA)', 40, 76);

      doc.fillColor(textMuted)
        .fontSize(7.5)
        .font(regularFont)
        .text('Corporate Office: Level 9, Cyber City, DLF Phase 2, Gurugram, NCR - 122002, India', 40, 89)
        .text('Branch Office: UB City, Vittal Mallya Road, Bengaluru, Karnataka - 560001, India', 40, 99)
        .text('GSTIN: 07AAACE9821F1Z8 | Corporate PAN: AAACE9821F | SAC Code: 998596', 40, 109)
        .text('Email: billing@eventrisers.in | Desk: +91 (11) 4892-0000 | Web: eventrisers.in', 40, 119);

      // Invoice Header Box on Right
      doc.rect(370, 50, 185, 78).fillAndStroke(lightBg, borderColor);
      doc.fillColor(darkSlate)
        .fontSize(12.5)
        .font(boldFont)
        .text('TAX INVOICE (GST)', 380, 58);

      doc.fontSize(8).font(boldFont).fillColor(textMuted).text('INVOICE NO:', 380, 76);
      doc.font(boldFont).fillColor(accentColor).text(invoiceNumber, 442, 76);

      doc.font(regularFont).fillColor(textMuted).text('INVOICE DATE:', 380, 89);
      doc.font(regularFont).fillColor(darkSlate).text(issueDate, 442, 89);

      doc.font(regularFont).fillColor(textMuted).text('DUE DATE:', 380, 102);
      doc.font(boldFont).fillColor('#DC2626').text(dueDate, 442, 102);

      doc.font(regularFont).fillColor(textMuted).text('PLACE OF SUPPLY:', 380, 115);
      doc.font(boldFont).fillColor(darkSlate).text('NCR / Delhi (07)', 458, 115);

      // Horizontal Divider
      doc.moveTo(40, 136).lineTo(555, 136).lineWidth(1).strokeColor(borderColor).stroke();

      // ==========================================
      // 2. BILLED TO & EVENT SCOPE
      // ==========================================
      const billToY = 146;

      // Left Box: Billed To
      doc.rect(40, billToY, 250, 84).fillAndStroke(lightBg, borderColor);
      doc.fillColor(accentColor).fontSize(8.5).font(boldFont).text('BILLED TO (CORPORATE CLIENT)', 52, billToY + 8);
      doc.fillColor(primaryColor).fontSize(10.5).font(boldFont).text(client.companyName, 52, billToY + 22);
      doc.fillColor(textMuted).fontSize(8).font(regularFont)
        .text(`Attn: ${client.contactPerson}`, 52, billToY + 38)
        .text(`Email: ${client.email}`, 52, billToY + 50)
        .text(`GST Status: Registered Taxable Person / B2B Entity`, 52, billToY + 62);

      // Right Box: Engagement Scope
      doc.rect(305, billToY, 250, 84).fillAndStroke(lightBg, borderColor);
      doc.fillColor(accentColor).fontSize(8.5).font(boldFont).text('ENGAGEMENT SPECIFICATIONS', 317, billToY + 8);
      doc.fillColor(primaryColor).fontSize(10).font(boldFont).text(client.eventType, 317, billToY + 22);
      doc.fillColor(textMuted).fontSize(8).font(regularFont)
        .text('SAC Code: 998596 (Event Management Services)', 317, billToY + 38)
        .text('Reverse Charge (RCM): No', 317, billToY + 50)
        .text(`Corporate Invoices Dispatched: #${(client.invoicesSent || 0) + 1}`, 317, billToY + 62);

      // ==========================================
      // 3. ITEMIZED SERVICES TABLE (INR ₹)
      // ==========================================
      const tableTopY = 240;

      // Table Header Bar
      doc.rect(40, tableTopY, 515, 22).fill(darkSlate);
      doc.fillColor('#FFFFFF').fontSize(8).font(boldFont);
      doc.text('SL', 48, tableTopY + 6);
      doc.text('DESCRIPTION OF EVENT DELIVERABLES', 75, tableTopY + 6);
      doc.text('SAC', 335, tableTopY + 6, { width: 35, align: 'center' });
      doc.text('RATE (₹)', 380, tableTopY + 6, { width: 75, align: 'right' });
      doc.text('AMOUNT (₹ INR)', 465, tableTopY + 6, { width: 80, align: 'right' });

      // Calculate realistic itemized breakdown from Base Amount
      const item1Amount = Math.round(baseContractAmount * 0.50 * 100) / 100;
      const item2Amount = Math.round(baseContractAmount * 0.25 * 100) / 100;
      const item3Amount = Math.round(baseContractAmount * 0.15 * 100) / 100;
      const item4Amount = Math.round((baseContractAmount - item1Amount - item2Amount - item3Amount) * 100) / 100;

      const lineItems = [
        {
          num: '01',
          name: `Core Production & Main Stage Scenography`,
          desc: `Full production of ${client.eventType}, plenary staging, LED backdrops, acoustic tuning & floor design.`,
          sac: '998596',
          rate: formatINR(item1Amount),
          amount: formatINR(item1Amount),
        },
        {
          num: '02',
          name: `Broadcast AV, Truss Rigging & Dynamic Lighting`,
          desc: `Digital line-array audio, 4K broadcast visual switching, motorized truss rigging, and intelligent stage lights.`,
          sac: '998596',
          rate: formatINR(item2Amount),
          amount: formatINR(item2Amount),
        },
        {
          num: '03',
          name: `Executive Hospitality & VIP Conclave Experience`,
          desc: `VIP delegate hospitality, executive banquet coordination, speaker lounge concierge, and guest protocol.`,
          sac: '998596',
          rate: formatINR(item3Amount),
          amount: formatINR(item3Amount),
        },
        {
          num: '04',
          name: `On-site Technical Crew & Live Operations Management`,
          desc: `Certified production directors, live event engineers, backstage stage managers, and technical safety leads.`,
          sac: '998596',
          rate: formatINR(item4Amount),
          amount: formatINR(item4Amount),
        },
      ];

      let rowY = tableTopY + 22;
      lineItems.forEach((item, index) => {
        const isEven = index % 2 === 0;
        doc.rect(40, rowY, 515, 38).fillAndStroke(isEven ? '#FFFFFF' : '#F8FAFC', borderColor);

        doc.fillColor(darkSlate).font(boldFont).fontSize(8).text(item.num, 48, rowY + 8);
        doc.fillColor(primaryColor).font(boldFont).fontSize(8).text(item.name, 75, rowY + 8);
        doc.fillColor(textMuted).font(regularFont).fontSize(7).text(item.desc, 75, rowY + 20, { width: 250 });

        doc.fillColor(textMuted).font(regularFont).fontSize(7.5).text(item.sac, 335, rowY + 10, { width: 35, align: 'center' });
        doc.fillColor(darkSlate).font(regularFont).fontSize(8).text(item.rate, 380, rowY + 10, { width: 75, align: 'right' });
        doc.font(boldFont).text(item.amount, 465, rowY + 10, { width: 80, align: 'right' });

        rowY += 38;
      });

      // ==========================================
      // 4. FINANCIAL SUMMARY & GST TAX INVOICE
      // ==========================================
      const totalsY = rowY + 10;

      // Left Box: Remittance / RTGS / NEFT / IMPS Banking Details
      doc.rect(40, totalsY, 285, 130).fillAndStroke(lightBg, borderColor);
      doc.fillColor(accentColor).fontSize(8).font(boldFont).text('BANK WIRE / NEFT / RTGS REMITTANCE DETAILS', 50, totalsY + 9);

      doc.fillColor(textMuted).fontSize(7.5).font(regularFont)
        .text('Beneficiary: Event Risers Corporate Solutions Pvt. Ltd.', 50, totalsY + 24)
        .text('Bank Name: HDFC Bank Ltd. (Corporate Treasury Branch)', 50, totalsY + 36)
        .text('Current Account No: 50200084920192', 50, totalsY + 48)
        .text('IFSC Code: HDFC0000240 (RTGS / NEFT / IMPS)', 50, totalsY + 60)
        .text('MICR Code: 110240028', 50, totalsY + 72)
        .text(`Reference: ${invoiceNumber} / ${client.companyName.replace(/[^a-zA-Z0-9]/g, '')}`, 50, totalsY + 84)
        .text('Payment Terms: Net 30 days from official invoice generation.', 50, totalsY + 96)
        .text('TDS Applicability: Deduct under Section 194C / 194J as applicable.', 50, totalsY + 108);

      // Right Box: Base Amount + 18% GST = Total Payable
      const totalsBoxX = 335;
      doc.rect(totalsBoxX, totalsY, 220, 130).fillAndStroke('#FFFFFF', borderColor);

      // Line 1: Base Contract Amount
      doc.fillColor(textMuted).fontSize(8).font(regularFont).text('Base Amount (Pre-Tax):', totalsBoxX + 12, totalsY + 12);
      doc.fillColor(darkSlate).font(boldFont).text(formatINR(baseContractAmount), totalsBoxX + 110, totalsY + 12, { width: 98, align: 'right' });

      // Line 2: CGST (9%)
      doc.fillColor(textMuted).font(regularFont).text('CGST @ 9%:', totalsBoxX + 12, totalsY + 28);
      doc.fillColor(darkSlate).font(regularFont).text(formatINR(cgstAmount), totalsBoxX + 110, totalsY + 28, { width: 98, align: 'right' });

      // Line 3: SGST (9%)
      doc.fillColor(textMuted).font(regularFont).text('SGST @ 9%:', totalsBoxX + 12, totalsY + 44);
      doc.fillColor(darkSlate).font(regularFont).text(formatINR(sgstAmount), totalsBoxX + 110, totalsY + 44, { width: 98, align: 'right' });

      // Line 4: Total GST (18%)
      doc.fillColor(accentColor).font(boldFont).text('Total GST @ 18%:', totalsBoxX + 12, totalsY + 60);
      doc.fillColor(accentColor).font(boldFont).text(formatINR(totalGstAmount), totalsBoxX + 110, totalsY + 60, { width: 98, align: 'right' });

      // Total Payable Dark Banner
      doc.rect(totalsBoxX, totalsY + 78, 220, 52).fill(darkSlate);
      doc.fillColor('#94A3B8').fontSize(7.5).font(boldFont).text('TOTAL PAYABLE (INCL. 18% GST)', totalsBoxX + 12, totalsY + 86);
      doc.fillColor('#38BDF8').fontSize(13.5).font(boldFont).text(formatINR(totalPayableINR), totalsBoxX + 12, totalsY + 101, { width: 196, align: 'right' });

      // ==========================================
      // 5. SIGN-OFF & FOOTER
      // ==========================================
      const footerY = 712;

      doc.moveTo(40, footerY).lineTo(555, footerY).lineWidth(0.5).strokeColor(borderColor).stroke();

      doc.fillColor(textMuted).fontSize(6.5).font(regularFont)
        .text('Tax Invoice issued in accordance with Section 31 of the Central Goods and Services Tax Act, 2017.', 40, footerY + 8)
        .text('Computer-generated digital tax document; requires no physical signature under Indian IT Act 2000.', 40, footerY + 18);

      doc.fillColor(accentColor).fontSize(7).font(boldFont)
        .text('FOR EVENT RISERS CORPORATE SOLUTIONS PVT. LTD.', 300, footerY + 8, { align: 'right', width: 255 });
      doc.fillColor(darkSlate).fontSize(6.5).font(regularFont)
        .text('Authorized Finance & Corporate Treasury Directorate', 300, footerY + 18, { align: 'right', width: 255 });

      // Bottom Indian Flag / Accent Strip
      doc.rect(40, 755, 515, 3).fill(accentColor);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
