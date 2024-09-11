const loginForm = document.querySelector('.loginform');

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            alert('Erreur : email ou mot de passe incorrect');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
});

function updateLoginStatus() {
    const token = localStorage.getItem('token');
    const banner = document.getElementById('banner');
    const loginButton = document.querySelector('.btnlogin');
    const logoutButton = document.querySelector('.btnlogout');

    if (token) {
        banner.classList.add('connected');
        loginButton.classList.add('connected');
        logoutButton.classList.add('connected');
    } else {
        banner.classList.remove('connected');
        loginButton.classList.remove('connected');
        logoutButton.classList.remove('connected');
    }
}
updateLoginStatus()
