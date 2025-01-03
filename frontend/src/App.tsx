import { BrowserRouter, Routes, Route } from "react-router-dom";

// Constants
import { ROUTE_KEYCHAINS_LIST, ROUTE_STAFFS_LIST } from "./constants/routes";

// Pages
import Homepage from "./pages/homepage/Homepage";
import KeychainsListPage from "./pages/keychains/list/KeychainsListPage";
import StaffsListPage from "./pages/staffs/list/StaffsListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Homepage />} />
        <Route path={ROUTE_KEYCHAINS_LIST} element={<KeychainsListPage />} />
        <Route path={ROUTE_STAFFS_LIST} element={<StaffsListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
