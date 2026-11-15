import React, { useState } from 'react';
import {
  FileText,
  Mail,
  CheckCircle2,
  Trash2,
  Clock,
  Sparkles,
  Building,
  User,
  Calendar,
} from 'lucide-react';
import { billingService } from '../services/api';

export const ClientTable = ({
  clients = [],
  isLoading = false,
  onGenerateInvoice,
  onDeleteClient,
  rowStages = {},
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  if (isLoading && clients.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-4 animate-spin">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-800">Loading Client Registry...</h3>
        <p className="text-xs text-slate-500 mt-1">Retrieving Indian enterprise accounts and contract metrics</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <Building className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Corporate Partners Found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          No records match your criteria. Expand the onboarding form above or prefill an Indian corporate partner to test automated GST billing.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider select-none border-b border-slate-800">
              <th className="py-4 px-5">Enterprise Client</th>
              <th className="py-4 px-5">Event Engagement</th>
              <th className="py-4 px-5 text-right">Contract Valuation (₹ INR)</th>
              <th className="py-4 px-5 text-center">GST Invoices Dispatched</th>
              <th className="py-4 px-5">Last Invoiced</th>
              <th className="py-4 px-5 text-center">Automation Dispatch</th>
              <th className="py-4 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {clients.map((client) => {
              const currentStage = rowStages[client._id] || 'idle';
              const isProcessing = currentStage === 'generating' || currentStage === 'sending';
              const pdfUrl = billingService.getPdfPreviewUrl(client._id);

              return (
                <tr
                  key={client._id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Company Name & Contact info */}
                  <td className="py-4 px-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/80 flex items-center justify-center font-bold text-slate-700 text-sm shadow-xs group-hover:border-blue-300 transition-colors">
                        {client.companyName ? client.companyName.substring(0, 2).toUpperCase() : 'CO'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {client.companyName}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1 text-slate-400" />
                            {client.contactPerson}
                          </span>
                          <span>&bull;</span>
                          <span className="text-slate-400 font-mono text-[11.5px] truncate max-w-[170px]" title={client.email}>
                            {client.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Event Type Badge */}
                  <td className="py-4 px-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                      <Calendar className="w-3 h-3 mr-1.5 text-blue-500" />
                      {client.eventType}
                    </span>
                  </td>

                  {/* Contract Valuation (₹ INR) */}
                  <td className="py-4 px-5 text-right font-mono font-bold text-slate-900 text-sm">
                    {`₹ ${Number(client.totalCost).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  </td>

                  {/* Invoices Sent Count */}
                  <td className="py-4 px-5 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        client.invoicesSent > 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {client.invoicesSent || 0} sent
                    </span>
                  </td>

                  {/* Last Invoiced Date */}
                  <td className="py-4 px-5 text-xs text-slate-500">
                    {client.lastInvoicedAt ? (
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(client.lastInvoicedAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Never billed</span>
                    )}
                  </td>

                  {/* REAL-TIME MULTI-STAGE BUTTON */}
                  <td className="py-4 px-5 text-center">
                    <button
                      onClick={() => onGenerateInvoice(client)}
                      disabled={isProcessing || currentStage === 'done'}
                      className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all min-w-[178px] shadow-xs ${
                        currentStage === 'generating'
                          ? 'bg-amber-600 text-white cursor-wait animate-pulse'
                          : currentStage === 'sending'
                          ? 'bg-sky-600 text-white cursor-wait animate-pulse'
                          : currentStage === 'done'
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-slate-900 hover:bg-blue-600 text-white hover:shadow-md'
                      }`}
                    >
                      {currentStage === 'generating' && (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Generating PDF...</span>
                        </>
                      )}

                      {currentStage === 'sending' && (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Sending Email...</span>
                        </>
                      )}

                      {currentStage === 'done' && (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-100" />
                          <span>Done!</span>
                        </>
                      )}

                      {currentStage === 'idle' && (
                        <>
                          <Mail className="w-3.5 h-3.5 mr-1.5 text-sky-300" />
                          <span>Generate &amp; Email Invoice</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Row Actions: View PDF & Delete */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      {/* Direct PDF View */}
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Inspect Generated GST PDF Stream"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                      </a>

                      {/* Delete with inline confirm */}
                      {deleteConfirmId === client._id ? (
                        <div className="flex items-center space-x-1 bg-red-50 p-1 rounded-md border border-red-200">
                          <button
                            onClick={() => {
                              onDeleteClient(client._id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-600 rounded hover:bg-red-700"
                          >
                            Purge
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 hover:text-slate-800"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(client._id)}
                          title="Purge Client Record"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-slate-50/80 px-6 py-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Zero-disk in-memory GST PDF generation &bull; Automated Indian Corporate Dispatch (₹ INR)</span>
        </div>
        <span>Registry synced with MongoDB</span>
      </div>
    </div>
  );
};

export default ClientTable;
