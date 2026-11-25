export type TitleStatus = "ongoing" | "completed" | "hiatus";

export type AccessType = "free" | "freemium" | "subscription" | "purchase";

export type LinkLanguage = "id" | "en" | "ko";

export interface ReadingLink {
  platform: string;
  url: string;
  language: LinkLanguage;
  access: AccessType;
  note?: string;
}

export interface Title {
  id: string;
  slug: string;
  title: string;
  altTitles?: string[];
  type: "manhwa";
  status: TitleStatus;
  genres: string[];
  synopsis: string;
  year: number;
  author?: string;
  episodes?: number;
  /** ISO date (YYYY-MM-DD) of the latest verified episode update. Null = unknown. */
  updatedAt?: string | null;
  popular?: boolean;
  links: ReadingLink[];
}

const WEBTOON_EN = (path: string): ReadingLink => ({
  platform: "WEBTOON",
  url: `https://www.webtoons.com/en/${path}`,
  language: "en",
  access: "freemium",
  note: "Gratis, episode terbaru via Fast Pass",
});

const WEBTOON_ID = (path: string): ReadingLink => ({
  platform: "WEBTOON",
  url: `https://www.webtoons.com/id/${path}`,
  language: "id",
  access: "freemium",
  note: "Bahasa Indonesia, gratis, episode terbaru via Fast Pass",
});

export const TITLES: Title[] = [
  {
    id: "tower-of-god",
    slug: "tower-of-god",
    title: "Tower of God",
    altTitles: ["신의 탑"],
    type: "manhwa",
    status: "hiatus",
    genres: ["Fantasi", "Aksi", "Petualangan"],
    synopsis:
      "Bam masuk ke Menara misterius demi mengejar Rachel, satu-satunya orang yang pernah ia kenal. Di setiap lantai, ujian mematikan dan sekutu tak terduga menantinya.",
    year: 2010,
    author: "SIU",
    episodes: 652,
    updatedAt: "2025-02-23",
    popular: true,
    links: [
      WEBTOON_ID("fantasy/tower-of-god/list?title_no=749"),
      WEBTOON_EN("fantasy/tower-of-god/list?title_no=95"),
    ],
  },
  {
    id: "lookism",
    slug: "lookism",
    title: "Lookism",
    altTitles: ["외모지상주의"],
    type: "manhwa",
    status: "ongoing",
    genres: ["Drama", "Aksi", "Sekolah"],
    synopsis:
      "Daniel Park yang selalu dirundung tiba-tiba terbangun di tubuh kedua yang tampan dan sempurna. Ia pun menjalani dua kehidupan sekaligus — dan dunia memperlakukannya dengan cara yang sangat berbeda.",
    year: 2014,
    author: "Taejun Pak",
    episodes: 623,
    updatedAt: "2026-11-21",
    popular: true,
    links: [
      WEBTOON_ID("action/lookism/list?title_no=532"),
      WEBTOON_EN("drama/lookism/list?title_no=1049"),
    ],
  },
  {
    id: "eleceed",
    slug: "eleceed",
    title: "Eleceed",
    altTitles: ["일렉시드"],
    type: "manhwa",
    status: "ongoing",
    genres: ["Aksi", "Komedi", "Fantasi"],
    synopsis:
      "Jiwoo, remaja berhati baik dengan refleks secepat kucing, diam-diam menolong orang dengan kekuatannya. Hidupnya berubah saat ia bertemu Kayden, agen rahasia yang terjebak di tubuh kucing gemuk.",
    year: 2018,
    author: "Son Jeho",
    updatedAt: "2026-10-26",
    popular: true,
    links: [
      WEBTOON_ID("fantasy/eleceed/list?title_no=2034"),
      WEBTOON_EN("action/eleceed/list?title_no=1571"),
    ],
  },
  {
    id: "omniscient-reader",
    slug: "omniscient-reader",
    title: "Omniscient Reader",
    altTitles: ["Omniscient Reader's Viewpoint", "전지적 독자 시점"],
    type: "manhwa",
    status: "ongoing",
    genres: ["Fantasi", "Aksi", "Thriller"],
    synopsis:
      "Dokja adalah satu-satunya orang yang menamatkan novel apokaliptik favoritnya. Saat novel itu menjadi kenyataan, pengetahuannya tentang jalan cerita adalah satu-satunya senjata untuk bertahan hidup.",
    year: 2020,
    author: "singNsong",
    episodes: 314,
    updatedAt: "2026-11-24",
    popular: true,
    links: [
      WEBTOON_ID("fantasy/omniscient-reader/list?title_no=2109"),
      WEBTOON_EN("action/omniscient-reader/list?title_no=2154"),
    ],
  },
  {
    id: "weak-hero",
    slug: "weak-hero",
    title: "Weak Hero",
    altTitles: ["약한영웅"],
    type: "manhwa",
    status: "completed",
    genres: ["Aksi", "Drama", "Sekolah"],
    synopsis:
      "Gray Yeon, murid baru bertubuh kecil, ternyata petarung yang dingin dan penuh perhitungan. Satu per satu, para perundung terkuat di sekolah harus berhadapan dengannya.",
    year: 2018,
    author: "Seopass",
    updatedAt: "2023-11-04",
    links: [WEBTOON_EN("action/weakhero/list?title_no=1726")],
  },
  {
    id: "the-boxer",
    slug: "the-boxer",
    title: "The Boxer",
    altTitles: ["더 복서"],
    type: "manhwa",
    status: "completed",
    genres: ["Olahraga", "Drama"],
    synopsis:
      "Yu, pemuda tanpa emosi yang hidupnya hampa, ditemukan oleh pelatih tinju legendaris. Di atas ring, ia menemukan sesuatu yang selama ini tak pernah ia rasakan.",
    year: 2019,
    author: "JH",
    links: [WEBTOON_EN("sports/the-boxer/list?title_no=2027")],
  },
  {
    id: "true-beauty",
    slug: "true-beauty",
    title: "True Beauty",
    altTitles: ["여신강림"],
    type: "manhwa",
    status: "completed",
    genres: ["Romansa", "Drama", "Sekolah"],
    synopsis:
      "Jugyeong menguasai seni makeup dari video online dan berubah menjadi gadis tercantik di sekolah. Tapi rahasia wajah aslinya — dan cowok yang mengetahuinya — terus menghantuinya.",
    year: 2018,
    author: "Yaongyi",
    popular: true,
    links: [
      WEBTOON_ID("drama/goddess/list?title_no=1392"),
      WEBTOON_EN("romance/truebeauty/list?title_no=1436"),
    ],
  },
  {
    id: "the-god-of-high-school",
    slug: "the-god-of-high-school",
    title: "The God of High School",
    altTitles: ["갓 오브 하이스쿨"],
    type: "manhwa",
    status: "completed",
    genres: ["Aksi", "Fantasi", "Bela Diri"],
    synopsis:
      "Mori Jin mengikuti turnamen bela diri antar-SMA yang menjanjikan apa pun bagi pemenangnya. Di balik turnamen itu, tersembunyi rencana yang jauh lebih besar dari yang ia bayangkan.",
    year: 2011,
    author: "Yongje Park",
    popular: true,
    links: [WEBTOON_EN("action/the-god-of-high-school/list?title_no=66")],
  },
  {
    id: "sweet-home",
    slug: "sweet-home",
    title: "Sweet Home",
    altTitles: ["스위트홈"],
    type: "manhwa",
    status: "completed",
    genres: ["Horor", "Thriller", "Supernatural"],
    synopsis:
      "Setelah kehilangan keluarganya, Cha Hyun-su pindah ke apartemen kumuh Green Home. Saat manusia berubah menjadi monster sesuai hasrat terdalam mereka, ia harus bertahan — meski tubuhnya sendiri mulai berubah.",
    year: 2017,
    author: "Carnby Kim",
    links: [WEBTOON_EN("thriller/sweethome/list?title_no=1285")],
  },
  {
    id: "unordinary",
    slug: "unordinary",
    title: "unOrdinary",
    type: "manhwa",
    status: "ongoing",
    genres: ["Superhero", "Drama", "Sekolah"],
    synopsis:
      "Di sekolah tempat para elit berkekuatan super berkuasa, John hanyalah remaja biasa tanpa kemampuan. Tapi masa lalunya menyimpan rahasia yang bisa mengguncang seluruh tatanan sekolah.",
    year: 2016,
    author: "uru-chan",
    links: [WEBTOON_EN("super-hero/unordinary/list?title_no=679")],
  },
  {
    id: "the-greatest-estate-developer",
    slug: "the-greatest-estate-developer",
    title: "The Greatest Estate Developer",
    altTitles: ["최고의 부동산 개발자"],
    type: "manhwa",
    status: "completed",
    genres: ["Fantasi", "Komedi", "Isekai"],
    synopsis:
      "Mahasiswa teknik sipil Suho Kim terbangun di tubuh Lloyd Frontera, bangsawan pemalas yang keluarganya terlilit utang. Berbekal ilmu teknik modern, ia bertekad membangun kembali wilayahnya.",
    year: 2021,
    author: "Moon Backgyeong",
    links: [WEBTOON_EN("fantasy/the-greatest-estate-developer/list?title_no=3596")],
  },
  {
    id: "return-of-the-blossoming-blade",
    slug: "return-of-the-blossoming-blade",
    title: "Return of the Blossoming Blade",
    altTitles: ["Return of the Mount Hua Sect", "화산귀환"],
    type: "manhwa",
    status: "ongoing",
    genres: ["Aksi", "Fantasi", "Bela Diri"],
    synopsis:
      "Cheongmyeong, pendekar Sekte Bunga Plum, tewas mengalahkan pemimpin Kultus Iblis — lalu terbangun seratus tahun kemudian. Sektenya kini tinggal bayang-bayang, dan ia bersumpah mengembalikan kejayaannya.",
    year: 2021,
    author: "Biga",
    episodes: 190,
    updatedAt: "2026-11-24",
    links: [WEBTOON_EN("action/return-of-the-blossoming-blade/list?title_no=2849")],
  },
  {
    id: "villain-to-kill",
    slug: "villain-to-kill",
    title: "Villain to Kill",
    altTitles: ["빌런 투 킬"],
    type: "manhwa",
    status: "ongoing",
    genres: ["Aksi", "Superhero", "Fantasi"],
    synopsis:
      "Cassian, psyker berhati baik, tiba-tiba terbangun di tubuh seorang pelajar SMA yang baru saja menjadi villain. Kini ia harus bertahan di dunia penjahat tanpa kehilangan rasa keadilannya.",
    year: 2021,
    author: "Fupin",
    episodes: 257,
    updatedAt: "2026-11-23",
    links: [WEBTOON_EN("action/villain-to-kill/list?title_no=2857")],
  },
  {
    id: "your-throne",
    slug: "your-throne",
    title: "Your Throne",
    altTitles: ["그녀의 심장"],
    type: "manhwa",
    status: "ongoing",
    genres: ["Fantasi", "Romansa", "Drama"],
    synopsis:
      "Medea Solon kehilangan posisinya di sisi Putra Mahkota Eros. Demi merebut kembali takhtanya, ia rela melakukan apa pun — termasuk bertukar tubuh dengan rivalnya.",
    year: 2020,
    author: "SAM",
    links: [WEBTOON_EN("fantasy/your-throne/list?title_no=2009")],
  },
  {
    id: "the-remarried-empress",
    slug: "the-remarried-empress",
    title: "The Remarried Empress",
    altTitles: ["재혼 황후"],
    type: "manhwa",
    status: "completed",
    genres: ["Fantasi", "Romansa", "Drama"],
    synopsis:
      "Permaisuri Navier yang sempurna diceraikan suaminya demi selirnya. Jawabannya: menerima perceraian itu — dan menikah lagi dengan kaisar lain, sambil tetap menyandang gelarnya.",
    year: 2019,
    author: "Alphatart",
    links: [WEBTOON_EN("fantasy/the-remarried-empress/list?title_no=2135")],
  },
  {
    id: "lore-olympus",
    slug: "lore-olympus",
    title: "Lore Olympus",
    type: "manhwa",
    status: "completed",
    genres: ["Fantasi", "Romansa", "Mitologi"],
    synopsis:
      "Persephone, dewi musim semi yang polos, bertemu Hades, raja dunia bawah yang disalahpahami. Di antara pesta, gosip, dan intrik para dewa, kisah cinta terlarang mereka pun dimulai.",
    year: 2018,
    author: "Rachel Smythe",
    popular: true,
    links: [WEBTOON_EN("romance/lore-olympus/list?title_no=1320")],
  },
  {
    id: "nano-machine",
    slug: "nano-machine",
    title: "Nano Machine",
    altTitles: ["나노마신"],
    type: "manhwa",
    status: "ongoing",
    genres: ["Aksi", "Fantasi", "Sci-Fi"],
    synopsis:
      "Setelah nyawanya diselamatkan oleh keturunannya dari masa depan, Cheon Yeo-Woon menerima mesin nano di tubuhnya. Dengan kekuatan itu, ia menantang tatanan Kultus Iblis yang menguasainya.",
    year: 2021,
    author: "Hanjung Wolya",
    links: [WEBTOON_EN("action/nano-machine/list?title_no=4344")],
  },
  {
    id: "i-love-yoo",
    slug: "i-love-yoo",
    title: "I Love Yoo",
    type: "manhwa",
    status: "ongoing",
    genres: ["Drama", "Romansa", "Slice of Life"],
    synopsis:
      "Shin-Ae yang anti-sosial dan membenci romansa tanpa sengaja merusak baju orang asing. Pertemuan itu menyeretnya ke dalam kehidupan dua bersaudara kaya yang mengubah dunianya.",
    year: 2017,
    author: "Quimchee",
    links: [WEBTOON_EN("drama/i-love-yoo/list?title_no=986")],
  },
  {
    id: "cursed-princess-club",
    slug: "cursed-princess-club",
    title: "Cursed Princess Club",
    type: "manhwa",
    status: "completed",
    genres: ["Komedi", "Fantasi", "Romansa"],
    synopsis:
      "Gwendolyn, putri yang tidak secantik dongeng, tersesat ke dunia Klub Putri Terkutuk. Di sana ia belajar bahwa menjadi putri tidak harus mengikuti cetakan yang sama.",
    year: 2019,
    author: "LambCat",
    links: [WEBTOON_EN("comedy/cursed-princess-club/list?title_no=1537")],
  },
  {
    id: "sirens-lament",
    slug: "sirens-lament",
    title: "Siren's Lament",
    type: "manhwa",
    status: "completed",
    genres: ["Romansa", "Fantasi", "Supernatural"],
    synopsis:
      "Lyra, gadis biasa yang pemalu, tanpa sengaja jatuh ke dunia para siren. Terjerat kutukan, ia menemukan bahwa dunianya jauh lebih besar — dan lebih berbahaya — dari yang ia kira.",
    year: 2016,
    author: "instantmiso",
    links: [WEBTOON_EN("romance/sirens-lament/list?title_no=632")],
  },
  {
    id: "the-advanced-player-of-the-tutorial-tower",
    slug: "the-advanced-player-of-the-tutorial-tower",
    title: "The Advanced Player of the Tutorial Tower",
    type: "manhwa",
    status: "completed",
    genres: ["Aksi", "Fantasi"],
    synopsis:
      "Setelah 12 tahun terjebak di menara penuh monster, Hyeonu Kim akhirnya bebas — jauh lebih kuat dari siapa pun di Bumi. Kini ia memburu dalang di balik penjaranya.",
    year: 2020,
    links: [WEBTOON_EN("action/the-advanced-player-of-the-tutorial-tower/list?title_no=2409")],
  },
  {
    id: "down-to-earth",
    slug: "down-to-earth",
    title: "Down to Earth",
    type: "manhwa",
    status: "ongoing",
    genres: ["Romansa", "Komedi", "Sci-Fi"],
    synopsis:
      "Kade menjalani hidup sendirian yang tenang sampai seorang gadis alien jatuh di halaman belakangnya. Dengan membukakan rumahnya, tanpa sadar ia juga membuka hatinya.",
    year: 2018,
    links: [WEBTOON_EN("romance/down-to-earth/list?title_no=1817")],
  },
  {
    id: "solo-leveling",
    slug: "solo-leveling",
    title: "Solo Leveling",
    altTitles: ["나 혼자만 레벨업"],
    type: "manhwa",
    status: "completed",
    genres: ["Aksi", "Fantasi", "Petualangan"],
    synopsis:
      "Sung Jinwoo, hunter peringkat E terlemah, nyaris tewas di dungeon — lalu sebuah 'System' misterius memilihnya sebagai satu-satunya pemain. Dari titik terendah, ia mulai naik level tanpa batas.",
    year: 2018,
    author: "Chugong",
    popular: true,
    links: [
      {
        platform: "Tappytoon",
        url: "https://www.tappytoon.com/book/187",
        language: "en",
        access: "freemium",
        note: "Episode 0–3 gratis, sisanya berbayar",
      },
    ],
  },
  {
    id: "lout-of-counts-family",
    slug: "lout-of-counts-family",
    title: "Lout of Count's Family",
    altTitles: ["백작가의 망나니가 되었다"],
    type: "manhwa",
    status: "hiatus",
    genres: ["Fantasi", "Komedi", "Petualangan"],
    synopsis:
      "Kim Roksu terbangun sebagai Cale Henituse, villain kecil dalam novel 'Birth of a Hero'. Berbekal ingatannya tentang jalan cerita, ia berusaha hidup mewah dan santai — tanpa dipukuli sang hero.",
    year: 2019,
    author: "Yu Ryeo Han",
    links: [
      {
        platform: "Tappytoon",
        url: "https://www.tappytoon.com/en/comics/lout-of-counts-family",
        language: "en",
        access: "freemium",
        note: "Gratis sebagian, sisanya berbayar",
      },
    ],
  },
  {
    id: "teenage-mercenary",
    slug: "teenage-mercenary",
    title: "Teenage Mercenary",
    altTitles: ["Mercenary Enrollment"],
    type: "manhwa",
    status: "hiatus",
    genres: ["Aksi", "Thriller", "Drama"],
    synopsis:
      "Setelah delapan tahun menjadi tentara bayaran, Yu Ijin pulang ke Korea dan mencoba hidup normal sebagai siswa SMA. Tapi masa lalunya — dan orang-orang yang mengincarnya — tidak mau melepaskannya begitu saja.",
    year: 2020,
    author: "YC",
    episodes: 277,
    updatedAt: "2026-06-23",
    popular: true,
    links: [WEBTOON_EN("action/teenage-mercenary/list?title_no=2677")],
  },
  {
    id: "unholy-blood",
    slug: "unholy-blood",
    title: "Unholy Blood",
    altTitles: ["언홀리 블러드"],
    type: "manhwa",
    status: "completed",
    genres: ["Aksi", "Supernatural", "Fantasi"],
    synopsis:
      "Hayun mewarisi darah vampir murni, dan itu membuatnya diburu. Demi melindungi orang-orang yang ia sayangi, ia belajar mengendalikan kekuatan yang selama ini ia takuti.",
    year: 2020,
    author: "Lina Im",
    episodes: 13,
    updatedAt: "2020-11-22",
    links: [WEBTOON_EN("supernatural/unholy-blood/list?title_no=1262")],
  },
  {
    id: "jungle-juice",
    slug: "jungle-juice",
    title: "Jungle Juice",
    altTitles: ["정글쥬스"],
    type: "manhwa",
    status: "ongoing",
    genres: ["Aksi", "Fantasi", "Sekolah"],
    synopsis:
      "Setelah digigit serangga aneh, Jang Suchan mendapati tubuhnya berubah — ia bisa menumbuhkan sayap serangga. Kini ia terseret ke dunia rahasia para manusia serangga yang saling bertarung.",
    year: 2020,
    author: "Hyeong Eun",
    episodes: 228,
    updatedAt: "2026-11-24",
    popular: true,
    links: [
      WEBTOON_ID("action/jungle-juice/list?title_no=2669"),
      WEBTOON_EN("action/jungle-juice/list?title_no=2480"),
    ],
  },
  {
    id: "study-group",
    slug: "study-group",
    title: "Study Group",
    altTitles: ["스터디그룹"],
    type: "manhwa",
    status: "ongoing",
    genres: ["Aksi", "Komedi", "Sekolah"],
    synopsis:
      "Gamin Yoon bercita-cita masuk universitas, tapi ia terjebak di sekolah terburuk yang penuh preman. Satu-satunya jalan: membentuk kelompok belajar — dan mempertahankannya dengan tinju.",
    year: 2019,
    author: "Shin Hyungwook",
    episodes: 265,
    updatedAt: "2026-11-21",
    popular: true,
    links: [
      WEBTOON_ID("action/studygroup/list?title_no=1583"),
      WEBTOON_EN("action/study-group/list?title_no=3595"),
    ],
  },
  {
    id: "manager-kim",
    slug: "manager-kim",
    title: "Manager Kim",
    altTitles: ["김부장"],
    type: "manhwa",
    status: "ongoing",
    genres: ["Aksi", "Drama"],
    synopsis:
      "Kim, mantan agen rahasia yang kini bekerja kantoran, hidup tenang sampai putrinya diculik. Demi menyelamatkannya, ia kembali memakai semua kemampuan lamanya.",
    year: 2022,
    author: "Taejun Pak",
    episodes: 252,
    updatedAt: "2026-11-20",
    links: [WEBTOON_EN("action/manager-kim/list?title_no=3917")],
  },
  {
    id: "tomb-raider-king",
    slug: "tomb-raider-king",
    title: "Tomb Raider King",
    altTitles: ["도굴왕"],
    type: "manhwa",
    status: "completed",
    genres: ["Aksi", "Fantasi", "Petualangan"],
    synopsis:
      "Jooheon dikhianati timnya dan mati — lalu terbangun sepuluh tahun di masa lalu, tepat sebelum makam-makam kuno bermunculan. Kali ini, ia yang akan menguasai semua reliknya.",
    year: 2021,
    author: "Sanji Jiksong",
    episodes: 34,
    updatedAt: "2026-07-09",
    links: [
      WEBTOON_ID("fantasy/tomb-raider-king/list?title_no=10178"),
      WEBTOON_EN("action/tomb-raider-king/list?title_no=10204"),
    ],
  },
  {
    id: "the-horizon",
    slug: "the-horizon",
    title: "The Horizon",
    type: "manhwa",
    status: "completed",
    genres: ["Drama", "Thriller"],
    synopsis:
      "Di dunia yang telah hancur oleh perang, seorang bocah lelaki dan seorang gadis berjalan tanpa tujuan melewati kota-kota mati. Sebuah kisah sunyi tentang bertahan hidup dan harapan.",
    year: 2016,
    author: "JH",
    episodes: 2,
    updatedAt: "2021-08-28",
    links: [WEBTOON_EN("drama/the-horizon/list?title_no=3141")],
  },
  {
    id: "the-gamer",
    slug: "the-gamer",
    title: "The Gamer",
    altTitles: ["더 게이머"],
    type: "manhwa",
    status: "completed",
    genres: ["Aksi", "Fantasi", "Petualangan"],
    synopsis:
      "Jihan Han tiba-tiba bisa melihat dunia seperti video game: ada level, status, dan quest. Dengan kemampuan itu, ia masuk ke dunia tersembunyi para 'pemain' lain.",
    year: 2013,
    author: "Sung Sang-Young",
    episodes: 9,
    updatedAt: "2014-08-01",
    links: [
      WEBTOON_ID("fantasy/the-gamer/list?title_no=495"),
      WEBTOON_EN("action/the-gamer/list?title_no=88"),
    ],
  },
  {
    id: "dice",
    slug: "dice",
    title: "Dice",
    altTitles: ["DICE"],
    type: "manhwa",
    status: "completed",
    genres: ["Fantasi", "Drama", "Thriller"],
    synopsis:
      "Dongtae, remaja yang selalu diremehkan, menemukan sebuah dadu misterius yang bisa mengubah penampilannya — dan hidupnya. Tapi setiap lemparan punya harga.",
    year: 2013,
    author: "Yunhyunseok",
    episodes: 17,
    updatedAt: "2014-09-24",
    links: [
      WEBTOON_ID("fantasy/dice/list?title_no=440"),
      WEBTOON_EN("fantasy/dice/list?title_no=64"),
    ],
  },
  {
    id: "the-lone-necromancer",
    slug: "the-lone-necromancer",
    title: "The Lone Necromancer",
    altTitles: ["나 혼자 네크로맨서"],
    type: "manhwa",
    status: "completed",
    genres: ["Aksi", "Fantasi"],
    synopsis:
      "Seongwoo terbangun di dunia yang dikuasai monster, dengan satu kemampuan: memanggil prajurit kerangka. Sendirian, ia membangun pasukan dari kematian itu sendiri.",
    year: 2021,
    episodes: 7,
    updatedAt: "2022-01-22",
    links: [
      WEBTOON_ID("fantasy/lone-necromancer/list?title_no=3619"),
      WEBTOON_EN("fantasy/the-lone-necromancer/list?title_no=3690"),
    ],
  },
  {
    id: "im-the-max-level-newbie",
    slug: "im-the-max-level-newbie",
    title: "I'm the Max-Level Newbie",
    altTitles: ["Solo Max-Level Newbie", "만렙 뉴비"],
    type: "manhwa",
    status: "hiatus",
    genres: ["Aksi", "Fantasi", "Komedi"],
    synopsis:
      "Kang Jinhyeok, satu-satunya pemain yang menamatkan game mustahil 'Tower of Trials', tiba-tiba masuk ke dalam game itu sendiri — dengan semua kekuatan level maksimalnya.",
    year: 2022,
    episodes: 4,
    updatedAt: "2022-02-25",
    links: [
      WEBTOON_ID("fantasy/max-level-newbie/list?title_no=3375"),
      WEBTOON_EN("action/im-the-max-level-newbie/list?title_no=3915"),
    ],
  },
  {
    id: "return-to-player",
    slug: "return-to-player",
    title: "Return to Player",
    type: "manhwa",
    status: "completed",
    genres: ["Aksi", "Fantasi", "Petualangan"],
    synopsis:
      "Setelah 10.000 tahun terjebak di dunia lain, Dae-Ho kembali ke Bumi sebagai pemain terkuat. Tapi dunia yang ia tinggalkan sudah berubah — dan para dewa belum selesai dengannya.",
    year: 2020,
    episodes: 7,
    updatedAt: "2021-05-07",
    links: [
      WEBTOON_ID("fantasy/return-to-player/list?title_no=2543"),
      WEBTOON_EN("action/return-to-player/list?title_no=2574"),
    ],
  },
  {
    id: "hardcore-leveling-warrior",
    slug: "hardcore-leveling-warrior",
    title: "Hardcore Leveling Warrior",
    altTitles: ["하드코어 레벨링 워리어"],
    type: "manhwa",
    status: "completed",
    genres: ["Aksi", "Fantasi", "Komedi"],
    synopsis:
      "Ethan, peringkat satu game Lucid Adventure, kehilangan segalanya dalam sehari. Demi merebut kembali posisinya, ia memulai dari nol dengan cara yang paling nekat.",
    year: 2017,
    author: "Kim Sehoon",
    episodes: 14,
    updatedAt: "2017-12-15",
    links: [WEBTOON_EN("action/hardcore-leveling-warrior/list?title_no=1221")],
  },
  {
    id: "seasons-of-blossom",
    slug: "seasons-of-blossom",
    title: "Seasons of Blossom",
    altTitles: ["청춘 블라썸"],
    type: "manhwa",
    status: "completed",
    genres: ["Romansa", "Drama", "Sekolah"],
    synopsis:
      "Empat musim, empat kisah cinta remaja yang saling terhubung — tentang patah hati, persahabatan, dan tumbuh dewasa di masa SMA.",
    year: 2020,
    author: "HONGDUCK",
    episodes: 9,
    updatedAt: "2021-04-12",
    links: [
      WEBTOON_ID("romance/youth-blossom/list?title_no=2363"),
      WEBTOON_EN("romance/seasonsofblossom/list?title_no=2509"),
    ],
  },
];

export function getTitleBySlug(slug: string): Title | undefined {
  return TITLES.find((t) => t.slug === slug);
}

export function getAllGenres(): string[] {
  const set = new Set<string>();
  for (const t of TITLES) for (const g of t.genres) set.add(g);
  return [...set].sort((a, b) => a.localeCompare(b, "id"));
}

export function getPopularTitles(): Title[] {
  return TITLES.filter((t) => t.popular);
}

export function getRecentlyUpdated(limit = 6): Title[] {
  return TITLES.filter((t) => t.updatedAt)
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
    .slice(0, limit);
}

export function getRelatedTitles(title: Title, limit = 4): Title[] {
  return TITLES.filter(
    (t) => t.slug !== title.slug && t.genres.some((g) => title.genres.includes(g)),
  ).slice(0, limit);
}

export const STATUS_LABEL: Record<TitleStatus, string> = {
  ongoing: "Ongoing",
  completed: "Tamat",
  hiatus: "Hiatus",
};

export const LANGUAGE_LABEL: Record<LinkLanguage, string> = {
  id: "Indonesia",
  en: "Inggris",
  ko: "Korea",
};

export const ACCESS_LABEL: Record<AccessType, string> = {
  free: "Gratis",
  freemium: "Gratis sebagian",
  subscription: "Langganan",
  purchase: "Beli",
};
