import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const createThumbnail = mutation({
	args: {
		title: v.string(),
		aImage: v.string(),
		bImage: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.auth.getUserIdentity()

		if (!user) {
			throw new Error('you must be logged in to create a thumbnail')
		}

		return await ctx.db.insert('thumbnails', {
			title: args.title,
			userId: user.subject,
			aImage: args.aImage,
			bImage: args.bImage,
		})
	},
})

export const getThumbnail = query({
	args: { thumbnailId: v.id('thumbnails') },
	handler: async (ctx, args) => {
		const thumbnail = await ctx.db.get(args.thumbnailId)

		if (!thumbnail) {
			return null
		}

		return thumbnail
	},
})

export const getThumbnailsForUser = query({
	args: {},
	handler: async (ctx, args) => {
		const user = await ctx.auth.getUserIdentity()

		if (!user) {
			return []
		}

		return await ctx.db
			.query('thumbnails')
			.filter((q) => q.eq(q.field('userId'), user.subject))
			.collect()
	},
})
