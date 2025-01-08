-- doctor data
INSERT INTO auth (username, password) VALUES
                 ('docA', '123456'),
                 ('docB', '123456'),
                 ('docC', '123456');

INSERT INTO specialities (title) VALUES 
                        ('cardiology'), ('dermatology'), ('neurology');

INSERT INTO doctors (doctor_id, full_name, gender, speciality) VALUES
                 (10, 'doctor A', 'male', 1),
                 (11, 'doctor B', 'female', 2),
                 (12, 'doctor C', 'male', 3);

INSERT INTO time_slots (doctor_id, slot_date, start_time, duration) VALUES
                 (10, '10-01-2025', '11:00', 30),
                 (10, '10-01-2025', '11:30', 30),
                 (11, '15-01-2025', '12:00', 30),
                 (11, '16-01-2025', '14:00', 30),
                 (12, '12-01-2025', '14:30', 45),
                 (12, '10-01-2025', '15:30', 45);