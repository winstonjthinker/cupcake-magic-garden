
import { CakeSlice, Cake, IceCream, Cookie } from 'lucide-react';

export const categoryData = {
  cupcakes: {
    title: "Cupcakes",
    description: "Delicious handcrafted cupcakes for every occasion",
    icon: CakeSlice,
    color: "from-cupcake-pink to-cupcake-darkPink",
    products: [
      {
        id: 1,
        title: "Vanilla Delight",
        description: "Classic vanilla cupcake with buttercream frosting and rainbow sprinkles",
        price: "$3.50",
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd",
        name: "Vanilla Delight",
        price_raw: 3.50,
        image_url: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd"
      },
      {
        id: 2,
        title: "Chocolate Dream",
        description: "Rich chocolate cupcake with chocolate ganache and chocolate shavings",
        price: "$3.75",
        image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb",
        name: "Chocolate Dream",
        price_raw: 3.75,
        image_url: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb"
      },
      {
        id: 3,
        title: "Strawberry Bliss",
        description: "Fresh strawberry cupcake with strawberry frosting and white chocolate drizzle",
        price: "$3.95",
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
        name: "Strawberry Bliss",
        price_raw: 3.95,
        image_url: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e"
      },
      {
        id: 4,
        title: "Red Velvet",
        description: "Classic red velvet cupcake with cream cheese frosting and red velvet crumbs",
        price: "$4.25",
        image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7",
        name: "Red Velvet",
        price_raw: 4.25,
        image_url: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7"
      },
      {
        id: 5,
        title: "Lemon Burst",
        description: "Tangy lemon cupcake with lemon curd filling and light lemon frosting",
        price: "$3.85",
        image: "https://images.unsplash.com/photo-1519869325930-281384150729",
        name: "Lemon Burst",
        price_raw: 3.85,
        image_url: "https://images.unsplash.com/photo-1519869325930-281384150729"
      },
      {
        id: 6,
        title: "Birthday Surprise",
        description: "Funfetti cupcake with vanilla frosting and colorful sprinkles",
        price: "$4.00",
        image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d",
        name: "Birthday Surprise",
        price_raw: 4.00,
        image_url: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d"
      },
    ]
  },
  cakes: {
    title: "Cakes",
    description: "Beautiful custom cakes for special celebrations",
    icon: Cake,
    color: "from-cupcake-blue to-cupcake-darkBlue",
    products: [
      {
        id: 1,
        title: "Chocolate Ganache Cake",
        description: "Three-layer chocolate cake with rich ganache and fresh berries",
        price: "$45.00",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
        name: "Chocolate Ganache Cake",
        price_raw: 45.00,
        image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
      },
      {
        id: 2,
        title: "Vanilla Bean Celebration",
        description: "Elegant vanilla cake with buttercream frosting and edible flowers",
        price: "$42.00",
        image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636",
        name: "Vanilla Bean Celebration",
        price_raw: 42.00,
        image_url: "https://images.unsplash.com/photo-1535141192574-5d4897c12636"
      },
      {
        id: 3,
        title: "Red Velvet Dream",
        description: "Classic red velvet cake with cream cheese frosting and chocolate drizzle",
        price: "$48.00",
        image: "https://images.unsplash.com/photo-1616541823729-00fe0aaed36c",
        name: "Red Velvet Dream",
        price_raw: 48.00,
        image_url: "https://images.unsplash.com/photo-1616541823729-00fe0aaed36c"
      },
      {
        id: 4,
        title: "Strawberry Shortcake",
        description: "Light vanilla sponge with fresh strawberries and whipped cream",
        price: "$40.00",
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5c3",
        name: "Strawberry Shortcake",
        price_raw: 40.00,
        image_url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5c3"
      },
      {
        id: 5,
        title: "Carrot Cake",
        description: "Moist carrot cake with walnuts and traditional cream cheese frosting",
        price: "$38.00",
        image: "https://images.unsplash.com/photo-1621303837158-877731acafc6",
        name: "Carrot Cake",
        price_raw: 38.00,
        image_url: "https://images.unsplash.com/photo-1621303837158-877731acafc6"
      },
      {
        id: 6,
        title: "Lemon Blueberry",
        description: "Zesty lemon cake with blueberry compote and lemon buttercream",
        price: "$44.00",
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad",
        name: "Lemon Blueberry",
        price_raw: 44.00,
        image_url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad"
      },
    ]
  },
  cakesicles: {
    title: "Cakesicles",
    description: "Delicious cake pops on a stick! Perfect for $2.50 each or $2.00 each for orders of 20+",
    icon: IceCream,
    color: "from-purple-300 to-purple-700",
    products: [
      {
        id: 1,
        title: "Birthday Cakesicle",
        description: "Vanilla cake with colorful sprinkles and white chocolate coating",
        price: "$2.50",
        image: "https://images.unsplash.com/photo-1596223430183-9e318f2d05e3",
        name: "Birthday Cakesicle",
        price_raw: 2.50,
        image_url: "https://images.unsplash.com/photo-1596223430183-9e318f2d05e3"
      },
      {
        id: 2,
        title: "Chocolate Drizzle",
        description: "Chocolate cake with milk chocolate coating and white chocolate drizzle",
        price: "$2.50",
        image: "https://images.unsplash.com/photo-1618426703623-c1b335803e07",
        name: "Chocolate Drizzle",
        price_raw: 2.50,
        image_url: "https://images.unsplash.com/photo-1618426703623-c1b335803e07"
      },
      {
        id: 3,
        title: "Red Velvet",
        description: "Red velvet cake with white chocolate coating and red velvet crumbs",
        price: "$2.50",
        image: "https://images.unsplash.com/photo-1627308595171-d1b5d67129c5",
        name: "Red Velvet",
        price_raw: 2.50,
        image_url: "https://images.unsplash.com/photo-1627308595171-d1b5d67129c5"
      },
      {
        id: 4,
        title: "Cookies & Cream",
        description: "Oreo cake with white chocolate coating and cookie crumbs",
        price: "$2.50",
        image: "https://images.unsplash.com/photo-1629385701021-fcd568a743e8",
        name: "Cookies & Cream",
        price_raw: 2.50,
        image_url: "https://images.unsplash.com/photo-1629385701021-fcd568a743e8"
      },
      {
        id: 5,
        title: "Strawberry Shortcake",
        description: "Strawberry cake with pink chocolate coating and white chocolate drizzle",
        price: "$2.50",
        image: "https://images.unsplash.com/photo-1551404973-7cea035e427e",
        name: "Strawberry Shortcake",
        price_raw: 2.50,
        image_url: "https://images.unsplash.com/photo-1551404973-7cea035e427e"
      },
      {
        id: 6,
        title: "Rainbow Sprinkle",
        description: "Vanilla cake with white chocolate coating and rainbow sprinkles",
        price: "$2.50",
        image: "https://images.unsplash.com/photo-1583255448430-17c5eda08e5c",
        name: "Rainbow Sprinkle",
        price_raw: 2.50,
        image_url: "https://images.unsplash.com/photo-1583255448430-17c5eda08e5c"
      },
    ]
  },
  "sweet-treats": {
    title: "Sweet Treats",
    description: "An assortment of cookies, brownies, and other sweet delights",
    icon: Cookie,
    color: "from-amber-300 to-amber-700",
    products: [
      {
        id: 1,
        title: "Chocolate Chip Cookies",
        description: "Classic chocolate chip cookies with walnuts",
        price: "$2.25",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
        name: "Chocolate Chip Cookies",
        price_raw: 2.25,
        image_url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e"
      },
      {
        id: 2,
        title: "Fudge Brownies",
        description: "Rich chocolate brownies with chocolate chips",
        price: "$3.00",
        image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7",
        name: "Fudge Brownies",
        price_raw: 3.00,
        image_url: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7"
      },
      {
        id: 3,
        title: "Macarons",
        description: "Assorted flavors of French macarons",
        price: "$2.50",
        image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43",
        name: "Macarons",
        price_raw: 2.50,
        image_url: "https://images.unsplash.com/photo-1569864358642-9d1684040f43"
      },
      {
        id: 4,
        title: "Lemon Bars",
        description: "Tangy lemon filling on a buttery shortbread crust",
        price: "$2.75",
        image: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c",
        name: "Lemon Bars",
        price_raw: 2.75,
        image_url: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c"
      },
      {
        id: 5,
        title: "Chocolate Truffles",
        description: "Handmade chocolate truffles in assorted flavors",
        price: "$1.50",
        image: "https://images.unsplash.com/photo-1548329408-c49d8c0b3e98",
        name: "Chocolate Truffles",
        price_raw: 1.50,
        image_url: "https://images.unsplash.com/photo-1548329408-c49d8c0b3e98"
      },
      {
        id: 6,
        title: "Cinnamon Rolls",
        description: "Freshly baked cinnamon rolls with cream cheese frosting",
        price: "$3.75",
        image: "https://images.unsplash.com/photo-1609150143086-7a777e2be0fc",
        name: "Cinnamon Rolls",
        price_raw: 3.75,
        image_url: "https://images.unsplash.com/photo-1609150143086-7a777e2be0fc"
      },
    ]
  }
};

export default categoryData;
