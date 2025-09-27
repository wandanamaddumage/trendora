'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, User, LogOut, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { signOut } from '@/store/slices/auth'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  
]

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const dispatch = useAppDispatch()

  const totalItems = useAppSelector(state => state.cart.totalItems)
  const { user, isAuthenticated, isAdmin } = useAppSelector(state => state.auth)

  const isActive = useCallback(
    (path: string) => {
      // Select Home as active initially if pathname is "/"
      if (pathname === '/' && path === '/') return true;
      return pathname === path;
    },
    [pathname]
  )

  const NavLink = ({ name, path, onClick }: { name: string; path: string; onClick?: () => void }) => (
    <Link
      href={path}
      onClick={onClick}
      className={cn(
        'block px-3 py-2 rounded-md text-base font-medium transition-colors',
        isActive(path)
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
          : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
      )}
    >
      {name}
    </Link>
  )

  const UserMenu = () => (
    <div className="relative group">
      <Button variant="ghost" className="flex items-center space-x-2 p-2">
        <User size={20} />
        <span className="hidden sm:block">{user?.userName}</span>
      </Button>

      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-white dark:bg-gray-800">
        <div className="py-1">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Profile
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Admin Dashboard
            </Link>
          )}

          <Button
            variant="ghost"
            onClick={() => dispatch(signOut())}
            className="w-full text-left px-4 py-2 text-sm flex items-center space-x-2"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
              <span className="text-xl font-bold">T</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Trendora</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => <NavLink key={link.path} {...link} />)}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ModeToggle />

            {/* Search */}
            <Link href="/search">
              <Button variant="ghost" className="p-2">
                <Search size={20} />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" className="p-2">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* User */}
            {isAuthenticated ? <UserMenu /> : (
              <Link href="/sign-in">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-2">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {navLinks.map(link => <NavLink key={link.path} {...link} onClick={() => setIsMenuOpen(false)} />)}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
