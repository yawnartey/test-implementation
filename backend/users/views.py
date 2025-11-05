from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer, PatientSerializer
from .models import CustomUser, Patient

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    print("Received data:", request.data)
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'message': 'User registered successfully',
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    else:
        print("Validation errors:", serializer.errors)
    return Response({
        'message': 'Registration failed, check your credentials',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'message': 'Login successful',
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)
    return Response({
        'message': 'Login failed, check your credentials',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_users(request):
    users = CustomUser.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

# Patient CRUD Views with Role-Based Access
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def patient_list_create(request):
    if request.method == 'GET':
        # Role-based patient access
        if request.user.role == 'admin':
            # Admins see all patients
            patients = Patient.objects.all()
        elif request.user.role in ['doctor', 'nurse']:
            # Doctors and nurses see all patients (healthcare team access)
            patients = Patient.objects.all()
        else:
            # Default: only own patients
            patients = Patient.objects.filter(created_by=request.user)
        
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PatientSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Patient created successfully',
                'patient': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'message': 'Failed to create patient',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def patient_detail(request, patient_id):
    try:
        patient = Patient.objects.get(id=patient_id)
        
        # Role-based access control
        if request.user.role == 'admin':
            # Admins can access any patient
            pass
        elif request.user.role in ['doctor', 'nurse']:
            # Healthcare team can access any patient
            pass
        elif patient.created_by != request.user:
            # Non-healthcare users can only access their own patients
            return Response({'message': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
            
    except Patient.DoesNotExist:
        return Response({'message': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = PatientSerializer(patient)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Only allow updates if user has proper permissions
        if request.user.role not in ['admin', 'doctor'] and patient.created_by != request.user:
            return Response({'message': 'Insufficient permissions to update'}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = PatientSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Patient updated successfully',
                'patient': serializer.data
            })
        return Response({
            'message': 'Failed to update patient',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Only admins and doctors can delete, or the creator
        if request.user.role not in ['admin', 'doctor'] and patient.created_by != request.user:
            return Response({'message': 'Insufficient permissions to delete'}, status=status.HTTP_403_FORBIDDEN)
            
        patient.delete()
        return Response({'message': 'Patient deleted successfully'}, status=status.HTTP_200_OK)