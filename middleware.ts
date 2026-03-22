import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: [
    "/admin/((?!login).*)",  // all /admin/* except /admin/login
    "/api/admin/:path*",     // all admin API routes
  ],
};
