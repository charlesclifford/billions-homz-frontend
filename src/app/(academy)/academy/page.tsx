"use client";

import SmallTitle from "@/components/shared/SmallTitle";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Laptop,
  TrendingUp,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";

const benefitsList = [
  {
    icon: GraduationCap,
    title: "Expert-Led Training",
    content:
      "Learn directly from seasoned real estate leaders and top-performing agents.",
  },
  {
    icon: Users,
    title: "Powerful Networking",
    content:
      "Connect with investors, agents, and professionals to expand your reach.",
  },
  {
    icon: Laptop,
    title: "Flexible Learning",
    content:
      "Choose between online and in-person sessions that fit your lifestyle.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    content:
      "Gain practical skills to close deals and accelerate your real estate career.",
  },
];

export default function AcademyComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Set launch date (3 months from now)
  const launchDate = new Date();
  launchDate.setMonth(launchDate.getMonth() + 3);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      setDays(Math.floor(difference / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((difference % (1000 * 60)) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log("Email submitted:", email);
    setSubmitted(true);
    setEmail("");
    
    // Reset after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  // Animation variants
  const fadeUp = {
    hidden: { y: 30, opacity: 0 },
    visible: (i = 0) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", damping: 15, stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-background dark:to-gray-900">
      {/* Header */}
      <header className="container max-w-[min(100%,1290px)] mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">Billions Homz</div>
          <div className="flex items-center">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Academy Coming Soon
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-6 text-center">
        <div className="container max-w-[min(100%,1290px)] mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SmallTitle text="Coming Soon" className="mx-auto" />
          </motion.div>

          <motion.div
            className="mt-8 mb-12 w-full flex justify-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <h1 className="text-3xl md:text-5xl font-bold leading-[1.2em] max-w-3xl">
              Billions Homz Academy is Launching Soon
            </h1>
          </motion.div>

          <motion.p
            className="max-w-2xl mx-auto text-lg mb-10 leading-[1.6] text-gray-600 dark:text-gray-300"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            We&apos;re building an exceptional real estate academy to help you succeed. 
            Join the waitlist to be the first to know when we launch.
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            className="max-w-2xl mx-auto mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                <div className="text-2xl md:text-3xl font-bold text-primary">{days}</div>
                <div className="text-sm text-gray-500 mt-1">Days</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                <div className="text-2xl md:text-3xl font-bold text-primary">{hours}</div>
                <div className="text-sm text-gray-500 mt-1">Hours</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                <div className="text-2xl md:text-3xl font-bold text-primary">{minutes}</div>
                <div className="text-sm text-gray-500 mt-1">Minutes</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                <div className="text-2xl md:text-3xl font-bold text-primary">{seconds}</div>
                <div className="text-sm text-gray-500 mt-1">Seconds</div>
              </div>
            </div>
          </motion.div>

          {/* Email Signup Form */}
          {/* <motion.div
            className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
          >
            <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mx-auto mb-4">
              <Mail className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Get Notified at Launch</h3>
            
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg flex items-center gap-2 text-sm"
              >
                <CheckCircle size={18} />
                <span>Thank you! We'll notify you when we launch.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-lg transition duration-300"
                >
                  Notify Me at Launch
                </button>
              </form>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              We respect your privacy and will never share your information.
            </p>
          </motion.div> */}
        </div>
      </section>

      {/* Benefits Section */}
      {/* <section className="py-12 px-6 bg-white dark:bg-gray-800">
        <div className="container max-w-[min(100%,1290px)] mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SmallTitle text="What to Expect" />
            <h2 className="text-2xl md:text-3xl font-bold mt-3 mb-4">
              Why Join Billions Homz Academy
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefitsList.map(({ icon: Icon, title, content }, i) => (
              <motion.div
                key={i}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 flex flex-col items-start text-left"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="mb-4 p-2 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Icon
                    size={24}
                    className="text-primary"
                  />
                </div>
                <h4 className="text-lg font-semibold mb-2">{title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Final CTA */}
      {/* <section className="py-12 px-6">
        <div className="container max-w-[min(100%,1290px)] mx-auto px-4 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Don't Miss Our Launch
            </h2>
            <p className="max-w-xl mx-auto mb-6 text-gray-600 dark:text-gray-300">
              Join the waitlist today for exclusive early-bird access.
            </p>
            
            <motion.button
              onClick={() => document.getElementById('email-signup')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-6 rounded-lg transition duration-300 inline-flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Waitlist <ArrowUpRight size={18} />
            </motion.button>
          </motion.div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="py-8 px-6  text-white text-center">
        <div className="container max-w-[min(100%,1290px)] mx-auto px-4">
          <div className="text-xl font-bold mb-2">Billions Homz Academy</div>
          <p className="text-gray-400 text-sm">Transforming real estate careers through expert education</p>
          <div className="text-xs text-gray-500 mt-4">
            © {new Date().getFullYear()} Billions Homz Academy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}