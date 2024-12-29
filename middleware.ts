import { auth } from "auth";





 
export default auth((req) => {
  const headers = new Headers(req.headers);

  headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins (use specific domains in production)
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  if (!req.auth && req.nextUrl.pathname !== "/sign-in" && req.nextUrl.pathname !== "/" && req.nextUrl.pathname !== "/action.json" 
    && !req.nextUrl.pathname.startsWith("/play") && !req.nextUrl.pathname.startsWith("/validate"))
  {
    const newUrl = new URL("/sign-in", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|actions.json|frontend).*)"],
}