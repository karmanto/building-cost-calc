import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToTopButtonProps {
  containerRef?: React.RefObject<HTMLElement>; // Optional ref for a specific scrollable container
}

export default function ScrollToTopButton({ containerRef }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  const getScrollElement = useCallback(() => {
    return containerRef?.current || window;
  }, [containerRef]);

  const handleScroll = useCallback(() => {
    const scrollElement = getScrollElement();
    let scrollTop: number;

    if (scrollElement === window) {
      scrollTop = window.scrollY;
    } else {
      const el = scrollElement as HTMLElement;
      scrollTop = el.scrollTop;
    }

    // Show button if scrolled down more than 100px
    setIsVisible(scrollTop > 100);
  }, [getScrollElement]);

  const scrollToTop = useCallback(() => {
    const scrollElement = getScrollElement();
    if (scrollElement === window) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      const el = scrollElement as HTMLElement;
      el.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [getScrollElement]);

  useEffect(() => {
    const scrollElement = getScrollElement();
    scrollElement.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, getScrollElement]);

  return (
    <Button
      variant="default"
      size="icon"
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition-all duration-300",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
