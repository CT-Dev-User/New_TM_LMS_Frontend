import React, { useState } from 'react';
import "./about.css";
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [titleRef, titleInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [carouselRef, carouselInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [imagesRef, imagesInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [visionRef, visionInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [1, 2, 3];

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-gray-50 to-gray-100">
      <main className="flex-grow p-6 md:p-12 lg:p-16">
        <div className="about-content max-w-6xl mx-auto">
          {/* Title Section */}
          <div 
            ref={titleRef}
            className={`transition-all duration-1000 ease-in-out ${titleInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-6 text-center md:text-left">About Us</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              We are dedicated to providing high-quality online courses to help you learn and grow. Our mission is to make education accessible, engaging, and impactful for everyone, everywhere.
            </p>
          </div>

          {/* Carousel Section */}
          <div 
            ref={carouselRef}
            className={`carousel relative mb-12 overflow-hidden transition-all duration-1000 ease-in-out ${carouselInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div 
              className="carousel-inner flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {slides.map((item) => (
                <img
                  key={item}
                  src={`https://picsum.photos/seed/${item}/1200/480`}
                  alt={`Slide ${item}`}
                  className="w-full h-96 object-cover rounded-lg shadow-xl"
                />
              ))}
            </div>
            <button 
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
              onClick={handlePrev}
            >
              ‹
            </button>
            <button 
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
              onClick={handleNext}
            >
              ›
            </button>
            <div className="carousel-controls absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${activeSlide === index ? 'bg-blue-600' : 'bg-gray-400'} hover:bg-blue-500 transition-colors`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div 
            ref={statsRef}
            className={`transition-all duration-1000 ease-in-out ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="stat-item text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <span className="text-4xl font-bold text-blue-600">2000+</span>
                <p className="text-gray-700 mt-2">Courses</p>
              </div>
              <div className="stat-item text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <span className="text-4xl font-bold text-blue-600">25K+</span>
                <p className="text-gray-700 mt-2">Happy Students</p>
              </div>
              <div className="stat-item text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <span className="text-4xl font-bold text-blue-600">AI</span>
                <p className="text-gray-700 mt-2">Powered Learning</p>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div 
            ref={imagesRef}
            className={`grid grid-cols-2 gap-6 md:grid-cols-3 transition-all duration-1000 ease-in-out ${imagesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <img 
                key={item}
                src={`https://picsum.photos/seed/${item}/400/300`}
                alt={`Educational Image ${item}`}
                className="object-cover h-56 w-full rounded-lg shadow-md hover:shadow-lg transition-shadow"
              />
            ))}
          </div>

          {/* Vision Section */}
          <div 
            ref={visionRef}
            className={`mt-16 transition-all duration-1000 ease-in-out ${visionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">Our Vision</h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              To revolutionize education by leveraging technology to create a learning environment that is both accessible and personalized, tailored to meet the unique needs of each learner.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;