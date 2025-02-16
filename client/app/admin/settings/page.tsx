'use client'
import React, { useState } from 'react';
import { Layout, Card, Tabs, Form, Input, Button, Switch, Select, Upload, message } from 'antd';
import { UserOutlined, LockOutlined, BellOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';

const { Content } = Layout;
const { TabPane } = Tabs;

const Settings = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [notificationForm] = Form.useForm();

  const handleProfileUpdate = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (values.profilePicture?.[0]?.originFileObj) {
        formData.append('profilePicture', values.profilePicture[0].originFileObj);
      }
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);

      const response = await fetch('http://localhost:5000/api/update-user/' + user?._id, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to change password');
      
      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (error) {
      message.error('Failed to change password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSettings = async (values) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/update-notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Failed to update notification settings');
      
      message.success('Notification settings updated successfully');
    } catch (error) {
      message.error('Failed to update notification settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content className="p-6">
      <Card title="Settings" className="max-w-3xl mx-auto">
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Profile
              </span>
            }
            key="1"
          >
            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleProfileUpdate}
              initialValues={{
                name: user?.name,
                email: user?.email,
                phone: user?.phone,
              }}
            >
              <Form.Item
                name="profilePicture"
                label="Profile Picture"
              >
                <Upload
                  maxCount={1}
                  listType="picture"
                  accept="image/*"
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Upload Photo</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Full Name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input type="email" placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
              >
                <Input placeholder="Phone Number" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <LockOutlined />
                Password
              </span>
            }
            key="2"
          >
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please enter current password' }]}
              >
                <Input.Password placeholder="Current Password" />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter new password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <Input.Password placeholder="New Password" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Passwords do not match');
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BellOutlined />
                Notifications
              </span>
            }
            key="3"
          >
            <Form
              form={notificationForm}
              layout="vertical"
              onFinish={handleNotificationSettings}
              initialValues={{
                emailNotifications: true,
                taskAssignment: true,
                projectUpdates: true,
                comments: true
              }}
            >
              <Form.Item
                name="emailNotifications"
                label="Email Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="taskAssignment"
                label="Task Assignment Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="projectUpdates"
                label="Project Update Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="comments"
                label="Comment Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save Notification Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </Content>
  );
};

export default Settings;