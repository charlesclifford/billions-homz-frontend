
export default async function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-dvh">
      <main>{children}</main>
    </div>
  );
}
