import Footer from "../components/Footer.jsx";
import LoginModal from "../components/modals/LoginModal.jsx";
import RegisterModal from "../components/modals/RegisterModal.jsx";
import FAQ from "../components/sections/FAQ.jsx";
import Features from "../components/sections/Features.jsx";
import Hero from "../components/sections/Hero.jsx";
import Pricing from "../components/sections/Pricing.jsx";
import Testimonials from "../components/sections/Testimonials.jsx";

/**
 * Home
 * The single-page marketing website.
 *
 * IMPORTANT: LoginModal and RegisterModal must be rendered here (not in Navbar)
 * so that their #loginModal and #registerModal ids are present in the DOM when
 * any data-bs-target="..." attribute references them — including from the Footer
 * and Pricing section which also open these modals.
 *
 * Render order: modals first (hidden), then visible content sections.
 */
const Home = () => (
  <>
    {/* Modals — hidden until triggered, but their HTML must be in the DOM */}
    <LoginModal />
    <RegisterModal />

    <main>
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
    </main>

    <Footer />
  </>
);

export default Home;
