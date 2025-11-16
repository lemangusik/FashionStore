import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CatalogPage from "./pages/CatalogPage";
import ProductFormPage from "./pages/ProductFormPage";
import AccessibilityWidget from "./components/AccessibilityWidget";

function App() {
  useEffect(() => {
    const savedFontSize = localStorage.getItem("accessibility-fontSize");
    if (savedFontSize) {
      document.documentElement.style.fontSize = `${savedFontSize}%`;
    }

    const savedHighContrast = localStorage.getItem(
      "accessibility-highContrast"
    );
    if (savedHighContrast === "true") {
      document.body.classList.add("high-contrast-mode");
    }

    const savedGrayscale = localStorage.getItem("accessibility-grayscale");
    if (savedGrayscale === "true") {
      document.body.classList.add("grayscale-mode");
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/create" element={<ProductFormPage />} />
          <Route path="/product/edit/:slug" element={<ProductFormPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/catalog/:categorySlug" element={<CatalogPage />} />
          <Route
            path="/catalog/:categorySlug/:subcategorySlug"
            element={<CatalogPage />}
          />
        </Routes>
        <AccessibilityWidget />
      </div>
    </Router>
  );
}

export default App;
