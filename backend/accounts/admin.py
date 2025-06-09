from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'is_active', 'membership', 'is_subscribed']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {
            'fields': (
                'currency', 'favorite', 'friends',
                'membership', 'is_subscribed', 'membership_expiration_date'
            )
        }),
    )
