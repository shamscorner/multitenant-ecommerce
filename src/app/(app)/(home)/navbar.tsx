"use client"

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Poppins } from 'next/font/google'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavbarSidebar } from './navbar-sidebar'
import { useState } from 'react'
import { MenuIcon } from 'lucide-react'

const poppins = Poppins({ subsets: ['latin'], weight: ['700'] })

interface NavbarItemProps {
  href: string
  children: React.ReactNode;
  isActive?: boolean;
}

const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
  return (
    <Button asChild variant={isActive ? 'default' : 'neutral'}>
      <Link href={href}>{children}</Link>
    </Button>
  )
}

const navbarItems = [
  { href: '/', children: 'Home' },
  { href: '/about', children: 'About' },
  { href: '/features', children: 'Features' },
  { href: '/pricing', children: 'Pricing' },
  { href: '/contact', children: 'Contact' },
]

export const Navbar = () => {
  const pathName = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <nav className="h-20 flex border-b justify-between font-medium bg-white">
      <Link href="/" className="pl-6 flex items-center">
        <span className={cn('text-3xl xl:text-5xl font-semibold', poppins.className)}>ShamsRoad</span>
      </Link>

      <div className='items-center gap-4 hidden lg:flex'>
        {navbarItems.map((item) => (
          <NavbarItem
            key={item.href}
            href={item.href}
            isActive={pathName === item.href}
          >
            {item.children}
          </NavbarItem>
        ))}
      </div>

      <div className='hidden lg:flex'>
        <Link href="/sign-in" className='flex items-center justify-center border-l border-t-0 border-b-0 border-r-0 px-8 h-full rounded-none bg-white hover:bg-teal-400 transition-colors text-lg'>Log in</Link>
        <Link href="/sign-up" className='flex items-center justify-center border-l border-t-0 border-r-0 px-8 h-full rounded-none bg-black text-white hover:bg-teal-400 hover:text-black transition-colors text-lg'>Start Selling</Link>
      </div>

      <div className='flex lg:hidden items-center justify-center pr-6'>
        <Button variant="neutral" size="icon" onClick={() => setIsSidebarOpen(true)}>
          <MenuIcon />
        </Button>
      </div>

      <NavbarSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        items={navbarItems}
      />
    </nav>
  )
}
