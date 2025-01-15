import { auth } from "auth";





 
export default auth((req) => {
  const headers = new Headers(req.headers);

  headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins (use specific domains in production)
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  const path = req.nextUrl.pathname;

  if (!req.auth && path !== "/sign-in" && path !== "/" && path !== "/action.json" 
    && !path.startsWith("/play") && !path.startsWith("/validate"))
  {
    const newUrl = new URL("/sign-in", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|actions.json|frontend).*)"],
}