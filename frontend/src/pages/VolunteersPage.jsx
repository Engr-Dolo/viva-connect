import { useCallback, useEffect, useState } from 'react';
import { Edit3, Plus, Search, Trash2, UsersRound } from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import LoadingBlock from '../components/common/LoadingBlock.jsx';
import VolunteerModal from '../components/volunteers/VolunteerModal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  createVolunteer,
  deleteVolunteer,
  getVolunteers,
  updateVolunteer,
} from '../services/volunteerService.js';
import { exportToCSV } from '../utils/csvExport.js';
import { FileText } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle.js';

const canManageVolunteers = (role) => ['admin', 'coordinator'].includes(role);

const VolunteersPage = ({ user }) => {
  usePageTitle('Volunteers');
  const [volunteers, setVolunteers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVolunteer, setModalVolunteer] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setDeleting] = useState(false);
  const canManage = canManageVolunteers(user?.role);
  const { showToast } = useToast();

  const loadVolunteers = useCallback(async (page = 1, nextSearch = activeSearch) => {
    setLoading(true);
    setError('');

    try {
      const result = await getVolunteers({ page, limit: pagination.limit, search: nextSearch });
      setVolunteers(result.volunteers);
      setPagination(result.pagination);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [activeSearch, pagination.limit]);

  useEffect(() => {
    loadVolunteers(1);
  }, [loadVolunteers]);

  const handleSearch = (event) => {
    event.preventDefault();
    setActiveSearch(search);
    loadVolunteers(1, search);
  };

  const openCreateModal = () => {
    setModalVolunteer(null);
    setModalOpen(true);
  };

  const openEditModal = (volunteer) => {
    setModalVolunteer(volunteer);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setError('');

    try {
      if (modalVolunteer) {
        await updateVolunteer(modalVolunteer.id, payload);
        showToast('Volunteer updated successfully', 'success');
      } else {
        await createVolunteer(payload);
        showToast('Volunteer created successfully', 'success');
      }

      setModalOpen(false);
      await loadVolunteers(modalVolunteer ? pagination.page : 1);
    } catch (saveError) {
      setError(saveError.message);
      showToast(saveError.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await deleteVolunteer(deleteTarget.id);
      showToast('Volunteer deleted successfully', 'success');
      setDeleteTarget(null);
      await loadVolunteers(pagination.page);
    } catch (deleteError) {
      setError(deleteError.message);
      showToast(deleteError.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    const columns = [
      { key: 'name', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'skills', label: 'Skills' },
      { key: 'availability', label: 'Availability' },
      { key: 'totalSevaHours', label: 'Total Seva Hours' },
    ];
    
    exportToCSV(volunteers, columns, `VIVA_Volunteer_List_${new Date().toLocaleDateString()}.csv`);
    showToast('Volunteer list exported successfully', 'success');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-viva-leaf">Volunteers</p>
            <h2 className="mt-1 text-2xl font-semibold text-viva-ink">Volunteer Care</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Maintain volunteer profiles, skills, availability, and seva hour totals.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={handleExport}
            >
              <FileText size={18} className="text-slate-500" />
              Export List
            </button>
            {canManage && (
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-viva-leaf px-4 text-sm font-semibold text-white hover:bg-viva-ink"
                onClick={openCreateModal}
              >
                <Plus size={18} />
                Add Volunteer
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-200 p-4">
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSearch}>
            <label className="relative flex-1" htmlFor="volunteer-search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                id="volunteer-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, or skill"
                className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-viva-leaf focus:ring-2 focus:ring-viva-leaf/20"
              />
            </label>
            <button
              type="submit"
              className="h-11 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Search
            </button>
          </form>
        </div>

        {error && <div className="m-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {['Name', 'Skills', 'Availability', 'Seva Hours', 'Actions'].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-slate-500" colSpan="5">
                    <LoadingBlock label="Gathering volunteer records..." />
                  </td>
                </tr>
              ) : volunteers.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-slate-500" colSpan="5">
                    <UsersRound className="mx-auto mb-2 text-slate-300" size={28} />
                    <p className="font-medium text-slate-600">No volunteer records found</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {activeSearch ? 'Try a different name, email, or skill.' : 'Add the first volunteer to begin tracking seva.'}
                    </p>
                  </td>
                </tr>
              ) : (
                volunteers.map((volunteer) => (
                  <tr key={volunteer.id}>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-viva-ink">{volunteer.name}</p>
                      <p className="text-sm text-slate-500">{volunteer.email}</p>
                      <p className="text-xs text-slate-400">{volunteer.phone}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex max-w-xs flex-wrap gap-2">
                        {volunteer.skills.length > 0 ? volunteer.skills.map((skill) => (
                          <span key={skill} className="rounded-md bg-viva-mist px-2 py-1 text-xs font-medium text-viva-leaf">
                            {skill}
                          </span>
                        )) : <span className="text-sm text-slate-400">None listed</span>}
                      </div>
                    </td>
                    <td className="max-w-sm px-4 py-4 text-sm text-slate-600">{volunteer.availability}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-viva-ink">{volunteer.totalSevaHours}</td>
                    <td className="px-4 py-4">
                      {canManage ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-viva-leaf hover:text-viva-leaf"
                            onClick={() => openEditModal(volunteer)}
                            aria-label={`Edit ${volunteer.name}`}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            type="button"
                            className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-viva-maroon hover:text-viva-maroon"
                            onClick={() => setDeleteTarget(volunteer)}
                            aria-label={`Delete ${volunteer.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">View only</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} volunteers
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || isLoading}
              className="h-10 min-w-24 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => loadVolunteers(pagination.page - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages || isLoading}
              className="h-10 min-w-24 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => loadVolunteers(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <VolunteerModal
        volunteer={modalVolunteer}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        isSaving={isSaving}
      />
      <ConfirmDialog
        title="Delete volunteer"
        description={deleteTarget ? `This will permanently delete ${deleteTarget.name}. Existing reports may no longer include this profile.` : ''}
        isOpen={Boolean(deleteTarget)}
        isProcessing={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default VolunteersPage;
