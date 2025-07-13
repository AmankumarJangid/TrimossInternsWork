import React from "react";
import HeroSection from "./hero";
import FeaturedCollections from "./featured";
import TablesFurnitureSection from "./table-furniture";
import MuralsSection from "./murals";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedCollections />
      <TablesFurnitureSection />
      <MuralsSection />
    </div>
  );
};

export default Home;
