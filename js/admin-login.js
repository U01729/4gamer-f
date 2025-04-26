// ملف تسجيل الدخول للوحة الإدارة
// التحقق من بيانات تسجيل الدخول وتوجيه المستخدم إلى لوحة الإدارة

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('admin-login-form');
    const notification = document.getElementById('notification');
    
    // التحقق من حالة تسجيل الدخول الحالية
    if (localStorage.getItem('4gamer_admin_logged_in') === 'true') {
        // إذا كان المستخدم مسجل الدخول بالفعل، توجيهه مباشرة إلى لوحة الإدارة
        window.location.href = 'admin-panel.html';
        return;
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // الحصول على بيانات تسجيل الدخول
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // التحقق من صحة البيانات
            if (!username || !password) {
                showNotification('يرجى إدخال اسم المستخدم وكلمة المرور', 'error');
                return;
            }
            
            // التحقق من بيانات تسجيل الدخول
            if (validateLogin(username, password)) {
                // تخزين حالة تسجيل الدخول
                localStorage.setItem('4gamer_admin_logged_in', 'true');
                localStorage.setItem('4gamer_admin_username', username);
                
                // تحديث وقت آخر تسجيل دخول
                updateLastLogin(username);
                
                // عرض رسالة نجاح
                showNotification('تم تسجيل الدخول بنجاح، جاري التوجيه إلى لوحة الإدارة...', 'success');
                
                // التوجيه إلى لوحة الإدارة بعد ثانيتين
                setTimeout(function() {
                    window.location.href = 'admin-panel.html';
                }, 2000);
            } else {
                showNotification('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
            }
        });
    }
    
    // دالة للتحقق من بيانات تسجيل الدخول
    function validateLogin(username, password) {
        // الحصول على قائمة المستخدمين
        const users = getUsers();
        
        // البحث عن المستخدم
        const user = users.find(u => u.username === username && u.password === password && u.active);
        
        return !!user;
    }
    
    // الحصول على قائمة المستخدمين
    function getUsers() {
        // التحقق من وجود مستخدمين في التخزين المحلي
        const users = localStorage.getItem('4gamer_users');
        
        if (users) {
            return JSON.parse(users);
        }
        
        // إذا لم يكن هناك مستخدمين، قم بإنشاء بيانات افتراضية
        const defaultUsers = [
            {
                id: 1,
                username: "admin",
                password: "admin123", // في التطبيق الحقيقي، يجب تشفير كلمات المرور
                email: "admin@4gamer.com",
                role: "admin",
                active: true,
                last_login: null
            },
            {
                id: 2,
                username: "editor1",
                password: "editor123",
                email: "editor@4gamer.com",
                role: "editor",
                active: true,
                last_login: null
            },
            {
                id: 3,
                username: "moderator1",
                password: "moderator123",
                email: "moderator@4gamer.com",
                role: "moderator",
                active: true,
                last_login: null
            }
        ];
        
        localStorage.setItem('4gamer_users', JSON.stringify(defaultUsers));
        
        return defaultUsers;
    }
    
    // تحديث وقت آخر تسجيل دخول
    function updateLastLogin(username) {
        // الحصول على قائمة المستخدمين
        const users = getUsers();
        
        // البحث عن المستخدم
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex !== -1) {
            // الحصول على التاريخ والوقت الحاليين
            const now = new Date();
            const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            
            // تحديث وقت آخر تسجيل دخول
            users[userIndex].last_login = dateString;
            
            // حفظ التغييرات
            localStorage.setItem('4gamer_users', JSON.stringify(users));
        }
    }
    
    // دالة لعرض الإشعارات
    function showNotification(message, type) {
        if (!notification) return;
        
        // تعيين نص الإشعار
        notification.textContent = message;
        
        // تعيين نوع الإشعار
        notification.className = `notification ${type}`;
        
        // إظهار الإشعار
        notification.style.display = 'block';
        
        // إخفاء الإشعار بعد 5 ثوانٍ (إلا إذا كان نوع الإشعار هو نجاح)
        if (type !== 'success') {
            setTimeout(function() {
                notification.style.display = 'none';
            }, 5000);
        }
    }
});
