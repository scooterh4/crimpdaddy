import React from "react";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";
import ProtectedRoute, {
  ProtectedRouteProps,
} from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    authenticationPath: "/signin",
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              outlet={<Dashboard />}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
