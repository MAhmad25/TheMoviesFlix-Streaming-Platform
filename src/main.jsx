import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.jsx";
import AnalyticsTracker from "./analytics/AnalyticsTracker.jsx";
import { initializeAnalytics } from "./analytics/posthog.js";

initializeAnalytics();

createRoot(document.getElementById("root")).render(
      <Provider store={store}>
            <BrowserRouter>
                  <AnalyticsTracker />
                  <App />
            </BrowserRouter>
      </Provider>
);
