import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/wardrobe', label: 'Wardrobe', icon: 'closet' },
  { href: '/outfits', label: 'Outfits', icon: 'outfit' },
  { href: '/profile', label: 'Profile', icon: 'profile' },
];

export const MobileNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-text/95 backdrop-blur-md shadow-lg border-t border-primary/10 pb-safe-area-inset-bottom z-40">
      <div className="flex justify-around items-center h-16">
        {navigationItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              pathname === href ? 'text-primary' : 'text-secondary/70 hover:text-primary/70'
            }`}
          >
            <span className="text-2xl mb-1">
              {icon === 'home' && '🏠'}
              {icon === 'closet' && '👔'}
              {icon === 'outfit' && '✨'}
              {icon === 'profile' && '👤'}
            </span>
            <span className="text-xs font-satisfy tracking-wide">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
