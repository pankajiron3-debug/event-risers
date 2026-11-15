import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters'],
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
      maxlength: [100, 'Contact person name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Contact corporate email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid corporate email address',
      ],
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      trim: true,
      enum: {
        values: [
          'Annual Tech Leadership Conclave',
          'Fintech Innovation Summit',
          'National Dealers Meet',
          'Annual Corporate Gala',
          'Executive Leadership Summit',
          'Global Tech Conference',
          'Product Launch & Keynote',
          'Corporate Team Offsite',
          'Investor Relations Forum',
          'Industry Awards Ceremony',
          'VIP Networking Reception',
          'Corporate Milestone Celebration',
          'All India Leadership Conclave',
          'Other',
        ],
        message: '{VALUE} is not a supported corporate event category',
      },
    },
    totalCost: {
      type: Number,
      required: [true, 'Total contract cost is required'],
      min: [0, 'Total cost cannot be negative'],
    },
    invoicesSent: {
      type: Number,
      default: 0,
      min: [0, 'Invoices count cannot be negative'],
    },
    lastInvoicedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual index for fast searching on company, contact, or email
clientSchema.index({ companyName: 'text', contactPerson: 'text', email: 'text' });

const Client = mongoose.model('Client', clientSchema);

export default Client;
