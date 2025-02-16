"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Tag,
  DatePicker,
  Button,
  Avatar,
  Modal,
  Popconfirm,
} from "antd";
import { toast } from "react-toastify";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { User, Task, Project } from "@/types/types";
import ProjectModal from "@/components/admin/ProjectModal";
import Link from "next/link";
const { Option } = Select;
const { RangePicker } = DatePicker;
import useAxios from "@/hooks/Axios";
import dayjs from "dayjs";
import { useAuth } from "@/context/AuthContext";
import ProjectDetailsDrawer from "@/components/admin/ProjectDetailsDrawer";
interface ProjectData {
  _id: string;
  name: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed" | "On Hold";
  project_manager: User;
  team: User[];
  tasks: Task[];
  startDate: string;
  endDate: string;
  tags: string[];
  category: "web" | "mobile" | "desktop" | "other";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ProjectsPage: React.FC = () => {
  const axios = useAxios();
  const baseUrl = "http://localhost:5000";
  const { users, user } = useAuth();
  console.log("Users:", user);
  const [searchText, setSearchText] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("");
  const [selectedLead, setSelectedLead] = useState<string | null>("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [projectsData, setProjectsData] = useState<ProjectData[]>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
    setEditingProject(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [editingProject, setEditingProject] = useState<ProjectData | null>(
    null
  );

  const handleEditProject = async (values: any) => {
    try {
      const projectData = {
        ...values,
        _id: editingProject?._id,
        startDate: values.dates[0].toISOString(),
        endDate: values.dates[1].toISOString(),
      };

      const response = editingProject?._id
        ? await axios.put(`/update-project/${editingProject._id}`, projectData)
        : await axios.post("/add-project", projectData);

      toast.success(
        `Project ${editingProject?._id ? "updated" : "added"} successfully.`
      );
      setIsModalVisible(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("Failed to update project.", error?.response?.data?.message);
    }
  };

  const handleEditClick = (project: ProjectData) => {
    setEditingProject(project);
    console.log("Project to edit:", project);
    setIsModalVisible(true);
  };

  const handleDeleteProject = (id: string) => {
    axios
      .delete(`/delete-project/${id}`)
      .then(() =>
        axios.get(
          `/projects?name=${searchText}&team=${selectedTeam}&project_manager=${selectedLead}&category=${selectedCategory}&status=${selectedStatus}&startDate=${dateRange?.[0]}&endDate=${dateRange?.[1]}`
        )
      )
      .then((response) => {
        setProjectsData(response.data?.projects);
        toast.success("Project deleted successfully");
      })
      .catch(() => toast.error("Failed to delete project"));
  };

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const response = await axios.get(
          `/projects?name=${searchText}&team=${selectedTeam}&project_manager=${selectedLead}&category=${selectedCategory}&status=${selectedStatus}&startDate=${dateRange?.[0]}&endDate=${dateRange?.[1]}`
        );
        setProjectsData(response.data?.projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [
    dateRange,
    searchText,
    selectedTeam,
    selectedStatus,
    selectedCategory,
    selectedLead,
  ]);

  const columns: TableColumnsType<Project> = [
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record: Project) => (
        <Link href={`/admin/projects/${record._id}/tasks`}>{name}</Link>
      ),
    },
    {
      title: "Lead",
      dataIndex: "project_manager",
      key: "project_manager",
      render: (project_manager: User) => (
        <Tag color="green">{project_manager?.name}</Tag>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Team",
      dataIndex: "team",
      key: "team",
      render: (team: User[]) => (
        <Avatar.Group max={{ count: 3 }}>
          {team.map((member) => (
            <Avatar
              key={member._id}
              src={`${baseUrl}/${member.profilePicture?.replace(/\\/g, "/")}`}
            />
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Completed" ? "success" : "processing"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Timeline",
      key: "timeline",
      render: (_, record) => (
        <span>{`${new Date(
          record.startDate
        ).toLocaleDateString()} to ${new Date(
          record.endDate
        ).toLocaleDateString()}`}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record as ProjectData)}
          />
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedProject(record as ProjectData);
              setDrawerVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteProject(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
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
        <h1 className="text-2xl font-bold">Projects</h1>
        {user?.role == "admin" && (
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Add Project
          </Button>
        )}
      </div>
      <ProjectDetailsDrawer
        project={selectedProject}
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedProject(null);
        }}
      />
      <ProjectModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingProject(null);
        }}
        onSubmit={handleEditProject}
        initialValues={
          editingProject
            ? {
                ...editingProject,
                dates: [
                  dayjs(editingProject.startDate),
                  dayjs(editingProject.endDate),
                ],
                project_manager: editingProject.project_manager?._id,
                team: editingProject.team?.map((member) => member._id),
              }
            : undefined
        }
        title={editingProject ? "Edit Project" : "Create Project"}
      />
      <div className="grid grid-cols-6 gap-4 mb-4">
        <Input
          placeholder="Search projects"
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
          placeholder="Filter by lead"
          onChange={(value) => setSelectedLead(value)}
          className="w-full"
        >
          {getUserOptions()}
        </Select>
        <Select
          placeholder="Filter by category"
          onChange={(value) => setSelectedCategory(value)}
          className="w-full"
        >
          <Option value="web">Web Development</Option>
          <Option value="mobile">Mobile App</Option>
          <Option value="desktop">Desktop App</Option>
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
      <Table
        columns={columns}
        loading={loading}
        dataSource={projectsData}
        className="shadow-lg"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ProjectsPage;
