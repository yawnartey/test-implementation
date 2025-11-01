from django.urls import path
from . import views

urlpatterns = [
    #auth  endpoints
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('users/', views.get_users, name='get_users'),
    path('users/<int:user_id>/delete/', views.delete_user, name='delete_user'),
    
    #patient's endpoints
    path('patients/', views.patient_list_create, name='patient_list_create'),
    path('patients/<int:patient_id>/', views.patient_detail, name='patient_detail'),
]