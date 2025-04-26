// ملف JavaScript للصفحة الرئيسية
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة البانر المتحرك
    initHeroSlider();
    
    // تحميل الألعاب المميزة
    loadFeaturedGames();
    
    // تهيئة البانر المتحرك
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-nav-dot');
        let currentSlide = 0;
        let slideInterval;
        
        // بدء العرض التلقائي
        startSlideShow();
        
        // أحداث النقر على نقاط التنقل
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const slideIndex = parseInt(this.getAttribute('data-slide'));
                showSlide(slideIndex);
            });
        });
        
        // بدء العرض التلقائي
        function startSlideShow() {
            // إيقاف العرض التلقائي الحالي إذا كان موجوداً
            if (slideInterval) {
                clearInterval(slideInterval);
            }
            
            // بدء العرض التلقائي الجديد
            slideInterval = setInterval(() => {
                nextSlide();
            }, 5000); // تغيير الشريحة كل 5 ثوانٍ
        }
        
        // عرض الشريحة التالية
        function nextSlide() {
            showSlide((currentSlide + 1) % slides.length);
        }
        
        // عرض شريحة محددة
        function showSlide(index) {
            // إخفاء الشريحة الحالية
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            // عرض الشريحة الجديدة
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
            
            // إعادة تشغيل العرض التلقائي
            startSlideShow();
        }
    }
    
    // تحميل الألعاب المميزة
    function loadFeaturedGames() {
        const featuredGamesContainer = document.getElementById('featured-games');
        
        if (!featuredGamesContainer) {
            return;
        }
        
        // الحصول على بيانات الألعاب من localStorage
        const games = JSON.parse(localStorage.getItem('games')) || [];
        
        // اختيار الألعاب المميزة (أعلى تقييماً)
        const featuredGames = games.sort((a, b) => b.rating - a.rating).slice(0, 4);
        
        // عرض الألعاب المميزة
        featuredGamesContainer.innerHTML = '';
        
        featuredGames.forEach(game => {
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
            
            featuredGamesContainer.appendChild(gameCard);
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
