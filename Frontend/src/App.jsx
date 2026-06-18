import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import TrustBannerSection from './components/TrustBannerSection'
import CategoriesSection from './components/CategoriesSection'
import FreelancersSection from './components/FreelancersSection'
import HowItWorksSection from './components/HowItWorksSection'
import TestimonialsSection from './components/TestimonialsSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

function App() {
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#07070f', color: '#fff' }}>
      <Navbar />
      <main style={{ width: '100%' }}>
        <HeroSection />
        
        <TrustBannerSection />
        <CategoriesSection />
        <FreelancersSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

export default App


// import { useEffect, useState } from "react";
// import api from "./api/axios";

// function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     api.get("test/")
//       .then((res) => setMessage(res.data.message))
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div>
//       <h1>{message}</h1>
//     </div>
//   );
// }

// export default App;