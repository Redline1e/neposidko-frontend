export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-1 flex justify-center ">{children}</main>;
}
