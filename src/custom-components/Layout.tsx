import { Navbar } from "./Navbar"
import Footer from "./Footer"
import { Outlet, useLocation } from "react-router-dom"

export const Layout = () => {
  const location = useLocation()

  const hideNavbarOn = ['/login', '/register', '/']

  const hideNavbar = hideNavbarOn.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideNavbar && <Footer />}
    </div>
  )
}
