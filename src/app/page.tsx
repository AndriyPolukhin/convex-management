'use client'

import { useSession } from '@clerk/nextjs'
import { api } from '../../convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'

export default function Home() {
	const { isSignedIn } = useSession()

	const createThumbnail = useMutation(api.thumbnails.createThumbnail)
	const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser)

	return <main className=''></main>
}
