import Dashboard from "./views/dashboard/dashboard"
import Users from "./views/users/users"
import Register from "./views/register/register"
import Profile from "./views/profile/profile"

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tachometer",
    component: Dashboard
  },
  {
    path: "/users",
    name: "View Users",
    icon: "users",
    component: Users
  },
  {
    path: "/register",
    name: "Register User",
    icon: "plus",
    component: Register
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: "user",
    component: Profile
  },
  { redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard" }
];
export default routes;
