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
  Badge,
  Progress,
  Timeline,
  Typography 
} from 'antd';
import { 
  UserOutlined, 
  PaperClipOutlined,
  SendOutlined,
  UploadOutlined
} from '@ant-design/icons';

// Import types if they're not already imported
interface ProjectData {
  _id: string;
  name: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed" | "On Hold";
  project_manager: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  team: {
    _id: string;
    name: string;
    profilePicture?: string;
  }[];
  tasks: Task[];
  startDate: string;
  endDate: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface Task {
  _id: string;
  status: string;
  // Add other task properties as needed
}

const { Title, Text } = Typography;
const baseUrl = "http://localhost:5000"; // Or your actual base URL

const ProjectDetailsDrawer: React.FC<{
  project: ProjectData | null;
  visible: boolean;
  onClose: () => void;
}> = ({ project, visible, onClose }) => {
  if (!project) return null;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Not Started': 'default',
      'In Progress': '#1890ff',
      'Completed': '#52c41a',
      'On Hold': '#faad14'
    };
    return colors[status] || '#000';
  };

  const calculateProgress = (tasks: Task[]) => {
    if (!tasks.length) return 0;
    const completed = tasks.filter(task => task.status === 'Completed').length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <Drawer
      title={<Title level={4}>{project.name}</Title>}
      width={720}
      open={visible}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose}>Close</Button>
        </Space>
      }
    >
      <div className="space-y-8">
        {/* Project Overview */}
        <div>
          <Title level={5}>Project Overview</Title>
          <Descriptions column={2}>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(project.status)}>{project.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              <Tag color="blue">{project.category}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Start Date">
              {new Date(project.startDate).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="End Date">
              {new Date(project.endDate).toLocaleDateString()}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Project Progress */}
        <div>
          <Title level={5}>Progress</Title>
          <Progress 
            percent={calculateProgress(project.tasks)} 
            status="active"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </div>

        {/* Project Description */}
        <div>
          <Title level={5}>Description</Title>
          <Text>{project.description}</Text>
        </div>

        {/* Team Members */}
        <div>
          <Title level={5}>Team</Title>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Text strong>Project Manager:</Text>
              <Avatar 
                src={project.project_manager?.profilePicture ? 
                  `${baseUrl}/${project.project_manager.profilePicture.replace(/\\/g, "/")}` : 
                  undefined
                }
                icon={!project.project_manager?.profilePicture && <UserOutlined />}
              />
              <Text>{project.project_manager?.name}</Text>
            </div>
            <div>
              <Text strong>Team Members:</Text>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.team.map(member => (
                  <div key={member._id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                    <Avatar 
                      src={member.profilePicture ? 
                        `${baseUrl}/${member.profilePicture.replace(/\\/g, "/")}` : 
                        undefined
                      }
                      icon={!member.profilePicture && <UserOutlined />}
                    />
                    <Text>{member.name}</Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Summary */}
        <div>
          <Title level={5}>Tasks Summary</Title>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <Text strong>Total Tasks</Text>
              <div className="text-2xl">{project.tasks.length}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <Text strong>Completed</Text>
              <div className="text-2xl">
                {project.tasks.filter(task => task.status === 'Completed').length}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <Text strong>In Progress</Text>
              <div className="text-2xl">
                {project.tasks.filter(task => task.status === 'In Progress').length}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <Text strong>Pending</Text>
              <div className="text-2xl">
                {project.tasks.filter(task => task.status === 'Not Started').length}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div>
            <Title level={5}>Tags</Title>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <Tag key={tag} color="processing">{tag}</Tag>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div>
          <Title level={5}>Timeline</Title>
          <Timeline>
            <Timeline.Item>Project Created: {new Date(project.createdAt).toLocaleString()}</Timeline.Item>
            <Timeline.Item>Project Started: {new Date(project.startDate).toLocaleString()}</Timeline.Item>
            <Timeline.Item>Last Updated: {new Date(project.updatedAt).toLocaleString()}</Timeline.Item>
            <Timeline.Item>Expected Completion: {new Date(project.endDate).toLocaleString()}</Timeline.Item>
          </Timeline>
        </div>
      </div>
    </Drawer>
  );
};

export default ProjectDetailsDrawer;