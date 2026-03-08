const form = document.getElementById('registrationForm');
const userList = document.getElementById('userList');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const userIndexInput = document.getElementById('userIndex');
const submitBtn = document.getElementById('submitBtn');

// შენი MockAPI endpoint
const API_URL = 'https://6977a6b55b9c0aed1e870bac.mockapi.io/users';

// Load Users (Read)
async function loadUsers() {
    if (!userList) return;
    userList.innerHTML = '';
    const res = await fetch(API_URL);
    const users = await res.json();

    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name} - ${user.email} `;
        const editBtn = document.createElement('button');
        editBtn.textContent = 'განახლება';
        editBtn.onclick = () => editUser(user);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'წაშლა';
        deleteBtn.onclick = () => deleteUser(user.id);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        userList.appendChild(li);
    });
}
// Add / Update User
if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const id = userIndexInput.value;

        if (!name || !email) return;

        if (id === '') {
            // Create
            await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, email})
            });
        } else {
            // Update
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, email})
            });
            userIndexInput.value = '';
            submitBtn.value = 'რეგისტრაცია';
        }
        form.reset();
        loadUsers();
    });
}
// Edit  User
function editUser(user) {
    nameInput.value = user.name;
    emailInput.value = user.email;
    userIndexInput.value = user.id;
    submitBtn.value = 'განახლება';
}
// Delete User
async function deleteUser(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadUsers();
}
// Init
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});
//პროდუქციის გაფილტვრა
function filterProducts() {
    const nameFilter = document.getElementById('nameFilter');
    const priceFilter = document.getElementById('priceFilter');
    if (!nameFilter || !priceFilter) return;
    const search = nameFilter.value.toLowerCase();
    const price = priceFilter.value;
    document.querySelectorAll('.products .box').forEach(box => {
        const title = box.querySelector('h3').textContent.toLowerCase();
        const priceText = box.querySelector('.price').textContent.replace('$', '');
        const productPrice = parseFloat(priceText);

        let match = title.includes(search);

        if (price === 'low') match = match && productPrice < 15;
        if (price === 'high') match = match && productPrice >= 15;

        box.style.display = match ? 'block' : 'none';
    });
}
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();

    const nameFilter = document.getElementById('nameFilter');
    const priceFilter = document.getElementById('priceFilter');

    if (nameFilter) nameFilter.addEventListener('input', filterProducts);
    if (priceFilter) priceFilter.addEventListener('change', filterProducts);
});
