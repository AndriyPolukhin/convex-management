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

export const updateSubscription = internalMutation({
	args: { subscriptionId: v.string(), userId: v.string(), endsOn: v.number() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query('users')
			.withIndex('by_userId', (q) => q.eq('userId', args.userId))
			.first()

		if (!user) {
			throw new Error('no user found with that user id')
		}

		await ctx.db.patch(user._id, {
			subscriptionId: args.subscriptionId,
			endsOn: args.endsOn,
		})
	},
})

export const updateSubscriptionBySubId = internalMutation({
	args: { subscriptionId: v.string(), endsOn: v.number() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query('users')
			.withIndex('by_subscriptionId', (q) =>
				q.eq('subscriptionId', args.subscriptionId)
			)
			.first()

		if (!user) {
			throw new Error('no user found with that user id')
		}

		await ctx.db.patch(user._id, {
			endsOn: args.endsOn,
		})
	},
})
