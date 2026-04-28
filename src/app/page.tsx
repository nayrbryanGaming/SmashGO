"use client";

import Link from "next/link";
import { GlassCard, Button } from "@/components/ui";
import { Users, Zap, Calendar, ShieldCheck, ArrowRight, Trophy, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function LandingPage() {
  const { t, language, setLanguage } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en");
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Navigation */}
        <header className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
            <span className="text-primary italic">SMASH</span>
            <span className="text-white">GO</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={toggleLanguage}
              className="w-12 h-12 rounded-full p-0 flex items-center justify-center"
            >
              <Globe className="w-5 h-5" />
              <span className="sr-only">Switch Language</span>
              <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-primary px-1 rounded-sm">{language.toUpperCase()}</span>
            </Button>
            <Link href="/dashboard">
              <Button size="sm" className="rounded-full px-6">{t.common.dashboard}</Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-16 text-center md:pt-32 md:pb-24">
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] md:text-xs font-black tracking-[0.2em] uppercase text-primary">{t.landing.production_ready}</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-9xl font-black mb-8 leading-[0.85] tracking-tighter text-white uppercase italic">
            {t.landing.title_1} <br />
            <span className="gradient-text">{t.landing.title_2}</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto font-bold">
            {t.landing.subtitle}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button className="w-full px-10 py-8 text-base">
                {t.landing.cta_dashboard} <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/courts" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full px-10 py-8 text-base">
                {t.landing.cta_booking} <Calendar className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6" />}
              title={t.landing.features.elo.title}
              description={t.landing.features.elo.desc}
              color="text-primary"
            />
            <FeatureCard 
              icon={<Calendar className="w-6 h-6" />}
              title={t.landing.features.booking.title}
              description={t.landing.features.booking.desc}
              color="text-accent"
            />
            <FeatureCard 
              icon={<Trophy className="w-6 h-6" />}
              title={t.landing.features.ranking.title}
              description={t.landing.features.ranking.desc}
              color="text-pink-500"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 text-center border-t border-white/5">
          <p className="text-[10px] tracking-[0.5em] font-black text-white/30 uppercase">
            © 2026 SMASHGO - PROFESSIONAL GRADE SYSTEM VERIFIED
          </p>
        </footer>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <GlassCard className="p-10 hover:bg-white/5 transition-all group border-white/10">
      <div className={cn("w-14 h-14 rounded-2xl mb-8 flex items-center justify-center bg-white/5", color)}>
        {icon}
      </div>
      <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-white italic">{title}</h3>
      <p className="text-white/60 font-medium leading-relaxed">
        {description}
      </p>
    </GlassCard>
  );
}
