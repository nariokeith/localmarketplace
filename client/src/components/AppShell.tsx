'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRightOnRectangleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { RouteGuard } from './RouteGuard';

const navigation = [
  { href: '/dashboard', label: 'Dashboard', remix: 'ri-dashboard-line' },
  { href: '/products', label: 'Products', remix: 'ri-shopping-bag-3-line' },
  { href: '/products/new', label: 'Create', remix: 'ri-add-circle-line' },
  { href: '/stats', label: 'Stats', remix: 'ri-bar-chart-box-line' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  const sidebar = (
    <aside className="flex min-h-full w-72 flex-col border-r border-base-300 bg-base-100">
      <div className="border-b border-base-300 p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-box bg-primary font-black text-primary-content">
            LM
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">Local Marketplace</p>
          </div>
        </div>
      </div>

      <nav className="grid gap-2 p-4">
        {navigation.map(item => {
          const active = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} className={`btn justify-start gap-3 ${active ? 'btn-primary' : 'btn-ghost'}`}>
              <i className={`${item.remix} ri text-xl`} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-base-300 p-4">
        <div className="mb-3 rounded-box bg-base-200 p-3">
          <p className="font-bold">{user?.name}</p>
          <p className="truncate text-sm text-neutral/60">{user?.email}</p>
          <div className="badge badge-secondary mt-2">{user?.role}</div>
        </div>
        <button type="button" className="btn btn-outline w-full gap-2" onClick={handleLogout}>
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <RouteGuard>
      <div className="page-shell drawer lg:drawer-open">
        <input id="app-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-base-300 bg-base-100 px-4 lg:hidden">
            <label htmlFor="app-drawer" className="btn btn-square btn-ghost">
              <Bars3Icon className="h-6 w-6" />
            </label>
            <span className="font-bold">Local Marketplace</span>
            <span className="badge badge-secondary">{user?.role}</span>
          </header>
          <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
        <div className="drawer-side z-30">
          <label htmlFor="app-drawer" aria-label="close sidebar" className="drawer-overlay" />
          {sidebar}
        </div>
      </div>
    </RouteGuard>
  );
}
