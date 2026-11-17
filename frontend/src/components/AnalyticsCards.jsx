import React from 'react';
import { Building2, FileText, IndianRupee } from 'lucide-react';

export const AnalyticsCards = ({ analytics = {}, isLoading = false }) => {
  const {
    totalClients = 0,
    totalInvoicesSent = 0,
    totalContractValuation = 0,
  } = analytics;

  // Indian currency formatting with JetBrains Mono tabular numbers
  const formattedValuation = `₹ ${Number(totalContractValuation).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })}`;

  const cards = [
    {
      id: 'clients',
      label: 'Corporate Clients',
      value: isLoading ? '—' : totalClients.toLocaleString('en-IN'),
      detail: 'Active enterprise contracts',
      icon: Building2,
      badge: 'Directory',
      badgeClass: 'bg-surface text-ink-muted border-hairline',
    },
    {
      id: 'invoices',
      label: 'Invoices Sent',
      value: isLoading ? '—' : totalInvoicesSent.toLocaleString('en-IN'),
      detail: 'Itemized tax invoices issued',
      icon: FileText,
      badge: 'Dispatched',
      badgeClass: 'bg-teal-subtle text-teal-dark border-teal-border',
    },
    {
      id: 'valuation',
      label: 'Total Contract Value',
      value: isLoading ? '—' : formattedValuation,
      detail: 'Cumulative contract portfolio',
      icon: IndianRupee,
      badge: 'INR Ledger',
      badgeClass: 'bg-ochre-subtle text-ochre border-ochre-border',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="bg-panel rounded-lg border border-hairline p-5 shadow-subtle hover:border-hairline-hover transition-colors"
          >
            {/* Top row with clean label & pill */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider font-sans">
                {card.label}
              </span>
              <span
                className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${card.badgeClass}`}
              >
                {card.badge}
              </span>
            </div>

            {/* Metric Value */}
            <div className="flex items-baseline justify-between">
              <div className="text-2xl sm:text-3xl font-bold text-ink tracking-tight font-mono tabular-nums">
                {card.value}
              </div>
              <div className="w-8 h-8 rounded-md bg-surface border border-hairline flex items-center justify-center text-ink-muted">
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            {/* Subtext */}
            <p className="mt-2 text-xs text-ink-subtle font-sans">
              {card.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsCards;
