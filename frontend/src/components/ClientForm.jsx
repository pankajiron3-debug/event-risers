import React, { useState } from 'react';
import { Plus, Building2, User, Mail, Calendar, ChevronDown, ChevronUp, Copy } from 'lucide-react';

const EVENT_TYPES = [
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
  'All India Leadership Conclave',
];

const SAMPLE_CLIENTS = [
  {
    companyName: 'Infosys BPM Ltd.',
    contactPerson: 'Priya Sharma (Corporate Comms Lead)',
    email: 'priya.sharma@infosys.com',
    eventType: 'Annual Tech Leadership Conclave',
    totalCost: '550000',
  },
  {
    companyName: 'Wipro Digital Technologies',
    contactPerson: 'Amitabh Sen (Director Engagement)',
    email: 'amitabh.sen@wipro.com',
    eventType: 'Fintech Innovation Summit',
    totalCost: '620000',
  },
  {
    companyName: 'HCL Enterprise Solutions',
    contactPerson: 'Kavita Nambiar (VP Strategy)',
    email: 'kavita.nambiar@hcl.in',
    eventType: 'National Dealers Meet',
    totalCost: '490000',
  },
  {
    companyName: 'Larsen & Toubro Corporate',
    contactPerson: 'Siddharth Saxena (VP Operations)',
    email: 'siddharth.saxena@larsentoubro.com',
    eventType: 'Annual Tech Leadership Conclave',
    totalCost: '780000',
  },
];

export const ClientForm = ({ isOpen, onToggle, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    eventType: 'Annual Tech Leadership Conclave',
    totalCost: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Corporate email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid corporate email address';
    }
    if (!formData.eventType) newErrors.eventType = 'Event category is required';
    if (!formData.totalCost || Number(formData.totalCost) <= 0) {
      newErrors.totalCost = 'Provide a valid positive contract amount in ₹ INR';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await onSubmit({
      ...formData,
      totalCost: Number(formData.totalCost),
    });

    if (success) {
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        eventType: 'Annual Tech Leadership Conclave',
        totalCost: '',
      });
      setErrors({});
    }
  };

  const handleAutofill = () => {
    const randomSample = SAMPLE_CLIENTS[Math.floor(Math.random() * SAMPLE_CLIENTS.length)];
    setFormData(randomSample);
    setErrors({});
  };

  return (
    <div className="bg-panel rounded-lg border border-hairline shadow-subtle mb-6 overflow-hidden">
      {/* Header bar / Toggle */}
      <div
        onClick={onToggle}
        className="px-5 py-3.5 bg-surface/60 hover:bg-surface border-b border-hairline cursor-pointer flex items-center justify-between transition-colors select-none"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded bg-teal-subtle text-teal-deep border border-teal-border flex items-center justify-center">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">
              Add Corporate Account
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isOpen ? (
            <span className="inline-flex items-center text-xs text-ink-muted bg-panel px-2.5 py-1 rounded border border-hairline">
              Collapse <ChevronUp className="w-3 h-3 ml-1 text-ink-subtle" />
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-medium text-teal-deep bg-panel px-2.5 py-1 rounded border border-hairline hover:border-hairline-hover">
              New Client <ChevronDown className="w-3 h-3 ml-1 text-teal-deep" />
            </span>
          )}
        </div>
      </div>

      {/* Form Body */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="p-5">
          <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-hairline">
            <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider font-mono">
              Contract Specifications
            </span>
            <button
              type="button"
              onClick={handleAutofill}
              className="inline-flex items-center space-x-1.5 text-xs text-ink-muted hover:text-ink bg-surface hover:bg-hairline px-2.5 py-1 rounded border border-hairline transition-colors"
            >
              <Copy className="w-3 h-3 text-ink-muted" />
              <span>Load Sample Client</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Company Name <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-ink-subtle">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Tech Mahindra Ltd."
                  className={`block w-full pl-8 pr-3 py-1.5 text-xs rounded-md border ${
                    errors.companyName ? 'border-red-400 bg-red-50/20' : 'border-hairline'
                  } bg-panel text-ink placeholder-ink-subtle/70 focus:outline-none focus:border-teal-deep focus:ring-1 focus:ring-teal-deep transition-colors`}
                />
              </div>
              {errors.companyName && (
                <p className="mt-1 text-[11px] text-red-600">{errors.companyName}</p>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Contact Person <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-ink-subtle">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Verma (VP Operations)"
                  className={`block w-full pl-8 pr-3 py-1.5 text-xs rounded-md border ${
                    errors.contactPerson ? 'border-red-400 bg-red-50/20' : 'border-hairline'
                  } bg-panel text-ink placeholder-ink-subtle/70 focus:outline-none focus:border-teal-deep focus:ring-1 focus:ring-teal-deep transition-colors`}
                />
              </div>
              {errors.contactPerson && (
                <p className="mt-1 text-[11px] text-red-600">{errors.contactPerson}</p>
              )}
            </div>

            {/* Corporate Email */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Corporate Email <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-ink-subtle">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rajesh.verma@techmahindra.com"
                  className={`block w-full pl-8 pr-3 py-1.5 text-xs rounded-md border ${
                    errors.email ? 'border-red-400 bg-red-50/20' : 'border-hairline'
                  } bg-panel text-ink placeholder-ink-subtle/70 focus:outline-none focus:border-teal-deep focus:ring-1 focus:ring-teal-deep transition-colors`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Event Category */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Engagement Scope <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-ink-subtle">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="block w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-hairline bg-panel text-ink focus:outline-none focus:border-teal-deep focus:ring-1 focus:ring-teal-deep transition-colors"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {errors.eventType && (
                <p className="mt-1 text-[11px] text-red-600">{errors.eventType}</p>
              )}
            </div>

            {/* Contract Total Cost (₹ INR) */}
            <div>
              <label className="block text-xs font-semibold text-ink-muted mb-1">
                Contract Valuation (₹ INR) <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-ink-subtle font-mono text-xs">
                  ₹
                </div>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  name="totalCost"
                  value={formData.totalCost}
                  onChange={handleChange}
                  placeholder="e.g. 450000"
                  className={`block w-full pl-7 pr-3 py-1.5 text-xs font-mono rounded-md border ${
                    errors.totalCost ? 'border-red-400 bg-red-50/20' : 'border-hairline'
                  } bg-panel text-ink placeholder-ink-subtle/70 focus:outline-none focus:border-teal-deep focus:ring-1 focus:ring-teal-deep transition-colors`}
                />
              </div>
              {errors.totalCost && (
                <p className="mt-1 text-[11px] text-red-600">{errors.totalCost}</p>
              )}
            </div>

            {/* Submit Action */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold text-white bg-teal-deep hover:bg-teal-hover rounded-md transition-colors disabled:opacity-50 h-[34px] shadow-xs"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-1.5">
                    <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving...</span>
                  </span>
                ) : (
                  <span>Register Client</span>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ClientForm;
