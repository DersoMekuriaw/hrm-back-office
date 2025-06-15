'use client';

import { useGetEmployeesQuery } from '@/store/employee.api';
import { useGetDepartmentsQuery } from '@/store/department.api';
import { useGetLeaveRequestsQuery } from '@/store/leaveRequest.api';
import { useGetPositionsQuery } from '@/store/position.api';
import { useState } from 'react';
import {
  Card,
  Text,
  Badge,
  Divider,
  Group,
  Collapse,
  UnstyledButton,
  ThemeIcon,
} from '@mantine/core';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  IconUsers,
  IconBriefcase,
  IconCalendar,
  IconUserCheck,
  IconUserPlus,
  IconLayoutList,
  IconChevronDown,
  IconChevronRight,
  IconFolder,
  IconFolderOpen,
  IconUser,
} from '@tabler/icons-react';

export default function DashboardPage() {
  const { data: employees = [], isLoading: loadingEmployees } = useGetEmployeesQuery({ limit: 1000 });
  const { data: departments = [], isLoading: loadingDepartments } = useGetDepartmentsQuery({});
  const { data: positions = [], isLoading: loadingPositions } = useGetPositionsQuery({});
  const { data: leaveRequests = [], isLoading: loadingLeaves } = useGetLeaveRequestsQuery();

  const isLoading = loadingEmployees || loadingDepartments || loadingPositions || loadingLeaves;

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'active').length;
  const totalDepartments = departments.length;
  const totalPositions = positions.length;
  const totalLeaves = leaveRequests.length;

  const employeeStatusData = [
    { name: 'Active', value: activeEmployees },
    { name: 'Inactive', value: totalEmployees - activeEmployees },
  ];

  const COLORS = ['#3b82f6', '#fcd34d', '#ef4444', '#10b981'];

  const departmentCounts = departments.map((d) => ({
    name: d.name,
    count: employees.filter((e) => e.departmentId === d.id).length,
  }));

  const positionCounts = positions.map((p) => ({
    name: p.title,
    count: employees.filter((e) => e.positionId === p.id).length,
  }));

  const leaveTypeCounts = Array.from(
    leaveRequests.reduce((acc, lr) => {
      acc.set(lr.leaveType, (acc.get(lr.leaveType) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).map(([name, count]) => ({ name, count }));

  const recentLeaves = [...leaveRequests]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5);

  // Build department tree structure
  const buildDepartmentTree = (parentId?: string) => {
    return departments
      .filter((d) => d.parentId === parentId)
      .map((department) => ({
        ...department,
        children: buildDepartmentTree(department.id),
        positions: positions.filter((p) => p.departmentId === department.id),
      }));
  };

  const departmentTree = buildDepartmentTree();

  // Department tree component
  const DepartmentTree = ({ data, level = 0 }: { data: typeof departmentTree; level?: number }) => {
    return (
      <div style={{ marginLeft: level > 0 ? 20 : 0 }}>
        {data.map((item) => (
          <DepartmentTreeNode key={item.id} item={item} level={level} />
        ))}
      </div>
    );
  };

  // Department tree node component
  const DepartmentTreeNode = ({ item, level }: { item: any; level: number }) => {
    const [opened, setOpened] = useState(false);
    const hasChildren = item.children.length > 0 || item.positions.length > 0;
    const employeeCount = employees.filter((e) => e.departmentId === item.id).length;

    return (
      <div>
        <UnstyledButton
          onClick={() => setOpened((o) => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 0',
            width: '100%',
          }}
        >
          {hasChildren && (
            <ThemeIcon variant="light" size={24} mr={10}>
              {opened ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
            </ThemeIcon>
          )}
          {!hasChildren && <div style={{ width: 34 }} />}
          
          <ThemeIcon variant="light" color="blue" size={24} mr={10}>
            {opened ? <IconFolderOpen size={16} /> : <IconFolder size={16} />}
          </ThemeIcon>
          
          <div style={{ flex: 1 }}>
            <Text fw={600}>{item.name}</Text>
            <Text size="xs" c="dimmed">
              {employeeCount} employee{employeeCount !== 1 ? 's' : ''}
            </Text>
          </div>
        </UnstyledButton>

        <Collapse in={opened}>
          {item.positions.length > 0 && (
            <div style={{ marginLeft: 34 }}>
              {item.positions.map((position: any) => {
                const positionEmployees = employees.filter((e) => e.positionId === position.id);
                return (
                  <div
                    key={position.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px 0',
                      marginLeft: 20,
                    }}
                  >
                    <ThemeIcon variant="light" color="teal" size={20} mr={10}>
                      <IconUser size={14} />
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text fw={500}>{position.title}</Text>
                      <Text size="xs" c="dimmed">
                        {positionEmployees.length} employee{positionEmployees.length !== 1 ? 's' : ''}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {item.children.length > 0 && <DepartmentTree data={item.children} level={level + 1} />}
        </Collapse>
      </div>
    );
  };

  if (isLoading) return <div className="p-6 text-center">Loading dashboard...</div>;
  return (
    <main className="space-y-4 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        <StatCard icon={<IconUsers size={24} color="#3b82f6" />} label="Employees" value={totalEmployees} />
        <StatCard icon={<IconUserCheck size={24} color="#10b981" />} label="Active" value={activeEmployees} />
        <StatCard icon={<IconBriefcase size={24} color="#8b5cf6" />} label="Departments" value={totalDepartments} />
        <StatCard icon={<IconCalendar size={24} color="#ef4444" />} label="Leaves" value={totalLeaves} />
        <StatCard icon={<IconLayoutList size={24} color="#f97316" />} label="Positions" value={totalPositions} />
        <StatCard icon={<IconUserPlus size={24} color="#06b6d4" />} label="Leave Types" value={leaveTypeCounts.length} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Employee Status">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={employeeStatusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {employeeStatusData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Employees by Department">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={departmentCounts}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Employees by Position">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={positionCounts}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Leave Requests by Type">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={leaveTypeCounts}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Recent Leave Table */}
          <Card className="p-4 shadow-lg rounded-lg bg-white">
            <Text className="text-sm font-medium text-gray-600">Recent Leave Requests</Text>
            <Divider className="my-2" />
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Employee</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Start</th>
                    <th className="px-4 py-2 text-left">End</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {recentLeaves.map((lr) => {
                    const emp = employees.find((e) => e.id === lr.employeeId);
                    return (
                      <tr key={lr.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{emp ? `${emp.firstName} ${emp.lastName}` : '—'}</td>
                        <td className="px-4 py-2 capitalize">{lr.leaveType}</td>
                        <td className="px-4 py-2">{new Date(lr.startDate).toLocaleDateString()}</td>
                        <td className="px-4 py-2">{new Date(lr.endDate).toLocaleDateString()}</td>
                        <td className="px-4 py-2">
                          <Badge
                            size="xs"
                            variant="filled"
                            color={
                              lr.status === 'approved'
                                ? 'green'
                                : lr.status === 'pending'
                                ? 'yellow'
                                : 'red'
                            }
                            className="capitalize"
                          >
                            {lr.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column - Department Tree */}
        <div className="space-y-6">
          <Card className="p-4 shadow-lg rounded-lg bg-white">
            <Group justify="space-between" mb="md">
              <Text className="text-sm font-medium text-gray-600">Organization Structure</Text>
              <Badge variant="light" color="blue">
                {totalDepartments} Departments
              </Badge>
            </Group>
            <Divider className="my-2" />
            <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
              <DepartmentTree data={departmentTree} />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

// Reusable Components
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 flex items-center space-x-4">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 uppercase">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-4 shadow-lg rounded-lg bg-white">
      <Text className="text-sm font-medium text-gray-600 mb-4">{title}</Text>
      {children}
    </Card>
  );
}