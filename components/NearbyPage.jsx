"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { GoogleMap, useJsApiLoader, OverlayView, Polyline } from "@react-google-maps/api";

const NAV_ITEMS = [
  { icon: "⌂",  label: "Home",      href: "/",        active: false },
  { icon: "⊙",  label: "Discover",  href: "/nearby",  active: true  },
  { center: true },
  { icon: "✈︎",  label: "My Trips",  href: "/nearby",  active: false },
  { icon: "◉",  label: "Profile",   href: "/profile", active: false },
];

const GOOGLE_MAPS_API_KEY = "AIzaSyCPzP3uYvoKXNrBq6QwsXAQ1TFuenwG3gU";

// Clean dark map — matches reference app aesthetic in dark mode
const MAP_STYLE = [
  { elementType: "geometry",                                              stylers: [{ color: "#1e2235" }] },
  { elementType: "labels.text.fill",                                      stylers: [{ color: "#8896b8" }] },
  { elementType: "labels.text.stroke",                                    stylers: [{ color: "#1e2235" }] },
  { featureType: "poi",                elementType: "all",                stylers: [{ visibility: "off" }] },
  { featureType: "transit",            elementType: "all",                stylers: [{ visibility: "off" }] },
  { featureType: "road",               elementType: "geometry.fill",      stylers: [{ color: "#2a2f4a" }] },
  { featureType: "road",               elementType: "geometry.stroke",    stylers: [{ color: "#1e2235" }] },
  { featureType: "road",               elementType: "labels.text.fill",   stylers: [{ color: "#5a6480" }] },
  { featureType: "road.highway",       elementType: "geometry",           stylers: [{ color: "#333858" }] },
  { featureType: "road.highway",       elementType: "labels.icon",        stylers: [{ visibility: "off" }] },
  { featureType: "road.arterial",      elementType: "labels.icon",        stylers: [{ visibility: "off" }] },
  { featureType: "landscape",          elementType: "geometry",           stylers: [{ color: "#1e2235" }] },
  { featureType: "landscape.natural",  elementType: "geometry",           stylers: [{ color: "#1a2830" }] },
  { featureType: "water",              elementType: "geometry",           stylers: [{ color: "#111828" }] },
  { featureType: "water",              elementType: "labels.text.fill",   stylers: [{ color: "#2a4060" }] },
  { featureType: "administrative",     elementType: "geometry.stroke",    stylers: [{ color: "#2e3555" }] },
  { featureType: "administrative.country",  elementType: "labels.text.fill", stylers: [{ color: "#9098b8" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#a0a8c8" }] },
];

// Consistent place photo using picsum seed (reliable for demos)
function getPlacePhoto(name) {
  const seed = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return `https://picsum.photos/seed/${seed}/480/320`;
}

// Place detail lookup: tip + hours per location
const PLACE_INFO = {
  // Tokyo
  "Senso-ji Temple":          { tip: "Tokyo's oldest temple — stunning at dawn before the crowds arrive", hours: "6:00 – 17:00" },
  "Akihabara":                { tip: "Electric Town: anime, manga, and retro arcades on every block", hours: "Open 24h (shops 10:00–21:00)" },
  "Shinjuku Gyoen":           { tip: "Massive park with 1,000+ cherry trees and a French garden", hours: "9:00 – 16:30 (closed Mon)" },
  "Tokyo Tower":              { tip: "Iconic orange lattice tower — best viewed from Zōjō-ji garden", hours: "9:00 – 23:00" },
  "Shibuya Crossing":         { tip: "World's busiest scramble crossing — best shot from Starbucks above", hours: "Open 24h" },
  "Harajuku":                 { tip: "Takeshita Street for bold street fashion; Omotesandō for luxury", hours: "Shops 10:00–21:00" },
  "Tsukiji Outer Market":     { tip: "Fresh sushi and tamagoyaki for breakfast — arrive before 8 am", hours: "5:00 – 14:00" },
  "Ginza":                    { tip: "Tokyo's upscale shopping district; Itoya for premium stationery", hours: "Shops 11:00–21:00" },
  "Shinjuku":                 { tip: "Neon-lit entertainment hub — Golden Gai for tiny hidden bars", hours: "Open 24h" },
  "Ueno Park":                { tip: "Home to Tokyo National Museum and rowdy cherry-blossom parties", hours: "5:00 – 23:00" },
  "Asakusa":                  { tip: "Old shitamachi vibe; rickshaw rides and traditional crafts", hours: "Open 24h (shops 10:00–19:00)" },
  "Odaiba":                   { tip: "Futuristic island with teamLab, Gundam statue, and bay views", hours: "Varies by venue" },
  "Toyosu Market":            { tip: "World's largest fish market — tuna auction requires advance booking", hours: "5:00 – 15:00 (closed Sun/Wed)" },
  "Roppongi":                 { tip: "Art Triangle: Mori Art Museum, 21_21 Design Sight, and more", hours: "Shops open from 11:00" },
  "Ramen Museum":             { tip: "Recreated 1958 alley with eight regional ramen masters under one roof", hours: "11:00 – 22:00" },
  "Izakaya Crawl":            { tip: "Hopping between tiny izakayas in Shinjuku's Memory Lane is unmissable", hours: "From 17:00" },
  "Sushi Dai":                { tip: "Legendary Tsukiji omakase counter — expect a 2–3 hour queue", hours: "5:00 – 14:00 (closed Sun)" },
  // Osaka / Kyoto
  "Dotonbori":                { tip: "Osaka's neon canal strip — try takoyaki and kushikatsu on the go", hours: "Open 24h (restaurants 11:00–24:00)" },
  "Kuromon Market":           { tip: "\"Osaka's kitchen\" — 170 stalls selling the freshest seafood and produce", hours: "8:00 – 18:00" },
  "Osaka Castle":             { tip: "16th-century fortress surrounded by a photogenic moat and gardens", hours: "9:00 – 17:00" },
  "Arashiyama Bamboo Grove":  { tip: "Walk the bamboo path at 7 am to beat the tour groups completely", hours: "Open 24h (free)" },
  "Kinkaku-ji":               { tip: "The Golden Pavilion — every surface gold-leaf, reflecting in the pond", hours: "9:00 – 17:00" },
  "Gion":                     { tip: "Kyoto's geisha district — best for spotting maiko at dusk on Hanamikoji", hours: "Open 24h (street)" },
  "Fushimi Inari Shrine":     { tip: "10,000 vermilion torii gates winding 4 km up the mountain", hours: "Open 24h (free)" },
  "Kiyomizu-dera":            { tip: "Wooden stage temple perched on a hillside — sweeping city views", hours: "6:00 – 18:00" },
  "Nishiki Market":           { tip: "\"Kyoto's pantry\" — five-block covered arcade of pickles and street food", hours: "9:00 – 18:00" },
  "Kyoto Tofu Cuisine":       { tip: "Try kaiseki-style yudofu in a traditional machiya townhouse", hours: "Lunch/Dinner (book ahead)" },
  "Nakasu Yatai":             { tip: "Open-air food stalls along the river in central Fukuoka", hours: "18:00 – 01:00" },
  "Hakata Ramen":             { tip: "Tonkotsu broth, thin noodles, and free kaedama (noodle refills)", hours: "11:00 – midnight" },
  "Yanagibashi Market":       { tip: "Fukuoka's oldest market — fresh fish and local produce since 1910", hours: "6:00 – 15:00 (closed Sun)" },
  "Tenjin Food Street":       { tip: "Underground arcade packed with regional Kyushu specialties", hours: "10:00 – 22:00" },
  // Bangkok / SE Asia
  "Grand Palace":             { tip: "Glittering complex of spires and murals — dress code strictly enforced", hours: "8:30 – 15:30" },
  "Wat Pho":                  { tip: "46-metre reclining Buddha and birthplace of Thai massage", hours: "8:00 – 18:30" },
  "Khao San Road":            { tip: "Backpacker hub for cheap pad thai, buckets, and live music", hours: "Open 24h" },
  "Chatuchak Market":         { tip: "8,000-stall weekend market — arrive early and wear comfortable shoes", hours: "Sat–Sun 9:00 – 18:00" },
  "Asok Night Market":        { tip: "Hipster night market under a skytrain station — great craft beer", hours: "17:00 – 01:00" },
  "Old City":                 { tip: "Chiang Mai's moat-ringed historic centre with 300+ temples", hours: "Open 24h" },
  "Doi Suthep":               { tip: "Sacred mountain temple with sweeping views of Chiang Mai valley", hours: "6:00 – 18:00" },
  "Night Safari":             { tip: "World-famous open-air nocturnal zoo — tram or walking trail", hours: "18:00 – 23:00" },
  "Elephant Sanctuary":       { tip: "Ethical sanctuary: feed and bathe rescued elephants, no riding", hours: "8:00 – 17:00 (book ahead)" },
  "Craft Village":            { tip: "Bo Sang umbrella village and San Kamphaeng silk workshops", hours: "9:00 – 18:00" },
  "Ubud Monkey Forest":       { tip: "Sacred forest with 700 macaques — secure your bags and sunglasses!", hours: "8:30 – 18:00" },
  "Rice Terraces":            { tip: "Tegallalang's cascading UNESCO rice paddies look best in the morning", hours: "Open 24h (small entry fee)" },
  "Kuta Beach":               { tip: "Bali's original surf beach — good beginner waves and legendary sunsets", hours: "Open 24h" },
  "Tanah Lot":                { tip: "Sea temple on a rock — walk across at low tide, glowing at sunset", hours: "7:00 – 19:00" },
  "Jimbaran Sunset":          { tip: "Fresh seafood BBQ on the beach while the sun drops into the ocean", hours: "From 17:00" },
  "Or Tor Kor Market":        { tip: "Thailand's finest produce market — luxurious fruits and prepared food", hours: "6:00 – 18:00" },
  "Nahm Restaurant":          { tip: "World-class Thai fine dining — book at least two weeks ahead", hours: "Dinner only (closed Sun)" },
  "Floating Market":          { tip: "Damnoen Saduak: vendors in wooden boats laden with tropical fruit", hours: "7:00 – 12:00" },
  // Paris / Europe
  "Eiffel Tower":             { tip: "Go at dusk for golden hour then stay for the twinkling light show", hours: "9:00 – 23:45 (Jul–Aug until 00:45)" },
  "Louvre Museum":            { tip: "Arrive at opening or pre-book timed entry — Mona Lisa is smaller than expected", hours: "9:00 – 18:00 (closed Tue)" },
  "Seine River Cruise":       { tip: "Bateaux-Mouches evening cruise with illuminated bridges and monuments", hours: "10:00 – 22:30" },
  "Palace of Versailles":     { tip: "Come on a weekday; the Hall of Mirrors is breathtaking in morning light", hours: "9:00 – 17:30 (closed Mon)" },
  "Montmartre":               { tip: "Sacré-Cœur at sunrise, then crêpes and artists in Place du Tertre", hours: "Open 24h (Sacré-Cœur 6:00–22:30)" },
  "Musée d'Orsay":            { tip: "Best Impressionist collection in the world — housed in a Beaux-Arts station", hours: "9:30 – 18:00 (Thu until 21:45, closed Mon)" },
  "Le Marais":                { tip: "Jewish quarter meets hipster galleries — free entry to Centre Pompidou plaza", hours: "Open 24h (shops 10:00–19:00)" },
  "Van Gogh Museum":          { tip: "200+ Van Gogh works — book online, sells out weeks in advance", hours: "9:00 – 17:00 (Fri until 21:00)" },
  "Canal Cruise":             { tip: "Stromma or Blue Boat for leisurely tour of Amsterdam's UNESCO canals", hours: "10:00 – 17:00" },
  "Anne Frank House":         { tip: "Deeply moving — book tickets months ahead, no same-day entry available", hours: "9:00 – 22:00" },
  "Rijksmuseum":              { tip: "Rembrandt's Night Watch and 8,000 masterpieces in one stunning building", hours: "9:00 – 17:00" },
  "Grand Place":              { tip: "Brussels' baroque centrepiece — lit up at night, flower carpet in Aug", hours: "Open 24h" },
  "Atomium":                  { tip: "Retro-futurist landmark from 1958 World's Fair with panoramic city views", hours: "10:00 – 18:00" },
  "Chocolate Shops":          { tip: "Mary, Neuhaus, and Pierre Marcolini for world-class Belgian pralines", hours: "10:00 – 19:00" },
  "Galeries Lafayette":       { tip: "Stunning Art Nouveau dome — rooftop terrace has a free panoramic view", hours: "10:00 – 20:30" },
  "Champs-Élysées":           { tip: "2 km of luxury and cinemas — the Arc de Triomphe is free for under-26 EU", hours: "Open 24h (shops 10:00–22:00)" },
  // Hong Kong / Macau
  "Victoria Harbour":         { tip: "Iconic skyline — catch the Symphony of Lights laser show at 8 pm", hours: "Open 24h" },
  "Mong Kok":                 { tip: "Densest neighbourhood on Earth: Ladies' Market, Sneaker Street, night food", hours: "Open 24h (markets from 12:00)" },
  "Temple Street Night Market":{ tip: "Cantonese opera, fortune tellers, and dai pai dong stalls from 6 pm", hours: "15:00 – 23:00" },
  "Victoria Peak":            { tip: "Take the historic Peak Tram — panoramic harbour view from the Sky Terrace", hours: "Peak Tram 7:00 – 24:00" },
  "Stanley":                  { tip: "Laid-back waterfront with a colonial market and fresh seafood restaurants", hours: "Market 10:00 – 18:00" },
  "Ocean Park":               { tip: "Cable car ride over the South China Sea, giant pandas, and thrill rides", hours: "10:00 – 19:00" },
  "Ruins of St. Paul's":      { tip: "Iconic Macau facade — climb the stone staircase for a cathedral overview", hours: "Open 24h (free)" },
  "The Venetian":             { tip: "World's second-largest building: gondolas, canals, and 3,000 suites", hours: "Casino 24h; shops 10:00 – 23:00" },
  "Rua do Cunha":             { tip: "Almond cookies, egg rolls, and Macau pork jerky to take home", hours: "Shops 9:00 – 22:00" },
  "Coloane Village":          { tip: "Quiet Portuguese village with pastel houses and the original egg tart bakery", hours: "Open 24h (shops 9:00–18:00)" },
  "Portuguese Egg Tart Tour": { tip: "Lord Stow's Bakery in Coloane invented the Macau egg tart in 1989", hours: "7:00 – 22:00" },
  // Seoul / Busan
  "Gyeongbokgung Palace":     { tip: "Joseon dynasty palace — free entry in traditional hanbok costume", hours: "9:00 – 18:00 (closed Tue)" },
  "Bukchon Hanok Village":    { tip: "600-year-old neighbourhood of preserved hanok houses above Insadong", hours: "Open 24h (please be quiet for residents)" },
  "Insadong":                 { tip: "Antiques, indie craft shops, and street food in a car-free alley", hours: "Shops 10:00 – 21:00" },
  "Myeongdong":               { tip: "K-beauty paradise — sample sheet masks and snail cream for free outside", hours: "Shops 10:00 – 22:00 (street food from 12:00)" },
  "N Seoul Tower":            { tip: "Love lock fence and 360° city view — take the cable car at sunset", hours: "10:00 – 23:00" },
  "Dongdaemun":               { tip: "24-hour fashion district — DDP arena glows at night under Zaha Hadid design", hours: "Open 24h (malls open from 10:30)" },
  "Haeundae Beach":           { tip: "Korea's most famous beach — perfect for a sunrise walk in autumn", hours: "Open 24h" },
  "BIFF Square":              { tip: "Busan's Cannes — hand prints of Korean stars and street food stalls", hours: "Open 24h" },
  "Gamcheon Culture Village": { tip: "\"Busan's Santorini\" — pastel maze of alleys, murals, and indie cafes", hours: "Open 24h (cafes 10:00–18:00)" },
  "Nampo-dong":               { tip: "Street food hub: Ssiat Hotteok sweet pancakes are a must-try", hours: "Shops 10:00 – 22:00" },
  "Hongdae":                  { tip: "University arts district — buskers, clubs, and independent streetwear shops", hours: "Open 24h (nightlife from 21:00)" },
  "Itaewon":                  { tip: "Seoul's most international neighbourhood — every cuisine you can imagine", hours: "Restaurants 11:00 – 24:00" },
  "Han River Park":           { tip: "Rent a bike or bring a chimaek (chicken + beer) picnic on the riverside", hours: "Open 24h (some facilities close 22:00)" },
  // Auckland / NZ
  "Sky Tower":                { tip: "New Zealand's tallest structure — SkyJump bungee from the observation deck", hours: "8:30 – 22:00 (Fri–Sat until 23:00)" },
  "Waiheke Beach":            { tip: "Onetangi Beach and award-winning wineries 35 minutes from the CBD by ferry", hours: "Ferry every 30 min from 6:00" },
  "Geothermal Park":          { tip: "Te Puia's boiling mud pools and the Pōhutu geyser erupting hourly", hours: "8:00 – 17:00" },
  "Maori Cultural Village":   { tip: "Haka, hāngī feast, and wharenui — immersive evening show at Te Puia", hours: "Evening shows from 18:15" },
  "Lake Wakatipu":            { tip: "Glacier-carved lake — TSS Earnslaw steamship cruise to Walter Peak Farm", hours: "Open 24h" },
  "Bungee Jump":              { tip: "AJ Hackett's Kawarau Bridge: the world's first commercial bungee site since 1988", hours: "9:00 – 17:00" },
  "Milford Sound Cruise":     { tip: "Drive the stunning Homer Tunnel then cruise past Mitre Peak and waterfalls", hours: "Cruises depart 9:30 – 15:00" },
  "Paragliding":              { tip: "Tandem paraglide from Coronet Peak — 360° views of the Remarkables", hours: "Weather permitting, 9:00 – 17:00" },
  "Queenstown Town":          { tip: "Pedestrian mall with bungee bars, The Bunker restaurant, and waterfront cafes", hours: "Open 24h (shops 9:00–21:00)" },
  "Waiheke Island":           { tip: "Last morning: vineyard brunch at Mudbrick or Cable Bay before the ferry back", hours: "Ferry every 30 min from 6:00" },
};

const CITY_COORDS = {
  Tokyo:       { lat: 35.68,  lng: 139.69 },
  Osaka:       { lat: 34.69,  lng: 135.50 },
  Kyoto:       { lat: 35.01,  lng: 135.77 },
  Fukuoka:     { lat: 33.59,  lng: 130.39 },
  Bangkok:     { lat: 13.75,  lng: 100.50 },
  "Chiang Mai":{ lat: 18.79,  lng: 98.98  },
  Bali:        { lat: -8.34,  lng: 115.09 },
  Paris:       { lat: 48.85,  lng: 2.35   },
  Amsterdam:   { lat: 52.37,  lng: 4.89   },
  Brussels:    { lat: 50.85,  lng: 4.35   },
  "Hong Kong": { lat: 22.32,  lng: 114.17 },
  Macau:       { lat: 22.16,  lng: 113.55 },
  Seoul:       { lat: 37.56,  lng: 126.97 },
  Busan:       { lat: 35.10,  lng: 129.03 },
  Auckland:    { lat: -36.85, lng: 174.76 },
  Rotorua:     { lat: -38.14, lng: 176.25 },
  Queenstown:  { lat: -45.03, lng: 168.66 },
};

const CLUSTERS = [
  {
    id: "tokyo", city: "Tokyo", lat: 35.68, lng: 139.69,
    itineraries: [
      {
        id: 101, title: "5-Day Japan Classic", duration: "5 days · 4 nights",
        cities: ["Tokyo", "Osaka", "Kyoto"], tags: ["Culture", "Food"],
        days: [
          { day: 1, city: "Tokyo",  places: ["Senso-ji Temple", "Akihabara", "Shinjuku Gyoen"] },
          { day: 2, city: "Tokyo",  places: ["Tokyo Tower", "Shibuya Crossing", "Harajuku"] },
          { day: 3, city: "Osaka",  places: ["Dotonbori", "Kuromon Market", "Osaka Castle"] },
          { day: 4, city: "Kyoto",  places: ["Arashiyama Bamboo Grove", "Kinkaku-ji", "Gion"] },
          { day: 5, city: "Kyoto",  places: ["Fushimi Inari Shrine", "Kiyomizu-dera"] },
        ],
      },
      {
        id: 102, title: "3-Day Tokyo Deep Dive", duration: "3 days · 2 nights",
        cities: ["Tokyo"], tags: ["Culture", "Shopping"],
        days: [
          { day: 1, city: "Tokyo", places: ["Tsukiji Outer Market", "Ginza", "Shinjuku"] },
          { day: 2, city: "Tokyo", places: ["Ueno Park", "Akihabara", "Asakusa"] },
          { day: 3, city: "Tokyo", places: ["Odaiba", "Toyosu Market", "Roppongi"] },
        ],
      },
      {
        id: 103, title: "7-Day Japan Foodie Trail", duration: "7 days · 6 nights",
        cities: ["Tokyo", "Osaka", "Fukuoka"], tags: ["Food"],
        days: [
          { day: 1, city: "Tokyo",   places: ["Tsukiji Outer Market", "Sushi Dai"] },
          { day: 2, city: "Tokyo",   places: ["Ramen Museum", "Izakaya Crawl"] },
          { day: 3, city: "Osaka",   places: ["Dotonbori", "Kuromon Market", "Takoyaki"] },
          { day: 4, city: "Osaka",   places: ["Nishiki Market", "Kyoto Tofu Cuisine"] },
          { day: 5, city: "Fukuoka", places: ["Nakasu Yatai", "Hakata Ramen"] },
          { day: 6, city: "Fukuoka", places: ["Yanagibashi Market", "Tenjin Food Street"] },
          { day: 7, city: "Fukuoka", places: ["Free Exploration", "Souvenir Shopping"] },
        ],
      },
    ],
  },
  {
    id: "bangkok", city: "Bangkok", lat: 13.75, lng: 100.50,
    itineraries: [
      {
        id: 201, title: "7-Day Southeast Asia Hop", duration: "7 days · 6 nights",
        cities: ["Bangkok", "Chiang Mai", "Bali"], tags: ["Islands", "Nature"],
        days: [
          { day: 1, city: "Bangkok",    places: ["Grand Palace", "Wat Pho", "Khao San Road"] },
          { day: 2, city: "Bangkok",    places: ["Chatuchak Market", "Asok Night Market"] },
          { day: 3, city: "Chiang Mai", places: ["Old City", "Doi Suthep", "Night Safari"] },
          { day: 4, city: "Chiang Mai", places: ["Elephant Sanctuary", "Craft Village"] },
          { day: 5, city: "Bali",       places: ["Ubud Monkey Forest", "Rice Terraces"] },
          { day: 6, city: "Bali",       places: ["Kuta Beach", "Tanah Lot"] },
          { day: 7, city: "Bali",       places: ["Jimbaran Sunset", "Free Time"] },
        ],
      },
      {
        id: 202, title: "4-Day Bangkok Street Food", duration: "4 days · 3 nights",
        cities: ["Bangkok"], tags: ["Food"],
        days: [
          { day: 1, city: "Bangkok", places: ["Or Tor Kor Market", "Nahm Restaurant"] },
          { day: 2, city: "Bangkok", places: ["Street Food Crawl", "Chinatown"] },
          { day: 3, city: "Bangkok", places: ["Weekend Market", "Floating Market"] },
          { day: 4, city: "Bangkok", places: ["Michelin Cheap Eats", "Night Market"] },
        ],
      },
    ],
  },
  {
    id: "paris", city: "Paris", lat: 48.85, lng: 2.35,
    itineraries: [
      {
        id: 301, title: "10-Day Western Europe Art", duration: "10 days · 9 nights",
        cities: ["Paris", "Amsterdam", "Brussels"], tags: ["Culture", "Art"],
        days: [
          { day: 1, city: "Paris",     places: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise"] },
          { day: 2, city: "Paris",     places: ["Palace of Versailles", "Montmartre"] },
          { day: 3, city: "Paris",     places: ["Musée d'Orsay", "Le Marais"] },
          { day: 4, city: "Amsterdam", places: ["Van Gogh Museum", "Canal Cruise"] },
          { day: 5, city: "Amsterdam", places: ["Anne Frank House", "Rijksmuseum"] },
          { day: 6, city: "Brussels",  places: ["Grand Place", "Atomium", "Chocolate Shops"] },
          { day: 7, city: "Paris",     places: ["Sainte-Chapelle", "Marais Cafes"] },
        ],
      },
      {
        id: 302, title: "5-Day Paris Shopping", duration: "5 days · 4 nights",
        cities: ["Paris"], tags: ["Shopping", "Food"],
        days: [
          { day: 1, city: "Paris", places: ["Galeries Lafayette", "Printemps"] },
          { day: 2, city: "Paris", places: ["Champs-Élysées", "Avenue Montaigne"] },
          { day: 3, city: "Paris", places: ["Le Marais Boutiques", "Saint-Germain"] },
          { day: 4, city: "Paris", places: ["Vintage Markets", "Flea Market"] },
          { day: 5, city: "Paris", places: ["Airport Duty Free", "Last Shopping"] },
        ],
      },
      {
        id: 303, title: "3-Day Paris Family", duration: "3 days · 2 nights",
        cities: ["Paris"], tags: ["Culture"],
        days: [
          { day: 1, city: "Paris", places: ["Disneyland Paris"] },
          { day: 2, city: "Paris", places: ["Natural History Museum", "Luxembourg Gardens"] },
          { day: 3, city: "Paris", places: ["Eiffel Tower", "Seine River Cruise"] },
        ],
      },
    ],
  },
  {
    id: "hongkong", city: "Hong Kong", lat: 22.32, lng: 114.17,
    itineraries: [
      {
        id: 401, title: "4-Day HK & Macau", duration: "4 days · 3 nights",
        cities: ["Hong Kong", "Macau"], tags: ["Food", "Shopping"],
        days: [
          { day: 1, city: "Hong Kong", places: ["Victoria Harbour", "Mong Kok", "Temple Street Night Market"] },
          { day: 2, city: "Hong Kong", places: ["Victoria Peak", "Stanley", "Ocean Park"] },
          { day: 3, city: "Macau",     places: ["Ruins of St. Paul's", "The Venetian", "Rua do Cunha"] },
          { day: 4, city: "Macau",     places: ["Coloane Village", "Portuguese Egg Tart Tour"] },
        ],
      },
      {
        id: 402, title: "2-Day HK Food Sprint", duration: "2 days · 1 night",
        cities: ["Hong Kong"], tags: ["Food"],
        days: [
          { day: 1, city: "Hong Kong", places: ["Central Cha Chaan Teng", "Causeway Bay Street Food", "Temple Street Dai Pai Dong"] },
          { day: 2, city: "Hong Kong", places: ["Dim Sum Brunch", "Typhoon Shelter Crab", "Stanley Seafood"] },
        ],
      },
    ],
  },
  {
    id: "seoul", city: "Seoul", lat: 37.56, lng: 126.97,
    itineraries: [
      {
        id: 501, title: "5-Day Korea Full Experience", duration: "5 days · 4 nights",
        cities: ["Seoul", "Busan"], tags: ["Culture", "Food"],
        days: [
          { day: 1, city: "Seoul", places: ["Gyeongbokgung Palace", "Bukchon Hanok Village", "Insadong"] },
          { day: 2, city: "Seoul", places: ["Myeongdong", "N Seoul Tower", "Dongdaemun"] },
          { day: 3, city: "Busan", places: ["Haeundae Beach", "BIFF Square"] },
          { day: 4, city: "Busan", places: ["Gamcheon Culture Village", "Nampo-dong"] },
          { day: 5, city: "Seoul", places: ["Hongdae", "Itaewon", "Han River Park"] },
        ],
      },
      {
        id: 502, title: "3-Day Seoul Trendy Tour", duration: "3 days · 2 nights",
        cities: ["Seoul"], tags: ["Shopping", "Culture"],
        days: [
          { day: 1, city: "Seoul", places: ["Hongdae Streets", "Hapjeong Coffee Lane"] },
          { day: 2, city: "Seoul", places: ["Seongsu Industrial Vibe", "Apgujeong Rodeo"] },
          { day: 3, city: "Seoul", places: ["Ikseon-dong Hanok Cafes", "Cheonggyecheon Stream"] },
        ],
      },
    ],
  },
  {
    id: "auckland", city: "Auckland", lat: -36.85, lng: 174.76,
    itineraries: [
      {
        id: 601, title: "6-Day New Zealand Nature", duration: "6 days · 5 nights",
        cities: ["Auckland", "Rotorua", "Queenstown"], tags: ["Nature", "Adventure"],
        days: [
          { day: 1, city: "Auckland",   places: ["Sky Tower", "Waiheke Beach"] },
          { day: 2, city: "Rotorua",    places: ["Geothermal Park", "Maori Cultural Village"] },
          { day: 3, city: "Queenstown", places: ["Lake Wakatipu", "Bungee Jump"] },
          { day: 4, city: "Queenstown", places: ["Milford Sound Cruise"] },
          { day: 5, city: "Queenstown", places: ["Paragliding", "Queenstown Town"] },
          { day: 6, city: "Auckland",   places: ["Waiheke Island", "Departure"] },
        ],
      },
    ],
  },
];

const TAG_COLORS = {
  Culture: "#7c6ef5", Food: "#f5a623", Islands: "#4fc08d",
  Nature: "#52b788", Art: "#e07ab3", Adventure: "#e05c4b", Shopping: "#5b9cf5",
};
const ALL_TAGS = ["All", "Culture", "Food", "Islands", "Nature", "Art", "Adventure", "Shopping"];

const PRIMARY = "#4a8fe8";
const PRIMARY_DIM = "rgba(74,143,232,0.15)";

function getPlacePins(day) {
  const base = CITY_COORDS[day.city] ?? { lat: 35, lng: 105 };
  const n = day.places.length;
  return day.places.map((place, i) => {
    const t = n === 1 ? 0 : (i / (n - 1) - 0.5);
    return {
      num: i + 1,
      name: place,
      coords: { lat: base.lat + t * 0.05 * 0.4, lng: base.lng + t * 0.05 },
    };
  });
}

// ── Google Map ────────────────────────────────────────
function ItineraryMap({ clusters, selectedCluster, onClusterClick, dayPins, activeDayIdx, placePins, activePlaceIdx, mapRef: externalMapRef }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    language: "en",
  });
  const internalRef = useRef(null);

  const onLoad = useCallback((map) => {
    internalRef.current = map;
    if (externalMapRef) externalMapRef.current = map;
  }, [externalMapRef]);

  if (!isLoaded) {
    return <div className="itin-map itin-map-loading"><span>Loading map…</span></div>;
  }

  const polylinePath = placePins ? placePins.map((p) => p.coords) : [];

  return (
    <GoogleMap
      mapContainerClassName="itin-map"
      center={{ lat: 28, lng: 118 }}
      zoom={4}
      options={{ styles: MAP_STYLE, disableDefaultUI: true, gestureHandling: "greedy" }}
      onLoad={onLoad}
    >
      {/* Cluster pins */}
      {!dayPins && !placePins && clusters.map((cluster) => {
        const isSelected = selectedCluster?.id === cluster.id;
        const count = cluster.itineraries.length;
        return (
          <OverlayView key={cluster.id} position={{ lat: cluster.lat, lng: cluster.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <div className={`cluster-pin ${isSelected ? "cluster-pin-active" : ""}`}
              onClick={() => onClusterClick(cluster)}>
              <div className="cluster-dot">
                {count > 1 && <span className="cluster-count">{count}</span>}
              </div>
              <div className="cluster-label">{cluster.city}</div>
            </div>
          </OverlayView>
        );
      })}

      {/* Day-level pins — overview mode */}
      {dayPins && !placePins && dayPins.map((pin, i) => {
        const isActive = i === activeDayIdx;
        return (
          <OverlayView key={i} position={pin.coords}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <div className={`day-map-pin ${isActive ? "day-map-pin-active" : ""}`}
              style={{ "--pin-color": PRIMARY }}>
              <div className="day-map-dot">
                <span className="day-map-num">{pin.day}</span>
              </div>
              {isActive && <div className="day-map-label">{pin.city}</div>}
            </div>
          </OverlayView>
        );
      })}

      {/* Place-level pins — single day detail */}
      {placePins && (
        <>
          <Polyline
            path={polylinePath}
            options={{
              strokeColor: PRIMARY,
              strokeOpacity: 0,
              strokeWeight: 3,
              icons: [{
                icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 4 },
                offset: "0",
                repeat: "20px",
              }],
            }}
          />
          {placePins.map((pin, i) => {
            const isActive = i === activePlaceIdx;
            return (
              <OverlayView key={i} position={pin.coords}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                <div className={`place-map-pin ${isActive ? "place-map-pin-active" : ""}`}>
                  <div className="place-map-dot">
                    <span className="place-map-num">{pin.num}</span>
                  </div>
                  {isActive && <div className="place-map-label">{pin.name}</div>}
                </div>
              </OverlayView>
            );
          })}
        </>
      )}
    </GoogleMap>
  );
}

// ── City sheet ────────────────────────────────────────
function CitySheet({ cluster, onSelect, onClose }) {
  if (!cluster) return null;
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="city-sheet">
        <div className="card-drag-handle" />
        <div className="city-sheet-header">
          <h2 className="city-sheet-title">
            {cluster.city}
            <span className="city-sheet-count">{cluster.itineraries.length} trips</span>
          </h2>
          <button className="sheet-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="city-itin-list">
          {cluster.itineraries.map((itin) => (
            <button key={itin.id} className="city-itin-row" onClick={() => onSelect(itin)}>
              <div className="city-itin-info">
                <div className="city-itin-title">{itin.title}</div>
                <div className="city-itin-meta">{itin.cities.join(" → ")} · {itin.duration}</div>
                <div className="city-itin-tags">
                  {itin.tags.map((t) => (
                    <span key={t} className="itin-tag"
                      style={{ background: TAG_COLORS[t] + "25", color: TAG_COLORS[t] }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <span className="city-itin-arrow">›</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Place card feed (P1 single day) ──────────────────
function PlaceFeed({ day, activePlaceIdx, onPlaceChange }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const cards = scrollRef.current.querySelectorAll(".place-card");
    cards[activePlaceIdx]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activePlaceIdx]);

  function handleScroll() {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.querySelector(".place-card");
    if (!card) return;
    const cardWidth = card.offsetWidth + 12;
    const idx = Math.round(container.scrollLeft / cardWidth);
    if (idx !== activePlaceIdx && idx >= 0 && idx < day.places.length) {
      onPlaceChange(idx);
    }
  }

  return (
    <div className="place-feed-wrap">
      <div className="place-feed-counter">
        <span style={{ color: PRIMARY }}>{activePlaceIdx + 1}</span>
        <span className="place-feed-counter-total"> / {day.places.length}</span>
      </div>
      <div className="place-cards-scroll" ref={scrollRef} onScroll={handleScroll}>
        {day.places.map((place, i) => {
          const isActive = i === activePlaceIdx;
          const info = PLACE_INFO[place] || {};
          const seed = place.toLowerCase().replace(/[^a-z0-9]/g, "-");
          return (
            <div
              key={i}
              className={`place-card ${isActive ? "place-card-active" : ""}`}
              onClick={() => onPlaceChange(i)}
            >
              {/* Header: thumb + name + arrow */}
              <div className="place-card-header">
                <img className="place-card-thumb" src={`https://picsum.photos/seed/${seed}/80/80`} alt={place} loading="lazy" />
                <div className="place-card-header-text">
                  <div className="place-card-name">{place}</div>
                  <div className="place-card-type">{day.city} · Attraction</div>
                </div>
                <span className="place-card-arrow">›</span>
              </div>

              {/* Description */}
              {info.tip && <div className="place-card-tip">{info.tip}</div>}

              {/* Photo gallery */}
              <div className="place-card-gallery">
                {[seed, seed + "-b", seed + "-c"].map((s, gi) => (
                  <img key={gi} className="place-card-gallery-img" src={`https://picsum.photos/seed/${s}/200/150`} alt="" loading="lazy" />
                ))}
              </div>

              {/* Footer */}
              <div className="place-card-footer">
                <span className="place-card-source">《{day.city} · Day {i + 1}》</span>
                <button className="place-card-save" onClick={e => e.stopPropagation()}>收藏</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Itinerary detail sheet (P2/P3/P1) ─────────────────
function ItinerarySheet({ itin, activeDayIdx, activePlaceIdx, onDayChange, onPlaceChange, onBack, onCopy }) {
  const tabScrollRef = useRef(null);
  const isOverview = activeDayIdx === null;

  useEffect(() => {
    if (!tabScrollRef.current) return;
    const tabs = tabScrollRef.current.querySelectorAll(".day-tab");
    const activeTab = activeDayIdx === null ? tabs[0] : tabs[activeDayIdx + 1];
    activeTab?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeDayIdx]);

  const currentDay = !isOverview ? itin.days[activeDayIdx] : null;

  return (
    <div className="itin-sheet">
      <div className="card-drag-handle" />

      <div className="itin-sheet-header">
        <button className="itin-sheet-back" onClick={onBack}>← Back</button>
        <div className="itin-sheet-title-wrap">
          <div className="itin-sheet-title">{itin.title}</div>
          <div className="itin-sheet-meta">{itin.cities.join(" → ")} · {itin.duration}</div>
        </div>
        <button className="itin-sheet-copy" onClick={onCopy}>Copy</button>
      </div>

      <div className="day-tab-bar" ref={tabScrollRef}>
        <button
          className={`day-tab ${isOverview ? "day-tab-active" : ""}`}
          onClick={() => onDayChange(null)}
        >
          Overview
        </button>
        {itin.days.map((d, i) => {
          const isActive = activeDayIdx === i;
          return (
            <button
              key={i}
              className={`day-tab ${isActive ? "day-tab-active" : ""}`}
              style={isActive ? { background: PRIMARY, color: "#fff", borderColor: PRIMARY } : {}}
              onClick={() => onDayChange(i)}
            >
              Day {d.day}
            </button>
          );
        })}
      </div>

      {/* Overview — P3 */}
      {isOverview && (
        <div className="day-overview-list">
          {itin.days.map((d, i) => {
            return (
              <button key={i} className="day-overview-row" onClick={() => onDayChange(i)}>
                <div className="day-overview-label" style={{ background: PRIMARY }}>
                  <span>Day {d.day}</span>
                </div>
                <div className="day-overview-route" style={{ borderLeftColor: PRIMARY }}>
                  <div className="day-overview-city">{d.city}</div>
                  <div className="day-overview-places">
                    {d.places.map((p, pi) => (
                      <span key={pi} className="day-overview-place-chip">{p}</span>
                    ))}
                  </div>
                </div>
                <span className="day-overview-arrow">›</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Day detail — P1 */}
      {!isOverview && currentDay && (
        <PlaceFeed
          day={currentDay}
          activePlaceIdx={activePlaceIdx}
          onPlaceChange={onPlaceChange}
        />
      )}

      {/* Persistent action bar */}
      <div className="itin-sheet-actions">
        <button className="action-btn-ghost">♡ Save Trip</button>
        <button className="action-btn-primary" onClick={onCopy}>+ Add to My Trips</button>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────
function Toast({ show }) {
  if (!show) return null;
  return <div className="copy-toast">✓ Added to My Trips!</div>;
}

// ── Main ──────────────────────────────────────────────
export function NearbyPage() {
  const [activeTag,       setActiveTag]       = useState("All");
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedItin,    setSelectedItin]    = useState(null);
  const [activeDayIdx,    setActiveDayIdx]    = useState(null);
  const [activePlaceIdx,  setActivePlaceIdx]  = useState(0);
  const [showToast,       setShowToast]       = useState(false);
  const mapRef = useRef(null);

  const dayPins = selectedItin
    ? selectedItin.days.map((d) => ({
        day: d.day, city: d.city,
        coords: CITY_COORDS[d.city] ?? { lat: 35, lng: 105 },
      }))
    : null;

  const placePins = selectedItin && activeDayIdx !== null
    ? getPlacePins(selectedItin.days[activeDayIdx])
    : null;

  const filteredClusters = CLUSTERS
    .filter((c) => activeTag === "All" || c.itineraries.some((i) => i.tags.includes(activeTag)))
    .map((c) => ({
      ...c,
      itineraries: activeTag === "All"
        ? c.itineraries
        : c.itineraries.filter((i) => i.tags.includes(activeTag)),
    }));

  function handleClusterClick(cluster) {
    setSelectedCluster(cluster);
    setSelectedItin(null);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: cluster.lat, lng: cluster.lng });
      mapRef.current.setZoom(8);
    }
  }

  function handleSelectItin(itin) {
    setSelectedItin(itin);
    setActiveDayIdx(null);
    setActivePlaceIdx(0);
    const coords = CITY_COORDS[itin.days[0]?.city];
    if (coords && mapRef.current) {
      mapRef.current.panTo(coords);
      mapRef.current.setZoom(9);
    }
  }

  function handleDayChange(idx) {
    setActiveDayIdx(idx);
    setActivePlaceIdx(0);
    if (idx === null) {
      const coords = CITY_COORDS[selectedItin?.days[0]?.city];
      if (coords && mapRef.current) { mapRef.current.panTo(coords); mapRef.current.setZoom(9); }
    } else {
      const city = selectedItin?.days[idx]?.city;
      const coords = city ? CITY_COORDS[city] : null;
      if (coords && mapRef.current) { mapRef.current.panTo(coords); mapRef.current.setZoom(12); }
    }
  }

  function handlePlaceChange(idx) {
    setActivePlaceIdx(idx);
    if (placePins?.[idx] && mapRef.current) {
      mapRef.current.panTo(placePins[idx].coords);
    }
  }

  function handleBack() {
    setSelectedItin(null);
    setActiveDayIdx(null);
    setActivePlaceIdx(0);
    if (mapRef.current && selectedCluster) {
      mapRef.current.panTo({ lat: selectedCluster.lat, lng: selectedCluster.lng });
      mapRef.current.setZoom(8);
    }
  }

  function handleClose() {
    setSelectedCluster(null);
    setSelectedItin(null);
    setActiveDayIdx(null);
    setActivePlaceIdx(0);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: 28, lng: 118 });
      mapRef.current.setZoom(4);
    }
  }

  function handleCopy() {
    handleClose();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }

  return (
    <div className="nearby-light-shell">
      <ItineraryMap
        clusters={filteredClusters}
        selectedCluster={selectedCluster}
        onClusterClick={handleClusterClick}
        dayPins={dayPins}
        activeDayIdx={activeDayIdx}
        placePins={placePins}
        activePlaceIdx={activePlaceIdx}
        mapRef={mapRef}
      />

      {!selectedItin && (
        <div className="nearby-top-bar">
          <Link href="/map" className="nearby-back-btn" aria-label="Back">‹</Link>
          <span className="nearby-page-title">Explore Trips</span>
          <button className="nearby-batch-btn">Search</button>
        </div>
      )}

      {!selectedItin && (
        <div className="itin-tag-bar">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              className={`itin-filter-pill ${activeTag === tag ? "active" : ""}`}
              style={activeTag === tag && TAG_COLORS[tag]
                ? { background: TAG_COLORS[tag], color: "#fff", borderColor: TAG_COLORS[tag] }
                : {}}
              onClick={() => { setActiveTag(tag); setSelectedCluster(null); setSelectedItin(null); }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {!selectedCluster && !selectedItin && (
        <div className="itin-hint">Tap a city to explore trips</div>
      )}

      {selectedCluster && !selectedItin && (
        <CitySheet
          cluster={selectedCluster}
          onSelect={handleSelectItin}
          onClose={handleClose}
        />
      )}

      {selectedItin && (
        <ItinerarySheet
          itin={selectedItin}
          activeDayIdx={activeDayIdx}
          activePlaceIdx={activePlaceIdx}
          onDayChange={handleDayChange}
          onPlaceChange={handlePlaceChange}
          onBack={handleBack}
          onCopy={handleCopy}
        />
      )}

      <Toast show={showToast} />

      <nav className="hp-nav nearby-nav">
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
              <Link key={i} href={item.href}
                className={`hp-nav-item${item.active ? " hp-nav-active" : ""}`}>
                <span className="hp-nav-icon">{item.icon}</span>
                <span className="hp-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
