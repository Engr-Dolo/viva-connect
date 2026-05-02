import { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, UserPlus, Search, UserMinus, ShieldAlert, BadgeCheck, Ban, UserCog, UserCheck, Shield } from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import LoadingBlock from '../components/common/LoadingBlock.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getUsers, updateUserStatus, createUser, updateUserRole } from '../services/userService.js';
import usePageTitle from '../hooks/usePageTitle.js';

const TeamPage = () => {
  usePageTitle('Team Management');
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [roleTarget, setRoleTarget] = useState(null);
  const [isStatusUpdating, setStatusUpdating] = useState(false);
  const [isRoleUpdating, setRoleUpdating] = useState(false);
  
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'coordinator' });
  const { showToast } = useToast();

  const loadUsers = useCallback(async (page = 1, nextSearch = activeSearch, nextRole = roleFilter) => {
    setLoading(true);
    setError('');

    try {
      const result = await getUsers({ page, limit: pagination.limit, search: nextSearch, role: nextRole });
      setUsers(result.users);
      setPagination(result.pagination);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [activeSearch, roleFilter, pagination.limit]);

  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSearch(search);
    loadUsers(1, search);
  };

  const handleStatusToggle = async () => {
    if (!statusTarget) return;
    
    setStatusUpdating(true);
    const newStatus = statusTarget.status === 'active' ? 'suspended' : 'active';
    
    try {
      await updateUserStatus(statusTarget.id, newStatus);
      showToast(`Account ${newStatus === 'suspended' ? 'suspended' : 'reinstated'} successfully`, 'success');
      setStatusTarget(null);
      await loadUsers(pagination.page);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleRoleUpdate = async (newRole) => {
    if (!roleTarget) return;
    
    setRoleUpdating(true);
    try {
      await updateUserRole(roleTarget.id, newRole);
      showToast(`User role updated to ${newRole.toUpperCase()} successfully`, 'success');
      setRoleTarget(null);
      await loadUsers(pagination.page);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setRoleUpdating(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createUser(newUser);
      showToast(`${newUser.role} created successfully`, 'success');
      setModalOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'coordinator' });
      await loadUsers(1);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <section className="rounded-md border border-slate-200 bg-viva-ink p-6 text-white shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-viva-leaf" size={20} />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Team Control</p>
            </div>
            <h2 className="mt-1 text-2xl font-bold">Staff & Member Management</h2>
            <p className="mt-2 text-sm text-slate-300">
              Control access levels, monitor participation, and manage account statuses across the platform.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-viva-leaf px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-white hover:text-viva-leaf transition-all"
          >
            <UserPlus size={18} />
            Add Team Member
          </button>
        </div>
      </section>

      {/* Table Section */}
      <section className="rounded-md border border-slate-200 bg-white shadow-soft overflow-hidden">
        <div className="border-b border-slate-200 p-4 bg-slate-50/50">
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSearch}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search team members..."
                className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-viva-leaf focus:ring-2 focus:ring-viva-leaf/20"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                loadUsers(1, activeSearch, e.target.value);
              }}
              className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-viva-leaf"
            >
              <option value="">All Roles</option>
              <option value="coordinator">Coordinators</option>
              <option value="volunteer">Volunteers</option>
            </select>
            <button type="submit" className="h-11 rounded-md bg-viva-ink px-6 text-sm font-bold text-white hover:bg-slate-800 transition">
              Search
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12"><LoadingBlock label="Retrieving team records..." /></td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic">No team members found matching your criteria.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="group hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${u.role === 'admin' ? 'bg-viva-maroon' : u.role === 'coordinator' ? 'bg-viva-leaf' : 'bg-viva-ink'}`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-viva-ink">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${
                        u.role === 'admin' ? 'bg-viva-maroon/10 text-viva-maroon border-viva-maroon/20' :
                        u.role === 'coordinator' ? 'bg-viva-leaf/10 text-viva-leaf border-viva-leaf/20' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {u.role === 'coordinator' && <BadgeCheck size={10} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${u.status === 'active' ? 'text-viva-leaf' : 'text-viva-maroon'}`}>
                        <div className={`size-1.5 rounded-full ${u.status === 'active' ? 'bg-viva-leaf shadow-[0_0_5px_rgba(22,163,74,0.5)]' : 'bg-viva-maroon'}`} />
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {u.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => setRoleTarget(u)}
                              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold border border-slate-200 text-slate-600 hover:bg-viva-ink hover:text-white transition-all"
                            >
                              <UserCog size={14} />
                              Role
                            </button>
                            <button
                              onClick={() => setStatusTarget(u)}
                              className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold border transition-all ${
                                u.status === 'active' 
                                ? 'text-viva-maroon border-viva-maroon/20 hover:bg-viva-maroon hover:text-white' 
                                : 'text-viva-leaf border-viva-leaf/20 hover:bg-viva-leaf hover:text-white'
                              }`}
                            >
                              {u.status === 'active' ? <Ban size={14} /> : <ShieldCheck size={14} />}
                              {u.status === 'active' ? 'Suspend' : 'Reinstate'}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-viva-ink/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-viva-ink mb-2">Create Team Account</h3>
            <p className="text-sm text-slate-500 mb-6">Provision a new account for a coordinator or volunteer.</p>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                <input
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full h-11 rounded-md border border-slate-300 px-4 text-sm focus:border-viva-leaf outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                <input
                  required
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full h-11 rounded-md border border-slate-300 px-4 text-sm focus:border-viva-leaf outline-none"
                  placeholder="john@viva.org"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Initial Password</label>
                <input
                  required
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full h-11 rounded-md border border-slate-300 px-4 text-sm focus:border-viva-leaf outline-none"
                  placeholder="********"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">System Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full h-11 rounded-md border border-slate-300 px-4 text-sm focus:border-viva-leaf outline-none appearance-none bg-white"
                >
                  <option value="coordinator">Coordinator</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 h-11 rounded-md border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 h-11 rounded-md bg-viva-leaf text-sm font-bold text-white shadow-lg hover:bg-viva-ink disabled:opacity-50"
                >
                  {isSaving ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Update Modal */}
      {roleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-viva-ink/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-md bg-white p-6 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-viva-ink">
                <UserCog size={24} />
              </div>
            </div>
            <h3 className="text-center text-lg font-bold text-viva-ink">Institutional Role Management</h3>
            <p className="mt-1 text-center text-sm text-slate-500">Update access level for <span className="font-bold text-viva-leaf">{roleTarget.name}</span>.</p>
            
            <div className="mt-6 space-y-3">
              {[
                { id: 'admin', label: 'Administrator', icon: Shield, color: 'text-viva-maroon', bg: 'bg-viva-maroon/5', border: 'border-viva-maroon/20' },
                { id: 'coordinator', label: 'Coordinator', icon: ShieldCheck, color: 'text-viva-leaf', bg: 'bg-viva-leaf/5', border: 'border-viva-leaf/20' },
                { id: 'volunteer', label: 'Volunteer', icon: UserCheck, color: 'text-viva-ink', bg: 'bg-slate-50', border: 'border-slate-200' }
              ].map((role) => (
                <button
                  key={role.id}
                  disabled={isRoleUpdating || roleTarget.role === role.id}
                  onClick={() => handleRoleUpdate(role.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-md border transition-all ${
                    roleTarget.role === role.id 
                    ? 'bg-slate-50 opacity-50 cursor-not-allowed border-transparent' 
                    : `${role.bg} ${role.border} hover:scale-[1.02] active:scale-[0.98]`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <role.icon className={role.color} size={20} />
                    <div className="text-left">
                      <p className={`text-sm font-bold ${role.color}`}>{role.label}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Level {role.id === 'admin' ? '3' : role.id === 'coordinator' ? '2' : '1'}</p>
                    </div>
                  </div>
                  {roleTarget.role === role.id && <div className="text-[10px] font-bold text-slate-400">CURRENT</div>}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setRoleTarget(null)}
              className="mt-6 w-full h-11 rounded-md text-sm font-bold text-slate-400 hover:text-slate-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        title={statusTarget?.status === 'active' ? 'Restrict Account Access' : 'Restore Account Access'}
        description={`Are you sure you want to ${statusTarget?.status === 'active' ? 'suspend' : 'reinstate'} the account for ${statusTarget?.name}?`}
        confirmText={statusTarget?.status === 'active' ? 'Suspend Account' : 'Activate Account'}
        confirmColor={statusTarget?.status === 'active' ? 'bg-viva-maroon' : 'bg-viva-leaf'}
        isOpen={Boolean(statusTarget)}
        isProcessing={isStatusUpdating}
        onCancel={() => setStatusTarget(null)}
        onConfirm={handleStatusToggle}
      />
    </div>
  );
};

export default TeamPage;
