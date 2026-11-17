import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ExternalLink, Check, Plus } from 'lucide-react';
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
        toast.success('Directory updated', { icon: '✓' });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error(`Unable to sync directory: ${err.message}`);
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
      toast.success(`Client "${clientData.companyName}" added to directory`, {
        icon: '✓',
      });
      setIsFormOpen(false);
      await fetchRegistryData(searchTerm);
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to add client');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle client deletion
  const handleDeleteClient = async (clientId) => {
    try {
      await clientService.delete(clientId);
      toast.success('Client record removed');
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

      // Stage 3: Transition to "Done"
      setRowStages((prev) => ({ ...prev, [clientId]: 'done' }));

      // FinTech Toast Notification
      if (res.previewUrl) {
        toast(
          (t) => (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-ink font-semibold text-xs">
                <Check className="w-4 h-4 text-teal-deep flex-shrink-0" />
                <span>Invoice #{res.invoiceNumber} Dispatched</span>
              </div>
              <p className="text-[11px] text-ink-muted">
                Sent to <strong>{res.recipientEmail}</strong> via sandbox inbox.
              </p>
              <a
                href={res.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => toast.dismiss(t.id)}
                className="inline-flex items-center justify-center space-x-1 px-2.5 py-1 bg-teal-deep hover:bg-teal-hover text-white rounded text-xs font-medium transition-colors"
              >
                <span>View Email Dispatch</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          ),
          {
            duration: 8000,
            style: {
              background: '#FFFFFF',
              border: '1px solid #E2E0D8',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(24, 24, 27, 0.08)',
            },
          }
        );
      } else if (res.emailDispatched) {
        toast.success(
          `Tax Invoice #${res.invoiceNumber} emailed to ${res.recipientEmail}`,
          { duration: 4000 }
        );
      } else {
        // Outbound cloud SMTP restricted on free tier, invoice & counters safely updated
        const pdfUrl = billingService.getPdfPreviewUrl(clientId);
        toast(
          (t) => (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-ink font-semibold text-xs">
                <Check className="w-4 h-4 text-teal-deep flex-shrink-0" />
                <span>Invoice #{res.invoiceNumber} Generated</span>
              </div>
              <p className="text-[11px] text-ink-muted">
                Invoice logged in directory and counters updated.
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => toast.dismiss(t.id)}
                className="inline-flex items-center justify-center space-x-1 px-2.5 py-1 bg-surface hover:bg-hairline text-ink rounded text-xs font-medium border border-hairline transition-colors"
              >
                <span>Inspect PDF Invoice</span>
                <ExternalLink className="w-3 h-3 ml-1 text-ink-muted" />
              </a>
            </div>
          ),
          {
            duration: 7000,
            style: {
              background: '#FFFFFF',
              border: '1px solid #E2E0D8',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(24, 24, 27, 0.08)',
            },
          }
        );
      }

      // Refresh directory numbers to reflect incremented invoices count
      await fetchRegistryData(searchTerm);

      // Reset button stage back to "idle" after 3 seconds
      setTimeout(() => {
        setRowStages((prev) => ({ ...prev, [clientId]: 'idle' }));
      }, 3000);

    } catch (err) {
      console.error('Invoice generation failed:', err);
      setRowStages((prev) => ({ ...prev, [clientId]: 'idle' }));
      toast.error(`Dispatch Failed: ${err.message}`, {
        duration: 4000,
      });
    }
  };

  // Seed sample database with Indian B2B partners
  const handleSeedDemoData = async () => {
    try {
      for (const client of SEED_CLIENTS) {
        await clientService.create(client);
      }
      toast.success('Sample corporate accounts loaded');
      fetchRegistryData();
    } catch (err) {
      toast.error(`Seed error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col font-sans">
      {/* Toast System */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '12.5px',
            borderRadius: '8px',
            border: '1px solid #E2E0D8',
            color: '#18181B',
            background: '#FFFFFF',
            boxShadow: '0 2px 4px 0 rgba(24, 24, 27, 0.06)',
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Summary Analytics Cards */}
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

        {/* Empty state seed prompt */}
        {!isLoading && clients.length === 0 && !searchTerm && (
          <div className="mt-4 p-4 bg-panel border border-hairline rounded-lg flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted gap-3 shadow-subtle">
            <div>
              <span>Quick start: Load sample corporate accounts (Tata Elxsi, Razorpay, Mahindra) into the directory to test billing workflows.</span>
            </div>
            <button
              onClick={handleSeedDemoData}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md bg-teal-deep hover:bg-teal-hover text-white text-xs font-medium transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Load Sample Accounts</span>
            </button>
          </div>
        )}

      </main>

      {/* Corporate Ledger Footer */}
      <footer className="bg-panel border-t border-hairline py-5 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-ink-subtle font-mono gap-2">
          <div>
            <span className="font-semibold text-ink font-sans">Event Risers Corporate Solutions Pvt. Ltd.</span>
            <span className="mx-2">&bull;</span>
            <span>GSTIN: 07AAACE9821F1Z8</span>
            <span className="mx-2">&bull;</span>
            <span>SAC: 998596</span>
          </div>
          <div>
            <span>Corporate Billing &amp; Client Registry &bull; New Delhi &amp; Bengaluru</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
