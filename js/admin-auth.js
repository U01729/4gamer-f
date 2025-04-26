// نظام المصادقة والصلاحيات لموقع 4GAMER
// تم التحديث: 25 أبريل 2025

// بيانات المستخدمين الافتراضية
const defaultUsers = [
    {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'المدير العام',
        active: true
    },
    {
        username: 'moderator',
        password: 'mod123',
        role: 'moderator',
        name: 'مشرف المحتوى',
        active: true
    }
];

// التحقق من وجود مستخدمين في التخزين المحلي
function initializeUsers() {
    if (!localStorage.getItem('4gamer_users')) {
        localStorage.setItem('4gamer_users', JSON.stringify(defaultUsers));
    }
}

// الحصول على قائمة المستخدمين
function getUsers() {
    initializeUsers();
    return JSON.parse(localStorage.getItem('4gamer_users'));
}

// إضافة مستخدم جديد
function addUser(username, password, role, name) {
    const users = getUsers();
    
    // التحقق من عدم وجود اسم مستخدم مكرر
    if (users.some(user => user.username === username)) {
        return {
            success: false,
            message: 'اسم المستخدم موجود بالفعل'
        };
    }
    
    // إضافة المستخدم الجديد
    users.push({
        username,
        password,
        role,
        name,
        active: true
    });
    
    // حفظ التغييرات
    localStorage.setItem('4gamer_users', JSON.stringify(users));
    
    return {
        success: true,
        message: 'تمت إضافة المستخدم بنجاح'
    };
}

// تعديل بيانات مستخدم
function updateUser(username, updates) {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.username === username);
    
    if (userIndex === -1) {
        return {
            success: false,
            message: 'المستخدم غير موجود'
        };
    }
    
    // تحديث بيانات المستخدم
    users[userIndex] = { ...users[userIndex], ...updates };
    
    // حفظ التغييرات
    localStorage.setItem('4gamer_users', JSON.stringify(users));
    
    return {
        success: true,
        message: 'تم تحديث بيانات المستخدم بنجاح'
    };
}

// حذف مستخدم
function deleteUser(username) {
    const users = getUsers();
    const filteredUsers = users.filter(user => user.username !== username);
    
    if (filteredUsers.length === users.length) {
        return {
            success: false,
            message: 'المستخدم غير موجود'
        };
    }
    
    // حفظ التغييرات
    localStorage.setItem('4gamer_users', JSON.stringify(filteredUsers));
    
    return {
        success: true,
        message: 'تم حذف المستخدم بنجاح'
    };
}

// التحقق من صحة بيانات تسجيل الدخول
function authenticateUser(username, password) {
    const users = getUsers();
    const user = users.find(user => user.username === username && user.password === password && user.active);
    
    if (!user) {
        return {
            success: false,
            message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
        };
    }
    
    // إنشاء جلسة جديدة
    const session = {
        username: user.username,
        role: user.role,
        name: user.name,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // تنتهي الجلسة بعد 24 ساعة
    };
    
    // حفظ الجلسة في التخزين المحلي
    localStorage.setItem('4gamer_active_session', JSON.stringify(session));
    
    return {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user: {
            username: user.username,
            role: user.role,
            name: user.name
        }
    };
}

// الحصول على الجلسة النشطة
function getActiveSession() {
    const sessionData = localStorage.getItem('4gamer_active_session');
    
    if (!sessionData) {
        return null;
    }
    
    const session = JSON.parse(sessionData);
    
    // التحقق من صلاحية الجلسة
    if (session.expiresAt < Date.now()) {
        // الجلسة منتهية، قم بحذفها
        localStorage.removeItem('4gamer_active_session');
        return null;
    }
    
    return session;
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('4gamer_active_session');
    return {
        success: true,
        message: 'تم تسجيل الخروج بنجاح'
    };
}

// التحقق من صلاحيات المستخدم
function checkPermission(requiredRole) {
    const session = getActiveSession();
    
    if (!session) {
        return false;
    }
    
    // التحقق من الصلاحيات
    if (requiredRole === 'admin') {
        return session.role === 'admin';
    } else if (requiredRole === 'moderator') {
        return session.role === 'admin' || session.role === 'moderator';
    }
    
    return true;
}

// حماية صفحات الإدارة
function protectAdminPage() {
    const session = getActiveSession();
    
    if (!session) {
        // إعادة التوجيه إلى صفحة تسجيل الدخول
        window.location.href = 'admin-login.html';
        return false;
    }
    
    return true;
}

// تهيئة نموذج تسجيل الدخول
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من وجود نموذج تسجيل الدخول
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('login-error');
            
            // التحقق من صحة البيانات
            const result = authenticateUser(username, password);
            
            if (result.success) {
                // إعادة التوجيه إلى لوحة الإدارة بدون إعادة تحميل الصفحة
                // استخدام SPA (Single Page Application) نهج لتجنب مشكلة إعادة التحميل المستمر
                
                // إنشاء عنصر div لعرض لوحة الإدارة
                const adminPanelContainer = document.createElement('div');
                adminPanelContainer.id = 'admin-panel-container';
                adminPanelContainer.className = 'admin-panel-container';
                
                // إضافة محتوى لوحة الإدارة
                adminPanelContainer.innerHTML = `
                    <div class="admin-panel-header">
                        <h1>لوحة الإدارة</h1>
                        <p>مرحباً، <span id="admin-user-name">${result.user.name}</span></p>
                        <button id="logout-button" class="logout-btn">تسجيل الخروج</button>
                    </div>
                    
                    <div class="admin-panel-content">
                        <div class="admin-sidebar">
                            <ul class="admin-menu">
                                <li class="admin-menu-item active" data-tab="dashboard">
                                    <i class="fas fa-tachometer-alt"></i> لوحة التحكم
                                </li>
                                <li class="admin-menu-item" data-tab="games">
                                    <i class="fas fa-gamepad"></i> إدارة الألعاب
                                </li>
                                <li class="admin-menu-item" data-tab="suggestions">
                                    <i class="fas fa-lightbulb"></i> الاقتراحات
                                </li>
                                <li class="admin-menu-item" data-tab="messages">
                                    <i class="fas fa-envelope"></i> الرسائل
                                </li>
                                <li class="admin-menu-item" data-tab="users">
                                    <i class="fas fa-users"></i> المستخدمين
                                </li>
                                <li class="admin-menu-item" data-tab="settings">
                                    <i class="fas fa-cog"></i> الإعدادات
                                </li>
                            </ul>
                        </div>
                        
                        <div class="admin-content">
                            <div id="dashboard-tab" class="admin-tab active">
                                <h2>لوحة التحكم</h2>
                                
                                <div class="stats-container">
                                    <div class="stat-card">
                                        <div class="stat-icon"><i class="fas fa-gamepad"></i></div>
                                        <div class="stat-content">
                                            <h3>إجمالي الألعاب</h3>
                                            <p class="stat-value" id="total-games">0</p>
                                        </div>
                                    </div>
                                    
                                    <div class="stat-card">
                                        <div class="stat-icon"><i class="fas fa-envelope"></i></div>
                                        <div class="stat-content">
                                            <h3>الرسائل الجديدة</h3>
                                            <p class="stat-value" id="new-messages">0</p>
                                        </div>
                                    </div>
                                    
                                    <div class="stat-card">
                                        <div class="stat-icon"><i class="fas fa-lightbulb"></i></div>
                                        <div class="stat-content">
                                            <h3>الاقتراحات الجديدة</h3>
                                            <p class="stat-value" id="new-suggestions">0</p>
                                        </div>
                                    </div>
                                    
                                    <div class="stat-card">
                                        <div class="stat-icon"><i class="fas fa-eye"></i></div>
                                        <div class="stat-content">
                                            <h3>الزيارات اليوم</h3>
                                            <p class="stat-value" id="today-visits">0</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="recent-activity">
                                    <h3>النشاط الأخير</h3>
                                    <div id="activity-list" class="activity-list">
                                        <p>لا يوجد نشاط حديث</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="games-tab" class="admin-tab">
                                <h2>إدارة الألعاب</h2>
                                <p>قريباً...</p>
                            </div>
                            
                            <div id="suggestions-tab" class="admin-tab">
                                <h2>الاقتراحات</h2>
                                <div id="suggestions-list" class="suggestions-list">
                                    <p>لا توجد اقتراحات جديدة</p>
                                </div>
                            </div>
                            
                            <div id="messages-tab" class="admin-tab">
                                <h2>الرسائل</h2>
                                <div id="messages-list" class="messages-list">
                                    <p>لا توجد رسائل جديدة</p>
                                </div>
                            </div>
                            
                            <div id="users-tab" class="admin-tab">
                                <h2>إدارة المستخدمين</h2>
                                <div id="users-list" class="users-list">
                                    <!-- سيتم ملء هذا القسم بواسطة JavaScript -->
                                </div>
                                
                                <div class="add-user-form-container">
                                    <h3>إضافة مستخدم جديد</h3>
                                    <form id="add-user-form" class="add-user-form">
                                        <div class="form-group">
                                            <label for="new-username">اسم المستخدم</label>
                                            <input type="text" id="new-username" required>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label for="new-password">كلمة المرور</label>
                                            <input type="password" id="new-password" required>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label for="new-name">الاسم الكامل</label>
                                            <input type="text" id="new-name" required>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label for="new-role">الدور</label>
                                            <select id="new-role" required>
                                                <option value="admin">مدير</option>
                                                <option value="moderator">مشرف</option>
                                            </select>
                                        </div>
                                        
                                        <button type="submit" class="add-user-btn">إضافة مستخدم</button>
                                    </form>
                                </div>
                            </div>
                            
                            <div id="settings-tab" class="admin-tab">
                                <h2>الإعدادات</h2>
                                <p>قريباً...</p>
                            </div>
                        </div>
                    </div>
                `;
                
                // استبدال محتوى الصفحة بلوحة الإدارة
                const mainContent = document.querySelector('.main-content');
                mainContent.innerHTML = '';
                mainContent.appendChild(adminPanelContainer);
                
                // إضافة CSS للوحة الإدارة
                const adminPanelStyle = document.createElement('style');
                adminPanelStyle.textContent = `
                    .admin-panel-container {
                        padding: 20px;
                    }
                    
                    .admin-panel-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 30px;
                        padding-bottom: 15px;
                        border-bottom: 1px solid var(--border-color);
                    }
                    
                    .admin-panel-header h1 {
                        margin: 0;
                        color: var(--primary-color);
                    }
                    
                    .logout-btn {
                        background-color: var(--danger-color);
                        color: white;
                        border: none;
                        border-radius: 5px;
                        padding: 8px 15px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    
                    .logout-btn:hover {
                        background-color: #c82333;
                    }
                    
                    .admin-panel-content {
                        display: flex;
                        gap: 30px;
                    }
                    
                    .admin-sidebar {
                        width: 250px;
                        flex-shrink: 0;
                    }
                    
                    .admin-menu {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                        background-color: var(--card-bg);
                        border-radius: var(--border-radius);
                        overflow: hidden;
                        box-shadow: var(--shadow);
                    }
                    
                    .admin-menu-item {
                        padding: 15px 20px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    
                    .admin-menu-item:hover {
                        background-color: rgba(var(--primary-color-rgb), 0.1);
                    }
                    
                    .admin-menu-item.active {
                        background-color: var(--primary-color);
                        color: white;
                    }
                    
                    .admin-content {
                        flex: 1;
                        background-color: var(--card-bg);
                        border-radius: var(--border-radius);
                        padding: 20px;
                        box-shadow: var(--shadow);
                    }
                    
                    .admin-tab {
                        display: none;
                    }
                    
                    .admin-tab.active {
                        display: block;
                    }
                    
                    .stats-container {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    
                    .stat-card {
                        background-color: var(--bg-color);
                        border-radius: var(--border-radius);
                        padding: 20px;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        box-shadow: var(--shadow);
                    }
                    
                    .stat-icon {
                        width: 50px;
                        height: 50px;
                        background-color: rgba(var(--primary-color-rgb), 0.1);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.5rem;
                        color: var(--primary-color);
                    }
                    
                    .stat-content {
                        flex: 1;
                    }
                    
                    .stat-content h3 {
                        margin: 0 0 5px;
                        font-size: 0.9rem;
                        color: var(--text-muted);
                    }
                    
                    .stat-value {
                        margin: 0;
                        font-size: 1.8rem;
                        font-weight: 700;
                        color: var(--heading-color);
                    }
                    
                    .recent-activity, .users-list, .messages-list, .suggestions-list {
                        background-color: var(--bg-color);
                        border-radius: var(--border-radius);
                        padding: 20px;
                        box-shadow: var(--shadow);
                    }
                    
                    .activity-list {
                        margin-top: 15px;
                    }
                    
                    .add-user-form-container {
                        margin-top: 30px;
                        background-color: var(--bg-color);
                        border-radius: var(--border-radius);
                        padding: 20px;
                        box-shadow: var(--shadow);
                    }
                    
                    .add-user-form {
                        margin-top: 15px;
                    }
                    
                    .add-user-btn {
                        background-color: var(--primary-color);
                        color: white;
                        border: none;
                        border-radius: 5px;
                        padding: 10px 15px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        margin-top: 15px;
                    }
                    
                    .add-user-btn:hover {
                        background-color: var(--accent-color);
                    }
                    
                    .user-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 15px;
                        border-bottom: 1px solid var(--border-color);
                    }
                    
                    .user-item:last-child {
                        border-bottom: none;
                    }
                    
                    .user-info h3 {
                        margin: 0 0 5px;
                    }
                    
                    .user-info p {
                        margin: 5px 0;
                        color: var(--text-muted);
                    }
                    
                    .active-status {
                        color: #28a745;
                    }
                    
                    .inactive-status {
                        color: #dc3545;
                    }
                    
                    .user-actions {
                        display: flex;
                        gap: 10px;
                    }
                    
                    .toggle-status-btn, .delete-user-btn {
                        padding: 5px 10px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    
                    .toggle-status-btn {
                        background-color: #17a2b8;
                        color: white;
                    }
                    
                    .toggle-status-btn:hover {
                        background-color: #138496;
                    }
                    
                    .delete-user-btn {
                        background-color: #dc3545;
                        color: white;
                    }
                    
                    .delete-user-btn:hover {
                        background-color: #c82333;
                    }
                    
                    #notification-container {
                        position: fixed;
                        top: 20px;
                        left: 20px;
                        z-index: 9999;
                    }
                    
                    .notification {
                        padding: 15px 20px;
                        margin-bottom: 10px;
                        border-radius: 5px;
                        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                        animation: slideIn 0.3s ease;
                    }
                    
                    .notification.success {
                        background-color: #28a745;
                        color: white;
                    }
                    
                    .notification.error {
                        background-color: #dc3545;
                        color: white;
                    }
                    
                    .notification.fade-out {
                        animation: fadeOut 0.5s ease forwards;
                    }
                    
                    @keyframes slideIn {
                        from { transform: translateX(-100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    
                    @keyframes fadeOut {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                    
                    @media (max-width: 768px) {
                        .admin-panel-content {
                            flex-direction: column;
                        }
                        
                        .admin-sidebar {
                            width: 100%;
                        }
                    }
                `;
                
                document.head.appendChild(adminPanelStyle);
                
                // تهيئة وظائف لوحة الإدارة
                initAdminPanel();
                
                // تحديث الإحصائيات
                updateAdminStats();
            } else {
                // عرض رسالة الخطأ
                errorElement.textContent = result.message;
                errorElement.style.display = 'block';
            }
        });
    }
    
    // التحقق من حالة تسجيل الدخول في صفحة تسجيل الدخول
    if (window.location.pathname.includes('admin-login.html')) {
        const session = getActiveSession();
        
        if (session) {
            // إعادة التوجيه إلى لوحة الإدارة إذا كان المستخدم مسجل الدخول بالفعل
            window.location.href = 'admin-panel.html';
        }
    }
    
    // حماية صفحات الإدارة
    if (window.location.pathname.includes('admin-panel') || 
        window.location.pathname.includes('admin-suggestions')) {
        protectAdminPage();
    }
});

// تهيئة لوحة الإدارة
function initAdminPanel() {
    // تبديل التبويبات
    const menuItems = document.querySelectorAll('.admin-menu-item');
    const tabs = document.querySelectorAll('.admin-tab');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // إزالة الفئة النشطة من جميع عناصر القائمة
            menuItems.forEach(item => item.classList.remove('active'));
            
            // إضافة الفئة النشطة إلى العنصر الحالي
            this.classList.add('active');
            
            // إخفاء جميع التبويبات
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // إظهار التبويب المطلوب
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // تهيئة زر تسجيل الخروج
    const logoutButton = document.getElementById('logout-button');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            logout();
            window.location.href = 'index.html';
        });
    }
    
    // عرض قائمة المستخدمين
    displayUsersList();
    
    // تهيئة نموذج إضافة مستخدم
    const addUserForm = document.getElementById('add-user-form');
    
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const username = document.getElementById('new-username').value;
            const password = document.getElementById('new-password').value;
            const role = document.getElementById('new-role').value;
            const name = document.getElementById('new-name').value;
            
            // إضافة المستخدم الجديد
            const result = addUser(username, password, role, name);
            
            if (result.success) {
                // إعادة عرض قائمة المستخدمين
                displayUsersList();
                
                // إعادة تعيين النموذج
                addUserForm.reset();
                
                // عرض رسالة نجاح
                showNotification('تمت إضافة المستخدم بنجاح', 'success');
            } else {
                // عرض رسالة خطأ
                showNotification(result.message, 'error');
            }
        });
    }
}

// تحديث إحصائيات لوحة الإدارة
function updateAdminStats() {
    // الحصول على الإحصائيات من التخزين المحلي
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const suggestions = JSON.parse(localStorage.getItem('gameSuggestions')) || [];
    const games = JSON.parse(localStorage.getItem('games')) || [];
    
    // تحديث عناصر الإحصائيات
    document.getElementById('total-games').textContent = games.length;
    document.getElementById('new-messages').textContent = messages.filter(msg => msg.status === 'unread').length;
    document.getElementById('new-suggestions').textContent = suggestions.filter(sug => sug.status === 'pending').length;
    
    // توليد عدد عشوائي للزيارات اليومية (للعرض فقط)
    document.getElementById('today-visits').textContent = Math.floor(Math.random() * 1000) + 100;
    
    // تحديث قائمة النشاط الأخير
    updateActivityList();
    
    // تحديث قائمة الرسائل
    updateMessagesList();
    
    // تحديث قائمة الاقتراحات
    updateSuggestionsList();
}

// تحديث قائمة النشاط الأخير
function updateActivityList() {
    const activityList = document.getElementById('activity-list');
    
    if (!activityList) {
        return;
    }
    
    // الحصول على الرسائل والاقتراحات
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const suggestions = JSON.parse(localStorage.getItem('gameSuggestions')) || [];
    
    // دمج النشاطات وترتيبها حسب التاريخ
    const activities = [
        ...messages.map(msg => ({
            type: 'message',
            title: msg.subject,
            date: new Date(msg.date),
            status: msg.status
        })),
        ...suggestions.map(sug => ({
            type: 'suggestion',
            title: sug.gameName,
            date: new Date(sug.date),
            status: sug.status
        }))
    ];
    
    // ترتيب النشاطات حسب التاريخ (الأحدث أولاً)
    activities.sort((a, b) => b.date - a.date);
    
    // عرض النشاطات الأخيرة (أحدث 5 نشاطات)
    if (activities.length > 0) {
        activityList.innerHTML = '';
        
        activities.slice(0, 5).forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            const icon = activity.type === 'message' ? 'envelope' : 'lightbulb';
            const statusClass = activity.status === 'unread' || activity.status === 'pending' ? 'new' : '';
            
            activityItem.innerHTML = `
                <div class="activity-icon ${statusClass}"><i class="fas fa-${icon}"></i></div>
                <div class="activity-content">
                    <p class="activity-title">${activity.title}</p>
                    <p class="activity-date">${formatDate(activity.date)}</p>
                </div>
            `;
            
            activityList.appendChild(activityItem);
        });
    } else {
        activityList.innerHTML = '<p>لا يوجد نشاط حديث</p>';
    }
}

// تحديث قائمة الرسائل
function updateMessagesList() {
    const messagesList = document.getElementById('messages-list');
    
    if (!messagesList) {
        return;
    }
    
    // الحصول على الرسائل
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    // عرض الرسائل
    if (messages.length > 0) {
        messagesList.innerHTML = '';
        
        messages.forEach(message => {
            const messageItem = document.createElement('div');
            messageItem.className = `message-item ${message.status === 'unread' ? 'unread' : ''}`;
            messageItem.setAttribute('data-id', message.id);
            
            messageItem.innerHTML = `
                <div class="message-header">
                    <h3>${message.subject}</h3>
                    <span class="message-date">${formatDate(new Date(message.date))}</span>
                </div>
                <div class="message-sender">
                    <strong>${message.name}</strong> &lt;${message.email}&gt;
                </div>
                <div class="message-content">
                    <p>${message.message}</p>
                </div>
                <div class="message-actions">
                    <button class="mark-read-btn" data-id="${message.id}">
                        ${message.status === 'unread' ? 'تحديد كمقروء' : 'تحديد كغير مقروء'}
                    </button>
                    <button class="delete-message-btn" data-id="${message.id}">حذف</button>
                </div>
            `;
            
            messagesList.appendChild(messageItem);
        });
        
        // إضافة مستمعي الأحداث للأزرار
        document.querySelectorAll('.mark-read-btn').forEach(button => {
            button.addEventListener('click', function() {
                const messageId = parseInt(this.getAttribute('data-id'));
                toggleMessageReadStatus(messageId);
            });
        });
        
        document.querySelectorAll('.delete-message-btn').forEach(button => {
            button.addEventListener('click', function() {
                const messageId = parseInt(this.getAttribute('data-id'));
                deleteMessage(messageId);
            });
        });
    } else {
        messagesList.innerHTML = '<p>لا توجد رسائل جديدة</p>';
    }
}

// تحديث قائمة الاقتراحات
function updateSuggestionsList() {
    const suggestionsList = document.getElementById('suggestions-list');
    
    if (!suggestionsList) {
        return;
    }
    
    // الحصول على الاقتراحات
    const suggestions = JSON.parse(localStorage.getItem('gameSuggestions')) || [];
    
    // عرض الاقتراحات
    if (suggestions.length > 0) {
        suggestionsList.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = `suggestion-item ${suggestion.status === 'pending' ? 'pending' : ''}`;
            suggestionItem.setAttribute('data-id', suggestion.id);
            
            suggestionItem.innerHTML = `
                <div class="suggestion-header">
                    <h3>${suggestion.gameName}</h3>
                    <span class="suggestion-date">${formatDate(new Date(suggestion.date))}</span>
                </div>
                <div class="suggestion-details">
                    <p><strong>النوع:</strong> ${suggestion.gameType}</p>
                    <p><strong>المنصة:</strong> ${suggestion.platform}</p>
                    <p><strong>الوصف:</strong> ${suggestion.description}</p>
                </div>
                <div class="suggestion-actions">
                    <button class="approve-suggestion-btn" data-id="${suggestion.id}" ${suggestion.status === 'approved' ? 'disabled' : ''}>
                        ${suggestion.status === 'approved' ? 'تمت الموافقة' : 'موافقة'}
                    </button>
                    <button class="reject-suggestion-btn" data-id="${suggestion.id}" ${suggestion.status === 'rejected' ? 'disabled' : ''}>
                        ${suggestion.status === 'rejected' ? 'تم الرفض' : 'رفض'}
                    </button>
                    <button class="delete-suggestion-btn" data-id="${suggestion.id}">حذف</button>
                </div>
            `;
            
            suggestionsList.appendChild(suggestionItem);
        });
        
        // إضافة مستمعي الأحداث للأزرار
        document.querySelectorAll('.approve-suggestion-btn').forEach(button => {
            button.addEventListener('click', function() {
                const suggestionId = parseInt(this.getAttribute('data-id'));
                updateSuggestionStatus(suggestionId, 'approved');
            });
        });
        
        document.querySelectorAll('.reject-suggestion-btn').forEach(button => {
            button.addEventListener('click', function() {
                const suggestionId = parseInt(this.getAttribute('data-id'));
                updateSuggestionStatus(suggestionId, 'rejected');
            });
        });
        
        document.querySelectorAll('.delete-suggestion-btn').forEach(button => {
            button.addEventListener('click', function() {
                const suggestionId = parseInt(this.getAttribute('data-id'));
                deleteSuggestion(suggestionId);
            });
        });
    } else {
        suggestionsList.innerHTML = '<p>لا توجد اقتراحات جديدة</p>';
    }
}

// تغيير حالة قراءة الرسالة
function toggleMessageReadStatus(messageId) {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex !== -1) {
        // تغيير حالة الرسالة
        messages[messageIndex].status = messages[messageIndex].status === 'unread' ? 'read' : 'unread';
        
        // حفظ التغييرات
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        // تحديث واجهة المستخدم
        updateMessagesList();
        updateAdminStats();
        
        // عرض رسالة نجاح
        showNotification('تم تحديث حالة الرسالة بنجاح', 'success');
    }
}

// حذف رسالة
function deleteMessage(messageId) {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const filteredMessages = messages.filter(msg => msg.id !== messageId);
    
    // حفظ التغييرات
    localStorage.setItem('contactMessages', JSON.stringify(filteredMessages));
    
    // تحديث واجهة المستخدم
    updateMessagesList();
    updateAdminStats();
    
    // عرض رسالة نجاح
    showNotification('تم حذف الرسالة بنجاح', 'success');
}

// تحديث حالة الاقتراح
function updateSuggestionStatus(suggestionId, status) {
    const suggestions = JSON.parse(localStorage.getItem('gameSuggestions')) || [];
    const suggestionIndex = suggestions.findIndex(sug => sug.id === suggestionId);
    
    if (suggestionIndex !== -1) {
        // تحديث حالة الاقتراح
        suggestions[suggestionIndex].status = status;
        
        // حفظ التغييرات
        localStorage.setItem('gameSuggestions', JSON.stringify(suggestions));
        
        // تحديث واجهة المستخدم
        updateSuggestionsList();
        updateAdminStats();
        
        // عرض رسالة نجاح
        showNotification(`تم ${status === 'approved' ? 'الموافقة على' : 'رفض'} الاقتراح بنجاح`, 'success');
    }
}

// حذف اقتراح
function deleteSuggestion(suggestionId) {
    const suggestions = JSON.parse(localStorage.getItem('gameSuggestions')) || [];
    const filteredSuggestions = suggestions.filter(sug => sug.id !== suggestionId);
    
    // حفظ التغييرات
    localStorage.setItem('gameSuggestions', JSON.stringify(filteredSuggestions));
    
    // تحديث واجهة المستخدم
    updateSuggestionsList();
    updateAdminStats();
    
    // عرض رسالة نجاح
    showNotification('تم حذف الاقتراح بنجاح', 'success');
}

// عرض قائمة المستخدمين
function displayUsersList() {
    const usersListElement = document.getElementById('users-list');
    
    if (!usersListElement) {
        return;
    }
    
    const users = getUsers();
    
    // مسح القائمة الحالية
    usersListElement.innerHTML = '';
    
    // إضافة المستخدمين إلى القائمة
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        
        userItem.innerHTML = `
            <div class="user-info">
                <h3>${user.name}</h3>
                <p><strong>اسم المستخدم:</strong> ${user.username}</p>
                <p><strong>الدور:</strong> ${user.role === 'admin' ? 'مدير' : 'مشرف'}</p>
                <p><strong>الحالة:</strong> <span class="${user.active ? 'active-status' : 'inactive-status'}">${user.active ? 'نشط' : 'غير نشط'}</span></p>
            </div>
            <div class="user-actions">
                <button class="toggle-status-btn" data-username="${user.username}" data-active="${user.active}">
                    ${user.active ? 'تعطيل' : 'تفعيل'}
                </button>
                <button class="delete-user-btn" data-username="${user.username}">
                    حذف
                </button>
            </div>
        `;
        
        usersListElement.appendChild(userItem);
    });
    
    // إضافة مستمعي الأحداث للأزرار
    document.querySelectorAll('.toggle-status-btn').forEach(button => {
        button.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            const isActive = this.getAttribute('data-active') === 'true';
            
            // تغيير حالة المستخدم
            const result = updateUser(username, { active: !isActive });
            
            if (result.success) {
                // إعادة عرض قائمة المستخدمين
                displayUsersList();
                
                // عرض رسالة نجاح
                showNotification('تم تحديث حالة المستخدم بنجاح', 'success');
            } else {
                // عرض رسالة خطأ
                showNotification(result.message, 'error');
            }
        });
    });
    
    document.querySelectorAll('.delete-user-btn').forEach(button => {
        button.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            
            // التأكيد قبل الحذف
            if (confirm(`هل أنت متأكد من حذف المستخدم "${username}"؟`)) {
                // حذف المستخدم
                const result = deleteUser(username);
                
                if (result.success) {
                    // إعادة عرض قائمة المستخدمين
                    displayUsersList();
                    
                    // عرض رسالة نجاح
                    showNotification('تم حذف المستخدم بنجاح', 'success');
                } else {
                    // عرض رسالة خطأ
                    showNotification(result.message, 'error');
                }
            }
        });
    });
}

// تنسيق التاريخ
function formatDate(date) {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// عرض إشعار
function showNotification(message, type) {
    // التحقق من وجود عنصر الإشعارات
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        // إنشاء عنصر الإشعارات
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // إنشاء الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // إضافة الإشعار إلى الحاوية
    notificationContainer.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.classList.add('fade-out');
        
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// تهيئة المستخدمين عند تحميل الصفحة
initializeUsers();
