'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthCard } from '../../components/AuthCard';
import { StatusAlert } from '../../components/StatusAlert';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);

    try {
      await login(String(formData.get('email')), String(formData.get('password')));
      router.replace('/dashboard');
    } catch (error) {
      setStatus({ message: error instanceof Error ? error.message : 'Login failed.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Login to manage marketplace products."
      footerText="Need an account?"
      footerHref="/signup"
      footerAction="Create one"
    >
      <StatusAlert message={status?.message} type={status?.type} />
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label>
          <span className="field-label">Email</span>
          <input className="form-input" name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span className="field-label">Password</span>
          <input className="form-input" name="password" type="password" autoComplete="current-password" required />
        </label>
        <button type="submit" className="btn btn-primary mt-2" disabled={isLoading}>
          {isLoading ? <span className="loading loading-spinner" /> : <i className="ri-login-circle-line ri text-lg" aria-hidden="true" />}
          Login
        </button>
      </form>
    </AuthCard>
  );
}
