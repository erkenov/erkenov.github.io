"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import { createPortal } from "react-dom";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image, { ImageProps } from "next/image";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface CarouselProps {
  items: React.ReactElement[];
  initialScroll?: number;
  /** When true, items are duplicated and the scroll wraps seamlessly —
   *  scrolling past the end jumps back to an equivalent earlier position
   *  with no animation, giving an "infinite" feel. */
  loop?: boolean;
  /** Where to place the prev/next arrow buttons relative to the card row.
   *  "left" (default) keeps existing behavior; "right" justify-end pushes
   *  them to the far side. */
  arrowsPosition?: "left" | "right";
}

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
  /** Optional React node to render as the card's visual layer INSTEAD of
   *  the BlurImage. Use this for inline mockup components when a static
   *  image isn't expressive enough (e.g. an animated voice-agent UI). */
  visual?: React.ReactNode;
  /** Optional badge/element rendered in the top-right corner of the
   *  CLOSED card, at z-50 so it sits above the dark gradient + title
   *  overlay. (Shamil 2026-05-25: Erken AI agent badge was getting
   *  trapped inside the visual's stacking context.) */
  topRightOverlay?: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0, loop = false, arrowsPosition = "left" }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // When loop is enabled, triple the items and start the scroll position
  // in the MIDDLE copy. When the user scrolls into the first or last
  // copy, we silently teleport them back to the middle. The middle copy
  // always renders the same content the wrap zones do, so no visible jump.
  const renderedItems = loop ? [...items, ...items, ...items] : items;

  useEffect(() => {
    if (!carouselRef.current) return;
    if (loop) {
      // Position scroll in the middle third so the user can scroll either
      // direction without immediately hitting a wrap.
      requestAnimationFrame(() => {
        if (!carouselRef.current) return;
        const oneThird = carouselRef.current.scrollWidth / 3;
        carouselRef.current.style.scrollBehavior = "auto";
        carouselRef.current.scrollLeft = oneThird;
        requestAnimationFrame(() => {
          if (carouselRef.current) carouselRef.current.style.scrollBehavior = "smooth";
        });
      });
    } else {
      carouselRef.current.scrollLeft = initialScroll;
    }
    checkScrollability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialScroll, loop]);

  const checkScrollability = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    if (loop) {
      setCanScrollLeft(true);
      setCanScrollRight(true);
      // Wrap zones: first 1/6 of total = inside first copy → jump +1/3.
      // Last 1/6 = inside last copy → jump -1/3. The middle 2/3 is safe.
      const oneThird = scrollWidth / 3;
      const wrapLow = oneThird * 0.5;
      const wrapHigh = oneThird * 2.5;
      if (scrollLeft < wrapLow) {
        carouselRef.current.style.scrollBehavior = "auto";
        carouselRef.current.scrollLeft = scrollLeft + oneThird;
        requestAnimationFrame(() => {
          if (carouselRef.current) carouselRef.current.style.scrollBehavior = "smooth";
        });
      } else if (scrollLeft > wrapHigh) {
        carouselRef.current.style.scrollBehavior = "auto";
        carouselRef.current.scrollLeft = scrollLeft - oneThird;
        requestAnimationFrame(() => {
          if (carouselRef.current) carouselRef.current.style.scrollBehavior = "smooth";
        });
      }
    } else {
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              "absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l",
            )}
          ></div>

          <div
            className={cn(
              "flex flex-row justify-start gap-4 pl-4",
              // Spans the full width of its container (Section media wrapper
              // controls the bounds). The default mx-auto max-w-7xl was
              // adding centered horizontal margin we didn't want.
            )}
          >
            {renderedItems.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                  },
                }}
                key={"card" + index}
                className="rounded-3xl"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div
          className={cn(
            // Mobile users scroll with their finger; arrows just take up
            // space and rarely get tapped (Shamil 2026-05-25).
            "hidden md:flex gap-2",
            arrowsPosition === "right"
              ? "mr-4 justify-end"
              : "ml-4 justify-start"
          )}
        >
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-bg shadow-sm transition-colors hover:bg-accent-hover disabled:opacity-40"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Previous card"
          >
            <IconArrowNarrowLeft className="h-6 w-6" />
          </button>
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-bg shadow-sm transition-colors hover:bg-accent-hover disabled:opacity-40"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Next card"
          >
            <IconArrowNarrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose, currentIndex } = useContext(CarouselContext);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  // Modal is portalled to document.body so it escapes ancestor stacking
  // contexts (the SphereScrollStage canvas + GSAP transforms create one
  // that traps high z-index modals on mobile). (Shamil 2026-05-25)
  const modal = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] h-screen overflow-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={containerRef}
            layoutId={layout ? `card-${card.title}` : undefined}
            className="relative z-[210] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white p-4 font-sans md:p-10 dark:bg-neutral-900"
          >
            <button
              className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
              onClick={handleClose}
            >
              <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
            </button>
            <motion.p
              layoutId={layout ? `category-${card.title}` : undefined}
              className="text-base font-medium text-black dark:text-white"
            >
              {card.category}
            </motion.p>
            <motion.p
              layoutId={layout ? `title-${card.title}` : undefined}
              className="mt-4 text-2xl font-semibold text-neutral-700 md:text-5xl dark:text-white"
            >
              {card.title}
            </motion.p>
            <div className="py-10">{card.content}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {typeof document !== "undefined" ? createPortal(modal, document.body) : null}
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="relative z-10 flex h-96 w-72 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[40rem] md:w-96 dark:bg-neutral-900"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="relative z-40 p-5 md:p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-left font-sans text-xs font-medium text-white md:text-base"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="mt-2 max-w-xs text-left font-sans text-lg font-semibold [text-wrap:balance] text-white md:text-3xl"
          >
            {card.title}
          </motion.p>
        </div>
        {card.visual ? (
          <div className="absolute inset-0 z-10 overflow-hidden">{card.visual}</div>
        ) : (
          <BlurImage
            src={card.src}
            alt={card.title}
            fill
            className="absolute inset-0 z-10 object-cover"
          />
        )}
        {card.topRightOverlay && (
          <div className="absolute top-3 right-3 z-50 pointer-events-none">
            {card.topRightOverlay}
          </div>
        )}
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <img
      className={cn(
        "h-full w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className,
      )}
      onLoad={() => setLoading(false)}
      src={src as string}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  );
};

