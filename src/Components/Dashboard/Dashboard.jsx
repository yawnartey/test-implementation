import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state for patient data
    const [patientForm, setPatientForm] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        diagnosis: '',
        treatment: ''
    });

    // Role-based permission functions
    const canEdit = (patient) => {
        if (!patient || !user) return false;
        return user.role === 'admin' || 
               user.role === 'doctor' || 
               patient.created_by === user.name;
    };

    const canDelete = (patient) => {
        if (!patient || !user) return false;
        return user.role === 'admin' || 
               user.role === 'doctor' || 
               patient.created_by === user.name;
    };

    const canCreate = () => {
        return true; // All authenticated users can create patients
    };

    const canViewAll = () => {
        return user?.role === 'admin' || user?.role === 'doctor' || user?.role === 'nurse';
    };

    // Fetch patients on component mount
    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/patients/', {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setPatients(data);
                // If we have patients and none is selected, select the first one
                if (data.length > 0 && !selectedPatient) {
                    setSelectedPatient(data[0]);
                }
            } else {
                setError('Failed to fetch patients');
            }
        } catch (err) {
            setError('Failed to fetch patients');
        }
    };

    const handleInputChange = (e) => {
        setPatientForm({
            ...patientForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const url = editingPatient 
                ? `http://localhost:8000/api/patients/${editingPatient.id}/`
                : 'http://localhost:8000/api/patients/';
            
            const method = editingPatient ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patientForm)
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(editingPatient ? 'Patient updated successfully!' : 'Patient created successfully!');
                setShowForm(false);
                setEditingPatient(null);
                setPatientForm({ name: '', email: '', phone: '', age: '', diagnosis: '', treatment: '' });
                fetchPatients(); // Refresh the list
                
                // Auto-select the created/updated patient
                if (editingPatient) {
                    setSelectedPatient(data.patient);
                } else {
                    // For new patients, find and select the newly created one
                    setTimeout(() => {
                        fetchPatients();
                    }, 500);
                }
            } else {
                const data = await response.json();
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (patient) => {
        if (!canEdit(patient)) {
            setError('You do not have permission to edit this patient record.');
            return;
        }
        
        setEditingPatient(patient);
        setPatientForm({
            name: patient.name,
            email: patient.email,
            phone: patient.phone,
            age: patient.age,
            diagnosis: patient.diagnosis,
            treatment: patient.treatment
        });
        setShowForm(true);
    };

    const handleDelete = async (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        
        if (!canDelete(patient)) {
            setError('You do not have permission to delete this patient record.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8000/api/patients/${patientId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${token}`,
                    }
                });

                if (response.ok) {
                    setSuccess('Patient deleted successfully!');
                    
                    // Clear selection if deleted patient was selected
                    if (selectedPatient && selectedPatient.id === patientId) {
                        setSelectedPatient(null);
                    }
                    
                    fetchPatients();
                } else {
                    const data = await response.json();
                    setError(data.message || 'Failed to delete patient');
                }
            } catch (err) {
                setError('Network error. Please try again.');
            }
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingPatient(null);
        setPatientForm({ name: '', email: '', phone: '', age: '', diagnosis: '', treatment: '' });
        setError('');
        setSuccess('');
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setShowForm(false); // Close form if open
        setEditingPatient(null);
        setError(''); // Clear any errors
    };

    const getRoleDisplayName = (role) => {
        const roleMap = {
            'admin': 'Administrator',
            'doctor': 'Doctor',
            'nurse': 'Nurse'
        };
        return roleMap[role] || role;
    };

    const getRoleBadgeClass = (role) => {
        return `role-badge ${role}`;
    };

    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                <div className="nav-brand">WHDR Dashboard</div>
                <div className="nav-actions">
                    <span>
                        Welcome, {user.name} 
                        <span className={getRoleBadgeClass(user.role)}>
                            {getRoleDisplayName(user.role)}
                        </span>
                    </span>
                    <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Patient Records</h1>
                    {canCreate() && (
                        <button 
                            onClick={() => setShowForm(true)} 
                            className="add-btn"
                            disabled={showForm}
                        >
                            Add New Patient
                        </button>
                    )}
                </div>

                {/* Role-based access info - Only for admin */}
                {user?.role === 'admin' && (
                    <div className="permission-notice admin">
                        <strong>👨‍💼 Administrator Access:</strong> You have complete system access to all records and users.
                    </div>
                )}

                {/* Error/Success messages */}
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="dashboard-main">
                    {/* Patient List Sidebar */}
                    <div className="patients-sidebar">
                        <div className="sidebar-header">
                            <h3>
                                Patients ({patients.length})
                                {!canViewAll() && <small> (Your records)</small>}
                            </h3>
                        </div>
                        <div className="patients-list">
                            {patients.length === 0 ? (
                                <div className="no-patients">
                                    <p>No patients found.</p>
                                    <p>Add your first patient!</p>
                                </div>
                            ) : (
                                patients.map(patient => (
                                    <div 
                                        key={patient.id} 
                                        className={`patient-list-item ${selectedPatient?.id === patient.id ? 'selected' : ''}`}
                                        onClick={() => handlePatientSelect(patient)}
                                    >
                                        <div className="patient-info">
                                            <h4>
                                                {patient.name}
                                                {patient.created_by === user?.name && (
                                                    <span className="created-by-you"></span>
                                                )}
                                            </h4>
                                            <p>{patient.diagnosis}</p>
                                            <div className="patient-meta">
                                                <span className="patient-age">Age: {patient.age}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Patient Details Panel */}
                    <div className="patient-details">
                        {showForm ? (
                            /* Patient Form */
                            <div className="patient-form-container">
                                <h2>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
                                <form onSubmit={handleSubmit} className="patient-form">
                                    <div className="form-row">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Patient Name"
                                            value={patientForm.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={patientForm.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number"
                                            value={patientForm.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="number"
                                            name="age"
                                            placeholder="Age"
                                            value={patientForm.age}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <input
                                            type="text"
                                            name="diagnosis"
                                            placeholder="Diagnosis"
                                            value={patientForm.diagnosis}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="treatment"
                                            placeholder="Treatment"
                                            value={patientForm.treatment}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" disabled={loading}>
                                            {loading ? 'Saving...' : editingPatient ? 'Update Patient' : 'Add Patient'}
                                        </button>
                                        <button type="button" onClick={resetForm}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        ) : selectedPatient ? (
                            /* Patient Details Display */
                            <div className="patient-details-view">
                                <div className="details-header">
                                    <h2>{selectedPatient.name}</h2>
                                    <div className="details-actions">
                                        {canEdit(selectedPatient) ? (
                                            <button onClick={() => handleEdit(selectedPatient)} className="edit-btn">
                                                Edit Patient
                                            </button>
                                        ) : (
                                            <button disabled className="edit-btn disabled" title="No permission to edit">
                                                Edit Patient
                                            </button>
                                        )}
                                        
                                        {canDelete(selectedPatient) ? (
                                            <button onClick={() => handleDelete(selectedPatient.id)} className="delete-btn">
                                                Delete Patient
                                            </button>
                                        ) : (
                                            <button disabled className="delete-btn disabled" title="No permission to delete">
                                                Delete Patient
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="details-content">
                                    <div className="detail-group">
                                        <h3>Personal Information</h3>
                                        <div className="detail-item">
                                            <label>Full Name:</label>
                                            <span>{selectedPatient.name}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Email:</label>
                                            <span>{selectedPatient.email}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Phone:</label>
                                            <span>{selectedPatient.phone}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Age:</label>
                                            <span>{selectedPatient.age} years</span>
                                        </div>
                                    </div>
                                    
                                    <div className="detail-group">
                                        <h3>Medical Information</h3>
                                        <div className="detail-item">
                                            <label>Diagnosis:</label>
                                            <span>{selectedPatient.diagnosis}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Treatment:</label>
                                            <span>{selectedPatient.treatment}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="detail-group">
                                        <h3>Record Information</h3>
                                        <div className="detail-item">
                                            <label>Created By:</label>
                                            <span>
                                                {selectedPatient.created_by} 
                                                {selectedPatient.created_by_role && (
                                                    <span className={getRoleBadgeClass(selectedPatient.created_by_role.toLowerCase())}>
                                                        {selectedPatient.created_by_role}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Created:</label>
                                            <span>{new Date(selectedPatient.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Last Updated:</label>
                                            <span>{new Date(selectedPatient.updated_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* No Patient Selected */
                            <div className="no-selection">
                                <h2>No Patient Selected</h2>
                                <p>Select a patient from the list to view their details, or add a new patient.</p>
                                {!canViewAll() && (
                                    <div className="access-info">
                                        <p><strong>Note:</strong> You are viewing only the records you created.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;