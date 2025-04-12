'use client'; // Force client-side rendering

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFlip } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-flip';

const SliderSection = () => {
  const slides = [
    { id: 1, image: '/image-120.png', title: 'Slide 1', description: 'Description for slide 1' },
    { id: 2, image: '/image-120.png', title: 'Slide 2', description: 'Description for slide 2' },
    { id: 3, image: '/image-120.png', title: 'Slide 3', description: 'Description for slide 3' },
  ];

  return (
    <div className="bg-[#000] text-white py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold">Featured Matches</h2>
        <p className="text-lg text-gray-400 mt-4">
          Check out the latest and greatest battles happening right now!
        </p>

        <div className="mt-10">
          <Swiper
            modules={[ Navigation, Pagination, Autoplay, EffectFlip ]}
            spaceBetween={30}
            slidesPerView={1}
            EffectFlip
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 1 },
              1024: { slidesPerView: 1 },
            }}
            className="w-full"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="bg-[#000] p-6 rounded-lg shadow-lg">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="rounded-lg w-full h-64 object-cover"
                  />
                  <h3 className="text-xl font-semibold mt-4">{slide.title}</h3>
                  <p className="text-gray-400 mt-2">{slide.description}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default SliderSection;
