import { useEffect, useState } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import TextField from '../forms/TextField.jsx';
import { getVolunteerRecommendations } from '../../services/aiService.js';

import { Camera } from 'lucide-react';

const initialForm = {
  title: '',
  description: '',
  date: '',
  location: '',
  peopleServed: 0,
  mediaUrl: '',
  volunteers: [],
};

const toDateTimeLocal = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

const EventModal = ({ event, isOpen, isSaving, onClose, onSubmit, volunteers }) => {
  const [form, setForm] = useState(initialForm);
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendError, setRecommendError] = useState('');

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        description: event.description,
        date: toDateTimeLocal(event.date),
        location: event.location,
        peopleServed: event.peopleServed,
        mediaUrl: event.mediaUrl || '',
        volunteers: event.volunteers.map((volunteer) => volunteer.id || volunteer),
      });
      return;
    }

    setForm(initialForm);
  }, [event, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (changeEvent) => {
    const { name, value } = changeEvent.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleVolunteerToggle = (volunteerId) => {
    setForm((current) => {
      const isSelected = current.volunteers.includes(volunteerId);
      return {
        ...current,
        volunteers: isSelected
          ? current.volunteers.filter((id) => id !== volunteerId)
          : [...current.volunteers, volunteerId],
      };
    });
  };

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    onSubmit({
      ...form,
      date: new Date(form.date).toISOString(),
      peopleServed: Number(form.peopleServed || 0),
    });
  };

  const handleRecommendVolunteers = async () => {
    setIsRecommending(true);
    setRecommendError('');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        eventId: event ? event.id : undefined,
      };
      const recs = await getVolunteerRecommendations(payload);
      setRecommendations(recs);
    } catch (err) {
      setRecommendError('Failed to get recommendations: ' + err.message);
    } finally {
      setIsRecommending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-viva-ink/45 px-4 py-6">
      <section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-md border border-slate-200 bg-white shadow-soft">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-viva-ink">{event ? 'Update Seva Activity' : 'Plan Seva Activity'}</h2>
            <p className="text-sm text-slate-500">Assign volunteers and record people served.</p>
          </div>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-viva-ink"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        <form className="grid gap-4 p-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <TextField id="title" label="Title" name="title" value={form.title} onChange={handleChange} required />
          <TextField
            id="date"
            label="Date and time"
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            required
          />
          <TextField id="location" label="Location" name="location" value={form.location} onChange={handleChange} required />
          <TextField
            id="peopleServed"
            label="People served"
            name="peopleServed"
            type="number"
            min="0"
            value={form.peopleServed}
            onChange={handleChange}
          />
          
          <div className="sm:col-span-2 rounded-md border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Camera className="mt-0.5 text-amber-600 shrink-0" size={20} />
              <div>
                <p className="text-sm font-bold text-amber-900 uppercase tracking-wide">Important Provision</p>
                <p className="mt-1 text-sm text-amber-800">
                  It is critical to <strong>always capture and upload photographs or videos</strong> of seva events for the homepage gallery and impact reports. Please paste a link to the media folder (Google Drive, Photos) below.
                </p>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <TextField
              id="mediaUrl"
              label="Media Folder Link (Optional for now)"
              name="mediaUrl"
              type="url"
              placeholder="https://drive.google.com/..."
              value={form.mediaUrl}
              onChange={handleChange}
            />
          </div>

          <label className="block sm:col-span-2" htmlFor="description">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="4"
              className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-viva-ink shadow-sm outline-none transition placeholder:text-slate-400 focus:border-viva-leaf focus:ring-2 focus:ring-viva-leaf/20"
            />
          </label>

          <fieldset className="sm:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <legend className="text-sm font-medium text-slate-700">Assign volunteers</legend>
              <button
                type="button"
                onClick={handleRecommendVolunteers}
                disabled={isRecommending || !form.title || !form.description}
                className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
              >
                <Sparkles size={14} />
                {isRecommending ? 'Analyzing...' : 'AI Suggestion'}
              </button>
            </div>
            
            {recommendError && <p className="mb-2 text-xs text-red-600">{recommendError}</p>}
            
            {recommendations.length > 0 && (
              <div className="mb-3 rounded-md border border-indigo-200 bg-indigo-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-800">AI Recommendations</p>
                <ul className="space-y-2">
                  {recommendations.map((rec) => {
                    const isSelected = form.volunteers.includes(rec.volunteerId);
                    return (
                      <li key={rec.volunteerId} className="flex items-start gap-2">
                        <button
                          type="button"
                          onClick={() => handleVolunteerToggle(rec.volunteerId)}
                          className={`mt-0.5 rounded-full ${isSelected ? 'text-indigo-600' : 'text-slate-300 hover:text-indigo-400'}`}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <div>
                          <p className="text-sm font-medium text-indigo-900">{rec.name}</p>
                          <p className="text-xs text-indigo-700">{rec.reason}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            
            <div className="grid max-h-52 gap-2 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
              {volunteers.length === 0 ? (
                <p className="text-sm text-slate-500 sm:col-span-2">Add volunteers before assigning them to seva activities.</p>
              ) : (
                volunteers.map((volunteer) => (
                  <label
                    key={volunteer.id}
                    className="flex items-start gap-2 rounded-md bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={form.volunteers.includes(volunteer.id)}
                      onChange={() => handleVolunteerToggle(volunteer.id)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-medium text-viva-ink">{volunteer.name}</span>
                      <span className="block text-xs text-slate-500">{volunteer.email}</span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </fieldset>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 sm:col-span-2">
            <button
              type="button"
              className="h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-10 rounded-md bg-viva-leaf px-4 text-sm font-semibold text-white hover:bg-viva-ink disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EventModal;
