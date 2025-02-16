import React from "react";
import { Modal, Form, Input, Select, DatePicker, Button } from "antd";
import type { FormInstance } from "antd/es/form";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAuth } from "@/context/AuthContext";
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Add Quill modules configuration
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

// Add QuillWrapper component
const QuillWrapper: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <ReactQuill
      theme="snow"
      value={value || ""}
      onChange={onChange}
      modules={modules}
      className="h-36 mb-6"
    />
  );
};

interface ProjectModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
  title?: string;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  title = "Create Project",
}) => {
  const [form] = Form.useForm();
  const { users } = useAuth();

  // Add form watch for description
  const description = Form.useWatch("description", form);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const getUserOptions = () => {
    if (!users) return [];
    return users.map((user) => (
      <Option key={user._id} value={user._id}>
        {user.name}
      </Option>
    ));
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
      width={720}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Project Name"
          rules={[{ required: true, message: "Please enter project name" }]}
        >
          <Input placeholder="Enter project name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <QuillWrapper/>
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="project_manager"
            label="Project Manager"
            rules={[{ required: true, message: "Please select project lead" }]}
          >
            <Select placeholder="Select project lead">
              {getUserOptions()}
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select placeholder="Select category">
              <Option value="web">Web Development</Option>
              <Option value="mobile">Mobile App</Option>
              <Option value="desktop">Desktop App</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="team"
            label="Team Members"
            rules={[{ required: true, message: "Please select team members" }]}
          >
            <Select mode="multiple" placeholder="Select team members">
              {getUserOptions()}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Option value="not_started">Not Started</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="completed">Completed</Option>
              <Option value="on_hold">On Hold</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="dates"
          label="Project Timeline"
          rules={[
            { required: true, message: "Please select project timeline" },
          ]}
        >
          <RangePicker className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProjectModal;
