import { Logo } from "./Logo";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <header className="container py-4">
        <Logo />
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};