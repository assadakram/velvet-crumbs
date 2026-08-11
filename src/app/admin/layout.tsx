export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 font-sans text-gray-900">
      <div className="w-full max-w-4xl px-4">
        {children}
      </div>
    </div>
  );
}
