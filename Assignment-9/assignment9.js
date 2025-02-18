let appointmentList = JSON.parse(localStorage.getItem('appointments')) || [];

document.addEventListener('DOMContentLoaded', function () {
    displayAppointments();
});

function openForm(service) {
    document.getElementById('appointmentForm').style.display = 'block';
    document.getElementById('service').value = service;
}

function closeForm() {
    document.getElementById('appointmentForm').style.display = 'none';
}

document.getElementById('appointmentFormFields').addEventListener('submit', function (e) {
    e.preventDefault();
    
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let service = document.getElementById('service').value;
    let datetime = document.getElementById('datetime').value;
    let requests = document.getElementById('requests').value;
    let terms = document.getElementById('terms').checked;

    if (!name || !email || !phone || !datetime || !terms) {
        alert("Please fill all required fields.");
        return;
    }

    let appointment = {
        name,
        email,
        phone,
        service,
        datetime,
        requests,
        status: 'Pending'
    };

    appointmentList.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointmentList));
    
    closeForm();
    displayAppointments();
    showConfirmation(name, service, datetime);
});

function displayAppointments() {
    let appointmentsTable = document.querySelector('#appointmentsTable tbody');
    appointmentsTable.innerHTML = '';
    
    appointmentList.forEach(function (appointment, index) {
        let row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${appointment.name}</td>
            <td>${appointment.service}</td>
            <td>${appointment.datetime}</td>
            <td>${appointment.status}</td>
            <td>
                <button class="action-btn" onclick="rescheduleAppointment(${index})">Reschedule</button>
                <button class="cancel-btn" onclick="cancelAppointment(${index})">Cancel</button>
                <button class="update-btn" onclick="updateStatus(${index})">Update Status</button>
            </td>
        `;
        
        appointmentsTable.appendChild(row);
    });
}

function showConfirmation(name, service, datetime) {
    let confirmationMessage = `Thank you, ${name}! Your appointment for ${service} on ${datetime} is confirmed.`;
    document.getElementById('confirmationMessage').innerText = confirmationMessage;
    document.getElementById('confirmationPopup').style.display = 'block';
}

function closeConfirmation() {
    document.getElementById('confirmationPopup').style.display = 'none';
}

function rescheduleAppointment(index) {
    let appointment = appointmentList[index];
    let newDate = prompt("Enter the new date and time (format: YYYY-MM-DDTHH:MM):", appointment.datetime);
    if (newDate) {
        appointmentList[index].datetime = newDate;
        localStorage.setItem('appointments', JSON.stringify(appointmentList));
        displayAppointments();
    }
}

function cancelAppointment(index) {
    if (confirm("Are you sure you want to cancel this appointment?")) {
        appointmentList[index].status = "Cancelled";
        localStorage.setItem('appointments', JSON.stringify(appointmentList));
        displayAppointments();
    }
}

function updateStatus(index) {
    let newStatus = prompt("Enter new status (Confirmed/Cancelled):", appointmentList[index].status);
    if (newStatus && (newStatus === "Confirmed" || newStatus === "Cancelled")) {
        appointmentList[index].status = newStatus;
        localStorage.setItem('appointments', JSON.stringify(appointmentList));
        displayAppointments();
    } else {
        alert("Invalid status. Please enter 'Confirmed' or 'Cancelled'.");
    }
}

function searchAppointments() {
    let searchQuery = document.getElementById('searchInput').value.toLowerCase();
    let filteredAppointments = appointmentList.filter(appointment => 
        appointment.name.toLowerCase().includes(searchQuery)
    );
    displayFilteredAppointments(filteredAppointments);
}

function filterAppointments() {
    let statusFilter = document.getElementById('statusFilter').value;
    let filteredAppointments = appointmentList.filter(appointment => 
        !statusFilter || appointment.status === statusFilter
    );
    displayFilteredAppointments(filteredAppointments);
}

function displayFilteredAppointments(filteredAppointments) {
    let appointmentsTable = document.querySelector('#appointmentsTable tbody');
    appointmentsTable.innerHTML = '';

    filteredAppointments.forEach(function (appointment, index) {
        let row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${appointment.name}</td>
            <td>${appointment.service}</td>
            <td>${appointment.datetime}</td>
            <td>${appointment.status}</td>
            <td>
                <button class="action-btn" onclick="rescheduleAppointment(${index})">Reschedule</button>
                <button class="cancel-btn" onclick="cancelAppointment(${index})">Cancel</button>
                <button class="update-btn" onclick="updateStatus(${index})">Update Status</button>
            </td>
        `;
        
        appointmentsTable.appendChild(row);
    });
}
