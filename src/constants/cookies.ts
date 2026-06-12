// Unified Cookie list with your exact descriptions and specified ingredients
export const COOKIES = [
  { 
    id: 'choc',
    img: '/images/1.Chochlate_Indulgence.jpg', 
    price: 3.99, 
    origPrice: 4.50, 
    special: false,
    color: 'from-amber-800 to-amber-950',
    name: { en: 'Chocolate Indulgence', fi: 'Suklaaunelma' },
    desc: { 
      en: 'A rich chocolate cookie with plenty of chocolate chunks and a gooey hazelnut cocoa center.',
      fi: 'Täyteläinen suklaakeksi, jossa on runsaasti suklaalohkoja ja pehmeä hasselpähkinäsuklaasydän.' 
    },
    ingredients: { 
      en: ['Egg', 'Wheat', 'Milk'],
      fi: ['Kananmuna', 'Vehnä', 'Maito'] 
    }
  },
  { 
    id: 'nutella',
    img: '/images/1.Nutella_choch_chip.jpg', 
    price: 3.99, 
    origPrice: 4.50, 
    special: false,
    color: 'from-amber-600 to-amber-800',
    name: { en: 'Hazelnut Chocolate Chip', fi: 'Hasselpähkinä Suklaahippu' },
    desc: { 
      en: 'Classic cookie dough with chocolate chips and a soft hazelnut spread filling.',
      fi: 'Klassinen keksitaikina suklaahipuilla ja pehmeällä hasselpähkinälevitetäytteellä.' 
    },
    ingredients: { 
      en: ['Egg', 'Wheat', 'Milk', 'Hazelnut'],
      fi: ['Kananmuna', 'Vehnä', 'Maito', 'Hasselpähkinä'] 
    }
  },
  { 
    id: 'lotus',
    img: '/images/1.Lotus_Gold.png', 
    price: 3.99, 
    origPrice: 4.50, 
    special: false,
    color: 'from-yellow-700 to-amber-800',
    name: { en: 'Caramel Gold', fi: 'Karamelli Kulta' },
    desc: { 
      en: 'A caramelized biscuit cookie with white chocolate chips and a soft, gooey caramel filling.',
      fi: 'Karamellisoitu keksi valkosuklaahipuilla ja pehmeällä, valuvalla karamellitäytteellä.' 
    },
    ingredients: { 
      en: ['Egg', 'Wheat', 'Milk'],
      fi: ['Kananmuna', 'Vehnä', 'Maito'] 
    }
  },
  { 
    id: 'ruby',
    img: '/images/1.Ruby_Velvet_Bliss.jpg', 
    price: 3.99, 
    origPrice: 4.50, 
    special: false,
    color: 'from-rose-400 to-rose-600',
    name: { en: 'Ruby Velvet Bliss', fi: 'Ruby Velvet Bliss' },
    desc: { 
      en: 'Soft red cookie dough with white chocolate chips and a rich cream cheese filling in the center.',
      fi: 'Pehmeä punainen keksitaikina valkosuklaahipuilla ja täyteläisellä tuorejuustotäytteellä keskellä.' 
    },
    ingredients: { 
      en: ['Egg', 'Wheat', 'Food color'],
      fi: ['Kananmuna', 'Vehnä', 'Elintarvikeväri'] 
    }
  },
  { 
    id: 'carrot',
    img: '/images/1.Carrot_Cake_cookie.jpg', 
    price: 3.99, 
    origPrice: 4.50, 
    special: false,
    color: 'from-orange-500 to-amber-600',
    name: { en: 'Carrot Cake Cookie', fi: 'Porkkanakakku' },
    desc: { 
      en: 'A carrot cake-inspired cookie with toasted walnuts and a mildly spiced cream cheese filling.',
      fi: 'Porkkanakakusta inspiroitunut keksi paahdetuilla saksanpähkinöillä ja miedosti maustetulla tuorejuustotäytteellä.' 
    },
    ingredients: { 
      en: ['Egg', 'Wheat', 'Milk', 'Walnut', 'Carrot'],
      fi: ['Kananmuna', 'Vehnä', 'Maito', 'Saksanpähkinä', 'Porkkana'] 
    }
  },
  { 
    id: 'peanut',
    img: '/images/1.Peanut_Dusk.jpg', 
    price: 3.99, 
    origPrice: 4.50, 
    special: false,
    color: 'from-amber-700 to-amber-900',
    name: { en: 'Peanut Dusk', fi: 'Pähkinähämärä' },
    desc: { 
      en: 'A cookie with roasted peanuts, white and dark chocolate, and a rich peanut butter filling.',
      fi: 'Keksi paahdetuilla maapähkinöillä, valko- ja tummasuklaalla sekä täyteläisellä maapähkinävoitäytteellä.' 
    },
    ingredients: { 
      en: ['Egg', 'Wheat', 'Milk', 'Peanut'],
      fi: ['Kananmuna', 'Vehnä', 'Maito', 'Maapähkinä'] 
    }
  },
  { 
    id: 'jam',
    img: '/images/1.Jam_swirl.jpg', 
    price: 3.99, 
    origPrice: 4.50, 
    special: false,
    color: 'from-red-600 to-pink-700',
    name: { en: 'Jam Swirl', fi: 'Hillokierre' },
    desc: { 
      en: 'A chocolate cookie filled with a soft cream cheese and jam filling, finished with raspberry jam.',
      fi: 'Suklaakeksi, jossa pehmeä tuorejuusto- ja hillotäyte, viimeistelty vadelmahillolla.' 
    },
    ingredients: { 
      en: ['Egg', 'Wheat', 'Milk', 'Jam'],
      fi: ['Kananmuna', 'Vehnä', 'Maito', 'Hillo'] 
    }
  },
  { 
    id: 'funfetti',
    img: '/images/1.Funfetti_surprise.jpg', 
    price: 0, 
    origPrice: 0, 
    special: true,
    color: 'from-purple-400 to-pink-500',
    name: { en: 'Funfetti Surprise', fi: 'Funfetti-yllätys' },
    desc: { 
      en: 'A colorful birthday-cake treat with crisp Smarties and a molten milk chocolate core. Auto-added on orders of 8+ cookies!',
      fi: 'Värikäs herkkukeksi täynnä Smarties-suklaarakeita ja maitosuklaasydän. Lisätään lahjaksi 8+ keksin laatikoihin!' 
    },
    ingredients: { 
      en: ['Smarties', 'Milk chocolate chunks', 'Colorful sprinkles', 'Sweet butter dough'],
      fi: ['Smarties-rakeet', 'Maitosuklaapalat', 'Värikkäät strösselit', 'Voi-sokeritaikina'] 
    }
  }
];
