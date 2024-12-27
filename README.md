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
        "fullName": "patient's full name",
        "userName": "patient's username,
        "gender": "patient's gender",
        "dob": "patient's dob"
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

### 3. Book an appointment

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
    "appointment_id": "id of appointment",
    "patient": "patient's username",
    "doctor": "doctor's username",
    "slot": "id of the slot booked",
    "status": "scheduled",
    "created_at": "timestamp when appointment is booked"
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

### 4. Reschedule an appointment

**Endpoint**: `PUT /appointments/${appointment_id}`
**Description**: Reschedules an existing appointment.

#### Parameters:

- `appointment_id`: ID of an appointment to reschedule.

#### Response:

**success**:

```json
{
  "message": "Appointment rescheduled succesfully.",
  "data": {
    "appointment_id": "id of appointment",
    "patient": "patient's username",
    "doctor": "doctor's username",
    "slot": "id of the slot booked",
    "status": "rescheduled",
    "created_at": "timestamp when appointment is booked",
    "updated_at": "timestamp when appointment is rescheduled"
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

**status**: `400 Bad Request`

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

### 5. Cancel an appointment

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

**status**: `400 Bad Request`
