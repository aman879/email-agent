import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';

export const Route = createRootRoute({
  component: () => (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  ),
});
