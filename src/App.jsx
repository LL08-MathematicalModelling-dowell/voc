import { Route, Routes } from "react-router-dom";
import Report from './Pages/Report';
import Login from './Pages/Login';
import UserDetails from './Pages/UserDetails';
import ScaleDetails from './Pages/ScaleDetails';
import Scales from './Pages/Scales';
import OpenReportPage from './Pages/OpenReportPage';
import TestPage from './Pages/TestPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/reports" element={<Report />} />
      <Route path="/userdetails" element={<UserDetails />} />
      <Route path="/scaledetails" element={<ScaleDetails />} />
      <Route path="/scale" element={<Scales />} />
      <Route path="/report" element={<OpenReportPage />} />
      <Route path="/test" element={<TestPage />} /> 
    </Routes>
  );
}

export default App;
