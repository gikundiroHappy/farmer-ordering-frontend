import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="fixed top-0 left-0 z-50 h-screen">
          <Sidebar/>
        </div>
        
        <div className="flex-1 md:ml-64">
          <div className="fixed top-0 right-0 left-0 md:left-64 z-40">
            <Navbar/>
          </div>
          
          <main className="pt-16 p-6 bg-gray-50 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}