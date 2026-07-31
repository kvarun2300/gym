const express = require('express');
const router = express.Router();

const invoiceController = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { ROLES } = require('../config/constants');

router.use(protect);

router.get('/my-invoices', authorize(ROLES.MEMBER), invoiceController.getMyInvoices);
router.get('/', authorize(ROLES.ADMIN), invoiceController.getInvoices);
router.get('/:id/pdf', invoiceController.downloadInvoicePdf); // ownership checked in controller

module.exports = router;
