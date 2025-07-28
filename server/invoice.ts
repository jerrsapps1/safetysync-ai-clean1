import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { sendInvoiceEmail } from "./emailer";

dotenv.config();

const router = express.Router();
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-invoice", async (req, res) => {
  const { customerId, items, poNumber, email } = req.body;

  if (!customerId || !items || items.length === 0 || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    for (const item of items) {
      await stripe.invoiceItems.create({
        customer: customerId,
        amount: item.amount,
        currency: "usd",
        description: item.description,
      });
    }

    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: "send_invoice",
      days_until_due: 30,
      automatic_tax: { enabled: true },
      metadata: {
        poNumber: poNumber || "",
      },
    });

    const sentInvoice = await stripe.invoices.sendInvoice(invoice.id!);

    // Email the invoice + W-9 PDF link
    const invoiceUrl = sentInvoice.hosted_invoice_url || `https://invoice.stripe.com/i/acct_${sentInvoice.id}`;
    await sendInvoiceEmail(email, invoiceUrl, { 
      customerName: undefined, 
      invoiceNumber: sentInvoice.number || undefined 
    });

    res.status(200).json({ invoice: sentInvoice });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;