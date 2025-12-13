import { buffer } from 'micro';
import Stripe from 'stripe';
import prisma from '../../lib/prisma';
export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);
  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // find purchase by session id and mark completed
    await prisma.purchase.updateMany({
      where: { stripeSessionId: session.id },
      data: { status: 'completed' }
    });
  }

  res.json({ received: true });
}
