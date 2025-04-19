import { PropsWithChildren } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export function LayoutProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  // Don't render layout components on landing page
  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    // This div will override the light theme from root layout for non-landing pages
    <div className="flex flex-col min-h-screen [&_:root]:dark">
      <Header />
      <main className="container flex flex-1 flex-col border-0 border-l border-r border-border/20 sm:border-solid">
        {children}
      </main>
      <Footer />
      <div className="fixed inset-0 -z-50">
        <Image
          fill
          priority
          alt="Background"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABMdJREFUWEdtVwt220YMxC5l9xqxbDn9pK1T3/9gtszdvvlgd6koejQZURIGgxkALP+8vvfeg/940Xv03qK3Ho3nxvf5Hm4HPlyilBKl1iilxradYqtbbPXE61M9xYnv6XoruLdFLTgqD34fr79f3/WbNwBaSyACADAEx0+WiFL0Q/U+AAY3iASAswAgNEDECgABEcMZI3ODaMkCwosAAkD2lZlvUZ252DALyN73GZws1MDrFwaYG6nuN4EnEN4bBIj+WnGAepfglv4VwIEBsVh+jBI4OAGABdV/ZG9mVCwwoOAlGWDgCSK1cK/+LAHKh5/5cXkf0pIIHdQgCGAIEfn3QX+WoI7AmwWpMhzohxApvtSAGfjr8h9ZHSVY6952M2AQqVZKQAJkXa3+1Qm8vqP+gwPggj8TwGJB0b67BDqnOM1/lAoaLay0YaqeoKb1Duon9bIxK/kHAcgBoB+BRLuz53nn+/rQdIAYENVwAWhXYL+H+4v3Zb8MjquI8vvlp0pgBpozFwAHBwCzoPgW0UL/WgqCIDvZdG68LxjK5fsCIJU/g3+ZCQDYDwyoCZ0CAkwN4DyoZ5eE792wsnu6kSl8RHklgLRgWk8BW/uKtgPElzXQxtdhv8x60i8AOqR4sIXGw+Y58h5mjnK5vMkAeFl8pN6BCQIAyIABsATKvG4POg823PMJQKXKsrmHycopp5eXN2tgbT4KKgauYsAs4JvyMoIjsAHwWgxQnAhMAK71SFqRx1R5JoC1BCm+K1loDedr9H6N6GBBPUDBEPxhAYLgk34BmHQrqGIlBeV8F8DMvu2fBNEbAHyZTmSYwVcQpzGiST3HnfLVXw06F5yiLk8v/w4bqvlM8Sl7APiMjqPvUVCCQJYOXB+HDlKYKAGzx6cNgBqLHOkTyBEAgvcEcDX9EwAZAGoKEAAelzI8mP5NwhvZZ74CQKuTEYEo38AAVZBD5whg35H9hxlIAFmC35x9siENJAP2rBzG2iN4goCjAOA5S+A2jDJYfLtLAACtfViEckGBCyoAJAtyQa5p6YBUOwPnMVg4AADCbL0S4d4+qQHUXwAgQmggASD4qoETe/9ggBaYAlQxlGgWpnx7PtqQTQdAdmuAID6idwABgCYAsGF5jDJ0kAxIA5yWan8GoTKw9rl9qQR3+kBXC4b66YThgqsZgL9PUWjF2xJo72MDGo3Ibc99YIDALLgPAHZMFxhAz2YE+lYAKcDJgABkK3YnLLcgxIwA8N6yC4ABtmI1oMECNWAAgVo/uCFlG04NTBY0D1wJrRKzC+L/T89vfjDJh49ViApOEGQANhQALKV0QnZEzwHOCC8inIQug0CwNQ00XEiezh5G6dOlGyKgsscwEgB2M0KA2HAs05DCXPb/sZBAtl5k/FiR+ixPZ+0DGhI5EdERcwy7FAjOAyoGAC0ccsNaAq9j+czgLXiuY2bCQ6qczz/9uJETUfNAPWEGT3v20ERUCcDAEUA+Aa0rWT6OqRzLYoJrABjzeSylAKAdYDDB7LWcSrWp9AlgMxNcUrkXai+QJsiZNiRm76X0HoDMfpwNZC2BrCgdZAlWAPk0vFkH2g0nCGOYDBw0kEL8hQWv52ZgOsHL6MJAPpgg+8FEOoLgZYb/AV7jdKpNefraAAAAAElFTkSuQmCC"
          className="select-none"
          layout="fixed"
          objectFit="cover"
          objectPosition="center"
          src={'/bg.jpeg'}
        />
      </div>
    </div>
  );
}
