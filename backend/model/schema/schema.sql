CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'cancelled', 'rescheduled');

-- only for form login
CREATE TABLE auth (
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE patients (
    patient  VARCHAR(100) PRIMARY KEY REFERENCES auth(username),
    full_name VARCHAR(100) NOT NULL,
    gender gender_enum NOT NULL,
    dob DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE doctors (
    doctor VARCHAR(100) PRIMARY KEY REFERENCES auth(username),
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
    doctor VARCHAR(100) REFERENCES doctors(doctor),
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration INT NOT NULL CHECK (duration > 0)
);

CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient VARCHAR(100) REFERENCES patients(patient),
    slot INT REFERENCES time_slots(slot_id),
    status appointment_status DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE sessions (
    username VARCHAR(100) REFERENCES auth(username),
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);



