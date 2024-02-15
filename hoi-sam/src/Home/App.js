import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from '../Places/Home';
import Heart from "../Hearts/Heart";
import Valentines from "../Hearts/Valentines";
import Games from "../Games/Games";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-wheel-of-prizes/dist/index.js'



function App() {
  return (
    <>
      <Tabs
        defaultActiveKey="home"
        transition={false}
        id="noanim-tab-example"
        className="mb-3"
      >
        <Tab eventKey="home" title="Place to Eat">
          <Home />
        </Tab>
        <Tab eventKey="profile" title="Games">
          <Games />
        </Tab>
        <Tab eventKey="contact" title="Valentines">
          <Valentines />
        </Tab>
      </Tabs>
      {/* <BrowserRouter>
        <Routes>
            <Route index element={ <Home />} />
            <Route path="guess" element={<Heart />} />
            <Route path="*" element={ <Home />} />
        </Routes>
      </BrowserRouter> */}
    </>
  );
}

export default App;
