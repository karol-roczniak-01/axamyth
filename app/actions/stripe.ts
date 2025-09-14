"use server";

import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function fetchClientSecret() {
  const origin = (await headers()).get('origin')

  // Create checkout sessions form body params.
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price: 'price_1RzxJn2K3ab6NXXzRVpWwXvG',
        quantity: 1
      }
    ],
    mode: 'payment',
    return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`
  })

  return session.client_secret
}