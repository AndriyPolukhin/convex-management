'use client'

import * as z from 'zod'
import { useMutation, useQuery } from 'convex/react'
import { Doc } from '../../../../convex/_generated/dataModel'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { api } from '../../../../convex/_generated/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
	text: z.string().min(1).max(500),
})

export function Comments({ thumbnail }: { thumbnail: Doc<'thumbnails'> }) {
	const addComment = useMutation(api.thumbnails.addComment)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			text: '',
		},
	})

	const { toast } = useToast()
	function onSubmit(values: z.infer<typeof formSchema>) {
		addComment({
			text: values.text,
			thumbnailId: thumbnail._id,
		})
			.then(() => {
				toast({
					title: 'Comment Added',
					description: 'Thanks for leaving your feedbacK',
					variant: 'default',
				})
				form.reset()
			})
			.catch(() => {
				toast({
					title: 'Something happened',
					description:
						'We could not leave a commen, try again later. Thanks for leaving your feedback',
					variant: 'destructive',
				})
			})
	}

	return (
		<div>
			<h2 className='my-8 text-4xl font-bold text-center'>Comments</h2>

			<div className='max-w-md mx-auto mb-24'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<FormField
							control={form.control}
							name='text'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Your comment</FormLabel>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormDescription>
										Leave a comment to help the content creator improve their
										thumbnail design
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit'>Post Comment</Button>
					</form>
				</Form>
			</div>

			<div className='space-y-8 mt-12'>
				{thumbnail.comments?.map((comment) => {
					return (
						<div key={`${comment.text}_${comment.createdAt}`}>
							<div className='flex gap-4'>
								<Avatar>
									<AvatarImage src={comment.profileUrl} />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<div>{comment.name}</div>
								<div>{comment.text}</div>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
