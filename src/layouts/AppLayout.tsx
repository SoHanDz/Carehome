import React, { useState, useEffect } from "react";
import { ConfigProvider, Layout, theme } from "antd";
import type { ThemeConfig } from "antd";
import Header from "./Header";
import Sidebar from "./Sidebar";

const { Content, Footer } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
  theme?: ThemeConfig;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 8,
          fontSize: 16,
        },
      }}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar collapsed={collapsed} />
        <Layout>
          <Header collapsed={collapsed} onToggle={toggleSidebar} />
          <Content
            style={{
              margin: "16px",
              padding: "16px",
              background: "#fff",
              borderRadius: "8px",
              minHeight: "calc(100vh - 160px)",
            }}
          >
            {children}
          </Content>
          <Footer
            style={{
              textAlign: "center",
              background: "#fff",
              borderTop: "1px solid #f0f0f0",
              fontSize: "14px",
              color: "#666",
            }}
          >
            © CareHome 2025
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AppLayout;
