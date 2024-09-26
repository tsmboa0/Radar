import { auth } from "auth";





 
export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/sign-in" && req.nextUrl.pathname !== "/" && req.nextUrl.pathname !== "/action.json" 
    && !req.nextUrl.pathname.startsWith("/play")) 
  {
    const newUrl = new URL("/sign-in", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}