"use client";
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Switch, Upload, Divider } from "antd";
import { UserOutlined, LockOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

const { Option } = Select;
const { TextArea } = Input;

interface UserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: UserFormData) => void;
  initialValues: UserData | null;
}

interface UserData {
  key: string;
  name: string;
  email: string;
  role: UserRole;
  status: boolean;
  profileImage?: string;
  department?: string;
  title?: string;
  bio?: string;
  phoneNumber?: string;
  location?: string;
}

type UserRole =
  | "super_admin"
  | "admin"
  | "project_manager"
  | "team_lead"
  | "senior_developer"
  | "developer"
  | "junior_developer"
  | "qa_lead"
  | "qa_engineer"
  | "tester"
  | "business_analyst"
  | "product_owner"
  | "scrum_master"
  | "designer"
  | "user";

interface UserFormData extends Omit<UserData, "key"> {
  password?: string;
  confirmPassword?: string;
}

const departments = [
  "Frontend Engineering",
  "Backend Engineering",
  "Quality Assurance",
  "DevOps",
  "Product Management",
  "UX Design",
  "UI Design",
  "Technical Writing",
  "IT Operations",
  "Customer Support",
];

const UserModal = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}: UserModalProps) => {
  const [form] = Form.useForm<UserFormData>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const isEditMode = !!initialValues;
  console.log("initialValues", initialValues);
  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          password: undefined,
          confirmPassword: undefined,
        });
        if (initialValues.profileImage) {
          setFileList([
            {
              uid: "-1",
              name: "profile-image",
              status: "done",
              url: initialValues.profileImage,
            },
          ]);
        }
      } else {
        form.resetFields();
        setFileList([]);
        form.setFieldsValue({
          status: true,
          role: "developer",
        });
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      console.log("Form values:", values);
      const { confirmPassword, ...submitData } = values;

      // Add profile image URL if exists
      if (fileList.length > 0 && fileList[0].url) {
        submitData.profileImage = fileList[0].url;
      }

      onSubmit(submitData);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const validatePassword = (_: any, value: string) => {
    if (!isEditMode && !value) {
      return Promise.reject("Please enter a password");
    }
    if (value && value.length < 8) {
      return Promise.reject("Password must be at least 8 characters long");
    }
    if (value && !/[A-Z]/.test(value)) {
      return Promise.reject(
        "Password must contain at least one uppercase letter"
      );
    }
    if (value && !/[a-z]/.test(value)) {
      return Promise.reject(
        "Password must contain at least one lowercase letter"
      );
    }
    if (value && !/[0-9]/.test(value)) {
      return Promise.reject("Password must contain at least one number");
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title={initialValues ? "Edit User" : "Add User"}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={initialValues ? "Save" : "Create"}
      width={720}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Divider>Basic Information</Divider>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: "Please enter the name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {!isEditMode && (
            <>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ validator: validatePassword }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter password"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={["password"]}
                rules={[
                  {
                    required: !isEditMode,
                    message: "Please confirm password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Passwords do not match");
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm password"
                />
              </Form.Item>
            </>
          )}
        </div>

        <Divider>Role & Department</Divider>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select role">
              {/* <Option value="super_admin">Super Admin</Option> */}
              <Option value="admin">Admin</Option>
              <Option value="project_manager">Project Manager</Option>
              {/* <Option value="team_lead">Team Lead</Option> */}
              {/* <Option value="senior_developer">Senior Developer</Option> */}
              <Option value="developer">Developer</Option>
              {/* <Option value="junior_developer">Junior Developer</Option> */}
              {/* <Option value="qa_lead">QA Lead</Option> */}
              {/* <Option value="qa_engineer">QA Engineer</Option> */}
              <Option value="tester">Tester</Option>
              {/* <Option value="business_analyst">Business Analyst</Option> */}
              {/* <Option value="product_owner">Product Owner</Option> */}
              {/* <Option value="scrum_master">Scrum Master</Option> */}
              {/* <Option value="designer">Designer</Option> */}
              {/* <Option value="user">User</Option> */}
            </Select>
          </Form.Item>

          <Form.Item name="department" label="Department">
            <Select placeholder="Select department">
              {departments.map((dept) => (
                <Option key={dept} value={dept}>
                  {dept}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Divider>Profile Information</Divider>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="jobTitle" label="Job Title">
            <Input placeholder="Enter job title" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              {
                pattern:
                  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
        </div>

        <Form.Item name="address" label="Address">
          <Input placeholder="Enter location (e.g., City, Country)" />
        </Form.Item>

        <Form.Item name="bio" label="Bio">
          <TextArea
            placeholder="Enter a brief bio"
            rows={4}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item name="profilePicture" label="Profile Image">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={1}
            beforeUpload={() => false}
          >
            <div>
              <UploadOutlined />
              <div className="mt-2">Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item name="isActive" label="Status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
