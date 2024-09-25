import React from "react";
import ReactDOM from "react-dom/client"; // 使用新的导入方式
import App from "./App";
import { HelmetProvider } from "react-helmet-async";

/**
 * Root of react site
 *
 * Imports Helmet provider for the page head
 * And App which defines the content and navigation
 */

// Render the site https://reactjs.org/docs/react-dom.html#render

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
