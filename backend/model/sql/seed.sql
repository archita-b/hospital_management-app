-- doctor data
INSERT INTO auth (username, password) VALUES
                 ('docA', '123456'),
                 ('docB', '123456'),
                 ('docC', '123456');

INSERT INTO specialities (name) VALUES 
                        ('cardiology'), ('dermatology'), ('neurology');

INSERT INTO doctors (doctor_id, full_name, gender, speciality) VALUES
                 (1, 'doctor A', 'male', 1),
                 (2, 'doctor B', 'female', 2),
                 (3, 'doctor C', 'male', 3);

INSERT INTO time_slots (doctor_id, slot_time, duration) VALUES
                (1, '2025-01-25 09:00:00', 30),
                (1, '2025-01-25 09:30:00', 30),
                (1, '2025-01-25 10:00:00', 30),
                (2, '2025-01-25 14:00:00', 45),
                (2, '2025-01-25 15:00:00', 45),
                (3, '2025-01-26 11:00:00', 20),
                (3, '2025-01-26 11:20:00', 20),
                
                (3, '2025-01-26 11:40:00', 20);