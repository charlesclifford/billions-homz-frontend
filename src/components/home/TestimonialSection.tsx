"use client";
import Autoplay from "embla-carousel-autoplay";
import SmallTitle from "../shared/SmallTitle";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "../ui/carousel";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    id: 1,
    quote:
      "Your team were great to work with on our basement remodel! I will definitely be working with them for future projects!",
    name: "Floyd Miles",
    role: "Assistant Project Manager",
    image:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/04/h2_testimonial-img2.jpg",
  },
  {
    id: 2,
    quote:
      "Excellent service and attention to detail. The results exceeded our expectations!",
    name: "Jane Smith",
    role: "Homeowner",
    image:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/04/h2_testimonial-img3.jpg",
  },
  {
    id: 3,
    quote:
      "Professional team that delivered on time and within budget. Highly recommended!",
    name: "Robert Johnson",
    role: "Project Coordinator",
    image:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/04/h2_testimonial-img1.jpg",
  },
  {
    id: 4,
    quote:
      "Your team were great to work with on our basement remodel! I will definitely be working with them for future projects!",
    name: "Floyd Miles",
    role: "Assistant Project Manager",
    image:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/04/h2_testimonial-img2.jpg",
  },
  {
    id: 5,
    quote:
      "Excellent service and attention to detail. The results exceeded our expectations!",
    name: "Jane Smith",
    role: "Homeowner",
    image:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/04/h2_testimonial-img3.jpg",
  },
  {
    id: 6,
    quote:
      "Professional team that delivered on time and within budget. Highly recommended!",
    name: "Robert Johnson",
    role: "Project Coordinator",
    image:
      "https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/04/h2_testimonial-img1.jpg",
  },
];

const TestimonialSection = () => {
  return (
    <div className="about-section w-full container mx-auto px-4 bg-[#1b1f12]">
      <div className="w-full max-w-[min(100%,1290px)] mx-auto py-[150px] flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_auto]">
          <div>
            <SmallTitle
              text="Testimonials"
              className="text-white"
              borderClass="border-white"
            />

            <div className="mt-[30px] text-white">
              <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-2px]">
                Happy users feedback
              </h2>
            </div>
          </div>
          <div></div>
        </div>

        <div className="mt-[60px] relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: "auto",
            }}
            className="w-full"
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
          >
            <CarouselContent>
              {testimonials.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-[30px] md:basis-1/2 lg:basis-1/3"
                >
                  <TestimonialCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
