import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";

// Create a container for Analytics if it doesn't exist
const containerId = "vercel-analytics-root";
let container = document.getElementById(containerId);

if (!container) {
  container = document.createElement("div");
  container.id = containerId;
  document.body.appendChild(container);
}

createRoot(container).render(<Analytics />);
