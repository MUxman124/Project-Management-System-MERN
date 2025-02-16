import React, { useState } from 'react';
import { 
  Drawer, 
  Descriptions, 
  Tag, 
  List, 
  Avatar, 
  Form, 
  Input, 
  Button,
  Space,
  Divider,
  Upload,
  Badge 
} from 'antd';
import { 
  UserOutlined, 
  PaperClipOutlined,
  SendOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';
import { Task } from '@/types/types';
import type { UploadFile } from 'antd/es/upload/interface';

interface TaskDetailsDrawerProps {
  task: Task;
  visible: boolean;
  onClose: () => void;
  onCommentSubmit: (comment: string) => void | Promise<void>;
  onAttachmentUpload: (file: File) => Promise<void>;
}

interface CommentFormValues {
  comment: string;
}

const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({ 
  task, 
  visible, 
  onClose,
  onCommentSubmit,
  onAttachmentUpload 
}) => {
  const [form] = Form.useForm<CommentFormValues>();
  const [uploading, setUploading] = useState<boolean>(false);

  const priorityColors: Record<string, string> = {
    High: 'red',
    Medium: 'orange',
    Low: 'green'
  };

  const statusColors: Record<string, "default" | "processing" | "success"> = {
    not_started: 'default',
    in_progress: 'processing',
    completed: 'success'
  };

  const handleCommentSubmit = (values: CommentFormValues): void => {
    onCommentSubmit(values.comment);
    form.resetFields();
  };

  const handleAttachmentUpload = async (file: File): Promise<void> => {
    try {
      setUploading(true);
      await onAttachmentUpload(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Drawer
      title="Task Details"
      placement="right"
      width={640}
      onClose={onClose}
      open={visible}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Task Basic Info */}
        <Descriptions column={2}>
          <Descriptions.Item label="Name" span={2}>
            {task?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            {task?.description}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Badge 
              status={statusColors[task?.status]} 
              text={task?.status.replace('_', ' ')} 
            />
          </Descriptions.Item>
          <Descriptions.Item label="Priority">
            <Tag color={priorityColors[task?.priority]}>{task?.priority}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Due Date">
            {/* {format(new Date(task?.dueDate), 'MMM dd, yyyy')} */}
          </Descriptions.Item>
        </Descriptions>

        {/* Project Info */}
        {/* <div>
          <h3>Project Details</h3>
          <Descriptions column={2}>
            <Descriptions.Item label="Project Name" span={2}>
              {task.project.name}
            </Descriptions.Item>
            <Descriptions.Item label="Project Status">
              {task.project.status}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {task.project.category}
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {format(new Date(task.project.startDate), 'MMM dd, yyyy')} - {format(new Date(task.project.endDate), 'MMM dd, yyyy')}
            </Descriptions.Item>
          </Descriptions>
        </div> */}

        {/* Team Members */}
        <div>
          <h3>Team Members</h3>
          <List
            itemLayout="horizontal"
            dataSource={task?.team}
            renderItem={member => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    member?.profilePicture ? 
                    <Avatar src={member?.profilePicture} /> : 
                    <Avatar icon={<UserOutlined />} />
                  }
                  title={member?.name}
                  description={member?.isActive ? 'Active' : 'Inactive'}
                />
              </List.Item>
            )}
          />
        </div>

        {/* Attachments */}
        <div>
          <h3>Attachments</h3>
          <List
            itemLayout="horizontal"
            dataSource={task?.attachments}
            renderItem={attachment => (
              <List.Item>
                <List.Item.Meta
                  avatar={<PaperClipOutlined />}
                  title={attachment?.name}
                  description={format(new Date(attachment?.uploadDate), 'MMM dd, yyyy')}
                />
                <a href={attachment?.url}>Download</a>
              </List.Item>
            )}
          />
          <Upload
            customRequest={({ file }) => {
              if (file instanceof File) {
                handleAttachmentUpload(file);
              }
            }}
            showUploadList={false}
          >
            <Button 
              icon={<UploadOutlined />} 
              loading={uploading}
            >
              Add Attachment
            </Button>
          </Upload>
        </div>

        <Divider />

        {/* Comments Section */}
        <div>
          <h3>Comments</h3>
          <List
            itemLayout="horizontal"
            dataSource={task?.comments}
            renderItem={comment => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    comment?.user?.profilePicture ? 
                    <Avatar src={comment?.user?.profilePicture} /> : 
                    <Avatar icon={<UserOutlined />} />
                  }
                  title={comment?.user?.name}
                  description={
                    <Space direction="vertical">
                      <span>{comment?.text}</span>
                      {/* <small>{format(new Date(comment?.createdAt), 'MMM dd, yyyy HH:mm')}</small> */}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
          
          <Form<CommentFormValues>
            form={form}
            onFinish={handleCommentSubmit}
          >
            <Form.Item 
              name="comment" 
              rules={[{ required: true, message: 'Please enter a comment' }]}
            >
              <Input.TextArea 
                placeholder="Add a comment..." 
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SendOutlined />}
              >
                Add Comment
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Space>
    </Drawer>
  );
};

export default TaskDetailsDrawer;