// ملف JavaScript لصفحة عرض الألعاب
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام تخزين الألعاب
    initGamesStorage();
    
    // عرض الألعاب
    displayGames();
    
    // تهيئة أحداث الفلاتر
    initFilters();
    
    // تهيئة أحداث البحث
    initSearch();
    
    // تهيئة أحداث التبديل بين طرق العرض
    initViewToggle();
    
    // تهيئة نظام تخزين الألعاب
    function initGamesStorage() {
        if (!localStorage.getItem('games')) {
            // بيانات الألعاب الافتراضية
            const defaultGames = [
                {
                    id: 1,
                    title: "God of War",
                    titleAr: "إله الحرب",
                    description: "مغامرة ملحمية تتبع رحلة كراتوس وابنه في عالم الآلهة الإسكندنافية.",
                    category: "action",
                    platform: "ps4",
                    region: "usa",
                    language: "arabic",
                    arabicType: "official",
                    size: "45.3 GB",
                    releaseDate: "2018-04-20",
                    developer: "Santa Monica Studio",
                    publisher: "Sony Interactive Entertainment",
                    cover: "images/games/god-of-war.jpg",
                    screenshots: [
                        "images/games/screenshots/gow-1.jpg",
                        "images/games/screenshots/gow-2.jpg",
                        "images/games/screenshots/gow-3.jpg"
                    ],
                    tags: ["action", "adventure", "exclusive", "arabic"],
                    rating: 4.9,
                    downloadLink: "#",
                    trailer: "https://www.youtube.com/watch?v=K0u_kAWLJOA"
                },
                {
                    id: 2,
                    title: "Spider-Man",
                    titleAr: "الرجل العنكبوت",
                    description: "انطلق في مغامرة مثيرة كالرجل العنكبوت لإنقاذ مدينة نيويورك من الأشرار.",
                    category: "action",
                    platform: "ps4",
                    region: "europe",
                    language: "arabic",
                    arabicType: "official",
                    size: "60.2 GB",
                    releaseDate: "2018-09-07",
                    developer: "Insomniac Games",
                    publisher: "Sony Interactive Entertainment",
                    cover: "images/games/spider-man.jpg",
                    screenshots: [
                        "images/games/screenshots/spiderman-1.jpg",
                        "images/games/screenshots/spiderman-2.jpg",
                        "images/games/screenshots/spiderman-3.jpg"
                    ],
                    tags: ["action", "adventure", "exclusive", "arabic"],
                    rating: 4.8,
                    downloadLink: "#",
                    trailer: "https://www.youtube.com/watch?v=q4GdJVvdxss"
                },
                {
                    id: 3,
                    title: "The Last of Us Part II",
                    titleAr: "ذا لاست أوف أس الجزء الثاني",
                    description: "استكشف عالماً ما بعد نهاية العالم في هذه المغامرة المؤثرة والمليئة بالتحديات.",
                    category: "action",
                    platform: "ps4",
                    region: "usa",
                    language: "arabic",
                    arabicType: "official",
                    size: "78.3 GB",
                    releaseDate: "2020-06-19",
                    developer: "Naughty Dog",
                    publisher: "Sony Interactive Entertainment",
                    cover: "images/games/the-last-of-us-2.jpg",
                    screenshots: [
                        "images/games/screenshots/tlou2-1.jpg",
                        "images/games/screenshots/tlou2-2.jpg",
                        "images/games/screenshots/tlou2-3.jpg"
                    ],
                    tags: ["action", "adventure", "exclusive", "arabic"],
                    rating: 4.7,
                    downloadLink: "#",
                    trailer: "https://www.youtube.com/watch?v=II5UsqP2JAk"
                },
                {
                    id: 4,
                    title: "Horizon Zero Dawn",
                    titleAr: "هورايزن زيرو دون",
                    description: "اكتشف عالماً مفتوحاً مليئاً بالآلات الضخمة والمخاطر في هذه المغامرة الملحمية.",
                    category: "rpg",
                    platform: "ps4",
                    region: "europe",
                    language: "arabic",
                    arabicType: "unofficial",
                    size: "50.1 GB",
                    releaseDate: "2017-02-28",
                    developer: "Guerrilla Games",
                    publisher: "Sony Interactive Entertainment",
                    cover: "images/games/horizon-zero-dawn.jpg",
                    screenshots: [
                        "images/games/screenshots/horizon-1.jpg",
                        "images/games/screenshots/horizon-2.jpg",
                        "images/games/screenshots/horizon-3.jpg"
                    ],
                    tags: ["rpg", "adventure", "exclusive", "arabic"],
                    rating: 4.6,
                    downloadLink: "#",
                    trailer: "https://www.youtube.com/watch?v=wzx96gYA8ek"
                },
                {
                    id: 5,
                    title: "Uncharted 4: A Thief's End",
                    titleAr: "أنشارتد 4: نهاية اللص",
                    description: "انضم إلى ناثان دريك في مغامرته الأخيرة للبحث عن كنز القراصنة المفقود.",
                    category: "adventure",
                    platform: "ps4",
                    region: "usa",
                    language: "arabic",
                    arabicType: "official",
                    size: "48.5 GB",
                    releaseDate: "2016-05-10",
                    developer: "Naughty Dog",
                    publisher: "Sony Interactive Entertainment",
                    cover: "images/games/uncharted-4.jpg",
                    screenshots: [
                        "images/games/screenshots/uncharted4-1.jpg",
                        "images/games/screenshots/uncharted4-2.jpg",
                        "images/games/screenshots/uncharted4-3.jpg"
                    ],
                    tags: ["adventure", "action", "exclusive", "arabic"],
                    rating: 4.8,
                    downloadLink: "#",
                    trailer: "https://www.youtube.com/watch?v=hh5HV4iic1Y"
                },
                {
                    id: 6,
                    title: "FIFA 22",
                    titleAr: "فيفا 22",
                    description: "استمتع بأحدث إصدار من سلسلة ألعاب كرة القدم الشهيرة مع تحسينات في الجرافيك واللعب.",
                    category: "sports",
                    platform: "ps4",
                    region: "europe",
                    language: "arabic",
                    arabicType: "official",
                    size: "42.7 GB",
                    releaseDate: "2021-10-01",
                    developer: "EA Sports",
                    publisher: "Electronic Arts",
                    cover: "images/games/fifa-22.jpg",
                    screenshots: [
                        "images/games/screenshots/fifa22-1.jpg",
                        "images/games/screenshots/fifa22-2.jpg",
                        "images/games/screenshots/fifa22-3.jpg"
                    ],
                    tags: ["sports", "multiplayer", "arabic"],
                    rating: 4.3,
                    downloadLink: "#",
                    trailer: "https://www.youtube.com/watch?v=o1igaMv46SY"
                },
                {
                    id: 7,
                    title: "Red Dead Redemption 2",
                    titleAr: "ريد ديد ريدمبشن 2",
                    description: "عش قصة آرثر مورغان في هذه الملحمة الغربية المفتوحة من روكستار جيمز.",
                    category: "action",
                    platform: "ps4",
                    region: "usa",
                    language: "non-arabic",
                    arabicType: "none",
                    size: "105.6 GB",
                    releaseDate: "2018-10-26",
                    developer: "Rockstar Games",
                    publisher: "Rockstar Games",
                    cover: "images/games/red-dead-redemption-2.jpg",
                    screenshots: [
                        "images/games/screenshots/rdr2-1.jpg",
                        "images/games/screenshots/rdr2-2.jpg",
                        "images/games/screenshots/rdr2-3.jpg"
                    ],
                    tags: ["action", "adventure", "openworld"],
                    rating: 4.9,
                    downloadLink: "#",
                    trailer: "https://www.youtube.com/watch?v=eaW0tYpxyp0"
                },
                {
                    id: 8,
                    title: "Ghost of Tsushima",
                    titleAr: "شبح تسوشيما",
                    description: "خض معارك الساموراي في هذه المغامرة المفتوحة المستوحاة من اليابان القديمة.",
                    category: "action",
                    platform: "ps4",
                    region: "japan",
                    language: "arabic",
                    arabicType: "unofficial",
                    size: "55.8 GB",
                    releaseDate: "2020-07-17",
                    developer: "Sucker Punch Productions",
                    publisher: "Sony Interactive Entertainment",
                    cover: "images/games/ghost-of-tsushima.jpg",
                    screenshots: [
                        "images/games/screenshots/ghost-1.jpg",
                        "images/games/screenshots/ghost-2.jpg",
                        "images/games/screenshots/ghost-3.jpg"
                    ],
                    tags: ["action", "adventure", "exclusive", "arabic"],
                    rating: 4.8,
                    downloadLink: "#",
                    trailer: "https://www.youtube.com/watch?v=rTNfgIAi3pY"
                },
                {
                    id: 9,
                    title: "Bloodborne",
                    titleAr: "بلودبورن",
                    description: "واجه مخلوقات مرعبة في هذه اللعبة الصعبة من استوديو فروم سوفتوير.",
                    category: "rpg",
                    platform: "ps4",
                    region: "europe",
                    language: "non-arabic",
                    arabicType: "none",
                    size: "30.2 GB",
                    releaseDate: "2015-03-24",
                    developer: "FromSoftware",
                    publisher: "Sony Interactive Entertainment",
                    cover: "images/games/bloodborne.jpg",
                    screenshots: [
                        "images/games/screenshots/bloodborne-1.jpg",
                        "images/games/screenshots/bloodborne-2.jpg",
                        "images/games/screenshots/bloodborne-3.jpg"
                    ],
                    tags: ["rpg", "action", "exclusive", "horror"],
                    rating: 4.7,
                    downloadLink: "#",
                    trailer: "https://www.youtube.com/watch?v=G203e1HhixY"
                },
                {
                    id: 10,
                    title: "Resident Evil Village",
                    titleAr: "ريزدنت إيفل فيليج",
                    description: "استكشف قرية مرعبة مليئة بالمخلوقات الغريبة في أحدث إصدارات سلسلة الرعب الشهيرة.",
                    category: "horror",
                    platform: "ps4",
                    region: "usa",
                    language: "arabic",
                    arabicType: "unofficial",
                    size: "35.7 GB",
                    releaseDate: "2021-05-07",
                    developer: "Capcom",
                    publisher: "Capcom",
                    cover: "images/games/resident-evil-village.jpg",
                    screenshots: [
                        "images/games/screenshots/rev-1.jpg",
                        "images/games/screenshots/rev-2.jpg",
                        "images/games/screenshots/rev-3.jpg"
                    ],
                    tags: ["horror", "action", "arabic"],
                    rating: 4.6,
                    downloadLink: "#",
                    trailer: "https://www.youtube.com/watch?v=dRpXEc-EJow"
                }
            ];
            
            // تخزين بيانات الألعاب الافتراضية
            localStorage.setItem('games', JSON.stringify(defaultGames));
        }
    }
    
    // الحصول على بيانات الألعاب
    function getGames() {
        return JSON.parse(localStorage.getItem('games')) || [];
    }
    
    // عرض الألعاب
    function displayGames(filteredGames = null) {
        const gamesContainer = document.getElementById('games-container');
        
        if (!gamesContainer) {
            return;
        }
        
        // الحصول على الألعاب (المفلترة أو الكل)
        const games = filteredGames || getGames();
        
        // التحقق من وجود ألعاب
        if (games.length === 0) {
            gamesContainer.innerHTML = '<div class="no-results">لا توجد ألعاب متطابقة مع معايير البحث</div>';
            return;
        }
        
        // إنشاء عناصر الألعاب
        gamesContainer.innerHTML = '';
        
        games.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.setAttribute('data-id', game.id);
            
            // تحديد شارة اللغة العربية
            let arabicBadge = '';
            if (game.language === 'arabic') {
                if (game.arabicType === 'official') {
                    arabicBadge = '<div class="game-badge arabic-official">معربة رسمياً</div>';
                } else {
                    arabicBadge = '<div class="game-badge arabic">معربة</div>';
                }
            }
            
            // إنشاء محتوى بطاقة اللعبة
            gameCard.innerHTML = `
                <div class="game-card-inner">
                    <div class="game-thumbnail">
                        <img src="${game.cover || 'images/placeholder.jpg'}" alt="${game.title}" loading="lazy">
                        ${arabicBadge}
                        <div class="game-platform-badge">${game.platform.toUpperCase()}</div>
                    </div>
                    <div class="game-info">
                        <h3 class="game-title">${game.titleAr || game.title}</h3>
                        <div class="game-meta">
                            <span class="game-size"><i class="fas fa-hdd"></i> ${game.size}</span>
                            <span class="game-category"><i class="fas fa-gamepad"></i> ${getCategoryName(game.category)}</span>
                        </div>
                        <div class="game-rating">
                            ${generateRatingStars(game.rating)}
                            <span class="rating-value">${game.rating}</span>
                        </div>
                    </div>
                    <div class="game-actions">
                        <a href="game-details.html?id=${game.id}" class="btn-details">التفاصيل</a>
                        <a href="${game.downloadLink || '#'}" class="btn-download">تحميل</a>
                    </div>
                </div>
            `;
            
            // إضافة حدث النقر لفتح صفحة التفاصيل
            gameCard.addEventListener('click', function(e) {
                // تجاهل النقر على الأزرار
                if (e.target.classList.contains('btn-details') || e.target.classList.contains('btn-download')) {
                    return;
                }
                
                // فتح صفحة التفاصيل
                window.location.href = `game-details.html?id=${game.id}`;
            });
            
            gamesContainer.appendChild(gameCard);
        });
    }
    
    // تهيئة أحداث الفلاتر
    function initFilters() {
        const filterApplyBtn = document.getElementById('filter-apply');
        const filterResetBtn = document.getElementById('filter-reset');
        const filterTags = document.querySelectorAll('.filter-tag');
        
        // تطبيق الفلاتر
        if (filterApplyBtn) {
            filterApplyBtn.addEventListener('click', function() {
                applyFilters();
            });
        }
        
        // إعادة ضبط الفلاتر
        if (filterResetBtn) {
            filterResetBtn.addEventListener('click', function() {
                resetFilters();
            });
        }
        
        // فلاتر سريعة (التاجات)
        filterTags.forEach(tag => {
            tag.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // إزالة الفئة النشطة من جميع التاجات
                filterTags.forEach(t => t.classList.remove('active'));
                
                // إضافة الفئة النشطة للتاج المحدد
                this.classList.add('active');
                
                // تطبيق الفلتر
                applyTagFilter(filter);
            });
        });
    }
    
    // تطبيق الفلاتر
    function applyFilters() {
        const platformFilter = document.getElementById('platform-filter').value;
        const categoryFilter = document.getElementById('category-filter').value;
        const languageFilter = document.getElementById('language-filter').value;
        const regionFilter = document.getElementById('region-filter').value;
        const sortFilter = document.getElementById('sort-filter').value;
        
        // الحصول على جميع الألعاب
        let games = getGames();
        
        // تطبيق فلتر المنصة
        if (platformFilter !== 'all') {
            games = games.filter(game => game.platform === platformFilter);
        }
        
        // تطبيق فلتر التصنيف
        if (categoryFilter !== 'all') {
            games = games.filter(game => game.category === categoryFilter);
        }
        
        // تطبيق فلتر اللغة
        if (languageFilter !== 'all') {
            if (languageFilter === 'arabic') {
                games = games.filter(game => game.language === 'arabic');
            } else if (languageFilter === 'official-arabic') {
                games = games.filter(game => game.language === 'arabic' && game.arabicType === 'official');
            } else if (languageFilter === 'non-arabic') {
                games = games.filter(game => game.language === 'non-arabic');
            }
        }
        
        // تطبيق فلتر المنطقة
        if (regionFilter !== 'all') {
            games = games.filter(game => game.region === regionFilter);
        }
        
        // تطبيق الترتيب
        if (sortFilter === 'newest') {
            games.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        } else if (sortFilter === 'oldest') {
            games.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        } else if (sortFilter === 'alphabetical') {
            games.sort((a, b) => (a.title > b.title) ? 1 : -1);
        } else if (sortFilter === 'size-asc') {
            games.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
        } else if (sortFilter === 'size-desc') {
            games.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
        }
        
        // عرض الألعاب المفلترة
        displayGames(games);
    }
    
    // إعادة ضبط الفلاتر
    function resetFilters() {
        // إعادة ضبط قيم الفلاتر
        document.getElementById('platform-filter').value = 'ps4';
        document.getElementById('category-filter').value = 'all';
        document.getElementById('language-filter').value = 'all';
        document.getElementById('region-filter').value = 'all';
        document.getElementById('sort-filter').value = 'newest';
        
        // إزالة الفئة النشطة من جميع التاجات
        document.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
        
        // إضافة الفئة النشطة لتاج "الكل"
        document.querySelector('.filter-tag[data-filter="all"]').classList.add('active');
        
        // عرض جميع الألعاب
        displayGames();
    }
    
    // تطبيق فلتر التاج
    function applyTagFilter(filter) {
        // الحصول على جميع الألعاب
        let games = getGames();
        
        // تطبيق الفلتر
        if (filter !== 'all') {
            games = games.filter(game => {
                if (filter === 'arabic') {
                    return game.language === 'arabic';
                } else if (filter === 'converted') {
                    return game.tags.includes('converted');
                } else if (filter === 'new') {
                    // الألعاب التي صدرت في آخر 3 أشهر
                    const threeMonthsAgo = new Date();
                    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                    return new Date(game.releaseDate) >= threeMonthsAgo;
                } else if (filter === 'classic') {
                    // الألعاب التي صدرت قبل 5 سنوات
                    const fiveYearsAgo = new Date();
                    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
                    return new Date(game.releaseDate) <= fiveYearsAgo;
                } else if (filter === 'exclusive') {
                    return game.tags.includes('exclusive');
                } else if (filter === 'multiplayer') {
                    return game.tags.includes('multiplayer');
                } else if (filter === 'vr') {
                    return game.tags.includes('vr');
                }
                return false;
            });
        }
        
        // عرض الألعاب المفلترة
        displayGames(games);
    }
    
    // تهيئة أحداث البحث
    function initSearch() {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        
        if (!searchInput || !searchResults) {
            return;
        }
        
        // حدث البحث
        searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            
            // إخفاء نتائج البحث إذا كان الاستعلام فارغاً
            if (query === '') {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                return;
            }
            
            // البحث عن الألعاب
            const games = getGames();
            const matchedGames = games.filter(game => {
                return game.title.toLowerCase().includes(query) || 
                       (game.titleAr && game.titleAr.toLowerCase().includes(query)) ||
                       game.description.toLowerCase().includes(query);
            });
            
            // عرض نتائج البحث
            if (matchedGames.length > 0) {
                searchResults.innerHTML = '';
                
                matchedGames.slice(0, 5).forEach(game => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    
                    resultItem.innerHTML = `
                        <img src="${game.cover || 'images/placeholder.jpg'}" alt="${game.title}" class="search-result-image">
                        <div class="search-result-info">
                            <h4>${game.titleAr || game.title}</h4>
                            <p>${game.platform.toUpperCase()} | ${getCategoryName(game.category)}</p>
                        </div>
                    `;
                    
                    resultItem.addEventListener('click', function() {
                        window.location.href = `game-details.html?id=${game.id}`;
                    });
                    
                    searchResults.appendChild(resultItem);
                });
                
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<div class="search-no-results">لا توجد نتائج مطابقة</div>';
                searchResults.style.display = 'block';
            }
        });
        
        // إخفاء نتائج البحث عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
    
    // تهيئة أحداث التبديل بين طرق العرض
    function initViewToggle() {
        const gridViewBtn = document.getElementById('grid-view-btn');
        const listViewBtn = document.getElementById('list-view-btn');
        const gamesContainer = document.getElementById('games-container');
        
        if (!gridViewBtn || !listViewBtn || !gamesContainer) {
            return;
        }
        
        // التبديل إلى عرض الشبكة
        gridViewBtn.addEventListener('click', function() {
            gamesContainer.classList.remove('list-view');
            gamesContainer.classList.add('grid-view');
            
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            
            // حفظ تفضيل العرض
            localStorage.setItem('gamesViewMode', 'grid');
        });
        
        // التبديل إلى عرض القائمة
        listViewBtn.addEventListener('click', function() {
            gamesContainer.classList.remove('grid-view');
            gamesContainer.classList.add('list-view');
            
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            
            // حفظ تفضيل العرض
            localStorage.setItem('gamesViewMode', 'list');
        });
        
        // تطبيق تفضيل العرض المحفوظ
        const savedViewMode = localStorage.getItem('gamesViewMode') || 'grid';
        
        if (savedViewMode === 'grid') {
            gamesContainer.classList.add('grid-view');
            gridViewBtn.classList.add('active');
        } else {
            gamesContainer.classList.add('list-view');
            listViewBtn.classList.add('active');
        }
    }
    
    // الحصول على اسم التصنيف
    function getCategoryName(category) {
        const categories = {
            'action': 'أكشن',
            'adventure': 'مغامرة',
            'rpg': 'لعب أدوار',
            'sports': 'رياضة',
            'racing': 'سباق',
            'fighting': 'قتال',
            'horror': 'رعب',
            'openworld': 'عالم مفتوح',
            'strategy': 'استراتيجية',
            'shooter': 'تصويب'
        };
        
        return categories[category] || category;
    }
    
    // إنشاء نجوم التقييم
    function generateRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // النجوم الكاملة
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // نصف نجمة
        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // النجوم الفارغة
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }
});
