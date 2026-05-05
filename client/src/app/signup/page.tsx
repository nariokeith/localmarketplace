'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthCard } from '../../components/AuthCard';
import { StatusAlert } from '../../components/StatusAlert';
import { useAuth } from '../../contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [status, setStatus] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);

    try {
      await signup({
        name: String(formData.get('name')),
        email: String(formData.get('email')),
        password: String(formData.get('password')),
        passwordConfirm: String(formData.get('passwordConfirm'))
      });
      router.replace('/dashboard');
    } catch (error) {
      setStatus({ message: error instanceof Error ? error.message : 'Signup failed.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Public signup creates normal users only."
      footerText="Already registered?"
      footerHref="/login"
      footerAction="Login"
    >
      <StatusAlert message={status?.message} type={status?.type} />
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label>
          <span className="field-label">Name</span>
          <input className="form-input" name="name" type="text" autoComplete="name" minLength={2} required />
        </label>
        <label>
          <span className="field-label">Email</span>
          <input className="form-input" name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span className="field-label">Password</span>
          <input className="form-input" name="password" type="password" autoComplete="new-password" minLength={8} required />
        </label>
        <label>
          <span className="field-label">Confirm Password</span>
          <input className="form-input" name="passwordConfirm" type="password" autoComplete="new-password" minLength={8} required />
        </label>
        <button type="submit" className="btn btn-primary mt-2" disabled={isLoading}>
          {isLoading ? <span className="loading loading-spinner" /> : <i className="ri-user-add-line ri text-lg" aria-hidden="true" />}
          Create Account
        </button>
      </form>
    </AuthCard>
  );
}
