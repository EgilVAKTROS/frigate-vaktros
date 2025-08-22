import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

export const stackClientApp = new StackClientApp({
  // You should store these in environment variables based on your project setup
  projectId: "ccaf20ef-ba4a-4b0b-976e-9a260e7047a0",
  publishableClientKey: "pck_r01n6n0cpxege6zf2e86jepmk6x5qc2f8fsrgzpt0wxn0",
  tokenStore: "cookie",
  redirectMethod: { useNavigate },
});
