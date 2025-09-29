// Residents.tsx
import { useState, useMemo, useCallback } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  DatePicker,
  Card,
  Grid,
  message,
  Typography,
  Tooltip,
  Descriptions,
  Row,
  Col,
  Empty,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { Search } = Input;
const { confirm } = Modal;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

interface Resident {
  key: string;
  code: string;
  name: string;
  dob: string;
  gender: string;
  room: string;
  admissionDate: string;
  cccd: string;
  phone: string;
}

interface FormValues {
  name: string;
  dob: Dayjs;
  gender: string;
  room: string;
  admissionDate: Dayjs;
  cccd: string;
  phone: string;
}

const initialResidents: Resident[] = [
  {
    key: "1",
    code: "BN00001",
    name: "Đào Quốc Sơn Hàscscscasc",
    dob: "31/10/1960",
    gender: "Nam",
    room: "A02",
    admissionDate: "22/09/2025",
    cccd: "090234151234",
    phone: "0784555666",
  },
  {
    key: "2",
    code: "BN00002",
    name: "Nguyễn Thị Mai",
    dob: "15/05/1965",
    gender: "Nữ",
    room: "A01",
    admissionDate: "10/09/2025",
    cccd: "079234567890",
    phone: "0912345678",
  },
];

const ROOMS = ["A01", "A02", "A03", "B01", "B02", "B03", "C01", "C02", "C03"];
const GENDERS = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
];

function Residents() {
  const [data, setData] = useState<Resident[]>(initialResidents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [viewingResident, setViewingResident] = useState<Resident | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const screens = useBreakpoint();

  const isMobile = !!screens.xs;
  const isTablet = !!screens.sm && !screens.md;

  const generateResidentCode = useCallback(() => {
    const existingCodes = data.map((r) => parseInt(r.code.replace("BN", ""), 10));
    const nextNumber = Math.max(...existingCodes, 0) + 1;
    return `BN${String(nextNumber).padStart(5, "0")}`;
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((resident) => {
      const searchLower = searchText.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        resident.name.toLowerCase().includes(searchLower) ||
        resident.cccd.includes(searchText) ||
        resident.phone.includes(searchText) ||
        resident.code.toLowerCase().includes(searchLower);

      const matchesRoom = !selectedRoom || resident.room === selectedRoom;

      return matchesSearch && matchesRoom;
    });
  }, [data, searchText, selectedRoom]);

  const checkDuplicateInfo = useCallback(
    (cccd: string, phone: string, excludeKey?: string) => {
      return data.some(
        (resident) =>
          resident.key !== excludeKey && (resident.cccd === cccd || resident.phone === phone)
      );
    },
    [data]
  );

  const openAddModal = useCallback(() => {
    setEditingResident(null);
    form.resetFields();
    setIsModalOpen(true);
  }, [form]);

  const openEditModal = useCallback(
    (resident: Resident) => {
      setEditingResident(resident);
      form.setFieldsValue({
        name: resident.name,
        dob: dayjs(resident.dob, "DD/MM/YYYY"),
        gender: resident.gender,
        room: resident.room,
        admissionDate: dayjs(resident.admissionDate, "DD/MM/YYYY"),
        cccd: resident.cccd,
        phone: resident.phone,
      });
      setIsModalOpen(true);
    },
    [form]
  );

  const openViewModal = useCallback((resident: Resident) => {
    setViewingResident(resident);
    setIsViewModalOpen(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setIsViewModalOpen(false);
    setViewingResident(null);
  }, []);

  const confirmDelete = useCallback(
    (resident: Resident) => {
      confirm({
        title: "Xác nhận xóa cư dân",
        icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
        content: (
          <div style={{ marginTop: 8 }}>
            <div style={{ padding: 8, borderRadius: 6, background: "#fafafa" }}>
              <Text strong>{resident.name}</Text>
              <div>
                <Text type="secondary">Mã: {resident.code}</Text> •{" "}
                <Text type="secondary">Phòng: {resident.room}</Text>
              </div>
            </div>
            <div style={{ marginTop: 8, color: "#ff4d4f" }}>
              ⚠️ Hành động này không thể hoàn tác!
            </div>
          </div>
        ),
        okText: "Xác nhận xóa",
        okType: "danger",
        cancelText: "Hủy bỏ",
        width: isMobile ? "90%" : 480,
        onOk() {
          setLoading(true);
          setTimeout(() => {
            setData((prev) => prev.filter((r) => r.key !== resident.key));
            message.success(`Đã xóa cư dân "${resident.name}" thành công!`);
            setLoading(false);
          }, 500);
        },
      });
    },
    [isMobile]
  );

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const isDuplicate = checkDuplicateInfo(values.cccd, values.phone, editingResident?.key);

      if (isDuplicate) {
        const duplicateResident = data.find(
          (r) =>
            r.key !== editingResident?.key &&
            (r.cccd === values.cccd || r.phone === values.phone)
        );

        message.error(
          `${duplicateResident?.cccd === values.cccd ? "CCCD" : "Số điện thoại"} đã tồn tại!`
        );
        setLoading(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 600));

      const residentData = {
        name: values.name.trim(),
        dob: values.dob.format("DD/MM/YYYY"),
        gender: values.gender,
        room: values.room,
        admissionDate: values.admissionDate.format("DD/MM/YYYY"),
        cccd: values.cccd.trim(),
        phone: values.phone.trim(),
      };

      if (editingResident) {
        setData((prev) =>
          prev.map((r) => (r.key === editingResident.key ? { ...r, ...residentData } : r))
        );
        message.success("Cập nhật thông tin cư dân thành công!");
      } else {
        const newResident: Resident = {
          key: `resident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          code: generateResidentCode(),
          ...residentData,
        };
        setData((prev) => [...prev, newResident]);
        message.success("Thêm cư dân mới thành công!");
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingResident(null);
    } catch (error: any) {
      if (error?.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin các trường bắt buộc!");
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
        console.error("Save error:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [form, editingResident, checkDuplicateInfo, data, generateResidentCode]);

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const handleRoomFilter = useCallback((room: string | undefined) => {
    setSelectedRoom(room);
  }, []);

  const handleModalCancel = useCallback(() => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingResident(null);
  }, [form]);

  const columns = [
    {
      title: "Mã cư dân",
      dataIndex: "code",
      key: "code",
      align: "center" as const,
      sorter: (a: Resident, b: Resident) => a.code.localeCompare(b.code),
    },
    {
      title: "Họ tên / Ngày sinh",
      key: "name_dob",
      align: "center" as const,
      render: (_: any, record: Resident) => (
        <div>
          <Tooltip
            title={
              <div>
                <div >
                  <strong>Họ tên:</strong> {record.name}

                </div>
                <div>
                  <strong>Ngày sinh:</strong> {record.dob}
                </div>
              </div>
            }
          >
            <div style={{ fontWeight: 600 }}>{record.name}</div>
            <div style={{ color: "#666", fontSize: 12 }}>{record.dob}</div>
          </Tooltip>
        </div>
      ),
      sorter: (a: Resident, b: Resident) => a.name.localeCompare(b.name),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      align: "center" as const,
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      align: "center" as const,
      sorter: (a: Resident, b: Resident) => a.room.localeCompare(b.room),
    },
    {
      title: "Ngày vào viện",
      dataIndex: "admissionDate",
      key: "admissionDate",
      align: "center" as const,
      sorter: (a: Resident, b: Resident) =>
        dayjs(a.admissionDate, "DD/MM/YYYY").unix() - dayjs(b.admissionDate, "DD/MM/YYYY").unix(),
    },
    {
      title: "CCCD",
      dataIndex: "cccd",
      key: "cccd",
      align: "center" as const,
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      align: "center" as const,
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right" as const,
      align: "center" as const,
      render: (_: any, record: Resident) => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} onClick={() => openViewModal(record)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Button danger type="text" icon={<DeleteOutlined />} onClick={() => confirmDelete(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={[8, 16]}>
        {/* Tiêu đề bên trái */}
        <Col xs={24}>
          <Row justify="space-between">
            <Col xs={24} sm={12} md={10}>
              <Title level={3} style={{ margin: 0, fontSize: isMobile ? 18 : 20 }}>
                Quản lý Cư dân
              </Title>
            </Col>
            <Row>
              {/* Nút thêm cư dân bên phải */}
              <Col xs={24} sm="auto">
                <Button
                  block={isMobile}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={openAddModal}>
                  Thêm Cư dân
                </Button>
              </Col>
            </Row>
          </Row>
        </Col>
        {/* Hàng thứ hai: bộ lọc và tìm kiếm */}
        <Col xs={24} >
          <Row justify="space-between" align="middle" gutter={[8, 8]}>
            <Col xs={24} sm={8} md={6}>
              <Select
                placeholder="Phòng"
                allowClear
                onChange={handleRoomFilter}
                value={selectedRoom}
                options={ROOMS.map((room) => ({ label: `Phòng ${room}`, value: room }))}
                style={{ width: "50%" }}
              />
            </Col>
            <Col xs={24} sm={16} md={8}>
              <Search
                placeholder="Tìm theo Họ tên, CCCD, SĐT"
                onSearch={handleSearch}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                enterButton
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <div style={{ marginTop: 16 }}>
        {!isMobile ? (
          <Table
            rowKey="key"
            columns={columns}
            dataSource={filteredData}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} cư dân`,
              pageSizeOptions: ["10", "20", "50"],
            }}
            size="middle"
            locale={{ emptyText: "Không tìm thấy cư dân nào" }}
            scroll={{ x: 900 }}
            loading={loading}
          />
        ) : (
          <div>
            {filteredData.length > 0 ? (
              <Space direction="vertical" style={{ width: "100%" }}>
                {filteredData.map((resident) => (
                  <Card
                    key={resident.key}
                    size="small"
                    title={
                      <div>
                        <Text strong>{resident.name}</Text>
                        <div style={{ fontSize: 12, color: "#666" }}>
                          {resident.code} — Phòng {resident.room}
                        </div>
                      </div>
                    }
                    actions={[
                      <EyeOutlined key="view" onClick={() => openViewModal(resident)} />,
                      <EditOutlined key="edit" onClick={() => openEditModal(resident)} />,
                      <DeleteOutlined key="delete" onClick={() => confirmDelete(resident)} />,
                    ]}
                  >
                    <Row gutter={[12, 8]}>
                      <Col span={12}>
                        <Text strong>Ngày sinh:</Text>
                        <div>{resident.dob}</div>
                      </Col>
                      <Col span={12}>
                        <Text strong>Giới tính:</Text>
                        <div>{resident.gender}</div>
                      </Col>
                      <Col span={12}>
                        <Text strong>Ngày vào viện:</Text>
                        <div>{resident.admissionDate}</div>
                      </Col>
                      <Col span={12}>
                        <Text strong>CCCD:</Text>
                        <div>{resident.cccd}</div>
                      </Col>
                      <Col span={24} style={{ marginTop: 8 }}>
                        <Text strong>SĐT:</Text> {resident.phone}
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Space>
            ) : (
              <div style={{ padding: 24 }}>
                <Empty description="Không tìm thấy cư dân nào" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      <Modal
        title={
          <span>
            <UserOutlined style={{ marginRight: 8 }} />
            {editingResident ? "Chỉnh sửa thông tin cư dân" : "Thêm cư dân mới"}
          </span>
        }
        open={isModalOpen}
        onCancel={handleModalCancel}
        onOk={handleSave}
        okText={editingResident ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy bỏ"
        width={isMobile ? "100%" : 600}
        style={isMobile ? { top: 8 } : {}}
        confirmLoading={loading}
        maskClosable={false}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập họ tên" },
              { min: 2, message: "Họ tên phải có ít nhất 2 ký tự" },
              { max: 50, message: "Họ tên không được vượt quá 50 ký tự" },
              {
                pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                message: "Họ tên chỉ được chứa chữ cái và khoảng trắng",
              },
            ]}
          >
            <Input placeholder="Nhập họ tên đầy đủ" maxLength={50} showCount />
          </Form.Item>

          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Ngày sinh"
                name="dob"
                rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày sinh"
                  disabledDate={(current) =>
                    current &&
                    (current.isAfter(dayjs()) || current.isBefore(dayjs().subtract(120, "years")))
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Giới tính" name="gender" rules={[{ required: true }]}>
                <Select placeholder="Chọn giới tính" options={GENDERS} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Phòng" name="room" rules={[{ required: true }]}>
            <Select placeholder="Chọn phòng" showSearch options={ROOMS.map((r) => ({ label: `Phòng ${r}`, value: r }))} />
          </Form.Item>

          <Form.Item
            label="Ngày vào viện"
            name="admissionDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày vào viện" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              placeholder="Chọn ngày vào viện"
              disabledDate={(current) => current && current.isAfter(dayjs())}
            />
          </Form.Item>

          <Row gutter={12}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Số CCCD"
                name="cccd"
                rules={[
                  { required: true, message: "Vui lòng nhập số CCCD" },
                  { pattern: /^\d{12}$/, message: "CCCD phải có đúng 12 số" },
                ]}
              >
                <Input placeholder="Nhập 12 số CCCD" maxLength={12} showCount />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại phải có 10-11 chữ số" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" maxLength={11} showCount />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={
          <span>
            <UserOutlined style={{ marginRight: 8 }} />
            Thông tin cư dân
          </span>
        }
        open={isViewModalOpen}
        onCancel={closeViewModal}
        footer={[
          <Button key="close" onClick={closeViewModal}>
            Đóng
          </Button>,
        ]}
        width={isMobile ? "100%" : 600}
        style={isMobile ? { top: 8 } : {}}
        destroyOnClose
      >
        {viewingResident && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã cư dân">{viewingResident.code}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{viewingResident.name}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{viewingResident.dob}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{viewingResident.gender}</Descriptions.Item>
            <Descriptions.Item label="Phòng">{viewingResident.room}</Descriptions.Item>
            <Descriptions.Item label="Ngày vào viện">{viewingResident.admissionDate}</Descriptions.Item>
            <Descriptions.Item label="Số CCCD">{viewingResident.cccd}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{viewingResident.phone}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
export default Residents;
