'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { href: '/', label: 'Home' },
  { href: '/wardrobe', label: 'Wardrobe' },
  { href: '/outfits', label: 'Outfits' },
  { href: '/profile', label: 'Profile' },
  { href: '/help', label: 'Help' },
];

export const MobileNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#6F4E37] shadow-lg border-t border-[#8B7355] pb-safe-area-inset-bottom z-40">
      <div className="flex justify-between items-center h-16 px-4">
        {navigationItems.map(({ href, label }) => (
          <div key={href} className="flex-1 flex justify-center">
            <Link
              href={href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors font-bold tracking-wider font-['Anton'] uppercase text-sm ${
                pathname === href ? 'text-[#FFE4C4]' : 'text-[#CCB19D] hover:text-[#FFE4C4]'
              }`}
            >
              <span>{label}</span>
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
};
