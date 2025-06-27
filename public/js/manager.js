const user = JSON.parse(sessionStorage.getItem("user"));
if (!user || user.role !== 'manager') {
  alert("Access denied");
  location.href = "/";
}

function logout() {
  sessionStorage.removeItem("user");
  location.href = "/";
}

function changeStatus(requestId, status) {
  fetch('/requests/status', {
    method: 'PUT',
    body: JSON.stringify({ request_id: requestId, status })
  }).then(() => location.reload());
}

function updateUser(userId) {
  const username = document.getElementById(`username-${userId}`).value;
  const email = document.getElementById(`email-${userId}`).value;
  const password = document.getElementById(`password-${userId}`).value;

  const body = { id: userId, username, email };
  if (password.trim()) body.password = password;

  fetch('/users/update', {
    method: 'PUT',
    body: JSON.stringify(body)
  }).then(() => alert("User updated"));
}

function deleteUser(userId) {
  if (!confirm("Delete user?")) return;
  fetch('/users/delete', {
    method: 'DELETE',
    body: JSON.stringify({ id: userId })
  }).then(() => location.reload());
}

document.getElementById('createUserForm').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;

  const newUser = {
    username: form.username.value,
    email: form.email.value,
    password: form.password.value,
    role: form.role.value,
    employee_code: form.employee_code.value
  };

  const res = await fetch('/users', {
    method: 'POST',
    body: JSON.stringify(newUser)
  });

  if (res.ok) {
    alert("User created!");
    location.reload();
  } else {
    alert("Failed to create user.");
  }
};

// Load users
fetch('/users')
  .then(res => res.json())
  .then(users => {
    const table = document.getElementById("userTable");
    users.forEach(u => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input value="${u.username}" id="username-${u.id}" /></td>
        <td><input value="${u.email}" id="email-${u.id}" /></td>
        <td>${u.employee_code}</td>
        <td><input placeholder="New password" type="password" id="password-${u.id}" /></td>
        <td>
          <button onclick="updateUser('${u.id}')">Update</button>
          <button onclick="deleteUser('${u.id}')">Delete</button>
        </td>
      `;
      table.appendChild(row);
    });
  });

// Load requests
fetch('/requests/view', {
  method: 'POST',
  body: JSON.stringify({ role: "manager" })
})
  .then(res => res.json())
  .then(requests => {
    const table = document.getElementById("requestTable");
    requests.forEach(r => {
      const row = document.createElement("tr");
      let actions = '';
      if (r.status === 'pending') {
        actions = `
          <button onclick="changeStatus('${r.id}', 'approved')">Approve</button>
          <button onclick="changeStatus('${r.id}', 'rejected')">Reject</button>
        `;
      } else {
        actions = `<button onclick="changeStatus('${r.id}', 'pending')">Cancel</button>`;
      }

      row.innerHTML = `
        <td>${r.user_id}</td>
        <td>${r.start_date}</td>
        <td>${r.end_date}</td>
        <td>${r.reason}</td>
        <td>${r.status}</td>
        <td>${actions}</td>
      `;
      table.appendChild(row);
    });
  });
