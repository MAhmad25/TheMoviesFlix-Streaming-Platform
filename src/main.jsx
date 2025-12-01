import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.jsx";
import { Analytics } from "@vercel/analytics/react";
createRoot(document.getElementById("root")).render(
      <Provider store={store}>
            <BrowserRouter>
                  <Analytics />
                  <App />
            </BrowserRouter>
      </Provider>
);
