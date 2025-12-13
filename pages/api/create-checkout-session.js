import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { templateId } = req.body;
  const template = await prisma.template.findUnique({ where: { id: templateId }});
  if (!template || !template.priceCents) return res.status(400).json({ error: 'Invalid template' });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: template.title },
        unit_amount: template.priceCents
      },
      quantity: 1
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/editor/${templateId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/templates`
  });

  // create purchase record with pending status
  await prisma.purchase.create({
    data: {
      userId: req.body.userId || '', // in production, use authenticated user id
      templateId,
      stripeSessionId: session.id,
      amountCents: template.priceCents,
      status: 'pending'
    }
  });

  res.json({ url: session.url });
}
