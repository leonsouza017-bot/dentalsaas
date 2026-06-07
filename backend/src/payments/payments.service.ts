import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
 apiVersion: '2026-05-27.dahlia',
});

@Injectable()
export class PaymentsService {

  // Criar sessão de checkout
  async createCheckoutSession(clinicId: string, clinicEmail: string) {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: clinicEmail,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?payment=cancel`,
      metadata: { clinicId },
    });

    return { url: session.url };
  }

  // Verificar status da assinatura
  async getSubscriptionStatus(clinicId: string) {
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    });

    return {
      clinicId,
      clinicName: clinic?.name,
      plan: 'PRO',
      status: 'active',
    };
  }
}