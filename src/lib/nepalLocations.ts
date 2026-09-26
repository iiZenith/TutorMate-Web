/* ═══════════════════════════════════════════════════════════════
   Nepal Location Seed Data
   Comprehensive default data for all 7 provinces with real
   districts and municipalities / local areas.
   ═══════════════════════════════════════════════════════════════ */

export interface SeedArea {
  name: string;
}

export interface SeedDistrict {
  name: string;
  areas: SeedArea[];
}

export interface SeedProvince {
  name: string;
  districts: SeedDistrict[];
}

/**
 * All 7 provinces of Nepal with key districts and local areas.
 * Used as fallback data and to seed Firestore on first run.
 */
export const NEPAL_PROVINCES: SeedProvince[] = [
  {
    name: "Koshi Province",
    districts: [
      {
        name: "Morang",
        areas: [
          { name: "Biratnagar Metropolitan City" },
          { name: "Sundar Haraicha Municipality" },
          { name: "Belbari Municipality" },
          { name: "Urlabari Municipality" },
          { name: "Pathari-Shanishchare Municipality" },
          { name: "Rangeli Municipality" },
          { name: "Letang Municipality" },
        ],
      },
      {
        name: "Sunsari",
        areas: [
          { name: "Itahari Sub-Metropolitan City" },
          { name: "Dharan Sub-Metropolitan City" },
          { name: "Inaruwa Municipality" },
          { name: "Duhabi Municipality" },
          { name: "Ramdhuni Municipality" },
        ],
      },
      {
        name: "Jhapa",
        areas: [
          { name: "Mechinagar Municipality" },
          { name: "Birtamod Municipality" },
          { name: "Bhadrapur Municipality" },
          { name: "Damak Municipality" },
          { name: "Kankai Municipality" },
          { name: "Arjundhara Municipality" },
          { name: "Shivasatakshi Municipality" },
        ],
      },
      {
        name: "Ilam",
        areas: [
          { name: "Ilam Municipality" },
          { name: "Deumai Municipality" },
          { name: "Mai Municipality" },
          { name: "Suryodaya Municipality" },
        ],
      },
      {
        name: "Dhankuta",
        areas: [
          { name: "Dhankuta Municipality" },
          { name: "Pakhribas Municipality" },
          { name: "Mahalaxmi Municipality" },
        ],
      },
    ],
  },
  {
    name: "Madhesh Province",
    districts: [
      {
        name: "Parsa",
        areas: [
          { name: "Birgunj Metropolitan City" },
          { name: "Pokhariya Municipality" },
          { name: "Bahudarmai Municipality" },
        ],
      },
      {
        name: "Bara",
        areas: [
          { name: "Kalaiya Sub-Metropolitan City" },
          { name: "Jeetpur-Simara Sub-Metropolitan City" },
          { name: "Kolhabi Municipality" },
          { name: "Nijgadh Municipality" },
          { name: "Mahagadhimai Municipality" },
        ],
      },
      {
        name: "Dhanusha",
        areas: [
          { name: "Janakpurdham Sub-Metropolitan City" },
          { name: "Chhireshwornath Municipality" },
          { name: "Ganeshman Charnath Municipality" },
          { name: "Dhanushadham Municipality" },
          { name: "Mithila Municipality" },
        ],
      },
      {
        name: "Siraha",
        areas: [
          { name: "Siraha Municipality" },
          { name: "Lahan Municipality" },
          { name: "Golbazar Municipality" },
          { name: "Mirchaiya Municipality" },
        ],
      },
      {
        name: "Saptari",
        areas: [
          { name: "Rajbiraj Municipality" },
          { name: "Kanchanrup Municipality" },
          { name: "Dakneshwori Municipality" },
          { name: "Hanumannagar Kankalini Municipality" },
          { name: "Bodebarsain Municipality" },
        ],
      },
    ],
  },
  {
    name: "Bagmati Province",
    districts: [
      {
        name: "Kathmandu",
        areas: [
          { name: "Kathmandu Metropolitan City" },
          { name: "Kirtipur Municipality" },
          { name: "Budhanilkantha Municipality" },
          { name: "Tokha Municipality" },
          { name: "Tarakeshwar Municipality" },
          { name: "Nagarjun Municipality" },
          { name: "Kageshwari-Manohara Municipality" },
          { name: "Chandragiri Municipality" },
          { name: "Gokarneshwar Municipality" },
          { name: "Dakshinkali Municipality" },
          { name: "Shankharapur Municipality" },
        ],
      },
      {
        name: "Lalitpur",
        areas: [
          { name: "Lalitpur Metropolitan City" },
          { name: "Godawari Municipality" },
          { name: "Mahalaxmi Municipality" },
          { name: "Konjyosom Rural Municipality" },
          { name: "Bagmati Rural Municipality" },
        ],
      },
      {
        name: "Bhaktapur",
        areas: [
          { name: "Bhaktapur Municipality" },
          { name: "Madhyapur Thimi Municipality" },
          { name: "Suryabinayak Municipality" },
          { name: "Changunarayan Municipality" },
        ],
      },
      {
        name: "Kavrepalanchok",
        areas: [
          { name: "Dhulikhel Municipality" },
          { name: "Banepa Municipality" },
          { name: "Panauti Municipality" },
          { name: "Panchkhal Municipality" },
          { name: "Namobuddha Municipality" },
        ],
      },
      {
        name: "Chitwan",
        areas: [
          { name: "Bharatpur Metropolitan City" },
          { name: "Ratnanagar Municipality" },
          { name: "Khairahani Municipality" },
          { name: "Rapti Municipality" },
          { name: "Kalika Municipality" },
          { name: "Madi Municipality" },
        ],
      },
      {
        name: "Makwanpur",
        areas: [
          { name: "Hetauda Sub-Metropolitan City" },
          { name: "Thaha Municipality" },
          { name: "Bhimphedi Rural Municipality" },
        ],
      },
      {
        name: "Nuwakot",
        areas: [
          { name: "Bidur Municipality" },
          { name: "Belkotgadhi Municipality" },
          { name: "Kakani Rural Municipality" },
        ],
      },
    ],
  },
  {
    name: "Gandaki Province",
    districts: [
      {
        name: "Kaski",
        areas: [
          { name: "Pokhara Metropolitan City" },
          { name: "Annapurna Rural Municipality" },
          { name: "Machhapuchchhre Rural Municipality" },
          { name: "Madi Rural Municipality" },
          { name: "Rupa Rural Municipality" },
        ],
      },
      {
        name: "Tanahun",
        areas: [
          { name: "Bhanu Municipality" },
          { name: "Bhimad Municipality" },
          { name: "Shuklagandaki Municipality" },
          { name: "Byas Municipality" },
        ],
      },
      {
        name: "Gorkha",
        areas: [
          { name: "Gorkha Municipality" },
          { name: "Palungtar Municipality" },
          { name: "Sulikot Rural Municipality" },
        ],
      },
      {
        name: "Syangja",
        areas: [
          { name: "Putalibazar Municipality" },
          { name: "Waling Municipality" },
          { name: "Chapakot Municipality" },
          { name: "Galyang Municipality" },
          { name: "Bhirkot Municipality" },
        ],
      },
      {
        name: "Lamjung",
        areas: [
          { name: "Besisahar Municipality" },
          { name: "Sundarbazar Municipality" },
          { name: "Rainas Municipality" },
          { name: "Madhya Nepal Municipality" },
        ],
      },
    ],
  },
  {
    name: "Lumbini Province",
    districts: [
      {
        name: "Rupandehi",
        areas: [
          { name: "Butwal Sub-Metropolitan City" },
          { name: "Siddharthanagar Municipality" },
          { name: "Tilottama Municipality" },
          { name: "Devdaha Municipality" },
          { name: "Sainamaina Municipality" },
          { name: "Lumbini Sanskritik Municipality" },
        ],
      },
      {
        name: "Kapilvastu",
        areas: [
          { name: "Kapilvastu Municipality" },
          { name: "Buddhabhumi Municipality" },
          { name: "Shivaraj Municipality" },
          { name: "Maharajgunj Municipality" },
          { name: "Krishnanagar Municipality" },
        ],
      },
      {
        name: "Dang",
        areas: [
          { name: "Ghorahi Sub-Metropolitan City" },
          { name: "Tulsipur Sub-Metropolitan City" },
          { name: "Lamahi Municipality" },
        ],
      },
      {
        name: "Banke",
        areas: [
          { name: "Nepalgunj Sub-Metropolitan City" },
          { name: "Kohalpur Municipality" },
          { name: "Narainapur Rural Municipality" },
          { name: "Rapti Sonari Rural Municipality" },
        ],
      },
      {
        name: "Palpa",
        areas: [
          { name: "Tansen Municipality" },
          { name: "Rampur Municipality" },
          { name: "Palpa Municipality" },
        ],
      },
    ],
  },
  {
    name: "Karnali Province",
    districts: [
      {
        name: "Surkhet",
        areas: [
          { name: "Birendranagar Municipality" },
          { name: "Bheriganga Municipality" },
          { name: "Gurbhakot Municipality" },
          { name: "Panchapuri Municipality" },
          { name: "Lekbeshi Municipality" },
        ],
      },
      {
        name: "Dailekh",
        areas: [
          { name: "Narayan Municipality" },
          { name: "Dullu Municipality" },
          { name: "Aathbis Municipality" },
          { name: "Chamunda Bindrasaini Municipality" },
        ],
      },
      {
        name: "Jumla",
        areas: [
          { name: "Chandannath Municipality" },
          { name: "Tatopani Rural Municipality" },
          { name: "Patarasi Rural Municipality" },
        ],
      },
      {
        name: "Dolpa",
        areas: [
          { name: "Thuli Bheri Municipality" },
          { name: "Tripurasundari Municipality" },
          { name: "Dolpo Buddha Rural Municipality" },
        ],
      },
    ],
  },
  {
    name: "Sudurpashchim Province",
    districts: [
      {
        name: "Kailali",
        areas: [
          { name: "Dhangadhi Sub-Metropolitan City" },
          { name: "Tikapur Municipality" },
          { name: "Ghodaghodi Municipality" },
          { name: "Lamkichuha Municipality" },
          { name: "Bhajani Municipality" },
          { name: "Gauriganga Municipality" },
        ],
      },
      {
        name: "Kanchanpur",
        areas: [
          { name: "Mahendranagar Municipality" },
          { name: "Bhimdatta Municipality" },
          { name: "Punarbas Municipality" },
          { name: "Bedkot Municipality" },
          { name: "Shuklaphanta Municipality" },
        ],
      },
      {
        name: "Doti",
        areas: [
          { name: "Dipayal-Silgadhi Municipality" },
          { name: "Shikhar Municipality" },
          { name: "Purbichauki Rural Municipality" },
        ],
      },
      {
        name: "Dadeldhura",
        areas: [
          { name: "Amargadhi Municipality" },
          { name: "Parashuram Municipality" },
          { name: "Aalital Rural Municipality" },
        ],
      },
      {
        name: "Baitadi",
        areas: [
          { name: "Dasharathchanda Municipality" },
          { name: "Patan Municipality" },
          { name: "Melauli Municipality" },
          { name: "Purchaudi Municipality" },
        ],
      },
    ],
  },
];
