// ملف JavaScript لصفحة الاتصال
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const successNotification = document.getElementById('success-notification');
    const errorNotification = document.getElementById('error-notification');
    const formFields = document.querySelectorAll('#contact-form input, #contact-form textarea');
    
    // التحقق من صحة البيانات المدخلة
    function validateForm() {
        let isValid = true;
        const nameField = document.getElementById('full-name');
        const emailField = document.getElementById('email');
        const subjectField = document.getElementById('subject');
        const messageField = document.getElementById('message');
        
        // إزالة رسائل الخطأ السابقة
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // التحقق من الاسم الكامل
        if (nameField.value.trim() === '') {
            showError(nameField, 'يرجى إدخال الاسم الكامل');
            isValid = false;
        }
        
        // التحقق من البريد الإلكتروني
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
            showError(emailField, 'يرجى إدخال بريد إلكتروني صحيح');
            isValid = false;
        }
        
        // التحقق من الموضوع
        if (subjectField.value.trim() === '') {
            showError(subjectField, 'يرجى إدخال موضوع الرسالة');
            isValid = false;
        }
        
        // التحقق من الرسالة
        if (messageField.value.trim() === '') {
            showError(messageField, 'يرجى إدخال نص الرسالة');
            isValid = false;
        } else if (messageField.value.trim().length < 10) {
            showError(messageField, 'يجب أن تحتوي الرسالة على الأقل 10 أحرف');
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
    
    // تخزين الرسالة في localStorage
    function saveMessageToStorage(messageData) {
        // الحصول على الرسائل المخزنة سابقاً
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        
        // إضافة الرسالة الجديدة مع تاريخ الإرسال
        messageData.id = Date.now();
        messageData.date = new Date().toISOString();
        messageData.status = 'unread';
        
        messages.push(messageData);
        
        // تخزين الرسائل المحدثة
        localStorage.setItem('contactMessages', JSON.stringify(messages));
    }
    
    // معالجة إرسال النموذج
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // التحقق من صحة البيانات
        if (!validateForm()) {
            return;
        }
        
        // جمع بيانات النموذج
        const messageData = {
            name: document.getElementById('full-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        try {
            // تخزين الرسالة
            saveMessageToStorage(messageData);
            
            // إظهار رسالة النجاح
            successNotification.style.display = 'block';
            errorNotification.style.display = 'none';
            
            // إعادة تعيين النموذج
            contactForm.reset();
            
            // إخفاء رسالة النجاح بعد 5 ثوانٍ
            setTimeout(() => {
                successNotification.style.display = 'none';
            }, 5000);
            
        } catch (error) {
            // إظهار رسالة الخطأ
            errorNotification.style.display = 'block';
            successNotification.style.display = 'none';
            
            console.error('Error saving message:', error);
        }
    });
    
    // إزالة تنسيق الخطأ عند الكتابة في الحقل
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
