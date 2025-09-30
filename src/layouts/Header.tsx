import React from "react";
import { Layout, Button, Avatar, Dropdown, Space, Typography } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";


const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggle }) => {
  // Menu dropdown cho user avatar
  const userMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Thông tin cá nhân',
    },
    {
      key: '2',
      label: 'Cài đặt',
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}
    >
      {/* Left side - Burger button */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onToggle}
          style={{
            fontSize: '16px',
            width: 40,
            height: 40,
            marginRight: '16px'
          }}
        />
      </div>

      {/* Right side - User info */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
        >
          <Space style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: '8px' }}>
            <Avatar
              size="small"
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=BuiNgocLinh"
              icon={<UserOutlined />}
            />
            <Text style={{ color: '#333', fontSize: '14px' }}>
              Bùi Ngọc Linh
            </Text>
          </Space>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;