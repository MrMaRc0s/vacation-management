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
    console.log(data);
    sessionStorage.setItem("user", JSON.stringify(data));
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("role", data.role);
    sessionStorage.setItem("user_id", data.id);
    location.href = data.role === 'manager' ? '/manager' : '/employee';

};
