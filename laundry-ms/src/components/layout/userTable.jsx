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
import { ArrowLeft, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
            
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:3000/api/auth/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token // Add the token
          },
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Handle unauthorized access
            localStorage.clear(); // Clear stored credentials
            navigate('/login'); // Redirect to login
            throw new Error('Please login to access this resource');
          }
          throw new Error('Failed to fetch users');
        }

        const results = await response.json();
        console.log('API Response:', results);
        const transformedUsers = results.data.map(user => ({
          id: user.id,
          name: `${user.user_lName}, ${user.user_fName} ${user.user_mName}`,
          email: user.email,
          username: user.username,
          contact: user.contactNum,
          role: user.role || 'user',
          status: user.status || 'active',
        }));

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

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/laundry-logo.jpg')",
      }}
    >
      <div className="bg-[#A4DCF4] bg-opacity-80 min-h-screen">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-4 pt-4">
          <Link to="/dashboard">
            <ArrowLeft className="cursor-pointer text-[#126280] hover:text-[#126280]/80" />
          </Link>
          <div className="text-right text-md md:text-lg font-medium text-[#126280]">
            User Accounts Management
          </div>
        </div>

        {/* Search and Add Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 py-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Search by name or email..."
              className="w-full md:w-[300px] bg-white rounded-full"
            />
            <Button
              className="bg-[#126280] hover:bg-[#126280]/80 rounded-full p-2"
              size="icon"
            >
              <Search className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="px-4 pb-6">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#126280]">
                  <TableHead className="text-white font-semibold">Name</TableHead>
                  <TableHead className="text-white font-semibold">Email</TableHead>
                  <TableHead className="text-white font-semibold">Username</TableHead>
                  <TableHead className="text-white font-semibold">Contact</TableHead>
                  <TableHead className="text-white font-semibold">Role</TableHead>
                  <TableHead className="text-white font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-red-500">{error}</TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No users found</TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="bg-white transition-colors"
                    >
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
            ) : users.length === 0 ? (
              <div className="text-center p-4">No users found</div>
            ) : (
              users.map((user) => (
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
                  </div>
                  <div className="flex justify-end">
                    <Badge className={`${getStatusBadgeColor(user.status)} text-white`}>
                      {user.status.toUpperCase()}
                    </Badge>
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