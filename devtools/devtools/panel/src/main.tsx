import { createRoot } from "react-dom/client";

import "../../../../site/src/styles.css";
import "./panel.css";
import App from "./App.js";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
createRoot(root).render(<App />);
