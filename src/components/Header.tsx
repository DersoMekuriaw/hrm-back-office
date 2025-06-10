'use client';

import {
  Burger,
  Group,
  Menu,
  Text,
  UnstyledButton,
  ActionIcon,
  Avatar,
  Divider,
} from '@mantine/core';
import {
  IconChevronDown,
  IconBell,
  IconSettings,
} from '@tabler/icons-react';

export function Header({
  onBurgerClick,
  opened,
}: {
  onBurgerClick: () => void;
  opened: boolean;
}) {
  const roles = ['Administrator', 'HR Manager', 'Payroll Officer'];
  const currentUser = 'Admin User';
  const currentRole = 'Administrator';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6">
        {/* Left section - Burger + Logo */}
        <Group className="flex items-center space-x-4">
          <Burger
            opened={opened}
            onClick={onBurgerClick}
            hiddenFrom="md"
            size="sm"
            className="text-gray-900 hover:text-gray-900"
          />
          <Text fw={600} className="text-lg text-blue-700 tracking-wide">
            HRM System
          </Text>
        </Group>

        {/* Right section - Actions */}
        <Group className="flex items-center space-x-4">
          {/* Notification */}
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            radius="xl"
            className="relative hover:bg-gray-100"
          >
            <IconBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          </ActionIcon>

          {/* Settings */}
          <ActionIcon variant="subtle" color="gray" size="lg" radius="xl">
            <IconSettings size={20} className="text-gray-500" />
          </ActionIcon>

          {/* Profile Dropdown */}
          <Menu shadow="md" width={240} position="bottom-end" withArrow>
            <Menu.Target>
              <UnstyledButton className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-gray-100 transition">
                <Avatar
                  src=""
                  size={32}
                  radius="xl"
                  alt="Profile"
                />
                <div className="flex flex-col items-start text-left">
                  <Text size="sm" fw={600} className="text-gray-900 leading-none">
                    {currentUser}
                  </Text>
                  <Text size="xs" className="text-gray-500">
                    {currentRole}
                  </Text>
                </div>
                <IconChevronDown size={16} className="text-gray-500" />
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Switch Role</Menu.Label>
              {roles
                .filter((r) => r !== currentRole)
                .map((role, index) => (
                  <Menu.Item  key={index}>
                    {role}
                  </Menu.Item>
                ))}

              <Divider my="xs" />

              <Menu.Item >Profile</Menu.Item>
              <Menu.Item >Settings</Menu.Item>
              <Menu.Item  color="red">
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </header>
  );
}
