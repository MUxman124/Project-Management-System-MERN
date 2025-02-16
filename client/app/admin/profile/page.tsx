'use client'
import React, { useState } from 'react';
import { Layout, Card, Row, Col, Avatar, Typography, Statistic, Tabs, List, Tag, Spin } from 'antd';
import { 
  UserOutlined, 
  ProjectOutlined, 
  CheckCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  CalendarOutlined 
} from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

interface Task {
  _id: string;
  title: string;
  status: string;
  dueDate: string;
}

interface Project {
  _id: string;
  name: string;
  status: string;
  role: string;
}

const Profile: React.FC = () => {
  const { user, token } = useAuth();
  console.log(user, "user is profile");
  const [recentTasks, setRecentTasks] = useState<Task[]>([
    { _id: '1', title: 'Design homepage', status: 'Completed', dueDate: '2023-12-31' },
    { _id: '2', title: 'Fix login bug', status: 'In-Progress', dueDate: '2024-01-15' },
    { _id: '3', title: 'Update user profile', status: 'Pending', dueDate: '2024-02-01' },
  ]);
  const [projects, setProjects] = useState<Project[]>([
    { _id: '1', name: 'Project Alpha', status: 'Active', role: 'Developer' },
    { _id: '2', name: 'Project Beta', status: 'Inactive', role: 'Team Lead' },
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  // React.useEffect(() => {
  //   const fetchProfileData = async () => {
  //     setLoading(true);
  //     try {
  //       const [tasksRes, projectsRes] = await Promise.all([
  //         fetch('http://localhost:5000/api/tasks/recent', {
  //           headers: { Authorization: `Bearer ${token}` }
  //         }),
  //         fetch('http://localhost:5000/api/projects/user', {
  //           headers: { Authorization: `Bearer ${token}` }
  //         })
  //       ]);

  //       const [tasksData, projectsData] = await Promise.all([
  //         tasksRes.json(),
  //         projectsRes.json()
  //       ]);

  //       setRecentTasks(tasksData.tasks || []);
  //       setProjects(projectsData.projects || []);
  //     } catch (error) {
  //       console.error('Error fetching profile data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (token) {
  //     fetchProfileData();
  //   }
  // }, [token]);

  if (!user) {
    return <Spin size="large" className="flex justify-center items-center min-h-screen" />;
  }

  const getStatusColor = (status: string): string => {
    const colors = {
      completed: 'green',
      'in-progress': 'blue',
      pending: 'orange',
      active: 'green',
      inactive: 'red',
    };
    return colors[status.toLowerCase()] || 'default';
  };

  return (
    <Content className="p-6">
      <Row gutter={[24, 24]}>
        {/* Profile Overview Card */}
        <Col xs={24} xl={8}>
          <Card>
            <div className="text-center mb-6">
              <Avatar 
                size={120} 
                src={user.profilePicture}
                icon={!user.profilePicture && <UserOutlined />}
                className="mb-4"
              />
              <Title level={3}>{user.name}</Title>
              <Tag color="blue">{user.role}</Tag>
            </div>

            <List itemLayout="horizontal">
              <List.Item>
                <List.Item.Meta
                  avatar={<MailOutlined />}
                  title="Email"
                  description={user.email}
                />
              </List.Item>
              
              {user.phone && (
                <List.Item>
                  <List.Item.Meta
                    avatar={<PhoneOutlined />}
                    title="Phone"
                    description={user.phone}
                  />
                </List.Item>
              )}
              
              {user.department && (
                <List.Item>
                  <List.Item.Meta
                    avatar={<TeamOutlined />}
                    title="Department"
                    description={user.department}
                  />
                </List.Item>
              )}
              
              <List.Item>
                <List.Item.Meta
                  avatar={<CalendarOutlined />}
                  title="Joined"
                  description={new Date(user.joinedAt).toLocaleDateString()}
                />
              </List.Item>
            </List>
          </Card>

          {/* Statistics Card */}
          <Card className="mt-6">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic 
                  title="Tasks Completed"
                  value={user.tasksCompleted || 0}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Projects Involved"
                  value={user.projectsInvolved || 0}
                  prefix={<ProjectOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Activity Tabs */}
        <Col xs={24} xl={16}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane 
                tab={<span><CheckCircleOutlined />Recent Tasks</span>}
                key="1"
              >
                {loading ? (
                  <div className="text-center py-4">
                    <Spin />
                  </div>
                ) : (
                  <List
                    dataSource={recentTasks}
                    renderItem={(task) => (
                      <List.Item
                        extra={<Tag color={getStatusColor(task.status)}>{task.status}</Tag>}
                      >
                        <List.Item.Meta
                          title={task.title}
                          description={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                        />
                      </List.Item>
                    )}
                  />
                )}
              </TabPane>

              <TabPane 
                tab={<span><ProjectOutlined />Projects</span>}
                key="2"
              >
                {loading ? (
                  <div className="text-center py-4">
                    <Spin />
                  </div>
                ) : (
                  <List
                    dataSource={projects}
                    renderItem={(project) => (
                      <List.Item
                        extra={<Tag color={getStatusColor(project.status)}>{project.status}</Tag>}
                      >
                        <List.Item.Meta
                          title={project.name}
                          description={`Role: ${project.role}`}
                        />
                      </List.Item>
                    )}
                  />
                )}
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default Profile;
