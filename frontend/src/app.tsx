import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Games from "./pages/games";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/auth-context";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="bottom-right"
          reverseOrder
          toastOptions={{ duration: 3000 }}
        />

        <Routes>
          <Route path="/" element={<Games />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
