from django.contrib import admin
from .models import CustomUser, Patient

# Register your models here.
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'date_joined', 'is_active']
    list_filter = ['is_active', 'date_joined']
    search_fields = ['email', 'name']

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'age', 'diagnosis', 'created_by', 'created_at']
    list_filter = ['created_at', 'created_by']
    search_fields = ['name', 'email', 'diagnosis']
    readonly_fields = ['created_at', 'updated_at']    