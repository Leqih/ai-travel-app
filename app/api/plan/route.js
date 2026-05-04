const CITY_SPOTS = {
  Seoul: [
    { name: "Gyeongbokgung Palace",    address: "161 Sajik-ro, Jongno-gu, Seoul",          category: "culture",     time: "09:00", note: "Arrive early to catch the guard-changing ceremony at 10am.",        lat: 37.5796, lng: 126.9770 },
    { name: "Bukchon Hanok Village",   address: "Gyedong-gil, Jongno-gu, Seoul",            category: "culture",     time: "11:00", note: "Best photo spots are on the upper alleyways.",                       lat: 37.5826, lng: 126.9830 },
    { name: "Insadong",                address: "Insadong-gil, Jongno-gu, Seoul",            category: "shopping",    time: "13:00", note: "Great street food and traditional crafts.",                          lat: 37.5744, lng: 126.9856 },
    { name: "Myeongdong Street Food",  address: "Myeongdong-gil, Jung-gu, Seoul",            category: "food",        time: "18:00", note: "Try the egg bread and tteokbokki skewers.",                         lat: 37.5635, lng: 126.9850 },
    { name: "N Seoul Tower",           address: "105 Namsangongwon-gil, Yongsan-gu, Seoul", category: "attraction",  time: "20:00", note: "Take the cable car up for panoramic night views.",                   lat: 37.5512, lng: 126.9882 },
    { name: "Hongdae",                 address: "Hongdae, Mapo-gu, Seoul",                  category: "nightlife",   time: "22:00", note: "Lively indie music scene and street performances.",                  lat: 37.5563, lng: 126.9228 },
    { name: "Lotte World",             address: "240 Olympic-ro, Songpa-gu, Seoul",          category: "attraction",  time: "10:00", note: "Indoor and outdoor theme park, less crowded on weekdays.",           lat: 37.5111, lng: 127.0981 },
    { name: "Gangnam",                 address: "Gangnam-daero, Gangnam-gu, Seoul",          category: "shopping",    time: "14:00", note: "Upscale boutiques and the famous COEX Mall.",                       lat: 37.4979, lng: 127.0276 },
    { name: "Noryangjin Fish Market",  address: "674 Noryangjin-ro, Dongjak-gu, Seoul",     category: "food",        time: "07:00", note: "Buy fresh seafood and have it cooked on-site.",                     lat: 37.5138, lng: 126.9423 },
    { name: "Changdeokgung Palace",    address: "99 Yulgok-ro, Jongno-gu, Seoul",           category: "culture",     time: "09:30", note: "Book the Secret Garden tour for access to the rear gardens.",       lat: 37.5792, lng: 126.9910 },
    { name: "Dongdaemun Design Plaza", address: "281 Eulji-ro, Jung-gu, Seoul",              category: "attraction",  time: "15:00", note: "Zaha Hadid's futuristic building is stunning at night.",            lat: 37.5671, lng: 127.0096 },
    { name: "Han River Park",          address: "Yeouido Hangang Park, Yeongdeungpo-gu",    category: "nature",      time: "17:00", note: "Rent a bike or pick up convenience store snacks by the river.",     lat: 37.5284, lng: 126.9330 },
  ],
  Tokyo: [
    { name: "Senso-ji Temple",         address: "2-3-1 Asakusa, Taito City, Tokyo",         category: "culture",     time: "08:00", note: "Go before 9am to avoid crowds and get a fortune slip.",             lat: 35.7148, lng: 139.7967 },
    { name: "Shibuya Crossing",        address: "2-2-1 Dogenzaka, Shibuya, Tokyo",          category: "attraction",  time: "10:30", note: "Watch from the Starbucks or MAGNET by Shibuya109 rooftop.",         lat: 35.6595, lng: 139.7004 },
    { name: "Harajuku & Takeshita St", address: "1-17-5 Jingumae, Shibuya, Tokyo",         category: "shopping",    time: "12:00", note: "Crepes, vintage fashion, and pop culture streetwear.",               lat: 35.6702, lng: 139.7027 },
    { name: "Meiji Shrine",            address: "1-1 Yoyogikamizonocho, Shibuya, Tokyo",   category: "culture",     time: "14:00", note: "A peaceful forest walk minutes from the Harajuku crowds.",           lat: 35.6763, lng: 139.6993 },
    { name: "Shinjuku Gyoen",          address: "11 Naitomachi, Shinjuku City, Tokyo",      category: "nature",      time: "09:00", note: "Perfect for cherry blossom season; brings your own picnic.",         lat: 35.6851, lng: 139.7100 },
    { name: "Tsukiji Outer Market",    address: "4-16-2 Tsukiji, Chuo City, Tokyo",         category: "food",        time: "07:30", note: "Fresh sushi breakfast is a must — arrive before 9am.",               lat: 35.6654, lng: 139.7707 },
    { name: "Tokyo Skytree",           address: "1-1-2 Oshiage, Sumida City, Tokyo",        category: "attraction",  time: "17:00", note: "Book tickets online; sunset views are spectacular.",                lat: 35.7101, lng: 139.8107 },
    { name: "Akihabara",               address: "Sotokanda, Chiyoda City, Tokyo",           category: "shopping",    time: "13:00", note: "Electronics, anime, and maid cafés across multiple floors.",         lat: 35.7022, lng: 139.7741 },
    { name: "Odaiba",                  address: "Daiba, Minato City, Tokyo",                category: "attraction",  time: "15:00", note: "TeamLab Borderless digital art museum is nearby.",                   lat: 35.6267, lng: 139.7759 },
    { name: "Ginza",                   address: "Ginza, Chuo City, Tokyo",                  category: "shopping",    time: "11:00", note: "Tokyo's upscale retail district — great for window shopping.",       lat: 35.6717, lng: 139.7650 },
    { name: "Shinjuku Kabukicho",      address: "Kabukicho, Shinjuku City, Tokyo",          category: "nightlife",   time: "21:00", note: "Explore the Golden Gai alleyways for tiny bars with character.",    lat: 35.6959, lng: 139.7038 },
    { name: "Ueno Park & Museums",     address: "Uenokoen, Taito City, Tokyo",              category: "culture",     time: "10:00", note: "National Museum, zoo, and street performers all in one park.",       lat: 35.7157, lng: 139.7736 },
  ],
  Bangkok: [
    { name: "Grand Palace",            address: "Na Phra Lan Rd, Phra Nakhon, Bangkok",    category: "culture",     time: "09:00", note: "Dress modestly — shoulders and knees must be covered.",              lat: 13.7500, lng: 100.4913 },
    { name: "Wat Pho",                 address: "2 Sanam Chai Rd, Phra Nakhon, Bangkok",   category: "culture",     time: "11:00", note: "Home to the 46m reclining Buddha; get a traditional massage.",      lat: 13.7466, lng: 100.4930 },
    { name: "Chatuchak Weekend Market",address: "Kamphaeng Phet 2 Rd, Chatuchak, Bangkok", category: "shopping",    time: "08:00", note: "Over 8,000 stalls — go early before the heat.",                     lat: 13.7999, lng: 100.5500 },
    { name: "Khao San Road",           address: "Khao San Rd, Phra Nakhon, Bangkok",       category: "nightlife",   time: "20:00", note: "Backpacker hub with street food, bars, and live music.",            lat: 13.7587, lng: 100.4971 },
    { name: "Asiatique The Riverfront",address: "2194 Charoen Krung Rd, Bang Kho Laem",   category: "shopping",    time: "17:00", note: "Open-air night market along the Chao Phraya river.",                lat: 13.7028, lng: 100.5003 },
    { name: "Lumphini Park",           address: "Rama IV Rd, Pathum Wan, Bangkok",         category: "nature",      time: "06:30", note: "Morning Tai Chi and monitor lizards in the lake.",                  lat: 13.7309, lng: 100.5418 },
    { name: "Terminal 21 Mall",        address: "88 Sukhumvit Soi 19, Wattana, Bangkok",   category: "shopping",    time: "14:00", note: "Each floor is a different world city — fun concept mall.",          lat: 13.7374, lng: 100.5601 },
    { name: "Yaowarat (Chinatown)",    address: "Yaowarat Rd, Samphanthawong, Bangkok",    category: "food",        time: "19:00", note: "Best street food in the city comes alive after dark.",              lat: 13.7398, lng: 100.5105 },
    { name: "Wat Arun",                address: "158 Wang Doem Rd, Bangkok Yai, Bangkok",  category: "culture",     time: "15:00", note: "Great views across the river at sunset from the temple.",           lat: 13.7437, lng: 100.4888 },
    { name: "Icon Siam",               address: "299 Charoen Nakhon Rd, Khlong San",       category: "shopping",    time: "16:00", note: "Luxury mall with an indoor floating market on the ground floor.",  lat: 13.7221, lng: 100.5099 },
    { name: "Floating Markets",        address: "Damnoen Saduak, Ratchaburi Province",     category: "culture",     time: "07:00", note: "Book a day trip — most stalls wrap up by noon.",                   lat: 13.5219, lng: 99.9567  },
    { name: "Silom Night Bazaar",      address: "Silom Rd, Bang Rak, Bangkok",             category: "nightlife",   time: "21:00", note: "Street vendors, cocktails, and live music along Silom Road.",      lat: 13.7260, lng: 100.5265 },
  ],
  Paris: [
    { name: "Eiffel Tower",            address: "Champ de Mars, 5 Av. Anatole France, Paris", category: "attraction", time: "08:30", note: "Book summit tickets online weeks ahead; sunrise is magical.",     lat: 48.8584, lng: 2.2945  },
    { name: "Louvre Museum",           address: "Rue de Rivoli, 75001 Paris",               category: "culture",     time: "10:00", note: "Download the free app and focus on a few wings to avoid fatigue.", lat: 48.8606, lng: 2.3376  },
    { name: "Le Marais",               address: "Le Marais, 75004 Paris",                   category: "shopping",    time: "14:00", note: "Best vintage shops, falafel on Rue des Rosiers, and galleries.",  lat: 48.8550, lng: 2.3570  },
    { name: "Montmartre & Sacré-Cœur", address: "35 Rue du Chevalier de la Barre, Paris",  category: "culture",     time: "16:00", note: "Watch street artists and catch sunset from the steps.",           lat: 48.8867, lng: 2.3431  },
    { name: "Seine River Cruise",      address: "Port de la Bourdonnais, Paris",            category: "attraction",  time: "20:00", note: "The city looks best lit up at night from the water.",             lat: 48.8600, lng: 2.2986  },
    { name: "Musée d'Orsay",           address: "1 Rue de la Légion d'Honneur, Paris",     category: "culture",     time: "09:30", note: "Impressionism masterpieces — less crowded than the Louvre.",      lat: 48.8600, lng: 2.3266  },
    { name: "Saint-Germain-des-Prés",  address: "Place Saint-Germain des Prés, Paris",     category: "food",        time: "11:00", note: "Home to Café de Flore — try a croque-monsieur and café au lait.", lat: 48.8539, lng: 2.3330  },
    { name: "Palais Royal Gardens",    address: "8 Rue de Montpensier, 75001 Paris",        category: "nature",      time: "13:00", note: "Hidden gem with striped columns and boutique arcades.",           lat: 48.8638, lng: 2.3370  },
    { name: "Champs-Élysées",          address: "Av. des Champs-Élysées, Paris",            category: "shopping",    time: "15:00", note: "Walk to the Arc de Triomphe; the view from the top is worth it.", lat: 48.8698, lng: 2.3078  },
    { name: "Moulin Rouge Area",       address: "82 Bd de Clichy, 75018 Paris",             category: "nightlife",   time: "21:00", note: "Book a show in advance — Pigalle neighborhood buzzes at night.",  lat: 48.8841, lng: 2.3323  },
    { name: "Luxembourg Gardens",      address: "Rue de Médicis, 75006 Paris",              category: "nature",      time: "10:00", note: "Bring a baguette and enjoy the fountain views.",                  lat: 48.8462, lng: 2.3372  },
    { name: "Marché d'Aligre",         address: "Place d'Aligre, 75012 Paris",              category: "food",        time: "08:00", note: "Best local food market in Paris, open Tuesday through Sunday.",   lat: 48.8493, lng: 2.3739  },
  ],
  Bali: [
    { name: "Tanah Lot Temple",        address: "Beraban, Kediri, Tabanan Regency, Bali",  category: "culture",     time: "17:00", note: "Come for sunset — the sea temple silhouette is iconic.",           lat: -8.6215, lng: 115.0866 },
    { name: "Ubud Monkey Forest",      address: "Jl. Monkey Forest, Ubud, Bali",           category: "nature",      time: "09:00", note: "Keep bags zipped and remove sunglasses — monkeys will grab them.", lat: -8.5189, lng: 115.2594 },
    { name: "Tegallalang Rice Terraces",address: "Tegallalang, Gianyar Regency, Bali",     category: "nature",      time: "07:00", note: "Go before 8am for no crowds and golden morning light.",           lat: -8.4315, lng: 115.2794 },
    { name: "Seminyak Beach",          address: "Seminyak, Kuta, Badung Regency, Bali",    category: "nature",      time: "16:00", note: "Best beach for sunset drinks at Potato Head Beach Club.",         lat: -8.6892, lng: 115.1607 },
    { name: "Uluwatu Temple",          address: "Pecatu, South Kuta, Badung Regency, Bali",category: "culture",     time: "17:30", note: "Watch the Kecak fire dance at sunset — book ahead.",              lat: -8.8291, lng: 115.0849 },
    { name: "Ubud Art Market",         address: "Jl. Raya Ubud, Ubud, Bali",               category: "shopping",    time: "10:00", note: "Bargain for sarongs, wood carvings, and silver jewelry.",         lat: -8.5069, lng: 115.2625 },
    { name: "Mount Batur Sunrise Trek",address: "Kintamani, Bangli Regency, Bali",         category: "nature",      time: "02:00", note: "2-hour hike; arrange a guide the night before for 4am start.",   lat: -8.2420, lng: 115.3750 },
    { name: "Tirta Empul Temple",      address: "Tampaksiring, Gianyar Regency, Bali",     category: "culture",     time: "09:00", note: "Participate in the holy spring purification ritual.",             lat: -8.4152, lng: 115.3156 },
    { name: "Nusa Penida Day Trip",    address: "Nusa Penida Island, Bali",                category: "nature",      time: "07:00", note: "Kelingking Beach is the highlight — bring cash, no ATMs.",        lat: -8.7278, lng: 115.5444 },
    { name: "Ku De Ta",                address: "Jl. Kayu Aya No.9, Seminyak, Bali",       category: "nightlife",   time: "19:00", note: "Beachfront dining with live DJ and world-class cocktails.",       lat: -8.6875, lng: 115.1602 },
    { name: "Jimbaran Seafood",        address: "Jimbaran Bay, Badung Regency, Bali",      category: "food",        time: "18:00", note: "Fresh grilled seafood on the beach at candlelit tables.",         lat: -8.7974, lng: 115.1668 },
    { name: "Pura Besakih",            address: "Besakih, Rendang, Karangasem Regency",   category: "culture",     time: "08:00", note: "Bali's most sacred temple — hire a local guide at the entrance.", lat: -8.3742, lng: 115.4526 },
  ],
  "New York": [
    { name: "Central Park",            address: "Central Park, New York, NY",               category: "nature",      time: "08:00", note: "Rent a bike or watch the rowboats on the lake.",                  lat: 40.7851, lng: -73.9683 },
    { name: "Metropolitan Museum",     address: "1000 5th Ave, New York, NY 10028",        category: "culture",     time: "10:00", note: "Egyptian wing and rooftop garden are highlights.",                lat: 40.7794, lng: -73.9632 },
    { name: "Times Square",            address: "Times Square, New York, NY",               category: "attraction",  time: "20:00", note: "Most vibrant at night — explore the side streets for better food.", lat: 40.7580, lng: -73.9855 },
    { name: "Brooklyn Bridge",         address: "Brooklyn Bridge, New York, NY",            category: "attraction",  time: "07:00", note: "Walk from Manhattan to Brooklyn side for great skyline photos.",  lat: 40.7061, lng: -73.9969 },
    { name: "High Line Park",          address: "New York, NY 10011",                       category: "nature",      time: "11:00", note: "Elevated rail park — start at 34th St and walk south to Chelsea.", lat: 40.7480, lng: -74.0048 },
    { name: "Chelsea Market",          address: "75 9th Ave, New York, NY 10011",          category: "food",        time: "12:00", note: "Food hall with everything from lobster rolls to Mexican tacos.",  lat: 40.7424, lng: -74.0060 },
    { name: "MOMA",                    address: "11 W 53rd St, New York, NY 10019",        category: "culture",     time: "14:00", note: "Picasso, Warhol, and Van Gogh's Starry Night in one building.",   lat: 40.7614, lng: -73.9776 },
    { name: "One World Observatory",   address: "285 Fulton St, New York, NY 10007",       category: "attraction",  time: "16:00", note: "Best views in NYC — book tickets online to skip the line.",       lat: 40.7127, lng: -74.0134 },
    { name: "Smorgasburg",             address: "90 Kent Ave, Brooklyn, NY 11211",         category: "food",        time: "11:00", note: "Saturday outdoor food market in Williamsburg, Brooklyn.",         lat: 40.7196, lng: -73.9636 },
    { name: "Williamsburg",            address: "Williamsburg, Brooklyn, NY",               category: "shopping",    time: "14:00", note: "Indie boutiques, vintage stores, and excellent coffee shops.",    lat: 40.7081, lng: -73.9571 },
    { name: "Speakeasy Bar Crawl",     address: "Lower East Side, New York, NY",           category: "nightlife",   time: "21:00", note: "The LES has the best hidden cocktail bars in the city.",          lat: 40.7157, lng: -73.9863 },
    { name: "Statue of Liberty",       address: "Liberty Island, New York, NY 10004",      category: "attraction",  time: "09:00", note: "Book the crown entry months ahead; ferry tickets sell out fast.",  lat: 40.6892, lng: -74.0445 },
  ],
};

const GENERIC_SPOTS = [
  { name: "Old Town District",       address: "City Center",           category: "culture",    time: "09:00", note: "Start your day exploring the historic heart of the city.",   lat: null, lng: null },
  { name: "Local Food Market",       address: "Central Market Area",   category: "food",       time: "11:00", note: "Sample local street food and pick up fresh produce.",         lat: null, lng: null },
  { name: "Main Museum",             address: "Museum Quarter",        category: "culture",    time: "14:00", note: "The city's top museum covers local history and art.",         lat: null, lng: null },
  { name: "Waterfront Promenade",    address: "Waterfront",            category: "nature",     time: "17:00", note: "Golden hour stroll with views of the skyline.",               lat: null, lng: null },
  { name: "Night Market",            address: "Downtown Area",         category: "nightlife",  time: "20:00", note: "Evening atmosphere with local vendors and live music.",        lat: null, lng: null },
  { name: "Botanical Gardens",       address: "City Park",             category: "nature",     time: "09:00", note: "Peaceful morning walk through curated gardens.",              lat: null, lng: null },
  { name: "Artisan Quarter",         address: "Creative District",     category: "shopping",   time: "12:00", note: "Local galleries, craft shops, and independent cafés.",        lat: null, lng: null },
  { name: "City Viewpoint",          address: "Hilltop Lookout",       category: "attraction", time: "16:00", note: "Best panoramic views of the city and surrounding landscape.", lat: null, lng: null },
  { name: "Traditional Restaurant",  address: "Restaurant Row",        category: "food",       time: "19:00", note: "Authentic local cuisine in a traditional setting.",           lat: null, lng: null },
  { name: "Cultural Temple / Site",  address: "Heritage Area",         category: "culture",    time: "08:30", note: "A must-see landmark reflecting the city's heritage.",         lat: null, lng: null },
  { name: "Shopping Street",         address: "Main Shopping District",category: "shopping",   time: "15:00", note: "Mix of local brands and international stores.",               lat: null, lng: null },
  { name: "Rooftop Bar",             address: "City Center Hotel Zone",category: "nightlife",  time: "21:00", note: "Cocktails with a view — perfect way to end the night.",       lat: null, lng: null },
];

export async function POST(request) {
  const { city, duration } = await request.json();
  const days = parseInt(duration) || 3;

  const pool = CITY_SPOTS[city] || GENERIC_SPOTS;

  const itinerary = {};
  for (let i = 1; i <= days; i++) {
    const daySpots = [];
    for (let j = 0; j < 4; j++) {
      const idx = ((i - 1) * 4 + j) % pool.length;
      daySpots.push(pool[idx]);
    }
    itinerary[String(i)] = daySpots;
  }

  return Response.json({ itinerary });
}
