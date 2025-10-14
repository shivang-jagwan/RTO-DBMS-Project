import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-provider';

export const metadata: Metadata = {
  title: 'RTO Enforcement Dashboard',
  description: 'A Traffic Violation Management System for RTO Admins.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isSupabaseConfigured = 
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_SUPABASE_URL') &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY');

  if (!isSupabaseConfigured) {
    return (
      <html lang="en">
        <body>
          <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
            <div className="max-w-2xl text-center">
              <h1 className="text-3xl font-bold text-destructive mb-4">Configuration Error</h1>
              <p className="text-lg mb-2">Your application is not configured to connect to Supabase.</p>
              <p className="text-muted-foreground mb-6">
                Please open the <code className="font-mono bg-muted px-2 py-1 rounded">.env.local</code> file in the file explorer and replace the placeholder values for 
                <code className="font-mono bg-muted px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and 
                <code className="font-mono bg-muted px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> 
                with your actual Supabase project credentials.
              </p>
              <a href="https://supabase.com/dashboard/project/_/settings/api" target="_blank" rel="noopener noreferrer" className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium">
                Find Your Supabase Keys
              </a>
            </div>
          </div>
        </body>
      </html>
    )
  }
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
