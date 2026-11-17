import React, { useState } from 'react';
import {
  FileText,
  Mail,
  Check,
  Trash2,
  Building2,
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
      <div className="bg-panel rounded-lg border border-hairline p-12 text-center shadow-subtle">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface text-ink-muted mb-3 animate-spin">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-ink">Loading client directory...</h3>
        <p className="text-xs text-ink-subtle mt-1">Retrieving verified enterprise accounts</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="bg-panel rounded-lg border border-hairline p-12 text-center shadow-subtle">
        <div className="w-10 h-10 rounded-md bg-surface flex items-center justify-center mx-auto text-ink-muted mb-3">
          <Building2 className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-ink">No Corporate Accounts Found</h3>
        <p className="text-xs text-ink-subtle mt-1 max-w-sm mx-auto">
          No records match your search filter. Add a client above to begin invoicing.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-panel rounded-lg border border-hairline shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface/70 text-ink-muted text-[11px] font-semibold uppercase tracking-wider select-none border-b border-hairline font-sans">
              <th className="py-3 px-6">Client / Company</th>
              <th className="py-3 px-6">Event Scope</th>
              <th className="py-3 px-6 text-right">Total Contract Value</th>
              <th className="py-3 px-6 text-center">Invoices Sent</th>
              <th className="py-3 px-6">Last Invoiced</th>
              <th className="py-3 px-6 text-center">Billing</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline text-xs font-sans">
            {clients.map((client) => {
              const currentStage = rowStages[client._id] || 'idle';
              const isProcessing = currentStage === 'generating' || currentStage === 'sending';
              const pdfUrl = billingService.getPdfPreviewUrl(client._id);

              return (
                <tr
                  key={client._id}
                  className="hover:bg-surface/50 transition-colors group"
                >
                  {/* Company Name & Contact info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-surface border border-hairline flex items-center justify-center font-bold text-ink-muted text-xs select-none">
                        {client.companyName ? client.companyName.substring(0, 2).toUpperCase() : 'CO'}
                      </div>
                      <div>
                        <div className="font-semibold text-ink text-xs sm:text-[13px]">
                          {client.companyName}
                        </div>
                        <div className="flex items-center space-x-1.5 text-[11px] text-ink-subtle mt-0.5">
                          <span>{client.contactPerson}</span>
                          <span>&bull;</span>
                          <span className="font-mono text-[11px] truncate max-w-[170px]" title={client.email}>
                            {client.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Event Type Badge */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-teal-subtle text-teal-dark border border-teal-border">
                      <Calendar className="w-3 h-3 mr-1 text-teal-deep" />
                      {client.eventType}
                    </span>
                  </td>

                  {/* Contract Valuation */}
                  <td className="py-4 px-6 text-right font-mono font-semibold text-ink text-xs sm:text-[13px] tabular-nums">
                    {`₹ ${Number(client.totalCost).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                  </td>

                  {/* Invoices Sent Count */}
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium tabular-nums ${
                        client.invoicesSent > 0
                          ? 'bg-teal-subtle text-teal-dark border border-teal-border'
                          : 'bg-surface text-ink-subtle border border-hairline'
                      }`}
                    >
                      {client.invoicesSent || 0}
                    </span>
                  </td>

                  {/* Last Invoiced Date */}
                  <td className="py-4 px-6 text-ink-muted font-mono text-[11px] tabular-nums">
                    {client.lastInvoicedAt ? (
                      <span>
                        {new Date(client.lastInvoicedAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    ) : (
                      <span className="text-ink-subtle/70 font-sans italic">Never</span>
                    )}
                  </td>

                  {/* Billing Action Button */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => onGenerateInvoice(client)}
                      disabled={isProcessing || currentStage === 'done'}
                      className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium transition-all min-w-[175px] shadow-xs select-none ${
                        currentStage === 'generating'
                          ? 'bg-ochre text-white cursor-wait'
                          : currentStage === 'sending'
                          ? 'bg-teal-hover text-white cursor-wait'
                          : currentStage === 'done'
                          ? 'bg-emerald-800 text-white cursor-default'
                          : 'bg-teal-deep hover:bg-teal-hover text-white'
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
                          <Check className="w-3.5 h-3.5 mr-1 text-emerald-200" />
                          <span>Done</span>
                        </>
                      )}

                      {currentStage === 'idle' && (
                        <>
                          <Mail className="w-3.5 h-3.5 mr-1.5 text-teal-border" />
                          <span>Generate &amp; Email Invoice</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions: View PDF & Delete */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      {/* Direct PDF View */}
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Tax Invoice PDF"
                        className="p-1.5 text-ink-muted hover:text-teal-deep hover:bg-surface rounded transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </a>

                      {/* Delete */}
                      {deleteConfirmId === client._id ? (
                        <div className="flex items-center space-x-1 bg-red-50 p-0.5 rounded border border-red-200">
                          <button
                            onClick={() => {
                              onDeleteClient(client._id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-700 rounded hover:bg-red-800"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-1 py-0.5 text-[10px] text-ink-muted hover:text-ink"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(client._id)}
                          title="Remove Client"
                          className="p-1.5 text-ink-subtle hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Ledger Clean Table Footer */}
      <div className="bg-surface/40 px-6 py-3 border-t border-hairline flex items-center justify-between text-xs text-ink-subtle font-mono text-[11px]">
        <span>Showing {clients.length} accounts &bull; 18% GST Applicable</span>
        <span className="hidden sm:inline">All amounts in INR (₹)</span>
      </div>
    </div>
  );
};

export default ClientTable;
