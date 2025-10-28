import React, { useEffect, useState } from "react";
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
import { fetchWithApiKey } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const UserTable = ({ embedded = false }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [usersResponse, adminsResponse] = await Promise.all([
          fetchWithApiKey("/api/auth/users"),
          fetchWithApiKey("/api/auth/admins"),
        ]);

        // No need to check .ok or call .json() since fetchWithApiKey already handles that
        if (!usersResponse.success || !adminsResponse.success) {
          throw new Error("Failed to fetch data");
        }

        // Transform users
        const transformedUsers = usersResponse.data.map((user) => {
          const parsedDate = user.date_registered
            ? new Date(user.date_registered)
            : null;
          return {
            id: user.user_id,
            name: `${user.user_lName}, ${user.user_fName} ${user.user_mName}`,
            email: user.email,
            username: user.username,
            address: user.admin_address,
            contact: user.contactNum,
            role: user.role || "user",
            status: user.status || "active",
            dateRegistered:
              parsedDate && !isNaN(parsedDate)
                ? parsedDate.toLocaleDateString()
                : "—",
            registeredAt:
              parsedDate && !isNaN(parsedDate) ? parsedDate.getTime() : null,
          };
        });

        // Transform admins
        const transformedAdmins = adminsResponse.data.map((admin) => {
          const parsedDate = admin.date_registered
            ? new Date(admin.date_registered)
            : null;
          return {
            id: admin.admin_id,
            name: `${admin.admin_lName}, ${admin.admin_fName} ${admin.admin_mName}`,
            email: admin.email,
            username: admin.admin_username,
            address: admin.admin_address || "—",
            contact: admin.admin_contactNum,
            role: admin.role || "Admin",
            status: admin.status || "Active",
            dateRegistered:
              parsedDate && !isNaN(parsedDate)
                ? parsedDate.toLocaleDateString()
                : "—",
            registeredAt:
              parsedDate && !isNaN(parsedDate) ? parsedDate.getTime() : null,
          };
        });

        // Combine both arrays
        const combinedUsers = [...transformedUsers, ...transformedAdmins];
        console.log("Combined users:", combinedUsers);
        setUsers(combinedUsers);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    try {
      const firstName = e.target.firstName.value.trim();
      const middleName = e.target.middleName.value.trim();
      const lastName = e.target.lastName.value.trim();
      const email = e.target.email.value.trim();
      const username = e.target.username.value.trim();
      const address = e.target.address.value.trim();
      const contact = e.target.contact.value.trim();
      const role = e.target.role.value;
      const status = e.target.status.value;

      // Validate required fields
      if (!firstName || !lastName || !email || !username || !address || !contact) {
        throw new Error("Please fill in all required fields");
      }

      // Construct full name
      const fullName = `${lastName}, ${firstName}${middleName ? ' ' + middleName : ''}`;

      // Determine if this is a user or admin based on role
      const isAdmin = selectedUser.role.toLowerCase() === 'admin';
      const endpoint = isAdmin 
        ? `/api/auth/edit-admin/${selectedUser.id}`
        : `/api/auth/edit-user/${selectedUser.id}`;

      const updatedData = isAdmin ? {
        admin_fName: firstName,
        admin_mName: middleName || "",
        admin_lName: lastName,
        email: email,
        admin_username: username,
        admin_address: address,
        admin_contactNum: contact,
        role: role,
        status: status,
      } : {
        user_fName: firstName,
        user_mName: middleName || "",
        user_lName: lastName,
        email: email,
        username: username,
        cus_address: address,
        contactNum: contact,
        role: role,
        status: status,
      };

      const response = await fetchWithApiKey(endpoint, {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      });

      if (!response.success) {
        throw new Error(response.error || 'Update failed');
      }

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === selectedUser.id
            ? {
                ...user,
                name: fullName,
                email: email,
                username: username,
                address: address,
                contact: contact,
                role: role,
                status: status,
              }
            : user
        )
      );

      setIsDialogOpen(false);
      alert('User updated successfully!');
    } catch (error) {
      console.error("Update error:", error);
      alert(error.message);
    }
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
      statusFilter === "all"
        ? true
        : (user.status || "").toLowerCase() === statusFilter;

    // Time range filter
    if (!statusOk) return false;
    const threshold = getTimeThreshold();
    if (threshold === null) return true;
    if (!user.registeredAt) return false;
    return user.registeredAt >= threshold;
  });

  return (
    <div
      className={embedded ? "" : "min-h-screen bg-cover bg-center"}
      style={embedded ? {} : { backgroundImage: "url('/laundry-logo.jpg')" }}
    >
      <div
        className={embedded ? "" : "bg-[#A4DCF4] bg-opacity-80 min-h-screen"}
      >
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
              placeholder="Search by name or address..."
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
              onClick={() => navigate("/dashboard/register")}
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
                  <TableHead className="text-white font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Address
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Role
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Date Registered
                  </TableHead>
                  <TableHead className="text-white font-semibold text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="bg-white">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${getRoleBadgeColor(
                            user.role
                          )} text-white`}
                        >
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusBadgeColor(
                            user.status
                          )} text-white`}
                        >
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
                            onClick={() =>
                              navigate(`/dashboard/users/${user.id}`, {
                                state: { user },
                              })
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#126280] hover:text-[#126280]/80"
                            aria-label="Edit user"
                            title="Edit"
                            onClick={() => handleEditClick(user)}
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
                    <h3 className="font-semibold text-[#126280]">
                      {user.name}
                    </h3>
                    <Badge
                      className={`${getRoleBadgeColor(user.role)} text-white`}
                    >
                      {user.role.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-2">
                    <p>
                      <span className="font-medium">Address:</span> {user.address}
                    </p>
                    <p>
                      <span className="font-medium">Date Registered:</span>{" "}
                      {user.dateRegistered}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Badge
                      className={`${getStatusBadgeColor(
                        user.status
                      )} text-white`}
                    >
                      {user.status.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#126280] hover:text-[#126280]/80"
                        aria-label="View user"
                        title="View"
                        onClick={() =>
                          navigate(`/dashboard/users/${user.id}`, {
                            state: { user },
                          })
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#126280] hover:text-[#126280]/80"
                        aria-label="Edit user"
                        title="Edit"
                        onClick={() => handleEditClick(user)}
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

        {/* Edit Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[900px] bg-[#D4E9F0]">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-bold text-slate-800">Edit User</DialogTitle>
            </DialogHeader>

            {selectedUser && (
              <form className="space-y-6" onSubmit={handleSaveChanges}>
                {/* Name Fields */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="firstName"
                      defaultValue={selectedUser.name.split(', ')[1]?.split(' ')[0] || ''}
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Middle Name</label>
                    <Input
                      name="middleName"
                      defaultValue={selectedUser.name.split(', ')[1]?.split(' ').slice(1).join(' ') || ''}
                      className="bg-white border-slate-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="lastName"
                      defaultValue={selectedUser.name.split(', ')[0] || ''}
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="username"
                    defaultValue={selectedUser.username}
                    className="bg-white border-slate-300"
                    placeholder="Enter username"
                    required
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      defaultValue={selectedUser.email}
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="contact"
                      defaultValue={selectedUser.contact}
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="address"
                    defaultValue={selectedUser.address}
                    className="bg-white border-slate-300"
                    required
                  />
                </div>

                {/* Role and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      defaultValue={selectedUser.role.toLowerCase()}
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#126280]"
                      required
                    >
                      <option value="customer">CUSTOMER</option>
                      <option value="user">USER</option>
                      <option value="admin">ADMIN</option>
                      <option value="staff">STAFF</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      defaultValue={selectedUser.status.toLowerCase()}
                      className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#126280]"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="px-8 bg-white hover:bg-slate-100"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="px-8 bg-[#3d5a80] hover:bg-[#2d4a70] text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserTable;
