import type { ReactNode } from "react";

type PageLayoutProps = {
  title: string;
  action?: ReactNode;
  filters?: ReactNode;
  children?: ReactNode;
};

const PageLayout = ({ title, action, filters, children }: PageLayoutProps) => (
  <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 md:px-10">
    <header className="flex items-center justify-between gap-4">
      <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-[32px]">{title}</h1>
      {action}
    </header>
    {filters && <div className="flex flex-wrap items-center gap-4">{filters}</div>}
    {children}
  </main>
);

export const CardGrid = ({ children }: { children?: ReactNode }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {children}
  </div>
);

export default PageLayout;
