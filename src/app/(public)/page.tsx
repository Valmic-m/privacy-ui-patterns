import Link from 'next/link';
import { Search, Shield, Users, BookOpen, Plus, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCategoriesAlphabetical } from '@/lib/constants/categories';

const categories = getCategoriesAlphabetical();
const featuredCategories = categories.slice(0, 8);

const stats = [
  { label: 'Privacy Patterns', value: '29+' },
  { label: 'Real Examples', value: '150+' },
  { label: 'Contributors', value: '50+' },
  { label: 'Figma Templates', value: '15+' },
];

const principles = [
  {
    icon: Shield,
    title: 'Privacy by Design',
    description: 'All patterns follow Cavoukian\'s 7 foundational principles for privacy protection'
  },
  {
    icon: Users,
    title: 'User-Centered',
    description: 'Based on Nielsen\'s usability heuristics for optimal user experience'
  },
  {
    icon: CheckCircle,
    title: 'Compliance Ready',
    description: 'GDPR and CCPA compliant patterns that reduce legal risk'
  },
  {
    icon: BookOpen,
    title: 'Research Backed',
    description: 'Grounded in academic research and real-world implementations'
  }
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 lock-pattern">
        <div className="absolute inset-0 guardian-gradient opacity-10" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="flex items-center space-x-4">
                  <Shield className="h-16 w-16 text-primary shield-glow" />
                  <div className="text-left">
                    <h1 className="font-heading text-4xl font-bold tracking-tight md:text-6xl">
                      Privacy UI
                      <br />
                      <span className="guardian-text-gradient">Pattern Library</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground mb-8">
              A curated collection of privacy-focused UI patterns that adhere to Privacy by Design 
              principles and Nielsen's Heuristics. Build trust while staying compliant.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="guardian-gradient text-white border-0">
                <Link href="/patterns">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore Patterns
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contribute">
                  <Plus className="mr-2 h-5 w-5" />
                  Contribute
                </Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="mx-auto max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search privacy patterns..."
                  className="pl-10 pr-4 glass-card border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold mb-4">
              Built on Proven Principles
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every pattern in our library is carefully vetted against established privacy 
              and usability frameworks.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <Card key={principle.title} className="glass-card border-0">
                  <CardHeader className="text-center">
                    <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-lg">{principle.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {principle.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-4">
                Privacy Pattern Categories
              </h2>
              <p className="text-xl text-muted-foreground">
                Explore our comprehensive collection of privacy-focused UI patterns
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/patterns">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((category) => (
              <Card key={category.slug} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <div className="h-6 w-6 bg-primary/20 rounded" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {category.description}
                  </CardDescription>
                  <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                    <Link href={`/patterns/${category.slug}`}>
                      Explore patterns
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <Card className="guardian-gradient border-0 text-white overflow-hidden relative">
              <div className="absolute inset-0 lock-pattern opacity-20" />
              <CardContent className="p-12 relative">
                <div className="text-center">
                  <Star className="h-12 w-12 mx-auto mb-6 opacity-80" />
                  <h2 className="font-heading text-3xl font-bold mb-4">
                    Join the Privacy Movement
                  </h2>
                  <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                    Help us build the most comprehensive collection of privacy-focused UI patterns. 
                    Your contributions make privacy accessible to everyone.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary">
                      <Plus className="mr-2 h-5 w-5" />
                      Submit a Pattern
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                      <Users className="mr-2 h-5 w-5" />
                      View Contributors
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
