export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-dvh">
      <div className="grid grid-cols-2">
        <div className="col-span-2 lg:col-span-1">{children}</div>
        <div className="hidden lg:block col-span-1 bg-primary w-full h-dvh"></div>
      </div>
    </div>
  );
}
