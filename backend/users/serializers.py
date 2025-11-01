from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, Patient

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=CustomUser.USER_ROLES, required=False)
    
    class Meta:
        model = CustomUser
        fields = ('name', 'email', 'password', 'role')
    
    def create(self, validated_data):
        # Ensure role is properly set
        role = validated_data.get('role', 'doctor')
        print(f"Creating user with role: {role}")  # Debug line
        user = CustomUser.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
            role=role
        )
        print(f"User created with role: {user.role}")  # Debug line
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Invalid email or password.')
        else:
            raise serializers.ValidationError('Must include email and password.')
        
        return data

class UserSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = ('id', 'name', 'email', 'role', 'role_display', 'date_joined')

class PatientSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    created_by_role = serializers.CharField(source='created_by.get_role_display', read_only=True)
    
    class Meta:
        model = Patient
        fields = ('id', 'name', 'email', 'phone', 'age', 'diagnosis', 'treatment', 'created_by', 'created_by_role', 'created_at', 'updated_at')
        read_only_fields = ('created_by', 'created_at', 'updated_at')
    
    def get_created_by(self, obj):
        return obj.created_by.name
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)