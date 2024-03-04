'use node'

import { v } from 'convex/values'
import Stripe from 'stripe'
import { action, internalAction } from './_generated/server'
import { internal } from './_generated/api'

type Metadata = {
	userId: string
}

export const pay = action({
	args: {},
	handler: async (ctx) => {
		const user = await ctx.auth.getUserIdentity()
		if (!user) {
			throw new Error('you must be logged in to subscribe')
		}

		if (!user.emailVerified) {
			throw new Error('you must have a verified email to subscribe')
		}

		const domain = process.env.HOSTING_URL ?? 'http://localhost:3000'
		const stripe = new Stripe(process.env.STRIPE_KEY!, {
			apiVersion: '2023-10-16',
		})

		const session = await stripe.checkout.sessions.create({
			line_items: [{ price: process.env.PRICE_ID!, quantity: 1 }],
			customer_email: user.email,
			metadata: {
				userId: user.subject,
			},
			mode: 'payment',
			success_url: `${domain}`,
			cancel_url: `${domain}`,
			automatic_tax: { enabled: true },
		})

		return session.url
	},
})

export const fulfill = internalAction({
	args: { signature: v.string(), payload: v.string() },
	handler: async (ctx, args) => {
		const stripe = new Stripe(process.env.STRIPE_KEY!, {
			apiVersion: '2023-10-16',
		})

		const webhookSecret = process.env.STRIPE_WEBHOOKS_SECRET!
		try {
			const event = stripe.webhooks.constructEvent(
				args.payload,
				args.signature,
				webhookSecret
			)

			if (event.type === 'checkout.session.completed') {
				const completedEvent = event.data.object as Stripe.Checkout.Session & {
					metadata: Metadata
				}
				const userId = completedEvent.metadata.userId

				await ctx.runMutation(internal.users.setStripeId, {
					userId,
					stripeId: completedEvent.id,
				})
			}
			return { success: true }
		} catch (error) {
			console.error(error)
			return { success: false, error: (error as { message: string }).message }
		}
	},
})
