import Dashboard from './views/dashboard/dashboard'
import Users from './views/users/users'
import Register from './views/register/register'
import Profile from './views/profile/profile'
import ChangePassword from './views/change-password/change-password'
import ManageAccount from './views/manage-account/manage-account'
import ManageAdmin from './views/manage-admin/manage-admin'

var routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'tachometer',
    isSideBar: true,
    component: Dashboard,
  },
  {
    path: '/users',
    name: 'View Users',
    icon: 'users',
    isSideBar: true,
    component: Users,
  },
  {
    path: '/register',
    name: 'Register User',
    icon: 'plus',
    isSideBar: true,
    component: Register,
  },
  {
    path: '/profile',
    name: 'User Profile',
    icon: 'user',
    isSideBar: false,
    component: Profile,
  },
  {
    path: '/change-password',
    name: 'Change Password',
    icon: 'lock',
    isSideBar: true,
    component: ChangePassword,
  },
  {
    path: '/account',
    name: 'Manage Account',
    icon: 'calculator',
    isSideBar: true,
    isAdmin: true,
    component: ManageAccount,
  },
  {
    path: '/manage-admins',
    name: 'Manage Admins',
    icon: 'user-secret',
    isSideBar: true,
    isAdmin: true,
    component: ManageAdmin,
  },
  { redirect: true, path: '/', pathTo: '/dashboard', name: 'Dashboard' },
]
export default routes
