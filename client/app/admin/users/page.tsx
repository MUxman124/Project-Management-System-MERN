"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Switch,
  Space,
  Input,
  Select,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import UserModal from "@/components/admin/UserModal";
import useAxios from "@/hooks/Axios";
import { set } from "react-hook-form";

const { Option } = Select;

interface UserData {
  key: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "project_manager" | "developer" | "tester";
  status: boolean;
}

const UsersPage = () => {
  const axios = useAxios();
  const baseUrl = "http://localhost:5000"; 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);

  const handleStatusToggle = async (key: string, checked: boolean) => {
    try {
      const response = await axios.put(`/update-status/${key}`, {
        isActive: checked,
      });
      if (response.data?.success === false) {
        message.error(response.data?.message);
        return;
      } else {
        message.success("User status updated successfully.");
        setUsers(
          users?.map((user) =>
            user._id == key ? { ...user, isActive: checked } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      message.error("Failed to update user status. Please try again.");
    }
  };

  const handleDelete = (key: string) => {
    setUsers(users.filter((user) => user.key !== key));
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <p className="text-base font-semibold">{name}</p>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Profile Picture",
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: (_: any, record: UserData) => (
        <img
          src={`${baseUrl}/${record?.profilePicture?.replace(/\\/g, "/")}`}
          alt="Profile"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Project Manager", value: "project_manager" },
        { text: "Developer", value: "developer" },
        { text: "Tester", value: "tester" },
      ],
      onFilter: (value: string, record: UserData) => record.role === value,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: UserData) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={isActive}
          onChange={(checked) => handleStatusToggle(record._id, checked)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: UserData) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (!roleFilter || user.role === roleFilter)
  );

  const handleModalSubmit = async (userData: Omit<UserData, "key">) => {
    setLoading(true);
    const formData = new FormData();

    for (const key in userData) {
      if (key === "profilePicture" && userData.profilePicture?.file) {
        // Handle profilePicture upload (assuming it's a single file)
        formData.append(
          "profilePicture",
          userData.profilePicture.fileList[0].originFileObj
        );
      } else {
        // For other fields
        formData.append(key, userData[key as keyof typeof userData] as any);
      }
    }

    try {
      if (editingUser) {
        // Update logic if needed
        message.info("Editing logic not implemented with FormData.");
      } else {
        
        const response = await axios.post("/add-user", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const newUser = {
          ...response.data,
          key: String(users.length + 1),
        };
        setUsers([...users, newUser]);
      }
      setIsModalVisible(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error submitting user data:", error);
      message.error("Failed to save user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/users?searchQuery=${searchText}&role=${roleFilter}`
        );
        setUsers(response.data?.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchText, roleFilter]);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingUser(null);
            setIsModalVisible(true);
          }}
        >
          Add User
        </Button>
      </div>

      <div className="flex gap-4 mb-4 max-w-[400px]">
        <Input
          placeholder="Search users"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filter by role"
          allowClear
          onChange={setRoleFilter}
          style={{ flex: 1 }}
        >
          <Option value="admin">Admin</Option>
          <Option value="project_manager">Project Manager</Option>
          <Option value="developer">Developer</Option>
          <Option value="tester">Tester</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} users`,
        }}
      />

      <UserModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        initialValues={editingUser}
      />
    </div>
  );
};

export default UsersPage;
