import { SignInButton, SignOutButton, auth } from '@clerk/nextjs'

export default function Home() {
	const { userId } = auth()

	return (
		<main className=''>{userId ? <SignOutButton /> : <SignInButton />}</main>
	)
}
