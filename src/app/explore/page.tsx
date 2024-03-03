'use client'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { usePaginatedQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import Link from 'next/link'
import { formatDistance } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Doc } from '../../../convex/_generated/dataModel'
import { useSession } from '@clerk/nextjs'

export default function ExplorePage() {
	const {
		results: thumbnails,
		status,
		loadMore,
		isLoading,
	} = usePaginatedQuery(
		api.thumbnails.getRecentThumbnails,
		{},
		{ initialNumItems: 10 }
	)

	const session = useSession()
	function hasVoted(thumbnail: Doc<'thumbnails'>) {
		if (!session.session) return false
		return thumbnail.voteIds.includes(session.session?.user.id)
	}
	return (
		<div className='mb-12 mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
			{thumbnails?.map((thumbnail) => {
				return (
					<Card key={thumbnail._id}>
						<CardHeader>
							<Image
								src={getImageUrl(thumbnail.aImage)}
								alt='thumbnail image'
								width='600'
								height='600'
							/>
						</CardHeader>
						<CardContent>
							<div className='flex gap-4 items-center'>
								<Avatar>
									<AvatarImage src={thumbnail.profileImage} />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>

								<p>{thumbnail.title}</p>
							</div>
							<p>
								{formatDistance(new Date(thumbnail._creationTime), new Date(), {
									addSuffix: true,
								})}
							</p>
							<p>votes: {thumbnail.aVotes + thumbnail.bVotes}</p>
						</CardContent>
						<CardFooter>
							<Button
								variant={hasVoted(thumbnail) ? 'outline' : 'default'}
								className='w-full'
								asChild
							>
								<Link href={`/thumbnails/${thumbnail._id}`}>
									{hasVoted(thumbnail) ? 'View Results' : 'Vote'}
								</Link>
							</Button>
						</CardFooter>
					</Card>
				)
			})}

			{status === 'CanLoadMore' && (
				<Button
					className='w-full mb-24'
					onClick={() => {
						loadMore(10)
					}}
				>
					Load More
				</Button>
			)}
		</div>
	)
}