// ملف JavaScript لصفحة تفاصيل اللعبة
document.addEventListener('DOMContentLoaded', function() {
    // الحصول على معرف اللعبة من عنوان URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    
    // التحقق من وجود معرف اللعبة
    if (!gameId) {
        showError('لم يتم تحديد معرف اللعبة');
        return;
    }
    
    // تحميل تفاصيل اللعبة
    loadGameDetails(gameId);
    
    // تحميل الألعاب ذات الصلة
    loadRelatedGames(gameId);
    
    // تهيئة أحداث علامات التبويب
    initTabs();
    
    // تحميل تفاصيل اللعبة
    function loadGameDetails(gameId) {
        // الحصول على بيانات الألعاب من localStorage
        const games = JSON.parse(localStorage.getItem('games')) || [];
        
        // البحث عن اللعبة بواسطة المعرف
        const game = games.find(g => g.id == gameId);
        
        // التحقق من وجود اللعبة
        if (!game) {
            showError('اللعبة غير موجودة');
            return;
        }
        
        // عرض تفاصيل اللعبة
        displayGameDetails(game);
    }
    
    // عرض تفاصيل اللعبة
    function displayGameDetails(game) {
        const gameDetailsContainer = document.getElementById('game-details-container');
        
        // تحديد شارة اللغة العربية
        let arabicBadge = '';
        if (game.language === 'arabic') {
            if (game.arabicType === 'official') {
                arabicBadge = '<div class="game-badge arabic-official">معربة رسمياً</div>';
            } else {
                arabicBadge = '<div class="game-badge arabic">معربة</div>';
            }
        }
        
        // إنشاء محتوى تفاصيل اللعبة
        const gameDetailsHTML = `
            <div class="game-details-header">
                <div class="game-cover">
                    <img src="${game.cover || 'images/placeholder.jpg'}" alt="${game.title}">
                    ${arabicBadge}
                    <div class="game-platform-badge">${game.platform.toUpperCase()}</div>
                </div>
                
                <div class="game-info">
                    <h1 class="game-title">${game.titleAr || game.title}</h1>
                    ${game.titleAr ? `<div class="game-original-title">${game.title}</div>` : ''}
                    
                    <div class="game-rating">
                        <div class="rating-stars">
                            ${generateRatingStars(game.rating)}
                        </div>
                        <span class="rating-value">${game.rating}</span>
                    </div>
                    
                    <div class="game-description">
                        ${game.description}
                    </div>
                    
                    <div class="game-meta-info">
                        <div class="meta-item">
                            <span class="meta-label">المطور</span>
                            <span class="meta-value">${game.developer}</span>
                        </div>
                        
                        <div class="meta-item">
                            <span class="meta-label">الناشر</span>
                            <span class="meta-value">${game.publisher}</span>
                        </div>
                        
                        <div class="meta-item">
                            <span class="meta-label">تاريخ الإصدار</span>
                            <span class="meta-value">${formatDate(game.releaseDate)}</span>
                        </div>
                        
                        <div class="meta-item">
                            <span class="meta-label">الحجم</span>
                            <span class="meta-value">${game.size}</span>
                        </div>
                        
                        <div class="meta-item">
                            <span class="meta-label">المنطقة</span>
                            <span class="meta-value">${getRegionName(game.region)}</span>
                        </div>
                        
                        <div class="meta-item">
                            <span class="meta-label">التصنيف</span>
                            <span class="meta-value">${getCategoryName(game.category)}</span>
                        </div>
                    </div>
                    
                    <div class="game-tags">
                        ${generateTags(game.tags)}
                    </div>
                    
                    <div class="game-actions">
                        <a href="${game.downloadLink || '#'}" class="btn-download">
                            <i class="fas fa-download"></i> تحميل اللعبة
                        </a>
                        
                        ${game.trailer ? `
                            <a href="${game.trailer}" target="_blank" class="btn-trailer">
                                <i class="fab fa-youtube"></i> مشاهدة الإعلان
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div class="game-details-tabs">
                <div class="tabs-nav">
                    <button class="tab-btn active" data-tab="screenshots">لقطات الشاشة</button>
                    <button class="tab-btn" data-tab="requirements">متطلبات النظام</button>
                    <button class="tab-btn" data-tab="instructions">تعليمات التثبيت</button>
                </div>
                
                <div class="tab-content active" id="screenshots">
                    <div class="screenshots-grid">
                        ${generateScreenshots(game.screenshots)}
                    </div>
                </div>
                
                <div class="tab-content" id="requirements">
                    <div class="system-requirements">
                        <div class="requirements-column">
                            <h3 class="requirements-title">
                                <i class="fas fa-microchip"></i> الحد الأدنى
                            </h3>
                            <ul class="requirements-list">
                                <li class="requirements-item">
                                    <span class="requirements-label">نظام التشغيل</span>
                                    <span class="requirements-value">PlayStation 4 Firmware 9.00 أو أحدث</span>
                                </li>
                                <li class="requirements-item">
                                    <span class="requirements-label">المعالج</span>
                                    <span class="requirements-value">PlayStation 4 CPU</span>
                                </li>
                                <li class="requirements-item">
                                    <span class="requirements-label">الذاكرة</span>
                                    <span class="requirements-value">8 GB RAM</span>
                                </li>
                                <li class="requirements-item">
                                    <span class="requirements-label">بطاقة الرسومات</span>
                                    <span class="requirements-value">PlayStation 4 GPU</span>
                                </li>
                                <li class="requirements-item">
                                    <span class="requirements-label">مساحة التخزين</span>
                                    <span class="requirements-value">${game.size}</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div class="requirements-column">
                            <h3 class="requirements-title">
                                <i class="fas fa-cogs"></i> الموصى به
                            </h3>
                            <ul class="requirements-list">
                                <li class="requirements-item">
                                    <span class="requirements-label">نظام التشغيل</span>
                                    <span class="requirements-value">PlayStation 4 Pro Firmware 9.00 أو أحدث</span>
                                </li>
                                <li class="requirements-item">
                                    <span class="requirements-label">المعالج</span>
                                    <span class="requirements-value">PlayStation 4 Pro CPU</span>
                                </li>
                                <li class="requirements-item">
                                    <span class="requirements-label">الذاكرة</span>
                                    <span class="requirements-value">8 GB RAM</span>
                                </li>
                                <li class="requirements-item">
                                    <span class="requirements-label">بطاقة الرسومات</span>
                                    <span class="requirements-value">PlayStation 4 Pro GPU</span>
                                </li>
                                <li class="requirements-item">
                                    <span class="requirements-label">مساحة التخزين</span>
                                    <span class="requirements-value">${game.size}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" id="instructions">
                    <div class="instructions-content">
                        <h3>تعليمات التثبيت</h3>
                        <ol>
                            <li>قم بتنزيل ملفات اللعبة من الرابط المرفق.</li>
                            <li>قم بفك ضغط الملفات باستخدام برنامج فك الضغط المناسب.</li>
                            <li>انقل ملفات اللعبة إلى جهاز PlayStation 4 الخاص بك عبر محرك أقراص USB خارجي.</li>
                            <li>قم بتثبيت اللعبة باستخدام تطبيق Package Installer على جهاز PS4.</li>
                            <li>انتظر حتى اكتمال عملية التثبيت.</li>
                            <li>استمتع باللعبة!</li>
                        </ol>
                        
                        <div class="note">
                            <strong>ملاحظة:</strong> يجب أن يكون جهاز PS4 الخاص بك يعمل بنظام Jailbreak متوافق لتتمكن من تثبيت الألعاب المحمّلة.
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // عرض تفاصيل اللعبة
        gameDetailsContainer.innerHTML = gameDetailsHTML;
        
        // تحديث عنوان الصفحة
        document.title = `${game.titleAr || game.title} - 4GAMER`;
    }
    
    // تحميل الألعاب ذات الصلة
    function loadRelatedGames(gameId) {
        // الحصول على بيانات الألعاب من localStorage
        const games = JSON.parse(localStorage.getItem('games')) || [];
        
        // البحث عن اللعبة الحالية
        const currentGame = games.find(g => g.id == gameId);
        
        if (!currentGame) {
            return;
        }
        
        // البحث عن الألعاب ذات الصلة (نفس التصنيف أو المنصة)
        const relatedGames = games.filter(g => {
            return g.id != gameId && (g.category === currentGame.category || g.platform === currentGame.platform);
        }).slice(0, 4); // الحد الأقصى 4 ألعاب
        
        // عرض الألعاب ذات الصلة
        displayRelatedGames(relatedGames);
    }
    
    // عرض الألعاب ذات الصلة
    function displayRelatedGames(games) {
        const relatedGamesContainer = document.getElementById('related-games-container');
        
        if (!relatedGamesContainer || games.length === 0) {
            return;
        }
        
        // إنشاء عناصر الألعاب ذات الصلة
        relatedGamesContainer.innerHTML = '';
        
        games.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            
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
                    </div>
                    <div class="game-actions">
                        <a href="game-details.html?id=${game.id}" class="btn-details">التفاصيل</a>
                    </div>
                </div>
            `;
            
            relatedGamesContainer.appendChild(gameCard);
        });
    }
    
    // تهيئة أحداث علامات التبويب
    function initTabs() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('tab-btn')) {
                const tabId = e.target.getAttribute('data-tab');
                
                // إزالة الفئة النشطة من جميع الأزرار والمحتويات
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                // إضافة الفئة النشطة للزر والمحتوى المحدد
                e.target.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            }
        });
    }
    
    // إنشاء لقطات الشاشة
    function generateScreenshots(screenshots) {
        if (!screenshots || screenshots.length === 0) {
            return '<p>لا توجد لقطات شاشة متاحة</p>';
        }
        
        let screenshotsHTML = '';
        
        screenshots.forEach(screenshot => {
            screenshotsHTML += `
                <div class="screenshot">
                    <img src="${screenshot}" alt="لقطة شاشة" loading="lazy">
                </div>
            `;
        });
        
        return screenshotsHTML;
    }
    
    // إنشاء الوسوم
    function generateTags(tags) {
        if (!tags || tags.length === 0) {
            return '';
        }
        
        let tagsHTML = '';
        
        tags.forEach(tag => {
            tagsHTML += `<div class="game-tag">${getTagName(tag)}</div>`;
        });
        
        return tagsHTML;
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
    
    // تنسيق التاريخ
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
    
    // الحصول على اسم المنطقة
    function getRegionName(region) {
        const regions = {
            'usa': 'الولايات المتحدة',
            'europe': 'أوروبا',
            'japan': 'اليابان',
            'asia': 'آسيا'
        };
        
        return regions[region] || region;
    }
    
    // الحصول على اسم الوسم
    function getTagName(tag) {
        const tags = {
            'action': 'أكشن',
            'adventure': 'مغامرة',
            'rpg': 'لعب أدوار',
            'sports': 'رياضة',
            'racing': 'سباق',
            'fighting': 'قتال',
            'horror': 'رعب',
            'openworld': 'عالم مفتوح',
            'strategy': 'استراتيجية',
            'shooter': 'تصويب',
            'exclusive': 'حصرية',
            'multiplayer': 'متعددة اللاعبين',
            'vr': 'واقع افتراضي',
            'arabic': 'معربة',
            'converted': 'محولة'
        };
        
        return tags[tag] || tag;
    }
    
    // عرض رسالة خطأ
    function showError(message) {
        const gameDetailsContainer = document.getElementById('game-details-container');
        
        if (gameDetailsContainer) {
            gameDetailsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${message}</p>
                    <a href="ps4-games.html" class="btn">العودة إلى قائمة الألعاب</a>
                </div>
            `;
        }
    }
});
