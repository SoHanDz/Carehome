import React from "react";
import { Layout, Menu, Typography, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  BuildOutlined,
  CreditCardOutlined,
  TeamOutlined,
  BarChartOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import logoImage from "../../public/assets/logo_no_name.png";

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Menu items theo cấu trúc trong hình với đúng type
  const menuItems: MenuProps['items'] = [
    {
      key: 'overview',
      label: 'Tổng quan',
      type: 'group' as const,
      children: [
        {
          key: '/dashboard',
          icon: <BarChartOutlined />,
          label: 'Dashboard',
        },
      ],
    },
    {
      key: 'management',
      label: 'Quản lý',
      type: 'group' as const,
      children: [
        {
          key: '/residents',
          icon: <HomeOutlined />,
          label: 'Quản lý Cư dân',
        },
        {
          key: '/rooms',
          icon: <BuildOutlined />,
          label: 'Quản lý Phòng',
        },
        {
          key: '/family',
          icon: <TeamOutlined />,
          label: 'Quản lý Người nhà',
        },
        {
          key: '/payment',
          icon: <CreditCardOutlined />,
          label: 'Quản lý Thanh toán',
        },
        
        {
          key: '/users',
          icon: <UserOutlined />,
          label: 'Quản lý Người dùng',
        },
      ],
    },
  ];

  // Hàm để chuyển tới route đúng khi nhấn vào
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  // Lấy đúng key được chọn từ pathname
  const currentPath = location.pathname;

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      collapsedWidth={80}
      style={{
        background: '#fff',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.06)',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      {/* Logo/Brand */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <Space size="small">
            <img 
              src={logoImage} 
              alt="logo" 
              style={{
                width: 28,
                height: 28,
                objectFit: "contain"
              }}
            />
          {!collapsed && (
            <Text
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1677ff',
                margin: 0,
              }}
            >
              CareHome
            </Text>
          )}
        </Space>
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[currentPath]} // Highlight menu item theo route hiện tại
        defaultSelectedKeys={['resident-mgmt']}
        defaultOpenKeys={['overview', 'management']}
        items={menuItems}
        onClick={handleMenuClick} // Handle navigation
        style={{
          border: 'none',
          height: 'calc(100vh - 120px)',
          overflowY: 'auto',
        }}
        theme="light"
        inlineCollapsed={collapsed}
      />
    </Sider>
  );
};

export default Sidebar;