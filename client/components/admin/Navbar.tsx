import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Menu, Dropdown, Avatar, Badge, Space, Button } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';

const { Header } = Layout;

const Navbar = () => {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'profile':
        router.push('/admin/profile');
        break;
      case 'settings':
        router.push('/admin/settings');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Space direction="vertical" size={0}>
          <span>{user?.name}</span>
          <span className="text-xs text-gray-500">{user?.email}</span>
        </Space>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const mobileMenu = (
    <Menu mode="inline">
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => router.push('/profile')}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => router.push('/settings')}>
        Settings
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="bg-white border-b px-4 flex items-center justify-between">
      <div className="flex items-center">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden mr-4"
        />
        <h1 className="text-xl font-bold m-0">Project Management System</h1>
      </div>

      <Space size="large" className="hidden md:flex items-center">
        <Badge count={user?.unreadNotifications} offset={[-2, 0]}>
          <Button 
            type="text" 
            icon={<BellOutlined />} 
            onClick={() => router.push('/notifications')}
          />
        </Badge>
        
        <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
          <Space className="cursor-pointer">
            <span className='text-lg font-[500]'>{user?.name}</span>

            <Avatar 
              src={user?.profilePicture}
              icon={!user?.profilePicture && <UserOutlined />}
              alt={user?.name}
            />
          </Space>
        </Dropdown>
      </Space>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden">
          {mobileMenu}
        </div>
      )}
    </Header>
  );
};

export default Navbar;