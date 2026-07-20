import React from 'react';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';

export const revalidate = 0; // Disable static rendering

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] dark:bg-slate-900 flex flex-col lg:flex-row font-body-md text-on-surface dark:text-slate-200 antialiased overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto h-screen p-6 md:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}
