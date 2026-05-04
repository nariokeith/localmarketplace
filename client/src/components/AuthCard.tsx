import Link from 'next/link';

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerHref: string;
  footerAction: string;
};

export function AuthCard({ title, subtitle, children, footerText, footerHref, footerAction }: AuthCardProps) {
  return (
    <main className="page-shell grid place-items-center px-4 py-10">
      <section className="surface w-full max-w-md p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-box bg-primary text-lg font-black text-primary-content">
            LM
          </div>
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-neutral/60">{subtitle}</p>
          </div>
        </div>
        {children}
        <p className="mt-6 text-center text-sm text-neutral/60">
          {footerText}{' '}
          <Link href={footerHref} className="font-bold text-primary hover:underline">
            {footerAction}
          </Link>
        </p>
      </section>
    </main>
  );
}
