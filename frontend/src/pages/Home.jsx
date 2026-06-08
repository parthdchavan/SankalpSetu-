import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, MapPin, TrendingUp, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../design-system/components/Button';
import { fadeIn, staggerContainer, staggerItem } from '../design-system/animations';

/**
 * Landing Page - Production-quality homepage
 * 
 * Goal: Convert visitors in 15 seconds
 * 
 * Sections:
 * - Hero (emotional headline, primary CTA)
 * - Value Proposition
 * - Impact Stats (social proof)
 * - How It Works
 * - Features
 * - Final CTA
 */

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div variants={staggerItem} className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Join 10,000+ changemakers
              </motion.div>
              
              <motion.h1 variants={staggerItem} className="text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6">
                Turn Surplus Food Into{' '}
                <span className="text-primary-600">Shared Hope</span>
              </motion.h1>
              
              <motion.p variants={staggerItem} className="text-xl text-neutral-600 mb-8 leading-relaxed">
                Every meal deserves a purpose. Connect your surplus food with people in need through our trusted platform.
              </motion.p>
              
              <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button variant="primary" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Start Donating
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" size="xl">
                    See How It Works
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div variants={staggerItem} className="mt-12 flex items-center gap-8 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Verified NGOs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>60s Donation</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Hero Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 rounded-card shadow-elevation4 p-12 aspect-square flex items-center justify-center">
                <Heart className="w-48 h-48 text-white opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl font-bold mb-2">2.5M+</div>
                    <div className="text-xl">Meals Provided</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-elevation3 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-neutral-900">1,200+</div>
                    <div className="text-sm text-neutral-600">Active Donors</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-200 rounded-full filter blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { number: '2.5M+', label: 'Meals Provided', icon: Heart },
              { number: '1,200+', label: 'Active Donors', icon: Users },
              { number: '450+', label: 'Partner NGOs', icon: MapPin },
              { number: '95%', label: 'Success Rate', icon: TrendingUp },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={index} variants={staggerItem} className="text-center">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-primary-400" />
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-neutral-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">How It Works</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Making a difference has never been easier. Three simple steps to feed hope.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: '01',
                title: 'Create Your Donation',
                description: 'Post details about your surplus food in under 60 seconds. Add photos, quantity, and pickup location.',
                color: 'primary',
              },
              {
                step: '02',
                title: 'NGO Accepts',
                description: 'Verified NGOs near you receive instant notifications. They accept based on their capacity and location.',
                color: 'accent',
              },
              {
                step: '03',
                title: 'Volunteer Delivers',
                description: 'Our network of volunteers picks up and delivers your donation safely to people who need it most.',
                color: 'success',
              },
            ].map((step, index) => (
              <motion.div key={index} variants={staggerItem} className="relative">
                <div className="bg-white rounded-card border-2 border-neutral-200 p-8 hover:border-primary-300 hover:shadow-elevation2 transition-all">
                  <div className={`text-6xl font-bold text-${step.color}-100 mb-4`}>{step.step}</div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3">{step.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{step.description}</p>
                </div>
                
                {/* Connector Arrow */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-neutral-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Why Choose Sankalp Setu?</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Built for trust, designed for impact, optimized for convenience.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: '🔒',
                title: 'Verified NGOs Only',
                description: 'Every NGO is thoroughly verified. Your donations reach legitimate organizations.',
              },
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Create a donation in under 60 seconds. Real-time notifications to nearby NGOs.',
              },
              {
                icon: '📍',
                title: 'Smart Matching',
                description: 'AI-powered location matching connects you with the closest NGOs and volunteers.',
              },
              {
                icon: '📊',
                title: 'Track Your Impact',
                description: 'See exactly how many meals you\'ve provided and lives you\'ve touched.',
              },
              {
                icon: '💯',
                title: 'Always Free',
                description: 'No hidden fees. No commissions. 100% of your donation goes to those in need.',
              },
              {
                icon: '🏆',
                title: 'Award Winning',
                description: 'Recognized by leading organizations for social impact and innovation.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="bg-white rounded-card p-8 hover:shadow-elevation2 transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Every Meal Matters. Start Today.
            </h2>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Join thousands of donors, NGOs, and volunteers creating real change. Your surplus food can feed hope.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?role=donor">
                <Button variant="secondary" size="xl" rightIcon={<Heart className="w-5 h-5" />}>
                  Become a Donor
                </Button>
              </Link>
              <Link to="/register?role=ngo">
                <Button variant="outline" size="xl" className="bg-white/10 border-white text-white hover:bg-white/20">
                  Register as NGO
                </Button>
              </Link>
            </div>
            <p className="mt-8 text-primary-200 text-sm">
              Free forever · Verified partners · 60-second donations
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
