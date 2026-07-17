export type Dish = {
  id: string;
  title: string;
  category: string;
  country: string;
  date: string;
  rating: number;
  tags: string[];
};

export const DOMESTIC_DISHES: Dish[] = [
  {
    id: "d1",
    title: "Lasagna Classica",
    category: "Main Course",
    country: "Italy",
    date: "Oct 12, 2023",
    rating: 4.8,
    tags: ["Pasta", "Beef", "Béchamel", "Tomato"],
  },
  {
    id: "d2",
    title: "Borscht",
    category: "Soup",
    country: "Ukraine",
    date: "Nov 3, 2023",
    rating: 4.6,
    tags: ["Beet", "Beef", "Cabbage"],
  },
  {
    id: "d3",
    title: "Carbonara",
    category: "Main Course",
    country: "Italy",
    date: "Dec 1, 2023",
    rating: 4.9,
    tags: ["Pasta", "Guanciale", "Egg"],
  },
  {
    id: "d4",
    title: "Greek Salad",
    category: "Salad",
    country: "Greece",
    date: "Jan 15, 2024",
    rating: 4.2,
    tags: ["Feta", "Tomato", "Olives"],
  },
  {
    id: "d5",
    title: "Tiramisu",
    category: "Dessert",
    country: "Italy",
    date: "Feb 8, 2024",
    rating: 4.7,
    tags: ["Mascarpone", "Coffee", "Cocoa"],
  },
  {
    id: "d6",
    title: "Ramen Shoyu",
    category: "Soup",
    country: "Japan",
    date: "Mar 20, 2024",
    rating: 4.5,
    tags: ["Noodles", "Pork", "Egg"],
  },
];

export const TRAVEL_DISHES: Dish[] = [
  {
    id: "t1",
    title: "Pad Thai",
    category: "Main Course",
    country: "Thailand",
    date: "Jul 2, 2023",
    rating: 4.7,
    tags: ["Noodles", "Shrimp", "Peanut"],
  },
  {
    id: "t2",
    title: "Tom Yum",
    category: "Soup",
    country: "Thailand",
    date: "Jul 4, 2023",
    rating: 4.8,
    tags: ["Shrimp", "Lemongrass", "Chili"],
  },
  {
    id: "t3",
    title: "Croissant",
    category: "Dessert",
    country: "France",
    date: "Sep 10, 2023",
    rating: 4.9,
    tags: ["Butter", "Pastry"],
  },
  {
    id: "t4",
    title: "Paella",
    category: "Main Course",
    country: "Spain",
    date: "May 22, 2024",
    rating: 4.4,
    tags: ["Rice", "Seafood", "Saffron"],
  },
  {
    id: "t5",
    title: "Gazpacho",
    category: "Soup",
    country: "Spain",
    date: "May 23, 2024",
    rating: 3.9,
    tags: ["Tomato", "Cucumber", "Pepper"],
  },
];
