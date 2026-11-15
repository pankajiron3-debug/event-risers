import React from 'react';
import { Building2, FileCheck2, TrendingUp } from 'lucide-react';

export const AnalyticsCards = ({ analytics = {}, isLoading = false }) => {
  const {
    totalClients = 0,
    totalInvoicesSent = 0,
    totalContractValuation = 0,
  } = analytics;

  // Indian format with ₹ symbol (e.g., ₹19,50,000)
  const formattedValuation = `₹ ${Number(totalContractValuation).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })}`;

  const cards = [
    {
      id: 'clients',
      title: 'Total Corporate Clients',
      value: isLoading ? '...' : totalClients.toLocaleString('en-IN'),
      subtext: 'Active Indian enterprise contracts in CMS',
      icon: Building2,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      badge: 'B2B India Registry',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'invoices',
      title: 'Total Invoices Generated',
      value: isLoading ? '...' : totalInvoicesSent.toLocaleString('en-IN'),
      subtext: 'Automated GST PDF dispatches completed',
      icon: FileCheck2,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: 'GST Compliant',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'valuation',
      title: 'Total Contract Valuation (₹ INR)',
      value: isLoading ? '...' : formattedValuation,
      subtext: 'Aggregated Indian B2B client pipeline',
      customIcon: (
        <span className="font-extrabold text-xl text-violet-600 font-sans">₹</span>
      ),
      iconBg: 'bg-violet-50 text-violet-600 border-violet-200',
      badge: 'Portfolio Value (INR)',
      badgeColor: 'bg-violet-100 text-violet-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Top row with icon & badge */}
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs ${card.iconBg} group-hover:scale-105 transition-transform`}
              >
                {card.customIcon ? card.customIcon : <IconComponent className="w-6 h-6" />}
              </div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${card.badgeColor}`}
              >
                {card.badge}
              </span>
            </div>

            {/* Metric numbers */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {card.title}
              </p>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
                {card.value}
              </div>
              <div className="flex items-center mt-2 text-xs text-slate-500 space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                <span>{card.subtext}</span>
              </div>
            </div>

            {/* Bottom accent glow */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsCards;
