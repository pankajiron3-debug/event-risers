import React, { useState } from 'react';
import { PlusCircle, Building, User, Mail, CalendarCheck, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-8 transition-all">
      {/* Header bar / Toggle */}
      <div
        onClick={onToggle}
        className="px-6 py-4.5 bg-slate-50/80 hover:bg-slate-100/70 border-b border-slate-200/80 cursor-pointer flex items-center justify-between transition-colors select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Onboard Corporate Client
            </h3>
            <p className="text-xs text-slate-500">
              Register an Indian enterprise engagement into CMS with automated GST invoicing (₹ INR)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isOpen ? (
            <span className="inline-flex items-center text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
              Collapse <ChevronUp className="w-3.5 h-3.5 ml-1 text-slate-400" />
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
              Expand Form <ChevronDown className="w-3.5 h-3.5 ml-1 text-blue-500" />
            </span>
          )}
        </div>
      </div>

      {/* Form Body */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Client &amp; Contract Specifications (India)
            </span>
            <button
              type="button"
              onClick={handleAutofill}
              className="inline-flex items-center text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100/80 px-2.5 py-1 rounded-md border border-sky-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-sky-500" />
              Prefill Demo Partner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Name *
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Tech Mahindra Ltd."
                  className={`block w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                    errors.companyName ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-colors`}
                />
              </div>
              {errors.companyName && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.companyName}</p>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Person *
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Verma (VP Operations)"
                  className={`block w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                    errors.contactPerson ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-colors`}
                />
              </div>
              {errors.contactPerson && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.contactPerson}</p>
              )}
            </div>

            {/* Corporate Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Corporate Email (For Dispatch) *
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rajesh.verma@techmahindra.com"
                  className={`block w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                    errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-colors`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Event Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Event Engagement Scope *
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 transition-colors"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {errors.eventType && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.eventType}</p>
              )}
            </div>

            {/* Contract Total Cost (₹ INR) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contract Valuation (₹ INR) *
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold text-sm">
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
                  className={`block w-full pl-8 pr-3 py-2 text-sm rounded-lg border ${
                    errors.totalCost ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-colors`}
                />
              </div>
              {errors.totalCost && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.totalCost}</p>
              )}
            </div>

            {/* Submit Action */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 h-[38px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Registering...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1.5">
                    <PlusCircle className="w-4 h-4" />
                    <span>Save to CMS Registry</span>
                  </span>
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
