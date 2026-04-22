import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function AdminRegisterPage() {
  const [form, setForm] = useState({
    name: '',
    employeeId: '',
    branchId: '',
    email: '',
    password: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await authService.registerAdmin(form);
      setStatus('success');
      setMessage(res.data.data.message);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.error?.message || 'Registration failed');
    }
  };

  if (status === 'success') {
    return (
      <div className="auth-shell">
        <div className="auth-card max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <p className="page-kicker">Admin account created</p>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-[-0.04em]">Registration Successful</h2>
          <p className="text-outline text-sm mb-4">{message}</p>
          <Link to="/login" className="mt-6 inline-block text-primary font-medium hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell py-8">
      <div className="auth-card max-w-md">
        <div className="mb-6">
          <p className="page-kicker">Admin onboarding</p>
          <h2 className="text-3xl font-extrabold tracking-[-0.05em] text-gray-900">Admin Registration</h2>
          <p className="page-subtitle">Create your admin account to access the control center.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employee ID</label>
            <input name="employeeId" value={form.employeeId} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Branch ID</label>
            <input name="branchId" value={form.branchId} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="input-field" minLength={8} required />
          </div>

          {status === 'error' && <p className="text-error text-sm">{message}</p>}

          <div className="flex gap-4 mt-6">
            <button type="submit" disabled={status === 'loading'} className="btn-primary flex-1">
              {status === 'loading' ? 'Creating Account...' : 'Create Admin Account'}
            </button>
            <Link to="/login" className="btn-secondary flex-1 text-center">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}