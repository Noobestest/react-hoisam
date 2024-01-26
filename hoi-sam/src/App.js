import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './Home';
import Heart from "./Heart";
import 'bootstrap/dist/css/bootstrap.css';
import 'react-wheel-of-prizes/dist/index.js'



function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path="guess" element={<Heart />} />
          <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
