"use client";
import { useRouter, useParams } from "next/navigation";

const S = {
  bg:      "#09090f",
  glass:   "rgba(20,20,20,0.7)",
  border:  "rgba(255,255,255,0.08)",
  text:    "#fff",
  textDim: "rgba(255,255,255,0.45)",
  accent:  "#ff8c42",
  font:    `-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif`,
};

// City cover images — same ones used across the app
const CITY_IMAGES = {
  "Tokyo":  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
  "Kyoto":  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop",
  "Osaka":  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
  "Bali":   "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
  "Seoul":  "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&h=400&fit=crop",
};

const BLOGS = {
  "japan-hiking": {
    tag: "Outdoor",
    title: "Japan's Best Hiking Trails",
    subtitle: "From volcanic peaks to ancient forest paths — the trails every adventurer must walk",
    hero: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=480&fit=crop",
    readTime: "6 min read",
    plan: { city: "Tokyo", duration: "5 Days", label: "Mt. Fuji & Tokyo Trek" },
    sections: [
      {
        title: "Mt. Fuji — The Iconic Summit",
        body: "Standing at 3,776 m, Mt. Fuji is Japan's tallest peak and a UNESCO World Heritage Site. The Yoshida Trail from the 5th Station takes around 5–6 hours to summit. Go between July and early September when mountain huts are open and weather is most stable.",
        spots: ["Fuji Subaru Line 5th Station", "Yoshida Trail", "Kawaguchiko Lake viewpoint"],
        img: "https://picsum.photos/seed/fujisan/600/340",
      },
      {
        title: "Kumano Kodo — Sacred Pilgrimage Route",
        body: "This ancient network of pilgrimage trails threads through the forested Kii Peninsula. The Nakahechi route connects the grand shrines of Kumano and rewards hikers with cedar forests, stone-paved paths, and remote onsen villages. Allow 3–5 days for the full traverse.",
        spots: ["Takijiri-oji starting point", "Kumano Hongu Taisha", "Yunomine Onsen"],
        img: "https://picsum.photos/seed/kumano/600/340",
      },
      {
        title: "Nakasendo — The Old Mountain Road",
        body: "Walk the historic postal road between Kyoto and Tokyo, passing through preserved Edo-era post towns. The 8 km stretch between Magome and Tsumago is largely car-free, paved with stone, and lined with wooden inns.",
        spots: ["Magome-juku", "Tsumago-juku", "Nagiso River crossing"],
        img: "https://picsum.photos/seed/nakasendo/600/340",
      },
    ],
    tips: [
      "Book mountain huts months in advance for Fuji season",
      "Pack layers — temperatures drop sharply above 2,000 m",
      "IC card (Suica) works at convenience stores near trailheads",
      "Download offline maps before heading into rural areas",
    ],
  },

  "kyoto-alleys": {
    tag: "Deep Dive",
    title: "Hidden Alleys of Kyoto",
    subtitle: "Beneath the temple crowds lies a city of whispered lanes, lantern-lit bars, and centuries-old craft",
    hero: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=480&fit=crop",
    readTime: "5 min read",
    plan: { city: "Kyoto", duration: "3 Days", label: "Kyoto Hidden Gems" },
    sections: [
      {
        title: "Nishiki Market — Kyoto's Kitchen",
        body: "A narrow five-block covered arcade with over 100 vendors selling pickled vegetables, fresh tofu, dashi broths, and matcha sweets. Arrive before 10 am to beat the lunch crowds and chat with vendors.",
        spots: ["Nishiki Market arcade", "Daiyasu tofu shop", "Aritsugu knife store"],
        img: "https://picsum.photos/seed/nishikimarket/600/340",
      },
      {
        title: "Gion Alleyways — Where Geiko Still Walk",
        body: "Hanamikoji-dori is Gion's famous main street, but the real magic is in the yokocho (side lanes). Shimbashi-dori at dusk — wooden machiya townhouses reflected in the Shirakawa canal — is one of Japan's most photographed scenes.",
        spots: ["Hanamikoji-dori", "Shimbashi-dori canal", "Tatsumi Bridge at sunset"],
        img: "https://picsum.photos/seed/gionkyoto/600/340",
      },
      {
        title: "Philosopher's Path — Contemplative Walk",
        body: "A 2 km stone path following the Shishigatani canal, lined with hundreds of cherry trees. In spring the blossoms form a tunnel overhead; in autumn the maples turn the path crimson.",
        spots: ["Nanzen-ji entry point", "Eikan-do Zenrin-ji", "Ginkaku-ji (Silver Pavilion)"],
        img: "https://picsum.photos/seed/philosopherpath/600/340",
      },
    ],
    tips: [
      "Stay in a machiya guesthouse for the full atmosphere",
      "Hire a licensed guide for Gion evening walks — photography rules are strict",
      "Avoid Arashiyama on weekends — visit early morning instead",
      "Many hidden bars are member-only; ask your ryokan concierge",
    ],
  },

  "osaka-food": {
    tag: "Food",
    title: "Osaka Street Food Map",
    subtitle: "The city that invented kuidaore ('eat until you drop') — every block is a new flavour",
    hero: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=480&fit=crop",
    readTime: "7 min read",
    plan: { city: "Osaka", duration: "4 Days", label: "Osaka Food Trail" },
    sections: [
      {
        title: "Dotonbori — Neon & Takoyaki",
        body: "Osaka's most iconic eating district buzzes day and night. The canal-side strip is famous for giant neon signs and endless stalls selling takoyaki, okonomiyaki, and kushikatsu. Ichiran ramen has a branch here for solo slurping in private booths.",
        spots: ["Dotonbori canal walk", "Wanaka takoyaki stall", "Daruma kushikatsu"],
        img: "https://picsum.photos/seed/dotonbori/600/340",
      },
      {
        title: "Kuromon Ichiba — The Professional's Market",
        body: "Known as 'Osaka's Kitchen', this 580 m covered market has supplied the city's restaurants for 190 years. 170 shops sell premium wagyu, live seafood, and ready-to-eat bites. Try the uni toast for breakfast.",
        spots: ["Kuromon Ichiba entrance", "Yamamoto beef stall", "Endo Sushi counter"],
        img: "https://picsum.photos/seed/kuromonchoiba/600/340",
      },
      {
        title: "Shinsekai — Retro & Deep-Fried",
        body: "Built in 1912 to evoke Paris and New York, Shinsekai now has a retro, working-class charm. Tsutenkaku Tower looms overhead while ground level is a strip of kushikatsu restaurants and vintage game arcades.",
        spots: ["Tsutenkaku Tower", "Yaekatsu kushikatsu", "Jan Jan Yokocho alley"],
        img: "https://picsum.photos/seed/shinsekai/600/340",
      },
    ],
    tips: [
      "Eat standing (tachigui) for the most local experience",
      "Get an Osaka Amazing Pass for unlimited metro + attraction entry",
      "Late night: Fukushima district has izakayas frequented by chefs after service",
      "Never double-dip the kushikatsu sauce — it's a serious rule",
    ],
  },

  "tokyo-culture": {
    tag: "Culture",
    title: "Tokyo's Festivals & Crafts",
    subtitle: "Ancient matsuri, living artisans, and the modern makers reshaping Japanese craft",
    hero: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=480&fit=crop",
    readTime: "5 min read",
    plan: { city: "Tokyo", duration: "4 Days", label: "Tokyo Culture Immersion" },
    sections: [
      {
        title: "Matsuri — Festival Calendar",
        body: "Tokyo's festival calendar runs year-round. The Sanja Matsuri (May) at Asakusa sees 1.5 million visitors over three days. Sumida River Fireworks (July) is the city's biggest hanabi display. Koenji Awa Odori (August) floods the streets with thousands of dancers.",
        spots: ["Senso-ji Temple, Asakusa", "Sumida River fireworks spots", "Koenji station area"],
        img: "https://picsum.photos/seed/tokyomatsuri/600/340",
      },
      {
        title: "Traditional Crafts — Living Techniques",
        body: "Tokyo's shitamachi districts preserve craft traditions going back centuries. In Asakusa, artisans hand-press washi paper and assemble lacquerware. Kappabashi-dori has copper pot makers and knife sharpeners operating in open workshops.",
        spots: ["Kappabashi-dori cookware street", "Tokyo Traditional Craft Museum", "Yanaka craft quarter"],
        img: "https://picsum.photos/seed/tokyocraft/600/340",
      },
      {
        title: "Modern Makers — New Tokyo Craft",
        body: "A new generation of designers is reinterpreting Japanese craft for contemporary life. Nakameguro and Daikanyama house design studios selling hand-thrown ceramics, natural-dye textiles, and artisan coffee equipment.",
        spots: ["Nakameguro canal design shops", "Daikanyama T-Site complex", "2k540 AKI-OKA artisan market"],
        img: "https://picsum.photos/seed/nakameguro/600/340",
      },
    ],
    tips: [
      "Festival dates shift annually — check the Tokyo Tourism website before booking",
      "Many craft workshops require advance reservation",
      "Carry cash — traditional craft shops rarely take cards",
      "Harajuku on Sundays shows Tokyo's living costume culture",
    ],
  },

  "bali-wellness": {
    tag: "Wellness",
    title: "Bali's Best Retreat Spots",
    subtitle: "Rice terrace yoga, volcanic river bathing, and the healing traditions of the island of the gods",
    hero: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=480&fit=crop",
    readTime: "6 min read",
    plan: { city: "Bali", duration: "7 Days", label: "Bali Wellness Retreat" },
    sections: [
      {
        title: "Ubud — The Spiritual Heart",
        body: "Nestled in Bali's central highlands, Ubud is the island's wellness capital. Yoga Barn runs 30+ classes daily — from sunrise vinyasa to ecstatic dance — while Taksu Spa specialises in traditional Balinese massage with hot stones and rice-scrub rituals.",
        spots: ["The Yoga Barn, Ubud", "Tegallalang Rice Terraces", "Campuhan Ridge Walk"],
        img: "https://picsum.photos/seed/ubudbali/600/340",
      },
      {
        title: "Tirta Empul — Sacred Water Temple",
        body: "One of Bali's most important water temples, fed by a natural spring considered holy for over 1,000 years. Pilgrims bathe in the tiered purification pools (melukat) for spiritual cleansing. Arrive before 8 am. Sarong required.",
        spots: ["Tirta Empul Temple", "Pura Gunung Kawi", "Sebatu Holy Spring"],
        img: "https://picsum.photos/seed/tirta/600/340",
      },
      {
        title: "Seminyak & Canggu — Coastal Reset",
        body: "Bali's southwest coast combines beach sunsets with world-class spas. Potato Head Beach Club offers sunset sessions with organic juices. Canggu's Echo Beach is the surfer-wellness crossover — surf in the morning, sound healing by afternoon.",
        spots: ["Potato Head Beach Club", "Echo Beach, Canggu", "The Slow hotel & spa"],
        img: "https://picsum.photos/seed/balicanggu/600/340",
      },
    ],
    tips: [
      "Shoulder season (April–May, Sept–Oct) offers fewer crowds and lower prices",
      "Always carry a sarong and sash for temple visits",
      "Rent a scooter for flexibility in Ubud — tour bus traffic is real",
      "Tip healers and massage therapists generously",
    ],
  },

  "seoul-nights": {
    tag: "Nightlife",
    title: "Seoul After Dark Guide",
    subtitle: "From rooftop bars above the Han River to basement jazz clubs — Seoul never truly sleeps",
    hero: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&h=480&fit=crop",
    readTime: "5 min read",
    plan: { city: "Seoul", duration: "4 Days", label: "Seoul Night & Day" },
    sections: [
      {
        title: "Itaewon & Haebangchon — Cosmopolitan Night",
        body: "Itaewon's main strip runs hot from 9 pm to 4 am, packed with rooftop bars, international restaurants, and clubs. The quieter Haebangchon hillside has craft beer bars, vinyl record shops, and late-night ramyeon joints favoured by locals.",
        spots: ["Noksapyeong rooftop bars", "HBC Craft Beer Alley", "Vatos Urban Tacos (late night)"],
        img: "https://picsum.photos/seed/itaewon/600/340",
      },
      {
        title: "Hongdae — Underground Culture",
        body: "The university district around Hongik University is Seoul's creative heartbeat. Street performers compete for audiences from 8 pm. The indie club strip books live bands nightly. Club FF and Soap are electronic music institutions.",
        spots: ["Hongdae playground busker spot", "Club FF", "Sangsu-dong art cafés"],
        img: "https://picsum.photos/seed/hongdae/600/340",
      },
      {
        title: "Gangnam — Polished After Hours",
        body: "South of the Han River, Gangnam and Cheongdam-dong offer Seoul's most upscale night experience. Sky-high cocktail bars in the COEX Tower give panoramic views. Apgujeong Rodeo Street has members-only lounges and concept bars.",
        spots: ["Grand InterContinental rooftop bar", "Cheongdam-dong cocktail lounges", "Apgujeong Rodeo Street"],
        img: "https://picsum.photos/seed/gangnam/600/340",
      },
    ],
    tips: [
      "Seoul's metro runs until 1 am — taxis after that via KakaoT app",
      "Many clubs are Korean-ID-only on weekends; bring your passport",
      "Fried chicken and beer (chimaek) is the essential Seoul night snack",
      "Convenience stores (GS25, CU) are social gathering spots at 3 am",
    ],
  },
};

// Pre-built itineraries keyed by blog id
// Activities format matches the manual planner: { [day]: [{ _id, name, time, category, address, lat, lng }] }
const T = ["9:00 AM","11:00 AM","1:00 PM","3:00 PM","5:00 PM","7:00 PM"];
const spot = (name, address, lat, lng, i=0) => ({ _id: Math.random(), name, time: T[i % T.length], category: "attraction", address, isTicketed: false, openNow: null, lat, lng });

const BLOG_PLANS = {
  "japan-hiking": {
    1: [
      spot("Senso-ji Temple",   "Asakusa, Tokyo",   35.7148, 139.7967, 0),
      spot("Tokyo Skytree",     "Oshiage, Tokyo",   35.7101, 139.8107, 1),
      spot("Shibuya Crossing",  "Shibuya, Tokyo",   35.6595, 139.7004, 2),
      spot("Meiji Shrine",      "Harajuku, Tokyo",  35.6763, 139.6993, 3),
    ],
    2: [
      spot("Fuji Subaru Line 5th Station", "Fujiyoshida, Yamanashi", 35.3606, 138.7274, 0),
      spot("Kawaguchiko Lake",             "Fujikawaguchiko",         35.5147, 138.7576, 1),
      spot("Chureito Pagoda",              "Fujiyoshida, Yamanashi", 35.3975, 138.7785, 2),
    ],
    3: [
      spot("Yoshida Trail (Summit Start)", "Mt. Fuji 6th Station", 35.3755, 138.7309, 0),
      spot("Mt. Fuji Summit (Ken-ga-Mine)","Mt. Fuji, Shizuoka",   35.3606, 138.7274, 1),
      spot("Gotemba City Viewpoint",       "Gotemba, Shizuoka",    35.3092, 138.9317, 2),
    ],
    4: [
      spot("Shinjuku Gyoen",    "Shinjuku, Tokyo",  35.6851, 139.7100, 0),
      spot("Harajuku",          "Harajuku, Tokyo",  35.6702, 139.7027, 1),
      spot("Yoyogi Park",       "Shibuya, Tokyo",   35.6718, 139.6944, 2),
    ],
    5: [
      spot("Akihabara",         "Chiyoda, Tokyo",   35.7022, 139.7741, 0),
      spot("Tokyo Tower",       "Minato, Tokyo",    35.6586, 139.7454, 1),
      spot("Odaiba",            "Minato, Tokyo",    35.6267, 139.7759, 2),
    ],
  },

  "kyoto-alleys": {
    1: [
      spot("Nishiki Market",       "Nishikikoji-dori, Kyoto", 35.0045, 135.7680, 0),
      spot("Fushimi Inari-taisha", "Fushimi-ku, Kyoto",       34.9671, 135.7727, 1),
      spot("Gion Hanamikoji-dori", "Higashiyama, Kyoto",      35.0035, 135.7753, 2),
      spot("Shimbashi-dori Canal", "Higashiyama, Kyoto",      35.0065, 135.7755, 3),
    ],
    2: [
      spot("Nanzen-ji",            "Sakyo-ku, Kyoto",         35.0116, 135.7924, 0),
      spot("Philosopher's Path",   "Sakyo-ku, Kyoto",         35.0150, 135.7940, 1),
      spot("Ginkaku-ji (Silver Pavilion)", "Sakyo-ku, Kyoto", 35.0272, 135.7983, 2),
      spot("Eikan-do Zenrin-ji",   "Sakyo-ku, Kyoto",         35.0146, 135.7951, 3),
    ],
    3: [
      spot("Arashiyama Bamboo Grove","Ukyo-ku, Kyoto",         35.0095, 135.6720, 0),
      spot("Tenryu-ji Temple",       "Ukyo-ku, Kyoto",         35.0094, 135.6729, 1),
      spot("Kinkaku-ji (Gold Pavilion)","Kita-ku, Kyoto",      35.0394, 135.7292, 2),
    ],
  },

  "osaka-food": {
    1: [
      spot("Dotonbori Canal Walk",  "Chuo-ku, Osaka",  34.6687, 135.5012, 0),
      spot("Wanaka Takoyaki",       "Chuo-ku, Osaka",  34.6692, 135.5003, 1),
      spot("Daruma Kushikatsu",     "Chuo-ku, Osaka",  34.6689, 135.5008, 2),
      spot("Namba Parks",           "Naniwa-ku, Osaka",34.6625, 135.5016, 3),
    ],
    2: [
      spot("Kuromon Ichiba Market", "Chuo-ku, Osaka",  34.6671, 135.5065, 0),
      spot("Endo Sushi Counter",    "Chuo-ku, Osaka",  34.6675, 135.5060, 1),
      spot("Osaka Castle",          "Chuo-ku, Osaka",  34.6873, 135.5262, 2),
    ],
    3: [
      spot("Shinsekai District",    "Naniwa-ku, Osaka",34.6520, 135.5061, 0),
      spot("Tsutenkaku Tower",      "Naniwa-ku, Osaka",34.6527, 135.5063, 1),
      spot("Jan Jan Yokocho Alley", "Naniwa-ku, Osaka",34.6509, 135.5055, 2),
    ],
    4: [
      spot("Umeda Sky Building",    "Kita-ku, Osaka",  34.7024, 135.4964, 0),
      spot("Hep Five Ferris Wheel", "Kita-ku, Osaka",  34.7033, 135.5007, 1),
      spot("Fukushima Izakaya Street","Fukushima-ku, Osaka",34.6918, 135.4854, 2),
    ],
  },

  "tokyo-culture": {
    1: [
      spot("Senso-ji Temple & Nakamise","Asakusa, Tokyo", 35.7148, 139.7967, 0),
      spot("Kappabashi-dori Cookware St.","Taito-ku, Tokyo",35.7182, 139.7939, 1),
      spot("Tokyo Traditional Craft Museum","Ikebukuro, Tokyo",35.7295, 139.7109, 2),
    ],
    2: [
      spot("Nakameguro Canal Walk",   "Meguro-ku, Tokyo",  35.6431, 139.6978, 0),
      spot("Daikanyama T-Site Complex","Shibuya, Tokyo",   35.6490, 139.7038, 1),
      spot("Harajuku Takeshita Street","Harajuku, Tokyo",  35.6703, 139.7030, 2),
    ],
    3: [
      spot("Yanaka Old Town Quarter", "Taito-ku, Tokyo",  35.7268, 139.7652, 0),
      spot("Yanaka Ginza Shopping St.","Taito-ku, Tokyo",  35.7252, 139.7671, 1),
      spot("Ueno Park & Museums",     "Taito-ku, Tokyo",  35.7142, 139.7739, 2),
    ],
    4: [
      spot("2k540 AKI-OKA Artisan",   "Taito-ku, Tokyo",  35.7011, 139.7802, 0),
      spot("Meiji Shrine",            "Harajuku, Tokyo",  35.6763, 139.6993, 1),
      spot("Yoyogi Park",             "Shibuya, Tokyo",   35.6718, 139.6944, 2),
    ],
  },

  "bali-wellness": {
    1: [
      spot("The Yoga Barn",           "Ubud, Bali",         -8.5069, 115.2625, 0),
      spot("Tegallalang Rice Terraces","Gianyar, Bali",     -8.4313, 115.2779, 1),
      spot("Campuhan Ridge Walk",     "Ubud, Bali",         -8.4966, 115.2598, 2),
    ],
    2: [
      spot("Tirta Empul Temple",      "Tampaksiring, Bali", -8.4149, 115.3147, 0),
      spot("Pura Gunung Kawi",        "Tampaksiring, Bali", -8.4162, 115.3120, 1),
      spot("Sebatu Holy Spring",      "Gianyar, Bali",      -8.4127, 115.2898, 2),
    ],
    3: [
      spot("Ubud Palace (Puri Saren)","Ubud, Bali",         -8.5061, 115.2634, 0),
      spot("Ubud Monkey Forest",      "Ubud, Bali",         -8.5185, 115.2588, 1),
      spot("Taksu Spa",               "Ubud, Bali",         -8.5079, 115.2619, 2),
    ],
    4: [
      spot("Potato Head Beach Club",  "Seminyak, Bali",     -8.6937, 115.1487, 0),
      spot("Seminyak Beach",          "Seminyak, Bali",     -8.6928, 115.1476, 1),
      spot("Ku De Ta Beach Club",     "Seminyak, Bali",     -8.6915, 115.1643, 2),
    ],
    5: [
      spot("Echo Beach Canggu",       "Canggu, Bali",       -8.6524, 115.1299, 0),
      spot("The Slow Hotel & Spa",    "Canggu, Bali",       -8.6590, 115.1312, 1),
      spot("Old Man's Beach Bar",     "Canggu, Bali",       -8.6528, 115.1305, 2),
    ],
    6: [
      spot("Ubud Organic Farm Tour",  "Ubud, Bali",         -8.5069, 115.2625, 0),
      spot("Balinese Cooking Class",  "Ubud, Bali",         -8.5082, 115.2641, 1),
      spot("Rice Paddy Sunset Walk",  "Ubud, Bali",         -8.4952, 115.2607, 2),
    ],
    7: [
      spot("Uluwatu Temple",          "Uluwatu, Bali",      -8.8292, 115.0849, 0),
      spot("Kecak Fire Dance Show",   "Uluwatu, Bali",      -8.8295, 115.0856, 1),
      spot("Jimbaran Seafood Beach",  "Jimbaran, Bali",     -8.7934, 115.1676, 2),
    ],
  },

  "seoul-nights": {
    1: [
      spot("Gyeongbokgung Palace",    "Jongno-gu, Seoul",   37.5796, 126.9770, 0),
      spot("Bukchon Hanok Village",   "Jongno-gu, Seoul",   37.5812, 126.9830, 1),
      spot("Insadong Cultural Street","Jongno-gu, Seoul",   37.5742, 126.9858, 2),
      spot("Cheonggyecheon Stream",   "Jongno-gu, Seoul",   37.5694, 126.9780, 3),
    ],
    2: [
      spot("Itaewon Rooftop Bars",    "Itaewon-dong, Seoul",37.5346, 126.9942, 0),
      spot("HBC Craft Beer Alley",    "Haebangchon, Seoul", 37.5403, 126.9901, 1),
      spot("Vatos Urban Tacos",       "Itaewon-dong, Seoul",37.5349, 126.9944, 2),
    ],
    3: [
      spot("Hongdae Busker Plaza",    "Mapo-gu, Seoul",     37.5573, 126.9245, 0),
      spot("Sangsu-dong Art Cafés",   "Mapo-gu, Seoul",     37.5498, 126.9239, 1),
      spot("Club FF (Electronic)",    "Mapo-gu, Seoul",     37.5567, 126.9258, 2),
    ],
    4: [
      spot("COEX & Starfield Library","Gangnam-gu, Seoul",  37.5115, 127.0596, 0),
      spot("Cheongdam-dong Lounges",  "Gangnam-gu, Seoul",  37.5247, 127.0467, 1),
      spot("Apgujeong Rodeo Street",  "Gangnam-gu, Seoul",  37.5270, 127.0347, 2),
    ],
  },
};

export default function BlogPage() {
  const router = useRouter();
  const { id } = useParams();
  const blog = BLOGS[id];
  if (!blog) {
    return (
      <div style={{ position: "fixed", inset: 0, background: S.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: S.font, color: S.text }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📖</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Guide not found</div>
        <button onClick={() => router.back()} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 999, border: "none", background: S.accent, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: S.font }}>
          Go back
        </button>
      </div>
    );
  }
  const cityImg = CITY_IMAGES[blog.plan.city];

  function handlePlanThisTrip() {
    const tripId = `trip_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const activities = BLOG_PLANS[id] || {};
    const numDays = parseInt(blog.plan.duration) || Object.keys(activities).length;
    const trip = {
      id: tripId,
      destination: blog.plan.city,
      duration: `${numDays} Days`,
      prefs: [blog.tag],
      budget: "",
      activities,
      expenses: [],
      tripTitle: blog.plan.label,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };
    try {
      const trips = JSON.parse(localStorage.getItem("opal_trips") || "[]");
      trips.unshift(trip);
      localStorage.setItem("opal_trips", JSON.stringify(trips));
    } catch (_) {}
    router.push(`/planner/manual?city=${encodeURIComponent(blog.plan.city)}&duration=${encodeURIComponent(blog.plan.duration)}&id=${tripId}`);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: S.bg, fontFamily: S.font, color: S.text, overflowY: "auto" }}>

      {/* ── Hero ── */}
      <div style={{ position: "relative", height: 260, flexShrink: 0 }}>
        <img src={blog.hero} alt={blog.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(9,9,15,0.55) 65%, #09090f 100%)" }} />

        {/* Back button — design system 44×44 glass */}
        <button onClick={() => router.back()}
          style={{ position: "absolute", top: 52, left: 20, width: 44, height: 44, borderRadius: "50%", background: "rgba(20,20,20,0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9L9 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Tag + read time */}
        <div style={{ position: "absolute", bottom: 18, left: 20, display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ background: S.glass, backdropFilter: "blur(8px)", border: `1px solid ${S.border}`, borderRadius: 999, padding: "4px 12px", fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.85)", textTransform: "uppercase" }}>
            {blog.tag}
          </span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{blog.readTime}</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "4px 20px 120px" }}>

        {/* Title */}
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.2, margin: "16px 0 8px", color: "#fff" }}>
          {blog.title}
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, margin: "0 0 28px" }}>
          {blog.subtitle}
        </p>

        {/* ── Sections ── */}
        {blog.sections.map((sec, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            {/* Section image */}
            <div style={{ borderRadius: 18, overflow: "hidden", marginBottom: 14, height: 180 }}>
              <img src={sec.img} alt={sec.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>

            <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3, margin: "0 0 8px", color: "#fff", lineHeight: 1.3 }}>
              {sec.title}
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: "0 0 12px" }}>
              {sec.body}
            </p>

            {/* Spots */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {sec.spots.map((spot, j) => (
                <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: S.glass, backdropFilter: "blur(8px)", border: `1px solid ${S.border}`, borderRadius: 12 }}>
                  <span style={{ fontSize: 12, color: S.accent, flexShrink: 0 }}>📍</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{spot}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 0 24px" }} />

        {/* ── Traveller Tips ── */}
        <h2 style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3, margin: "0 0 12px", color: "#fff" }}>
          ✦ Traveller Tips
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 28 }}>
          {blog.tips.map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "11px 14px", background: S.glass, backdropFilter: "blur(8px)", border: `1px solid ${S.border}`, borderLeft: `3px solid ${S.accent}`, borderRadius: 12 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>{tip}</span>
            </div>
          ))}
        </div>

        {/* ── Plan This Trip CTA ── */}
        <div style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${S.border}` }}>
          {cityImg && (
            <div style={{ position: "relative", height: 130 }}>
              <img src={cityImg} alt={blog.plan.city} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 20%, rgba(9,9,15,0.9) 100%)" }} />
              <div style={{ position: "absolute", bottom: 12, left: 16 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Suggested Plan</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: -0.4 }}>{blog.plan.label}</div>
              </div>
              <div style={{ position: "absolute", top: 12, right: 12, background: S.glass, backdropFilter: "blur(8px)", border: `1px solid ${S.border}`, borderRadius: 999, padding: "4px 10px", fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
                {blog.plan.city} · {blog.plan.duration}
              </div>
            </div>
          )}
          <div style={{ background: "#09090f", padding: "14px 16px 16px" }}>
            <button onClick={handlePlanThisTrip}
              style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, background: "#fff", color: "#111", boxShadow: "0 4px 16px rgba(0,0,0,0.18)", fontFamily: S.font }}>
              Review This Trip →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
