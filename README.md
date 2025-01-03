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

**success**:

```json
{
  "message": "Patient registered successfully.",
  "data": {
    "userId": 13,
    "userName": "patient6",
    "fullName": "Patient six",
    "gender": "female",
    "dob": "1994-12-31T18:30:00.000Z"
  }
}
```

**status**: `201 created`

**error**:

```json
{
  "message": "Username already exists."
}
```

**status**: `400 Bad Request`

---

### 2. Login

**Endpoint**: `POST /sessions`
**Description**: Logs in a registered patient.

#### Parameters:

- `username`: User's name.
- `password`: User's password.

#### Response:

**success**:

```json
{
  "message": "Session created."
}
```

**status**: `201 created`

**error**:

```json
{
  "error": "Invalid username or password."
}
```

**status**: `401 unauthorized`

---

### 3. Logout

**Endpoint**: `DELETE /sessions`
**Description**: Logs out a user.

#### Response:

**success**: `204 No Content`

---

### 4. Book an appointment

**Endpoint**: `POST /appointments/me`
**Description**: Books an appointment with a doctor.

#### Parameters:

- `slot`: ID of the available time slot.

#### Response:

**success**:

```json
{
  "message": "Appointment booked successfully.",
  "data": {
    "appointment_id": 2,
    "patient_id": 13,
    "slot": 2,
    "status": "scheduled",
    "created_at": "2025-01-02T10:32:40.766Z",
    "updated_at": null
  }
}
```

**status**: `201 created`

**error**:

```json
{
  "error": "Missing slot ID."
}
```

**status**: `400 Bad Request`

```json
{
  "error": "Slot is already booked."
}
```

**status**: `422 unprocessable entity`

---

### 5. Reschedule an appointment

**Endpoint**: `PUT /appointments/${appointment_id}`
**Description**: Reschedules an existing appointment.

#### Parameters:

- `appointment_id`: ID of an appointment to reschedule.

#### Response:

**success**:

```json
{
  "message": "Appointment rescheduled successfully.",
  "data": {
    "appointment_id": 2,
    "patient_id": 13,
    "slot": 3,
    "status": "rescheduled",
    "created_at": "2025-01-02T10:32:40.766Z",
    "updated_at": "2025-01-02T10:34:12.634Z"
  }
}
```

**status**: `200 OK`

**error**:

```json
{
  "error": "Appointment does not exist."
}
```

**status**: `400 Bad Request`

```json
{
  "error": "You are not authorized to reschedule the appointment."
}
```

**status**: `403 Forbidden`

```json
{
  "error": "Missing slot ID."
}
```

**status**: `400 Bad Request`

```json
{
  "error": "Slot is already booked"
}
```

**status**: `422 unprocessable entity`

---

### 6. Cancel an appointment

**Endpoint**: `DELETE /appointments/${appointment_id}`
**Description**: Cancels an existing appointment.

#### Parameters:

- `appointment_id`: ID of the appointment to cancel.

#### Response:

**success**:

**status**: `204 No Content`

**error**:

```json
{
  "error": "Appointment does not exist."
}
```

**status**: `400 Bad Request`

```json
{
  "error": "You are not authorized to reschedule the appointment."
}
```

**status**: `403 Forbidden`

---

### 7. Get doctors

**Endpoint**: `GET /doctors`
**Description**: Fetches doctors list.

#### Response:

**success**:

```json
{
  "message": "Fetched doctors list.",
  "data": [
    {
      "full_name": "doctor A",
      "speciality": "cardiology"
    },
    {
      "full_name": "doctor B",
      "speciality": "dermatology"
    },
    {
      "full_name": "doctor C",
      "speciality": "neurology"
    }
  ]
}
```

**status**: `200 OK`

---

### 8. Get doctor's details

**Endpoint**: `GET /doctors/${doctor_id}`
**Description**: Fetches one specific doctor's details.

#### Parameters:

- `doctor_id`: ID of the doctor whose details will be fetched.

#### Response:

**success**:

```json
{
  "message": "Fetched doctor's details succesfully.",
  "data": {
    "full_name": "doctor A",
    "gender": "male",
    "dob": null,
    "speciality": "cardiology",
    "description": null,
    "fees": null,
    "slot_id": 1,
    "slot_date": "2024-12-31T18:30:00.000Z",
    "start_time": "11:00:00",
    "duration": 30
  }
}
```

**status**: `200 OK`

**error**:

```json
{
  "error": "Doctor does not exist."
}
```

**status**: `404 Not Found`

---

### 9. Get appointments for patient or doctor

**Endpoint**: `GET /appointments`
**Description**: Fetches appointments for a patient or a doctor.

#### Response:

**success**:

```json
{
  "message": "Fetched appointments for user.",
  "data": [
    {
      "appointment_id": 1,
      "patient_id": 5,
      "slot": 1,
      "status": "cancelled",
      "created_at": "2024-12-30T13:48:00.565Z",
      "updated_at": "2024-12-30T14:28:44.900Z"
    }
  ]
}
```

**status**: `200 OK`

**error**:

```json
{
  "error": "User is not a patient or doctor."
}
```

**status**: `403 Forbidden`
