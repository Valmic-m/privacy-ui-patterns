import Link from 'next/link';
import { Shield, Github, Twitter, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
  patterns: [
    { name: 'All Patterns', href: '/patterns' },
    { name: 'Cookie Banners', href: '/patterns/cookie-banners' },
    { name: 'Data Access Rights', href: '/patterns/data-access-rights' },
    { name: 'Privacy Dashboards', href: '/patterns/privacy-dashboards' },
  ],
  community: [
    { name: 'Contributors', href: '/contributors' },
    { name: 'Contribute', href: '/contribute' },
    { name: 'Guidelines', href: '/contribute/guidelines' },
    { name: 'GitHub', href: 'https://github.com/privacy-ui-patterns' },
  ],
  resources: [
    { name: 'Privacy by Design', href: '/privacy#privacy-by-design' },
    { name: 'Nielsen Heuristics', href: '/privacy#nielsen-heuristics' },
    { name: 'GDPR Compliance', href: '/privacy#gdpr' },
    { name: 'Academic Papers', href: '/privacy#research' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Use', href: '/terms' },
    { name: 'Code of Conduct', href: '/code-of-conduct' },
    { name: 'License (MIT)', href: '/license' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Shield className="h-6 w-6 text-primary" />
                <div className="absolute inset-0 h-6 w-6 text-accent opacity-50" />
              </div>
              <span className="font-heading font-bold text-lg guardian-text-gradient">
                Privacy UI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              A curated collection of privacy-focused UI patterns that adhere to Privacy by Design 
              principles and Nielsen's Heuristics.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="https://github.com/privacy-ui-patterns" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="https://twitter.com/privacyui" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Patterns */}
          <div>
            <h3 className="font-heading font-semibold text-sm mb-4">Patterns</h3>
            <ul className="space-y-2">
              {footerLinks.patterns.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-heading font-semibold text-sm mb-4">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading font-semibold text-sm mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground md:flex-row md:items-center md:space-y-0 md:space-x-4">
            <p>© 2025 Privacy UI Pattern Library. All rights reserved.</p>
            <div className="hidden md:block">•</div>
            <p>
              Licensed under{' '}
              <Link href="/license" className="hover:text-foreground transition-colors">
                MIT License
              </Link>
            </p>
          </div>

          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for privacy</span>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 p-4 rounded-lg border bg-muted/50">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="font-heading font-medium text-sm">Privacy by Design</h4>
              <p className="text-sm text-muted-foreground">
                This website practices what it preaches. We use no third-party analytics, 
                store minimal data, and give you full control over your privacy preferences.{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Learn more
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}