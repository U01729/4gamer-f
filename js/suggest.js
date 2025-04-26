// ملف JavaScript لصفحة الاقتراحات
document.addEventListener('DOMContentLoaded', function() {
    const suggestionForm = document.getElementById('suggestionForm');
    const notification = document.getElementById('notification');
    
    // التحقق من وجود نموذج الاقتراح
    if (!suggestionForm) {
        return;
    }
    
    // تهيئة نظام تخزين الاقتراحات
    initSuggestionStorage();
    
    // التحقق من صحة البيانات المدخلة
    function validateForm() {
        let isValid = true;
        const gameNameField = document.getElementById('gameName');
        const platformField = document.getElementById('platform');
        const descriptionField = document.getElementById('description');
        
        // إزالة رسائل الخطأ السابقة
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // التحقق من اسم اللعبة/الأداة
        if (gameNameField && gameNameField.value.trim() === '') {
            showError(gameNameField, 'يرجى إدخال اسم اللعبة/الأداة');
            isValid = false;
        }
        
        // التحقق من المنصة
        if (platformField && platformField.value === '') {
            showError(platformField, 'يرجى اختيار المنصة');
            isValid = false;
        }
        
        // التحقق من الوصف
        if (descriptionField && descriptionField.value.trim() === '') {
            showError(descriptionField, 'يرجى إدخال وصف اللعبة/الأداة');
            isValid = false;
        } else if (descriptionField && descriptionField.value.trim().length < 10) {
            showError(descriptionField, 'يجب أن يحتوي الوصف على الأقل 10 أحرف');
            isValid = false;
        }
        
        return isValid;
    }
    
    // عرض رسالة خطأ تحت الحقل
    function showError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'var(--error-color)';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = 'var(--error-color)';
    }
    
    // تهيئة نظام تخزين الاقتراحات
    function initSuggestionStorage() {
        if (!localStorage.getItem('gameSuggestions')) {
            localStorage.setItem('gameSuggestions', JSON.stringify([]));
        }
    }
    
    // تخزين الاقتراح في localStorage
    function saveSuggestion(suggestionData) {
        // الحصول على الاقتراحات المخزنة سابقاً
        let suggestions = JSON.parse(localStorage.getItem('gameSuggestions')) || [];
        
        // إضافة الاقتراح الجديد مع تاريخ الإرسال
        suggestionData.id = Date.now();
        suggestionData.date = new Date().toISOString();
        suggestionData.status = 'pending'; // حالة الاقتراح: pending, approved, rejected
        
        suggestions.push(suggestionData);
        
        // تخزين الاقتراحات المحدثة
        localStorage.setItem('gameSuggestions', JSON.stringify(suggestions));
    }
    
    // عرض رسالة تأكيد
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        // إخفاء الرسالة بعد 5 ثوانٍ
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
    
    // معالجة إرسال النموذج
    suggestionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // التحقق من صحة البيانات
        if (!validateForm()) {
            return;
        }
        
        // جمع بيانات النموذج
        const suggestionType = document.querySelector('input[name="suggestionType"]:checked').value;
        const gameName = document.getElementById('gameName').value.trim();
        const gameType = document.getElementById('gameType').value;
        const platform = document.getElementById('platform').value;
        const description = document.getElementById('description').value.trim();
        const link = document.getElementById('link').value.trim();
        
        // تجميع بيانات الاقتراح
        const suggestionData = {
            suggestionType,
            gameName,
            gameType,
            platform,
            description,
            link
        };
        
        try {
            // تخزين الاقتراح
            saveSuggestion(suggestionData);
            
            // إظهار رسالة النجاح
            showNotification('تم إرسال اقتراحك بنجاح! سيتم مراجعته من قبل فريق الإدارة.', 'success');
            
            // إعادة تعيين النموذج
            suggestionForm.reset();
            
        } catch (error) {
            // إظهار رسالة الخطأ
            showNotification('حدث خطأ أثناء إرسال الاقتراح. يرجى المحاولة مرة أخرى.', 'error');
            console.error('Error saving suggestion:', error);
        }
    });
    
    // إزالة تنسيق الخطأ عند الكتابة في الحقل
    const formFields = document.querySelectorAll('#suggestionForm input, #suggestionForm textarea, #suggestionForm select');
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            this.style.borderColor = '';
            const errorMessage = this.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
});
