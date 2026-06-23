import Navbar from "./navbar";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5/6 p-6">{children}</main>
    </>
  );
}
