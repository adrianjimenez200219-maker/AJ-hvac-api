import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client, Environment } from 'square';
import twilio from 'twilio';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const sqClient = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN
});
const locationId = process.env.SQUARE_LOCATION_ID;

const twClient = twilio(process.env.TWILIO_SID || '', process.env.TWILIO_TOKEN || '');
const twFrom = process.env.TWILIO_FROM || '';

app.get('/health', (_, res) => res.json({ ok: true }));

app.post('/checkout/deposit', async (req, res) => {
  try {
    const { jobId, customerName } = req.body || {};
    const amount = 2900; // $29.00 in cents
    const { result } = await sqClient.checkoutApi.createPaymentLink({
      idempotencyKey: `dep-${jobId}-${Date.now()}`,
      checkoutOptions: { redirectUrl: process.env.REDIRECT_URL || 'https://example.com/thanks' },
      quickPay: {
        name: `AJ HVAC Booking Deposit (${customerName||'Customer'})`,
        priceMoney: { amount, currency: 'USD' },
        locationId
      }
    });
    res.json({ url: result.paymentLink.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Square error creating deposit link' });
  }
});

app.post('/sms/send', async (req, res) => {
  try {
    const { to, body } = req.body;
    if(!twFrom) return res.status(400).json({ error: 'Twilio not configured' });
    const msg = await twClient.messages.create({ to, from: twFrom, body });
    res.json({ sid: msg.sid });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Twilio error sending SMS' });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log('AJ HVAC API running on ' + port));
