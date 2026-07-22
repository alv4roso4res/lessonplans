import { Header } from "@/components/Header";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import AboutSection from "@/components/sections/AboutSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header variant="public" />

            <main className="flex-grow">
                <HeroSection />
                <FeaturesSection />
                <AboutSection />
                <CTASection />
            </main>

            <Footer />
        </div>
    );
}
