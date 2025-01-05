import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

// Constants
import {
  ROUTE_KEYCHAINS_LIST,
  ROUTE_KEYCHAINS_VIEW,
  ROUTE_STAFFS_LIST,
  ROUTE_STAFFS_VIEW,
} from "./constants/routes";

// Pages
import Homepage from "./pages/homepage/Homepage";
import KeychainsListPage from "./pages/keychains/list/KeychainsListPage";
import StaffsListPage from "./pages/staffs/list/StaffsListPage";
import KeychainsViewPage from "./pages/keychains/view/KeychainsViewPage";
import StaffsViewPage from "./pages/staffs/view/StaffsViewPage";

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Homepage />} />
          <Route path={ROUTE_KEYCHAINS_LIST} element={<KeychainsListPage />} />
          <Route path={ROUTE_KEYCHAINS_VIEW} element={<KeychainsViewPage />} />
          <Route path={ROUTE_STAFFS_LIST} element={<StaffsListPage />} />
          <Route path={ROUTE_STAFFS_VIEW} element={<StaffsViewPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
