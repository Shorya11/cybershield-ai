import { Outlet } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      <Header />

      <main className="ml-80 pt-24 min-h-screen overflow-y-auto bg-slate-50 p-8">
        <Outlet />
      </main>

    </div>
  );
}

export default AppLayout;