// ملف ربط لوحة الإدارة بصفحات الألعاب
// عرض الألعاب المضافة من لوحة الإدارة في صفحات الألعاب المناسبة

document.addEventListener('DOMContentLoaded', function() {
    // تحديد نوع الصفحة الحالية
    const currentPage = getCurrentPage();
    
    // تحميل الألعاب المناسبة للصفحة الحالية
    if (currentPage === 'ps4-games') {
        loadGamesForPage('ps4');
    } else if (currentPage === 'ps5-games') {
        loadGamesForPage('ps5');
    }
    
    // تحديث مؤشر تحديث الصفحة
    if (currentPage === 'ps4-games') {
        localStorage.removeItem('4gamer_update_ps4_games');
    } else if (currentPage === 'ps5-games') {
        localStorage.removeItem('4gamer_update_ps5_games');
    }
});

// تحديد نوع الصفحة الحالية
function getCurrentPage() {
    const path = window.location.pathname;
    const pageName = path.split('/').pop().split('.')[0];
    return pageName;
}

// تحميل الألعاب المناسبة للصفحة الحالية
function loadGamesForPage(platform) {
    // الحصول على قائمة الألعاب من التخزين المحلي
    const games = getGames();
    
    // تصفية الألعاب حسب المنصة
    const filteredGames = games.filter(game => {
        return game.platform.toLowerCase() === platform || game.platform.toLowerCase() === 'both';
    });
    
    // ترتيب الألعاب حسب تاريخ الإضافة (الأحدث أولاً)
    filteredGames.sort((a, b) => {
        return new Date(b.date_added) - new Date(a.date_added);
    });
    
    // عرض الألعاب في الصفحة
    displayGames(filteredGames);
}

// الحصول على قائمة الألعاب
function getGames() {
    // التحقق من وجود ألعاب في التخزين المحلي
    const games = localStorage.getItem('4gamer_games');
    
    if (games) {
        return JSON.parse(games);
    }
    
    return [];
}

// عرض الألعاب في الصفحة
function displayGames(games) {
    // البحث عن حاوية الألعاب في الصفحة
    const gamesContainer = document.querySelector('.games-grid');
    
    if (!gamesContainer) {
        console.error('لم يتم العثور على حاوية الألعاب في الصفحة');
        return;
    }
    
    // إضافة الألعاب المضافة من لوحة الإدارة
    games.forEach(game => {
        // التحقق من عدم وجود اللعبة بالفعل في الصفحة
        const existingGame = document.querySelector(`.game-card[data-id="${game.id}"]`);
        if (existingGame) {
            return;
        }
        
        // إنشاء بطاقة اللعبة
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.setAttribute('data-id', game.id);
        
        // تحديد صورة افتراضية إذا لم تكن متوفرة
        const imageUrl = game.image || 'images/placeholder-game.jpg';
        
        // إنشاء محتوى بطاقة اللعبة
        gameCard.innerHTML = `
            <div class="game-card-image">
                <img src="${imageUrl}" alt="${game.title}" loading="lazy">
                <div class="game-card-overlay">
                    <a href="${game.download_link || '#'}" class="download-btn">تحميل</a>
                </div>
            </div>
            <div class="game-card-content">
                <h3 class="game-title">${game.title}</h3>
                <div class="game-meta">
                    <span class="game-platform">${game.platform}</span>
                    <span class="game-region">${game.region}</span>
                    <span class="game-size">${game.size}</span>
                </div>
                <div class="game-language">
                    <span class="language-badge ${game.language.includes('العربية') ? 'arabic' : ''}">
                        <i class="fas fa-language"></i> ${game.language}
                    </span>
                </div>
            </div>
        `;
        
        // إضافة بطاقة اللعبة إلى حاوية الألعاب
        gamesContainer.prepend(gameCard);
        
        // إضافة تأثير ظهور تدريجي
        setTimeout(() => {
            gameCard.classList.add('fade-in');
        }, 100);
        
        // إضافة مستمع حدث للنقر على بطاقة اللعبة
        gameCard.addEventListener('click', function(event) {
            // تجاهل النقر على زر التحميل
            if (event.target.classList.contains('download-btn')) {
                return;
            }
            
            // عرض تفاصيل اللعبة
            showGameDetails(game);
        });
    });
}

// عرض تفاصيل اللعبة
function showGameDetails(game) {
    // إنشاء نافذة منبثقة لعرض تفاصيل اللعبة
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    
    // تحديد صورة افتراضية إذا لم تكن متوفرة
    const imageUrl = game.image || 'images/placeholder-game.jpg';
    
    modal.innerHTML = `
        <div class="game-modal-content">
            <button class="modal-close" title="إغلاق"><i class="fas fa-times"></i></button>
            <div class="game-modal-header">
                <img src="${imageUrl}" alt="${game.title}" class="game-modal-image">
                <div class="game-modal-title">
                    <h2>${game.title}</h2>
                    <div class="game-meta">
                        <span class="game-platform">${game.platform}</span>
                        <span class="game-region">${game.region}</span>
                        <span class="game-size">${game.size}</span>
                    </div>
                    <div class="game-language">
                        <span class="language-badge ${game.language.includes('العربية') ? 'arabic' : ''}">
                            <i class="fas fa-language"></i> ${game.language}
                        </span>
                    </div>
                </div>
            </div>
            <div class="game-modal-body">
                <div class="game-description">
                    <h3>وصف اللعبة</h3>
                    <p>${game.description || 'لا يوجد وصف متاح لهذه اللعبة.'}</p>
                </div>
                <div class="game-details">
                    <h3>تفاصيل اللعبة</h3>
                    <ul>
                        <li><strong>المنصة:</strong> ${game.platform}</li>
                        <li><strong>المنطقة:</strong> ${game.region}</li>
                        <li><strong>الحجم:</strong> ${game.size}</li>
                        <li><strong>اللغة:</strong> ${game.language}</li>
                        <li><strong>تاريخ الإضافة:</strong> ${game.date_added}</li>
                    </ul>
                </div>
            </div>
            <div class="game-modal-footer">
                <a href="${game.download_link || '#'}" class="download-btn" target="_blank">
                    <i class="fas fa-download"></i> تحميل اللعبة
                </a>
            </div>
        </div>
    `;
    
    // إضافة النافذة المنبثقة إلى الصفحة
    document.body.appendChild(modal);
    
    // إظهار النافذة المنبثقة
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // إضافة مستمع حدث لزر الإغلاق
    modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.classList.remove('show');
        
        // إزالة النافذة المنبثقة بعد انتهاء الرسوم المتحركة
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // إغلاق النافذة المنبثقة عند النقر خارجها
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
            
            // إزالة النافذة المنبثقة بعد انتهاء الرسوم المتحركة
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
}

// إضافة أنماط CSS للنافذة المنبثقة وتأثيرات الظهور
(function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeIn 0.5s ease forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .game-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .game-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .game-modal-content {
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: translateY(-30px);
            transition: transform 0.3s ease;
        }
        
        .game-modal.show .game-modal-content {
            transform: translateY(0);
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            left: 15px;
            background: rgba(0, 0, 0, 0.5);
            border: none;
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1.2rem;
            z-index: 10;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(255, 0, 0, 0.7);
            transform: rotate(90deg);
        }
        
        .game-modal-header {
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        .game-modal-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-radius: var(--border-radius) var(--border-radius) 0 0;
        }
        
        .game-modal-title {
            padding: 20px;
            background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
            position: absolute;
            bottom: 0;
            width: 100%;
            color: white;
        }
        
        .game-modal-title h2 {
            margin: 0 0 10px 0;
            font-size: 1.8rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        
        .game-modal-body {
            padding: 20px;
        }
        
        .game-description, .game-details {
            margin-bottom: 20px;
        }
        
        .game-description h3, .game-details h3 {
            color: var(--primary-color);
            margin-bottom: 10px;
            font-size: 1.3rem;
        }
        
        .game-description p {
            line-height: 1.6;
            color: var(--text-color);
        }
        
        .game-details ul {
            list-style: none;
            padding: 0;
        }
        
        .game-details li {
            padding: 8px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-between;
        }
        
        .game-details li:last-child {
            border-bottom: none;
        }
        
        .game-details li strong {
            color: var(--text-light);
        }
        
        .game-modal-footer {
            padding: 20px;
            display: flex;
            justify-content: center;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        
        .game-modal-footer .download-btn {
            background-color: var(--primary-color);
            color: white;
            padding: 12px 25px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
        }
        
        .game-modal-footer .download-btn:hover {
            background-color: var(--accent-color);
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        @media (min-width: 768px) {
            .game-modal-header {
                flex-direction: row;
                align-items: stretch;
            }
            
            .game-modal-image {
                width: 40%;
                height: auto;
                border-radius: var(--border-radius) 0 0 0;
            }
            
            .game-modal-title {
                position: static;
                width: 60%;
                background: none;
                color: var(--text-color);
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            
            .game-modal-title h2 {
                color: var(--heading-color);
                text-shadow: none;
            }
        }
    `;
    document.head.appendChild(style);
})();
