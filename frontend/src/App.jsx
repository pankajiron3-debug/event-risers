import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ExternalLink, CheckCircle2, Sparkles, FileText } from 'lucide-react';
import { Header } from './components/Header';
import { AnalyticsCards } from './components/AnalyticsCards';
import { ClientForm } from './components/ClientForm';
import { SearchBar } from './components/SearchBar';
import { ClientTable } from './components/ClientTable';
import { clientService, billingService, systemService } from './services/api';

const SEED_CLIENTS = [
  {
    companyName: 'Tata Elxsi Ltd.',
    contactPerson: 'Rohan Deshmukh (VP Marketing)',
    email: 'rohan.deshmukh@tataelxsi.co.in',
    eventType: 'Annual Tech Leadership Conclave',
    totalCost: 650000,
  },
  {
    companyName: 'Razorpay Software Pvt. Ltd.',
    contactPerson: 'Ananya Iyer (Head of Events)',
    email: 'ananya.iyer@razorpay.com',
    eventType: 'Fintech Innovation Summit',
    totalCost: 480000,
  },
  {
    companyName: 'Mahindra & Mahindra Corporate',
    contactPerson: 'Vikramaditya Nair (Director Operations)',
    email: 'vikram.nair@mahindra.com',
    eventType: 'National Dealers Meet',
    totalCost: 820000,
  },
];

export function App() {
  const [clients, setClients] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalClients: 0,
    totalInvoicesSent: 0,
    totalContractValuation: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [healthStatus, setHealthStatus] = useState('UNKNOWN');
  const [rowStages, setRowStages] = useState({});

  // Fetch clients and aggregated metrics
  const fetchRegistryData = useCallback(async (searchQuery = '', showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      const data = await clientService.getAll(searchQuery);
      if (data && data.success) {
        setClients(data.clients || []);
        setAnalytics(data.analytics || {
          totalClients: 0,
          totalInvoicesSent: 0,
          totalContractValuation: 0,
        });
      }
      if (showToast) {
        toast.success('Registry & analytics refreshed');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error(`Failed to sync registry: ${err.message}`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Health check
  const checkSystemHealth = useCallback(async () => {
    try {
      const data = await systemService.getHealth();
      setHealthStatus(data.status || 'UP');
    } catch {
      setHealthStatus('DOWN');
    }
  }, []);

  useEffect(() => {
    fetchRegistryData(searchTerm);
    checkSystemHealth();
  }, [fetchRegistryData, checkSystemHealth, searchTerm]);

  // Handle client creation
  const handleCreateClient = async (clientData) => {
    setIsSubmitting(true);
    try {
      await clientService.create(clientData);
      toast.success(`Client "${clientData.companyName}" registered successfully!`, {
        icon: '🏢',
      });
      setIsFormOpen(false);
      await fetchRegistryData(searchTerm);
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to onboard client');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle client deletion
  const handleDeleteClient = async (clientId) => {
    try {
      await clientService.delete(clientId);
      toast.success('Client record removed from registry');
      await fetchRegistryData(searchTerm);
    } catch (err) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  // REAL-TIME MULTI-STAGE BUTTON LOGIC (INR ₹ / GST Billing & Safe Cloud Dispatch)
  const handleGenerateInvoice = async (client) => {
    const clientId = client._id;

    // Stage 1: Transition to "Generating PDF..."
    setRowStages((prev) => ({ ...prev, [clientId]: 'generating' }));

    try {
      // Advance to Stage 2: "Sending Email..."
      setTimeout(() => {
        setRowStages((prev) => {
          if (prev[clientId] === 'generating') {
            return { ...prev, [clientId]: 'sending' };
          }
          return prev;
        });
      }, 750);

      // Perform backend automated billing & email dispatch
      const res = await billingService.process(clientId);

      // Stage 3: Transition to "Done!"
      setRowStages((prev) => ({ ...prev, [clientId]: 'done' }));

      // Custom Corporate Toast Notification
      if (res.previewUrl) {
        toast(
          (t) => (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>GST Tax Invoice #{res.invoiceNumber} Dispatched!</span>
              </div>
              <p className="text-xs text-slate-600">
                Dispatched via Ethereal Sandbox SMTP to <strong>{res.recipientEmail}</strong>.
              </p>
              <a
                href={res.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => toast.dismiss(t.id)}
                className="inline-flex items-center justify-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-xs transition-colors"
              >
                <span>Open Live Email Preview</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          ),
          {
            duration: 9000,
            style: {
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              padding: '14px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15)',
            },
          }
        );
      } else if (res.emailDispatched) {
        toast.success(
          `Tax Invoice #${res.invoiceNumber} dispatched to ${res.recipientEmail}!`,
          { duration: 5000 }
        );
      } else {
        // Outbound cloud SMTP restricted on Render free tier, but invoice & MongoDB stats successfully generated
        const pdfUrl = billingService.getPdfPreviewUrl(clientId);
        toast(
          (t) => (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>GST Invoice #{res.invoiceNumber} Generated!</span>
              </div>
              <p className="text-xs text-slate-600">
                Invoice logged in registry &amp; counters updated. (Email queued: cloud SMTP port restricted on Render free tier).
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => toast.dismiss(t.id)}
                className="inline-flex items-center justify-center space-x-1 px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-md text-xs font-bold shadow-xs transition-colors"
              >
                <span>Inspect Generated PDF</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          ),
          {
            duration: 8000,
            style: {
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              padding: '14px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15)',
            },
          }
        );
      }

      // Refresh registry numbers to reflect incremented invoices count
      await fetchRegistryData(searchTerm);

      // Reset button stage back to "idle" after 3 seconds
      setTimeout(() => {
        setRowStages((prev) => ({ ...prev, [clientId]: 'idle' }));
      }, 3000);

    } catch (err) {
      console.error('Invoice generation failed:', err);
      setRowStages((prev) => ({ ...prev, [clientId]: 'idle' }));
      toast.error(`Dispatch Failed: ${err.message}`, {
        duration: 5000,
        icon: '⚠️',
      });
    }
  };

  // Seed sample database with Indian B2B partners
  const handleSeedDemoData = async () => {
    try {
      for (const client of SEED_CLIENTS) {
        await clientService.create(client);
      }
      toast.success('Seeded Indian corporate partners successfully!');
      fetchRegistryData();
    } catch (err) {
      toast.error(`Seed error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast System */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '13px',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            color: '#0F172A',
          },
        }}
      />

      {/* Corporate Header */}
      <Header
        onRefresh={() => fetchRegistryData(searchTerm, true)}
        isRefreshing={isRefreshing}
        healthStatus={healthStatus}
      />

      {/* Main SaaS Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Summary Analytics Cards (₹ INR) */}
        <AnalyticsCards analytics={analytics} isLoading={isLoading} />

        {/* Collapsible Add Client CMS Form */}
        <ClientForm
          isOpen={isFormOpen}
          onToggle={() => setIsFormOpen(!isFormOpen)}
          onSubmit={handleCreateClient}
          isSubmitting={isSubmitting}
        />

        {/* Search & Filtering Bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          resultCount={clients.length}
          totalCount={analytics.totalClients || clients.length}
        />

        {/* Corporate Client Registry Table */}
        <ClientTable
          clients={clients}
          isLoading={isLoading}
          onGenerateInvoice={handleGenerateInvoice}
          onDeleteClient={handleDeleteClient}
          rowStages={rowStages}
        />

        {/* Empty state seed prompt if zero clients exist */}
        {!isLoading && clients.length === 0 && !searchTerm && (
          <div className="mt-4 p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-center justify-between text-xs text-blue-900 gap-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>
                <strong>Internship Demo Tip:</strong> Pre-populate your database with realistic Indian corporate partners (Tata Elxsi, Razorpay, Mahindra) in one click.
              </span>
            </div>
            <button
              onClick={handleSeedDemoData}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs"
            >
              Seed 3 Indian Corporate Partners
            </button>
          </div>
        )}

      </main>

      {/* Corporate Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-800">EVENT RISERS</span>
            <span>&bull;</span>
            <span>Indian Corporate Solutions Pvt. Ltd. &bull; Solo Internship Capstone</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
              18% GST Invoicing &bull; Node.js + MongoDB + PDFKit + Nodemailer
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
