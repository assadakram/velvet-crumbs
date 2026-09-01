export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFF9F5] via-[#fff4ef] to-[#ffe8df] flex flex-col items-center font-sans text-gray-900">
      <div className="w-full max-w-4xl px-4">
        {children}
      </div>
    </div>
  );
}
