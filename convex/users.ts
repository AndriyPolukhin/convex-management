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
