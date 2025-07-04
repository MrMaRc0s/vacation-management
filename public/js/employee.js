const token = sessionStorage.getItem("token");
const role = sessionStorage.getItem("role");

// Block access if not logged in or wrong role
if (!token || role !== 'employee') {
  alert("Access denied");
  location.href = "/";
}

// Logout function
function logout() {
  sessionStorage.clear();
  location.href = "/";
}

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

document.getElementById('requestForm').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;

  const start = new Date(form.start_date.value);
  const end = new Date(form.end_date.value);
  if (end <= start) {
    alert("End date must be after start date.");
    return;
  }

  const payload = parseJwt(token);
  const data = {
    user_id: payload ? payload.userId : null,
    start_date: form.start_date.value,
    end_date: form.end_date.value,
    reason: form.reason.value
  };

  const res = await fetch('/requests', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Request submitted!");
    location.reload();
  } else {
    alert("Failed to submit request.");
  }
};

function deleteRequest(requestId) {
  if (!confirm("Delete this request?")) return;

  fetch('/requests/delete', {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ request_id: requestId })
  }).then(() => location.reload());
}

// Load requests
const payload = parseJwt(token);

fetch('/requests/view', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ user_id: payload.userId, role: 'employee' })
})
  .then(res => res.json())
  .then(requests => {
    const table = document.getElementById("requestTable");
    requests.forEach(r => {
      const row = document.createElement("tr");
      // Format submit_date to YYYY-MM-DD
      const submitDate = r.submit_date ? r.submit_date.slice(0, 10) : '';
      row.innerHTML = `
        <td>${submitDate}</td>
        <td>${r.start_date}</td>
        <td>${r.end_date}</td>
        <td>${r.reason}</td>
        <td>${r.status}</td>
        <td>
          ${r.status === 'pending'
            ? `<button onclick="deleteRequest('${r.id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow transition">Delete</button>`
            : `<button disabled class="bg-gray-300 text-gray-500 px-3 py-1 rounded cursor-not-allowed">No Action</button>`}
        </td>
      `;
      table.appendChild(row);
    });
  });

// Set min date for start_date and end_date inputs to today
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  const startInput = document.querySelector('input[name="start_date"]');
  const endInput = document.querySelector('input[name="end_date"]');
  if (startInput) startInput.setAttribute('min', today);
  if (endInput) endInput.setAttribute('min', today);
});
