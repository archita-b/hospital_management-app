-- doctor data
INSERT INTO auth (username, password) VALUES
                 ('docA', '123456'),
                 ('docB', '123456'),
                 ('docC', '123456');

INSERT INTO doctors (doctor, full_name, gender, speciality) VALUES
                 ('docA', 'doctor A', 'male', 'cardiology'),
                 ('docB', 'doctor B', 'female', 'dermatology'),
                 ('docC', 'doctor C', 'male', 'neurology');

INSERT INTO time_slots (doctor, slot_date, start_time, duration) VALUES
                 ('docA', '01-01-2025', '11:00', 30),
                 ('docB', '29-12-2024', '12:00', 30),
                 ('docC', '28-12-2024', '14:30', 45);