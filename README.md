# Hospital Management App API documentation

This API allows patients to register, log in, book, reschedule, or cancel appointments with doctors.

## **Endpoints**

### 1. Register a patient

**Endpoint**: `POST /patients`
**Description**: Registers a new patient.

#### Parameters:

- `username` : unique username for the patient.
- `password`: Password for authentication.
- `full_name`: Patient's full name.
- `gender`: Gender of the patient.
- `dob`: Patient's date of birth.

#### Response:

- **body**: An object containing patient details.
- **status**: `201 created`

---

### 2. Login

**Endpoint**: `POST /users`
**Description**: Logs in a registered patient.

#### Parameters:

- `username`: User's username.
- `password`: User's password.

#### Response:

- **cookie**: A cookie containing user details.
- **status**: `201 created`

---

### 3. Book an appointment

**Endpoint**: `POST /appointments/me`
**Description**: Books an appointment with a doctor.

#### Parameters:

- `slot`: id of the available time slot.

#### Response:

- **body**: An object with appointment details
- **status**: `201 created`

---

### 4. Reschedule an appointment

**Endpoint**: `PUT /appointment/${appointment_id}`
**Description**: Reschedules an existing appointment.

#### Parameters:

- `appointment_id`: id of an appointment to reschedule.

#### Response:

- **body**: Object containing updated details.
- **status**: `200 OK`

---

### 5. Cancel an appointment

**Endpoint**: `DELETE /appointment/${appointment_id}`
**Description**: Cancels an existing appointment.

#### Parameters:

- `appointment_id`: id of the appointment to cancel.

#### Response:

- **status**: `204 OK`
