import { Route, Routes } from "react-router-dom";
import Report from './Pages/Report';
import Login from './Pages/Login';
import UserDetails from './Pages/UserDetails';
import ScaleDetails from './Pages/ScaleDetails';

const App = () =>{
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/report" element={<Report />} />
      <Route path="/userdetails" element={<UserDetails />} />
      <Route path="/scaledetails" element={<ScaleDetails />} />
      
    </Routes>
  );
}

export default App