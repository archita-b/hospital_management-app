-- doctor data
INSERT INTO auth (username, password) VALUES
                 ('docA', '123456'),
                 ('docB', '123456'),
                 ('docC', '123456');

INSERT INTO specialities (name) VALUES 
                        ('cardiology'), ('dermatology'), ('neurology');

INSERT INTO doctors (doctor_id, full_name, gender, speciality) VALUES
                 (10, 'doctor A', 'male', 1),
                 (11, 'doctor B', 'female', 2),
                 (12, 'doctor C', 'male', 3);

INSERT INTO time_slots (doctor_id, slot_time, duration) VALUES
                (10, '2025-01-25 09:00:00', 30),
                (10, '2025-01-25 09:30:00', 30),
                (10, '2025-01-25 10:00:00', 30),
                (11, '2025-01-25 14:00:00', 45),
                (11, '2025-01-25 15:00:00', 45),
                (12, '2025-01-26 11:00:00', 20),
                (12, '2025-01-26 11:20:00', 20),
                (12, '2025-01-26 11:40:00', 20);
