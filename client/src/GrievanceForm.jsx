import { useState } from 'react';
import './App.css';

export default function GrievanceForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    mobile: '',
    aadhaar: '',
    address: '',
    pincode: '',
    
    // Grievance Details
    department: '',
    priority: '',
    subject: '',
    description: '',
    incidentDate: '',
    
    // Documents
    fileAttached: false,
    fileName: ''
  });
  
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [errors, setErrors] = useState({});

  const departments = [
    { value: '', label: 'Select Department' },
    { value: 'water', label: '💧 Water & Sanitation' },
    { value: 'electricity', label: '⚡ Electricity Board' },
    { value: 'transport', label: '🚌 Road & Transport' },
    { value: 'health', label: '🏥 Public Health' },
    { value: 'education', label: '📚 Education Department' },
    { value: 'police', label: '👮 Police & Safety' },
    { value: 'municipality', label: '🏛️ Municipal Services' },
    { value: 'land', label: '📋 Land & Revenue' },
    { value: 'other', label: '📌 Other' }
  ];

  const priorities = [
    { value: '', label: 'Select Priority Level' },
    { value: 'critical', label: '🔴 Critical - Immediate Action Required' },
    { value: 'high', label: '🟠 High - Requires Urgent Attention' },
    { value: 'medium', label: '🟡 Medium - Standard Processing' },
    { value: 'low', label: '🟢 Low - General Inquiry' }
  ];

  // Start timer when OTP is sent
  useState(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleInputChange = (e) => {
    const { name, value } = e;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGetOtp = () => {
    if (!formData.mobile || !/^[6-9]\d{9}$/.test(formData.mobile)) {
      setErrors(prev => ({ ...prev, mobile: 'Enter valid Indian mobile number' }));
      return;
    }
    const fakeOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(fakeOtp);
    setIsOtpSent(true);
    setTimer(120); // 2 minutes
    alert(`OTP sent to +91-${formData.mobile}\n\nYour OTP: ${fakeOtp}\n\nValid for 2 minutes`);
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setIsVerified(true);
      setErrors(prev => ({ ...prev, otp: '' }));
      alert('✓ Mobile number verified successfully!');
    } else {
      setErrors(prev => ({ ...prev, otp: 'Invalid OTP. Please try again.' }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }
      setFormData(prev => ({ 
        ...prev, 
        fileAttached: true,
        fileName: file.name 
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.mobile || !/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Valid 10-digit mobile number required';
    }
    if (!isVerified) newErrors.verification = 'Please verify your mobile number';
    if (!formData.aadhaar || formData.aadhaar.length !== 12) {
      newErrors.aadhaar = '12-digit Aadhaar number required';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Valid 6-digit pincode required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.department) newErrors.department = 'Please select a department';
    if (!formData.priority) newErrors.priority = 'Please select priority level';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.description.trim() || formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }
    if (!formData.incidentDate) newErrors.incidentDate = 'Incident date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    if (validateStep2()) {
      const id = 'GRV' + Date.now().toString().slice(-8);
      setTrackingId(id);
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    }
  };

  const handleNewGrievance = () => {
    setStep(1);
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      aadhaar: '',
      address: '',
      pincode: '',
      department: '',
      priority: '',
      subject: '',
      description: '',
      incidentDate: '',
      fileAttached: false,
      fileName: ''
    });
    setOtp('');
    setGeneratedOtp('');
    setIsOtpSent(false);
    setIsVerified(false);
    setIsSubmitted(false);
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <div className="container">
        <div className="success-screen">
          <div className="success-animation">
            <div className="checkmark-circle">
              <div className="checkmark"></div>
            </div>
          </div>
          <h1 className="success-title">Grievance Registered Successfully!</h1>
          <p className="success-subtitle">Your complaint has been recorded in our system</p>
          
          <div className="tracking-card">
            <div className="tracking-label">Your Tracking ID</div>
            <div className="tracking-number">{trackingId}</div>
            <div className="tracking-info">Save this ID to track your grievance status</div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">📱</div>
              <div className="info-text">
                <div className="info-title">SMS Confirmation</div>
                <div className="info-desc">Sent to +91-{formData.mobile}</div>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📧</div>
              <div className="info-text">
                <div className="info-title">Email Notification</div>
                <div className="info-desc">Sent to {formData.email}</div>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">⏱️</div>
              <div className="info-text">
                <div className="info-title">Expected Response</div>
                <div className="info-desc">Within 7 working days</div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={handleNewGrievance} className="btn-secondary">
              File Another Grievance
            </button>
            <button onClick={() => alert('Track feature coming soon!')} className="btn-primary">
              Track Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="portal-header">
        <div className="portal-logo">
          <div className="logo-icon">🇮🇳</div>
          <div className="logo-text">
            <h1>National Grievance Portal</h1>
            <p>Government of India</p>
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Personal Details</div>
        </div>
        <div className={`progress-line ${step > 1 ? 'completed' : ''}`}></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Grievance Details</div>
        </div>
      </div>

      <div className="form-card">
        {step === 1 ? (
          <div className="form-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              <p>Please provide your contact details for communication</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange(e.target)}
                  placeholder="As per Government ID"
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e.target)}
                  placeholder="your.email@example.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Mobile Number *</label>
              <div className="input-group">
                <span className="input-prefix">+91</span>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange(e.target)}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  disabled={isVerified}
                  className={errors.mobile ? 'error' : ''}
                />
                {!isVerified && !isOtpSent && (
                  <button onClick={handleGetOtp} className="btn-inline">
                    Get OTP
                  </button>
                )}
                {isVerified && (
                  <span className="verified-badge">✓ Verified</span>
                )}
              </div>
              {errors.mobile && <span className="error-text">{errors.mobile}</span>}
            </div>

            {isOtpSent && !isVerified && (
              <div className="otp-section">
                <div className="form-group">
                  <label>Enter OTP *</label>
                  <div className="input-group">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      maxLength="4"
                      className={errors.otp ? 'error' : ''}
                    />
                    <button onClick={handleVerifyOtp} className="btn-inline">
                      Verify
                    </button>
                  </div>
                  {errors.otp && <span className="error-text">{errors.otp}</span>}
                  {timer > 0 && (
                    <div className="otp-timer">OTP expires in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</div>
                  )}
                  {timer === 0 && (
                    <button onClick={handleGetOtp} className="resend-link">Resend OTP</button>
                  )}
                </div>
              </div>
            )}

            {errors.verification && (
              <div className="alert-error">{errors.verification}</div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Aadhaar Number *</label>
                <input
                  type="text"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={(e) => handleInputChange(e.target)}
                  placeholder="12-digit Aadhaar"
                  maxLength="12"
                  className={errors.aadhaar ? 'error' : ''}
                />
                {errors.aadhaar && <span className="error-text">{errors.aadhaar}</span>}
              </div>

              <div className="form-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange(e.target)}
                  placeholder="6-digit pincode"
                  maxLength="6"
                  className={errors.pincode ? 'error' : ''}
                />
                {errors.pincode && <span className="error-text">{errors.pincode}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Complete Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={(e) => handleInputChange(e.target)}
                placeholder="House No., Street, Locality, City, State"
                rows="3"
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="form-actions">
              <button onClick={handleNext} className="btn-primary btn-large">
                Continue to Grievance Details →
              </button>
            </div>
          </div>
        ) : (
          <div className="form-section">
            <div className="section-header">
              <h2>Grievance Information</h2>
              <p>Describe your issue in detail</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={(e) => handleInputChange(e.target)}
                  className={errors.department ? 'error' : ''}
                >
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
                {errors.department && <span className="error-text">{errors.department}</span>}
              </div>

              <div className="form-group">
                <label>Priority Level *</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={(e) => handleInputChange(e.target)}
                  className={errors.priority ? 'error' : ''}
                >
                  {priorities.map(pri => (
                    <option key={pri.value} value={pri.value}>{pri.label}</option>
                  ))}
                </select>
                {errors.priority && <span className="error-text">{errors.priority}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange(e.target)}
                  placeholder="Brief summary of your grievance"
                  className={errors.subject ? 'error' : ''}
                />
                {errors.subject && <span className="error-text">{errors.subject}</span>}
              </div>

              <div className="form-group">
                <label>Date of Incident *</label>
                <input
                  type="date"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={(e) => handleInputChange(e.target)}
                  max={new Date().toISOString().split('T')[0]}
                  className={errors.incidentDate ? 'error' : ''}
                />
                {errors.incidentDate && <span className="error-text">{errors.incidentDate}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Detailed Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange(e.target)}
                placeholder="Describe your grievance in detail (minimum 50 characters)..."
                rows="6"
                className={errors.description ? 'error' : ''}
              />
              <div className="char-counter">
                {formData.description.length} characters
              </div>
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label>Attach Supporting Documents (Optional)</label>
              <div className="file-upload">
                <input
                  type="file"
                  id="fileUpload"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                />
                <label htmlFor="fileUpload" className="file-upload-label">
                  <span className="upload-icon">📎</span>
                  <span>{formData.fileAttached ? formData.fileName : 'Choose File (PDF, JPG, PNG - Max 5MB)'}</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button onClick={() => setStep(1)} className="btn-secondary btn-large">
                ← Back
              </button>
              <button onClick={handleSubmit} className="btn-primary btn-large">
                Submit Grievance
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}