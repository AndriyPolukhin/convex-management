import { v } from 'convex/values'
import { mutation } from './_generated/server'

export const createThumbnail = mutation({
	args: {
		title: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.auth.getUserIdentity()

		if (!user) {
			throw new Error('you must be logged in to create a thumbnail')
		}

		await ctx.db.insert('thumbnails', {
			title: args.title,
			userId: user.subject,
		})
	},
})
