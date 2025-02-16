"use client";
import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Dropdown,
  Button,
  Modal,
  Input,
  Avatar,
  Select,
  Badge,
} from "antd";
import type { Task, User } from "@/types/types";
import { getStatusColor } from "@/utils/helpers";
import useAxios from "@/hooks/Axios";
import { toast } from "react-toastify";
import TaskModal from "@/components/admin/TaskModal";

interface TasksPageProps {
  // Add any props if needed
}

const TasksPage: React.FC<TasksPageProps> = () => {
  const axios = useAxios();
  const baseUrl = "http://localhost:5000";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/all-tasks");
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/all-users");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const columns = [
    {
      title: <span style={{ fontWeight: "bold", color: "#1890ff" }}>Name</span>,
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <p className="text-lg font-semibold text-purple-600">{name}</p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Task) => (
        <Select
          value={status}
          onChange={(newStatus) => handleStatusChange(record._id, newStatus)}
        >
          <Option value="Todo">Todo</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Done">Done</Option>
        </Select>
      ),
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
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate: string) =>
        new Date(dueDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Task) => (
        <Space>
          <Button
            onClick={() => handleCommentClick(record)}
            className="text-blue-600 hover:text-blue-800"
          >
            Comment
          </Button>
          <Button
            onClick={() => handleEditTask(record)}
            className="text-green-600 hover:text-green-800"
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const handleStatusChange = async (
    taskId: string | undefined,
    newStatus: string
  ) => {
    if (!taskId) return;

    try {
      const response = await axios.post('/update-task', { 
        _id: taskId, 
        status: newStatus 
      });

      if (response.data?.success === false) {
        toast.error(response.data.message || 'Failed to update task status');
        return;
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      toast.success('Task status updated successfully');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleCommentClick = (task: Task) => {
    setCurrentTask(task);
    setCommentModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setTaskModalVisible(true);
  };

  const handleTaskSubmit = (updatedTask: Partial<Task>) => {
    // Update tasks list with the updated or new task
    setTasks((prevTasks) => {
      if (updatedTask?._id) {
        // Update existing task
        return prevTasks.map((task) => 
          task._id === updatedTask._id ? { ...task, ...updatedTask } : task
        );
      } else {
        // Add new task
        return [...prevTasks, updatedTask as Task];
      }
    });
  };

  const handleCommentSubmit = async () => {
    if (!currentTask || !newComment) return;

    try {
      const response = await axios.post(`/add-comment`, {
        id: currentTask._id,
        text: newComment,
      });
      if (response.data?.success === false) {
        console.error("Failed to add comment:", response.data?.message);
        return;
      }
      toast.success("Comment added successfully.");
    } catch (error) {
      console.error("Failed to add comment:", error);
      return;
    }

    setCommentModalVisible(false);
    setNewComment("");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button 
          type="primary" 
          onClick={() => {
            setCurrentTask(null);
            setTaskModalVisible(true);
          }}
        >
          Create Task
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tasks}
        loading={loading}
        rowKey="_id"
        className="bg-white rounded-lg shadow"
      />

      <Modal
        title="Add Comment"
        open={commentModalVisible}
        onOk={handleCommentSubmit}
        onCancel={() => setCommentModalVisible(false)}
      >
        <Input.TextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
          placeholder="Type your comment here..."
        />
      </Modal>

      <TaskModal
        visible={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        onSubmit={handleTaskSubmit}
        initialValues={currentTask}
      />
    </div>
  );
};

export default TasksPage;
