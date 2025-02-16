import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import { Task, User } from '@/types/types';
import useAxios from '@/hooks/Axios';
import { toast } from 'react-toastify';
import moment from 'moment';
import {useAuth} from '@/context/AuthContext';

const { TextArea } = Input;
const { Option } = Select;

interface TaskModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (task: Partial<Task>) => void;
  initialValues?: Task | null;
  users: User[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const axios = useAxios();
  const {users} = useAuth();
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        dueDate: initialValues.dueDate ? moment(initialValues.dueDate) : null,
        team: initialValues.team?.map((member) => member._id),
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const taskData: Partial<Task> = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      };

      // If editing an existing task, include the ID
      if (initialValues?._id) {
        taskData._id = initialValues._id;
      }

      try {
        const endpoint = initialValues?._id ? `/tasks/${initialValues?._id}` : '/add-task';
        const response = await axios.post(endpoint, taskData);

        if (response.data?.success === false) {
          toast.error(response.data.message || 'Failed to save task');
          return;
        }

        toast.success(initialValues?._id ? 'Task updated successfully' : 'Task created successfully');
        onSubmit(response.data.task);
        onCancel();
      } catch (error) {
        console.error('Error saving task:', error);
        toast.error('Failed to save task');
      }
    } catch (errorInfo) {
      console.log('Validate Failed:', errorInfo);
    }
  };

  return (
    <Modal
      title={initialValues?._id ? 'Edit Task' : 'Create Task'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {initialValues?._id ? 'Update' : 'Create'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="task_modal_form"
        initialValues={{
          status: 'Todo',
          priority: 'Medium',
        }}
      >
        <Form.Item
          name="name"
          label="Task Name"
          rules={[{ required: true, message: 'Please input the task name' }]}
        >
          <Input placeholder="Enter task name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea rows={4} placeholder="Enter task description" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select task status' }]}
        >
          <Select placeholder="Select task status">
            <Option value="Todo">Todo</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Done">Done</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: 'Please select task priority' }]}
        >
          <Select placeholder="Select task priority">
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="team"
          label="Assign Team"
        >
          <Select
            mode="multiple"
            placeholder="Select team members"
          >
            {users?.map((user) => (
              <Option key={user._id} value={user._id}>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="dueDate"
          label="Due Date"
        >
          <DatePicker 
            style={{ width: '100%' }} 
            placeholder="Select due date" 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskModal;
