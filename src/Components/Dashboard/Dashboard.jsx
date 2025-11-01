import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
    const [patients, setPatients] = useState([]);
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
                setSuccess(editingPatient ? 'Patient updated successfully!' : 'Patient created successfully!');
                setShowForm(false);
                setEditingPatient(null);
                setPatientForm({ name: '', email: '', phone: '', age: '', diagnosis: '', treatment: '' });
                fetchPatients(); // Refresh the list
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
                    fetchPatients();
                } else {
                    setError('Failed to delete patient');
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

    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                <div className="nav-brand">WHDR Dashboard</div>
                <div className="nav-actions">
                    <span>Welcome, {user.name}</span>
                    <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Patient Records</h1>
                    <button 
                        onClick={() => setShowForm(true)} 
                        className="add-btn"
                        disabled={showForm}
                    >
                        Add New Patient
                    </button>
                </div>

                {/* Error/Success messages */}
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                {/* Patient Form */}
                {showForm && (
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
                )}

                {/* Patients List */}
                <div className="patients-list">
                    {patients.length === 0 ? (
                        <p className="no-patients">No patients found. Add your first patient!</p>
                    ) : (
                        <div className="patients-grid">
                            {patients.map(patient => (
                                <div key={patient.id} className="patient-card">
                                    <h3>{patient.name}</h3>
                                    <p><strong>Email:</strong> {patient.email}</p>
                                    <p><strong>Phone:</strong> {patient.phone}</p>
                                    <p><strong>Age:</strong> {patient.age}</p>
                                    <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
                                    <p><strong>Treatment:</strong> {patient.treatment}</p>
                                    <div className="card-actions">
                                        <button onClick={() => handleEdit(patient)} className="edit-btn">Edit</button>
                                        <button onClick={() => handleDelete(patient.id)} className="delete-btn">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;