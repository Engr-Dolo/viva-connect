import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const TextField = ({ label, id, type = 'text', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="block">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          type={inputType}
          className={`block h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-viva-ink shadow-sm outline-none transition placeholder:text-slate-400 focus:border-viva-leaf focus:ring-2 focus:ring-viva-leaf/20 ${
            isPassword ? 'pr-10' : ''
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-0 top-0 flex h-11 w-10 items-center justify-center text-slate-400 hover:text-viva-ink transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default TextField;
