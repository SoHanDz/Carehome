import React, { type ReactNode } from "react";
import { ConfigProvider, Layout, theme } from "antd";

const { Header, Content, Footer, Sider } = Layout;

interface AppLayoutProps {
  children: ReactNode; // 👈 định nghĩa type
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
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
      <Layout style={{ minHeight: "100vh" }}>
        <Sider style={{ color: "white"}}>Sider</Sider>
        <Layout>
          <Header style={{ color: "white" }}>Header</Header>
          <Content style={{ margin: "16px" }}>{children}</Content>
          <Footer style={{ textAlign: "center" }}>© Carehome 2025</Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AppLayout;
