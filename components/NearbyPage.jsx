"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { icon: "⌂",  label: "Home",      href: "/",        active: false },
  { icon: "⊙",  label: "Discover",  href: "/nearby",  active: true  },
  { center: true },
  { icon: "✈︎",  label: "My Trips",  href: "/nearby",  active: false },
  { icon: "◉",  label: "Profile",   href: "/profile", active: false },
];

const SNAZZY_EMBED = "https://snazzymaps.com/embed/778956";

/* Category → emoji mapping for map card icon */
const CAT_EMOJI = {
  Attraction: "🎯", Landmark: "🗼", Shrine: "⛩️", Shopping: "🛍️",
  Temple: "🛕", Electronics: "🔌", Nature: "🌿", Historic: "🏛️",
  Food: "🍜", Entertainment: "🎡", Art: "🎨", Nightlife: "🌙",
  Palace: "👑", Culture: "🎭", Museum: "🖼️", Viewpoint: "👀",
  Park: "🌳", Experience: "🚢", Cathedral: "⛪", Church: "⛪",
  Monument: "🏛️", Café: "☕", Beach: "🏖️", Trekking: "🥾",
  Wellness: "💆", Rooftop: "🌃", Market: "🏪", Family: "👨‍👩‍👧",
  "Theme Park": "🎢",
};
function getCatEmoji(category) {
  if (!category) return "📍";
  const type = category.split("·").pop()?.trim();
  return CAT_EMOJI[type] || "📍";
}

const CATEGORIES = [
  { id: "all",       label: "All",       count: 284 },
  { id: "culture",   label: "Culture",   count: 48  },
  { id: "food",      label: "Food",      count: 73  },
  { id: "nature",    label: "Nature",    count: 39  },
  { id: "art",       label: "Art",       count: 27  },
  { id: "adventure", label: "Adventure", count: 31  },
  { id: "shopping",  label: "Shopping",  count: 66  },
];

const DESTINATIONS = [
  {
    id: 1, city: "Tokyo, Japan", place: "Senso-ji Temple",
    desc: "Ancient temple · Asakusa district",
    tag: "culture", duration: "5 Days",
    img: "https://picsum.photos/seed/senso-ji-thumb/80/80",
    lat: 35.71, lng: 139.79,
    images: [
      "https://picsum.photos/seed/senso-ji-temple/400/300",
      "https://picsum.photos/seed/tokyo-shibuya/400/300",
      "https://picsum.photos/seed/tokyo-night/400/300",
    ],
    days: 5,
    itinerary: {
      1: {
        stops: 4, distance: "8.3 km",
        activities: [
          { name: "Shibuya Crossing", category: "Tokyo · Attraction", desc: "Tokyo's busiest crossing — join 3,000 pedestrians at once. Best at rush hour.", time: "9:00 AM", img: "https://picsum.photos/seed/shibuya-crossing/76/76", transport: "🚶 Walk · 1.2 km · 15 min", next: "Tokyo Tower", lat: 35.6595, lng: 139.7005 },
          { name: "Tokyo Tower", category: "Tokyo · Landmark", desc: "Iconic 333m red-and-white tower. Observation deck open till 11 PM.", time: "12:00 PM", img: "https://picsum.photos/seed/tokyo-tower-red/76/76", transport: "🚇 Subway · 3.4 km · 12 min", next: "Meiji Shrine", lat: 35.6586, lng: 139.7454 },
          { name: "Meiji Shrine", category: "Tokyo · Shrine", desc: "Serene Shinto shrine in the heart of the city. Wear modest clothing.", time: "3:00 PM", img: "https://picsum.photos/seed/meiji-shrine-forest/76/76", transport: "🚶 Walk · 0.8 km · 10 min", next: "Harajuku", lat: 35.6762, lng: 139.6993 },
          { name: "Harajuku", category: "Tokyo · Shopping", desc: "Youth fashion & Takeshita Street snacks. Perfect for people-watching.", time: "6:00 PM", img: "https://picsum.photos/seed/harajuku-street/76/76", transport: null, next: null, lat: 35.6702, lng: 139.7028 },
        ],
      },
      2: {
        stops: 4, distance: "11.2 km",
        activities: [
          { name: "Senso-ji Temple", category: "Tokyo · Temple", desc: "Tokyo's oldest temple dating to 645 AD. Arrive early to avoid crowds.", time: "9:00 AM", img: "https://picsum.photos/seed/sensoji-temple/76/76", transport: "🚇 Subway · 4.1 km · 14 min", next: "Tokyo Skytree", lat: 35.7148, lng: 139.7967 },
          { name: "Tokyo Skytree", category: "Tokyo · Landmark", desc: "World's tallest tower at 634m. Panoramic views of the entire city.", time: "12:00 PM", img: "https://picsum.photos/seed/tokyo-skytree/76/76", transport: "🚇 Subway · 3.8 km · 12 min", next: "Akihabara", lat: 35.7101, lng: 139.8107 },
          { name: "Akihabara", category: "Tokyo · Electronics", desc: "The electric town — anime, manga, gadgets, and retro arcades.", time: "3:00 PM", img: "https://picsum.photos/seed/akihabara-neon/76/76", transport: "🚶 Walk · 3.3 km · 42 min", next: "Ueno Park", lat: 35.7023, lng: 139.7745 },
          { name: "Ueno Park", category: "Tokyo · Nature", desc: "Vast park with museums, a zoo, and famous cherry blossom spots.", time: "6:00 PM", img: "https://picsum.photos/seed/ueno-park-cherry/76/76", transport: null, next: null, lat: 35.7155, lng: 139.7730 },
        ],
      },
      3: {
        stops: 3, distance: "6.5 km",
        activities: [
          { name: "Imperial Palace", category: "Tokyo · Historic", desc: "Residence of Japan's Emperor. The east gardens are open to the public.", time: "9:00 AM", img: "https://picsum.photos/seed/imperial-palace-tokyo/76/76", transport: "🚶 Walk · 2.8 km · 35 min", next: "Ginza", lat: 35.6852, lng: 139.7528 },
          { name: "Ginza", category: "Tokyo · Shopping", desc: "Upscale shopping district with flagship luxury boutiques and art galleries.", time: "12:00 PM", img: "https://picsum.photos/seed/ginza-luxury/76/76", transport: "🚇 Subway · 3.7 km · 10 min", next: "Tsukiji Market", lat: 35.6710, lng: 139.7649 },
          { name: "Tsukiji Market", category: "Tokyo · Food", desc: "World-famous fish market. Try fresh sushi and street food nearby.", time: "3:00 PM", img: "https://picsum.photos/seed/tsukiji-market-fish/76/76", transport: null, next: null, lat: 35.6655, lng: 139.7707 },
        ],
      },
      4: {
        stops: 3, distance: "9.0 km",
        activities: [
          { name: "Odaiba", category: "Tokyo · Entertainment", desc: "Futuristic island with shopping malls, arcades, and a Gundam statue.", time: "10:00 AM", img: "https://picsum.photos/seed/odaiba-island/76/76", transport: "🚇 Subway · 4.5 km · 18 min", next: "teamLab Planets", lat: 35.6257, lng: 139.7750 },
          { name: "teamLab Planets", category: "Tokyo · Art", desc: "Immersive digital art museum — prepare to get your feet wet.", time: "2:00 PM", img: "https://picsum.photos/seed/teamlab-art/76/76", transport: "🚇 Subway · 4.5 km · 16 min", next: "Roppongi Hills", lat: 35.6450, lng: 139.7850 },
          { name: "Roppongi Hills", category: "Tokyo · Nightlife", desc: "Rooftop bars, Mori Art Museum, and Tokyo's best nighttime skyline.", time: "6:00 PM", img: "https://picsum.photos/seed/roppongi-night/76/76", transport: null, next: null, lat: 35.6604, lng: 139.7292 },
        ],
      },
      5: {
        stops: 2, distance: "5.1 km",
        activities: [
          { name: "Shinjuku Gyoen", category: "Tokyo · Nature", desc: "Stunning national garden blending French, English, and Japanese styles.", time: "9:00 AM", img: "https://picsum.photos/seed/shinjuku-garden/76/76", transport: "🚇 Subway · 5.1 km · 15 min", next: "Kabukicho", lat: 35.6852, lng: 139.7100 },
          { name: "Kabukicho", category: "Tokyo · Nightlife", desc: "Tokyo's most famous entertainment district — neon lights and izakayas.", time: "7:00 PM", img: "https://picsum.photos/seed/kabukicho-neon/76/76", transport: null, next: null, lat: 35.6938, lng: 139.7034 },
        ],
      },
    },
    weather: [
      { date: "3.15 Sun · Today", desc: "Rain 2° ~ 10°", icon: "🌧️" },
      { date: "3.16 Mon",         desc: "Rain 1° ~ 8°",  icon: "☁️" },
      { date: "3.17 Tue",         desc: "Sunny 5° ~ 14°", icon: "☀️" },
      { date: "3.18 Wed",         desc: "Cloudy 3° ~ 11°", icon: "⛅" },
    ],
  },
  {
    id: 2, city: "Seoul, Korea", place: "Gyeongbok Palace",
    desc: "Joseon dynasty · Historic centre",
    tag: "culture", duration: "3 Days",
    img: "https://picsum.photos/seed/gyeongbok/80/80",
    lat: 37.58, lng: 126.97,
    images: [
      "https://picsum.photos/seed/gyeongbok-palace/400/300",
      "https://picsum.photos/seed/seoul-namsan/400/300",
      "https://picsum.photos/seed/seoul-market/400/300",
    ],
    days: 3,
    itinerary: {
      1: {
        stops: 4, distance: "7.2 km",
        activities: [
          { name: "Gyeongbokgung", category: "Seoul · Palace", desc: "Main royal palace of the Joseon dynasty — watch the royal guard ceremony.", time: "9:00 AM", img: "https://picsum.photos/seed/gyeongbok-palace/76/76", transport: "🚶 Walk · 1.8 km · 22 min", next: "Bukchon Village", lat: 37.5796, lng: 126.9770 },
          { name: "Bukchon Village", category: "Seoul · Historic", desc: "Traditional hanok village with narrow alleyways and old Korean houses.", time: "12:00 PM", img: "https://picsum.photos/seed/bukchon-hanok/76/76", transport: "🚇 Subway · 2.9 km · 10 min", next: "Insadong", lat: 37.5815, lng: 126.9850 },
          { name: "Insadong", category: "Seoul · Culture", desc: "Antique shops, teahouses, and traditional craft galleries.", time: "3:00 PM", img: "https://picsum.photos/seed/insadong-korea/76/76", transport: "🚇 Subway · 2.5 km · 8 min", next: "Myeongdong", lat: 37.5740, lng: 126.9850 },
          { name: "Myeongdong", category: "Seoul · Shopping", desc: "Korea's top shopping street — K-beauty, street food, and fashion.", time: "6:00 PM", img: "https://picsum.photos/seed/myeongdong-street/76/76", transport: null, next: null, lat: 37.5636, lng: 126.9850 },
        ],
      },
      2: {
        stops: 3, distance: "8.5 km",
        activities: [
          { name: "Namsan Tower", category: "Seoul · Landmark", desc: "360° views of Seoul. Add a love lock to the fence for a classic memory.", time: "10:00 AM", img: "https://picsum.photos/seed/namsan-tower/76/76", transport: "🚇 Subway · 3.5 km · 12 min", next: "Itaewon", lat: 37.5512, lng: 126.9882 },
          { name: "Itaewon", category: "Seoul · Food", desc: "Seoul's most international neighborhood — world cuisine and craft bars.", time: "2:00 PM", img: "https://picsum.photos/seed/itaewon-food/76/76", transport: "🚇 Subway · 5.0 km · 15 min", next: "Han River", lat: 37.5340, lng: 126.9940 },
          { name: "Han River", category: "Seoul · Nature", desc: "Riverside parks perfect for cycling, picnics, and watching the sunset.", time: "6:00 PM", img: "https://picsum.photos/seed/han-river-park/76/76", transport: null, next: null, lat: 37.5280, lng: 126.9970 },
        ],
      },
      3: {
        stops: 2, distance: "6.0 km",
        activities: [
          { name: "Dongdaemun", category: "Seoul · Shopping", desc: "24-hour shopping complex and fashion hub. The futuristic DDP building is a must-see.", time: "9:00 AM", img: "https://picsum.photos/seed/dongdaemun-ddp/76/76", transport: "🚇 Subway · 6.0 km · 18 min", next: "Lotte World", lat: 37.5668, lng: 127.0090 },
          { name: "Lotte World", category: "Seoul · Entertainment", desc: "Massive indoor/outdoor theme park — one of the world's largest.", time: "1:00 PM", img: "https://picsum.photos/seed/lotte-world-theme/76/76", transport: null, next: null, lat: 37.5111, lng: 127.0985 },
        ],
      },
    },
    weather: [
      { date: "3.15 Sun · Today", desc: "Cloudy 3° ~ 12°", icon: "☁️" },
      { date: "3.16 Mon",         desc: "Sunny 6° ~ 16°",  icon: "☀️" },
      { date: "3.17 Tue",         desc: "Sunny 7° ~ 17°",  icon: "☀️" },
    ],
  },
  {
    id: 3, city: "Paris, France", place: "Eiffel Tower",
    desc: "Iconic landmark · Seine riverside",
    tag: "art", duration: "7 Days",
    img: "https://picsum.photos/seed/eiffel-tower/80/80",
    lat: 48.85, lng: 2.29,
    images: [
      "https://picsum.photos/seed/eiffel-tower-day/400/300",
      "https://picsum.photos/seed/paris-louvre/400/300",
      "https://picsum.photos/seed/paris-seine/400/300",
    ],
    days: 7,
    itinerary: {
      1: {
        stops: 4, distance: "7.0 km",
        activities: [
          { name: "Eiffel Tower", category: "Paris · Landmark", desc: "Climb to the summit for unmatched panoramic views. Book tickets in advance.", time: "9:00 AM", color: "#c9783a", transport: "🚶 Walk · 1.2 km · 15 min", next: "Trocadéro" },
          { name: "Trocadéro", category: "Paris · Viewpoint", desc: "The best spot to photograph the Eiffel Tower from across the Seine.", time: "11:00 AM", color: "#4a8fe8", transport: "🚶 Walk · 2.5 km · 30 min", next: "Champ de Mars" },
          { name: "Champ de Mars", category: "Paris · Park", desc: "Relax on the great lawn below the Eiffel Tower with a picnic.", time: "2:00 PM", color: "#2d7a4a", transport: "🚢 Boat · 3.3 km · 20 min", next: "Seine Cruise" },
          { name: "Seine Cruise", category: "Paris · Experience", desc: "Evening boat cruise past Notre-Dame, the Louvre, and glittering bridges.", time: "6:00 PM", color: "#2a6090", transport: null, next: null },
        ],
      },
      2: {
        stops: 3, distance: "4.5 km",
        activities: [
          { name: "Louvre Museum", category: "Paris · Museum", desc: "The world's largest art museum. Don't miss the Mona Lisa and Venus de Milo.", time: "9:00 AM", color: "#8e3a59", transport: "🚶 Walk · 1.5 km · 18 min", next: "Tuileries Garden" },
          { name: "Tuileries Garden", category: "Paris · Park", desc: "Formal French garden between the Louvre and Place de la Concorde.", time: "2:00 PM", color: "#2d7a4a", transport: "🚶 Walk · 3.0 km · 38 min", next: "Palais Royal" },
          { name: "Palais Royal", category: "Paris · Historic", desc: "Beautiful arcaded gardens with boutiques and the iconic striped columns.", time: "4:00 PM", color: "#383852", transport: null, next: null },
        ],
      },
      3: { stops: 3, distance: "5.2 km", activities: [
        { name: "Notre-Dame", category: "Paris · Cathedral", desc: "Gothic masterpiece on the Île de la Cité — restoration ongoing after the 2019 fire.", time: "9:00 AM", color: "#383852", transport: "🚶 Walk · 0.8 km · 10 min", next: "Sainte-Chapelle" },
        { name: "Sainte-Chapelle", category: "Paris · Church", desc: "Stunning Gothic chapel famous for its 15 breathtaking stained-glass windows.", time: "11:00 AM", color: "#4a8fe8", transport: "🚇 Metro · 4.4 km · 15 min", next: "Marais District" },
        { name: "Marais District", category: "Paris · Culture", desc: "Trendy neighborhood with galleries, falafel shops, and Place des Vosges.", time: "3:00 PM", color: "#c9783a", transport: null, next: null },
      ]},
      4: { stops: 3, distance: "6.8 km", activities: [
        { name: "Musée d'Orsay", category: "Paris · Museum", desc: "Impressionist masterworks by Monet, Van Gogh, and Renoir in a former railway station.", time: "10:00 AM", color: "#5a3882", transport: "🚶 Walk · 3.8 km · 48 min", next: "Saint-Germain" },
        { name: "Saint-Germain", category: "Paris · Café", desc: "Legendary Left Bank neighborhood — cafés, bookshops, and Parisian atmosphere.", time: "3:00 PM", color: "#8e3a59", transport: "🚇 Metro · 3.0 km · 10 min", next: "Montparnasse" },
        { name: "Montparnasse", category: "Paris · Viewpoint", desc: "The Tour Montparnasse offers the clearest views of Paris — no Eiffel Tower blocking the vista.", time: "6:00 PM", color: "#383852", transport: null, next: null },
      ]},
      5: { stops: 3, distance: "5.5 km", activities: [
        { name: "Sacré-Cœur", category: "Paris · Church", desc: "White-domed basilica on the hill of Montmartre with views of all Paris.", time: "9:00 AM", color: "#c9783a", transport: "🚶 Walk · 1.5 km · 20 min", next: "Montmartre" },
        { name: "Montmartre", category: "Paris · Art", desc: "Bohemian hilltop village where Picasso and Monet once lived and painted.", time: "11:00 AM", color: "#4a8fe8", transport: "🚇 Metro · 4.0 km · 14 min", next: "Pigalle" },
        { name: "Pigalle", category: "Paris · Nightlife", desc: "The famous red-light district turned into a trendy bar and jazz scene.", time: "6:00 PM", color: "#383852", transport: null, next: null },
      ]},
      6: { stops: 2, distance: "4.0 km", activities: [
        { name: "Versailles", category: "Paris · Palace", desc: "Opulent royal palace and garden — a UNESCO World Heritage Site. Arrive early.", time: "9:00 AM", color: "#c9783a", transport: "🚶 Walk · 4.0 km · 50 min", next: "Palace Gardens" },
        { name: "Palace Gardens", category: "Paris · Park", desc: "Vast formal gardens with fountains, topiaries, and the Grand Canal.", time: "2:00 PM", color: "#2d7a4a", transport: null, next: null },
      ]},
      7: { stops: 3, distance: "5.0 km", activities: [
        { name: "Arc de Triomphe", category: "Paris · Monument", desc: "Climb to the top for a bird's-eye view of the 12 avenues radiating out.", time: "10:00 AM", color: "#383852", transport: "🚶 Walk · 2.0 km · 25 min", next: "Champs-Élysées" },
        { name: "Champs-Élysées", category: "Paris · Shopping", desc: "Paris's most famous avenue — luxury shops, cinemas, and the Grand Palais.", time: "12:00 PM", color: "#8e3a59", transport: "🚇 Metro · 3.0 km · 10 min", next: "Le Marais" },
        { name: "Le Marais", category: "Paris · Food", desc: "Jewish quarter with the best falafel in Paris. End with a stroll at Place des Vosges.", time: "5:00 PM", color: "#c9783a", transport: null, next: null },
      ]},
    },
    weather: [
      { date: "3.15 Sun · Today", desc: "Partly cloudy 8° ~ 15°", icon: "⛅" },
      { date: "3.16 Mon",         desc: "Sunny 10° ~ 18°", icon: "☀️" },
      { date: "3.17 Tue",         desc: "Rain 6° ~ 13°",   icon: "🌧️" },
      { date: "3.18 Wed",         desc: "Cloudy 7° ~ 14°", icon: "☁️" },
    ],
  },
  {
    id: 4, city: "Bali, Indonesia", place: "Ubud Rice Terraces",
    desc: "UNESCO heritage · Lush hillsides",
    tag: "nature", duration: "6 Days",
    img: "https://picsum.photos/seed/ubud-rice/80/80",
    lat: -8.34, lng: 115.09,
    images: [
      "https://picsum.photos/seed/ubud-terraces/400/300",
      "https://picsum.photos/seed/bali-temple/400/300",
      "https://picsum.photos/seed/bali-sunset/400/300",
    ],
    days: 6,
    itinerary: {
      1: { stops: 3, distance: "6.0 km", activities: [
        { name: "Tegallalang Terrace", category: "Ubud · Nature", desc: "Iconic UNESCO rice terraces with dramatic valley views. Best in the morning light.", time: "8:00 AM", color: "#2d7a4a", transport: "🚗 Car · 3.5 km · 12 min", next: "Ubud Market" },
        { name: "Ubud Market", category: "Ubud · Shopping", desc: "Traditional market with handicrafts, sarongs, and wood carvings.", time: "12:00 PM", color: "#c9783a", transport: "🚶 Walk · 2.5 km · 30 min", next: "Puri Saren Palace" },
        { name: "Puri Saren Palace", category: "Ubud · Culture", desc: "Royal palace in the heart of Ubud — Kecak dances performed here at dusk.", time: "4:00 PM", color: "#383852", transport: null, next: null },
      ]},
      2: { stops: 3, distance: "8.0 km", activities: [
        { name: "Tirta Empul", category: "Bali · Temple", desc: "Sacred Hindu water temple where Balinese perform ritual purification baths.", time: "9:00 AM", color: "#4a8fe8", transport: "🚗 Car · 4.5 km · 15 min", next: "Gunung Kawi" },
        { name: "Gunung Kawi", category: "Bali · Historic", desc: "11th-century rock-cut shrines carved into the cliff face of a river gorge.", time: "11:00 AM", color: "#383852", transport: "🚗 Car · 3.5 km · 12 min", next: "Sacred Monkey Forest" },
        { name: "Sacred Monkey Forest", category: "Ubud · Nature", desc: "Ancient temple complex home to over 700 cheeky long-tailed macaques.", time: "3:00 PM", color: "#2d7a4a", transport: null, next: null },
      ]},
      3: { stops: 3, distance: "12.0 km", activities: [
        { name: "Tanah Lot", category: "Bali · Temple", desc: "Spectacular sea temple on a rocky outcrop — particularly stunning at sunset.", time: "8:00 AM", color: "#2a6090", transport: "🚗 Car · 8.0 km · 25 min", next: "Canggu Beach" },
        { name: "Canggu Beach", category: "Bali · Beach", desc: "Surf beach with laid-back beach clubs, warungs, and a vibrant café scene.", time: "2:00 PM", color: "#4a8fe8", transport: "🚗 Car · 4.0 km · 15 min", next: "Sunset at Kuta" },
        { name: "Sunset at Kuta", category: "Bali · Beach", desc: "Bali's most famous beach is best at sunset — watch surfers ride the last waves.", time: "6:00 PM", color: "#c9783a", transport: null, next: null },
      ]},
      4: { stops: 2, distance: "5.0 km", activities: [
        { name: "Mount Batur", category: "Bali · Trekking", desc: "Active volcano trek starting at 4am — watch sunrise from the summit crater.", time: "4:00 AM", color: "#383852", transport: "🚗 Car · 5.0 km · 20 min", next: "Hot Springs" },
        { name: "Hot Springs", category: "Bali · Wellness", desc: "Natural geothermal hot springs — a perfect reward after the early morning climb.", time: "11:00 AM", color: "#c9783a", transport: null, next: null },
      ]},
      5: { stops: 2, distance: "6.5 km", activities: [
        { name: "Uluwatu Temple", category: "Bali · Temple", desc: "Clifftop temple 70m above the Indian Ocean with dramatic ocean views.", time: "9:00 AM", color: "#383852", transport: "🚗 Car · 6.5 km · 22 min", next: "Kecak Dance" },
        { name: "Kecak Dance", category: "Bali · Culture", desc: "Mesmerizing fire dance performance against the backdrop of the sunset.", time: "6:00 PM", color: "#c9783a", transport: null, next: null },
      ]},
      6: { stops: 2, distance: "4.0 km", activities: [
        { name: "Seminyak", category: "Bali · Shopping", desc: "Upscale beach town with designer boutiques, beach clubs, and fine dining.", time: "10:00 AM", color: "#8e3a59", transport: "🚗 Car · 4.0 km · 15 min", next: "Spa Day" },
        { name: "Spa Day", category: "Bali · Wellness", desc: "Traditional Balinese massage with coconut oil and frangipani flowers.", time: "2:00 PM", color: "#5a3882", transport: null, next: null },
      ]},
    },
    weather: [
      { date: "3.15 Sun · Today", desc: "Sunny 26° ~ 33°", icon: "☀️" },
      { date: "3.16 Mon",         desc: "Shower 24° ~ 30°", icon: "🌦️" },
      { date: "3.17 Tue",         desc: "Sunny 27° ~ 34°", icon: "☀️" },
      { date: "3.18 Wed",         desc: "Sunny 26° ~ 33°", icon: "☀️" },
    ],
  },
  {
    id: 5, city: "Bangkok, Thailand", place: "Grand Palace",
    desc: "Royal complex · Old town",
    tag: "culture", duration: "4 Days",
    img: "https://picsum.photos/seed/grand-palace/80/80",
    lat: 13.75, lng: 100.49,
    images: [
      "https://picsum.photos/seed/grand-palace-bkk/400/300",
      "https://picsum.photos/seed/bangkok-temple/400/300",
      "https://picsum.photos/seed/bangkok-night/400/300",
    ],
    days: 4,
    itinerary: {
      1: { stops: 4, distance: "7.5 km", activities: [
        { name: "Grand Palace", category: "Bangkok · Historic", desc: "The dazzling royal complex — home of the Emerald Buddha and Chakri Throne Hall.", time: "9:00 AM", color: "#c9783a", transport: "🚶 Walk · 1.5 km · 18 min", next: "Wat Pho" },
        { name: "Wat Pho", category: "Bangkok · Temple", desc: "Famous for the 46m reclining Buddha. Also the birthplace of Thai massage.", time: "12:00 PM", color: "#4a8fe8", transport: "🚢 Boat · 2.0 km · 10 min", next: "Arun Temple" },
        { name: "Arun Temple", category: "Bangkok · Temple", desc: "Temple of Dawn on the Chao Phraya riverbank — magical at sunset.", time: "3:00 PM", color: "#383852", transport: "🚗 Car · 4.0 km · 18 min", next: "Khao San Road" },
        { name: "Khao San Road", category: "Bangkok · Nightlife", desc: "The world-famous backpacker street — street food, bars, and live music.", time: "7:00 PM", color: "#8e3a59", transport: null, next: null },
      ]},
      2: { stops: 3, distance: "8.2 km", activities: [
        { name: "Chatuchak Market", category: "Bangkok · Shopping", desc: "One of the world's largest weekend markets with 15,000+ stalls.", time: "9:00 AM", color: "#c9783a", transport: "🚇 BTS · 4.2 km · 14 min", next: "Jim Thompson House" },
        { name: "Jim Thompson House", category: "Bangkok · Museum", desc: "Stunning complex of traditional Thai houses by the famous silk entrepreneur.", time: "2:00 PM", color: "#383852", transport: "🚶 Walk · 4.0 km · 50 min", next: "Lumphini Park" },
        { name: "Lumphini Park", category: "Bangkok · Nature", desc: "Bangkok's largest park — perfect for a late afternoon stroll or rowing boats.", time: "5:00 PM", color: "#2d7a4a", transport: null, next: null },
      ]},
      3: { stops: 2, distance: "6.0 km", activities: [
        { name: "Floating Market", category: "Bangkok · Culture", desc: "Iconic canal-side market with vendors selling food from wooden boats.", time: "7:00 AM", color: "#4a8fe8", transport: "🚗 Car · 6.0 km · 25 min", next: "Ayutthaya" },
        { name: "Ayutthaya", category: "Bangkok · Historic", desc: "Ancient capital with magnificent ruins — a UNESCO World Heritage Site.", time: "12:00 PM", color: "#c9783a", transport: null, next: null },
      ]},
      4: { stops: 2, distance: "3.5 km", activities: [
        { name: "Sky Bar", category: "Bangkok · Rooftop", desc: "64th-floor rooftop bar — the setting of the Hangover II. Dress code applies.", time: "6:00 PM", color: "#2a6090", transport: "🚗 Car · 3.5 km · 15 min", next: "Silom Night Market" },
        { name: "Silom Night Market", category: "Bangkok · Food", desc: "Lively night market with street food, fashion, and souvenir stalls.", time: "8:00 PM", color: "#383852", transport: null, next: null },
      ]},
    },
    weather: [
      { date: "3.15 Sun · Today", desc: "Sunny 28° ~ 36°", icon: "☀️" },
      { date: "3.16 Mon",         desc: "Sunny 29° ~ 37°", icon: "☀️" },
      { date: "3.17 Tue",         desc: "Cloudy 26° ~ 33°", icon: "⛅" },
      { date: "3.18 Wed",         desc: "Shower 24° ~ 31°", icon: "🌦️" },
    ],
  },
  {
    id: 6, city: "Osaka, Japan", place: "Dotonbori",
    desc: "Neon canal · Street food paradise",
    tag: "food", duration: "3 Days",
    img: "https://picsum.photos/seed/dotonbori/80/80",
    lat: 34.67, lng: 135.50,
    images: [
      "https://picsum.photos/seed/dotonbori-canal/400/300",
      "https://picsum.photos/seed/osaka-food/400/300",
      "https://picsum.photos/seed/osaka-castle/400/300",
    ],
    days: 3,
    itinerary: {
      1: { stops: 4, distance: "6.8 km", activities: [
        { name: "Dotonbori", category: "Osaka · Food", desc: "Neon-lit canal district — try takoyaki and okonomiyaki under the Glico Running Man sign.", time: "11:00 AM", color: "#c9783a", transport: "🚶 Walk · 1.2 km · 15 min", next: "Kuromon Market" },
        { name: "Kuromon Market", category: "Osaka · Market", desc: "Osaka's kitchen — 170+ stalls of fresh seafood, meat, and produce.", time: "2:00 PM", color: "#4a8fe8", transport: "🚶 Walk · 2.6 km · 32 min", next: "Hozenji Yokocho" },
        { name: "Hozenji Yokocho", category: "Osaka · Culture", desc: "Atmospheric stone-paved alley with mossy lanterns and old-school izakayas.", time: "5:00 PM", color: "#383852", transport: "🚶 Walk · 3.0 km · 38 min", next: "Namba Night" },
        { name: "Namba Night", category: "Osaka · Nightlife", desc: "Osaka's entertainment hub — pachinko, karaoke, and ramen at midnight.", time: "7:00 PM", color: "#8e3a59", transport: null, next: null },
      ]},
      2: { stops: 3, distance: "7.5 km", activities: [
        { name: "Osaka Castle", category: "Osaka · Historic", desc: "16th-century fortress with a museum inside and a beautiful park surrounding it.", time: "9:00 AM", color: "#c9783a", transport: "🚇 Subway · 4.5 km · 15 min", next: "Shinsekai" },
        { name: "Shinsekai", category: "Osaka · Culture", desc: "Retro working-class neighborhood — home of kushikatsu (deep-fried skewers).", time: "1:00 PM", color: "#383852", transport: "🚶 Walk · 3.0 km · 38 min", next: "Tsutenkaku" },
        { name: "Tsutenkaku", category: "Osaka · Landmark", desc: "Retro 108m tower in Shinsekai — great views and a quirky Billiken statue at the top.", time: "3:00 PM", color: "#5a3882", transport: null, next: null },
      ]},
      3: { stops: 2, distance: "8.5 km", activities: [
        { name: "Universal Studios", category: "Osaka · Theme Park", desc: "Harry Potter World, Mario Kart, Jurassic Park — arrive when gates open.", time: "9:00 AM", color: "#4a8fe8", transport: "🚇 Subway · 8.5 km · 25 min", next: "Tempozan" },
        { name: "Tempozan", category: "Osaka · Family", desc: "Harborfront area with a giant Ferris wheel, aquarium, and market.", time: "5:00 PM", color: "#2a6090", transport: null, next: null },
      ]},
    },
    weather: [
      { date: "3.15 Sun · Today", desc: "Cloudy 8° ~ 16°", icon: "☁️" },
      { date: "3.16 Mon",         desc: "Sunny 10° ~ 18°", icon: "☀️" },
      { date: "3.17 Tue",         desc: "Partly sunny 9° ~ 17°", icon: "⛅" },
    ],
  },
];


function DiscoverMap({ activeCity }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    loadGoogleMaps().then((maps) => {
      if (cancelled) return;

      const city = CITIES.find(c => c.name === activeCity) || CITIES[0];

      if (!mapInstanceRef.current) {
        const map = new maps.Map(mapRef.current, {
          center: { lat: city.lat, lng: city.lng },
          zoom: 4,
          styles: SNAZZY_STYLE,
          disableDefaultUI: true,
          gestureHandling: "greedy",
        });
        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;
      map.panTo({ lat: city.lat, lng: city.lng });

      // Clear old overlays
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];

      // Add city markers
      CITIES.forEach((c) => {
        const overlay = new maps.OverlayView();
        overlay.onAdd = function () {
          const div = document.createElement("div");
          div.className = "nd-discover-pin";
          const isActive = c.name === activeCity;
          div.innerHTML = `
            <div class="nd-discover-pin-circle${isActive ? ' nd-discover-pin-circle--active' : ''}">${c.plans}</div>
            <div class="nd-discover-pin-name${isActive ? ' nd-discover-pin-name--active' : ''}">${c.name}</div>
          `;
          this._div = div;
          this.getPanes().overlayMouseTarget.appendChild(div);
        };
        overlay.draw = function () {
          const pos = this.getProjection().fromLatLngToDivPixel(
            new maps.LatLng(c.lat, c.lng)
          );
          if (pos && this._div) {
            this._div.style.position = "absolute";
            this._div.style.left = pos.x + "px";
            this._div.style.top = pos.y + "px";
            this._div.style.transform = "translate(-50%, -50%)";
          }
        };
        overlay.onRemove = function () {
          this._div?.remove();
        };
        overlay.setMap(map);
        markersRef.current.push(overlay);
      });
    });

    return () => { cancelled = true; };
  }, [activeCity]);

  return (
    <div className="nd-map-wrap">
      <div ref={mapRef} className="nd-map" />
      <div className="nd-map-grad-top" />
      <div className="nd-map-grad-bottom" />
    </div>
  );
}

const CITIES = [
  { name: "Tokyo",    country: "Japan",     img: "https://picsum.photos/seed/tokyo-city/80/80",    lat: 35.6762, lng: 139.6503, plans: 43 },
  { name: "Seoul",    country: "Korea",     img: "https://picsum.photos/seed/seoul-city/80/80",    lat: 37.5665, lng: 126.9780, plans: 28 },
  { name: "Paris",    country: "France",    img: "https://picsum.photos/seed/paris-city/80/80",    lat: 48.8566, lng: 2.3522,   plans: 35 },
  { name: "Bali",     country: "Indonesia", img: "https://picsum.photos/seed/bali-city/80/80",     lat: -8.3405, lng: 115.0920, plans: 19 },
  { name: "Bangkok",  country: "Thailand",  img: "https://picsum.photos/seed/bangkok-city/80/80",  lat: 13.7563, lng: 100.5018, plans: 22 },
  { name: "Osaka",    country: "Japan",     img: "https://picsum.photos/seed/osaka-city/80/80",    lat: 34.6937, lng: 135.5023, plans: 31 },
  { name: "New York", country: "USA",       img: "https://picsum.photos/seed/newyork-city/80/80",  lat: 40.7128, lng: -74.0060, plans: 38 },
  { name: "London",   country: "UK",        img: "https://picsum.photos/seed/london-city/80/80",   lat: 51.5074, lng: -0.1278,  plans: 26 },
];

const SNAZZY_STYLE = [
  {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},
  {"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},
  {"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},
  {"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},
  {"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},
  {"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
  {"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},
  {"featureType":"water","elementType":"all","stylers":[{"color":"#000347"},{"visibility":"on"}]},
];

/* Load Google Maps script once */
let gmapsPromise = null;
function loadGoogleMaps() {
  if (gmapsPromise) return gmapsPromise;
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  gmapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&language=en`;
    script.async = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return gmapsPromise;
}

/* Low-saturation day colors for Total mode */
const DAY_COLORS = [
  '#8B9DAF', // day 1 — muted blue
  '#A89B8C', // day 2 — muted tan
  '#8FA896', // day 3 — muted sage
  '#A68B9A', // day 4 — muted mauve
  '#9A9AB0', // day 5 — muted lavender
];

function MapView({ activities, fullscreen, selectedIdx, onPinClick, totalMode = false, dayNum = 1 }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const geoActs = activities.filter(a => a.lat && a.lng);
  const actsKey = geoActs.map(a => a.name).join(',');

  useEffect(() => {
    if (!mapRef.current || !geoActs.length) return;
    let cancelled = false;

    loadGoogleMaps().then((maps) => {
      if (cancelled) return;

      // Initialize map only once
      if (!mapInstanceRef.current) {
        const first = geoActs[selectedIdx] || geoActs[0];
        const map = new maps.Map(mapRef.current, {
          center: { lat: first.lat, lng: first.lng },
          zoom: 15,
          styles: SNAZZY_STYLE,
          disableDefaultUI: true,
          gestureHandling: "greedy",
        });
        // Fit bounds to show all pins with padding
        const bounds = new maps.LatLngBounds();
        geoActs.forEach(a => bounds.extend({ lat: a.lat, lng: a.lng }));
        map.fitBounds(bounds, { top: 100, bottom: 320, left: 40, right: 40 });
        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear old overlays
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];

      // Add numbered pin overlays
      geoActs.forEach((a, i) => {
        const isActive = !totalMode && i === selectedIdx;
        const colorDay = totalMode ? a._day : dayNum;
        const dayColor = DAY_COLORS[(colorDay - 1) % DAY_COLORS.length];
        const overlay = new maps.OverlayView();
        overlay.onAdd = function () {
          const div = document.createElement("div");
          div.className = "nd-gm-pin";
          const dotStyle = isActive ? '' : ` style="background:${dayColor};border-color:${dayColor}40"`;
          const labelStyle = isActive ? '' : ` style="background:${dayColor};border-color:${dayColor}40"`;
          const label = totalMode ? `D${a._day}` : `${i + 1}`;
          div.innerHTML = `<div class="nd-map-pin-dot${isActive ? " nd-map-pin-dot--active" : ""}"${dotStyle}>${label}</div><div class="nd-map-pin-label"${labelStyle}>${a.name}</div>`;
          div.style.cursor = "pointer";
          div.addEventListener("click", () => onPinClick?.(i));
          this._div = div;
          this.getPanes().overlayMouseTarget.appendChild(div);
        };
        overlay.draw = function () {
          const pos = this.getProjection().fromLatLngToDivPixel(
            new maps.LatLng(a.lat, a.lng)
          );
          if (pos && this._div) {
            this._div.style.position = "absolute";
            this._div.style.left = pos.x - 15 + "px";
            this._div.style.top = pos.y - 44 + "px";
          }
        };
        overlay.onRemove = function () {
          this._div?.remove();
        };
        overlay.setMap(map);
        markersRef.current.push(overlay);
      });

      // In total mode, fit all pins; otherwise pan to selected
      if (totalMode) {
        const bounds = new maps.LatLngBounds();
        geoActs.forEach(a => bounds.extend({ lat: a.lat, lng: a.lng }));
        map.fitBounds(bounds, { top: 80, bottom: 120, left: 40, right: 40 });
      } else {
        const sel = geoActs[selectedIdx] || geoActs[0];
        if (sel) {
          map.panTo({ lat: sel.lat, lng: sel.lng });
          if (map.getZoom() < 14) map.setZoom(14);
        }
      }
    });

    return () => { cancelled = true; };
  }, [actsKey, selectedIdx, totalMode, dayNum]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
      mapInstanceRef.current = null;
    };
  }, []);

  if (!geoActs.length) return <div className="nd-map-placeholder"><p className="nd-map-placeholder-text">Map view</p></div>;

  return <div ref={mapRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />;
}

export function NearbyPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeCity, setActiveCity]         = useState("Tokyo");
  const [cardMode, setCardMode]             = useState(false);
  const [citySheet, setCitySheet]           = useState(false);
  const [citySearch, setCitySearch]         = useState("");
  const [detailDest, setDetailDest]         = useState(null);
  const [tripTab, setTripTab]               = useState("overview");
  const [tripDay, setTripDay]               = useState(0); // default to Total overview
  const [carouselIndex, setCarouselIndex]   = useState({});
  const [mapMode, setMapMode]               = useState(false);
  const [detailAct, setDetailAct]           = useState(null); // activity detail page
  const [descExpanded, setDescExpanded]     = useState(false);
  const mapExitTime = useRef(0);
  const [selectedActIdx, setSelectedActIdx] = useState(0);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const swipeRef = useRef({ startX: 0, currentX: 0, dragging: false });
  const springRef = useRef(null);

  /* Spring animation helper */
  function springTo(target, from, onUpdate, onDone) {
    if (springRef.current) cancelAnimationFrame(springRef.current);
    let pos = from;
    let velocity = 0;
    const stiffness = 0.08;
    const damping = 0.72;
    function step() {
      const force = (target - pos) * stiffness;
      velocity = (velocity + force) * damping;
      pos += velocity;
      if (Math.abs(pos - target) < 0.5 && Math.abs(velocity) < 0.5) {
        onUpdate(target);
        onDone?.();
        return;
      }
      onUpdate(pos);
      springRef.current = requestAnimationFrame(step);
    }
    springRef.current = requestAnimationFrame(step);
  }

  /* Animate carousel to selectedActIdx */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const wrap = track.querySelector('.nd-mapview-card-wrap');
    if (!wrap) return;
    const target = -selectedActIdx * wrap.offsetWidth;
    const current = parseFloat(track.style.transform?.match(/-?\d+\.?\d*/)?.[0] || 0);
    springTo(target, current, (v) => {
      track.style.transform = `translateX(${v}px)`;
    });
  }, [selectedActIdx]);
  const dragY     = useRef(null);
  const router    = useRouter();

  function onPanelDragStart(e) {
    dragY.current = e.touches?.[0]?.clientY ?? e.clientY;
  }
  function onPanelDragEnd(e) {
    if (dragY.current === null) return;
    const endY  = e.changedTouches?.[0]?.clientY ?? e.clientY;
    const delta = endY - dragY.current;
    if (delta > 48)       setMapMode(true);   // dragged down → reveal map
    else if (delta < -48) setMapMode(false);  // dragged up   → full panel
    dragY.current = null;
  }

  useEffect(() => { if (!detailDest) setMapMode(false); }, [detailDest]);

  const filtered = activeCategory === "all"
    ? DESTINATIONS
    : DESTINATIONS.filter((d) => d.tag === activeCategory);

  function handleCardClick(dest) {
    setDetailDest(dest);
    setTripTab("overview");
    setTripDay(1);
    setMapMode(false);          // open full panel first; drag down reveals map
    setActiveCity(dest.city.split(",")[0]);
  }

  function setSlide(key, idx) {
    setCarouselIndex((prev) => ({ ...prev, [key]: idx }));
  }

  // Days to show: if tripDay=0 (Total) show all, else just that day
  function getTripDays(dest) {
    if (tripDay === 0) return Object.keys(dest.itinerary).map(Number).sort((a, b) => a - b);
    return [tripDay];
  }

  return (
    <div className="nd-shell">
      <DiscoverMap activeCity={activeCity} />

      <div className="nd-top-bar">
        <button className="nd-city-name-btn" onClick={() => setCitySheet(true)}>
          <span className="nd-city-name">{activeCity}</span>
          <span className="nd-city-chevron">›</span>
        </button>
      </div>

      <div className="nd-bottom">
        <div className="nd-card-mode-wrap">
          <div className="nd-card-mode-btn">Card Mode</div>
        </div>
        <div className="nd-filter-scroll">
          <button className={`nd-filter-sort${cardMode ? " nd-filter-sort-active" : ""}`} onClick={() => setCardMode((v) => !v)}>
            <span className="nd-sort-icon">≡</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`nd-filter-tab${activeCategory === cat.id ? " nd-filter-active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="nd-filter-label">{cat.label}</span>
              <sup className="nd-filter-count">{cat.count}</sup>
            </button>
          ))}
        </div>

        <div className="nd-cards-scroll">
          {filtered.map((dest) =>
            cardMode ? (
              <div key={dest.id} className="nd-card-lg" onClick={() => handleCardClick(dest)}>
                <div className="nd-card-lg-social">
                  <div className="nd-card-lg-avatars">
                    <img className="nd-card-lg-avatar" src={`https://picsum.photos/seed/u${dest.id}a/24/24`} alt="" />
                    <img className="nd-card-lg-avatar" src={`https://picsum.photos/seed/u${dest.id}b/24/24`} alt="" />
                    <img className="nd-card-lg-avatar" src={`https://picsum.photos/seed/u${dest.id}c/24/24`} alt="" />
                  </div>
                  <span className="nd-card-lg-social-text">73+ users have added</span>
                </div>
                <div className="nd-card-lg-title-row">
                  <div className="nd-card-lg-title-text">
                    <p className="nd-card-lg-name">{dest.city}</p>
                    <p className="nd-card-lg-desc">{dest.desc}</p>
                  </div>
                  <div className="nd-card-lg-circle">
                    <img src={dest.img} alt={dest.place} />
                  </div>
                </div>
                <div className="nd-card-lg-img-wrap" onClick={(e) => e.stopPropagation()}>
                  <div className="nd-carousel-track" style={{ transform: `translateX(-${(carouselIndex[dest.id] || 0) * 100}%)` }}>
                    {dest.images.map((src, idx) => (
                      <img key={idx} className="nd-card-lg-img" src={src} alt={dest.place} />
                    ))}
                  </div>
                  <div className="nd-card-lg-pills">
                    <span className="nd-card-lg-pill">{dest.city.split(",")[1]?.trim() || dest.tag}</span>
                    <span className="nd-card-lg-pill">{dest.duration}</span>
                  </div>
                  <div className="nd-carousel-dots">
                    {dest.images.map((_, idx) => (
                      <span key={idx}
                        className={`nd-carousel-dot${(carouselIndex[dest.id] || 0) === idx ? " nd-carousel-dot-active" : ""}`}
                        onClick={(e) => { e.stopPropagation(); setSlide(dest.id, idx); }}
                      />
                    ))}
                  </div>
                  {(carouselIndex[dest.id] || 0) > 0 && (
                    <button className="nd-carousel-prev" onClick={(e) => { e.stopPropagation(); setSlide(dest.id, (carouselIndex[dest.id] || 0) - 1); }}>‹</button>
                  )}
                  {(carouselIndex[dest.id] || 0) < dest.images.length - 1 && (
                    <button className="nd-carousel-next" onClick={(e) => { e.stopPropagation(); setSlide(dest.id, (carouselIndex[dest.id] || 0) + 1); }}>›</button>
                  )}
                </div>
                <div className="nd-card-actions">
                  <div className="nd-card-save" onClick={(e) => e.stopPropagation()}>♡ Save</div>
                  <div className="nd-card-add" onClick={(e) => { e.stopPropagation(); handleCardClick(dest); }}>+ Add to Trip</div>
                </div>
              </div>
            ) : (
              <button key={dest.id} className="nd-card" onClick={() => handleCardClick(dest)}>
                <div className="nd-card-lg-social">
                  <div className="nd-card-lg-avatars">
                    <img className="nd-card-lg-avatar" src={`https://picsum.photos/seed/u${dest.id}a/24/24`} alt="" />
                    <img className="nd-card-lg-avatar" src={`https://picsum.photos/seed/u${dest.id}b/24/24`} alt="" />
                    <img className="nd-card-lg-avatar" src={`https://picsum.photos/seed/u${dest.id}c/24/24`} alt="" />
                  </div>
                  <span className="nd-card-lg-social-text">73+ users have added</span>
                </div>
                <div className="nd-card-lg-title-row">
                  <div className="nd-card-lg-title-text">
                    <p className="nd-card-lg-name">{dest.city}</p>
                    <p className="nd-card-lg-desc">{dest.desc}</p>
                  </div>
                  <div className="nd-card-lg-circle">
                    <img src={dest.img} alt={dest.place} />
                  </div>
                </div>
                <div className="nd-card-footer">
                  <span className="nd-card-pill">{dest.city.split(",")[1]?.trim() || dest.tag}</span>
                  <span className="nd-card-pill">{dest.duration}</span>
                </div>
                <div className="nd-card-actions">
                  <div className="nd-card-save" onClick={(e) => e.stopPropagation()}>♡ Save</div>
                  <div className="nd-card-add" onClick={(e) => e.stopPropagation()}>+ Add to Trip</div>
                </div>
              </button>
            )
          )}
        </div>
      </div>

      {/* City selection sheet */}
      {citySheet && (
        <div className="nd-sheet-overlay" onClick={() => setCitySheet(false)}>
          <div className="nd-sheet-panel" onClick={(e) => e.stopPropagation()}>
            <div className="nd-sheet-handle-row"><div className="nd-sheet-handle" /></div>
            <div className="nd-sheet-header">
              <p className="nd-sheet-title">Explore Cities</p>
              <button className="nd-sheet-close" onClick={() => setCitySheet(false)}>✕</button>
            </div>
            <div className="nd-sheet-search-wrap">
              <span className="nd-sheet-search-icon">⌕</span>
              <input className="nd-sheet-search" placeholder="Search city or country..."
                value={citySearch} onChange={(e) => setCitySearch(e.target.value)} />
            </div>
            <div className="nd-sheet-grid">
              {CITIES.filter((c) =>
                c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
                c.country.toLowerCase().includes(citySearch.toLowerCase())
              ).map((city) => (
                <button key={city.name}
                  className={`nd-sheet-city${activeCity === city.name ? " nd-sheet-city-active" : ""}`}
                  onClick={() => {
                    const dest = DESTINATIONS.find((d) => d.city.startsWith(city.name));
                    setActiveCity(city.name);
                    setCitySheet(false);
                    setCitySearch("");
                  }}
                >
                  <div className="nd-sheet-city-img-wrap">
                    <img className="nd-sheet-city-img" src={city.img} alt={city.name} />
                    {activeCity === city.name && <div className="nd-sheet-city-check">✓</div>}
                  </div>
                  <p className="nd-sheet-city-name">{city.name}</p>
                  <p className="nd-sheet-city-country">{city.country}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Map Mode — full-screen Figma-style map view ═══ */}
      {detailDest && (() => {
        const isTotal = tripDay === 0;
        const acts = isTotal
          ? Object.entries(detailDest.itinerary).flatMap(([day, d]) =>
              (d?.activities || []).map(a => ({ ...a, _day: Number(day) }))
            )
          : (detailDest.itinerary[tripDay]?.activities || []);
        const act    = acts[selectedActIdx] || acts[0];
        return (
          <div className="nd-mapview" style={{ zIndex: mapMode ? 1000 : 5 }}>
            {/* Full-screen map with markers */}
            <div className="nd-mapview-map">
              <MapView
                activities={acts}
                fullscreen
                selectedIdx={selectedActIdx}
                onPinClick={(i) => { if (!isTotal) setSelectedActIdx(i); }}
                totalMode={isTotal}
                dayNum={tripDay}
              />
            </div>

            {/* Map UI controls — only visible in map mode */}
            {mapMode && <>
            {/* Back button — returns to discover page */}
            <button className="nd-mapview-back"
              onClick={() => { setMapMode(false); setDetailDest(null); }}
              onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); setMapMode(false); setDetailDest(null); }}>
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            {/* List icon — opens trip detail panel */}
            <button className="nd-mapview-list-btn"
              onClick={() => { mapExitTime.current = Date.now(); setTimeout(() => setMapMode(false), 80); }}
              onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); mapExitTime.current = Date.now(); setTimeout(() => setMapMode(false), 80); }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>

            {/* Swipeable card carousel — spring bounce (hidden in total mode) */}
            {!isTotal && acts.length > 0 && (
              <div className="nd-mapview-carousel" ref={carouselRef}
                onTouchStart={(e) => {
                  if (springRef.current) cancelAnimationFrame(springRef.current);
                  swipeRef.current = { startX: e.touches[0].clientX, currentX: e.touches[0].clientX, dragging: true };
                }}
                onTouchMove={(e) => {
                  if (!swipeRef.current.dragging) return;
                  swipeRef.current.currentX = e.touches[0].clientX;
                  const dx = swipeRef.current.currentX - swipeRef.current.startX;
                  const track = trackRef.current;
                  if (track) {
                    const wrap = track.querySelector('.nd-mapview-card-wrap');
                    const base = -selectedActIdx * (wrap?.offsetWidth || 375);
                    track.style.transform = `translateX(${base + dx}px)`;
                  }
                }}
                onTouchEnd={() => {
                  if (!swipeRef.current.dragging) return;
                  const dx = swipeRef.current.currentX - swipeRef.current.startX;
                  swipeRef.current.dragging = false;
                  let next = selectedActIdx;
                  if (dx < -50 && selectedActIdx < acts.length - 1) next = selectedActIdx + 1;
                  else if (dx > 50 && selectedActIdx > 0) next = selectedActIdx - 1;
                  if (next !== selectedActIdx) {
                    setSelectedActIdx(next);
                  } else {
                    /* Snap back with spring */
                    const track = trackRef.current;
                    const wrap = track?.querySelector('.nd-mapview-card-wrap');
                    const target = -selectedActIdx * (wrap?.offsetWidth || 375);
                    const current = parseFloat(track?.style.transform?.match(/-?\d+\.?\d*/)?.[0] || 0);
                    springTo(target, current, (v) => { track.style.transform = `translateX(${v}px)`; });
                  }
                }}
                onMouseDown={(e) => {
                  if (springRef.current) cancelAnimationFrame(springRef.current);
                  swipeRef.current = { startX: e.clientX, currentX: e.clientX, dragging: true };
                }}
                onMouseMove={(e) => {
                  if (!swipeRef.current.dragging) return;
                  swipeRef.current.currentX = e.clientX;
                  const dx = swipeRef.current.currentX - swipeRef.current.startX;
                  const track = trackRef.current;
                  if (track) {
                    const wrap = track.querySelector('.nd-mapview-card-wrap');
                    const base = -selectedActIdx * (wrap?.offsetWidth || 375);
                    track.style.transform = `translateX(${base + dx}px)`;
                  }
                }}
                onMouseUp={() => {
                  if (!swipeRef.current.dragging) return;
                  const dx = swipeRef.current.currentX - swipeRef.current.startX;
                  swipeRef.current.dragging = false;
                  let next = selectedActIdx;
                  if (dx < -50 && selectedActIdx < acts.length - 1) next = selectedActIdx + 1;
                  else if (dx > 50 && selectedActIdx > 0) next = selectedActIdx - 1;
                  if (next !== selectedActIdx) {
                    setSelectedActIdx(next);
                  } else {
                    const track = trackRef.current;
                    const wrap = track?.querySelector('.nd-mapview-card-wrap');
                    const target = -selectedActIdx * (wrap?.offsetWidth || 375);
                    const current = parseFloat(track?.style.transform?.match(/-?\d+\.?\d*/)?.[0] || 0);
                    springTo(target, current, (v) => { track.style.transform = `translateX(${v}px)`; });
                  }
                }}
                onMouseLeave={() => {
                  if (swipeRef.current.dragging) {
                    swipeRef.current.dragging = false;
                    const track = trackRef.current;
                    const wrap = track?.querySelector('.nd-mapview-card-wrap');
                    const target = -selectedActIdx * (wrap?.offsetWidth || 375);
                    const current = parseFloat(track?.style.transform?.match(/-?\d+\.?\d*/)?.[0] || 0);
                    springTo(target, current, (v) => { track.style.transform = `translateX(${v}px)`; });
                  }
                }}
              >
                <div className="nd-mapview-carousel-track" ref={trackRef}>
                  {acts.map((a, i) => (
                    <div className="nd-mapview-card-wrap" key={i}>
                      <div className="nd-mapview-card">
                        <div className="nd-mapview-card-glow" />
                        <div className="nd-mapview-card-header">
                          <div className="nd-mapview-card-left">
                            <div className="nd-mapview-card-icon">
                              <span className="nd-mapview-card-emoji">{getCatEmoji(a.category)}</span>
                            </div>
                            <div className="nd-mapview-card-info">
                              <p className="nd-mapview-card-name">{a.name}</p>
                              <p className="nd-mapview-card-time">{a.time}</p>
                            </div>
                          </div>
                          <div className="nd-mapview-card-right">
                            <p className="nd-mapview-card-cat-label">Entry</p>
                            <p className="nd-mapview-card-cat-val">Free</p>
                          </div>
                        </div>
                        <p className="nd-mapview-card-desc">{a.desc}</p>
                        <div className="nd-mapview-card-actions">
                          <button className="nd-mapview-btn-glass"
                            onClick={(e) => { e.stopPropagation(); setDetailAct(a); setDescExpanded(false); }}
                            onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); setDetailAct(a); }}>Details</button>
                          <button className="nd-mapview-btn-solid">Tickets</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Day tabs at bottom */}
            <div className="nd-mapview-daybar" onClick={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
              <button
                className={`nd-mapview-daytab${tripDay === 0 ? " nd-mapview-daytab--total-active" : " nd-mapview-daytab--total"}`}
                onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); setTripDay(0); setSelectedActIdx(0); }}
                onClick={(e) => { e.stopPropagation(); setTripDay(0); setSelectedActIdx(0); }}
              >Total</button>
              {Array.from({ length: detailDest.days }, (_, i) => i + 1).map((d) => (
                <button
                  key={d}
                  className={`nd-mapview-daytab${
                    tripDay === d ? " nd-mapview-daytab--active"
                    : d > 4 ? " nd-mapview-daytab--future"
                    : ""
                  }`}
                  onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); setTripDay(d); setSelectedActIdx(0); }}
                  onClick={(e) => { e.stopPropagation(); setTripDay(d); setSelectedActIdx(0); }}
                >
                  <span className="nd-mapview-daytab-num">{d}</span>
                  <span className="nd-mapview-daytab-label">DAY</span>
                </button>
              ))}
            </div>
            </>}
          </div>
        );
      })()}

      {/* ═══ Activity Detail Page ═══ */}
      {detailAct && (
        <div className="nd-act-detail">
          {/* Top bar */}
          <div className="nd-act-detail-topbar">
            <button className="nd-act-detail-back" onClick={() => setDetailAct(null)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 3L5 10L13 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="nd-act-detail-topbar-right">
              <button className="nd-act-detail-icon-btn">
                <svg width="20" height="20" viewBox="0 0 20 22" fill="none"><path d="M2 4.5V20.5L10 16.5L18 20.5V4.5C18 3.39543 17.1046 2.5 16 2.5H4C2.89543 2.5 2 3.39543 2 4.5Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg>
              </button>
              <button className="nd-act-detail-icon-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="4" r="2" fill="white"/>
                  <circle cx="10" cy="10" r="2" fill="white"/>
                  <circle cx="10" cy="16" r="2" fill="white"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Title + likes */}
          <h1 className="nd-act-detail-title">{detailAct.name}</h1>
          <div className="nd-act-detail-likes">
            <span className="nd-act-detail-likes-icon">👍</span>
            <span>1502</span>
          </div>

          {/* Photo grid */}
          <div className="nd-act-detail-photos">
            <img className="nd-act-detail-photo-main" src={`https://picsum.photos/seed/${detailAct.name.toLowerCase().replace(/\s+/g,'-')}/400/300`} alt={detailAct.name} />
            <div className="nd-act-detail-photo-grid">
              <img src={`https://picsum.photos/seed/${detailAct.name.toLowerCase().replace(/\s+/g,'-')}-2/200/150`} alt="" />
              <img src={`https://picsum.photos/seed/${detailAct.name.toLowerCase().replace(/\s+/g,'-')}-3/200/150`} alt="" />
              <img src={`https://picsum.photos/seed/${detailAct.name.toLowerCase().replace(/\s+/g,'-')}-4/200/150`} alt="" />
              <div className="nd-act-detail-photo-more">
                <img src={`https://picsum.photos/seed/${detailAct.name.toLowerCase().replace(/\s+/g,'-')}-5/200/150`} alt="" />
                <span className="nd-act-detail-photo-count">+25</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="nd-act-detail-stats">
            <div className="nd-act-detail-stat">
              <span className="nd-act-detail-stat-label">TOTAL DISTANCE</span>
              <span className="nd-act-detail-stat-val">26 <small>km</small></span>
            </div>
            <div className="nd-act-detail-stat">
              <span className="nd-act-detail-stat-label">WEATHER</span>
              <span className="nd-act-detail-stat-val">12 <small>°C</small></span>
            </div>
            <div className="nd-act-detail-stat">
              <span className="nd-act-detail-stat-label">SUNSET</span>
              <span className="nd-act-detail-stat-val">06 <small>pm</small></span>
            </div>
          </div>

          {/* Description */}
          <div className="nd-act-detail-desc-card">
            <h2 className="nd-act-detail-desc-title">{detailAct.name}</h2>
            <p className={`nd-act-detail-desc-text${descExpanded ? ' nd-act-detail-desc-text--expanded' : ''}`}>
              {detailAct.desc}
              {descExpanded && (
                <>
                  {'\n\n'}This iconic location attracts millions of visitors each year. The area is surrounded by towering video screens and neon signs, creating a vibrant atmosphere that perfectly captures the energy of Tokyo. Nearby you will find excellent shopping, dining, and entertainment options.
                  {'\n\n'}Best visited during the late afternoon or early evening when the crowds are at their peak and the lights begin to illuminate. Photography enthusiasts will find countless opportunities for stunning shots from the elevated walkways and nearby buildings.
                </>
              )}
            </p>
            <button className="nd-act-detail-readmore" onClick={() => setDescExpanded(!descExpanded)}>
              {descExpanded ? 'Show less' : 'Read more'}
            </button>
          </div>

          {/* Photo Spot Section */}
          <div className="nd-act-detail-section">
            <div className="nd-act-detail-section-header">
              <div className="nd-act-detail-section-bar"></div>
              <span className="nd-act-detail-section-label">Photo spot</span>
            </div>
            <div className="nd-act-detail-spot-tabs">
              <button className="nd-act-detail-spot-tab nd-act-detail-spot-tab--active">{detailAct.name}</button>
              <button className="nd-act-detail-spot-tab">Nearby View</button>
              <button className="nd-act-detail-spot-tab">Street</button>
            </div>
            <div className="nd-act-detail-spot-photos">
              <img className="nd-act-detail-spot-photo" src={`https://picsum.photos/seed/${detailAct.name.toLowerCase().replace(/\s+/g,'-')}-spot1/300/220`} alt="" />
              <img className="nd-act-detail-spot-photo nd-act-detail-spot-photo--overlap" src={`https://picsum.photos/seed/${detailAct.name.toLowerCase().replace(/\s+/g,'-')}-spot2/300/220`} alt="" />
            </div>
            <ul className="nd-act-detail-spot-tips">
              <li>The most iconic photo spot — best during golden hour</li>
              <li>The night view is also quite splendid</li>
            </ul>
            <div className="nd-act-detail-spot-pill">
              Shooting angle: wide shot + leading lines + sky
            </div>
          </div>

          {/* Tips Section */}
          <div className="nd-act-detail-section">
            <div className="nd-act-detail-section-header">
              <div className="nd-act-detail-section-bar"></div>
              <span className="nd-act-detail-section-label">Tips</span>
            </div>
            <div className="nd-act-detail-tips">
              <div className="nd-act-detail-tip-card">
                <span className="nd-act-detail-tip-icon">⏰</span>
                <div>
                  <p className="nd-act-detail-tip-title">Best time to visit</p>
                  <p className="nd-act-detail-tip-text">Early morning (7-9 AM) or late evening for fewer crowds</p>
                </div>
              </div>
              <div className="nd-act-detail-tip-card">
                <span className="nd-act-detail-tip-icon">💴</span>
                <div>
                  <p className="nd-act-detail-tip-title">Budget tip</p>
                  <p className="nd-act-detail-tip-text">Free to visit. Nearby convenience stores offer affordable meals</p>
                </div>
              </div>
              <div className="nd-act-detail-tip-card">
                <span className="nd-act-detail-tip-icon">🚶</span>
                <div>
                  <p className="nd-act-detail-tip-title">Getting there</p>
                  <p className="nd-act-detail-tip-text">5 min walk from the nearest station exit</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nearby Section */}
          <div className="nd-act-detail-section" style={{marginBottom: 40}}>
            <div className="nd-act-detail-section-header">
              <div className="nd-act-detail-section-bar"></div>
              <span className="nd-act-detail-section-label">Nearby</span>
            </div>
            <div className="nd-act-detail-nearby-scroll">
              {['Coffee Shop', 'Ramen Bar', 'Gift Store'].map((place, i) => (
                <div key={i} className="nd-act-detail-nearby-card">
                  <img className="nd-act-detail-nearby-img" src={`https://picsum.photos/seed/nearby-${i}/120/80`} alt={place} />
                  <p className="nd-act-detail-nearby-name">{place}</p>
                  <p className="nd-act-detail-nearby-dist">{(0.1 + i * 0.15).toFixed(1)} km</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Panel Mode — regular trip detail sheet ═══ */}
      {detailDest && !mapMode && !detailAct && (
        <div className="nd-trip-overlay" onClick={() => { if (Date.now() - mapExitTime.current < 800) return; setMapMode(true); }}
          onTouchEnd={(e) => { if (Date.now() - mapExitTime.current < 800) { e.stopPropagation(); e.preventDefault(); return; } }}>
          <div className="nd-trip-panel" onClick={e => e.stopPropagation()}>
            <div
              className="nd-trip-handle-row"
              onTouchStart={onPanelDragStart}
              onTouchEnd={onPanelDragEnd}
              onMouseDown={onPanelDragStart}
              onMouseUp={onPanelDragEnd}
              onClick={() => setMapMode(true)}
            >
              <div className="nd-trip-handle"></div>
            </div>

            {/* Day selector */}
            <div className="nd-trip-day-scroll">
              <button
                className={`nd-trip-day-tab nd-trip-day-text${tripDay === 0 ? " nd-trip-day-text-active" : ""}`}
                onClick={() => setTripDay(0)}
              >
                <span className="nd-trip-day-num">Total</span>
              </button>
              {Array.from({ length: detailDest.days }, (_, i) => i + 1).map((d) => (
                <button
                  key={d}
                  className={`nd-trip-day-tab${
                    tripDay === d ? " nd-trip-day-active"
                    : d > 4 ? " nd-trip-day-future"
                    : " nd-trip-day-inactive"
                  }`}
                  onClick={() => setTripDay(d)}
                >
                  <span className="nd-trip-day-num">{d}</span>
                  <span className="nd-trip-day-label">DAY</span>
                </button>
              ))}
            </div>

            {/* Toggle */}
            <div className="nd-trip-toggle-row">
              <button className={`nd-trip-toggle-btn${tripTab === "overview" ? " nd-trip-toggle-active" : ""}`} onClick={() => setTripTab("overview")}>
                🗺️ Overview
              </button>
              <button className={`nd-trip-toggle-btn${tripTab === "details" ? " nd-trip-toggle-active" : ""}`} onClick={() => setTripTab("details")}>
                📝 Details
              </button>
            </div>

            {/* Content */}
            <div
              className="nd-trip-body"
              onTouchStart={onPanelDragStart}
              onTouchEnd={(e) => {
                if (dragY.current === null) return;
                const endY  = e.changedTouches?.[0]?.clientY ?? e.clientY;
                const delta = endY - dragY.current;
                if (delta > 72 && e.currentTarget.scrollTop === 0) setMapMode(true);
                dragY.current = null;
              }}
            >
              {tripTab === "overview" ? (
                <>
                  {tripDay === 0 ? (
                    <>
                      <div className="nd-trip-section-head" style={{ marginBottom: 16 }}>
                        <span className="nd-trip-section-icon">🗺️</span>
                        <span className="nd-trip-section-title">Trip Overview</span>
                      </div>
                      {Object.keys(detailDest.itinerary).map(Number).sort((a,b)=>a-b).map((dayNum) => {
                        const dayData = detailDest.itinerary[dayNum];
                        return (
                          <div key={dayNum} className="nd-trip-day-group">
                            <div className="nd-trip-day-header">
                              <div className="nd-trip-day-badge">{dayNum}</div>
                              <span className="nd-trip-day-title">DAY {dayNum}</span>
                            </div>
                            <div className="nd-trip-overview-list">
                              {dayData.activities.map((act, idx) => (
                                <div key={idx} className="nd-trip-overview-row">
                                  <div className="nd-trip-overview-info">
                                    <span className="nd-trip-overview-name">{act.name}</span>
                                    <span className="nd-trip-overview-time">{act.time}</span>
                                  </div>
                                  <span className="nd-trip-overview-chevron">›</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    (() => {
                      const dayData = detailDest.itinerary[tripDay];
                      if (!dayData) return null;
                      return (
                        <div className="nd-trip-day-group">
                          <div className="nd-trip-day-subheader">
                            <span className="nd-trip-day-subheader-icon">📅</span>
                            <span className="nd-trip-day-subheader-text">
                              Day {tripDay} · {dayData.stops} Stops · {dayData.distance}
                            </span>
                          </div>
                          <div className="nd-trip-day-header">
                            <div className="nd-trip-day-badge">{tripDay}</div>
                            <span className="nd-trip-day-title">DAY {tripDay}</span>
                          </div>
                          <div className="nd-trip-activities">
                            {dayData.activities.map((act, idx) => (
                              <div key={idx}>
                                <div className="nd-trip-rich-card">
                                  <img className="nd-trip-rich-photo" src={act.img} alt={act.name} />
                                  <div className="nd-trip-rich-content">
                                    <p className="nd-trip-rich-title">{idx + 1} · {act.name}</p>
                                    <p className="nd-trip-rich-category">{act.category}</p>
                                    <p className="nd-trip-rich-desc">{act.desc}</p>
                                    <p className="nd-trip-rich-meta"><span className="nd-trip-rich-emoji">⏰</span> {act.time} · <span className="nd-trip-rich-emoji">♡</span> Save</p>
                                  </div>
                                </div>
                                {act.transport && (
                                  <div className="nd-trip-route">
                                    <div className="nd-trip-route-line" />
                                    <span className="nd-trip-route-text">{act.transport} → {act.next}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()
                  )}
                </>
              ) : (
                <>
                  <div className="nd-trip-section-head">
                    <span className="nd-trip-section-icon">📝</span>
                    <span className="nd-trip-section-title">Trip Details</span>
                  </div>
                  <div className="nd-trip-details-grid">
                    <button className="nd-trip-detail-card nd-trip-detail-card-btn" onClick={() => router.push('/notes')}>
                      <p className="nd-trip-detail-card-title">Notes</p>
                      <p className="nd-trip-detail-card-sub">Record your travel ideas</p>
                    </button>
                    <button className="nd-trip-detail-card nd-trip-detail-card-btn" onClick={() => router.push('/packing')}>
                      <p className="nd-trip-detail-card-title">Packing List</p>
                      <p className="nd-trip-detail-card-sub">Viewing others' packing lists</p>
                    </button>
                  </div>
                  <div className="nd-trip-collections">
                    <div className="nd-trip-section-head" style={{ marginBottom: 12 }}>
                      <span className="nd-trip-section-icon">📸</span>
                      <span className="nd-trip-section-title">Collections</span>
                    </div>
                    <p className="nd-trip-coll-count">My Collections · {detailDest.images.length}</p>
                    <div className="nd-trip-coll-grid">
                      {detailDest.images.map((img, i) => (
                        <div key={i} className="nd-trip-coll-thumb">
                          <img src={img} alt={`Collection ${i + 1}`} />
                          {i === 0 && <span className="nd-trip-gallery-badge">Featured</span>}
                        </div>
                      ))}
                      <div className="nd-trip-coll-add">+</div>
                    </div>
                  </div>
                  <div className="nd-trip-section-head">
                    <span className="nd-trip-section-icon">☁️</span>
                    <span className="nd-trip-section-title">Weather · Next {detailDest.weather.length} Days</span>
                  </div>
                  <div className="nd-trip-weather">
                    <p className="nd-trip-weather-city">{detailDest.city.split(",")[0]}</p>
                    <div className="nd-trip-weather-inner">
                      {detailDest.weather.map((w, idx) => {
                        const isToday = idx === 0;
                        return (
                          <div key={idx} className="nd-trip-weather-row">
                            <span className={`nd-trip-weather-date${isToday ? " nd-trip-weather-date-today" : ""}`}>{w.date}</span>
                            <div className="nd-trip-weather-right">
                              <span className="nd-trip-weather-icon">{w.icon}</span>
                              <span className={`nd-trip-weather-desc${isToday ? " nd-trip-weather-desc-today" : ""}`}>{w.desc}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
              <div style={{ height: 40 }} />
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav — hidden in map view */}
      {!mapMode && <nav className="hp-nav nearby-nav">
        <div className="hp-nav-pill">
          {NAV_ITEMS.map((item, i) => {
            if (item.center) {
              return (
                <div key="center" className="hp-nav-center-wrap">
                  <Link href="/nearby" className="hp-nav-center-btn">
                    <span className="hp-nav-center-icon">+</span>
                  </Link>
                </div>
              );
            }
            return (
              <Link key={i} href={item.href} className={`hp-nav-item${item.active ? " hp-nav-active" : ""}`}>
                <span className="hp-nav-icon">{item.icon}</span>
                <span className="hp-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>}
    </div>
  );
}
