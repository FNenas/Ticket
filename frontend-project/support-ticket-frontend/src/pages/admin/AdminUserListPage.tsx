// src/pages/admin/AdminUserListPage.tsx
import React from 'react';
// import { Link } from 'react-router-dom';
// import { getAllUsers } from '../../services/userService'; // Example usage
// import { User } from '../../types/userTypes';

const AdminUserListPage: React.FC = () => {
  // const [users, setUsers] = useState<User[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await getAllUsers(); // Fetch all users
  //       setUsers(data);
  //     } catch (err: any) {
  //       setError(err.response?.data?.message || 'Failed to fetch users.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchUsers();
  // }, []);

  // if (loading) return <p>Loading users...</p>;
  // if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">User Management</h1>
      <p className="text-gray-600">
        This section is under development. Future enhancements will include features to view,
        create, edit, and manage user roles and permissions.
      </p>
      {/*
      Example structure for when implemented:
      <div className="my-4">
        <Link to="/admin/users/new" className="btn-primary">Add New User</Link>
      </div>
      <table className="min-w-full">
        <thead>...</thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>Actions (Edit, Delete)</td>
            </tr>
          ))}
        </tbody>
      </table>
      */}
    </div>
  );
};
export default AdminUserListPage;
