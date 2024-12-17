CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    gender gender_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
    doctor_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    speciality VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    fees INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE time_slots (
    slot_id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES doctors(doctor_id),
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    UNIQUE (doctor_id, slot_date, start_time, end_time)
);

CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    doctor_id INT REFERENCES doctors(doctor_id),
    appointment_slot INT REFERENCES time_slots(slot_id),
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
