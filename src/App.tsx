import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Home } from "@/pages/Home"

function App() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground font-sans antialiased">
      <Navbar />
      <Home />
      <Footer />
    </div>
  )
}

export default App
