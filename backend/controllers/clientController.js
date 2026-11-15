import Client from '../models/Client.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * @desc    Fetch all clients and aggregated executive summary analytics
 * @route   GET /api/clients
 * @access  Public
 */
export const getClients = asyncHandler(async (req, res) => {
  const { search } = req.query;

  let query = {};
  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    query = {
      $or: [
        { companyName: searchRegex },
        { contactPerson: searchRegex },
        { email: searchRegex },
        { eventType: searchRegex },
      ],
    };
  }

  const clients = await Client.find(query).sort({ createdAt: -1 });

  // Calculate aggregated analytics across the entire database
  const aggregationResult = await Client.aggregate([
    {
      $group: {
        _id: null,
        totalClients: { $sum: 1 },
        totalInvoicesSent: { $sum: '$invoicesSent' },
        totalContractValuation: { $sum: '$totalCost' },
      },
    },
  ]);

  const analytics = aggregationResult.length > 0
    ? {
        totalClients: aggregationResult[0].totalClients,
        totalInvoicesSent: aggregationResult[0].totalInvoicesSent,
        totalContractValuation: aggregationResult[0].totalContractValuation,
      }
    : {
        totalClients: 0,
        totalInvoicesSent: 0,
        totalContractValuation: 0,
      };

  res.status(200).json({
    success: true,
    count: clients.length,
    analytics,
    clients,
  });
});

/**
 * @desc    Fetch single client by ID
 * @route   GET /api/clients/:id
 * @access  Public
 */
export const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    res.status(404);
    throw new Error(`Client with ID ${req.params.id} was not found.`);
  }

  res.status(200).json({
    success: true,
    client,
  });
});

/**
 * @desc    Register a new corporate client
 * @route   POST /api/clients
 * @access  Public
 */
export const createClient = asyncHandler(async (req, res) => {
  const { companyName, contactPerson, email, eventType, totalCost } = req.body;

  if (!companyName || !contactPerson || !email || !eventType || totalCost === undefined) {
    res.status(400);
    throw new Error('Please provide all mandatory fields: companyName, contactPerson, email, eventType, and totalCost.');
  }

  const numericCost = Number(totalCost);
  if (isNaN(numericCost) || numericCost < 0) {
    res.status(400);
    throw new Error('Total cost must be a valid non-negative number.');
  }

  const client = await Client.create({
    companyName: companyName.trim(),
    contactPerson: contactPerson.trim(),
    email: email.trim().toLowerCase(),
    eventType,
    totalCost: numericCost,
  });

  res.status(201).json({
    success: true,
    message: 'Corporate client registered successfully.',
    client,
  });
});

/**
 * @desc    Update an existing corporate client
 * @route   PUT /api/clients/:id
 * @access  Public
 */
export const updateClient = asyncHandler(async (req, res) => {
  const { companyName, contactPerson, email, eventType, totalCost } = req.body;

  const client = await Client.findById(req.params.id);
  if (!client) {
    res.status(404);
    throw new Error(`Client with ID ${req.params.id} was not found.`);
  }

  if (companyName) client.companyName = companyName.trim();
  if (contactPerson) client.contactPerson = contactPerson.trim();
  if (email) client.email = email.trim().toLowerCase();
  if (eventType) client.eventType = eventType;
  if (totalCost !== undefined) {
    const costNum = Number(totalCost);
    if (isNaN(costNum) || costNum < 0) {
      res.status(400);
      throw new Error('Total cost must be a valid non-negative number.');
    }
    client.totalCost = costNum;
  }

  const updatedClient = await client.save();

  res.status(200).json({
    success: true,
    message: 'Client record updated successfully.',
    client: updatedClient,
  });
});

/**
 * @desc    Delete a corporate client record
 * @route   DELETE /api/clients/:id
 * @access  Public
 */
export const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    res.status(404);
    throw new Error(`Client with ID ${req.params.id} was not found.`);
  }

  await client.deleteOne();

  res.status(200).json({
    success: true,
    message: `Client "${client.companyName}" successfully purged from registry.`,
    deletedId: req.params.id,
  });
});
