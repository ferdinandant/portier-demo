import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ROUTE_KEYCHAINS_LIST, ROUTE_STAFFS_LIST } from "./constants/routes";
import KeychainsListPage from "./pages/keychains/list/KeychainsListPage";
import StaffsListPage from "./pages/staffs/list/StaffsListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_KEYCHAINS_LIST} element={<KeychainsListPage />} />
        <Route path={ROUTE_STAFFS_LIST} element={<StaffsListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
