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
  Grid,
  message,
  Typography,
  Tooltip,
  Descriptions,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
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
    name: "Đào Quốc Sơn Hà linh",
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

  // 🔹 Responsive config
  const isMobile = !!screens.xs;
  const ui = {
    padding: isMobile ? 8 : 16,
    titleFontSize: isMobile ? 18 : 20,
    buttonSize: (isMobile ? "small" : "middle") as "small" | "middle",
    inputSize: (isMobile ? "small" : "middle") as "small" | "middle",
    formItemSize: (isMobile ? "large" : "middle") as "large" | "middle",
    tablePageSize: isMobile ? 5 : 10,
    modalWidth: isMobile ? "100%" : 600,
  };

  // 🔹 Generate mã BN
  const generateResidentCode = useCallback(() => {
    const existingCodes = data.map((r) =>
      parseInt(r.code.replace("BN", ""), 10)
    );
    const nextNumber = Math.max(...existingCodes, 0) + 1;
    return `BN${String(nextNumber).padStart(5, "0")}`;
  }, [data]);

  // 🔹 Lọc dữ liệu
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

  // 🔹 Check trùng CCCD/SĐT
  const checkDuplicateInfo = useCallback(
    (cccd: string, phone: string, excludeKey?: string) =>
      data.some(
        (resident) =>
          resident.key !== excludeKey &&
          (resident.cccd === cccd || resident.phone === phone)
      ),
    [data]
  );

  // Modal thêm/sửa
  const openAddModal = () => {
    setEditingResident(null);
    form.resetFields();
    setIsModalOpen(true);
  };
  const openEditModal = (resident: Resident) => {
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
  };

  // Modal xem
  const openViewModal = (resident: Resident) => {
    setViewingResident(resident);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingResident(null);
  };

  // Xóa
  const confirmDelete = (resident: Resident) => {
    confirm({
      title: "Xác nhận xóa cư dân",
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      content: (
        <div style={{ marginTop: 8 }}>
          <Text strong>{resident.name}</Text>
          <div>
            <Text type="secondary">Mã: {resident.code}</Text> •{" "}
            <Text type="secondary">Phòng: {resident.room}</Text>
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
  };

  // Lưu
  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      if (checkDuplicateInfo(values.cccd, values.phone, editingResident?.key)) {
        message.error("CCCD hoặc SĐT đã tồn tại!");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

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
          prev.map((r) =>
            r.key === editingResident.key ? { ...r, ...residentData } : r
          )
        );
        message.success("Cập nhật thành công!");
      } else {
        const newResident: Resident = {
          key: `resident_${Date.now()}`,
          code: generateResidentCode(),
          ...residentData,
        };
        setData((prev) => [...prev, newResident]);
        message.success("Thêm mới thành công!");
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingResident(null);
    } catch (err) {
      message.error("Vui lòng kiểm tra thông tin!");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Table columns (gộp, responsive ellipsis)
  const columns = [
    {
      title: "Mã cư dân",
      dataIndex: "code",
      key: "code",
      align: "center" as const,
      width: 100,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      align: "center" as const,
      render: (name: string) => (
        <Tooltip title={name}>
          <div
            style={{
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: isMobile ? 100 : 200,
            }}
          >
            {name}
          </div>
        </Tooltip>
      ),
    },
    { title: "Ngày sinh", dataIndex: "dob", key: "dob", align: "center" as const },
    { title: "Giới tính", dataIndex: "gender", key: "gender", align: "center" as const },
    { title: "Phòng", dataIndex: "room", key: "room", align: "center" as const },
    { title: "Vào viện", dataIndex: "admissionDate", key: "admissionDate", align: "center" as const },
    { title: "CCCD", dataIndex: "cccd", key: "cccd", align: "center" as const },
    { title: "SĐT", dataIndex: "phone", key: "phone", align: "center" as const },
    {
      title: "Thao tác",
      key: "action",
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
    <div style={{ padding: ui.padding }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ fontSize: ui.titleFontSize }}>
          Quản lý Cư dân
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddModal}
          size={ui.buttonSize}>
          {isMobile ? "Thêm" : "Thêm Cư dân"}
        </Button>
      </div>

      {/* Bộ lọc */}
      <div 
        style={{
          display: "flex",
          justifyContent :"space-between",
          flexDirection: isMobile ? "column" : "row",
          gap: 8,
          marginBottom: 16,
        }}>
        <Select
          placeholder="Chọn phòng"
          allowClear
          onChange={setSelectedRoom}
          value={selectedRoom}
          options={ROOMS.map((room) => ({ label: `Phòng ${room}`, value: room }))}
          style={{ width: isMobile ? "100%" : 200 }}
          size={ui.inputSize}
        />
        <Search
          placeholder="Tìm theo Họ tên, CCCD, SĐT"
          onSearch={setSearchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: isMobile ? "100%" : "40%" }}
          enterButton
          size={ui.inputSize}
        />
      </div>

      {/* Table */}
      <Table
        rowKey="key"
        columns={columns}
        dataSource={filteredData}
        pagination={{
          pageSize: ui.tablePageSize,
          showSizeChanger: !isMobile,
        }}
        size={isMobile ? "small" : "middle"}
        scroll={{ x: isMobile ? "max-content" : 900 }}
        loading={loading}
      />

      {/* Modal thêm/sửa */}
      <Modal
        title={editingResident ? "Chỉnh sửa cư dân" : "Thêm cư dân mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText={editingResident ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy bỏ"
        width={ui.modalWidth}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input size={ui.formItemSize} />
          </Form.Item>
          <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true }]}>
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              size={ui.formItemSize}
            />
          </Form.Item>
          <Form.Item label="Giới tính" name="gender" rules={[{ required: true }]}>
            <Select options={GENDERS} size={ui.formItemSize} />
          </Form.Item>
          <Form.Item label="Phòng" name="room" rules={[{ required: true }]}>
            <Select
              options={ROOMS.map((r) => ({ label: `Phòng ${r}`, value: r }))}
              size={ui.formItemSize}
            />
          </Form.Item>
          <Form.Item
            label="Ngày vào viện"
            name="admissionDate"
            rules={[{ required: true }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              size={ui.formItemSize}
            />
          </Form.Item>
          <Form.Item
            label="CCCD"
            name="cccd"
            rules={[{ required: true, message: "Nhập số CCCD" }]}
          >
            <Input size={ui.formItemSize} />
          </Form.Item>
          <Form.Item
            label="SĐT"
            name="phone"
            rules={[{ required: true, message: "Nhập số điện thoại" }]}
          >
            <Input size={ui.formItemSize} />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Thông tin cư dân"
        open={isViewModalOpen}
        onCancel={closeViewModal}
        footer={<Button onClick={closeViewModal}>Đóng</Button>}
        width={ui.modalWidth}
        destroyOnClose>
        {viewingResident && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Mã">{viewingResident.code}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{viewingResident.name}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">{viewingResident.dob}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{viewingResident.gender}</Descriptions.Item>
            <Descriptions.Item label="Phòng">{viewingResident.room}</Descriptions.Item>
            <Descriptions.Item label="Vào viện">{viewingResident.admissionDate}</Descriptions.Item>
            <Descriptions.Item label="CCCD">{viewingResident.cccd}</Descriptions.Item>
            <Descriptions.Item label="SĐT">{viewingResident.phone}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default Residents;
