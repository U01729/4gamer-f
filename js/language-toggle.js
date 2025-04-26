// ملف JavaScript لدعم تبديل اللغة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة زر تبديل اللغة
    initLanguageToggle();
    
    // تطبيق اللغة المحفوظة
    applyStoredLanguage();
    
    // تهيئة ترجمة النصوص
    initTranslations();
    
    // تهيئة زر تبديل اللغة
    function initLanguageToggle() {
        const languageToggleBtn = document.getElementById('language-toggle');
        
        if (languageToggleBtn) {
            languageToggleBtn.addEventListener('click', function() {
                toggleLanguage();
            });
        }
    }
    
    // تبديل اللغة
    function toggleLanguage() {
        const currentLang = document.documentElement.lang;
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        
        // تغيير اتجاه الصفحة ولغتها
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        
        // حفظ اللغة المفضلة
        localStorage.setItem('preferredLanguage', newLang);
        
        // تطبيق الترجمات
        translatePage(newLang);
        
        // تحديث أيقونة زر تبديل اللغة
        updateLanguageToggleIcon(newLang);
    }
    
    // تطبيق اللغة المحفوظة
    function applyStoredLanguage() {
        const storedLang = localStorage.getItem('preferredLanguage');
        
        if (storedLang && storedLang !== document.documentElement.lang) {
            document.documentElement.lang = storedLang;
            document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr';
            
            // تطبيق الترجمات
            translatePage(storedLang);
            
            // تحديث أيقونة زر تبديل اللغة
            updateLanguageToggleIcon(storedLang);
        }
    }
    
    // تحديث أيقونة زر تبديل اللغة
    function updateLanguageToggleIcon(lang) {
        const languageToggleBtn = document.getElementById('language-toggle');
        
        if (languageToggleBtn) {
            // تغيير نص الزر حسب اللغة
            if (lang === 'ar') {
                languageToggleBtn.innerHTML = '<i class="fas fa-globe"></i>';
                languageToggleBtn.setAttribute('aria-label', 'Switch to English');
            } else {
                languageToggleBtn.innerHTML = '<i class="fas fa-globe"></i>';
                languageToggleBtn.setAttribute('aria-label', 'التبديل إلى العربية');
            }
        }
    }
    
    // تهيئة ترجمة النصوص
    function initTranslations() {
        // إضافة سمات الترجمة للعناصر
        addTranslationAttributes();
    }
    
    // إضافة سمات الترجمة للعناصر
    function addTranslationAttributes() {
        // العناصر التي تحتاج إلى ترجمة
        const elementsToTranslate = [
            { selector: '.navbar-brand .brand-tagline', arText: 'منصة PlayStation العربية الأولى', enText: 'The First Arabic PlayStation Platform' },
            { selector: '.search-input', attribute: 'placeholder', arText: 'ابحث عن ألعاب، ثيمات، تطبيقات...', enText: 'Search for games, themes, apps...' },
            { selector: '.dropdown-item:nth-child(1) .dropdown-link span', arText: 'الرئيسية', enText: 'Home' },
            { selector: '.dropdown-item:nth-child(2) .dropdown-link span', arText: 'PS4', enText: 'PS4' },
            { selector: '.dropdown-item:nth-child(3) .dropdown-link span', arText: 'PS5', enText: 'PS5' },
            { selector: '.dropdown-item:nth-child(4) .dropdown-link span', arText: 'الجيلبريك', enText: 'Jailbreak' },
            { selector: '.dropdown-item:nth-child(5) .dropdown-link span', arText: 'الأخبار', enText: 'News' },
            { selector: '.dropdown-item:nth-child(6) .dropdown-link span', arText: 'الشروحات', enText: 'Tutorials' },
            { selector: '.dropdown-item:nth-child(7) .dropdown-link span', arText: 'الأسئلة الشائعة', enText: 'FAQ' },
            { selector: '.dropdown-item:nth-child(8) .dropdown-link span', arText: 'سياسة DMCA', enText: 'DMCA Policy' },
            { selector: '.dropdown-item:nth-child(9) .dropdown-link span', arText: 'من نحن', enText: 'About Us' },
            { selector: '.dropdown-item:nth-child(10) .dropdown-link span', arText: 'اتصل بنا', enText: 'Contact Us' },
            { selector: '.dropdown-item:nth-child(11) .dropdown-link span', arText: 'تسجيل دخول المسؤول', enText: 'Admin Login' },
            { selector: '.dropdown-subitem:nth-child(1) .dropdown-sublink', arText: 'ألعاب PS4', enText: 'PS4 Games' },
            { selector: '.dropdown-subitem:nth-child(2) .dropdown-sublink', arText: 'ثيمات PS4', enText: 'PS4 Themes' },
            { selector: '.dropdown-subitem:nth-child(3) .dropdown-sublink', arText: 'تطبيقات PS4', enText: 'PS4 Apps' },
            { selector: '.dropdown-subitem:nth-child(4) .dropdown-sublink', arText: 'تحديثات PS4', enText: 'PS4 Updates' },
            { selector: '.dropdown-subitem:nth-child(5) .dropdown-sublink', arText: 'GOLDHEN لـ PS4', enText: 'PS4 GOLDHEN' },
            { selector: '.page-title', arText: 'ألعاب PS4', enText: 'PS4 Games' },
            { selector: '.page-description', arText: 'مكتبة شاملة من ألعاب PlayStation 4 المعربة وغير المعربة، مع تحديثات مستمرة لأحدث الإصدارات', enText: 'A comprehensive library of PlayStation 4 games with Arabic support and regular updates for the latest releases' },
            { selector: '.filter-group:nth-child(1) label', arText: 'المنصة', enText: 'Platform' },
            { selector: '.filter-group:nth-child(2) label', arText: 'التصنيف', enText: 'Category' },
            { selector: '.filter-group:nth-child(3) label', arText: 'اللغة', enText: 'Language' },
            { selector: '.filter-group:nth-child(4) label', arText: 'المنطقة', enText: 'Region' },
            { selector: '.filter-group:nth-child(5) label', arText: 'الترتيب', enText: 'Sort By' },
            { selector: '#filter-apply', arText: 'تطبيق الفلاتر', enText: 'Apply Filters' },
            { selector: '#filter-reset', arText: 'إعادة ضبط', enText: 'Reset' },
            { selector: '.filter-tag[data-filter="all"]', arText: 'الكل', enText: 'All' },
            { selector: '.filter-tag[data-filter="arabic"]', arText: 'معربة', enText: 'Arabic' },
            { selector: '.filter-tag[data-filter="converted"]', arText: 'محولة', enText: 'Converted' },
            { selector: '.filter-tag[data-filter="new"]', arText: 'حديثة', enText: 'New' },
            { selector: '.filter-tag[data-filter="classic"]', arText: 'كلاسيكية', enText: 'Classic' },
            { selector: '.filter-tag[data-filter="exclusive"]', arText: 'حصرية', enText: 'Exclusive' },
            { selector: '.filter-tag[data-filter="multiplayer"]', arText: 'متعددة اللاعبين', enText: 'Multiplayer' },
            { selector: '.filter-tag[data-filter="vr"]', arText: 'واقع افتراضي', enText: 'VR' },
            { selector: '.sidebar-title:contains("المنصات")', arText: 'المنصات', enText: 'Platforms' },
            { selector: '.sidebar-title:contains("التصنيفات")', arText: 'التصنيفات', enText: 'Categories' },
            { selector: '.footer-logo-text', arText: '4GAMER', enText: '4GAMER' },
            { selector: '.footer-tagline', arText: 'منصة PlayStation العربية الأولى', enText: 'The First Arabic PlayStation Platform' },
            { selector: '.footer-links-title:nth-child(1)', arText: 'روابط سريعة', enText: 'Quick Links' },
            { selector: '.footer-links-title:nth-child(2)', arText: 'الدعم', enText: 'Support' },
            { selector: '.footer-links-title:nth-child(3)', arText: 'تابعنا', enText: 'Follow Us' },
            { selector: '.footer-copyright', arText: '© 2023 4GAMER. جميع الحقوق محفوظة.', enText: '© 2023 4GAMER. All Rights Reserved.' },
            { selector: '.telegram-link', arText: 'انضم للقناة', enText: 'Join Channel' }
        ];
        
        // إضافة سمات الترجمة
        elementsToTranslate.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            
            elements.forEach(element => {
                if (item.attribute) {
                    // إضافة سمات الترجمة للسمات
                    element.setAttribute('data-ar-' + item.attribute, item.arText);
                    element.setAttribute('data-en-' + item.attribute, item.enText);
                } else {
                    // إضافة سمات الترجمة للمحتوى النصي
                    element.setAttribute('data-ar-text', item.arText);
                    element.setAttribute('data-en-text', item.enText);
                }
            });
        });
    }
    
    // ترجمة الصفحة
    function translatePage(lang) {
        // ترجمة النصوص
        translateTexts(lang);
        
        // ترجمة السمات
        translateAttributes(lang);
        
        // ترجمة العناصر الخاصة
        translateSpecialElements(lang);
    }
    
    // ترجمة النصوص
    function translateTexts(lang) {
        // العناصر التي تحتوي على سمات الترجمة للنصوص
        const elements = document.querySelectorAll('[data-ar-text], [data-en-text]');
        
        elements.forEach(element => {
            const arText = element.getAttribute('data-ar-text');
            const enText = element.getAttribute('data-en-text');
            
            if (lang === 'ar' && arText) {
                element.textContent = arText;
            } else if (lang === 'en' && enText) {
                element.textContent = enText;
            }
        });
    }
    
    // ترجمة السمات
    function translateAttributes(lang) {
        // العناصر التي تحتوي على سمات الترجمة للسمات
        const attributesToTranslate = ['placeholder', 'title', 'alt', 'aria-label'];
        
        attributesToTranslate.forEach(attr => {
            const elements = document.querySelectorAll(`[data-ar-${attr}], [data-en-${attr}]`);
            
            elements.forEach(element => {
                const arValue = element.getAttribute(`data-ar-${attr}`);
                const enValue = element.getAttribute(`data-en-${attr}`);
                
                if (lang === 'ar' && arValue) {
                    element.setAttribute(attr, arValue);
                } else if (lang === 'en' && enValue) {
                    element.setAttribute(attr, enValue);
                }
            });
        });
    }
    
    // ترجمة العناصر الخاصة
    function translateSpecialElements(lang) {
        // ترجمة عناصر القائمة المنسدلة
        translateDropdownElements(lang);
        
        // ترجمة عناصر الفلاتر
        translateFilterElements(lang);
        
        // ترجمة عناصر تفاصيل اللعبة
        translateGameDetailsElements(lang);
    }
    
    // ترجمة عناصر القائمة المنسدلة
    function translateDropdownElements(lang) {
        // ترجمة خيارات القائمة المنسدلة
        const dropdownOptions = {
            'platform-filter': {
                'ar': {
                    'ps4': 'PS4',
                    'ps5': 'PS5',
                    'all': 'الكل'
                },
                'en': {
                    'ps4': 'PS4',
                    'ps5': 'PS5',
                    'all': 'All'
                }
            },
            'category-filter': {
                'ar': {
                    'all': 'الكل',
                    'action': 'أكشن',
                    'adventure': 'مغامرة',
                    'rpg': 'لعب أدوار',
                    'sports': 'رياضة',
                    'racing': 'سباق',
                    'fighting': 'قتال',
                    'horror': 'رعب',
                    'openworld': 'عالم مفتوح'
                },
                'en': {
                    'all': 'All',
                    'action': 'Action',
                    'adventure': 'Adventure',
                    'rpg': 'RPG',
                    'sports': 'Sports',
                    'racing': 'Racing',
                    'fighting': 'Fighting',
                    'horror': 'Horror',
                    'openworld': 'Open World'
                }
            },
            'language-filter': {
                'ar': {
                    'all': 'الكل',
                    'arabic': 'معربة',
                    'official-arabic': 'معربة رسمياً',
                    'non-arabic': 'غير معربة'
                },
                'en': {
                    'all': 'All',
                    'arabic': 'Arabic',
                    'official-arabic': 'Official Arabic',
                    'non-arabic': 'Non-Arabic'
                }
            },
            'region-filter': {
                'ar': {
                    'all': 'الكل',
                    'usa': 'USA',
                    'europe': 'Europe',
                    'japan': 'Japan',
                    'asia': 'Asia'
                },
                'en': {
                    'all': 'All',
                    'usa': 'USA',
                    'europe': 'Europe',
                    'japan': 'Japan',
                    'asia': 'Asia'
                }
            },
            'sort-filter': {
                'ar': {
                    'newest': 'الأحدث',
                    'oldest': 'الأقدم',
                    'alphabetical': 'أبجدي',
                    'size-asc': 'الحجم (تصاعدي)',
                    'size-desc': 'الحجم (تنازلي)'
                },
                'en': {
                    'newest': 'Newest',
                    'oldest': 'Oldest',
                    'alphabetical': 'Alphabetical',
                    'size-asc': 'Size (Ascending)',
                    'size-desc': 'Size (Descending)'
                }
            }
        };
        
        // تطبيق الترجمات على القوائم المنسدلة
        Object.keys(dropdownOptions).forEach(selectId => {
            const selectElement = document.getElementById(selectId);
            
            if (selectElement) {
                const options = selectElement.options;
                const translations = dropdownOptions[selectId][lang];
                
                for (let i = 0; i < options.length; i++) {
                    const optionValue = options[i].value;
                    
                    if (translations[optionValue]) {
                        options[i].textContent = translations[optionValue];
                    }
                }
            }
        });
    }
    
    // ترجمة عناصر الفلاتر
    function translateFilterElements(lang) {
        // ترجمة وسوم الفلاتر
        const filterTagTranslations = {
            'ar': {
                'all': '<i class="fas fa-th-large"></i> الكل',
                'arabic': '<i class="fas fa-language"></i> معربة',
                'converted': '<i class="fas fa-exchange-alt"></i> محولة',
                'new': '<i class="fas fa-star"></i> حديثة',
                'classic': '<i class="fas fa-history"></i> كلاسيكية',
                'exclusive': '<i class="fas fa-trophy"></i> حصرية',
                'multiplayer': '<i class="fas fa-users"></i> متعددة اللاعبين',
                'vr': '<i class="fas fa-vr-cardboard"></i> واقع افتراضي'
            },
            'en': {
                'all': '<i class="fas fa-th-large"></i> All',
                'arabic': '<i class="fas fa-language"></i> Arabic',
                'converted': '<i class="fas fa-exchange-alt"></i> Converted',
                'new': '<i class="fas fa-star"></i> New',
                'classic': '<i class="fas fa-history"></i> Classic',
                'exclusive': '<i class="fas fa-trophy"></i> Exclusive',
                'multiplayer': '<i class="fas fa-users"></i> Multiplayer',
                'vr': '<i class="fas fa-vr-cardboard"></i> VR'
            }
        };
        
        // تطبيق الترجمات على وسوم الفلاتر
        const filterTags = document.querySelectorAll('.filter-tag');
        
        filterTags.forEach(tag => {
            const filter = tag.getAttribute('data-filter');
            const translation = filterTagTranslations[lang][filter];
            
            if (translation) {
                tag.innerHTML = translation;
            }
        });
    }
    
    // ترجمة عناصر تفاصيل اللعبة
    function translateGameDetailsElements(lang) {
        // ترجمة علامات التبويب
        const tabTranslations = {
            'ar': {
                'screenshots': 'لقطات الشاشة',
                'requirements': 'متطلبات النظام',
                'instructions': 'تعليمات التثبيت'
            },
            'en': {
                'screenshots': 'Screenshots',
                'requirements': 'System Requirements',
                'instructions': 'Installation Instructions'
            }
        };
        
        // تطبيق الترجمات على علامات التبويب
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            const tabId = button.getAttribute('data-tab');
            const translation = tabTranslations[lang][tabId];
            
            if (translation) {
                button.textContent = translation;
            }
        });
        
        // ترجمة أزرار التفاصيل والتحميل
        const buttonTranslations = {
            'ar': {
                'details': 'التفاصيل',
                'download': 'تحميل',
                'trailer': 'مشاهدة الإعلان'
            },
            'en': {
                'details': 'Details',
                'download': 'Download',
                'trailer': 'Watch Trailer'
            }
        };
        
        // تطبيق الترجمات على الأزرار
        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.textContent = buttonTranslations[lang]['details'];
        });
        
        document.querySelectorAll('.btn-download').forEach(btn => {
            if (btn.querySelector('i')) {
                btn.innerHTML = `<i class="fas fa-download"></i> ${buttonTranslations[lang]['download']}`;
            } else {
                btn.textContent = buttonTranslations[lang]['download'];
            }
        });
        
        document.querySelectorAll('.btn-trailer').forEach(btn => {
            if (btn.querySelector('i')) {
                btn.innerHTML = `<i class="fab fa-youtube"></i> ${buttonTranslations[lang]['trailer']}`;
            } else {
                btn.textContent = buttonTranslations[lang]['trailer'];
            }
        });
    }
});
