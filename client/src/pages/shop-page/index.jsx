import React from "react";
import HeroSection from "./hero";
import TablesFurnitureSection from "../home/table-furniture";

import FeaturedCollections from "../home/featured";
import MuralsSection from "./murals";
import CondoProject from "./condo-project";
import QuoteSection from "./quote-section";

const ShopPage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedCollections />
      <TablesFurnitureSection />
      <MuralsSection/>
      <CondoProject />
      <QuoteSection/>
    </div>
  );
};

export default ShopPage;
