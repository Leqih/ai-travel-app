"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const Grainient = dynamic(() => import("./Grainient"), { ssr: false });
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";
import Stack from "@/components/ui/Stack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faShareNodes, faBookmark, faEllipsisVertical, faHouse, faCompass, faPlane, faCircleUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkReg } from "@fortawesome/free-regular-svg-icons";

/* ── Unsplash real-location photo mapping (arrays for multi-photo grids) ── */
const PHOTO_MAP = {
  // Tokyo — multiple angles per location
  "Shibuya Crossing":  ["photo-1542051841857-5f90071e7989","photo-1611725243170-cb733fb06761","photo-1617581219723-68d352f989e7","photo-1652613166444-bde3b66f50b7","photo-1652613181453-5ae71d3597f0"],
  "Tokyo Tower":       ["photo-1536098561742-ca998e48cbcc","photo-1752640099713-d08064c1c8d3","photo-1752640099760-da5b81d08962","photo-1748737349766-b708d3681d4a","photo-1748737350015-097b89ef8dc3"],
  "Meiji Shrine":      ["photo-1686933021179-f376a84dfc66","photo-1594485770559-818d3132a5ff","photo-1759674347851-3748b7c13c6d","photo-1758781375697-6ea784bcb458","photo-1764069347328-687152bc2bf7"],
  "Harajuku":          ["photo-1664806462678-5df01513f7b9","photo-1576631016442-35b1141ecea6","photo-1596829057868-f2abea9a3a3d","photo-1595693496818-c9bb231dcabb","photo-1542051841857-5f90071e7989"],
  "Senso-ji Temple":   ["photo-1545569341-9eb8b30979d9","photo-1667314432098-6fd47117aa7f","photo-1718591903879-7956428248b6","photo-1717914054077-4a8d841c6807","photo-1729864909740-08aaf6260705"],
  "Tokyo Skytree":     ["photo-1540959733332-eab4deabeeaf","photo-1583915376118-7bfcda48e26c","photo-1555883006-37d106604feb","photo-1555883006-508a20febdca","photo-1622664809461-9736fea59923"],
  "Akihabara":         ["photo-1677279150226-67d306ecdc80","photo-1683995259187-54142c49338b","photo-1728200696272-1841c28e4b89","photo-1625189662357-0f65d0d7377f","photo-1590796583326-afd3bb20d22d"],
  "Ueno Park":         ["photo-1560257934-c627e08b0b17","photo-1558452919-3a47422e2fd0","photo-1647785991550-a60ed49badf5","photo-1714356455511-0354c196c48f","photo-1722677442518-41ecffdf1958"],
  "Imperial Palace":   ["photo-1715917180615-c3bd76e80732","photo-1698151283411-11700cf36372","photo-1707907219733-0ee2541f1513","photo-1710005631992-ace75cfd5cb9","photo-1721507656797-ba6a23c73fba"],
  "Ginza":             ["photo-1675950549770-c761502421bb","photo-1542051841857-5f90071e7989","photo-1540959733332-eab4deabeeaf","photo-1583915376118-7bfcda48e26c","photo-1677279150226-67d306ecdc80"],
  "Tsukiji Market":    ["photo-1556173302-31961d329ef9","photo-1590796583326-afd3bb20d22d","photo-1625189662357-0f65d0d7377f","photo-1683995259187-54142c49338b","photo-1728200696272-1841c28e4b89"],
  "Odaiba":            ["photo-1664189351764-74c6ceff582f","photo-1540959733332-eab4deabeeaf","photo-1622664809461-9736fea59923","photo-1583915376118-7bfcda48e26c","photo-1555883006-37d106604feb"],
  "teamLab Planets":   ["photo-1771773490670-7376a45c0e96","photo-1664189351764-74c6ceff582f","photo-1540959733332-eab4deabeeaf","photo-1622664809461-9736fea59923","photo-1583915376118-7bfcda48e26c"],
  "Roppongi Hills":    ["photo-1593357596923-c9a407493104","photo-1540959733332-eab4deabeeaf","photo-1677279150226-67d306ecdc80","photo-1675950549770-c761502421bb","photo-1583915376118-7bfcda48e26c"],
  "Shinjuku Gyoen":    ["photo-1722591759493-6745a4b4b541","photo-1560257934-c627e08b0b17","photo-1558452919-3a47422e2fd0","photo-1647785991550-a60ed49badf5","photo-1714356455511-0354c196c48f"],
  "Kabukicho":         ["photo-1639804009307-7d0d880c0c9d","photo-1677279150226-67d306ecdc80","photo-1683995259187-54142c49338b","photo-1590796583326-afd3bb20d22d","photo-1625189662357-0f65d0d7377f"],
  // Seoul extra
  "Hongdae":            ["photo-1583581762203-9b8863ffd7f2"],
  "Gangnam":            ["photo-1601814933824-fd0b574dd592"],
  "Cheonggyecheon":     ["photo-1592499615936-6c97f97b5c14"],
  "Noryangjin Market":  ["photo-1553361371-9b22f78e8b1d"],
  "Jongmyo Shrine":     ["photo-1566888596782-c7f41cc184c5"],
  "Banpo Bridge":       ["photo-1601814933824-fd0b574dd592"],
  // Seoul
  "Gyeongbokgung":     ["photo-1693928105595-b323b02791ff","photo-1733405243624-54e0a57bcebe","photo-1662238787718-f577db967596","photo-1566800890932-e89159daf3dc","photo-1599655293678-d52a800cd63e"],
  "Bukchon Village":   ["photo-1579869641201-45d13ce2ace5","photo-1670735403682-0faa5ec7dd75","photo-1512059555341-6a121e7d4d86","photo-1597052142820-3be3987c0e20","photo-1603545959774-96bef891432b"],
  "Insadong":          ["photo-1754262239779-d9b8d9a0cd0c","photo-1709983075478-4ec7b791329a","photo-1622517806875-92161d3fd09d","photo-1674928080486-892e0705aa2f","photo-1660602812394-dac67552d730"],
  "Myeongdong":        ["photo-1748696147482-413d1e29ed8f","photo-1716968594480-d3ba77a2f776","photo-1555570237-df08e6e9641f","photo-1760020954071-13a2c86076ff","photo-1630264885181-063d05ab2908"],
  "Namsan Tower":      ["photo-1662075223793-8719d868c934","photo-1667726471902-6607dda38df4","photo-1557938187-af371ef22476","photo-1648134332409-0eefb6c96266","photo-1704330735489-650675b03235"],
  "Itaewon":           ["photo-1693446796202-2c5bb126edfc","photo-1716968594480-d3ba77a2f776","photo-1630264885181-063d05ab2908","photo-1547376280-510da3e3f0f4","photo-1660602738577-7277a9354341"],
  "Han River":         ["photo-1652172176566-5d69fc9d9961","photo-1716968594404-ac5ae8cdcdc4","photo-1722501569916-cbec540b8a98","photo-1652348878677-5f1a6c7f429f","photo-1696866509067-f99acf4415e5"],
  "Dongdaemun":        ["photo-1680923003386-966bd539bd2e","photo-1693928105595-b323b02791ff","photo-1662238787718-f577db967596","photo-1716968594480-d3ba77a2f776","photo-1630264885181-063d05ab2908"],
  "Lotte World":       ["photo-1674606067725-b6ab1e340753","photo-1680923003386-966bd539bd2e","photo-1693446796202-2c5bb126edfc","photo-1652172176566-5d69fc9d9961","photo-1662075223793-8719d868c934"],
  // Paris
  "Eiffel Tower":      ["photo-1502602898657-3e91760cbb34","photo-1570097703229-b195d6dd291f","photo-1605194177907-84c213cb3654","photo-1730993175478-b634849f6536","photo-1726669451920-f84bfadec5b9"],
  "Trocadéro":         ["photo-1589390512069-6d5abbccb0f3","photo-1570097703229-b195d6dd291f","photo-1605194177907-84c213cb3654","photo-1630864113112-79f31a494815","photo-1642947392578-b37fbd9a4d45"],
  "Champ de Mars":     ["photo-1431274172761-fca41d930114","photo-1502602898657-3e91760cbb34","photo-1570097703229-b195d6dd291f","photo-1730993175478-b634849f6536","photo-1645573324217-17cd62e55151"],
  "Seine Cruise":      ["photo-1766847733701-0a1209d326c3","photo-1768274883590-ba4b5bc43749","photo-1659107171706-013b06a5d1d0","photo-1692976540874-d5515daaaf5d","photo-1652122966931-35b47f762fa3"],
  "Louvre Museum":     ["photo-1724233616157-db653e09270e","photo-1707952189186-8694f03529f7","photo-1678895595317-b42a309f87f5","photo-1641993685499-4b5a5a55fc71","photo-1675965564591-6a854b98400c"],
  "Tuileries Garden":  ["photo-1567502400956-d7f451b518de","photo-1724233616157-db653e09270e","photo-1707952189186-8694f03529f7","photo-1641993685499-4b5a5a55fc71","photo-1620751622191-7379027a9ee1"],
  "Palais Royal":      ["photo-1588436924569-bee63eb28926","photo-1567502400956-d7f451b518de","photo-1724233616157-db653e09270e","photo-1641993685499-4b5a5a55fc71","photo-1620751622191-7379027a9ee1"],
  "Notre-Dame":        ["photo-1556773523-d9f29b2127af","photo-1564084087986-9270f6f3639d","photo-1656357175323-151769785f25","photo-1661999147616-7338a82a86e5","photo-1556773527-a6cef58e6622"],
  "Sainte-Chapelle":   ["photo-1654986589374-46fc6e485013","photo-1556773523-d9f29b2127af","photo-1564084087986-9270f6f3639d","photo-1548702969-e1da6c81ac97","photo-1556773523-27b282c4f207"],
  "Marais District":   ["photo-1693320787680-eaf73a32a767","photo-1567502400956-d7f451b518de","photo-1588436924569-bee63eb28926","photo-1620751622191-7379027a9ee1","photo-1641993685499-4b5a5a55fc71"],
  "Musée d'Orsay":     ["photo-1658520195665-eb858ba44a50","photo-1717422935480-6a66474b88a9","photo-1658520205201-fee923fc1bed","photo-1666468687723-eaa328a27e72","photo-1620517897885-c09f2cfbf696"],
  "Saint-Germain":     ["photo-1567502400956-d7f451b518de","photo-1693320787680-eaf73a32a767","photo-1588436924569-bee63eb28926","photo-1620751622191-7379027a9ee1","photo-1641993685499-4b5a5a55fc71"],
  "Montparnasse":      ["photo-1589390512069-6d5abbccb0f3","photo-1502602898657-3e91760cbb34","photo-1570097703229-b195d6dd291f","photo-1605194177907-84c213cb3654","photo-1630864113112-79f31a494815"],
  "Sacré-Cœur":        ["photo-1632607079950-ccc8ab125aba","photo-1707686850945-0501978d980a","photo-1561370665-7e266065fce1","photo-1686860703285-fe9ba6ae38eb","photo-1505923807036-20eef271b308"],
  "Montmartre":        ["photo-1693320787680-eaf73a32a767","photo-1632607079950-ccc8ab125aba","photo-1707686850945-0501978d980a","photo-1561370665-7e266065fce1","photo-1636619299986-9463f8c4d8fd"],
  "Pigalle":           ["photo-1639804009307-7d0d880c0c9d","photo-1632607079950-ccc8ab125aba","photo-1561370665-7e266065fce1","photo-1618569388132-ee496f5f4467","photo-1512852964607-8cca57a833e1"],
  "Versailles":        ["photo-1722718136570-b0ad04a9ad12","photo-1718467524363-acb278f1c374","photo-1699076702839-8133c8bf8fd1","photo-1691171345977-dd9e440f7f99","photo-1615107306244-be271e8b1407"],
  "Palace Gardens":    ["photo-1722718136570-b0ad04a9ad12","photo-1628679819483-a6c0a0d49f57","photo-1684174703681-2baf637f1e41","photo-1697867014192-0c05412a9123","photo-1695836065042-c3938a4917ba"],
  "Arc de Triomphe":   ["photo-1676474819174-70a07f33e0aa","photo-1715591262630-7b7be84da803","photo-1630619555511-ba478941633b","photo-1718893372744-0bf9cb8203e3","photo-1699021867449-c9e0b43297fc"],
  "Champs-Élysées":    ["photo-1628886672798-81086c4c3cc9","photo-1676474819174-70a07f33e0aa","photo-1715591262630-7b7be84da803","photo-1618233366729-733c3b0d54af","photo-1575793446034-b1b09252487b"],
  "Le Marais":         ["photo-1693320787680-eaf73a32a767","photo-1567502400956-d7f451b518de","photo-1588436924569-bee63eb28926","photo-1620751622191-7379027a9ee1","photo-1641993685499-4b5a5a55fc71"],
  // Bali
  "Tegallalang Terrace": ["photo-1554689021-c9e70753d301","photo-1559628233-eb1b1a45564b","photo-1698264855824-95385e9d552a","photo-1679109292727-50a7bdc05dd1","photo-1633820313053-fa030b13ef94"],
  "Ubud Market":         ["photo-1554689021-c9e70753d301","photo-1559628233-eb1b1a45564b","photo-1594041764323-023f0a9f367d","photo-1585302770766-fac4cf8a6edf","photo-1559628233-100c798642d4"],
  "Puri Saren Palace":   ["photo-1664922114307-ad625860832b","photo-1554689021-c9e70753d301","photo-1559628233-eb1b1a45564b","photo-1542210940661-5f91cb7afe02","photo-1680100595862-9c8803a9e7da"],
  "Tirta Empul":         ["photo-1661963385126-11fa577925d3","photo-1672399450046-2c1308d31b96","photo-1658069570842-b05b738a7440","photo-1677829178071-1d8375486dd8","photo-1616428090830-59bd09d9f272"],
  "Gunung Kawi":         ["photo-1554689021-c9e70753d301","photo-1559628233-eb1b1a45564b","photo-1698264855824-95385e9d552a","photo-1633820313053-fa030b13ef94","photo-1680100595862-9c8803a9e7da"],
  "Sacred Monkey Forest":["photo-1652451160926-6d0f2bb16cfe","photo-1652451160831-7311e014cd63","photo-1652451160984-f3d710e92cb3","photo-1714481211250-02862c2c145d","photo-1590084475782-582f4841a08c"],
  "Tanah Lot":           ["photo-1724568834710-d5db3faab7e8","photo-1653021864722-e37056b6b8c4","photo-1664551577638-9a212d646b9b","photo-1722235569644-13efbd187f52","photo-1664551577949-a1b2fb28676c"],
  "Canggu Beach":        ["photo-1670241678108-be2862160d77","photo-1670241677704-a28f7ecf1c7b","photo-1632807174185-69054f39333d","photo-1564221549673-b43c122d1c29","photo-1567491764093-be7719ad441d"],
  "Sunset at Kuta":      ["photo-1670241678108-be2862160d77","photo-1578726707335-a01c2679b263","photo-1578724859357-7cbb8670ccdc","photo-1624104979163-4837da69adda","photo-1598145136670-e4ada43de5b3"],
  "Mount Batur":         ["photo-1678303396234-4180231353df","photo-1691502692544-24a588f8069c","photo-1712078953326-346a472bddb0","photo-1672910524951-37939f8be937","photo-1672910512203-a5e5a325a9cc"],
  "Hot Springs":         ["photo-1627430635950-39227803c696","photo-1691505496303-4554525e70f0","photo-1672910524951-37939f8be937","photo-1558004982-13e7bb35f72d","photo-1677829178071-1d8375486dd8"],
  "Uluwatu Temple":      ["photo-1678303396234-4180231353df","photo-1676878912863-2849fe9fb18c","photo-1672704387994-e747710f4a83","photo-1604842937136-1648761a6256","photo-1601468846763-3d29335ccaa8"],
  "Kecak Dance":         ["photo-1664922114307-ad625860832b","photo-1676878912863-2849fe9fb18c","photo-1604842937136-1648761a6256","photo-1582551145495-ae6ba5c11013","photo-1572391358835-ee80418d4702"],
  "Seminyak":            ["photo-1627430635950-39227803c696","photo-1670241678108-be2862160d77","photo-1564221549673-b43c122d1c29","photo-1598145136670-e4ada43de5b3","photo-1546484475-7f7bd55792da"],
  "Spa Day":             ["photo-1627430635950-39227803c696","photo-1554689021-c9e70753d301","photo-1559628233-eb1b1a45564b","photo-1585302770766-fac4cf8a6edf","photo-1680100595862-9c8803a9e7da"],
  // Bangkok
  "Grand Palace":        ["photo-1678915554115-a5e2de853191","photo-1594828747434-a2ea308ec851","photo-1678915545553-4f06f36791de","photo-1564312683505-a6b3168439b7","photo-1679342969725-0763beed86eb"],
  "Wat Pho":             ["photo-1603247041523-de001bbc440c","photo-1650021858406-3222764ea1f9","photo-1642391326089-74eb84db9f12","photo-1578167635886-55908a3651e0","photo-1716822657758-1ff0e713b798"],
  "Arun Temple":         ["photo-1631609030728-9b0b525b60cf","photo-1568321385520-b9252021b491","photo-1676268792676-c119e38af132","photo-1613672803979-a6edfc5a179b","photo-1574236667795-e084598e99ef"],
  "Khao San Road":       ["photo-1691576259634-28d34508cb60","photo-1752155913692-a5e5f7878cae","photo-1573682624162-19220b990d68","photo-1676815967805-52e7bd7bc71e","photo-1612028985988-d7e9c383d5b5"],
  "Chatuchak Market":    ["photo-1696437492959-b9a8c37df4ad","photo-1668589345920-26ebf7facbfc","photo-1668589425978-81089ef9de64","photo-1696437789116-2ab7d01e658c","photo-1677943356495-e2312485e274"],
  "Jim Thompson House":  ["photo-1703508202823-9b3648ca4f18","photo-1678915554115-a5e2de853191","photo-1594828747434-a2ea308ec851","photo-1564312683505-a6b3168439b7","photo-1685628380325-de144b916a17"],
  "Lumphini Park":       ["photo-1652172176566-5d69fc9d9961","photo-1678915554115-a5e2de853191","photo-1594828747434-a2ea308ec851","photo-1642980521633-2cd2fb3f2446","photo-1583493847010-cd542d1a815f"],
  "Floating Market":     ["photo-1707924678545-b35b08aec575","photo-1705599210857-666ec77b6a9d","photo-1736492090594-88f85f405da0","photo-1741212342195-e71830e7e3d7","photo-1720655258819-db7f54b7bb28"],
  "Ayutthaya":           ["photo-1626197798581-d35c41d9fa27","photo-1631609030728-9b0b525b60cf","photo-1568321385520-b9252021b491","photo-1613672803979-a6edfc5a179b","photo-1574236667795-e084598e99ef"],
  "Sky Bar":             ["photo-1691576259634-28d34508cb60","photo-1752155913692-a5e5f7878cae","photo-1676815967805-52e7bd7bc71e","photo-1573682624162-19220b990d68","photo-1583997052101-7022fe4a490f"],
  "Silom Night Market":  ["photo-1691576259634-28d34508cb60","photo-1573682624162-19220b990d68","photo-1676815967805-52e7bd7bc71e","photo-1696437492959-b9a8c37df4ad","photo-1668589345920-26ebf7facbfc"],
  // Osaka
  "Dotonbori":           ["photo-1565559204102-f59129a70ae2","photo-1748190396858-e2f247e082bf","photo-1559866105-63d346cc87f3","photo-1542210940661-5f91cb7afe02","photo-1592662133500-79775ce8c90c"],
  "Kuromon Market":      ["photo-1565559204102-f59129a70ae2","photo-1748190396858-e2f247e082bf","photo-1601328304944-63e3c9d58a3b","photo-1584505489914-89bfece45d2c","photo-1584505491095-3713cf0cb9d0"],
  "Hozenji Yokocho":     ["photo-1565559204102-f59129a70ae2","photo-1748190396858-e2f247e082bf","photo-1559866105-63d346cc87f3","photo-1542210940661-5f91cb7afe02","photo-1542210877086-b56bdbf0b831"],
  "Namba Night":         ["photo-1639804009307-7d0d880c0c9d","photo-1565559204102-f59129a70ae2","photo-1748190396858-e2f247e082bf","photo-1559866105-63d346cc87f3","photo-1592662133500-79775ce8c90c"],
  "Osaka Castle":        ["photo-1704003671937-a1522f430439","photo-1725011369349-3b6c4847924f","photo-1704003671790-ab28034a1b24","photo-1704003672116-e074d4362c0b","photo-1693328622597-9b6396fa55a8"],
  "Shinsekai":           ["photo-1733342484519-556235e2fee7","photo-1762781832542-b96bac9c46c2","photo-1764070959112-584ed35d6799","photo-1771517353941-c25e647f87e7","photo-1769784497279-8608f9a03ae3"],
  "Tsutenkaku":          ["photo-1733342484519-556235e2fee7","photo-1764070959112-584ed35d6799","photo-1764070959155-672f7ec072d9","photo-1759976123400-31710ba1a7d1","photo-1760936923246-d1540bb609e7"],
  "Universal Studios":   ["photo-1598734365487-1573d1b53381","photo-1704003671937-a1522f430439","photo-1725011369349-3b6c4847924f","photo-1693328622597-9b6396fa55a8","photo-1565559204102-f59129a70ae2"],
  "Tempozan":            ["photo-1565559204102-f59129a70ae2","photo-1704003671937-a1522f430439","photo-1725011369349-3b6c4847924f","photo-1704003671790-ab28034a1b24","photo-1693328622597-9b6396fa55a8"],
  // Cities (discover page)
  "Tokyo":     ["photo-1540959733332-eab4deabeeaf"],
  "Seoul":     ["photo-1693446796202-2c5bb126edfc"],
  "Paris":     ["photo-1502602898657-3e91760cbb34"],
  "Bali":      ["photo-1554689021-c9e70753d301"],
  "Bangkok":   ["photo-1703508202823-9b3648ca4f18"],
  "Osaka":     ["photo-1565559204102-f59129a70ae2"],
  "New York":  ["photo-1655845836463-facb2826510b"],
  "London":    ["photo-1662154989572-716c415ea9d7"],
  "Singapore": ["photo-1525625293386-3f8f99389edd"],
  "Istanbul":  ["photo-1524231757912-21f4fe3a7200"],
  "Rome":      ["photo-1552832230-c0197dd311b5"],
  "Barcelona": ["photo-1539037116277-4db20889f2d4"],
  "Kyoto":     ["photo-1493976040374-85c8e12f0c0e"],
  "Amsterdam": ["photo-1534351590666-13e3e96b5017"],
  "Dubai":     ["photo-1512453979798-5ea266f8880c"],
  "Sydney":    ["photo-1506973035872-a4ec16b8e8d9"],
  "Lisbon":    ["photo-1555881400-74d7acaacd8b"],
  "Taipei":    ["photo-1470004914212-05527e49370b"],
};
/**
 * Get a real Unsplash image URL.
 * @param {string} name  - Location name (key in PHOTO_MAP)
 * @param {number} w     - Width
 * @param {number} h     - Height
 * @param {number} idx   - Photo index (0 = primary, 1-4 = alternates)
 */
function uimg(name, w = 400, h = 300, idx = 0) {
  const arr = PHOTO_MAP[name];
  if (!arr) return `https://picsum.photos/seed/${name.toLowerCase().replace(/\s+/g, "-")}/${w}/${h}`;
  const id = arr[idx % arr.length];
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;
}

const NAV_ITEMS = [
  { icon: faHouse,      label: "Home",      href: "/"        },
  { icon: faCompass,    label: "Discover",  href: "/nearby"  },
  { center: true },
  { icon: faPlane,      label: "My Trips",  href: "/trips"   },
  { icon: faCircleUser, label: "Profile",   href: "/profile" },
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
  /* ── Tokyo Plan 1: City Landmarks ── */
  {
    id: 1, city: "Tokyo, Japan", place: "Shibuya Crossing",
    cardTitle: "Tokyo in 72 Hours ⚡",
    desc: "Iconic landmarks · City highlights",
    tag: "culture", duration: "3 Days", likes: 2341, saves: 892,
    img: uimg("Shibuya Crossing", 160, 160),
    lat: 35.6595, lng: 139.7005,
    images: [
      uimg("Shibuya Crossing", 800, 600),
      uimg("Tokyo Tower", 800, 600),
      uimg("Tokyo Skytree", 800, 600),
    ],
    days: 3,
    itinerary: {
      1: {
        stops: 4, distance: "8.3 km",
        activities: [
          { name: "Shibuya Crossing", category: "Tokyo · Attraction", desc: "Tokyo's busiest crossing — join 3,000 pedestrians at once. Best at rush hour.", time: "9:00 AM", img: uimg("Shibuya Crossing", 152, 152), transport: "🚶 Walk · 1.2 km · 15 min", next: "Tokyo Tower", lat: 35.6595, lng: 139.7005 },
          { name: "Tokyo Tower", category: "Tokyo · Landmark", desc: "Iconic 333m red-and-white tower. Observation deck open till 11 PM.", time: "12:00 PM", img: uimg("Tokyo Tower", 152, 152), transport: "🚇 Subway · 3.4 km · 12 min", next: "Meiji Shrine", lat: 35.6586, lng: 139.7454 },
          { name: "Meiji Shrine", category: "Tokyo · Shrine", desc: "Serene Shinto shrine in the heart of the city. Wear modest clothing.", time: "3:00 PM", img: uimg("Meiji Shrine", 152, 152), transport: "🚶 Walk · 0.8 km · 10 min", next: "Harajuku", lat: 35.6762, lng: 139.6993 },
          { name: "Harajuku", category: "Tokyo · Shopping", desc: "Youth fashion & Takeshita Street snacks. Perfect for people-watching.", time: "6:00 PM", img: uimg("Harajuku", 152, 152), transport: null, next: null, lat: 35.6702, lng: 139.7028 },
        ],
      },
      2: {
        stops: 3, distance: "9.5 km",
        activities: [
          { name: "Tokyo Skytree", category: "Tokyo · Landmark", desc: "World's tallest tower at 634m. Panoramic views of the entire city.", time: "9:00 AM", img: uimg("Tokyo Skytree", 152, 152), transport: "🚇 Subway · 3.8 km · 12 min", next: "Imperial Palace", lat: 35.7101, lng: 139.8107 },
          { name: "Imperial Palace", category: "Tokyo · Historic", desc: "Residence of Japan's Emperor. The east gardens are open to the public.", time: "1:00 PM", img: uimg("Imperial Palace", 152, 152), transport: "🚶 Walk · 2.8 km · 35 min", next: "Ginza", lat: 35.6852, lng: 139.7528 },
          { name: "Ginza", category: "Tokyo · Shopping", desc: "Upscale shopping district with flagship luxury boutiques and art galleries.", time: "4:00 PM", img: uimg("Ginza", 152, 152), transport: null, next: null, lat: 35.6710, lng: 139.7649 },
        ],
      },
      3: {
        stops: 3, distance: "7.0 km",
        activities: [
          { name: "Odaiba", category: "Tokyo · Entertainment", desc: "Futuristic island with shopping malls, arcades, and a Gundam statue.", time: "10:00 AM", img: uimg("Odaiba", 152, 152), transport: "🚇 Subway · 4.5 km · 18 min", next: "Roppongi Hills", lat: 35.6257, lng: 139.7750 },
          { name: "Roppongi Hills", category: "Tokyo · Nightlife", desc: "Rooftop bars, Mori Art Museum, and Tokyo's best nighttime skyline.", time: "3:00 PM", img: uimg("Roppongi Hills", 152, 152), transport: "🚇 Subway · 2.5 km · 10 min", next: "Kabukicho", lat: 35.6604, lng: 139.7292 },
          { name: "Kabukicho", category: "Tokyo · Nightlife", desc: "Tokyo's most famous entertainment district — neon lights and izakayas.", time: "7:00 PM", img: uimg("Kabukicho", 152, 152), transport: null, next: null, lat: 35.6938, lng: 139.7034 },
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
  /* ── Tokyo Plan 2: Food & Markets ── */
  {
    id: 101, city: "Tokyo, Japan", place: "Tsukiji Market",
    cardTitle: "Eat Like a Local 🍜",
    desc: "Sushi · Ramen · Street food paradise",
    tag: "food", duration: "3 Days", likes: 1876, saves: 634,
    img: uimg("Tsukiji Market", 160, 160),
    lat: 35.6655, lng: 139.7707,
    images: [
      uimg("Tsukiji Market", 800, 600),
      uimg("Ginza", 800, 600),
      uimg("Kabukicho", 800, 600),
    ],
    days: 3,
    itinerary: {
      1: {
        stops: 3, distance: "5.5 km",
        activities: [
          { name: "Tsukiji Market", category: "Tokyo · Food", desc: "World-famous fish market. Try fresh sushi and tamagoyaki at sunrise.", time: "6:00 AM", img: uimg("Tsukiji Market", 152, 152), transport: "🚇 Subway · 3.7 km · 10 min", next: "Ginza", lat: 35.6655, lng: 139.7707 },
          { name: "Ginza", category: "Tokyo · Food", desc: "Michelin-starred sushi counters and elegant tempura restaurants.", time: "12:00 PM", img: uimg("Ginza", 152, 152), transport: "🚶 Walk · 1.8 km · 22 min", next: "Kabukicho", lat: 35.6710, lng: 139.7649 },
          { name: "Kabukicho", category: "Tokyo · Nightlife", desc: "Late-night ramen alleys and izakayas — the real Tokyo food scene.", time: "7:00 PM", img: uimg("Kabukicho", 152, 152), transport: null, next: null, lat: 35.6938, lng: 139.7034 },
        ],
      },
      2: {
        stops: 3, distance: "6.2 km",
        activities: [
          { name: "Harajuku", category: "Tokyo · Food", desc: "Crepes, cotton candy, and Takeshita Street snack crawl.", time: "10:00 AM", img: uimg("Harajuku", 152, 152), transport: "🚇 Subway · 3.0 km · 10 min", next: "Shibuya Crossing", lat: 35.6702, lng: 139.7028 },
          { name: "Shibuya Crossing", category: "Tokyo · Food", desc: "Hidden ramen shops and depachika basement food halls.", time: "1:00 PM", img: uimg("Shibuya Crossing", 152, 152), transport: "🚇 Subway · 3.2 km · 12 min", next: "Roppongi Hills", lat: 35.6595, lng: 139.7005 },
          { name: "Roppongi Hills", category: "Tokyo · Food", desc: "Rooftop dining with city views — Japanese-Italian fusion.", time: "6:00 PM", img: uimg("Roppongi Hills", 152, 152), transport: null, next: null, lat: 35.6604, lng: 139.7292 },
        ],
      },
      3: {
        stops: 2, distance: "4.0 km",
        activities: [
          { name: "Ueno Park", category: "Tokyo · Food", desc: "Ameyoko market — dried snacks, fresh fruit, and street yakitori.", time: "10:00 AM", img: uimg("Ueno Park", 152, 152), transport: "🚇 Subway · 4.0 km · 14 min", next: "Akihabara", lat: 35.7155, lng: 139.7730 },
          { name: "Akihabara", category: "Tokyo · Food", desc: "Themed cafés and hidden tonkatsu joints in the electric town.", time: "2:00 PM", img: uimg("Akihabara", 152, 152), transport: null, next: null, lat: 35.7023, lng: 139.7745 },
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
  /* ── Tokyo Plan 3: Temples & Traditions ── */
  {
    id: 102, city: "Tokyo, Japan", place: "Senso-ji Temple",
    cardTitle: "Soul of Old Tokyo 🏯",
    desc: "Ancient temples · Spiritual heritage",
    tag: "culture", duration: "4 Days", likes: 3102, saves: 1245,
    img: uimg("Senso-ji Temple", 160, 160),
    lat: 35.7148, lng: 139.7967,
    images: [
      uimg("Senso-ji Temple", 800, 600),
      uimg("Meiji Shrine", 800, 600),
      uimg("Imperial Palace", 800, 600),
    ],
    days: 4,
    itinerary: {
      1: {
        stops: 3, distance: "6.0 km",
        activities: [
          { name: "Senso-ji Temple", category: "Tokyo · Temple", desc: "Tokyo's oldest temple dating to 645 AD. Arrive early to avoid crowds.", time: "7:00 AM", img: uimg("Senso-ji Temple", 152, 152), transport: "🚇 Subway · 4.1 km · 14 min", next: "Meiji Shrine", lat: 35.7148, lng: 139.7967 },
          { name: "Meiji Shrine", category: "Tokyo · Shrine", desc: "Serene Shinto shrine dedicated to Emperor Meiji, set in a vast forest.", time: "11:00 AM", img: uimg("Meiji Shrine", 152, 152), transport: "🚇 Subway · 2.0 km · 8 min", next: "Imperial Palace", lat: 35.6762, lng: 139.6993 },
          { name: "Imperial Palace", category: "Tokyo · Historic", desc: "Residence of Japan's Emperor. The east gardens are open to the public.", time: "3:00 PM", img: uimg("Imperial Palace", 152, 152), transport: null, next: null, lat: 35.6852, lng: 139.7528 },
        ],
      },
      2: {
        stops: 2, distance: "5.0 km",
        activities: [
          { name: "Tokyo Skytree", category: "Tokyo · Landmark", desc: "634m tower with a temple view deck and traditional Solamachi village below.", time: "9:00 AM", img: uimg("Tokyo Skytree", 152, 152), transport: "🚶 Walk · 5.0 km · 60 min", next: "Ueno Park", lat: 35.7101, lng: 139.8107 },
          { name: "Ueno Park", category: "Tokyo · Culture", desc: "Visit Toshogu Shrine and the National Museum for ancient Japanese art.", time: "2:00 PM", img: uimg("Ueno Park", 152, 152), transport: null, next: null, lat: 35.7155, lng: 139.7730 },
        ],
      },
      3: {
        stops: 2, distance: "4.5 km",
        activities: [
          { name: "Harajuku", category: "Tokyo · Culture", desc: "Visit Togo Shrine and experience the contrast of traditional and modern.", time: "10:00 AM", img: uimg("Harajuku", 152, 152), transport: "🚇 Subway · 4.5 km · 15 min", next: "Shinjuku Gyoen", lat: 35.6702, lng: 139.7028 },
          { name: "Shinjuku Gyoen", category: "Tokyo · Nature", desc: "Japanese garden with tea ceremony pavilion — meditative tranquility.", time: "2:00 PM", img: uimg("Shinjuku Gyoen", 152, 152), transport: null, next: null, lat: 35.6852, lng: 139.7100 },
        ],
      },
      4: {
        stops: 2, distance: "3.5 km",
        activities: [
          { name: "Akihabara", category: "Tokyo · Culture", desc: "Explore maid cafés and anime culture — Japan's modern pop heritage.", time: "11:00 AM", img: uimg("Akihabara", 152, 152), transport: "🚶 Walk · 3.5 km · 42 min", next: "Ginza", lat: 35.7023, lng: 139.7745 },
          { name: "Ginza", category: "Tokyo · Culture", desc: "Kabuki-za Theatre for a traditional kabuki performance.", time: "4:00 PM", img: uimg("Ginza", 152, 152), transport: null, next: null, lat: 35.6710, lng: 139.7649 },
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
  /* ── Tokyo Plan 4: Nature & Parks ── */
  {
    id: 103, city: "Tokyo, Japan", place: "Shinjuku Gyoen",
    cardTitle: "Tokyo's Secret Gardens 🌸",
    desc: "Gardens · Cherry blossoms · Green oasis",
    tag: "nature", duration: "2 Days", likes: 1543, saves: 487,
    img: uimg("Shinjuku Gyoen", 160, 160),
    lat: 35.6852, lng: 139.7100,
    images: [
      uimg("Shinjuku Gyoen", 800, 600),
      uimg("Ueno Park", 800, 600),
      uimg("Meiji Shrine", 800, 600),
    ],
    days: 2,
    itinerary: {
      1: {
        stops: 3, distance: "7.0 km",
        activities: [
          { name: "Shinjuku Gyoen", category: "Tokyo · Nature", desc: "Stunning national garden blending French, English, and Japanese styles.", time: "9:00 AM", img: uimg("Shinjuku Gyoen", 152, 152), transport: "🚇 Subway · 4.0 km · 12 min", next: "Meiji Shrine", lat: 35.6852, lng: 139.7100 },
          { name: "Meiji Shrine", category: "Tokyo · Nature", desc: "Walk through the 170-acre evergreen forest surrounding the shrine.", time: "1:00 PM", img: uimg("Meiji Shrine", 152, 152), transport: "🚇 Subway · 3.0 km · 10 min", next: "Ueno Park", lat: 35.6762, lng: 139.6993 },
          { name: "Ueno Park", category: "Tokyo · Nature", desc: "1,200+ cherry trees, Shinobazu Pond, and wide lawns for picnics.", time: "4:00 PM", img: uimg("Ueno Park", 152, 152), transport: null, next: null, lat: 35.7155, lng: 139.7730 },
        ],
      },
      2: {
        stops: 2, distance: "5.5 km",
        activities: [
          { name: "Imperial Palace", category: "Tokyo · Nature", desc: "East Gardens with moats, stone walls, and seasonal blooms.", time: "9:00 AM", img: uimg("Imperial Palace", 152, 152), transport: "🚇 Subway · 5.5 km · 18 min", next: "Odaiba", lat: 35.6852, lng: 139.7528 },
          { name: "Odaiba", category: "Tokyo · Nature", desc: "Seaside park with Rainbow Bridge views and a man-made beach.", time: "2:00 PM", img: uimg("Odaiba", 152, 152), transport: null, next: null, lat: 35.6257, lng: 139.7750 },
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
  /* ── Tokyo Plan 5: Pop Culture & Shopping ── */
  {
    id: 104, city: "Tokyo, Japan", place: "Akihabara",
    cardTitle: "Otaku Paradise 🎮",
    desc: "Anime · Gaming · Harajuku fashion",
    tag: "shopping", duration: "3 Days", likes: 2089, saves: 756,
    img: uimg("Akihabara", 160, 160),
    lat: 35.7023, lng: 139.7745,
    images: [
      uimg("Akihabara", 800, 600),
      uimg("Harajuku", 800, 600),
      uimg("Ginza", 800, 600),
    ],
    days: 3,
    itinerary: {
      1: {
        stops: 3, distance: "6.0 km",
        activities: [
          { name: "Akihabara", category: "Tokyo · Electronics", desc: "The electric town — anime, manga, gadgets, and retro arcades.", time: "10:00 AM", img: uimg("Akihabara", 152, 152), transport: "🚇 Subway · 3.0 km · 10 min", next: "Harajuku", lat: 35.7023, lng: 139.7745 },
          { name: "Harajuku", category: "Tokyo · Shopping", desc: "Youth fashion & Takeshita Street — cosplay, vintage, and streetwear.", time: "2:00 PM", img: uimg("Harajuku", 152, 152), transport: "🚶 Walk · 3.0 km · 35 min", next: "Shibuya Crossing", lat: 35.6702, lng: 139.7028 },
          { name: "Shibuya Crossing", category: "Tokyo · Shopping", desc: "Shibuya 109, Mega Don Quijote, and flagship sneaker stores.", time: "6:00 PM", img: uimg("Shibuya Crossing", 152, 152), transport: null, next: null, lat: 35.6595, lng: 139.7005 },
        ],
      },
      2: {
        stops: 3, distance: "5.8 km",
        activities: [
          { name: "Ginza", category: "Tokyo · Shopping", desc: "Luxury flagships, Uniqlo's 12-floor store, and Itoya stationery paradise.", time: "10:00 AM", img: uimg("Ginza", 152, 152), transport: "🚇 Subway · 2.8 km · 10 min", next: "teamLab Planets", lat: 35.6710, lng: 139.7649 },
          { name: "teamLab Planets", category: "Tokyo · Art", desc: "Immersive digital art museum — prepare to get your feet wet.", time: "2:00 PM", img: uimg("teamLab Planets", 152, 152), transport: "🚇 Subway · 3.0 km · 12 min", next: "Odaiba", lat: 35.6450, lng: 139.7850 },
          { name: "Odaiba", category: "Tokyo · Entertainment", desc: "DiverCity Tokyo, Gundam statue, and VR entertainment zones.", time: "5:00 PM", img: uimg("Odaiba", 152, 152), transport: null, next: null, lat: 35.6257, lng: 139.7750 },
        ],
      },
      3: {
        stops: 2, distance: "4.5 km",
        activities: [
          { name: "Tokyo Skytree", category: "Tokyo · Shopping", desc: "Solamachi mall — 300+ shops and the Pokémon Center Skytree Town.", time: "10:00 AM", img: uimg("Tokyo Skytree", 152, 152), transport: "🚇 Subway · 4.5 km · 15 min", next: "Roppongi Hills", lat: 35.7101, lng: 139.8107 },
          { name: "Roppongi Hills", category: "Tokyo · Art", desc: "Mori Art Museum and design shops — where art meets commerce.", time: "3:00 PM", img: uimg("Roppongi Hills", 152, 152), transport: null, next: null, lat: 35.6604, lng: 139.7292 },
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
  /* ── Tokyo Plan 6: Art & Nightlife ── */
  {
    id: 105, city: "Tokyo, Japan", place: "teamLab Planets",
    cardTitle: "Neon After Dark 🌃",
    desc: "Digital art · Rooftop bars · Neon nights",
    tag: "art", duration: "2 Days", likes: 2765, saves: 923,
    img: uimg("teamLab Planets", 160, 160),
    lat: 35.6450, lng: 139.7850,
    images: [
      uimg("teamLab Planets", 800, 600),
      uimg("Roppongi Hills", 800, 600),
      uimg("Kabukicho", 800, 600),
    ],
    days: 2,
    itinerary: {
      1: {
        stops: 3, distance: "7.5 km",
        activities: [
          { name: "teamLab Planets", category: "Tokyo · Art", desc: "Immersive digital art museum — walk through water and light installations.", time: "10:00 AM", img: uimg("teamLab Planets", 152, 152), transport: "🚇 Subway · 4.5 km · 16 min", next: "Roppongi Hills", lat: 35.6450, lng: 139.7850 },
          { name: "Roppongi Hills", category: "Tokyo · Art", desc: "Mori Art Museum, rooftop Sky Deck, and Tokyo City View observation.", time: "2:00 PM", img: uimg("Roppongi Hills", 152, 152), transport: "🚇 Subway · 3.0 km · 10 min", next: "Kabukicho", lat: 35.6604, lng: 139.7292 },
          { name: "Kabukicho", category: "Tokyo · Nightlife", desc: "Golden Gai's tiny bars, Robot Restaurant, and neon-lit streets.", time: "8:00 PM", img: uimg("Kabukicho", 152, 152), transport: null, next: null, lat: 35.6938, lng: 139.7034 },
        ],
      },
      2: {
        stops: 3, distance: "6.0 km",
        activities: [
          { name: "Ueno Park", category: "Tokyo · Art", desc: "National Museum, Western Art Museum, and outdoor sculpture garden.", time: "10:00 AM", img: uimg("Ueno Park", 152, 152), transport: "🚇 Subway · 3.0 km · 10 min", next: "Akihabara", lat: 35.7155, lng: 139.7730 },
          { name: "Akihabara", category: "Tokyo · Art", desc: "Manga art galleries, anime exhibition halls, and pixel art arcades.", time: "2:00 PM", img: uimg("Akihabara", 152, 152), transport: "🚇 Subway · 3.0 km · 12 min", next: "Odaiba", lat: 35.7023, lng: 139.7745 },
          { name: "Odaiba", category: "Tokyo · Entertainment", desc: "Palette Town, teamLab Borderless, and nighttime Rainbow Bridge views.", time: "6:00 PM", img: uimg("Odaiba", 152, 152), transport: null, next: null, lat: 35.6257, lng: 139.7750 },
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
    tag: "culture", duration: "3 Days", likes: 1932, saves: 671,
    img: uimg("Gyeongbokgung", 160, 160),
    lat: 37.58, lng: 126.97,
    images: [
      uimg("Gyeongbokgung", 800, 600),
      uimg("Namsan Tower", 800, 600),
      uimg("Myeongdong", 800, 600),
    ],
    days: 3,
    itinerary: {
      1: {
        stops: 4, distance: "7.2 km",
        activities: [
          { name: "Gyeongbokgung", category: "Seoul · Palace", desc: "Main royal palace of the Joseon dynasty — watch the royal guard ceremony.", time: "9:00 AM", img: uimg("Gyeongbokgung", 152, 152), transport: "🚶 Walk · 1.8 km · 22 min", next: "Bukchon Village", lat: 37.5796, lng: 126.9770 },
          { name: "Bukchon Village", category: "Seoul · Historic", desc: "Traditional hanok village with narrow alleyways and old Korean houses.", time: "12:00 PM", img: uimg("Bukchon Village", 152, 152), transport: "🚇 Subway · 2.9 km · 10 min", next: "Insadong", lat: 37.5815, lng: 126.9850 },
          { name: "Insadong", category: "Seoul · Culture", desc: "Antique shops, teahouses, and traditional craft galleries.", time: "3:00 PM", img: uimg("Insadong", 152, 152), transport: "🚇 Subway · 2.5 km · 8 min", next: "Myeongdong", lat: 37.5740, lng: 126.9850 },
          { name: "Myeongdong", category: "Seoul · Shopping", desc: "Korea's top shopping street — K-beauty, street food, and fashion.", time: "6:00 PM", img: uimg("Myeongdong", 152, 152), transport: null, next: null, lat: 37.5636, lng: 126.9850 },
        ],
      },
      2: {
        stops: 3, distance: "8.5 km",
        activities: [
          { name: "Namsan Tower", category: "Seoul · Landmark", desc: "360° views of Seoul. Add a love lock to the fence for a classic memory.", time: "10:00 AM", img: uimg("Namsan Tower", 152, 152), transport: "🚇 Subway · 3.5 km · 12 min", next: "Itaewon", lat: 37.5512, lng: 126.9882 },
          { name: "Itaewon", category: "Seoul · Food", desc: "Seoul's most international neighborhood — world cuisine and craft bars.", time: "2:00 PM", img: uimg("Itaewon", 152, 152), transport: "🚇 Subway · 5.0 km · 15 min", next: "Han River", lat: 37.5340, lng: 126.9940 },
          { name: "Han River", category: "Seoul · Nature", desc: "Riverside parks perfect for cycling, picnics, and watching the sunset.", time: "6:00 PM", img: uimg("Han River", 152, 152), transport: null, next: null, lat: 37.5280, lng: 126.9970 },
        ],
      },
      3: {
        stops: 2, distance: "6.0 km",
        activities: [
          { name: "Dongdaemun", category: "Seoul · Shopping", desc: "24-hour shopping complex and fashion hub. The futuristic DDP building is a must-see.", time: "9:00 AM", img: uimg("Dongdaemun", 152, 152), transport: "🚇 Subway · 6.0 km · 18 min", next: "Lotte World", lat: 37.5668, lng: 127.0090 },
          { name: "Lotte World", category: "Seoul · Entertainment", desc: "Massive indoor/outdoor theme park — one of the world's largest.", time: "1:00 PM", img: uimg("Lotte World", 152, 152), transport: null, next: null, lat: 37.5111, lng: 127.0985 },
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
    id: 201, city: "Seoul, Korea", place: "Hongdae",
    desc: "Youth culture · Street art · Nightlife",
    tag: "food", duration: "2 Days", likes: 1543, saves: 492,
    img: uimg("Hongdae", 160, 160),
    lat: 37.557, lng: 126.926,
    images: [uimg("Hongdae", 800, 600), uimg("Myeongdong", 800, 600), uimg("Han River", 800, 600)],
    days: 2,
    itinerary: {
      1: { stops: 4, distance: "5.8 km", activities: [
        { name: "Hongdae", category: "Seoul · Art", desc: "Indie music, street art, and buskers around Hongik University — best on weekends.", time: "11:00 AM", img: uimg("Hongdae", 152, 152), transport: "🚇 Subway · 1.2 km · 5 min", next: "Cheonggyecheon", lat: 37.5572, lng: 126.9260 },
        { name: "Cheonggyecheon", category: "Seoul · Nature", desc: "A 6km urban stream restored from a highway — perfect for a late-afternoon stroll.", time: "3:00 PM", img: uimg("Cheonggyecheon", 152, 152), transport: "🚇 Subway · 2.5 km · 9 min", next: "Myeongdong", lat: 37.5695, lng: 126.9784 },
        { name: "Myeongdong", category: "Seoul · Food", desc: "Street food heaven — tteokbokki, hotteok, and egg bread. Go before 8pm.", time: "6:00 PM", img: uimg("Myeongdong", 152, 152), transport: "🚇 Subway · 2.1 km · 8 min", next: "Banpo Bridge", lat: 37.5636, lng: 126.9850 },
        { name: "Banpo Bridge", category: "Seoul · Landmark", desc: "The rainbow fountain bridge illuminates the Han River every evening — a must-see.", time: "9:00 PM", img: uimg("Banpo Bridge", 152, 152), transport: null, next: null, lat: 37.5120, lng: 126.9947 },
      ]},
      2: { stops: 3, distance: "6.4 km", activities: [
        { name: "Noryangjin Market", category: "Seoul · Food", desc: "Seoul's biggest wholesale fish market — watch live seafood auctions at dawn.", time: "7:00 AM", img: uimg("Noryangjin Market", 152, 152), transport: "🚇 Subway · 3.0 km · 12 min", next: "Gangnam", lat: 37.5125, lng: 126.9423 },
        { name: "Gangnam", category: "Seoul · Shopping", desc: "Luxury shopping, K-pop dance studios, and the famous COEX underground mall.", time: "1:00 PM", img: uimg("Gangnam", 152, 152), transport: "🚇 Subway · 3.4 km · 12 min", next: "Jongmyo Shrine", lat: 37.4979, lng: 127.0276 },
        { name: "Jongmyo Shrine", category: "Seoul · Culture", desc: "UNESCO-listed Confucian royal shrine — serene and largely undiscovered by tourists.", time: "5:00 PM", img: uimg("Jongmyo Shrine", 152, 152), transport: null, next: null, lat: 37.5745, lng: 126.9942 },
      ]},
    },
    weather: [
      { date: "3.15 Sun · Today", desc: "Cloudy 5° ~ 14°", icon: "☁️" },
      { date: "3.16 Mon",         desc: "Sunny 8° ~ 18°",  icon: "☀️" },
    ],
  },
  {
    id: 202, city: "Seoul, Korea", place: "DMZ Border",
    desc: "History · Cold War · Tension zone",
    tag: "culture", duration: "1 Day", likes: 987, saves: 334,
    img: uimg("Gyeongbokgung", 160, 160),
    lat: 37.94, lng: 126.68,
    images: [uimg("Gyeongbokgung", 800, 600), uimg("Bukchon Village", 800, 600)],
    days: 1,
    itinerary: {
      1: { stops: 4, distance: "80 km", activities: [
        { name: "Imjingak Park", category: "DMZ · Memorial", desc: "Bridge of Freedom memorial — stranded trains and barbed wire from the Korean War.", time: "8:00 AM", img: uimg("Gyeongbokgung", 152, 152), transport: "🚌 Bus · 18 km · 30 min", next: "3rd Tunnel", lat: 37.8883, lng: 126.7420 },
        { name: "3rd Tunnel", category: "DMZ · Historic", desc: "One of four tunnels dug under the DMZ by North Korea — walk 73m below ground.", time: "10:30 AM", img: uimg("Bukchon Village", 152, 152), transport: "🚌 Bus · 5 km · 15 min", next: "Dora Observatory", lat: 37.9133, lng: 126.6987 },
        { name: "Dora Observatory", category: "DMZ · Viewpoint", desc: "Closest viewpoint to North Korea — see Kaesong and Propaganda Village through binoculars.", time: "12:00 PM", img: uimg("Namsan Tower", 152, 152), transport: "🚌 Bus · 3 km · 10 min", next: "Dorasan Station", lat: 37.9336, lng: 126.6934 },
        { name: "Dorasan Station", category: "DMZ · Historic", desc: "Southernmost train station in South Korea — the last stop before North Korea.", time: "2:00 PM", img: uimg("Insadong", 152, 152), transport: null, next: null, lat: 37.9014, lng: 126.7013 },
      ]},
    },
    weather: [
      { date: "3.15 Sun · Today", desc: "Cold 1° ~ 9°", icon: "🌬️" },
    ],
  },
  {
    id: 3, city: "Paris, France", place: "Eiffel Tower",
    desc: "Iconic landmark · Seine riverside",
    tag: "art", duration: "7 Days", likes: 4521, saves: 1876,
    img: uimg("Eiffel Tower", 160, 160),
    lat: 48.85, lng: 2.29,
    images: [
      uimg("Eiffel Tower", 800, 600),
      uimg("Louvre Museum", 800, 600),
      uimg("Seine Cruise", 800, 600),
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
    id: 301, city: "Paris, France", place: "Montmartre",
    desc: "Bohemian hilltop · Artist quarter",
    tag: "art", duration: "3 Days", likes: 2876, saves: 1102,
    img: uimg("Sacré-Cœur", 160, 160),
    lat: 48.886, lng: 2.343,
    images: [uimg("Sacré-Cœur", 800, 600), uimg("Eiffel Tower", 800, 600), uimg("Seine Cruise", 800, 600)],
    days: 3,
    itinerary: {
      1: { stops: 4, distance: "4.2 km", activities: [
        { name: "Sacré-Cœur", category: "Paris · Church", desc: "White-domed basilica on the hill of Montmartre — free entry, panoramic views.", time: "9:00 AM", color: "#c9783a", transport: "🚶 Walk · 0.5 km · 6 min", next: "Place du Tertre" },
        { name: "Place du Tertre", category: "Paris · Art", desc: "The original artist square where painters still work en plein air daily.", time: "10:30 AM", color: "#4a8fe8", transport: "🚶 Walk · 1.2 km · 15 min", next: "Moulin Rouge" },
        { name: "Moulin Rouge", category: "Paris · Culture", desc: "Iconic cabaret birthplace of the can-can. Book the evening show in advance.", time: "2:00 PM", color: "#8e3a59", transport: "🚇 Metro · 2.5 km · 10 min", next: "Galeries Lafayette" },
        { name: "Galeries Lafayette", category: "Paris · Shopping", desc: "Art Nouveau department store with a breathtaking stained-glass dome.", time: "5:00 PM", color: "#383852", transport: null, next: null },
      ]},
      2: { stops: 3, distance: "5.5 km", activities: [
        { name: "Centre Pompidou", category: "Paris · Museum", desc: "Inside-out modernist building housing Europe's largest modern art collection.", time: "10:00 AM", color: "#5a3882", transport: "🚶 Walk · 1.5 km · 18 min", next: "Marais District" },
        { name: "Marais District", category: "Paris · Food", desc: "Best falafel in Paris at L'As du Fallafel, then art galleries along Rue de Bretagne.", time: "1:00 PM", color: "#c9783a", transport: "🚶 Walk · 4.0 km · 50 min", next: "Place des Vosges" },
        { name: "Place des Vosges", category: "Paris · Historic", desc: "Paris's oldest planned square — arcaded walkways and Victor Hugo's house.", time: "5:00 PM", color: "#2d7a4a", transport: null, next: null },
      ]},
      3: { stops: 3, distance: "6.0 km", activities: [
        { name: "Luxembourg Gardens", category: "Paris · Park", desc: "The most beautiful park in Paris — model sailboats, chess players, and beekeepers.", time: "9:00 AM", color: "#2d7a4a", transport: "🚶 Walk · 3.0 km · 38 min", next: "Panthéon" },
        { name: "Panthéon", category: "Paris · Monument", desc: "Neo-classical mausoleum housing Voltaire, Rousseau, Victor Hugo, and Marie Curie.", time: "12:00 PM", color: "#383852", transport: "🚇 Metro · 3.0 km · 10 min", next: "Shakespeare & Co" },
        { name: "Shakespeare & Co", category: "Paris · Culture", desc: "The world's most famous English bookshop — cozy, literary, with Notre-Dame views.", time: "4:00 PM", color: "#4a8fe8", transport: null, next: null },
      ]},
    },
    weather: [
      { date: "3.15 Sun · Today", desc: "Sunny 11° ~ 19°", icon: "☀️" },
      { date: "3.16 Mon",         desc: "Cloudy 9° ~ 16°", icon: "☁️" },
      { date: "3.17 Tue",         desc: "Rain 7° ~ 14°",   icon: "🌧️" },
    ],
  },
  {
    id: 302, city: "Paris, France", place: "Versailles Day Trip",
    desc: "Royal palace · Grand gardens · History",
    tag: "culture", duration: "1 Day", likes: 3241, saves: 1450,
    img: uimg("Versailles", 160, 160),
    lat: 48.805, lng: 2.120,
    images: [uimg("Versailles", 800, 600), uimg("Palace Gardens", 800, 600), uimg("Louvre Museum", 800, 600)],
    days: 1,
    itinerary: {
      1: { stops: 4, distance: "4.5 km (on foot)", activities: [
        { name: "Palace of Versailles", category: "Versailles · Historic", desc: "Sun King's opulent palace — the Hall of Mirrors is unmissable. Book skip-the-line tickets.", time: "9:00 AM", color: "#c9783a", transport: "🚶 Walk · 0.5 km · 6 min", next: "Queen's Hamlet" },
        { name: "Queen's Hamlet", category: "Versailles · Garden", desc: "Marie Antoinette's rustic mock-village retreat — a hidden gem most visitors skip.", time: "12:00 PM", color: "#2d7a4a", transport: "🚶 Walk · 1.5 km · 18 min", next: "Grand Canal" },
        { name: "Grand Canal", category: "Versailles · Nature", desc: "Rent a rowboat on the 1.5km cross-shaped canal — the gardens from the water.", time: "2:00 PM", color: "#2a6090", transport: "🚶 Walk · 2.5 km · 30 min", next: "Trianon Palaces" },
        { name: "Trianon Palaces", category: "Versailles · Historic", desc: "Two smaller palaces — Grand and Petit Trianon — used as royal private retreats.", time: "4:00 PM", color: "#8e3a59", transport: null, next: null },
      ]},
    },
    weather: [
      { date: "3.15 Sun · Today", desc: "Sunny 10° ~ 17°", icon: "☀️" },
    ],
  },
  {
    id: 4, city: "Bali, Indonesia", place: "Ubud Rice Terraces",
    desc: "UNESCO heritage · Lush hillsides",
    tag: "nature", duration: "6 Days", likes: 3456, saves: 1234,
    img: uimg("Tegallalang Terrace", 160, 160),
    lat: -8.34, lng: 115.09,
    images: [
      uimg("Tegallalang Terrace", 800, 600),
      uimg("Tanah Lot", 800, 600),
      uimg("Uluwatu Temple", 800, 600),
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
    id: 401, city: "Bali, Indonesia", place: "Seminyak Beach",
    desc: "Surf · Beach clubs · Sunset cocktails",
    tag: "nature", duration: "3 Days", likes: 2188, saves: 876,
    img: uimg("Canggu Beach", 160, 160),
    lat: -8.69, lng: 115.16,
    images: [uimg("Canggu Beach", 800, 600), uimg("Tanah Lot", 800, 600), uimg("Uluwatu Temple", 800, 600)],
    days: 3,
    itinerary: {
      1: { stops: 3, distance: "5.0 km", activities: [
        { name: "Seminyak Beach", category: "Bali · Beach", desc: "Upscale beach with sunbeds and beach clubs. Potato Head Beach Club is iconic.", time: "10:00 AM", color: "#4a8fe8", transport: "🚗 Car · 2.0 km · 8 min", next: "Canggu Beach" },
        { name: "Canggu Beach", category: "Bali · Surf", desc: "Hipster beach village — surfing lessons, rice-field cafés, and sunset yoga.", time: "2:00 PM", color: "#2d7a4a", transport: "🚗 Car · 3.0 km · 12 min", next: "Sunset at Tanah Lot" },
        { name: "Sunset at Tanah Lot", category: "Bali · Temple", desc: "Sea temple on a rock, silhouetted against a fiery orange sunset sky.", time: "5:30 PM", color: "#c9783a", transport: null, next: null },
      ]},
      2: { stops: 3, distance: "22 km", activities: [
        { name: "Uluwatu Temple", category: "Bali · Cliff", desc: "Dramatic clifftop temple — beware the monkeys and stay for the Kecak dance.", time: "9:00 AM", color: "#383852", transport: "🚗 Car · 12 km · 35 min", next: "Padang Padang Beach" },
        { name: "Padang Padang Beach", category: "Bali · Beach", desc: "Tiny cave-entrance beach from the movie Eat Pray Love. Crystal clear water.", time: "1:00 PM", color: "#4a8fe8", transport: "🚗 Car · 10 km · 30 min", next: "Jimbaran Seafood" },
        { name: "Jimbaran Seafood", category: "Bali · Food", desc: "Candlelit seafood barbecue on the beach — catch of the day at sunset.", time: "6:00 PM", color: "#c9783a", transport: null, next: null },
      ]},
      3: { stops: 2, distance: "8 km", activities: [
        { name: "Nusa Dua", category: "Bali · Wellness", desc: "Luxury spa resorts and water sports. The Bali Collection mall is nearby.", time: "10:00 AM", color: "#5a3882", transport: "🚗 Car · 8 km · 25 min", next: "Benoa Harbour" },
        { name: "Benoa Harbour", category: "Bali · Water", desc: "Parasailing, jet-skiing, and glass-bottom boat rides over the coral reefs.", time: "2:00 PM", color: "#2a6090", transport: null, next: null },
      ]},
    },
    weather: [
      { date: "3.15 Sun · Today", desc: "Sunny 28° ~ 34°", icon: "☀️" },
      { date: "3.16 Mon",         desc: "Partly cloudy 26° ~ 32°", icon: "⛅" },
      { date: "3.17 Tue",         desc: "Sunny 27° ~ 33°", icon: "☀️" },
    ],
  },
  {
    id: 402, city: "Bali, Indonesia", place: "Mount Batur Sunrise",
    desc: "Volcano trek · Sunrise · Hot springs",
    tag: "nature", duration: "2 Days", likes: 1654, saves: 612,
    img: uimg("Mount Batur", 160, 160),
    lat: -8.24, lng: 115.38,
    images: [uimg("Mount Batur", 800, 600), uimg("Tegallalang Terrace", 800, 600), uimg("Sacred Monkey Forest", 800, 600)],
    days: 2,
    itinerary: {
      1: { stops: 3, distance: "volcano + springs", activities: [
        { name: "Mount Batur Summit", category: "Bali · Trekking", desc: "2-hour pre-dawn hike with a guide — watch the sunrise from 1717m above sea level.", time: "4:00 AM", color: "#383852", transport: "🚗 Car · 8 km · 25 min", next: "Crater Lake" },
        { name: "Crater Lake", category: "Bali · Nature", desc: "Batur Lake shimmers turquoise in the caldera — stunning from the rim.", time: "7:00 AM", color: "#2a6090", transport: "🚗 Car · 5 km · 20 min", next: "Toya Bungkah Hot Springs" },
        { name: "Toya Bungkah Hot Springs", category: "Bali · Wellness", desc: "Natural geothermal pools on the lake shore — the perfect post-hike soak.", time: "10:00 AM", color: "#c9783a", transport: null, next: null },
      ]},
      2: { stops: 3, distance: "18 km", activities: [
        { name: "Tegallalang Terrace", category: "Ubud · Nature", desc: "UNESCO rice terraces — golden in the morning light. Try the famous coffee here.", time: "8:00 AM", color: "#2d7a4a", transport: "🚗 Car · 10 km · 30 min", next: "Sacred Monkey Forest" },
        { name: "Sacred Monkey Forest", category: "Ubud · Nature", desc: "Ancient temple ruins and 700+ playful monkeys in a dense jungle sanctuary.", time: "12:00 PM", color: "#2d7a4a", transport: "🚶 Walk · 8 km · 30 min", next: "Ubud Palace" },
        { name: "Ubud Palace", category: "Ubud · Culture", desc: "Royal Puri Saren palace in the heart of Ubud — evening dance performances.", time: "5:00 PM", color: "#383852", transport: null, next: null },
      ]},
    },
    weather: [
      { date: "3.15 Sun · Today", desc: "Clear 18° ~ 28°", icon: "⭐" },
      { date: "3.16 Mon",         desc: "Sunny 22° ~ 31°", icon: "☀️" },
    ],
  },
  {
    id: 5, city: "Bangkok, Thailand", place: "Grand Palace",
    desc: "Royal complex · Old town",
    tag: "culture", duration: "4 Days", likes: 2198, saves: 845,
    img: uimg("Grand Palace", 160, 160),
    lat: 13.75, lng: 100.49,
    images: [
      uimg("Grand Palace", 800, 600),
      uimg("Wat Pho", 800, 600),
      uimg("Arun Temple", 800, 600),
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
    tag: "food", duration: "3 Days", likes: 1678, saves: 592,
    img: uimg("Dotonbori", 160, 160),
    lat: 34.67, lng: 135.50,
    images: [
      uimg("Dotonbori", 800, 600),
      uimg("Osaka Castle", 800, 600),
      uimg("Universal Studios", 800, 600),
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


/* Zoom threshold: above this, show individual spots; below, show city bubbles */
const ZOOM_SPLIT = 8;

/* Get one representative spot per destination for a city (used for zoomed-in pins) */
function getCitySpots(cityName) {
  return DESTINATIONS
    .filter(d => d.city.startsWith(cityName))
    .map((dest, idx) => ({
      id: dest.id,
      name: dest.place,
      desc: dest.desc,
      lat: dest.lat,
      lng: dest.lng,
      index: idx,        // 0-based index matching card order
    }));
}

function DiscoverMap({ activeCity, onSpotClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const zoomLevelRef = useRef(4);
  const lastModeRef = useRef("city"); // "city" or "spots"
  const onSpotClickRef = useRef(onSpotClick);
  onSpotClickRef.current = onSpotClick;

  /* Render markers based on current zoom level */
  function renderMarkers(map, maps, zoom) {
    const mode = zoom >= ZOOM_SPLIT ? "spots" : "city";

    // Skip re-render if mode hasn't changed
    if (mode === lastModeRef.current && markersRef.current.length > 0) return;
    lastModeRef.current = mode;

    // Clear old overlays
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    if (mode === "city") {
      // Show aggregated city bubbles
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
        overlay.onRemove = function () { this._div?.remove(); };
        overlay.setMap(map);
        markersRef.current.push(overlay);
      });
    } else {
      // Show one pin per destination (travel plan) for the active city
      const spots = getCitySpots(activeCity);
      spots.forEach((spot) => {
        const num = spot.index + 1; // 1-based to match card order
        const overlay = new maps.OverlayView();
        overlay.onAdd = function () {
          const div = document.createElement("div");
          div.className = "nd-gm-pin";
          div.innerHTML = `
            <div class="nd-map-pin-dot">${num}</div>
            <div class="nd-map-pin-label">${spot.name}</div>
          `;
          div.style.cursor = "pointer";
          div.addEventListener("click", () => {
            if (onSpotClickRef.current) onSpotClickRef.current(spot.index);
          });
          this._div = div;
          this.getPanes().overlayMouseTarget.appendChild(div);
        };
        overlay.draw = function () {
          const pos = this.getProjection().fromLatLngToDivPixel(
            new maps.LatLng(spot.lat, spot.lng)
          );
          if (pos && this._div) {
            this._div.style.position = "absolute";
            this._div.style.left = pos.x + "px";
            this._div.style.top = pos.y + "px";
            this._div.style.transform = "translate(-50%, -100%)";
          }
        };
        overlay.onRemove = function () { this._div?.remove(); };
        overlay.setMap(map);
        markersRef.current.push(overlay);
      });
    }
  }

  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;
    let zoomListener = null;

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

        // Listen for zoom changes
        zoomListener = map.addListener("zoom_changed", () => {
          const z = map.getZoom();
          zoomLevelRef.current = z;
          renderMarkers(map, maps, z);
        });
      }

      const map = mapInstanceRef.current;
      map.panTo({ lat: city.lat, lng: city.lng });

      // Force re-render markers on city change
      lastModeRef.current = "";
      renderMarkers(map, maps, map.getZoom());
    });

    return () => {
      cancelled = true;
      if (zoomListener) zoomListener.remove?.();
    };
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
  { name: "Tokyo",     country: "Japan",       img: uimg("Tokyo", 160, 160),     lat: 35.6762,  lng: 139.6503,  plans: 43 },
  { name: "Seoul",     country: "Korea",       img: uimg("Seoul", 160, 160),     lat: 37.5665,  lng: 126.9780,  plans: 30 },
  { name: "Paris",     country: "France",      img: uimg("Paris", 160, 160),     lat: 48.8566,  lng: 2.3522,    plans: 37 },
  { name: "Bali",      country: "Indonesia",   img: uimg("Bali", 160, 160),      lat: -8.3405,  lng: 115.0920,  plans: 21 },
  { name: "Bangkok",   country: "Thailand",    img: uimg("Bangkok", 160, 160),   lat: 13.7563,  lng: 100.5018,  plans: 22 },
  { name: "Osaka",     country: "Japan",       img: uimg("Osaka", 160, 160),     lat: 34.6937,  lng: 135.5023,  plans: 31 },
  { name: "New York",  country: "USA",         img: uimg("New York", 160, 160),  lat: 40.7128,  lng: -74.0060,  plans: 38 },
  { name: "London",    country: "UK",          img: uimg("London", 160, 160),    lat: 51.5074,  lng: -0.1278,   plans: 26 },
  { name: "Singapore", country: "Singapore",   img: uimg("Singapore", 160, 160), lat: 1.3521,   lng: 103.8198,  plans: 24 },
  { name: "Istanbul",  country: "Turkey",      img: uimg("Istanbul", 160, 160),  lat: 41.0082,  lng: 28.9784,   plans: 17 },
  { name: "Rome",      country: "Italy",       img: uimg("Rome", 160, 160),      lat: 41.9028,  lng: 12.4964,   plans: 29 },
  { name: "Barcelona", country: "Spain",       img: uimg("Barcelona", 160, 160), lat: 41.3851,  lng: 2.1734,    plans: 21 },
  { name: "Kyoto",     country: "Japan",       img: uimg("Kyoto", 160, 160),     lat: 35.0116,  lng: 135.7681,  plans: 33 },
  { name: "Amsterdam", country: "Netherlands", img: uimg("Amsterdam", 160, 160), lat: 52.3676,  lng: 4.9041,    plans: 16 },
  { name: "Dubai",     country: "UAE",         img: uimg("Dubai", 160, 160),     lat: 25.2048,  lng: 55.2708,   plans: 20 },
  { name: "Sydney",    country: "Australia",   img: uimg("Sydney", 160, 160),    lat: -33.8688, lng: 151.2093,  plans: 18 },
  { name: "Lisbon",    country: "Portugal",    img: uimg("Lisbon", 160, 160),    lat: 38.7223,  lng: -9.1393,   plans: 14 },
  { name: "Taipei",    country: "Taiwan",      img: uimg("Taipei", 160, 160),    lat: 25.0330,  lng: 121.5654,  plans: 15 },
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
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeCity, setActiveCity]         = useState("Tokyo");
  const [cardMode, setCardMode]             = useState(false);
  const [citySheet, setCitySheet]           = useState(false);
  const [citySearch, setCitySearch]         = useState("");
  const [savedCards, setSavedCards]           = useState(new Set());
  const [mapSaved, setMapSaved]               = useState(false);
  const [detailDest, setDetailDest]         = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("nd-detailDest");
        if (saved) { sessionStorage.removeItem("nd-detailDest"); return JSON.parse(saved); }
      } catch {}
    }
    return null;
  });
  const [tripTab, setTripTab]               = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("nd-tripTab");
      if (saved) { sessionStorage.removeItem("nd-tripTab"); return saved; }
    }
    return "overview";
  });
  const [tripDay, setTripDay]               = useState(0); // default to Total overview
  const [carouselIndex, setCarouselIndex]   = useState({});
  const [mapMode, setMapMode]               = useState(false);
  const [addedToTrip, setAddedToTrip]       = useState(false);
  const [cardAddedSet, setCardAddedSet]     = useState(new Set());
  const [detailAct, setDetailAct]           = useState(null); // activity detail page
  const [descExpanded, setDescExpanded]     = useState(false);
  const mapExitTime = useRef(0);
  const [selectedActIdx, setSelectedActIdx] = useState(0);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const swipeRef = useRef({ startX: 0, currentX: 0, dragging: false });
  const springRef = useRef(null);

  /* Save a destination to My Trips (localStorage) */
  function saveDestToMyTrips(dest) {
    if (!dest) return;
    try {
      const cityName = dest.city.split(",")[0].trim();
      const activities = {};
      Object.entries(dest.itinerary).forEach(([day, d]) => {
        activities[Number(day)] = (d.activities || []).map(a => ({
          name: a.name,
          address: a.category || dest.city,
          lat: a.lat,
          lng: a.lng,
        }));
      });
      const id = `trip_nd_${dest.id}_${Date.now()}`;
      const now = Date.now();
      const trip = {
        id,
        destination: cityName,
        duration: dest.duration || `${dest.days} Days`,
        prefs: [],
        budget: "",
        activities,
        expenses: [],
        createdAt: now,
        updatedAt: now,
      };
      const trips = JSON.parse(localStorage.getItem("opal_trips") || "[]");
      trips.unshift(trip);
      localStorage.setItem("opal_trips", JSON.stringify(trips));
      return true;
    } catch (_) { return false; }
  }

  function saveToMyTrips() {
    if (saveDestToMyTrips(detailDest)) {
      setAddedToTrip(true);
      setTimeout(() => setAddedToTrip(false), 2000);
    }
  }

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

  const shellRef = useRef(null);
  useEffect(() => {
    if (!shellRef.current) return;
    const sections = shellRef.current.querySelectorAll(
      ".nd-card-mode-wrap, .nd-filter-scroll, .nd-cards-scroll"
    );
    gsap.fromTo(sections,
      { opacity: 0, y: 50, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out", stagger: 0.06 }
    );
  }, []);

  const cardsScrollRef = useRef(null);

  // Filter destinations: first by city, then by category
  const cityDests = DESTINATIONS.filter((d) => d.city.startsWith(activeCity));
  const filtered = activeCategory === "all"
    ? cityDests
    : cityDests.filter((d) => d.tag === activeCategory);

  // Scroll card into view when a map pin is clicked
  function scrollToCard(index) {
    const container = cardsScrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll('.nd-card, .nd-card-lg');
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  function handleCardClick(dest) {
    setDetailDest(dest);
    setTripTab("overview");
    setTripDay(0);              // 0 = Total (overall view)
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
    <div className="nd-shell" ref={shellRef}>
      <DiscoverMap activeCity={activeCity} onSpotClick={scrollToCard} />

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

        <div className="nd-cards-scroll" ref={cardsScrollRef}>
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
                    <p className="nd-card-lg-name">{dest.cardTitle || dest.city}</p>
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
                  <button className={`picks-card-save${savedCards.has(dest.id) ? ' picks-saved' : ''}`} onClick={(e) => { e.stopPropagation(); setSavedCards(prev => { const next = new Set(prev); next.has(dest.id) ? next.delete(dest.id) : next.add(dest.id); return next; }); }}>
                    {savedCards.has(dest.id) ? '✓ Saved' : `🔖 ${dest.saves || 0}`}
                  </button>
                  <div className="nd-card-add" onClick={(e) => { e.stopPropagation(); if (saveDestToMyTrips(dest)) { setCardAddedSet(prev => new Set(prev).add(dest.id)); setTimeout(() => setCardAddedSet(prev => { const n = new Set(prev); n.delete(dest.id); return n; }), 2000); } }}>{cardAddedSet.has(dest.id) ? "✓ Added" : "+ Add to Trip"}</div>
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
                    <p className="nd-card-lg-name">{dest.cardTitle || dest.city}</p>
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
                  <span className={`picks-card-save${savedCards.has(dest.id) ? ' picks-saved' : ''}`} role="button" onClick={(e) => { e.stopPropagation(); setSavedCards(prev => { const next = new Set(prev); next.has(dest.id) ? next.delete(dest.id) : next.add(dest.id); return next; }); }}>
                    {savedCards.has(dest.id) ? '✓ Saved' : `🔖 ${dest.saves || 0}`}
                  </span>
                  <div className="nd-card-add" onClick={(e) => { e.stopPropagation(); if (saveDestToMyTrips(dest)) { setCardAddedSet(prev => new Set(prev).add(dest.id)); setTimeout(() => setCardAddedSet(prev => { const n = new Set(prev); n.delete(dest.id); return n; }), 2000); } }}>{cardAddedSet.has(dest.id) ? "✓ Added" : "+ Add to Trip"}</div>
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
                    setActiveCity(city.name);
                    setActiveCategory("all");
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
          <div className={`nd-mapview${!mapMode ? ' nd-mapview--behind' : ''}`} style={{ zIndex: 1000 }}>
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
              <FontAwesomeIcon icon={faChevronLeft} style={{ width: 10, height: 14, color: "white" }} />
            </button>

            {/* Share button */}
            <button className="nd-mapview-share-btn"
              onClick={() => navigator.share ? navigator.share({ title: activeTrip?.cardTitle, text: activeTrip?.desc }) : null}>
              <FontAwesomeIcon icon={faShareNodes} style={{ width: 16, height: 16, color: "white" }} />
            </button>

            {/* Bottom handle — swipe up or tap to restore panel */}
            <div className="nd-mapview-bottom-handle"
              onClick={() => { mapExitTime.current = Date.now(); setTimeout(() => setMapMode(false), 80); }}
              onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); mapExitTime.current = Date.now(); setTimeout(() => setMapMode(false), 80); }}>
              <div className="nd-mapview-bottom-handle-pill" />
            </div>

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
              <FontAwesomeIcon icon={faChevronLeft} style={{ width: 14, height: 14, color: "white" }} />
            </button>
            <div className="nd-act-detail-topbar-right">
              <button className="nd-act-detail-icon-btn">
                <FontAwesomeIcon icon={faBookmarkReg} style={{ width: 16, height: 16, color: "white" }} />
              </button>
              <button className="nd-act-detail-icon-btn">
                <FontAwesomeIcon icon={faEllipsisVertical} style={{ width: 5, height: 16, color: "white" }} />
              </button>
            </div>
          </div>

          {/* Title + likes */}
          <h1 className="nd-act-detail-title">{detailAct.name}</h1>
          <div className="nd-act-detail-likes">
            <span className="nd-act-detail-likes-icon">👍</span>
            <span>1502</span>
          </div>

          {/* Photo grid — same location, different angles */}
          <div className="nd-act-detail-photos">
            <img className="nd-act-detail-photo-main" src={uimg(detailAct.name, 800, 600, 0)} alt={detailAct.name} />
            <div className="nd-act-detail-photo-grid">
              <img src={uimg(detailAct.name, 400, 300, 1)} alt="" />
              <img src={uimg(detailAct.name, 400, 300, 2)} alt="" />
              <img src={uimg(detailAct.name, 400, 300, 3)} alt="" />
              <div className="nd-act-detail-photo-more">
                <img src={uimg(detailAct.name, 400, 300, 4)} alt="" />
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
              <Stack
                randomRotation={false}
                sensitivity={200}
                sendToBackOnClick={true}
                cards={[0,1,2,3].map((n) => (
                  <img
                    key={n}
                    src={uimg(detailAct.name, 600, 600, n)}
                    alt={`${detailAct.name} photo ${n + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ))}
                autoplay={false}
              />
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
              {(() => {
                const nearbyActs = detailDest
                  ? Object.values(detailDest.itinerary).flatMap(d => d.activities).filter(a => a.name !== detailAct.name && PHOTO_MAP[a.name]).slice(0, 3)
                  : [];
                const nearbyData = nearbyActs.length >= 3
                  ? nearbyActs.map((a, i) => ({ name: a.name, dist: (0.1 + i * 0.15).toFixed(1) }))
                  : ['Coffee Shop', 'Ramen Bar', 'Gift Store'].map((n, i) => ({ name: n, dist: (0.1 + i * 0.15).toFixed(1) }));
                return nearbyData.map((item, i) => (
                  <div key={i} className="nd-act-detail-nearby-card">
                    <img className="nd-act-detail-nearby-img" src={uimg(item.name, 240, 160, 0)} alt={item.name} />
                    <p className="nd-act-detail-nearby-name">{item.name}</p>
                    <p className="nd-act-detail-nearby-dist">{item.dist} km</p>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Panel Mode — regular trip detail sheet ═══ */}
      {detailDest && !detailAct && (
        <div className={`nd-trip-overlay${mapMode ? ' nd-trip-overlay--out' : ''}`} onClick={() => { if (mapMode || Date.now() - mapExitTime.current < 800) return; setMapMode(true); }}
          onTouchEnd={(e) => { if (mapMode) { e.stopPropagation(); return; } if (Date.now() - mapExitTime.current < 800) { e.stopPropagation(); e.preventDefault(); return; } }}>
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
                    <button className="nd-trip-detail-card nd-trip-detail-card-btn" onClick={() => {
                      sessionStorage.setItem("nd-detailDest", JSON.stringify(detailDest));
                      sessionStorage.setItem("nd-tripTab", tripTab);
                      router.push('/notes');
                    }}>
                      <p className="nd-trip-detail-card-title">Notes</p>
                      <p className="nd-trip-detail-card-sub">Record your travel ideas</p>
                    </button>
                    <button className="nd-trip-detail-card nd-trip-detail-card-btn" onClick={() => {
                      sessionStorage.setItem("nd-detailDest", JSON.stringify(detailDest));
                      sessionStorage.setItem("nd-tripTab", tripTab);
                      router.push('/packing');
                    }}>
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
              <div style={{ height: 72 }} />
            </div>

            {/* Floating "+ Add to Trip" pill — bottom-right, over content */}
            <button
              onClick={saveToMyTrips}
              style={{
                position: "absolute", bottom: 20, right: 16,
                height: 40, borderRadius: 20, border: "none", cursor: "pointer",
                padding: "0 18px",
                background: addedToTrip ? "#1a3a2a" : "#fff",
                color: addedToTrip ? "#4ade80" : "#111",
                fontSize: 14, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 6,
                boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
                transition: "background 0.25s, color 0.25s",
                zIndex: 10,
              }}>
              {addedToTrip ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Saved!
                </>
              ) : "+ Add to Trip"}
            </button>
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
                  <Link href="/planner" className="hp-nav-center-btn" style={{ overflow: "hidden", position: "relative" }}>
                    {pathname === '/planner' ? (
                      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", borderRadius: "50%" }}>
                        <Grainient color1="#F97316" color2="#396cbf" color3="#B497CF" timeSpeed={0.25} warpStrength={1} warpFrequency={5} warpSpeed={2} warpAmplitude={50} rotationAmount={500} grainAmount={0.1} contrast={1.5} zoom={0.9} />
                      </div>
                    ) : (
                      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", borderRadius: "50%", background: "linear-gradient(135deg, #F97316 0%, #396cbf 60%, #B497CF 100%)" }} />
                    )}
                    <FontAwesomeIcon icon={faPlus} style={{ width: 18, height: 18, color: "white", position: "relative", zIndex: 1 }} />
                  </Link>
                </div>
              );
            }
            return (
              <Link key={i} href={item.href} className={`hp-nav-item${pathname === item.href ? " hp-nav-active" : ""}`}>
                <FontAwesomeIcon icon={item.icon} className="hp-nav-icon" style={{ width: 20, height: 20 }} />
                <span className="hp-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>}
    </div>
  );
}
