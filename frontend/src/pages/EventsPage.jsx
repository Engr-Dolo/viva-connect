import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, Edit3, MapPin, Plus, Search, Trash2, UsersRound, Sparkles, FileText, X, Camera } from 'lucide-react';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import LoadingBlock from '../components/common/LoadingBlock.jsx';
import EventModal from '../components/events/EventModal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { createEvent, deleteEvent, getEvents, updateEvent } from '../services/eventService.js';
import { getVolunteers } from '../services/volunteerService.js';
import { getEventReport } from '../services/aiService.js';

const canManageEvents = (role) => ['admin', 'coordinator'].includes(role);

const formatEventDate = (value) => {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const EventsPage = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalEvent, setModalEvent] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setDeleting] = useState(false);
  const canManage = canManageEvents(user?.role);
  const { showToast } = useToast();
  
  const [reports, setReports] = useState({});
  const [generatingReports, setGeneratingReports] = useState({});

  const handleGenerateReport = async (eventId) => {
    setGeneratingReports(prev => ({ ...prev, [eventId]: true }));
    try {
      const report = await getEventReport(eventId);
      setReports(prev => ({ ...prev, [eventId]: report }));
    } catch (err) {
      showToast('Failed to generate report: ' + err.message, 'error');
    } finally {
      setGeneratingReports(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const loadEvents = useCallback(async (page = 1, nextSearch = activeSearch) => {
    setLoading(true);
    setError('');

    try {
      const result = await getEvents({ page, limit: pagination.limit, search: nextSearch });
      setEvents(result.events);
      setPagination(result.pagination);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [activeSearch, pagination.limit]);

  const loadVolunteerOptions = useCallback(async () => {
    try {
      const result = await getVolunteers({ page: 1, limit: 50 });
      setVolunteers(result.volunteers);
    } catch (loadError) {
      setError(loadError.message);
    }
  }, []);

  useEffect(() => {
    loadEvents(1);
    loadVolunteerOptions();
  }, [loadEvents, loadVolunteerOptions]);

  const handleSearch = (event) => {
    event.preventDefault();
    setActiveSearch(search);
    loadEvents(1, search);
  };

  const openCreateModal = () => {
    setModalEvent(null);
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setModalEvent(event);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setError('');

    try {
      if (modalEvent) {
        await updateEvent(modalEvent.id, payload);
        showToast('Event updated successfully', 'success');
      } else {
        await createEvent(payload);
        showToast('Event created successfully', 'success');
      }

      setModalOpen(false);
      await loadEvents(modalEvent ? pagination.page : 1);
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
      await deleteEvent(deleteTarget.id);
      showToast('Event deleted successfully', 'success');
      setDeleteTarget(null);
      await loadEvents(pagination.page);
    } catch (deleteError) {
      setError(deleteError.message);
      showToast(deleteError.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-viva-leaf">Events</p>
            <h2 className="mt-1 text-2xl font-semibold text-viva-ink">Seva Activity Coordination</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Plan seva activities, assign volunteers, and record people served.
            </p>
          </div>
          {canManage && (
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-viva-leaf px-4 text-sm font-semibold text-white hover:bg-viva-ink"
              onClick={openCreateModal}
            >
              <Plus size={18} />
              Plan Activity
            </button>
          )}
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-200 p-4">
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSearch}>
            <label className="relative flex-1" htmlFor="event-search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                id="event-search"
                value={search}
                onChange={(changeEvent) => setSearch(changeEvent.target.value)}
                placeholder="Search by title, description, or location"
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

        <div className="grid gap-4 p-4 lg:grid-cols-2">
          {isLoading ? (
            <div className="lg:col-span-2">
              <LoadingBlock label="Gathering seva activities..." />
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 lg:col-span-2">
              <CalendarDays className="mx-auto mb-2 text-slate-300" size={28} />
              <p className="font-medium text-slate-600">No seva activities found</p>
              <p className="mt-1 text-sm text-slate-400">
                {activeSearch ? 'Try a different title, description, or location.' : 'Plan the first seva activity to start tracking impact.'}
              </p>
            </div>
          ) : (
            events.map((event) => (
              <article key={event.id} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-viva-ink">{event.title}</h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <CalendarDays size={16} />
                      {formatEventDate(event.date)}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={16} />
                      {event.location}
                    </p>
                  </div>
                  {canManage && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-viva-leaf hover:text-viva-leaf"
                        onClick={() => openEditModal(event)}
                        aria-label={`Edit ${event.title}`}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:border-viva-maroon hover:text-viva-maroon"
                        onClick={() => setDeleteTarget(event)}
                        aria-label={`Delete ${event.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">{event.description}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md bg-viva-mist px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-viva-leaf">People served</p>
                    <p className="mt-1 text-xl font-semibold text-viva-ink">{event.peopleServed}</p>
                  </div>
                  <div className="rounded-md bg-slate-50 px-3 py-3">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <UsersRound size={14} />
                      Volunteers
                    </p>
                    <p className="mt-1 text-xl font-semibold text-viva-ink">{event.volunteers.length}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 pt-4 gap-4">
                  <div className="flex flex-wrap gap-2">
                    {event.volunteers.length > 0 ? event.volunteers.map((volunteer) => (
                      <span key={volunteer.id || volunteer} className="rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                        {volunteer.name || volunteer}
                      </span>
                    )) : <span className="text-sm text-slate-400">No volunteers assigned</span>}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {event.mediaUrl && (
                      <a href={event.mediaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100">
                        <Camera size={14} />
                        View Media
                      </a>
                    )}
                    {canManage && (
                    <button
                      onClick={() => handleGenerateReport(event.id)}
                      disabled={generatingReports[event.id]}
                      className="inline-flex items-center whitespace-nowrap shrink-0 gap-1.5 rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                    >
                      <Sparkles size={14} />
                      {generatingReports[event.id] ? 'Generating...' : 'AI Impact Report'}
                    </button>
                  )}
                  </div>
                </div>

                {reports[event.id] && (
                  <div className="mt-4 relative rounded-md border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 shadow-sm">
                    <button
                      onClick={() => setReports(prev => ({ ...prev, [event.id]: null }))}
                      className="absolute right-2 top-2 text-indigo-400 hover:text-indigo-600"
                    >
                      <X size={16} />
                    </button>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="text-indigo-600" size={16} />
                      <span className="text-xs font-bold uppercase tracking-wide text-indigo-800">Generated Report</span>
                    </div>
                    <p className="text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap">{reports[event.id]}</p>
                  </div>
                )}
              </article>
            ))
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} events
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || isLoading}
              className="h-10 min-w-24 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => loadEvents(pagination.page - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages || isLoading}
              className="h-10 min-w-24 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => loadEvents(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <EventModal
        event={modalEvent}
        isOpen={isModalOpen}
        isSaving={isSaving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        volunteers={volunteers}
      />
      <ConfirmDialog
        title="Delete event"
        description={deleteTarget ? `This will permanently delete ${deleteTarget.title} and remove it from assigned volunteer records.` : ''}
        isOpen={Boolean(deleteTarget)}
        isProcessing={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default EventsPage;
