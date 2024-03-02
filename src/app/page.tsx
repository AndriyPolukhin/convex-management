'use client'

import { useSession } from '@clerk/nextjs'
import { api } from '../../convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'

export default function Home() {
	const { isSignedIn } = useSession()

	const createThumbnail = useMutation(api.thumbnails.createThumbnail)
	const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser)

	return (
		<main className=''>
			{isSignedIn && (
				<form
				// onSubmit={async (e) => {
				// 	e.preventDefault()
				// 	const form = e.target as HTMLFormElement
				// 	const formData = new FormData(e.currentTarget)
				// 	const title = formData.get('title') as string
				// 	// Pass to convex mutation
				// 	await createThumbnail({ title })
				// 	form.reset()
				// }}
				>
					<label>Title</label>
					<input name='title' className='text-black' />
					<button>Create</button>
				</form>
			)}

			{thumbnails &&
				thumbnails.map((thumbnail) => {
					return (
						<div key={`${thumbnail.title}-${thumbnail._id}`}>
							{thumbnail.title}
						</div>
					)
				})}
		</main>
	)
}
