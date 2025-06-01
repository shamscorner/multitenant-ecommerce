"use client";

import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { NavbarSidebar } from './navbar-sidebar';

const poppins = Poppins({ subsets: ['latin'], weight: ['700'] });

interface NavbarItemProps {
  children: React.ReactNode;
  href: string
  isActive?: boolean;
}

const NavbarItem = ({ children, href, isActive }: NavbarItemProps) => {
  return (
    <Button asChild variant={isActive ? 'default' : 'neutral'}>
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const navbarItems = [
  { children: 'Home', href: '/' },
  { children: 'About', href: '/about' },
  { children: 'Features', href: '/features' },
  { children: 'Pricing', href: '/pricing' },
  { children: 'Contact', href: '/contact' },
];

export const Navbar = () => {
  const pathName = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <nav className="h-20 flex border-b justify-between font-medium bg-white">
      <Link className="pl-6 flex items-center" href="/">
        <span className={cn('text-3xl xl:text-5xl font-semibold', poppins.className)}>ShamsRoad</span>
      </Link>

      <div className='items-center gap-4 hidden lg:flex'>
        {navbarItems.map((item) => (
          <NavbarItem
            href={item.href}
            isActive={pathName === item.href}
            key={item.href}
          >
            {item.children}
          </NavbarItem>
        ))}
      </div>

      <div className='hidden lg:flex'>
        <Link className='flex items-center justify-center border-l border-t-0 border-b-0 border-r-0 px-8 h-full rounded-none bg-white hover:bg-teal-400 transition-colors text-lg' href="/sign-in" prefetch>Log in</Link>
        <Link className='flex items-center justify-center border-l border-t-0 border-r-0 px-8 h-full rounded-none bg-black text-white hover:bg-teal-400 hover:text-black transition-colors text-lg' href="/sign-up" prefetch>Start Selling</Link>
      </div>

      <div className='flex lg:hidden items-center justify-center pr-6'>
        <Button onClick={() => setIsSidebarOpen(true)} size="icon" variant="neutral">
          <MenuIcon />
        </Button>
      </div>

      <NavbarSidebar
        items={navbarItems}
        onOpenChange={setIsSidebarOpen}
        open={isSidebarOpen}
      />
    </nav>
  );
};
