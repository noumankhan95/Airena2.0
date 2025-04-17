import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const slide = {
  title: 'The Ultimate Gaming & Sports Streaming Platform',
  description: 'Join the next generation of competitive gaming and sports streaming',
  image: '/heroimg.png'
};

const SHero = () => {



  const router = useRouter()
  return (
    <section className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Background Image */}
      <Image src={slide.image} alt={slide.title} fill style={{ objectFit: 'cover', width: '100%', height: '100%' }} className="opacity-40" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-start  m-0">
        <div className="relative z-10 max-w-lg p-5">
          <h1 className="text-4xl md:text-6xl font-bold">{slide.title}</h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300">{slide.description}</p>
          <div className="mt-6 flex gap-4">
            {/* ✅ Removed the <Link> tag to prevent unwanted behavior */}
            <Button
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.9 }}
              className="bg-green-500 text-black font-semibold px-6 py-3 rounded-lg"
              onClick={() => {
                router.push('/CreatorPanel')
              }} // Scroll function
            >
              Join Now
            </Button>
          </div>
        </div>
      </div>
    </section>

  );

}

export default SHero;
