import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// import Autoplay from "embla-carousel-autoplay";

interface ImageCarouselProps {
  images: string[];
  initialIndex?: number;
  onSlideChange?: (index: number) => void;
}

export const ImageCarousel = ({
  images,
  initialIndex = 0,
  onSlideChange,
}: ImageCarouselProps) => {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const index = api.selectedScrollSnap();
      onSlideChange?.(index);
    };

    api.on("select", handleSelect);

    // dispara também quando inicializa
    handleSelect();

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, onSlideChange]);

  return (
    <div className="w-full my-12">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          startIndex: initialIndex,
        }}
        // plugins={[
        //   Autoplay({
        //     delay: 5000,
        //   }),
        // ]}
        className="w-full"
      >
        <CarouselContent>
          {images.map((image, idx) => (
            <CarouselItem key={`carousel-${idx}`}>
              <div className="flex items-center justify-center">
                <img
                  src={image}
                  alt={`Slide ${idx + 1}`}
                  className="max-h-[85vh] w-auto max-w-full object-contain mx-auto"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};