'use client'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { ModeToggle } from './mode-toggle'
import Link from 'next/link'
import { UpgradeButton } from '@/components/upgrade-button'
import { useIsSubscribed } from '@/hooks/useIsSubscribed'

export function Header() {
	const isSubscribed = useIsSubscribed()

	return (
		<div className='border-b'>
			<div className='h-16 container flex  justify-between items-center'>
				<Link href='/'>Thumbnail Rater</Link>

				<div className='flex gap-8'>
					<SignedIn>
						<Link className='link' href='/dashboard'>
							Dashboard
						</Link>
						<Link className='link' href='/create'>
							Create
						</Link>
						<Link className='link' href='/explore'>
							Explore
						</Link>
					</SignedIn>
					<SignedOut>
						<Link className='link' href='/pricing'>
							Pricing
						</Link>
						<Link className='link' href='/about'>
							About
						</Link>
					</SignedOut>
				</div>

				<div className='flex gap-4 items-center'>
					<SignedIn>
						{!isSubscribed && <UpgradeButton />}
						<UserButton />
					</SignedIn>
					<SignedOut>
						<SignInButton />
					</SignedOut>
					<ModeToggle />
				</div>
			</div>
		</div>
	)
}
