export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-secondary to-background">
      {children}
    </div>
  )
}
