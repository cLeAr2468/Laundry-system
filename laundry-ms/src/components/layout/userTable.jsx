import React, { use, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Eye, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const UserTable = ({ embedded = false }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/public/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          mode: 'cors'
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Please  login to access this resource');
          }
          throw new Error('Failed to fetch users');
        }

        const results = await response.json();
        console.log('API Response:', results);
        const transformedUsers = results.data.map(user => {
          const rawDate = user.createdAt || user.created_at || user.registrationDate || user.registeredAt || null;
          const parsedDate = rawDate ? new Date(rawDate) : null;
          return {
            id: user.id,
            name: `${user.user_lName}, ${user.user_fName} ${user.user_mName}`,
            email: user.email,
            username: user.username,
            contact: user.contactNum,
            role: user.role || 'user',
            status: user.status || 'active',
            dateRegistered: parsedDate && !isNaN(parsedDate) ? parsedDate.toLocaleDateString() : '—',
            registeredAt: parsedDate && !isNaN(parsedDate) ? parsedDate.getTime() : null,
          };
        });

        console.log('Transformerd users:', transformedUsers);
        setUsers(transformedUsers);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);
  // Sample data array
  // const [accounts, setAccounts] = useState([
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     email: "john.doe@email.com",
  //     username: "johndoe123",
  //     contact: "09123456789",
  //     role: "admin",
  //     status: "active",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Smith",
  //     email: "jane.smith@email.com",
  //     username: "janesmith",
  //     contact: "09187654321",
  //     role: "staff",
  //     status: "active",
  //   },
  //   {
  //     id: 3,
  //     name: "Mike Johnson",
  //     email: "mike.j@email.com",
  //     username: "mikej",
  //     contact: "09198765432",
  //     role: "user",
  //     status: "inactive",
  //   },
  //   {
  //     id: 4,
  //     name: "Sarah Wilson",
  //     email: "sarah.w@email.com",
  //     username: "sarahw",
  //     contact: "09567891234",
  //     role: "staff",
  //     status: "active",
  //   },
  //   {
  //     id: 5,
  //     name: "Alex Brown",
  //     email: "alex.b@email.com",
  //     username: "alexb",
  //     contact: "09234567891",
  //     role: "user",
  //     status: "pending",
  //   }
  // ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    contact: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const nextId = accounts.length
      ? Math.max(...accounts.map((account) => account.id)) + 1
      : 1;

    const newAccount = {
      id: nextId,
      name: formData.name,
      email: formData.email,
      username: formData.username,
      contact: formData.contact,
      role: formData.role || "user",
      status: "active",
    };

    setAccounts((prev) => [...prev, newAccount]);

    setFormData({
      name: "",
      email: "",
      username: "",
      contact: "",
      role: "",
      password: "",
      confirmPassword: "",
    });
    setIsDialogOpen(false);
  };

  const getRoleBadgeColor = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-blue-500 hover:bg-blue-600";
      case "staff":
        return "bg-green-500 hover:bg-green-600";
      case "user":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "inactive":
        return "bg-red-500 hover:bg-red-600";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // Filters
  const [timeRange, setTimeRange] = useState("all"); // all | weekly | monthly | yearly
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive

  const getTimeThreshold = () => {
    const now = Date.now();
    switch (timeRange) {
      case "weekly":
        return now - 7 * 24 * 60 * 60 * 1000;
      case "monthly":
        return now - 30 * 24 * 60 * 60 * 1000;
      case "yearly":
        return now - 365 * 24 * 60 * 60 * 1000;
      default:
        return null;
    }
  };

  const filteredUsers = users.filter((user) => {
    // Status filter
    const statusOk =
      statusFilter === "all" ? true : (user.status || "").toLowerCase() === statusFilter;

    // Time range filter
    if (!statusOk) return false;
    const threshold = getTimeThreshold();
    if (threshold === null) return true;
    if (!user.registeredAt) return false;
    return user.registeredAt >= threshold;
  });

  return (
    <div className={embedded ? "" : "min-h-screen bg-cover bg-center"} style={embedded ? {} : { backgroundImage: "url('/laundry-logo.jpg')" }}>
      <div className={embedded ? "" : "bg-[#A4DCF4] bg-opacity-80 min-h-screen"}>
        {/* Top Bar */}
        {!embedded && (
          <div className="flex justify-between items-center px-4 pt-4">
            <Link to="/dashboard">
              <ArrowLeft className="cursor-pointer text-[#126280] hover:text-[#126280]/80" />
            </Link>
            <div className="text-right text-md md:text-lg font-medium text-[#126280]">
              User Accounts Management
            </div>
          </div>
        )}

        {/* Search and Filters Section */}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 py-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Search by name or email..."
              className="w-full md:w-[300px] bg-gray-300 rounded-full"
            />
            <Button
              className="bg-[#126280] hover:bg-[#126280]/80 rounded-full p-2"
              size="icon"
            >
              <Search className="h-4 w-4 text-white" />
            </Button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white rounded-full px-4 py-2 text-sm text-[#126280] border border-[#126280]/30 w-full md:w-auto"
            >
              <option value="all">All time</option>
              <option value="weekly">This week</option>
              <option value="monthly">This month</option>
              <option value="yearly">This year</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white rounded-full px-4 py-2 text-sm text-[#126280] border border-[#126280]/30 w-full md:w-auto"
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
                      <Button
            className="bg-[#126280] hover:bg-[#126280]/80 p-2 md:w-auto"
            size="icon"
            onClick={() => navigate('/dashboard/register')}
          >
            Add New User
          </Button>
          </div>
        </div>
        

        {/* Table Section */}
        <div className={embedded ? "p-0" : "px-4 pb-6"}>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg">
            <Table className="[&_tbody_tr:hover]:bg-white">
              <TableHeader>
                <TableRow className="bg-[#126280] hover:bg-[#126280]">
                  <TableHead className="text-white font-semibold">Name</TableHead>
                  <TableHead className="text-white font-semibold">Email</TableHead>
                  <TableHead className="text-white font-semibold">Username</TableHead>
                  <TableHead className="text-white font-semibold">Contact</TableHead>
                  <TableHead className="text-white font-semibold">Role</TableHead>
                  <TableHead className="text-white font-semibold">Status</TableHead>
                  <TableHead className="text-white font-semibold">Date Registered</TableHead>
                  <TableHead className="text-white font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-red-500">{error}</TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">No users found</TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="bg-white">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.contact}</TableCell>
                      <TableCell>
                        <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadgeColor(user.status)} text-white`}>
                          {user.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.dateRegistered}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#126280] hover:text-[#126280]/80"
                            aria-label="View user"
                            title="View"
                            onClick={() => navigate(`/dashboard/users/${user.id}`, { state: { user } })}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#126280] hover:text-[#126280]/80"
                            aria-label="Edit user"
                            title="Edit"
                            onClick={() => console.log('Edit user', user.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {isLoading ? (
              <div className="text-center p-4">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">{error}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center p-4">No users found</div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg p-4 shadow-md space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-[#126280]">{user.name}</h3>
                    <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                      {user.role.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-2">
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">Username:</span> {user.username}</p>
                    <p><span className="font-medium">Contact:</span> {user.contact}</p>
                    <p><span className="font-medium">Date Registered:</span> {user.dateRegistered}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Badge className={`${getStatusBadgeColor(user.status)} text-white`}>
                      {user.status.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#126280] hover:text-[#126280]/80"
                        aria-label="View user"
                        title="View"
                        onClick={() => navigate(`/dashboard/users/${user.id}`, { state: { user } })}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#126280] hover:text-[#126280]/80"
                        aria-label="Edit user"
                        title="Edit"
                        onClick={() => console.log('Edit user', user.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;