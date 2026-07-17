import type { ReactNode } from "react";

type PageLayoutProps = {
  title: string;
  action?: ReactNode;
  filters?: ReactNode;
  children?: ReactNode;
};

const PageLayout = ({ title, action, filters, children }: PageLayoutProps) => (
  <main className="mx-auto flex max-w-7xl flex-col gap-8 px-10 py-8">
    <header className="flex items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold tracking-tight md:text-[32px]">{title}</h1>
      {action}
    </header>
    {filters && <div className="flex flex-wrap items-center gap-4">{filters}</div>}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  </main>
);

export default PageLayout;
