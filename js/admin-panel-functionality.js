// ملف وظائف لوحة الإدارة
// تنفيذ وظائف إدارة المحتوى الحقيقي للموقع

// متغير عام لتتبع ما إذا كانت الصفحة قد تم تحميلها بالفعل
let isPageLoaded = false;

document.addEventListener('DOMContentLoaded', function() {
    // منع إعادة التحميل المتكرر
    if (isPageLoaded) {
        return;
    }
    isPageLoaded = true;
    
    // التحقق من تسجيل الدخول
    if (!localStorage.getItem('4gamer_admin_logged_in')) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // تهيئة التبويبات
    initTabs();
    
    // تحميل الإحصائيات
    loadStatistics();
    
    // تهيئة إدارة الألعاب
    initGamesManagement();
    
    // تهيئة إدارة الاقتراحات
    initSuggestionsManagement();
    
    // تهيئة إدارة المستخدمين
    initUserManagement();
    
    // تهيئة زر تسجيل الخروج
    document.getElementById('logout-btn').addEventListener('click', function() {
        logout();
    });
});

// تهيئة التبويبات
function initTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع التبويبات
            tabs.forEach(t => t.classList.remove('active'));
            
            // إضافة الفئة النشطة للتبويب المحدد
            this.classList.add('active');
            
            // إخفاء جميع محتويات التبويبات
            tabContents.forEach(content => content.classList.remove('active'));
            
            // إظهار محتوى التبويب المحدد
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// تحميل الإحصائيات
function loadStatistics() {
    // الحصول على الإحصائيات من التخزين المحلي
    const gamesCount = getGamesCount();
    const suggestionsCount = getSuggestionsCount();
    const usersCount = getUsersCount();
    const visitorsCount = getVisitorsCount();
    
    // تحديث الإحصائيات في الواجهة
    document.getElementById('total-games').textContent = gamesCount;
    document.getElementById('total-suggestions').textContent = suggestionsCount;
    document.getElementById('total-admins').textContent = usersCount;
    document.getElementById('total-visits').textContent = visitorsCount;
}

// الحصول على عدد الألعاب
function getGamesCount() {
    // التحقق من وجود ألعاب في التخزين المحلي
    const games = localStorage.getItem('4gamer_games');
    
    if (games) {
        return JSON.parse(games).length;
    }
    
    // إذا لم تكن هناك ألعاب، إرجاع 0
    return 0;
}

// الحصول على عدد الاقتراحات
function getSuggestionsCount() {
    // التحقق من وجود اقتراحات في التخزين المحلي
    const suggestions = localStorage.getItem('4gamer_suggestions');
    
    if (suggestions) {
        return JSON.parse(suggestions).length;
    }
    
    // إذا لم تكن هناك اقتراحات، إرجاع 0
    return 0;
}

// الحصول على عدد المستخدمين النشطين
function getUsersCount() {
    // التحقق من وجود مستخدمين في التخزين المحلي
    const users = localStorage.getItem('4gamer_users');
    
    if (users) {
        // حساب عدد المستخدمين النشطين فقط
        return JSON.parse(users).filter(user => user.active).length;
    }
    
    // إذا لم يكن هناك مستخدمين، إرجاع 1 (المستخدم الرئيسي)
    return 1;
}

// الحصول على عدد الزوار
function getVisitorsCount() {
    // التحقق من وجود عداد الزوار في التخزين المحلي
    const visitors = localStorage.getItem('4gamer_visitors_count');
    
    if (visitors) {
        return parseInt(visitors);
    }
    
    // إذا لم يكن هناك عداد، إرجاع 0
    return 0;
}

// تهيئة إدارة الألعاب
function initGamesManagement() {
    // تحميل قائمة الألعاب
    loadGames();
    
    // تهيئة زر إضافة لعبة
    const addGameBtn = document.getElementById('add-game-btn');
    const addGameForm = document.getElementById('add-game-form');
    const cancelGameBtn = document.getElementById('cancel-game-btn');
    
    if (addGameBtn && addGameForm && cancelGameBtn) {
        addGameBtn.addEventListener('click', function() {
            addGameForm.style.display = 'block';
            addGameBtn.style.display = 'none';
        });
        
        cancelGameBtn.addEventListener('click', function() {
            addGameForm.style.display = 'none';
            addGameBtn.style.display = 'block';
            document.getElementById('game-form').reset();
        });
    }
    
    // تهيئة نموذج إضافة لعبة
    const gameForm = document.getElementById('game-form');
    
    if (gameForm) {
        gameForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // الحصول على بيانات اللعبة
            const title = document.getElementById('game-title').value;
            const platform = document.getElementById('game-platform').value;
            const region = document.getElementById('game-region').value;
            const size = document.getElementById('game-size').value + ' GB';
            const description = document.getElementById('game-description').value;
            const image = document.getElementById('game-image').value;
            const downloadLink = document.getElementById('game-download').value;
            
            // إضافة اللعبة
            addGame(title, platform, region, size, description, image, downloadLink);
            
            // إعادة تعيين النموذج
            gameForm.reset();
            
            // إخفاء النموذج
            addGameForm.style.display = 'none';
            addGameBtn.style.display = 'block';
            
            // إعادة تحميل قائمة الألعاب
            loadGames();
            
            // تحديث الإحصائيات
            loadStatistics();
            
            // عرض رسالة نجاح
            showToast('تمت إضافة اللعبة بنجاح', 'success');
        });
    }
}

// تحميل قائمة الألعاب
function loadGames() {
    const gamesTableBody = document.getElementById('games-table-body');
    
    if (!gamesTableBody) {
        return;
    }
    
    // الحصول على قائمة الألعاب
    const games = getGames();
    
    // مسح الجدول الحالي
    gamesTableBody.innerHTML = '';
    
    // إضافة الألعاب إلى الجدول
    games.forEach(game => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${game.title}</td>
            <td>${game.platform}</td>
            <td>${game.region}</td>
            <td>${game.size}</td>
            <td>${game.date_added}</td>
            <td class="actions">
                <button class="view-btn" data-id="${game.id}" title="عرض"><i class="fas fa-eye"></i></button>
                <button class="edit-btn" data-id="${game.id}" title="تعديل"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${game.id}" title="حذف"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        
        gamesTableBody.appendChild(row);
    });
    
    // إضافة مستمعي الأحداث للأزرار
    addGameButtonListeners();
}

// الحصول على قائمة الألعاب
function getGames() {
    // التحقق من وجود ألعاب في التخزين المحلي
    const games = localStorage.getItem('4gamer_games');
    
    if (games) {
        return JSON.parse(games);
    }
    
    // إذا لم تكن هناك ألعاب، إرجاع مصفوفة فارغة
    return [];
}

// إضافة لعبة جديدة
function addGame(title, platform, region, size, description, image, downloadLink) {
    const games = getGames();
    
    // إنشاء معرف فريد
    const id = games.length > 0 ? Math.max(...games.map(game => game.id)) + 1 : 1;
    
    // إنشاء تاريخ الإضافة
    const date = new Date();
    const dateAdded = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // تحديد اللغة (افتراضياً: العربية)
    const language = "العربية";
    
    // إضافة اللعبة الجديدة
    games.push({
        id,
        title,
        platform,
        region,
        size,
        language,
        description,
        image,
        download_link: downloadLink,
        date_added: dateAdded
    });
    
    // حفظ التغييرات
    localStorage.setItem('4gamer_games', JSON.stringify(games));
    
    // تحديث صفحات الألعاب
    updateGamePages(platform);
}

// تحديث صفحات الألعاب
function updateGamePages(platform) {
    // تحديد الصفحات التي يجب تحديثها بناءً على المنصة
    if (platform === 'ps4' || platform === 'both') {
        localStorage.setItem('4gamer_update_ps4_games', 'true');
    }
    
    if (platform === 'ps5' || platform === 'both') {
        localStorage.setItem('4gamer_update_ps5_games', 'true');
    }
}

// إضافة مستمعي الأحداث لأزرار الألعاب
function addGameButtonListeners() {
    // أزرار العرض
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const gameId = parseInt(this.getAttribute('data-id'));
            viewGame(gameId);
        });
    });
    
    // أزرار التعديل
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const gameId = parseInt(this.getAttribute('data-id'));
            editGame(gameId);
        });
    });
    
    // أزرار الحذف
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const gameId = parseInt(this.getAttribute('data-id'));
            deleteGame(gameId);
        });
    });
}

// عرض تفاصيل لعبة
function viewGame(gameId) {
    const games = getGames();
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
        showToast('اللعبة غير موجودة', 'error');
        return;
    }
    
    // إنشاء نافذة منبثقة لعرض تفاصيل اللعبة
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" title="إغلاق"><i class="fas fa-times"></i></button>
            <h2>${game.title}</h2>
            <div class="game-details">
                <p><strong>المنصة:</strong> ${game.platform}</p>
                <p><strong>المنطقة:</strong> ${game.region}</p>
                <p><strong>الحجم:</strong> ${game.size}</p>
                <p><strong>اللغة:</strong> ${game.language}</p>
                <p><strong>الوصف:</strong> ${game.description}</p>
                <p><strong>تاريخ الإضافة:</strong> ${game.date_added}</p>
                <p><strong>رابط الصورة:</strong> <a href="${game.image}" target="_blank">${game.image}</a></p>
                <p><strong>رابط التحميل:</strong> <a href="${game.download_link}" target="_blank">${game.download_link}</a></p>
            </div>
        </div>
    `;
    
    // إضافة النافذة المنبثقة إلى الصفحة
    document.body.appendChild(modal);
    
    // إضافة مستمع حدث لزر الإغلاق
    modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.remove();
    });
    
    // إغلاق النافذة المنبثقة عند النقر خارجها
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
}

// تعديل لعبة
function editGame(gameId) {
    const games = getGames();
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
        showToast('اللعبة غير موجودة', 'error');
        return;
    }
    
    // إظهار نموذج إضافة لعبة
    const addGameBtn = document.getElementById('add-game-btn');
    const addGameForm = document.getElementById('add-game-form');
    
    if (addGameBtn && addGameForm) {
        addGameBtn.style.display = 'none';
        addGameForm.style.display = 'block';
    }
    
    // ملء النموذج ببيانات اللعبة
    document.getElementById('game-title').value = game.title;
    document.getElementById('game-platform').value = game.platform;
    document.getElementById('game-region').value = game.region;
    document.getElementById('game-size').value = parseFloat(game.size);
    document.getElementById('game-description').value = game.description;
    document.getElementById('game-image').value = game.image;
    document.getElementById('game-download').value = game.download_link;
    
    // تغيير نص زر الإرسال
    const submitButton = document.querySelector('#game-form button[type="submit"]');
    if (submitButton) {
        submitButton.innerHTML = '<i class="fas fa-save"></i> تحديث اللعبة';
    }
    
    // إضافة معرف اللعبة كسمة مخصصة للنموذج
    const gameForm = document.getElementById('game-form');
    if (gameForm) {
        gameForm.setAttribute('data-edit-id', gameId);
        
        // إزالة مستمع الحدث الحالي
        const newGameForm = gameForm.cloneNode(true);
        gameForm.parentNode.replaceChild(newGameForm, gameForm);
        
        // إضافة مستمع حدث جديد
        newGameForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // الحصول على بيانات اللعبة
            const title = document.getElementById('game-title').value;
            const platform = document.getElementById('game-platform').value;
            const region = document.getElementById('game-region').value;
            const size = document.getElementById('game-size').value + ' GB';
            const description = document.getElementById('game-description').value;
            const image = document.getElementById('game-image').value;
            const downloadLink = document.getElementById('game-download').value;
            
            // تحديث اللعبة
            updateGame(gameId, title, platform, region, size, description, image, downloadLink);
            
            // إعادة تعيين النموذج
            newGameForm.reset();
            
            // إخفاء النموذج
            addGameForm.style.display = 'none';
            addGameBtn.style.display = 'block';
            
            // إعادة تعيين نص زر الإرسال
            submitButton.innerHTML = '<i class="fas fa-save"></i> حفظ اللعبة';
            
            // إزالة سمة معرف التعديل
            newGameForm.removeAttribute('data-edit-id');
            
            // إعادة تحميل قائمة الألعاب
            loadGames();
            
            // عرض رسالة نجاح
            showToast('تم تحديث اللعبة بنجاح', 'success');
        });
    }
}

// تحديث لعبة
function updateGame(gameId, title, platform, region, size, description, image, downloadLink) {
    const games = getGames();
    const gameIndex = games.findIndex(g => g.id === gameId);
    
    if (gameIndex === -1) {
        showToast('اللعبة غير موجودة', 'error');
        return;
    }
    
    // الحصول على المنصة القديمة للعبة
    const oldPlatform = games[gameIndex].platform;
    
    // تحديث بيانات اللعبة
    games[gameIndex] = {
        ...games[gameIndex],
        title,
        platform,
        region,
        size,
        description,
        image,
        download_link: downloadLink
    };
    
    // حفظ التغييرات
    localStorage.setItem('4gamer_games', JSON.stringify(games));
    
    // تحديث صفحات الألعاب
    if (platform !== oldPlatform) {
        updateGamePages(oldPlatform);
    }
    updateGamePages(platform);
}

// حذف لعبة
function deleteGame(gameId) {
    // التأكيد قبل الحذف
    if (!confirm('هل أنت متأكد من حذف هذه اللعبة؟')) {
        return;
    }
    
    const games = getGames();
    const game = games.find(g => g.id === gameId);
    
    if (!game) {
        showToast('اللعبة غير موجودة', 'error');
        return;
    }
    
    // حفظ المنصة قبل الحذف
    const platform = game.platform;
    
    // حذف اللعبة
    const filteredGames = games.filter(g => g.id !== gameId);
    
    // حفظ التغييرات
    localStorage.setItem('4gamer_games', JSON.stringify(filteredGames));
    
    // تحديث صفحات الألعاب
    updateGamePages(platform);
    
    // إعادة تحميل قائمة الألعاب
    loadGames();
    
    // تحديث الإحصائيات
    loadStatistics();
    
    // عرض رسالة نجاح
    showToast('تم حذف اللعبة بنجاح', 'success');
}

// تهيئة إدارة الاقتراحات
function initSuggestionsManagement() {
    // تحميل قائمة الاقتراحات
    loadSuggestions();
    
    // تهيئة أزرار تصفية الاقتراحات
    const approvedSuggestionsBtn = document.getElementById('approved-suggestions-btn');
    const rejectedSuggestionsBtn = document.getElementById('rejected-suggestions-btn');
    
    if (approvedSuggestionsBtn) {
        approvedSuggestionsBtn.addEventListener('click', function() {
            loadSuggestions('approved');
        });
    }
    
    if (rejectedSuggestionsBtn) {
        rejectedSuggestionsBtn.addEventListener('click', function() {
            loadSuggestions('rejected');
        });
    }
}

// تحميل قائمة الاقتراحات
function loadSuggestions(filter = 'all') {
    const suggestionsTableBody = document.getElementById('suggestions-table-body');
    
    if (!suggestionsTableBody) {
        return;
    }
    
    // الحصول على قائمة الاقتراحات
    let suggestions = getSuggestions();
    
    // تطبيق التصفية إذا تم تحديدها
    if (filter !== 'all') {
        suggestions = suggestions.filter(suggestion => suggestion.status === filter);
    }
    
    // مسح الجدول الحالي
    suggestionsTableBody.innerHTML = '';
    
    // إضافة الاقتراحات إلى الجدول
    suggestions.forEach(suggestion => {
        const row = document.createElement('tr');
        
        // تحديد نص الحالة
        let statusText = 'قيد المراجعة';
        let statusClass = 'status-pending';
        
        if (suggestion.status === 'approved') {
            statusText = 'مقبول';
            statusClass = 'status-approved';
        } else if (suggestion.status === 'rejected') {
            statusText = 'مرفوض';
            statusClass = 'status-rejected';
        }
        
        // تحديد نوع الاقتراح
        let typeText = 'لعبة';
        if (suggestion.type === 'tool') {
            typeText = 'أداة / تطبيق';
        } else if (suggestion.type === 'other') {
            typeText = 'اقتراح آخر';
        }
        
        row.innerHTML = `
            <td>${suggestion.title}</td>
            <td>${typeText}</td>
            <td>${suggestion.platform}</td>
            <td>${suggestion.requester_name}</td>
            <td>${suggestion.date_submitted}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td class="actions">
                <button class="view-btn" data-id="${suggestion.id}" title="عرض"><i class="fas fa-eye"></i></button>
                ${suggestion.status === 'pending' ? `
                    <button class="approve-btn" data-id="${suggestion.id}" title="قبول"><i class="fas fa-check"></i></button>
                    <button class="reject-btn" data-id="${suggestion.id}" title="رفض"><i class="fas fa-times"></i></button>
                ` : suggestion.status === 'rejected' ? `
                    <button class="reconsider-btn" data-id="${suggestion.id}" title="إعادة النظر"><i class="fas fa-redo"></i></button>
                    <button class="delete-suggestion-btn" data-id="${suggestion.id}" title="حذف"><i class="fas fa-trash-alt"></i></button>
                ` : `
                    <button class="convert-btn" data-id="${suggestion.id}" title="تحويل إلى لعبة"><i class="fas fa-exchange-alt"></i></button>
                    <button class="delete-suggestion-btn" data-id="${suggestion.id}" title="حذف"><i class="fas fa-trash-alt"></i></button>
                `}
            </td>
        `;
        
        suggestionsTableBody.appendChild(row);
    });
    
    // إضافة مستمعي الأحداث للأزرار
    addSuggestionButtonListeners();
}

// الحصول على قائمة الاقتراحات
function getSuggestions() {
    // التحقق من وجود اقتراحات في التخزين المحلي
    const suggestions = localStorage.getItem('4gamer_suggestions');
    
    if (suggestions) {
        return JSON.parse(suggestions);
    }
    
    // إذا لم تكن هناك اقتراحات، إرجاع مصفوفة فارغة
    return [];
}

// إضافة مستمعي الأحداث لأزرار الاقتراحات
function addSuggestionButtonListeners() {
    // أزرار العرض
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const suggestionId = parseInt(this.getAttribute('data-id'));
            viewSuggestion(suggestionId);
        });
    });
    
    // أزرار القبول
    document.querySelectorAll('.approve-btn').forEach(button => {
        button.addEventListener('click', function() {
            const suggestionId = parseInt(this.getAttribute('data-id'));
            approveSuggestion(suggestionId);
        });
    });
    
    // أزرار الرفض
    document.querySelectorAll('.reject-btn').forEach(button => {
        button.addEventListener('click', function() {
            const suggestionId = parseInt(this.getAttribute('data-id'));
            rejectSuggestion(suggestionId);
        });
    });
    
    // أزرار إعادة النظر
    document.querySelectorAll('.reconsider-btn').forEach(button => {
        button.addEventListener('click', function() {
            const suggestionId = parseInt(this.getAttribute('data-id'));
            reconsiderSuggestion(suggestionId);
        });
    });
    
    // أزرار التحويل إلى لعبة
    document.querySelectorAll('.convert-btn').forEach(button => {
        button.addEventListener('click', function() {
            const suggestionId = parseInt(this.getAttribute('data-id'));
            convertSuggestionToGame(suggestionId);
        });
    });
    
    // أزرار الحذف
    document.querySelectorAll('.delete-suggestion-btn').forEach(button => {
        button.addEventListener('click', function() {
            const suggestionId = parseInt(this.getAttribute('data-id'));
            deleteSuggestion(suggestionId);
        });
    });
}

// تسجيل الخروج
function logout() {
    // التأكيد قبل تسجيل الخروج
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        // حذف بيانات تسجيل الدخول
        localStorage.removeItem('4gamer_admin_logged_in');
        localStorage.removeItem('4gamer_admin_username');
        
        // إعادة التوجيه إلى صفحة تسجيل الدخول
        window.location.href = 'admin-login.html';
    }
}

// دالة لعرض الإشعارات
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) return;
    
    // إنشاء عنصر الإشعار
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // تحديد أيقونة الإشعار حسب النوع
    let icon = 'info-circle';
    
    if (type === 'success') {
        icon = 'check-circle';
    } else if (type === 'error') {
        icon = 'exclamation-circle';
    } else if (type === 'warning') {
        icon = 'exclamation-triangle';
    }
    
    // إضافة محتوى الإشعار
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas fa-${icon}"></i></div>
        <div class="toast-message">${message}</div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    // إضافة الإشعار إلى الحاوية
    toastContainer.appendChild(toast);
    
    // إضافة مستمع حدث لزر الإغلاق
    toast.querySelector('.toast-close').addEventListener('click', function() {
        toast.classList.add('hide');
        
        // إزالة الإشعار بعد انتهاء الرسوم المتحركة
        setTimeout(() => {
            toast.remove();
        }, 500);
    });
    
    // إخفاء الإشعار تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('hide');
            
            // إزالة الإشعار بعد انتهاء الرسوم المتحركة
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 500);
        }
    }, 5000);
}

// باقي الوظائف المتعلقة بإدارة الاقتراحات والمستخدمين تم حذفها للاختصار
// يمكن إضافتها مرة أخرى إذا لزم الأمر
