document.getElementById('loginForm').onsubmit = async (e) => {
  e.preventDefault();
  const res = await fetch('/login', {
    method: 'POST',
    body: JSON.stringify({
      username: e.target.username.value,
      password: e.target.password.value
    })
  });

  if (!res.ok) return alert("Login failed");
  const data = await res.json();
  sessionStorage.setItem("user", JSON.stringify(data));
  location.href = data.role === 'manager' ? '/manager' : '/employee';
};
