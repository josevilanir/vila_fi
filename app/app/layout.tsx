export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-black text-[#f0eadd]">
      {children}
    </div>
  )
}
