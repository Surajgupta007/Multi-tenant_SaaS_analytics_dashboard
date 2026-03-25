import Link from 'next/link'
import { ArrowRight, BarChart3, Database, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 rounded-lg p-1">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">SaaSLytics</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-48 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-3xl -z-10"></div>
          
          <div className="container px-4 md:px-6 mx-auto text-center space-y-8">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-background/50 backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
              Now in public beta
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter max-w-4xl mx-auto bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
              Analytics that scale with your multi-tenant SaaS
            </h1>
            
            <p className="mx-auto max-w-[700px] text-lg md:text-xl text-muted-foreground">
              Powerful, isolated, and incredibly fast data insights for B2B platforms. 
              Built on Next.js, Redis, and Stripe billing.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 text-base">
                  Start for free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-24 bg-gray-50/50 dark:bg-gray-900/50 border-t">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                A complete production-grade toolkit to manage tenants, members, and advanced usage metrics.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Shield, title: 'Tenant Isolation', text: 'Firm data boundaries via RBAC and Mongoose filters ensuring cross-org security.' },
                { icon: Zap, title: 'Redis Edge Caching', text: 'Sub-millisecond latency for tenant resolution powered by Upstash.' },
                { icon: Database, title: 'MongoDB Scale', text: 'Handle millions of analytics events with optimized retention indexes.' },
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm border">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl mb-4">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-background py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6 mx-auto text-sm text-muted-foreground">
          <p>© 2024 SaaSLytics. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
