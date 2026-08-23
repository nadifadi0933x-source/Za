const bcrypt = require('bcrypt');
const db = require('../config/database');
const { USER_ROLES } = require('../config/constants');

const seedData = async () => {
  try {
    console.log('Seeding database...');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const adminInsert = db.prepare(`
      INSERT OR IGNORE INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);
    adminInsert.run('admin', 'admin@example.com', adminPassword, USER_ROLES.ADMIN);

    const userInsert = db.prepare(`
      INSERT OR IGNORE INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);
    userInsert.run('user1', 'user1@example.com', userPassword, USER_ROLES.USER);
    userInsert.run('user2', 'user2@example.com', userPassword, USER_ROLES.USER);

    const tagInsert = db.prepare(`
      INSERT OR IGNORE INTO tags (name, color)
      VALUES (?, ?)
    `);

    const tags = [
      ['اکشن', '#EF4444'],
      ['ماجراجویی', '#F59E0B'],
      ['کمدی', '#10B981'],
      ['درام', '#3B82F6'],
      ['فانتزی', '#8B5CF6'],
      ['علمی تخیلی', '#06B6D4'],
      ['رمانتیک', '#EC4899'],
      ['ترسناک', '#1F2937'],
      ['رازآلود', '#6366F1'],
      ['ورزشی', '#84CC16'],
    ];

    for (const [name, color] of tags) {
      tagInsert.run(name, color);
    }

    const animeInsert = db.prepare(`
      INSERT OR IGNORE INTO anime (title, title_farsi, description, description_farsi, studio, status, rating, release_year, episodes_count, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const animeList = [
      [
        'Attack on Titan',
        'حمله به تایتان',
        'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
        'پس از نابودی شهر بومی خود و کشته شدن مادرش، rian کوچک اِرن ییگر سوگند می‌خورد که تایتان‌های غول‌پیکر انسان‌شکل را که بشریت را به لبه انقراض رسانده‌اند، از روی زمین پاک کند.',
        'Wit Studio / MAPPA',
        'completed',
        9.0,
        2013,
        87,
        'اکشن,ماجراجویی,درام,فانتزی',
      ],
      [
        'Demon Slayer',
        'قاتل ارواح',
        'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.',
        'خانواده‌ای توسط ارواح حمله می‌شود و فقط دو عضو آن زنده می‌مانند - تانجیرو و خواهرش نزuko که به تدریج به ارواح تبدیل می‌شود. تانجیرو برای انتقام گرفتن از خانواده و درمان خواهرش به دنبال تبدیل شدن به قاتل ارواح می‌رود.',
        'ufotable',
        'ongoing',
        8.7,
        2019,
        55,
        'اکشن,ماجراجویی,فانتزی',
      ],
      [
        'Jujutsu Kaisen',
        'جوجوتسو کایسن',
        'Yuji Itadori is a boy with tremendous physical strength, though he lives a completely ordinary high school life. One day, to save his friends who were attacked by curses, he eats the finger of Ryomen Sukuna.',
        'یوجی ای tadori پسر با قدرت فیزیکی فوق‌العاده است، هرچند زندگی کاملاً عادی مدرسه متوسطه دارد. یک روز برای نجات دوستانش که توسط نفرات جنونی حمله شده‌اند، انگشت ریومن سوکونا را می‌خورد.',
        'MAPPA',
        'ongoing',
        8.6,
        2020,
        47,
        'اکشن,فانتزی,ماجراجویی',
      ],
      [
        'One Piece',
        'وان پیس',
        'Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger. The famous mystery treasure named One Piece.',
        'ماجراهای مانی دی لوفی و گروه دزدان دریایی او را دنبال می‌کند تا بزرگترین گنجی که تا به حال توسط دزدان دریایی افسانه‌ای، گلد راجر به جا گذاشته شده است، پیدا کنند.',
        'Toei Animation',
        'ongoing',
        8.9,
        1999,
        1100,
        'اکشن,ماجراجویی,کمدی,کمدی',
      ],
      [
        'Death Note',
        'نت مرگ',
        'An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone whose name is written into it.',
        'یک دانش‌آموز باهوش مدرسه متوسطه بعد از کشاف یک دفترچه که می‌تواند هر کسی را که نامش در آن نوشته می‌شود به قتل برساند، به یک جنگ مخفی برای از بین بردن جنایتکاران از دنیا می‌رود.',
        'Madhouse',
        'completed',
        9.0,
        2006,
        37,
        'رازآلود,اکشن,فانتزی',
      ],
    ];

    for (const anime of animeList) {
      animeInsert.run(anime);
    }

    const mangaInsert = db.prepare(`
      INSERT OR IGNORE INTO manga (title, title_farsi, description, description_farsi, status, rating, author, artist, release_year, chapters_count, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const mangaList = [
      [
        'Berserk',
        'برسرک',
        'Guts, a former mercenary now known as the Black Swordsman, is out for revenge. After a tumultuous childhood, he finally finds someone he respects and believes he can trust, only to have everything taken from him.',
        'گاتس، یک سرباز پیشین که اکنون به عنوان شمشیردان سیاه شناخته می‌شود، برای انتقام‌جویی است. پس از کودکی پرآشوب، سرانجام کسی را پیدا می‌کند که به او احترام می‌گذارد و believes می‌کند می‌تواند به او اعتماد کند، و تنها چیزی که از او گرفته می‌شود همه چیز است.',
        'ongoing',
        9.5,
 'Kentaro Miura',
        'Kentaro Miura',
        1989,
        364,
        'اکشن,ماجراجویی,فانتزی,درام',
      ],
      [
        'Vagabond',
        'ولگرد',
        'Shinmen Takezō has been shunned by his local villagers for his violence and fame as a fighter. So he decides to leave the village and travel around the world.',
        'شیمن تاکزو به دلیل خشونت و شهرت به عنوان Fighter توسط روستاییان محلی خود طرد شده است. بنابراین تصمیم می‌گیرد از روستا دوری کند و دور دنیا سفر کند.',
        'ongoing',
        9.4,
 'Takehiko Inoue',
        'Takehiko Inoue',
        1993,
        327,
        'اکشن,ماجراجویی,درام',
      ],
      [
        'Monster',
        'هیولا',
        'Dr. Kenzo Tenma is a renowned surgeon who gets into trouble with the law after saving the life of a young boy instead of the mayor.',
        'دکتر کنزو تنما یک جراح مشهور است که بعد از نجات زندگی یک پسر بجای شهردار، با قانون مشکل پیدا می‌کند.',
        'completed',
        9.1,
 'Naoki Urasawa',
        'Naoki Urasawa',
        1994,
        162,
        'رازآلود,درام,اکشن',
      ],
    ];

    for (const manga of mangaList) {
      mangaInsert.run(manga);
    }

    const manhwaInsert = db.prepare(`
      INSERT OR IGNORE INTO manhwa (title, title_farsi, description, description_farsi, status, rating, author, artist, release_year, chapters_count, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const manhwaList = [
      [
        'Solo Leveling',
        'لولینگ تنها',
        'In a world where hunters with various magical abilities must battle deadly monsters to protect humanity, Sung Jinwoo, a notoriously weak hunter, finds himself in a constant struggle for survival.',
        'در جهانی که shoma با 다양한 abilities جادویی باید موجودات کشنده را برای محافظت از بشریت نبرد کنند، سونگ جینوو، یک shoma notorious ضعیف، خود را در یک مبارزه دائمی برای بقا می‌بیند.',
        'completed',
        9.2,
 'Chugong',
        'Jang Sung-rak',
        2018,
        179,
        'اکشن,ماجراجویی,فانتزی',
      ],
      [
        'Omniscient Reader',
        'خواننده همه‌چیزداند',
        'Dokja Kim was an ordinary office worker who had been reading the web novel "Three Ways to Survive in a Ruined World" for over ten years. But when the novel's story became reality, he was the only one who knew how the world would end.',
        'دوجا کیم یک کارمند عادی بود که بیش از ده سال داستان وب "سه راه برای بقا در دنیای نابود شده" را می‌خواند. اما وقتی داستان novel به واقعیت تبدیل شد، تنها کسی بود که می‌دانست دنیا چگونه به پایان می‌رسد.',
        'ongoing',
        9.0,
 'Sing-Shong',
        'UMI',
        2020,
        123,
        'اکشن,ماجراجویی,فانتزی,علمی تخیلی',
      ],
      [
        'The Beginning After the End',
        'شروع پس از پایان',
        'King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. However, solitude lingers closely behind those with great power.',
        'پادشاه گریر قدرت، ثروت و موقعیت بی‌نظیری در جهانی که توسط ability رزمی اداره می‌شود دارد. با این حال، تنهایی نزدیکاً از پشت آنهایی با قدرت زیاد دنبال می‌کند.',
        'ongoing',
        9.1,
 'TurtleMe',
        'TurtleMe',
        2018,
        157,
        'فانتزی,ماجراجویی,اکشن,درام',
      ],
    ];

    for (const manhwa of manhwaList) {
      manhwaInsert.run(manhwa);
    }

    const episodeInsert = db.prepare(`
      INSERT OR IGNORE INTO episodes (anime_id, episode_number, title, title_farsi, description, description_farsi, duration)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const episodeData = [
      [1, 1, 'To You, 2000 Years in the Future', 'به تو، 2000 سال در آینده', 'The story begins with Eren Yeager witnessing his mother being eaten by a Titan.', 'داستان باseeing مادر اِرن ییگر توسط یک تایتان شروع می‌شود.', 24],
      [1, 2, 'That Day', 'آن روز', 'After the fall of Wall Maria, Eren and Mikasa are left orphaned.', 'پس از سقوط دیوار ماریا، اِرن و میکاسا یتیم می‌مانند.', 24],
      [3, 1, 'Ryomen Sukuna', 'ریومن سوکونا', 'Yuji Itadori joins the Jujutsu Sorcerers after becoming the vessel for Sukuna.', 'یوجی ای tadori بعد از تبدیل شدن به ظرف سوکونا به جوجوتسو سورسرها می‌پیوندد.', 24],
      [3, 2, 'For Myself', 'برای خودم', 'Gojo explains the situation to Yuji and introduces him to the world of jujutsu.', 'گوگو وضعیت را به یوجی توضیح می‌دهد و او را به دنیای جوجوتسو معرفی می‌کند.', 24],
      [4, 1, "I'm Luffy! The Man Who's Gonna Be King of the Pirates!", 'من لوفی هستم! مردی که می‌خواهد پادشاه دزدان دریایی شود!', 'Monkey D. Luffy sets out to sea to find the One Piece and become the Pirate King.', 'مانی دی لوفی به دریا می‌رود تا وان پیس را پیدا کند و پادشاه دزدان دریایی شود.', 24],
    ];

    for (const ep of episodeData) {
      episodeInsert.run(ep);
    }

    const chapterInsert = db.prepare(`
      INSERT OR IGNORE INTO chapters (content_type, content_id, chapter_number, title, title_farsi, pages)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const mangaChapters = [
      ['manga', 1, 1, 'The Black Swordsman', 'شمشیردان سیاه', 50],
      ['manga', 1, 2, 'The Branded', 'برند شده', 50],
      ['manga', 1, 3, 'The Golden Age', 'عصر طلایی', 50],
      ['manhwa', 1, 1, "I'm Used to It", 'من به آن عادت کرده‌ام', 70],
      ['manhwa', 1, 2, 'If I Hadn\'t Met Him', 'اگر با او ملاقات نمی‌کردم', 70],
      ['manhwa', 2, 1, 'The Reader', 'خواننده', 60],
      ['manhwa', 2, 2, 'Start of the Apocalypse', 'شروع قیامت', 60],
    ];

    for (const ch of mangaChapters) {
      chapterInsert.run(ch);
    }

    const reviewInsert = db.prepare(`
      INSERT OR IGNORE INTO reviews (user_id, content_type, content_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `);

    reviewInsert.run(2, 'anime', 1, 9, ' یکی از بهترین انیمه‌های تاریخ. داستان فوق‌العاده و شخصیت‌پردازی عالی.');
    reviewInsert.run(2, 'anime', 3, 8, 'انیمه‌ای فوق‌العاده با گرافیک بی‌نظیر.');
    reviewInsert.run(3, 'manga', 1, 10, 'بهترین مانگای تاریخ. نقاشی و داستان بی‌نظیر.');
    reviewInsert.run(3, 'manhwa', 1, 9, 'مانهوا فوق‌العاده‌ای با سیستم لولینگ جذاب.');

    const watchlistInsert = db.prepare(`
      INSERT OR IGNORE INTO watchlists (user_id, anime_id, status, current_episode)
      VALUES (?, ?, ?, ?)
    `);

    watchlistInsert.run(2, 1, 'completed', 87);
    watchlistInsert.run(2, 3, 'watching', 23);
    watchlistInsert.run(3, 4, 'watching', 1000);

    const bookmarkInsert = db.prepare(`
      INSERT OR IGNORE INTO bookmarks (user_id, content_type, content_id)
      VALUES (?, ?, ?)
    `);

    bookmarkInsert.run(2, 'anime', 1);
    bookmarkInsert.run(2, 'manga', 1);
    bookmarkInsert.run(2, 'manhwa', 1);
    bookmarkInsert.run(3, 'manhwa', 2);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();