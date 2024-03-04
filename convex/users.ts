import { v } from 'convex/values'
import { internalMutation } from './_generated/server'

export const createUser = internalMutation({
	args: { userId: v.string(), email: v.string() },
	handler: async (ctx, args) => {
		await ctx.db.insert('users', {
			userId: args.userId,
			email: args.email,
		})
	},
})

export const setStripeId = internalMutation({
	args: { stripeId: v.string(), userId: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first()

		if (!user) {
			throw new Error('no user found with that user id')
		}

		await ctx.db.patch(user._id, {
			stripeId: args.stripeId,
		})
	},
})
