'use client'

import { SignInButton, SignOutButton, useSession } from '@clerk/nextjs'
import { api } from '../../convex/_generated/api'
import { useMutation } from 'convex/react'

export default function Home() {
	const { isSignedIn } = useSession()

	const createThumbnail = useMutation(api.thumbnails.createThumbnail)

	return (
		<main className=''>
			{isSignedIn ? <SignOutButton /> : <SignInButton />}

			{isSignedIn && (
				<form
					onSubmit={async (e) => {
						e.preventDefault()
						const form = e.target as HTMLFormElement
						const formData = new FormData(e.currentTarget)
						const title = formData.get('title') as string
						// Pass to convex mutation
						await createThumbnail({ title })
						form.reset()
					}}
				>
					<label>Title</label>
					<input name='title' className='text-black' /> <button>Create</button>
				</form>
			)}
		</main>
	)
}
