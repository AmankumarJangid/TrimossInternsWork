import React from "react";
import HeroSection from "./hero";
import FeaturedCollections from "./featured";
import TablesFurnitureSection from "./table-furniture";
import MuralsSection from "./murals";

const Home = () => {
  return (
    <main className="w-full overflow-x-hidden">
      <HeroSection />
      <FeaturedCollections />
      <TablesFurnitureSection />
      <MuralsSection />
    </main>
  );
};

export default Home;