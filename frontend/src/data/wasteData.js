const wasteData = {
  plastic: {
    title: "Plastic Waste",
    type: "Non-biodegradable",
    description:
      "Plastic waste includes bottles, bags, containers, and packaging materials made of plastic.",
    whenToUse:
      "Used in packaging, food storage, bottles, household items.",
    whenNotToUse:
      "Avoid single-use plastics and plastic bags when alternatives are available.",
    disposal:
      "Clean and dry plastics should be sent for recycling. Contaminated plastics must be disposed properly.",
    recyclable: "Recyclable (depends on plastic type)"
  },

  food: {
    title: "Food Waste",
    type: "Biodegradable",
    description:
      "Food waste includes leftover food, vegetable peels, fruit waste, and expired food items.",
    whenToUse:
      "Generated from kitchens, restaurants, and food industries.",
    whenNotToUse:
      "Do not mix with plastic or hazardous waste.",
    disposal:
      "Can be composted or used for biogas generation.",
    recyclable: "Compostable"
  },

  ewaste: {
    title: "E-Waste",
    type: "Non-biodegradable / Hazardous",
    description:
      "E-waste includes electronic items like phones, laptops, chargers, batteries, and TVs.",
    whenToUse:
      "Generated when electronic devices stop working or become obsolete.",
    whenNotToUse:
      "Do not throw in household bins or burn.",
    disposal:
      "Must be given to authorized e-waste recyclers.",
    recyclable: "Partially recyclable"
  },

  hazardous: {
    title: "Hazardous Waste",
    type: "Hazardous",
    description:
      "Hazardous waste includes chemicals, paints, batteries, medical waste, and toxic substances.",
    whenToUse:
      "Generated in industries, hospitals, labs, and households (batteries, cleaners).",
    whenNotToUse:
      "Never mix with regular waste or pour into drains.",
    disposal:
      "Dispose only through authorized hazardous waste facilities.",
    recyclable: "Mostly non-recyclable"
  }
};

export default wasteData;
