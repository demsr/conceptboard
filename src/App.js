import { Routes, Route, Link, Outlet } from "react-router-dom";
import { BaseLayout } from "./layouts";
import { BookPage, HomePage } from "./pages";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <BaseLayout>
            <BookPage />
          </BaseLayout>
        }
      >
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
