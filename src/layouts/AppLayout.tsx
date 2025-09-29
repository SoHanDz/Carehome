import React, { type ReactNode, useState, useEffect } from "react";
import { ConfigProvider, Layout, theme } from "antd";
import type { ThemeConfig } from "antd";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import AppRoutes from "../routes/route";

const { Content, Footer } = Layout;

interface AppLayoutProps {
  children: ReactNode;
}
interface AppLayoutProps {
  theme?: ThemeConfig; // Proper TypeScript type for Ant Design theme
}

const AppLayout: React.FC<AppLayoutProps> = () => {
  // State để control sidebar collapse/expand
  const [collapsed, setCollapsed] = useState(false);
  // State để detect mobile view
  const [, setIsMobile] = useState(false);

  // Effect để phát hiện kích thước màn hình và auto collapse trên mobile
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Tự động collapse trên mobile
      if (mobile) {
        setCollapsed(true);
      }
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Function để toggle sidebar
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 8,
          fontSize: 16,
        },
      }}
    >
      <BrowserRouter>
        <Layout style={{ minHeight: "100vh" }}>
          {/* Sidebar */}
          <Sidebar collapsed={collapsed} />

          <Layout>
            {/* Header với burger button */}
            <Header collapsed={collapsed} onToggle={toggleSidebar} />

            {/* Content area */}
            <Content
              style={{
                margin: "16px",
                padding: "16px",
                background: "#fff",
                borderRadius: "8px",
                minHeight: "calc(100vh - 160px)",
              }}
            >
              <AppRoutes />
            </Content>

            {/* Footer */}
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
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default AppLayout;
