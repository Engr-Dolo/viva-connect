import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import TextField from '../forms/TextField.jsx';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  skills: '',
  availability: '',
  totalSevaHours: 0,
};

const VolunteerModal = ({ volunteer, isOpen, onClose, onSubmit, isSaving }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (volunteer) {
      setForm({
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone,
        skills: volunteer.skills.join(', '),
        availability: volunteer.availability,
        totalSevaHours: volunteer.totalSevaHours,
      });
      return;
    }

    setForm(initialForm);
  }, [volunteer, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      totalSevaHours: Number(form.totalSevaHours || 0),
      skills: form.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-viva-ink/45 px-4 py-6">
      <section className="w-full max-w-2xl rounded-md border border-slate-200 bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-viva-ink">
              {volunteer ? 'Update Volunteer' : 'Add Volunteer'}
            </h2>
            <p className="text-sm text-slate-500">Record skills, availability, and seva hours.</p>
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
          <TextField id="name" label="Name" name="name" value={form.name} onChange={handleChange} required />
          <TextField id="email" label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <TextField id="phone" label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
          <TextField
            id="totalSevaHours"
            label="Seva hours"
            name="totalSevaHours"
            type="number"
            min="0"
            value={form.totalSevaHours}
            onChange={handleChange}
          />
          <label className="block sm:col-span-2" htmlFor="skills">
            <span className="text-sm font-medium text-slate-700">Skills</span>
            <input
              id="skills"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Teaching, cooking, logistics"
              className="mt-2 block h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-viva-ink shadow-sm outline-none transition placeholder:text-slate-400 focus:border-viva-leaf focus:ring-2 focus:ring-viva-leaf/20"
            />
          </label>
          <label className="block sm:col-span-2" htmlFor="availability">
            <span className="text-sm font-medium text-slate-700">Availability</span>
            <textarea
              id="availability"
              name="availability"
              value={form.availability}
              onChange={handleChange}
              required
              rows="3"
              className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-viva-ink shadow-sm outline-none transition placeholder:text-slate-400 focus:border-viva-leaf focus:ring-2 focus:ring-viva-leaf/20"
            />
          </label>

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
              {isSaving ? 'Saving...' : 'Save Volunteer'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default VolunteerModal;
