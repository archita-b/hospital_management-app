CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'cancelled', 'rescheduled');

-- only for form login
CREATE TABLE auth (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY REFERENCES auth(user_id),
    full_name VARCHAR(100) NOT NULL,
    gender gender_enum NOT NULL,
    dob DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE doctors (
    doctor_id SERIAL PRIMARY KEY REFERENCES auth(user_id),
    full_name VARCHAR(100) NOT NULL,
    gender gender_enum NOT NULL,
    dob DATE,
    speciality VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    fees INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE time_slots (
    slot_id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES doctors(doctor_id),
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration INT NOT NULL CHECK (duration > 0)
);

CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(patient_id),
    slot INT REFERENCES time_slots(slot_id),
    status appointment_status DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE sessions (
    user_id INT REFERENCES auth(user_id),
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);




