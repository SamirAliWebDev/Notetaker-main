import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Notes, Folders, Shared, Settings } from './pages/DashboardPages';
import { Workflow } from './components/Workflow';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Analytics } from "@vercel/analytics/react"

const Landing = () => (
  <div className="min-h-screen bg-background selection:bg-zinc-200">
    <Navbar />
    <main>
      <Hero />
      <Features />
      <Workflow />
      <Pricing />
      <FAQ />
      <section className="py-24 px-6 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-zinc-900 rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">Ready to organize <br className="hidden sm:block" /> your thoughts?</h2>
            <p className="text-zinc-400 text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Join thousands of thinkers using Note.ai to ship their ideas faster.
            </p>
            <Link to="/login" className="inline-flex items-center gap-2 bg-white text-zinc-900 px-8 md:px-10 py-3.5 md:py-4 rounded-full text-base md:text-lg font-bold hover:bg-zinc-100 transition-all shadow-xl active:scale-95">
              Start writing now
            </Link>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-zinc-800 rounded-full blur-[100px] opacity-50" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-zinc-800 rounded-full blur-[100px] opacity-50" />
        </motion.div>
      </section>
    </main>
    <footer className="py-12 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 text-center text-zinc-400 text-sm">
        &copy; {new Date().getFullYear()} Note.ai. Built for thinkers.
      </div>
    </footer>
  </div>
);

function App() {
  return (
    <Router>
      <Analytics />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Notes />} />
          <Route path="folders" element={<Folders />} />
          <Route path="shared" element={<Shared />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
