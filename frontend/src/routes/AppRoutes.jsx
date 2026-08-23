import { Routes, Route } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Investigation from "../pages/Investigation";
import Analytics from "../pages/Analytics";
import About from "../pages/About";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />

        <Route
          path="transactions"
          element={<Transactions />}
        />

        <Route
          path="/investigation"
          element={<Investigation />}
        />

        <Route
          path="/investigation/:transactionId"
          element={<Investigation />}
        />

        <Route
          path="investigation/:transactionId"
          element={<Investigation />}
        />

        <Route
          path="analytics"
          element={<Analytics />}
        />

        <Route
          path="about"
          element={<About />}
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;