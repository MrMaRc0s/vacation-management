const token = sessionStorage.getItem("token");
const role = sessionStorage.getItem("role");

if (!token || role !== 'manager') {
  alert("Access denied");
  location.href = "/";
}

function logout() {
  sessionStorage.clear();
  location.href = "/";
}

function changeStatus(requestId, status) {
  fetch('/requests/status', {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
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
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(() => alert("User updated"));
}

function deleteUser(userId) {
  if (!confirm("Delete user?")) return;
  fetch('/users/delete', {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
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
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  });

  if (res.status === 409) {
    alert("Username or email is already used.");
  } else if (res.ok) {
    alert("User created!");
    location.reload();
  } else {
    alert("Failed to create user.");
  }
};

// Load users
fetch('/users', {
  headers: { 'Authorization': 'Bearer ' + token }
})
  .then(res => res.json())
  .then(users => {
    const table = document.getElementById("userTable");
    users.forEach(u => {
      const row = document.createElement("tr");
      const isManager = u.role === "manager";
      row.innerHTML = `
        <td><input value="${u.username}" id="username-${u.id}" class="px-2 py-1 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" /></td>
        <td><input value="${u.email}" id="email-${u.id}" class="px-2 py-1 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" /></td>
        <td>${u.employee_code}</td>
        <td><input placeholder="New password" type="password" id="password-${u.id}" class="px-2 py-1 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" /></td>
        <td class="flex gap-2 justify-center">
          <button onclick="updateUser('${u.id}')"
            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow transition">
            Update
          </button>
          <button onclick="deleteUser('${u.id}')"
            class="px-3 py-1 rounded shadow transition text-white
              ${isManager 
                ? 'bg-gray-400 cursor-not-allowed opacity-60' 
                : 'bg-red-500 hover:bg-red-600'}"
            ${isManager ? 'disabled title="You cannot delete a manager."' : ''}>
            Delete
          </button>
        </td>
      `;
      table.appendChild(row);
    });
  });

// Load vacation requests
fetch('/requests/view', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ role: 'manager' })
})
  .then(res => res.json())
  .then(requests => {
    const table = document.getElementById("requestTable");
    requests.forEach(r => {
      const row = document.createElement("tr");
      let actions = '';
      if (r.status === 'pending') {
        actions = `
          <button onclick="changeStatus('${r.id}', 'approved')" 
            class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow mr-2 transition">
            Approve
          </button>
          <button onclick="changeStatus('${r.id}', 'rejected')" 
            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow transition">
            Reject
          </button>
        `;
      } else {
        actions = `
          <button onclick="changeStatus('${r.id}', 'pending')" 
            class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow transition">
            Cancel
          </button>
        `;
      }

      const submitDate = r.submit_date ? r.submit_date.slice(0, 10) : '';
      row.innerHTML = `
        <td>${r.username}</td>
        <td>${submitDate}</td>
        <td>${r.start_date}</td>
        <td>${r.end_date}</td>
        <td>${r.reason}</td>
        <td>
          <span class="${
            r.status === 'approved' ? 'text-green-600 font-semibold' :
            r.status === 'rejected' ? 'text-red-600 font-semibold' :
            'text-yellow-600 font-semibold'
          }">${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
        </td>
        <td class="flex gap-2 justify-center items-center">
          ${actions}
        </td>
      `;
      table.appendChild(row);
    });
  });
