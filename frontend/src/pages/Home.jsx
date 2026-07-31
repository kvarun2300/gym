import React from 'react';
import Hero from '../components/landing/Hero';
import WhyChooseUs from '../components/landing/WhyChooseUs';
import Programs from '../components/landing/Programs';
import Membership from '../components/landing/Membership';
import Trainers from '../components/landing/Trainers';
import Gallery from '../components/landing/Gallery';
import BmiCalculator from '../components/landing/BmiCalculator';
import FacilitiesNutrition from '../components/landing/FacilitiesNutrition';
import Testimonials from '../components/landing/Testimonials';
import Contact from '../components/landing/Contact';
import CtaBanner from '../components/landing/CtaBanner';

const Home = () => {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <Programs />
      <Membership />
      <Trainers />
      <Gallery />
      <BmiCalculator />
      <FacilitiesNutrition />
      <Testimonials />
      <Contact />
      <CtaBanner />
    </>
  );
};

export default Home;
