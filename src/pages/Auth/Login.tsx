import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Grid, message } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../../hooks/Auth/authService";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const Login: React.FC = () => {
    const screens = useBreakpoint();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    // ✅ Nếu đã login thì tự động redirect sang dashboard


    const onFinish = (values: any) => {
        setLoading(true);
        const { username, password } = values;

        if (login(username, password)) {
            message.success("Đăng nhập thành công!");
            navigate("/dashboard", { replace: true });
        } else {
            message.error("Sai tài khoản hoặc mật khẩu!");
        }

        setLoading(false);
    };
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f7fa",
                padding: 16,
            }}
        >
            <Card
                style={{
                    width: screens.xs ? "100%" : 350,
                    maxWidth: 400,
                    borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    textAlign: "center",
                }}
            >
                <Title
                    level={3}
                    style={{
                        color: "#4CAF50",
                        marginBottom: 8,
                        fontSize: screens.xs ? 20 : 24,
                    }}
                >
                    CareHome
                </Title>
                <Text type="secondary" style={{ fontSize: screens.xs ? 13 : 14 }}>
                    Đăng nhập vào tài khoản của bạn
                </Text>

                <Form layout="vertical" style={{ marginTop: 24 }} onFinish={onFinish}>
                    <Form.Item
                        label="Tài khoản"
                        name="username"
                        rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
                    >
                        <Input placeholder="Nhập tài khoản" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item >
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{
                                background: "#4CAF50",
                                borderColor: "#4CAF50",
                                borderRadius: 20,
                                height: 40,
                                fontWeight: "bold",
                            }}>
                            Đăng Nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
