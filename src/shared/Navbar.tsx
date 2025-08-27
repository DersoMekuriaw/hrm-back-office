'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IconLayoutDashboard,
  IconLogout,
  IconSettings,
  IconSwitchHorizontal,
  IconUsers,
  IconCalendarMinus,
  IconHierarchy,
  IconBuilding
} from '@tabler/icons-react';
import { Burger, Drawer, ScrollArea, Divider, NavLink } from '@mantine/core';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const data = [
  { link: '/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
  { link: '/employees', label: 'Employees', icon: IconUsers },
  { link: '/departments', label: 'Departments', icon: IconBuilding },
  { link: '/positions', label: 'Positions', icon: IconHierarchy },
  { link: '/leaves', label: 'Leaves', icon: IconCalendarMinus },
  { link: '/role-setting', label: 'Role Setting', icon: IconSettings },
  { link: '/archived', label: 'Archived', icon: IconSettings }
];

export function Navbar() {
  const pathname = usePathname();
  const [active, setActive] = useState(() => {
    return data.find(item => pathname?.startsWith(item.link))?.label ?? 'Dashboard';
  });
  const [drawerOpened, setDrawerOpened] = useState(false);

  useEffect(() => {
    const activeItem = data.find(item => pathname?.startsWith(item.link));
    setActive(activeItem?.label ?? 'Dashboard');
  }, [pathname]);

  const links = data.map((item) => (
    <NavLink
      href={item.link}
      key={item.label}
      label={item.label}
      leftSection={<item.icon size="1rem" />}
      active={active === item.label}
      onClick={() => {
        setActive(item.label);
      }}
      component={Link}
      className={`flex items-center gap-3 px-2 py-2 transition-colors font-medium text-gray-900 rounded-md
        ${
          active === item.label
            ? 'bg-white'
            : 'hover:bg-white'
        }`}
    />

  ));

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 min-h-screen  bg-gray-100 border-r border-gray-200 shadow-sm">
        {/* Header-aligned logo bar */}
        <div className="flex items-center justify-center h-16.5 px-4 border-b border-gray-200 shadow-sm bg-white">
          <img
            src="/Rohoboth-solution-tech.png"
            alt="Rohoboth Logo"
            className="h-14 w-auto object-contain "
          />
        </div>

        {/* Links */}
        <div className="flex-1 p-4 space-y-2">{links}</div>

        <Divider className="mx-4" />

        {/* Footer links */}
        <div className="p-4 space-y-2">
          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <IconSwitchHorizontal stroke={1.5} className="w-5 h-5" />
            <span>Change account</span>
          </Link>
          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <IconLogout stroke={1.5} className="w-5 h-5" />
            <span>Logout</span>
          </Link>
        </div>
      </nav>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-center h-16 px-4 border-b border-gray-200 bg-white">
        <Image
          src="/Rohoboth-solution-tech.png"
          alt="Rohoboth Logo"
          width={200}
          height={100}
          className="h-8 w-auto object-contain"
        />
        <Burger opened={drawerOpened} onClick={() => setDrawerOpened(!drawerOpened)} />
      </div>

      {/* Drawer for mobile */}
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="Menu"
        padding="md"
        size="250px"
      >
        <ScrollArea className="h-full">
          <div className="space-y-2">{links}</div>
          <div className="mt-6 space-y-2 border-t pt-4">
            <Link href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-2 py-2 text-gray-700 hover:bg-gray-100">
              <IconSwitchHorizontal stroke={1.5} className="w-5 h-5" />
              <span>Change account</span>
            </Link>
            <Link href="#" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-2 py-2 text-gray-700 hover:bg-gray-100">
              <IconLogout stroke={1.5} className="w-5 h-5" />
              <span>Logout</span>
            </Link>
          </div>
        </ScrollArea>
      </Drawer>
    </>
  );
}
