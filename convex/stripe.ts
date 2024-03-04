'use node'

import { v } from 'convex/values'
import Stripe from 'stripe'
import { internalAction } from './_generated/server'
import { internal } from './_generated/api'

type Metadata = {
	userId: string
}

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
