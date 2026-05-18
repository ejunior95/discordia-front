import { Navbar } from "./Navbar"
import { LegalNavbar } from "./LegalNavbar"
import Footer from "./Footer"
import { Outlet, useLocation } from "react-router-dom"

export const Layout = () => {
  const location = useLocation()

  const hideNavbarOn = ['/login', '/register', '/']
  const legalNavbarOn = ['/terms', '/privacy', '/cookies']

  const hideNavbar = hideNavbarOn.includes(location.pathname)
  const showLegalNavbar = legalNavbarOn.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      {showLegalNavbar ? <LegalNavbar /> : !hideNavbar && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideNavbar && <Footer />}
    </div>
  )
}
