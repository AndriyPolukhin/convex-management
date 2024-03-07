'use client'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import Link from 'next/link'
import { formatDistance } from 'date-fns'
import { SkeletonCard } from '@/components/skeleton-card'

export default function DashboardPage() {
	const thumbnails = useQuery(api.thumbnails.getThumbnailsForUser)

	const sortedThumbnails = [...(thumbnails ?? [])].reverse()
	return (
		<div className='pt-12'>
			<h1>Your Thumbnail Test</h1>

			{thumbnails === undefined && (
				<div className='animate-pulse mb-12 mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
					<SkeletonCard />
					<SkeletonCard />
					<SkeletonCard />
				</div>
			)}

			<div className='mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
				{sortedThumbnails?.map((thumbnail) => {
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
								<p>{thumbnail.title}</p>
								<p>
									{formatDistance(
										new Date(thumbnail._creationTime),
										new Date(),
										{
											addSuffix: true,
										}
									)}
								</p>
								<p>votes: {thumbnail.aVotes + thumbnail.bVotes}</p>
							</CardContent>
							<CardFooter>
								<Button className='w-full' asChild>
									<Link href={`/thumbnails/${thumbnail._id}`}>
										View Results
									</Link>
								</Button>
							</CardFooter>
						</Card>
					)
				})}
			</div>
		</div>
	)
}
