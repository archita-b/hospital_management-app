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
  "userId": 13,
  "userName": "patient6",
  "fullName": "Patient six",
  "gender": "female",
  "dob": "1994-12-31T18:30:00.000Z"
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

### 4. Schedule an appointment

**Endpoint**: `POST /appointments/me`
**Description**: locks a time slot selected by the user in redis.

#### Parameters:

- `slot`: ID of the slot to be locked.

#### Response:

**success**:

```json
{
  "appointmentId": "5a3116fa-16e1-44b8-8c75-f12e7bad9ef5"
}
```

**status**: `201 Created`

**error**:

```json
{
  "error": "Patient does not exist."
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
  "error": "Slot is temporarily locked."
}
```

**status**: `422 Unprocessable Entity`

```json
{
  "error": "Slot is already booked."
}
```

**status**: `422 Unprocessable Entity`

---

### 5. Confirm an appointment

**Endpoint**: `PUT /appointments/me`
**Description**: creates a confirmed appointment record with a doctor.

#### Parameters:

- `slot`: ID of the available time slot.

#### Response:

**success**:

```json
{
  "appointment_id": 5,
  "doctor_name": "doctor B",
  "patient_id": 7,
  "patient_name": "Patient three",
  "slot_date": "2024-12-28T18:30:00.000Z",
  "start_time": "14:00:00",
  "duration": 30,
  "status": "scheduled"
}
```

**status**: `200 OK`

**error**:

```json
{
  "error": "No scheduled appointment found."
}
```

**status**: `422 Unprocessable Entity`

```json
{
  "error": "Unauthorized access to the slot."
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
  "error": "Slot is already booked."
}
```

**status**: `422 unprocessable entity`

---

### 6. Reschedule an appointment

**Endpoint**: `PUT /appointments/${appointment_id}`
**Description**: Reschedules an existing appointment.

#### Parameters:

- `appointment_id`: ID of an appointment to reschedule.

#### Response:

**success**:

```json
{
  "appointment_id": 5,
  "patient_id": 7,
  "patient_name": "Patient three",
  "doctor_name": "doctor C",
  "slot_date": "2024-12-27T18:30:00.000Z",
  "start_time": "14:30:00",
  "duration": 45,
  "status": "rescheduled"
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

### 7. Cancel an appointment

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

### 8. Get doctors

**Endpoint**: `GET /doctors`
**Description**: Fetches doctors list.

#### Response:

**success**:

```json
[
  {
    "doctor_id": 10,
    "full_name": "doctor A",
    "speciality": "cardiology"
  },
  {
    "doctor_id": 11,
    "full_name": "doctor B",
    "speciality": "dermatology"
  },
  {
    "doctor_id": 12,
    "full_name": "doctor C",
    "speciality": "neurology"
  }
]
```

**status**: `200 OK`

---

### 9. Get doctor's details

**Endpoint**: `GET /doctors/${doctor_id}`
**Description**: Fetches one specific doctor's details.

#### Parameters:

- `doctor_id`: ID of the doctor whose details will be fetched.

#### Response:

**success**:

```json
{
  "full_name": "doctor B",
  "gender": "female",
  "dob": null,
  "speciality": "dermatology",
  "description": null,
  "fees": null,
  "availableTimeSlots": [
    {
      "slotId": 3,
      "slotDate": "2024-12-28T18:30:00.000Z",
      "duration": 30
    }
  ]
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

### 10. Get appointments for patient or doctor

**Endpoint**: `GET /appointments`
**Description**: Fetches appointments for a patient or a doctor.

#### Response:

**success**:

```json
[
  {
    "appointment_id": 5,
    "doctor_name": "doctor C",
    "patient_id": 7,
    "patient_name": "Patient three",
    "slot_date": "2024-12-27T18:30:00.000Z",
    "start_time": "14:30:00",
    "duration": 45,
    "status": "rescheduled"
  }
]
```

**status**: `200 OK`

**error**:

```json
{
  "error": "User is not a patient or doctor."
}
```

**status**: `403 Forbidden`

---

### 11. Get doctors by speciality and time slots

**Endpoint**: `GET /doctors/specialities/${name}`
**Description**: Fetches doctor's details and available time slots as per the patients choice.

#### Response:

**success**:

```json
[
  {
    "doctor_id": 10,
    "full_name": "doctor A",
    "gender": "male",
    "fees": null,
    "slot_id": 9,
    "slot_time": "2025-01-25T03:30:00.000Z",
    "duration": 30
  }
]
```

**status**: `200 OK`

**error**:

```json
{ "error": "Invalid speciality of doctor requested." }
```

**status**: `400 Bad Request`

```json
{ "error": "Start time and end time are required." }
```

**status**: `400 Bad Request`

```json
{ "error": "Start time must be earlier than end time." }
```

**status**: `400 Bad Request`

```json
{ "error": "No doctors available for the selected time slot." }
```

**status**: `404 Not Found`
