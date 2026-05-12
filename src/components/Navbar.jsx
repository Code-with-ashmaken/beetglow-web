import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { STORE_TAGLINE } from '../config/store';
import { useSearch } from '../context/SearchContext';
import { useSiteData } from '../context/SiteDataContext';

function navPillClasses(isActive) {
  return [
    'relative text-neutral-700 font-medium transition-all duration-300 font-sans',
    isActive
      ? 'text-brand font-semibold'
      : 'hover:text-brand after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-brand after:w-0 after:transition-all after:duration-300 hover:after:w-full',
  ].join(' ');
}

export default function Navbar({ cartCount, onCartClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const { settings } = useSiteData();
  const { header } = settings;

  const logoSrc = header.logoImage?.startsWith('http')
    ? header.logoImage
    : `${process.env.PUBLIC_URL || ''}${header.logoImage || '/beetglow-logo.svg'}`;
  const links = header.menuLinks || [];

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/90 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-brand no-underline"
          onClick={() => setMobileOpen(false)}
        >
          {header.logoType === 'text' ? (
            <span className="text-lg font-bold tracking-tight text-brand md:text-xl">
              {header.logoText || 'BeetGlow'}
            </span>
          ) : (
            <img
              src={logoSrc}
              alt={`BeetGlow ${STORE_TAGLINE}`}
              className="h-9 w-auto max-h-9 object-contain md:h-10 md:max-h-10"
              width={216}
              height={42}
              loading="eager"
              decoding="async"
            />
          )}
        </Link>

        <nav className="hidden items-center md:flex" style={{ gap: '30px' }}>
          {links.map((item) => (
            <NavLink
              key={`${item.label}-${item.to}`}
              end={item.to === '/'}
              to={item.to}
              className={({ isActive }) => navPillClasses(isActive)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mx-auto hidden min-w-0 flex-1 max-w-md px-2 md:block md:px-3 lg:px-4">
          <label className="relative block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search skin care..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-neutral-200 bg-brand-beige/30 py-2 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
              autoComplete="off"
              aria-label="Search products"
            />
          </label>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
          <button
            type="button"
            className="rounded-full p-2 text-neutral-700 hover:bg-brand-muted md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <button
            type="button"
            onClick={onCartClick}
            className="relative rounded-full p-2 text-neutral-700 hover:bg-brand-muted"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="h-6 w-6" strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-semibold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 py-4 md:hidden">
          <nav className="mb-4 flex flex-col gap-4">
            {links.map((item) => (
              <Link
                key={`mobile-${item.label}-${item.to}`}
                to={item.to}
                className="text-neutral-700 font-medium transition-colors duration-200 font-sans hover:text-brand hover:underline underline-offset-4"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <label className="relative block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search skin care..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-neutral-200 bg-brand-beige/30 py-2 pl-10 pr-4 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
            />
          </label>
        </div>
      )}
    </header>
  );
}
