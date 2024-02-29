'use client'

import { SignInButton, SignOutButton, useSession } from '@clerk/nextjs'

export default function Home() {
	const { isSignedIn } = useSession()

	return (
		<main className=''>
			{isSignedIn ? <SignOutButton /> : <SignInButton />}
		</main>
	)
}
