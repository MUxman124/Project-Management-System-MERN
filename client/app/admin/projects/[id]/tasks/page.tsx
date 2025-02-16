"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Select,
  Input,
  DatePicker,
  Avatar,
  Popconfirm,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import TaskModal from "@/components/admin/TaskModal";
import { useAuth } from "@/context/AuthContext";
import useAxios from "@/hooks/Axios";
import { User, Task } from "@/types/types";
import TaskDetailsDrawer from "@/components/admin/TaskDetailDrawer";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
const { Option } = Select;
const { RangePicker } = DatePicker;

interface TaskData {
  key: string;
  name: string;
  assignee: string;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "In Progress" | "Done";
  dueDate: string;
}

const TasksPage = ({ params }: { params: { id: string } }) => {
  const { users } = useAuth();
  const axios = useAxios();
  const param = useParams();
  const baseUrl = "http://localhost:5000";
  const [searchText, setSearchText] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>("");
  const [selectedLead, setSelectedLead] = useState<string | null>("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskData, setTaskData] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(false);

  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleCommentSubmit = async (comment: string) => {
    // Handle the comment submission
    console.log("New comment:", comment);
  };

  const handleAttachmentUpload = async (file: File) => {
    console.log("Uploading file:", file);
  };

  const handleStatusChange = (
    key: string,
    newStatus: "Todo" | "In Progress" | "Done"
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.key === key ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleAddTask = async (values: TaskData) => {
    let data: { [key: string]: any } = {};
    data = values;
    data.project = params.id;
    try {
      const response = await axios.post(`/add-task`, data);
      console.log(response.data);
      toast.success("Task added successfully.");
    } catch (error) {
      console.error(error);
    }
    setTasks((prevTasks) => [
      ...prevTasks,
      { ...values, key: (prevTasks.length + 1).toString() },
    ]);
    // setIsModalVisible(false);
  };

  const handleDeleteTask = async (key: string) => {
    try {
      await axios.delete(`/delete-task/${key}`);
      fetchTasks();
      setTasks((prevTasks) => prevTasks.filter((task) => task.key !== key));
      toast.success("Task deleted successfully.");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/tasks/${param.id}?name=${searchText}&team=${selectedTeam.join(
          ","
        )}&status=${selectedStatus}&startDate=${dateRange?.[0]}&endDate=${
          dateRange?.[1]
        }`
      );
      console.log(response.data);
      setTasks(response.data?.tasks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [
    params.id,
    dateRange,
    searchText,
    selectedTeam,
    selectedStatus,
    selectedLead,
  ]);

  const columns = [
    {
      title: "Task Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: TaskData) => (
        <a
          onClick={() => {
            setTaskData(record);
            setDrawerVisible(true);
          }}
        >
          {name}
        </a>
      ),
    },
    {
      title: "Assignee",
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
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Tag
          color={
            priority === "High"
              ? "red"
              : priority === "Medium"
              ? "orange"
              : "green"
          }
        >
          {priority}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: TaskData) => (
        <Select
          value={status}
          onChange={(newStatus) => handleStatusChange(record.key, newStatus)}
        >
          <Option value="Todo">Todo</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Done">Done</Option>
        </Select>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: TaskData) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            // onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteTask(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getUserOptions = () => {
    if (!users) return [];
    return users.map((user) => (
      <Option key={user._id} value={user._id}>
        {user.name}
      </Option>
    ));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Project Tasks</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Task
        </Button>
      </div>
      <div className="grid grid-cols-6 gap-4 mb-4">
        <Input
          placeholder="Search tasks..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          mode="multiple"
          placeholder="Filter by team"
          onChange={(value) => setSelectedTeam(value)}
          className="w-full"
        >
          {getUserOptions()}
        </Select>
        <Select
          placeholder="Filter by status"
          onChange={(value) => setSelectedStatus(value)}
          className="w-full"
        >
          <Option value="not_started">Not Started</Option>
          <Option value="in_progress">In Progress</Option>
          <Option value="completed">Completed</Option>
          <Option value="on_hold">On Hold</Option>
        </Select>
        <RangePicker
          className="w-full"
          onChange={(dates) => {
            if (dates) {
              setDateRange([
                dates[0]?.format("YYYY-MM-DD") || "",
                dates[1]?.format("YYYY-MM-DD") || "",
              ]);
            }
          }}
        />
      </div>
      <Table columns={columns} dataSource={tasks} loading={loading} />

      <TaskModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={(values) => {
          handleAddTask(values);
        }}
      />
      <TaskDetailsDrawer
        task={taskData}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onCommentSubmit={handleCommentSubmit}
        onAttachmentUpload={handleAttachmentUpload}
      />
    </div>
  );
};

export default TasksPage;

