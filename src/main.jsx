import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import SearchContext from "./contexts/Search.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.jsx";

createRoot(document.getElementById("root")).render(
      <Provider store={store}>
            <SearchContext>
                  <BrowserRouter>
                        <App />
                  </BrowserRouter>
            </SearchContext>
      </Provider>
);
