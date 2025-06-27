const user = JSON.parse(sessionStorage.getItem("user"));
if (!user || user.role !== 'employee') {
  alert("Access denied");
  location.href = "/";
}

document.getElementById('requestForm').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;

  const start = new Date(form.start_date.value);
  const end = new Date(form.end_date.value);
  if (end <= start) {
    alert("❌ End date must be after start date.");
    return;
  }

  const data = {
    user_id: user.userId,
    start_date: form.start_date.value,
    end_date: form.end_date.value,
    reason: form.reason.value
  };

  const res = await fetch('/requests', {
    method: 'POST',
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("✅ Request submitted!");
    location.reload();
  } else {
    alert("❌ Failed to submit request.");
  }
};

function deleteRequest(requestId) {
  if (!confirm("Are you sure you want to delete this request?")) return;
  fetch('/requests/delete', {
    method: 'DELETE',
    body: JSON.stringify({ request_id: requestId })
  }).then(() => location.reload());
}

// Load requests
fetch('/requests/view', {
  method: 'POST',
  body: JSON.stringify({ user_id: user.userId, role: "employee" })
})
  .then(res => res.json())
  .then(requests => {
    const table = document.getElementById("requestTable");
    requests.forEach(r => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${r.start_date}</td>
        <td>${r.end_date}</td>
        <td>${r.reason}</td>
        <td>${r.status}</td>
        <td>
          ${r.status === 'pending'
            ? `<button onclick="deleteRequest('${r.id}')">Delete</button>`
            : '<span style="color:#aaa;">—</span>'}
        </td>
      `;
      table.appendChild(row);
    });
  });
