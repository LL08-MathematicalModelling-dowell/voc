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
      <Route path="/voc/" element={<Login />} />
      <Route path="/voc/reports" element={<Report />} />
      <Route path="/voc/userdetails" element={<UserDetails />} />
      <Route path="/voc/scaledetails" element={<ScaleDetails />} />
      <Route path="/voc/scale" element={<Scales />} />
      <Route path="/voc/report" element={<OpenReportPage />} />
      <Route path="/test" element={<TestPage />} /> 
    </Routes>
  );
}

export default App;
