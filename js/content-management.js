/**
 * إدارة المحتوى والفلترة - 4GAMER
 * ملف JavaScript لإدارة عرض وفلترة محتوى الألعاب والأدوات
 */

// تهيئة المتغيرات العامة
let gamesData = {
    ps4: [],
    ps5: [],
    both: []
};

// استدعاء الوظائف عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحميل البيانات من localStorage إذا كانت موجودة
    loadGamesData();
    
    // تهيئة الفلاتر السريعة (التاجات)
    initQuickFilters();
    
    // تهيئة أزرار الفلترة
    initFilterButtons();
    
    // تهيئة أزرار عرض المزيد
    initLoadMoreButtons();
    
    // تطبيق الفلاتر المحفوظة (إن وجدت)
    applySavedFilters();
});

/**
 * تحميل بيانات الألعاب من localStorage
 */
function loadGamesData() {
    // محاولة تحميل بيانات الألعاب من localStorage
    const savedPS4Games = localStorage.getItem('4gamer_ps4_games');
    const savedPS5Games = localStorage.getItem('4gamer_ps5_games');
    const savedBothGames = localStorage.getItem('4gamer_both_games');
    
    if (savedPS4Games) {
        try {
            gamesData.ps4 = JSON.parse(savedPS4Games);
        } catch (e) {
            console.error('خطأ في تحميل بيانات ألعاب PS4:', e);
            gamesData.ps4 = [];
        }
    }
    
    if (savedPS5Games) {
        try {
            gamesData.ps5 = JSON.parse(savedPS5Games);
        } catch (e) {
            console.error('خطأ في تحميل بيانات ألعاب PS5:', e);
            gamesData.ps5 = [];
        }
    }
    
    if (savedBothGames) {
        try {
            gamesData.both = JSON.parse(savedBothGames);
        } catch (e) {
            console.error('خطأ في تحميل بيانات الألعاب المشتركة:', e);
            gamesData.both = [];
        }
    }
    
    // عرض الألعاب المحملة في الصفحة
    displayGames();
}

/**
 * تهيئة الفلاتر السريعة (التاجات)
 */
function initQuickFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع التاجات
            filterTags.forEach(t => t.classList.remove('active'));
            
            // إضافة الفئة النشطة للتاج المحدد
            this.classList.add('active');
            
            // تطبيق الفلتر
            const filter = this.getAttribute('data-filter');
            applyQuickFilter(filter);
        });
    });
    
    // تحديد التاج "الكل" كنشط افتراضياً
    const allTag = document.querySelector('.filter-tag[data-filter="all"]');
    if (allTag) {
        allTag.classList.add('active');
    }
}

/**
 * تهيئة أزرار الفلترة
 */
function initFilterButtons() {
    // زر تطبيق الفلاتر
    const filterApplyBtn = document.getElementById('filter-apply');
    if (filterApplyBtn) {
        filterApplyBtn.addEventListener('click', function() {
            applyAdvancedFilters();
        });
    }
    
    // زر إعادة ضبط الفلاتر
    const filterResetBtn = document.getElementById('filter-reset');
    if (filterResetBtn) {
        filterResetBtn.addEventListener('click', function() {
            resetFilters();
        });
    }
}

/**
 * تهيئة أزرار عرض المزيد
 */
function initLoadMoreButtons() {
    // أزرار عرض المزيد
    const loadMoreOfficialBtn = document.getElementById('load-more-official');
    if (loadMoreOfficialBtn) {
        loadMoreOfficialBtn.addEventListener('click', function() {
            loadMoreGamesContent('official-arabic-games');
        });
    }
    
    const loadMoreNonOfficialBtn = document.getElementById('load-more-non-official');
    if (loadMoreNonOfficialBtn) {
        loadMoreNonOfficialBtn.addEventListener('click', function() {
            loadMoreGamesContent('non-official-arabic-games');
        });
    }
    
    const loadMoreNonArabicBtn = document.getElementById('load-more-non-arabic');
    if (loadMoreNonArabicBtn) {
        loadMoreNonArabicBtn.addEventListener('click', function() {
            loadMoreGamesContent('non-arabic-games');
        });
    }
}

/**
 * تطبيق الفلاتر المحفوظة (إن وجدت)
 */
function applySavedFilters() {
    // تحقق من وجود فلاتر محفوظة
    const savedFilters = localStorage.getItem('4gamer_filters');
    const savedQuickFilter = localStorage.getItem('4gamer_quick_filter');
    
    if (savedFilters) {
        try {
            const filters = JSON.parse(savedFilters);
            
            // تعيين قيم الفلاتر في واجهة المستخدم
            if (document.getElementById('platform-filter')) {
                document.getElementById('platform-filter').value = filters.platform || 'all';
            }
            
            if (document.getElementById('category-filter')) {
                document.getElementById('category-filter').value = filters.category || 'all';
            }
            
            if (document.getElementById('language-filter')) {
                document.getElementById('language-filter').value = filters.language || 'all';
            }
            
            if (document.getElementById('region-filter')) {
                document.getElementById('region-filter').value = filters.region || 'all';
            }
            
            if (document.getElementById('sort-filter')) {
                document.getElementById('sort-filter').value = filters.sort || 'newest';
            }
            
            // تطبيق الفلاتر
            applyAdvancedFilters(filters);
        } catch (e) {
            console.error('خطأ في تحميل الفلاتر المحفوظة:', e);
        }
    } else if (savedQuickFilter) {
        // تطبيق الفلتر السريع المحفوظ
        const filterTag = document.querySelector(`.filter-tag[data-filter="${savedQuickFilter}"]`);
        if (filterTag) {
            // إزالة الفئة النشطة من جميع التاجات
            document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            
            // إضافة الفئة النشطة للتاج المحدد
            filterTag.classList.add('active');
            
            // تطبيق الفلتر
            applyQuickFilter(savedQuickFilter);
        }
    }
}

/**
 * تطبيق الفلتر السريع
 * @param {string} filter - نوع الفلتر السريع
 */
function applyQuickFilter(filter) {
    console.log('تطبيق الفلتر السريع:', filter);
    
    // تخزين الفلتر المطبق
    localStorage.setItem('4gamer_quick_filter', filter);
    
    // إزالة الفلاتر المتقدمة المحفوظة
    localStorage.removeItem('4gamer_filters');
    
    // تطبيق الفلتر على عناصر الألعاب
    const gameCards = document.querySelectorAll('.game-card');
    
    if (filter === 'all') {
        // إظهار جميع الألعاب
        gameCards.forEach(card => {
            card.style.display = 'block';
        });
    } else {
        // إخفاء/إظهار الألعاب حسب الفلتر
        gameCards.forEach(card => {
            const shouldShow = checkGameMatchesQuickFilter(card, filter);
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }
    
    // تحديث عرض أقسام الألعاب
    updateSectionsVisibility();
}

/**
 * التحقق مما إذا كانت اللعبة تطابق الفلتر السريع
 * @param {Element} gameCard - عنصر بطاقة اللعبة
 * @param {string} filter - نوع الفلتر السريع
 * @returns {boolean} - ما إذا كانت اللعبة تطابق الفلتر
 */
function checkGameMatchesQuickFilter(gameCard, filter) {
    switch (filter) {
        case 'arabic':
            // التحقق من وجود شارة "معربة" أو "معربة رسمياً"
            return gameCard.querySelector('.arabic-badge') !== null;
            
        case 'converted':
            // التحقق من وجود كلمة "محولة" في وصف اللعبة
            const gameInfo = gameCard.querySelector('.game-info');
            return gameInfo && gameInfo.textContent.includes('محولة');
            
        case 'new':
            // يمكن تنفيذ منطق للتحقق من الألعاب الحديثة
            // مثلاً: التحقق من وجود شارة "جديد" أو تاريخ الإضافة
            return gameCard.classList.contains('new-game') || gameCard.dataset.new === 'true';
            
        case 'classic':
            // يمكن تنفيذ منطق للتحقق من الألعاب الكلاسيكية
            return gameCard.classList.contains('classic-game') || gameCard.dataset.classic === 'true';
            
        case 'exclusive':
            // التحقق من وجود كلمة "حصرية" في وصف اللعبة
            return gameCard.classList.contains('exclusive') || gameCard.dataset.exclusive === 'true';
            
        case 'multiplayer':
            // التحقق من وجود كلمة "متعددة اللاعبين" في وصف اللعبة
            const gameDesc = gameCard.querySelector('.game-info');
            return gameDesc && gameDesc.textContent.includes('متعددة اللاعبين');
            
        case 'vr':
            // التحقق من وجود كلمة "واقع افتراضي" أو "VR" في وصف اللعبة
            const gameVR = gameCard.querySelector('.game-info');
            return gameVR && (gameVR.textContent.includes('واقع افتراضي') || gameVR.textContent.includes('VR'));
            
        default:
            return true;
    }
}

/**
 * تطبيق الفلاتر المتقدمة
 * @param {Object} customFilters - فلاتر مخصصة (اختياري)
 */
function applyAdvancedFilters(customFilters) {
    // الحصول على قيم الفلاتر من واجهة المستخدم أو استخدام الفلاتر المخصصة
    const filters = customFilters || {
        platform: document.getElementById('platform-filter') ? document.getElementById('platform-filter').value : 'all',
        category: document.getElementById('category-filter') ? document.getElementById('category-filter').value : 'all',
        language: document.getElementById('language-filter') ? document.getElementById('language-filter').value : 'all',
        region: document.getElementById('region-filter') ? document.getElementById('region-filter').value : 'all',
        sort: document.getElementById('sort-filter') ? document.getElementById('sort-filter').value : 'newest'
    };
    
    console.log('تطبيق الفلاتر المتقدمة:', filters);
    
    // تخزين الفلاتر المطبقة
    localStorage.setItem('4gamer_filters', JSON.stringify(filters));
    
    // إزالة الفلتر السريع المحفوظ
    localStorage.removeItem('4gamer_quick_filter');
    
    // إزالة الفئة النشطة من جميع التاجات
    document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
    
    // تطبيق الفلاتر على عناصر الألعاب
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        const shouldShow = checkGameMatchesAdvancedFilters(card, filters);
        card.style.display = shouldShow ? 'block' : 'none';
    });
    
    // تحديث عرض أقسام الألعاب
    updateSectionsVisibility();
    
    // ترتيب الألعاب حسب الفلتر المحدد
    sortGames(filters.sort);
}

/**
 * التحقق مما إذا كانت اللعبة تطابق الفلاتر المتقدمة
 * @param {Element} gameCard - عنصر بطاقة اللعبة
 * @param {Object} filters - الفلاتر المطبقة
 * @returns {boolean} - ما إذا كانت اللعبة تطابق الفلاتر
 */
function checkGameMatchesAdvancedFilters(gameCard, filters) {
    // التحقق من فلتر المنصة
    if (filters.platform !== 'all') {
        const platform = gameCard.querySelector('.game-platform');
        if (!platform || !platform.textContent.includes(filters.platform.toUpperCase())) {
            return false;
        }
    }
    
    // التحقق من فلتر التصنيف
    if (filters.category !== 'all') {
        const gameInfo = gameCard.querySelector('.game-info');
        if (!gameInfo || !gameInfo.textContent.includes(getCategoryArabicName(filters.category))) {
            return false;
        }
    }
    
    // التحقق من فلتر اللغة
    if (filters.language !== 'all') {
        const arabicBadge = gameCard.querySelector('.arabic-badge');
        
        if (filters.language === 'arabic') {
            // أي لعبة معربة (رسمياً أو غير رسمياً)
            if (!arabicBadge) {
                return false;
            }
        } else if (filters.language === 'official-arabic') {
            // فقط الألعاب المعربة رسمياً
            if (!arabicBadge || !arabicBadge.textContent.includes('رسمياً')) {
                return false;
            }
        } else if (filters.language === 'non-arabic') {
            // فقط الألعاب غير المعربة
            if (arabicBadge) {
                return false;
            }
        }
    }
    
    // التحقق من فلتر المنطقة (إذا كان موجوداً في البيانات)
    if (filters.region !== 'all' && gameCard.dataset.region) {
        if (gameCard.dataset.region !== filters.region) {
            return false;
        }
    }
    
    return true;
}

/**
 * الحصول على الاسم العربي للتصنيف
 * @param {string} category - اسم التصنيف بالإنجليزية
 * @returns {string} - الاسم العربي للتصنيف
 */
function getCategoryArabicName(category) {
    const categories = {
        'action': 'أكشن',
        'adventure': 'مغامرة',
        'rpg': 'لعب أدوار',
        'sports': 'رياضة',
        'racing': 'سباق',
        'fighting': 'قتال',
        'horror': 'رعب',
        'openworld': 'عالم مفتوح'
    };
    
    return categories[category] || category;
}

/**
 * ترتيب الألعاب حسب الفلتر المحدد
 * @param {string} sortType - نوع الترتيب
 */
function sortGames(sortType) {
    // الحصول على أقسام الألعاب
    const officialGamesSection = document.getElementById('official-arabic-games');
    const nonOfficialGamesSection = document.getElementById('non-official-arabic-games');
    const nonArabicGamesSection = document.getElementById('non-arabic-games');
    
    // ترتيب الألعاب في كل قسم
    if (officialGamesSection) {
        sortGamesInSection(officialGamesSection, sortType);
    }
    
    if (nonOfficialGamesSection) {
        sortGamesInSection(nonOfficialGamesSection, sortType);
    }
    
    if (nonArabicGamesSection) {
        sortGamesInSection(nonArabicGamesSection, sortType);
    }
}

/**
 * ترتيب الألعاب في قسم معين
 * @param {Element} section - قسم الألعاب
 * @param {string} sortType - نوع الترتيب
 */
function sortGamesInSection(section, sortType) {
    const gameCards = Array.from(section.querySelectorAll('.game-card'));
    
    // ترتيب البطاقات حسب النوع المحدد
    gameCards.sort((a, b) => {
        switch (sortType) {
            case 'newest':
                // ترتيب حسب تاريخ الإضافة (من الأحدث للأقدم)
                const dateA = a.dataset.date ? new Date(a.dataset.date) : new Date(0);
                const dateB = b.dataset.date ? new Date(b.dataset.date) : new Date(0);
                return dateB - dateA;
                
            case 'oldest':
                // ترتيب حسب تاريخ الإضافة (من الأقدم للأحدث)
                const dateC = a.dataset.date ? new Date(a.dataset.date) : new Date(0);
                const dateD = b.dataset.date ? new Date(b.dataset.date) : new Date(0);
                return dateC - dateD;
                
            case 'alphabetical':
                // ترتيب أبجدي حسب اسم اللعبة
                const titleA = a.querySelector('.game-title').textContent.trim();
                const titleB = b.querySelector('.game-title').textContent.trim();
                return titleA.localeCompare(titleB, 'ar');
                
            case 'size-asc':
                // ترتيب حسب الحجم (تصاعدي)
                const sizeA = extractGameSize(a);
                const sizeB = extractGameSize(b);
                return sizeA - sizeB;
                
            case 'size-desc':
                // ترتيب حسب الحجم (تنازلي)
                const sizeC = extractGameSize(a);
                const sizeD = extractGameSize(b);
                return sizeD - sizeC;
                
            default:
                return 0;
        }
    });
    
    // إعادة ترتيب البطاقات في القسم
    gameCards.forEach(card => {
        section.appendChild(card);
    });
}

/**
 * استخراج حجم اللعبة من بطاقة اللعبة
 * @param {Element} gameCard - بطاقة اللعبة
 * @returns {number} - حجم اللعبة بالجيجابايت
 */
function extractGameSize(gameCard) {
    const gameInfo = gameCard.querySelector('.game-info');
    if (!gameInfo) return 0;
    
    const sizeText = gameInfo.textContent.match(/(\d+(\.\d+)?)\s*GB/);
    if (sizeText && sizeText[1]) {
        return parseFloat(sizeText[1]);
    }
    
    return 0;
}

/**
 * تحديث عرض أقسام الألعاب (إخفاء الأقسام الفارغة)
 */
function updateSectionsVisibility() {
    // الحصول على أقسام الألعاب
    const sections = document.querySelectorAll('.games-section');
    
    sections.forEach(section => {
        const gamesGrid = section.querySelector('.games-grid');
        const visibleGames = gamesGrid.querySelectorAll('.game-card[style="display: block"]');
        
        // إخفاء القسم إذا لم تكن هناك ألعاب ظاهرة
        if (visibleGames.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

/**
 * إعادة ضبط الفلاتر
 */
function resetFilters() {
    // إعادة ضبط قيم الفلاتر في واجهة المستخدم
    if (document.getElementById('platform-filter')) {
        // تحديد القيمة الافتراضية حسب الصفحة الحالية
        const isPS5Page = window.location.href.includes('ps5');
        document.getElementById('platform-filter').value = isPS5Page ? 'ps5' : 'ps4';
    }
    
    if (document.getElementById('category-filter')) {
        document.getElementById('category-filter').value = 'all';
    }
    
    if (document.getElementById('language-filter')) {
        document.getElementById('language-filter').value = 'all';
    }
    
    if (document.getElementById('region-filter')) {
        document.getElementById('region-filter').value = 'all';
    }
    
    if (document.getElementById('sort-filter')) {
        document.getElementById('sort-filter').value = 'newest';
    }
    
    // إزالة الفئة النشطة من جميع التاجات
    document.querySelectorAll('.filter-tag').forEach(tag => tag.classList.remove('active'));
    
    // تحديد التاج "الكل" كنشط
    const allTag = document.querySelector('.filter-tag[data-filter="all"]');
    if (allTag) {
        allTag.classList.add('active');
    }
    
    // إزالة الفلاتر المخزنة
    localStorage.removeItem('4gamer_filters');
    localStorage.removeItem('4gamer_quick_filter');
    
    // إظهار جميع الألعاب
    document.querySelectorAll('.game-card').forEach(card => {
        card.style.display = 'block';
    });
    
    // إظهار جميع الأقسام
    document.querySelectorAll('.games-section').forEach(section => {
        section.style.display = 'block';
    });
}

/**
 * عرض الألعاب في الصفحة
 */
function displayGames() {
    // تحديد الصفحة الحالية
    const isPS5Page = window.location.href.includes('ps5');
    const currentPlatform = isPS5Page ? 'ps5' : 'ps4';
    
    // الحصول على الألعاب المناسبة للصفحة الحالية
    const platformGames = gamesData[currentPlatform];
    const bothGames = gamesData.both;
    
    // دمج الألعاب المناسبة للصفحة الحالية
    const allGames = [...platformGames, ...bothGames.filter(game => game.platforms.includes(currentPlatform))];
    
    // تصنيف الألعاب حسب نوع التعريب
    const officialArabicGames = allGames.filter(game => game.arabicType === 'official');
    const nonOfficialArabicGames = allGames.filter(game => game.arabicType === 'non-official');
    const nonArabicGames = allGames.filter(game => game.arabicType === 'none');
    
    // عرض الألعاب في الأقسام المناسبة
    displayGamesInSection('official-arabic-games', officialArabicGames);
    displayGamesInSection('non-official-arabic-games', nonOfficialArabicGames);
    displayGamesInSection('non-arabic-games', nonArabicGames);
}

/**
 * عرض الألعاب في قسم معين
 * @param {string} sectionId - معرف قسم الألعاب
 * @param {Array} games - مصفوفة الألعاب
 */
function displayGamesInSection(sectionId, games) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // مسح المحتوى الحالي
    section.innerHTML = '';
    
    // إضافة بطاقات الألعاب
    games.forEach(game => {
        const gameCard = createGameCard(game);
        section.appendChild(gameCard);
    });
    
    // إخفاء القسم إذا لم تكن هناك ألعاب
    const parentSection = section.closest('.games-section');
    if (parentSection) {
        parentSection.style.display = games.length > 0 ? 'block' : 'none';
    }
}

/**
 * إنشاء بطاقة لعبة
 * @param {Object} game - بيانات اللعبة
 * @returns {Element} - عنصر بطاقة اللعبة
 */
function createGameCard(game) {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';
    gameCard.dataset.externalImage = game.image || '';
    gameCard.dataset.alt = game.title || '';
    
    if (game.date) {
        gameCard.dataset.date = game.date;
    }
    
    if (game.region) {
        gameCard.dataset.region = game.region;
    }
    
    if (game.exclusive) {
        gameCard.dataset.exclusive = 'true';
    }
    
    if (game.new) {
        gameCard.dataset.new = 'true';
        gameCard.classList.add('new-game');
    }
    
    if (game.classic) {
        gameCard.dataset.classic = 'true';
        gameCard.classList.add('classic-game');
    }
    
    // إضافة شارة المنصة
    const platformDiv = document.createElement('div');
    platformDiv.className = 'game-platform';
    platformDiv.textContent = game.platform || 'PS4';
    gameCard.appendChild(platformDiv);
    
    // إضافة شارة التعريب إذا كانت اللعبة معربة
    if (game.arabicType !== 'none') {
        const arabicBadge = document.createElement('div');
        arabicBadge.className = 'arabic-badge';
        arabicBadge.textContent = game.arabicType === 'official' ? 'معربة رسمياً' : 'معربة';
        gameCard.appendChild(arabicBadge);
    }
    
    // إضافة معلومات اللعبة
    const overlayDiv = document.createElement('div');
    overlayDiv.className = 'game-overlay';
    
    const titleH3 = document.createElement('h3');
    titleH3.className = 'game-title';
    titleH3.textContent = game.title || '';
    overlayDiv.appendChild(titleH3);
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'game-info';
    
    const categorySpan = document.createElement('span');
    categorySpan.textContent = game.categories ? game.categories.join('، ') : '';
    infoDiv.appendChild(categorySpan);
    
    const sizeSpan = document.createElement('span');
    sizeSpan.textContent = game.size ? `${game.size} GB` : '';
    infoDiv.appendChild(sizeSpan);
    
    overlayDiv.appendChild(infoDiv);
    gameCard.appendChild(overlayDiv);
    
    // إضافة حدث النقر لعرض تفاصيل اللعبة
    gameCard.addEventListener('click', function() {
        showGameDetails(game);
    });
    
    return gameCard;
}

/**
 * عرض تفاصيل اللعبة
 * @param {Object} game - بيانات اللعبة
 */
function showGameDetails(game) {
    // إنشاء نافذة منبثقة لعرض تفاصيل اللعبة
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'game-modal-content';
    
    // إضافة زر الإغلاق
    const closeBtn = document.createElement('span');
    closeBtn.className = 'game-modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    modalContent.appendChild(closeBtn);
    
    // إضافة صورة اللعبة
    if (game.image) {
        const gameImage = document.createElement('img');
        gameImage.className = 'game-modal-image';
        gameImage.src = game.image;
        gameImage.alt = game.title || '';
        modalContent.appendChild(gameImage);
    }
    
    // إضافة معلومات اللعبة
    const gameInfo = document.createElement('div');
    gameInfo.className = 'game-modal-info';
    
    const gameTitle = document.createElement('h2');
    gameTitle.className = 'game-modal-title';
    gameTitle.textContent = game.title || '';
    gameInfo.appendChild(gameTitle);
    
    // إضافة تفاصيل اللعبة
    const detailsList = document.createElement('ul');
    detailsList.className = 'game-modal-details';
    
    // المنصة
    const platformItem = document.createElement('li');
    platformItem.innerHTML = `<strong>المنصة:</strong> ${game.platform || 'PS4'}`;
    detailsList.appendChild(platformItem);
    
    // التصنيفات
    if (game.categories && game.categories.length > 0) {
        const categoriesItem = document.createElement('li');
        categoriesItem.innerHTML = `<strong>التصنيفات:</strong> ${game.categories.join('، ')}`;
        detailsList.appendChild(categoriesItem);
    }
    
    // الحجم
    if (game.size) {
        const sizeItem = document.createElement('li');
        sizeItem.innerHTML = `<strong>الحجم:</strong> ${game.size} GB`;
        detailsList.appendChild(sizeItem);
    }
    
    // المنطقة
    if (game.region) {
        const regionItem = document.createElement('li');
        regionItem.innerHTML = `<strong>المنطقة:</strong> ${game.region}`;
        detailsList.appendChild(regionItem);
    }
    
    // التعريب
    const arabicTypeMap = {
        'official': 'معربة رسمياً',
        'non-official': 'معربة غير رسمياً',
        'none': 'غير معربة'
    };
    
    const arabicItem = document.createElement('li');
    arabicItem.innerHTML = `<strong>التعريب:</strong> ${arabicTypeMap[game.arabicType] || 'غير معربة'}`;
    detailsList.appendChild(arabicItem);
    
    // تاريخ الإضافة
    if (game.date) {
        const dateItem = document.createElement('li');
        const formattedDate = new Date(game.date).toLocaleDateString('ar-SA');
        dateItem.innerHTML = `<strong>تاريخ الإضافة:</strong> ${formattedDate}`;
        detailsList.appendChild(dateItem);
    }
    
    gameInfo.appendChild(detailsList);
    
    // إضافة وصف اللعبة
    if (game.description) {
        const descTitle = document.createElement('h3');
        descTitle.textContent = 'الوصف';
        gameInfo.appendChild(descTitle);
        
        const descText = document.createElement('p');
        descText.className = 'game-modal-description';
        descText.textContent = game.description;
        gameInfo.appendChild(descText);
    }
    
    // إضافة زر التحميل
    if (game.downloadLink) {
        const downloadBtn = document.createElement('a');
        downloadBtn.className = 'btn game-modal-download';
        downloadBtn.href = game.downloadLink;
        downloadBtn.target = '_blank';
        downloadBtn.textContent = 'تحميل اللعبة';
        gameInfo.appendChild(downloadBtn);
    }
    
    modalContent.appendChild(gameInfo);
    modal.appendChild(modalContent);
    
    // إضافة النافذة المنبثقة إلى الصفحة
    document.body.appendChild(modal);
    
    // إضافة حدث النقر خارج النافذة المنبثقة لإغلاقها
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

/**
 * تحميل المزيد من الألعاب
 * @param {string} sectionId - معرف قسم الألعاب
 */
function loadMoreGamesContent(sectionId) {
    console.log('تحميل المزيد من الألعاب للقسم:', sectionId);
    
    // في حالة وجود خادم، يمكن استخدام AJAX لتحميل المزيد من الألعاب
    // في هذه الحالة، سنقوم بإخفاء زر "عرض المزيد" لأن جميع الألعاب معروضة بالفعل
    
    const loadMoreBtn = document.querySelector(`#load-more-${sectionId.split('-')[0]}`);
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}
