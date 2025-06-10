'use client';

import { useGetEmployeesQuery } from '@/services/employee.api';
import { useGetDepartmentsQuery } from '@/services/department.api';
import { useGetLeaveRequestsQuery } from '@/services/leaveRequest.api';
import { useGetPositionsQuery } from '@/services/position.api';

import {
  Card,
  Text,
  Badge,
  Divider,
  Title,
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
} from '@tabler/icons-react';

export default function DashboardPage() {
  const { data: employees = [], isLoading: loadingEmployees } = useGetEmployeesQuery({ limit: 1000 });
  const { data: departments = [], isLoading: loadingDepartments } = useGetDepartmentsQuery();
  const { data: positions = [], isLoading: loadingPositions } = useGetPositionsQuery();
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

  if (isLoading) return <div className="p-6 text-center">Loading dashboard...</div>;

  return (
    <main className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <Title className="text-2xl font-semibold text-gray-800">HRM Dashboard</Title>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        <StatCard icon={<IconUsers size={24} color="#3b82f6" />} label="Employees" value={totalEmployees} />
        <StatCard icon={<IconUserCheck size={24} color="#10b981" />} label="Active" value={activeEmployees} />
        <StatCard icon={<IconBriefcase size={24} color="#8b5cf6" />} label="Departments" value={totalDepartments} />
        <StatCard icon={<IconCalendar size={24} color="#ef4444" />} label="Leaves" value={totalLeaves} />
        <StatCard icon={<IconLayoutList size={24} color="#f97316" />} label="Positions" value={totalPositions} />
        <StatCard icon={<IconUserPlus size={24} color="#06b6d4" />} label="Leave Types" value={leaveTypeCounts.length} />
      </div>

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
