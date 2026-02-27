import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import { banners } from '@/assets/data.js'

export const BannerCarousel = () => {
  return (
    <div className="w-full mb-12">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        {/* <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <Card className="border-0 overflow-hidden">
                <div className="relative h-[300px] md:h-[400px] w-full">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/0 flex items-center">
                    <div className="container mx-auto px-8">
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        {banner.title}
                      </h2>
                      <p className="text-lg md:text-xl text-white/90 max-w-xl">
                        {banner.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent> */}
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="border bg-card text-card-foreground shadow-smborder-0 overflow-hidden">
                {/* Contêiner com proporção 4:2 (2:1) */}
                <div className="relative w-fulla aspect-[3/2] md:aspect-[3/1]">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Overlay com gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/0 flex items-center">
                    <div className="container mx-auto px-8">
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        {banner.title}
                      </h2>
                      <p className="text-lg md:text-xl text-white/90 max-w-xl">
                        {banner.description}
                      </p>
                    </div>
                  </div>
                </div>
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