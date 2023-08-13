import "./App.scss";
import { lazy, Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./Context/AuthContext";
import Loader from "./components/loader/Loader";

const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Reset = lazy(() => import("./pages/auth/Reset"));
const Register = lazy(() => import("./pages/auth/Register"));
const PageNotFound = lazy(() => import("./components/PageNotFound"))

function App() {
  const { currentUser } = useAuthContext()!;

  const ProtectedRoute = ({ children }: any) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    } else {
      return children;
    }
  };

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
