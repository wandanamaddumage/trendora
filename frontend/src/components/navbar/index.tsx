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
import { useLogoutMutation } from '@/store/api/splits/auth'
import { useRouter } from 'next/navigation'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
]

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [logout] = useLogoutMutation()

  const totalItems = useAppSelector(state => state.cart.totalItems)
  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  const isAdmin = user?.role === 'admin'

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      dispatch(signOut())
      router.push('/')
    } catch (error) {
      // Even if logout fails on server, clear local state
      dispatch(signOut())
      router.push('/')
    }
  }

  const isActive = useCallback(
    (path: string) => {
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
        'block px-3 py-2 rounded-md text-sm sm:text-base font-medium transition-colors',
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
      <Button variant="ghost" className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2">
        <User size={18} className="sm:w-5 sm:h-5" />
        <span className="hidden sm:block text-sm">{user?.first_name} {user?.last_name}</span>
      </Button>

      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-white dark:bg-gray-800 z-50">
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
            onClick={handleLogout}
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-1.5 sm:p-2 rounded-lg">
              <span className="text-lg sm:text-xl font-bold">T</span>
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white hidden xs:block">
              Trendora
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map(link => <NavLink key={link.path} {...link} />)}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" className="p-1.5 sm:p-2">
                <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ModeToggle />
            </div>

            {/* User */}
            {isAuthenticated ? (
              <div className="hidden sm:block">
                <UserMenu />
              </div>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2">
                  <span className="hidden xs:inline">Sign In</span>
                  <span className="xs:hidden">Sign In</span>
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="lg:hidden p-1.5 sm:p-2"
            >
              {isMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 dark:bg-gray-800 rounded-lg mx-2 sm:mx-0">
              {/* Mobile Theme Toggle */}
              <div className="sm:hidden px-3 py-2">
                <ModeToggle />
              </div>
              
              {/* Mobile User Menu */}
              {isAuthenticated && (
                <div className="sm:hidden px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <User size={20} />
                    <span className="text-sm font-medium">{user?.first_name} {user?.last_name}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <Link
                      href="/profile"
                      className="block px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full text-left px-2 py-1 text-sm flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Mobile Navigation Links */}
              {navLinks.map(link => (
                <NavLink 
                  key={link.path} 
                  {...link} 
                  onClick={() => setIsMenuOpen(false)} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar