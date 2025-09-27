'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const socialLinks = [
  { icon: <Facebook size={20} />, href: '#' },
  { icon: <Twitter size={20} />, href: '#' },
  { icon: <Instagram size={20} />, href: '#' },
]

const FooterLinkGroup = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">{title}</h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                <span className="text-xl font-bold">T</span>
              </div>
              <span className="text-2xl font-bold">Trendora</span>
            </div>
            <p className="text-gray-400">
              Your ultimate destination for trendy products and seamless shopping experience.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, idx) => (
                <a key={idx} href={social.href} className="text-gray-400 hover:text-white transition-colors">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <FooterLinkGroup
            title="Quick Links"
            links={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: 'About Us', href: '#' },
            ]}
          />

          {/* Customer Service */}
          <FooterLinkGroup
            title="Customer Service"
            links={[
              { label: 'Help Center', href: '#' },
              { label: 'Shipping Info', href: '#' },
              { label: 'Returns', href: '#' },
              { label: 'Privacy Policy', href: '#' },
            ]}
          />

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-400" />
                <span className="text-gray-400">support@trendora.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-blue-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-blue-400" />
                <span className="text-gray-400">123 Commerce St, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Subscribe to our newsletter</h3>
              <p className="text-gray-400">Get the latest updates and offers</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Trendora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
