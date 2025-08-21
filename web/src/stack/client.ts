import { StackClientApp } from "@stackframe/react";

export const stackClientApp = new StackClientApp({
  // You should store these in environment variables based on your project setup
  projectId: "ccaf20ef-ba4a-4b0b-976e-9a260e7047a0",
  publishableClientKey: "pck_972wsfj1559va5fktyhg4e4tk4zyrtsp0pet2d8ky2008",
  tokenStore: "cookie",
  // Use window redirect method for OAuth flows
  redirectMethod: "window",
  // Configure URLs for proper redirects
  urls: {
    afterSignIn: "/",
    afterSignUp: "/",
    afterSignOut: "/login.html",
  },
});
