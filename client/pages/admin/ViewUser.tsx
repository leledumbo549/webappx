import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '@/lib/axios';
import type { User } from '@/server/schema';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';

function ViewUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await axios.get<User>(`/api/admin/users/${id}`);
      setUser(res.data);
    } catch (err) {
      console.error('Failed to load user:', err);
      setError('Failed to load user details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleToggleBan = async () => {
    if (!user) return;

    try {
      await axios.patch(`/api/admin/users/${user.id}`, { action: 'toggleBan' });
      await fetchUser(); // Refresh the user data
    } catch (err) {
      console.error('Failed to toggle user ban status:', err);
      setError('Failed to update user status');
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return <div>User not found.</div>;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'seller':
        return 'bg-blue-100 text-blue-800';
      case 'buyer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/users')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {user.name}
                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className={`rounded-full ${getRoleBadgeClass(user.role || 'buyer')}`}
                  >
                    {user.role}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`rounded-full ${getStatusBadgeClass(user.status || 'inactive')}`}
                  >
                    {user.status}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">User ID:</span> {user.id}
                </div>
                <div>
                  <span className="font-semibold">Username:</span>{' '}
                  {user.username}
                </div>
                <div>
                  <span className="font-semibold">Ethereum Address:</span>{' '}
                  {user.ethereumAddress}
                </div>
                <div>
                  <span className="font-semibold">Name:</span> {user.name}
                </div>
                <div>
                  <span className="font-semibold">Role:</span>
                  <Badge
                    variant="secondary"
                    className={`ml-2 rounded-full ${getRoleBadgeClass(user.role || 'buyer')}`}
                  >
                    {user.role}
                  </Badge>
                </div>
                <div>
                  <span className="font-semibold">Status:</span>
                  <Badge
                    variant="secondary"
                    className={`ml-2 rounded-full ${getStatusBadgeClass(user.status || 'inactive')}`}
                  >
                    {user.status}
                  </Badge>
                </div>
                {user.createdAt && (
                  <div>
                    <span className="font-semibold">Created:</span>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}
                {user.updatedAt && (
                  <div>
                    <span className="font-semibold">Last Updated:</span>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(user.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant={user.status === 'banned' ? 'secondary' : 'destructive'}
                className="w-full"
                onClick={() => setConfirm(true)}
              >
                {user.status === 'banned' ? 'Unban User' : 'Ban User'}
              </Button>

              <div className="text-sm text-gray-600 mt-4">
                <p>
                  <strong>Note:</strong> Banning a user will prevent them from
                  accessing the platform.
                </p>
                <p className="mt-2">Unbanning will restore their access.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AlertDialog open={confirm} onOpenChange={(o) => !o && setConfirm(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user?.status === 'banned' ? 'Unban' : 'Ban'} this user?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleToggleBan();
                setConfirm(false);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ViewUser;
