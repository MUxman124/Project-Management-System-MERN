import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
  ApartmentOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import Link from "next/link";

const { Sider } = Layout;

export default function Sidebar({ user }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={(value) => setCollapsed(value)}
      className="min-h-screen bg-gray-900"
    >
      <div className="flex items-center justify-between h-16 bg-gray-800 px-4">
        {!collapsed && <span className="text-xl font-bold text-white">PMS</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:text-blue-500"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      <Menu
        mode="inline"
        theme="dark"
        className="border-r-0 bg-gray-900"
        defaultSelectedKeys={["dashboard"]}
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link href="/admin/dashboard">Dashboard</Link>
        </Menu.Item>

        <Menu.Item key="projects" icon={<ProjectOutlined />}>
          <Link href="/admin/projects">Projects</Link>
        </Menu.Item>

        {/* <Menu.Item key="teams" icon={<TeamOutlined />}>
          <Link href="/admin/teams">Teams</Link>
        </Menu.Item> */}

        <Menu.Item key="tasks" icon={<ApartmentOutlined />}>
          <Link href="/admin/tasks">Tasks</Link>
        </Menu.Item>

        <Menu.Item key="users" icon={<BarChartOutlined />}>
          <Link href="/admin/users">Users</Link>
        </Menu.Item>
{/* 
        <Menu.Item key="timesheet" icon={<ClockCircleOutlined />}>
          <Link href="/admin/timesheet">Timesheet</Link>
        </Menu.Item> */}
      </Menu>
    </Sider>
  );
}