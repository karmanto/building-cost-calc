import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToBottomButtonProps {
  containerRef?: React.RefObject<HTMLElement>; // Optional ref for a specific scrollable container
}

export default function ScrollToBottomButton({ containerRef }: ScrollToBottomButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  const getScrollElement = useCallback(() => {
    return containerRef?.current || window;
  }, [containerRef]);

  const handleScroll = useCallback(() => {
    const scrollElement = getScrollElement();
    let scrollHeight: number;
    let clientHeight: number;
    let scrollTop: number;

    if (scrollElement === window) {
      scrollHeight = document.documentElement.scrollHeight;
      clientHeight = document.documentElement.clientHeight;
      scrollTop = window.scrollY;
    } else {
      const el = scrollElement as HTMLElement;
      scrollHeight = el.scrollHeight;
      clientHeight = el.clientHeight;
      scrollTop = el.scrollTop;
    }

    // Show button if not at the very bottom (with a small buffer)
    setIsVisible(scrollTop + clientHeight < scrollHeight - 20); // 20px buffer
  }, [getScrollElement]);

  const scrollToBottom = useCallback(() => {
    const scrollElement = getScrollElement();
    if (scrollElement === window) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    } else {
      const el = scrollElement as HTMLElement;
      el.scrollTo({
        top: el.scrollHeight,
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
      onClick={scrollToBottom}
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition-all duration-300",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label="Scroll to bottom"
    >
      <ArrowDown className="h-5 w-5" />
    </Button>
  );
}
