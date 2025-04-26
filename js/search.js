/**
 * 4GAMER Website - Search Functionality
 * وظيفة البحث لموقع 4GAMER
 */

// تهيئة وظيفة البحث عند تحميل المستند
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initThemeToggle();
});

// دالة تهيئة وظيفة البحث
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchIcon = document.querySelector('.search-icon');
    
    if (!searchInput || !searchResults) return;
    
    // قاعدة بيانات البحث (للعرض التوضيحي فقط)
    // في الإصدار النهائي، يمكن تحميل هذه البيانات من ملف JSON أو API
    const searchDatabase = [
        {
            id: 1,
            title: "God of War Ragnarök",
            category: "ألعاب PS5",
            description: "مغامرة ملحمية في عالم الأساطير الإسكندنافية",
            tags: ["أكشن", "مغامرة", "PS5", "معربة"],
            platform: "PS5",
            language: "معربة رسمياً",
            region: "USA",
            genre: "أكشن",
            url: "game-details.html?id=1&platform=PS5"
        },
        {
            id: 2,
            title: "Horizon Forbidden West",
            category: "ألعاب PS5",
            description: "استكشف عالماً مفتوحاً مليئاً بالآلات والمخاطر",
            tags: ["أكشن", "مغامرة", "عالم مفتوح", "PS5", "معربة"],
            platform: "PS5",
            language: "معربة رسمياً",
            region: "Europe",
            genre: "عالم مفتوح",
            url: "game-details.html?id=2&platform=PS5"
        },
        {
            id: 3,
            title: "Spider-Man 2",
            category: "ألعاب PS5",
            description: "انطلق في مغامرة جديدة كالرجل العنكبوت في مدينة نيويورك",
            tags: ["أكشن", "مغامرة", "عالم مفتوح", "PS5", "معربة"],
            platform: "PS5",
            language: "معربة رسمياً",
            region: "USA",
            genre: "أكشن",
            url: "game-details.html?id=3&platform=PS5"
        },
        {
            id: 4,
            title: "The Last of Us Part II",
            category: "ألعاب PS4",
            description: "قصة مؤثرة في عالم ما بعد نهاية العالم",
            tags: ["أكشن", "مغامرة", "PS4", "معربة"],
            platform: "PS4",
            language: "معربة رسمياً",
            region: "USA",
            genre: "أكشن",
            url: "game-details.html?id=4&platform=PS4"
        },
        {
            id: 5,
            title: "Ghost of Tsushima",
            category: "ألعاب PS4",
            description: "ملحمة الساموراي في اليابان القديمة",
            tags: ["أكشن", "مغامرة", "عالم مفتوح", "PS4", "معربة"],
            platform: "PS4",
            language: "معربة رسمياً",
            region: "USA",
            genre: "عالم مفتوح",
            url: "game-details.html?id=5&platform=PS4"
        },
        {
            id: 6,
            title: "ثيم God of War",
            category: "ثيمات PS4",
            description: "ثيم ديناميكي مستوحى من لعبة God of War",
            tags: ["ثيمات", "PS4", "ديناميكي"],
            platform: "PS4",
            language: "غير معربة",
            region: "USA",
            genre: "ثيمات",
            url: "themes.html#theme-1"
        },
        {
            id: 7,
            title: "ثيم Spider-Man",
            category: "ثيمات PS4",
            description: "ثيم ديناميكي مستوحى من لعبة Spider-Man",
            tags: ["ثيمات", "PS4", "ديناميكي"],
            platform: "PS4",
            language: "غير معربة",
            region: "USA",
            genre: "ثيمات",
            url: "themes.html#theme-2"
        },
        {
            id: 8,
            title: "تطبيق Netflix",
            category: "تطبيقات",
            description: "شاهد الأفلام والمسلسلات على جهازك",
            tags: ["تطبيقات", "PS5", "PS4", "ترفيه"],
            platform: "PS5",
            language: "غير معربة",
            region: "All",
            genre: "تطبيقات",
            url: "apps.html#app-1"
        },
        {
            id: 9,
            title: "تطبيق Spotify",
            category: "تطبيقات",
            description: "استمع إلى الموسيقى أثناء اللعب",
            tags: ["تطبيقات", "PS5", "PS4", "موسيقى"],
            platform: "PS5",
            language: "غير معربة",
            region: "All",
            genre: "تطبيقات",
            url: "apps.html#app-2"
        },
        {
            id: 10,
            title: "GOLDHEN لـ PS4",
            category: "جيلبريك",
            description: "أحدث إصدار من GOLDHEN لأجهزة PS4",
            tags: ["جيلبريك", "PS4", "GOLDHEN"],
            platform: "PS4",
            language: "غير معربة",
            region: "All",
            genre: "جيلبريك",
            url: "jailbreak.html#ps4"
        },
        {
            id: 11,
            title: "GOLDHEN لـ PS5",
            category: "جيلبريك",
            description: "أحدث إصدار من GOLDHEN لأجهزة PS5",
            tags: ["جيلبريك", "PS5", "GOLDHEN"],
            platform: "PS5",
            language: "غير معربة",
            region: "All",
            genre: "جيلبريك",
            url: "jailbreak.html#ps5"
        },
        {
            id: 12,
            title: "تحديث PS5 الجديد",
            category: "أخبار",
            description: "تحديث جديد لنظام PS5 يضيف ميزات مطلوبة",
            tags: ["أخبار", "PS5", "تحديثات"],
            platform: "PS5",
            language: "غير معربة",
            region: "All",
            genre: "أخبار",
            url: "news-details.html?id=1"
        },
        {
            id: 13,
            title: "الإعلان عن God of War Ragnarök",
            category: "أخبار",
            description: "الإعلان عن موعد إصدار توسعة God of War Ragnarök",
            tags: ["أخبار", "PS5", "God of War"],
            platform: "PS5",
            language: "غير معربة",
            region: "All",
            genre: "أخبار",
            url: "news-details.html?id=2"
        },
        {
            id: 14,
            title: "تسريبات PlayStation 5 Pro",
            category: "أخبار",
            description: "تسريبات جديدة حول PlayStation 5 Pro المرتقب",
            tags: ["أخبار", "PS5", "PlayStation 5 Pro"],
            platform: "PS5",
            language: "غير معربة",
            region: "All",
            genre: "أخبار",
            url: "news-details.html?id=3"
        },
        {
            id: 15,
            title: "تحديث نظام PS4",
            category: "تحديثات",
            description: "أحدث تحديث لنظام PS4 مع شرح للميزات الجديدة",
            tags: ["تحديثات", "PS4", "نظام"],
            platform: "PS4",
            language: "غير معربة",
            region: "All",
            genre: "تحديثات",
            url: "updates.html#ps4"
        },
        {
            id: 16,
            title: "تحديث نظام PS5",
            category: "تحديثات",
            description: "أحدث تحديث لنظام PS5 مع شرح للميزات الجديدة",
            tags: ["تحديثات", "PS5", "نظام"],
            platform: "PS5",
            language: "غير معربة",
            region: "All",
            genre: "تحديثات",
            url: "updates.html#ps5"
        }
    ];
    
    // فئات البحث
    const searchCategories = [
        { name: "الكل", value: "all" },
        { name: "ألعاب PS5", value: "ps5-games" },
        { name: "ألعاب PS4", value: "ps4-games" },
        { name: "ثيمات", value: "themes" },
        { name: "تطبيقات", value: "apps" },
        { name: "جيلبريك", value: "jailbreak" },
        { name: "تحديثات", value: "updates" },
        { name: "أخبار", value: "news" }
    ];
    
    // إنشاء قسم الفلاتر
    const filtersSection = document.createElement('div');
    filtersSection.className = 'search-filters';
    
    // إنشاء زر تبديل الفلاتر
    const filterToggle = document.createElement('div');
    filterToggle.className = 'search-filter-toggle';
    filterToggle.innerHTML = `
        <span class="search-filter-toggle-text">خيارات البحث المتقدم</span>
        <i class="fas fa-chevron-down search-filter-toggle-icon"></i>
    `;
    
    // إنشاء محتوى الفلاتر
    const filterContent = document.createElement('div');
    filterContent.className = 'search-filter-content';
    filterContent.style.display = 'none';
    
    // إضافة فلاتر البحث
    const filters = [
        {
            id: 'platform-filter',
            label: 'المنصة',
            options: [
                { value: 'all', text: 'الكل' },
                { value: 'ps5', text: 'PS5' },
                { value: 'ps4', text: 'PS4' },
                { value: 'ps3', text: 'PS3' }
            ]
        },
        {
            id: 'category-filter',
            label: 'التصنيف',
            options: [
                { value: 'all', text: 'الكل' },
                { value: 'action', text: 'أكشن' },
                { value: 'adventure', text: 'مغامرة' },
                { value: 'rpg', text: 'لعب أدوار' },
                { value: 'sports', text: 'رياضة' },
                { value: 'racing', text: 'سباق' },
                { value: 'fighting', text: 'قتال' },
                { value: 'horror', text: 'رعب' },
                { value: 'openworld', text: 'عالم مفتوح' }
            ]
        },
        {
            id: 'language-filter',
            label: 'اللغة',
            options: [
                { value: 'all', text: 'الكل' },
                { value: 'arabic', text: 'معربة' },
                { value: 'official-arabic', text: 'معربة رسمياً' },
                { value: 'non-arabic', text: 'غير معربة' }
            ]
        },
        {
            id: 'region-filter',
            label: 'المنطقة',
            options: [
                { value: 'all', text: 'الكل' },
                { value: 'usa', text: 'USA' },
                { value: 'europe', text: 'Europe' },
                { value: 'japan', text: 'Japan' },
                { value: 'asia', text: 'Asia' }
            ]
        },
        {
            id: 'sort-filter',
            label: 'الترتيب',
            options: [
                { value: 'newest', text: 'الأحدث' },
                { value: 'oldest', text: 'الأقدم' },
                { value: 'alphabetical', text: 'أبجدي' },
                { value: 'size-asc', text: 'الحجم (تصاعدي)' },
                { value: 'size-desc', text: 'الحجم (تنازلي)' }
            ]
        }
    ];
    
    // إنشاء عناصر الفلاتر
    filters.forEach(filter => {
        const filterGroup = document.createElement('div');
        filterGroup.className = 'search-filter-group';
        
        const filterLabel = document.createElement('label');
        filterLabel.className = 'search-filter-label';
        filterLabel.setAttribute('for', filter.id);
        filterLabel.textContent = filter.label;
        
        const filterSelect = document.createElement('select');
        filterSelect.className = 'search-filter-select';
        filterSelect.id = filter.id;
        
        filter.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            filterSelect.appendChild(optionElement);
        });
        
        filterGroup.appendChild(filterLabel);
        filterGroup.appendChild(filterSelect);
        filterContent.appendChild(filterGroup);
    });
    
    // إضافة أزرار الفلاتر
    const filterButtons = document.createElement('div');
    filterButtons.className = 'search-filter-buttons';
    
    const applyButton = document.createElement('button');
    applyButton.className = 'search-filter-apply';
    applyButton.textContent = 'تطبيق الفلاتر';
    
    const resetButton = document.createElement('button');
    resetButton.className = 'search-filter-reset';
    resetButton.textContent = 'إعادة ضبط';
    
    filterButtons.appendChild(applyButton);
    filterButtons.appendChild(resetButton);
    filterContent.appendChild(filterButtons);
    
    // إضافة مستمع أحداث لزر تبديل الفلاتر
    filterToggle.addEventListener('click', function() {
        const isVisible = filterContent.style.display !== 'none';
        filterContent.style.display = isVisible ? 'none' : 'grid';
        this.classList.toggle('active', !isVisible);
    });
    
    // إضافة مستمع أحداث لزر تطبيق الفلاتر
    applyButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    // إضافة مستمع أحداث لزر إعادة ضبط الفلاتر
    resetButton.addEventListener('click', function() {
        // إعادة ضبط جميع الفلاتر إلى القيمة الافتراضية
        filters.forEach(filter => {
            document.getElementById(filter.id).selectedIndex = 0;
        });
        
        // إعادة البحث
        performSearch(searchInput.value);
    });
    
    // إضافة الفلاتر إلى قسم الفلاتر
    filtersSection.appendChild(filterToggle);
    filtersSection.appendChild(filterContent);
    
    // إنشاء فئات البحث
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'search-categories';
    
    searchCategories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'search-category';
        categoryElement.textContent = category.name;
        categoryElement.dataset.value = category.value;
        
        if (category.value === 'all') {
            categoryElement.classList.add('active');
        }
        
        categoryElement.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع الفئات
            document.querySelectorAll('.search-category').forEach(cat => {
                cat.classList.remove('active');
            });
            
            // إضافة الفئة النشطة للفئة المحددة
            this.classList.add('active');
            
            // إعادة البحث باستخدام الفئة المحددة
            performSearch(searchInput.value);
        });
        
        categoriesContainer.appendChild(categoryElement);
    });
    
    // إضافة قسم الفلاتر إلى نتائج البحث
    searchResults.appendChild(filtersSection);
    
    // إضافة فئات البحث إلى نتائج البحث
    searchResults.appendChild(categoriesContainer);
    
    // إضافة مستمع أحداث للبحث
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        if (query.length > 0) {
            // إظهار نتائج البحث
            searchResults.classList.add('active');
            filtersSection.classList.add('active');
            
            // إظهار رمز التحميل
            searchResults.innerHTML = '<div class="search-loading">جاري البحث...</div>';
            
            // إعادة إضافة الفلاتر وفئات البحث
            searchResults.appendChild(filtersSection);
            searchResults.appendChild(categoriesContainer);
            
            // تأخير بسيط لمحاكاة البحث
            setTimeout(() => {
                performSearch(query);
            }, 300);
        } else {
            // إخفاء نتائج البحث إذا كان حقل البحث فارغًا
            searchResults.classList.remove('active');
            filtersSection.classList.remove('active');
        }
    });
    
    // إضافة مستمع أحداث للنقر خارج نتائج البحث
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.classList.remove('active');
            filtersSection.classList.remove('active');
        }
    });
    
    // إضافة مستمع أحداث للنقر على أيقونة البحث
    searchIcon.addEventListener('click', function() {
        searchInput.focus();
    });
    
    // دالة تنفيذ البحث
    function performSearch(query) {
        if (query.length === 0) {
            searchResults.classList.remove('active');
            filtersSection.classList.remove('active');
            return;
        }
        
        // الحصول على الفئة المحددة
        const selectedCategory = document.querySelector('.search-category.active');
        const categoryValue = selectedCategory ? selectedCategory.dataset.value : 'all';
        
        // الحصول على قيم الفلاتر
        const platformFilter = document.getElementById('platform-filter').value;
        const categoryFilter = document.getElementById('category-filter').value;
        const languageFilter = document.getElementById('language-filter').value;
        const regionFilter = document.getElementById('region-filter').value;
        const sortFilter = document.getElementById('sort-filter').value;
        
        // تنفيذ البحث
        let results = [];
        
        // تحويل الاستعلام إلى حروف صغيرة للمقارنة
        const queryLower = query.toLowerCase();
        
        // البحث في قاعدة البيانات
        searchDatabase.forEach(item => {
            // التحقق من الفئة
            if (categoryValue !== 'all') {
                const categoryMatch = item.category.toLowerCase().includes(categoryValue) || 
                                     item.tags.some(tag => tag.toLowerCase().includes(categoryValue));
                if (!categoryMatch) return;
            }
            
            // التحقق من الفلاتر
            if (platformFilter !== 'all' && !item.platform.toLowerCase().includes(platformFilter.toLowerCase())) return;
            if (categoryFilter !== 'all' && !item.genre.toLowerCase().includes(categoryFilter.toLowerCase())) return;
            if (languageFilter !== 'all' && !item.language.toLowerCase().includes(languageFilter.toLowerCase())) return;
            if (regionFilter !== 'all' && item.region !== 'All' && !item.region.toLowerCase().includes(regionFilter.toLowerCase())) return;
            
            // البحث في العنوان والوصف والفئة والعلامات
            const titleMatch = item.title.toLowerCase().includes(queryLower);
            const descriptionMatch = item.description.toLowerCase().includes(queryLower);
            const categoryMatch = item.category.toLowerCase().includes(queryLower);
            const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(queryLower));
            
            if (titleMatch || descriptionMatch || categoryMatch || tagsMatch) {
                // إنشاء نسخة من العنصر مع تمييز الكلمات المطابقة
                const resultItem = { ...item };
                
                // تمييز الكلمات المطابقة في العنوان
                if (titleMatch) {
                    resultItem.titleHighlighted = highlightText(item.title, queryLower);
                } else {
                    resultItem.titleHighlighted = item.title;
                }
                
                // تمييز الكلمات المطابقة في الوصف
                if (descriptionMatch) {
                    resultItem.descriptionHighlighted = highlightText(item.description, queryLower);
                } else {
                    resultItem.descriptionHighlighted = item.description;
                }
                
                results.push(resultItem);
            }
        });
        
        // ترتيب النتائج
        if (sortFilter === 'newest') {
            // افتراضياً، النتائج مرتبة بالفعل من الأحدث إلى الأقدم
        } else if (sortFilter === 'oldest') {
            results.reverse();
        } else if (sortFilter === 'alphabetical') {
            results.sort((a, b) => a.title.localeCompare(b.title));
        }
        
        // عرض النتائج
        displayResults(results, query);
    }
    
    // دالة تمييز النص المطابق
    function highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    // دالة عرض نتائج البحث
    function displayResults(results, query) {
        // إزالة نتائج البحث السابقة
        searchResults.innerHTML = '';
        
        // إعادة إضافة الفلاتر وفئات البحث
        searchResults.appendChild(filtersSection);
        searchResults.appendChild(categoriesContainer);
        
        // التحقق من وجود نتائج
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'search-no-results';
            noResults.textContent = `لا توجد نتائج لـ "${query}"`;
            searchResults.appendChild(noResults);
            return;
        }
        
        // إنشاء عناصر النتائج
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <div class="search-result-title">${result.titleHighlighted}</div>
                <div class="search-result-category">${result.category}</div>
                <div class="search-result-description">${result.descriptionHighlighted}</div>
            `;
            
            // إضافة مستمع أحداث للنقر على النتيجة
            resultItem.addEventListener('click', function() {
                window.location.href = result.url;
            });
            
            searchResults.appendChild(resultItem);
        });
    }
}

// دالة تهيئة زر تبديل السمة
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    
    // التحقق من السمة المحفوظة
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeToggleIcon(savedTheme);
    }
    
    // إضافة مستمع أحداث لزر تبديل السمة
    themeToggleBtn.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // تحديث السمة
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // تحديث أيقونة الزر
        updateThemeToggleIcon(newTheme);
    });
    
    // دالة تحديث أيقونة زر تبديل السمة
    function updateThemeToggleIcon(theme) {
        const icon = themeToggleBtn.querySelector('i');
        if (!icon) return;
        
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggleBtn.setAttribute('title', 'تفعيل الوضع المضيء');
        } else {
            icon.className = 'fas fa-moon';
            themeToggleBtn.setAttribute('title', 'تفعيل الوضع المظلم');
        }
    }
}
