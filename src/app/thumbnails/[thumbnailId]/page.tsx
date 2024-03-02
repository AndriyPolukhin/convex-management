'use client'

import { useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils'
import { shuffle } from 'lodash'
import { Button } from '@/components/ui/button'

export default function ThumbnailPage() {
	const params = useParams<{ thumbnailId: Id<'thumbnails'> }>()
	const thumbnailId = params.thumbnailId

	const thumbnail = useQuery(api.thumbnails.getThumbnail, { thumbnailId })

	if (!thumbnail) {
		return <div>Loading...</div>
	}

	const images = shuffle([thumbnail.aImage, thumbnail.bImage])

	return (
		<div className='mt-16'>
			<div className='grid grid-cols-2 gap-8'>
				<div className='flex items-center flex-col gap-4'>
					<h2 className='text-4xl font-bold text-center mb-4'>Test Image A</h2>

					<Image
						width='600'
						height='600'
						alt='image test a'
						className='w-full'
						src={getImageUrl(images[0])}
					/>

					<Button size='lg' className='w-fit'>
						Vote A
					</Button>
				</div>
				<div className='flex items-center flex-col gap-4'>
					<h2 className='text-4xl font-bold text-center mb-4'>Test Image B</h2>

					<Image
						width='600'
						height='600'
						alt='image test b'
						className='w-full'
						src={getImageUrl(images[1])}
					/>
					<Button size='lg' className='w-fit'>
						Vote B
					</Button>
				</div>
			</div>
		</div>
	)
}
