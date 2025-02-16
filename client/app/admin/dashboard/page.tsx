'use client'
import React, { useEffect, useState } from 'react';
import { Card, Badge, Table, Avatar } from 'antd';
import { BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line } from 'recharts';
import { ClockCircleOutlined, UserOutlined, CheckCircleOutlined, ExclamationCircleOutlined, LineChartOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import {Task} from '@/types/types';
import useAxios from '@/hooks/Axios';

 interface DashboardData {
  projects: number;
  tasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  developers: number;
  tasksToShow: Task[];
}

const ProjectDashboard = () => {
  const baseUrl = "http://localhost:5000";
  const  axios = useAxios();
  const [taskData, setTaskData] = useState([]);
  const [dashboardData, setDashboardData] = useState<DashboardData>();

  const fetchDashboardData = async () => {
    try {
      const response =  await axios.get('/dashboard');
      const data = response.data;
      setTaskData(data?.tasksToShow);
      setDashboardData(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const { user } = useAuth();
  // Sample data
  const projectProgress = [
    { name: 'Frontend', completed: 65, total: 100 },
    { name: 'Backend', completed: 80, total: 100 },
    { name: 'Design', completed: 90, total: 100 },
    { name: 'Testing', completed: 45, total: 100 }
  ];

  const timelineData = [
    { month: 'Jan', tasks: 45 },
    { month: 'Feb', tasks: 52 },
    { month: 'Mar', tasks: 38 },
    { month: 'Apr', tasks: 65 },
    { month: 'May', tasks: 48 },
    { month: 'Jun', tasks: 59 }
  ];

  const recentActivities = [
    { user: 'Sarah Chen', action: 'completed task', item: 'Update user authentication', time: '2 hours ago' },
    { user: 'Mike Peters', action: 'commented on', item: 'API Documentation', time: '4 hours ago' },
    { user: 'Lisa Kim', action: 'created task', item: 'Design system update', time: '5 hours ago' }
  ];

  const columns = [
    {
      title: 'Task ID',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <span className="uppercase">{record.name}</span>
      )
    },
    {
      title: 'Title',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: "Team",
      dataIndex: "team",
      key: "team",
      render: (team: User[]) => (
        <Avatar.Group max={{ count: 3 }}>
          {team?.map((member) => (
            <Avatar
              key={member._id}
              src={`${baseUrl}/${member.profilePicture?.replace(/\\/g, "/")}`}
            />
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Completed') color = 'success';
        if (status === 'In Progress') color = 'processing';
        if (status === 'Pending') color = 'warning';
        return <Badge status={color} text={status} />;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const colors = {
          High: 'red',
          Medium: 'orange',
          Low: 'green',
        };
        return <Badge color={colors[priority]} text={priority} />;
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
  ];

  // const taskData = [
  //   {
  //     key: '1',
  //     id: 'TASK-1234',
  //     title: 'Implement User Authentication',
  //     assignee: 'Sarah Chen',
  //     priority: 'High',
  //     status: 'In Progress',
  //     dueDate: '2024-01-15'
  //   },
  //   {
  //     key: '2',
  //     id: 'TASK-1235',
  //     title: 'Design Landing Page',
  //     assignee: 'Mike Peters',
  //     priority: 'Medium',
  //     status: 'Pending',
  //     dueDate: '2024-01-20'
  //   },
  //   {
  //     key: '3',
  //     id: 'TASK-1236',
  //     title: 'API Documentation',
  //     assignee: 'Lisa Kim',
  //     priority: 'Low',
  //     status: 'Completed',
  //     dueDate: '2024-01-10'
  //   },
  //   {
  //     key: '4',
  //     id: 'TASK-1237',
  //     title: 'Database Optimization',
  //     assignee: 'John Doe',
  //     priority: 'High',
  //     status: 'In Progress',
  //     dueDate: '2024-01-18'
  //   }
  // ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Project Dashboard,  Welcome {user?.name}</h1>
        <p className="text-gray-500">Welcome back! Here's your project overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <ClockCircleOutlined className="text-2xl text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Projects</p>
              <h3 className="text-2xl font-bold">{dashboardData?.projects}</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <UserOutlined className="text-2xl text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Team Members</p>
              <h3 className="text-2xl font-bold">{dashboardData?.developers}</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <CheckCircleOutlined className="text-2xl text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Tasks Done</p>
              <h3 className="text-2xl font-bold">{dashboardData?.completedTasks}</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <ExclamationCircleOutlined className="text-2xl text-red-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending Tasks</p>
              <h3 className="text-2xl font-bold">{dashboardData?.overdueTasks}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Project Progress">
          <BarChart width={500} height={300} data={projectProgress}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="#8884d8" />
          </BarChart>
        </Card>

        <Card title="Task Completion Timeline">
          <LineChart width={500} height={300} data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="tasks" stroke="#82ca9d" />
          </LineChart>
        </Card>
      </div>

      {/* Task Details Section */}
      <Card 
        title={
          <span>
            <LineChartOutlined className="mr-2" />
            Task Details
          </span>
        }
        className="mb-8"
      >
        <Table 
          columns={columns} 
          dataSource={taskData} 
          pagination={false}
        />
      </Card>

      {/* Recent Activity */}
      <Card
        title={
          <span>
            <LineChartOutlined className="mr-2" />
            Recent Activity
          </span>
        }
      >
        {recentActivities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg">
            <Avatar>{activity.user[0]}</Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {activity.user} {activity.action} {activity.item}
              </p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default ProjectDashboard;