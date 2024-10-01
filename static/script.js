// Функционал мультиселекта
const hobbiesBtn = document.getElementById('hobbiesBtn');
const hobbiesDropdown = document.getElementById('hobbiesDropdown');
const hobbiesCheckboxes = hobbiesDropdown.querySelectorAll('input[type="checkbox"]');

hobbiesBtn.addEventListener('click', () => {
    hobbiesDropdown.style.display = hobbiesDropdown.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (event) => {
    if (!hobbiesBtn.contains(event.target) && !hobbiesDropdown.contains(event.target)) {
        hobbiesDropdown.style.display = 'none';
    }
});

function updateHobbiesButton() {
    const selectedHobbies = Array.from(hobbiesCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.nextElementSibling.textContent);

    hobbiesBtn.textContent = selectedHobbies.length > 0
        ? selectedHobbies.join(', ')
        : 'Выберите хобби';
}

hobbiesCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateHobbiesButton);
});

// Валидация и отправка формы
const form = document.getElementById('personalForm');
const modal = document.getElementById('modal');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (validateForm()) {
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            birthDate: document.getElementById('birthDate').value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            hobbies: Array.from(hobbiesCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.nextElementSibling.textContent),
            notes: document.getElementById('notes').value
        };

        // Показать состояние загрузки
        modal.innerHTML = '<div class="modal-content"><p>Отправка данных...</p></div>';
        modal.style.display = 'block';

        // Отправка данных на сервер FastAPI
        try {
            const response = await fetch('/send-data/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (result.ok) {
                modal.innerHTML = '<div class="modal-content"><p>Ваша анкета успешно отправлена</p></div>';
            } else {
                // Display the specific error message returned from the server
                const errorMessage = result.error || 'Ошибка при отправке анкеты. Пожалуйста, попробуйте еще раз.';
                modal.innerHTML = `<div class="modal-content"><p>${errorMessage}</p></div>`;
            }
        } catch (error) {
            console.error('Error:', error);
            modal.innerHTML = '<div class="modal-content"><p>Произошла ошибка. Пожалуйста, попробуйте позже.</p></div>';
        } finally {
            setTimeout(() => {
                modal.style.display = 'none';
                form.reset();
                updateHobbiesButton();
            }, 3000);
        }
    }
});

function validateForm() {
    let isValid = true;

    // Проверка имени
    const firstName = document.getElementById('firstName');
    const firstNameError = document.getElementById('firstNameError');
    if (!firstName.value.trim()) {
        firstNameError.textContent = 'Пожалуйста, введите имя';
        isValid = false;
    } else {
        firstNameError.textContent = '';
    }

    // Проверка фамилии
    const lastName = document.getElementById('lastName');
    const lastNameError = document.getElementById('lastNameError');
    if (!lastName.value.trim()) {
        lastNameError.textContent = 'Пожалуйста, введите фамилию';
        isValid = false;
    } else {
        lastNameError.textContent = '';
    }

    // Проверка даты рождения
    const birthDate = document.getElementById('birthDate');
    const birthDateError = document.getElementById('birthDateError');
    if (!birthDate.value) {
        birthDateError.textContent = 'Пожалуйста, выберите дату рождения';
        isValid = false;
    } else {
        birthDateError.textContent = '';
    }

    // Проверка пола
    const gender = document.querySelector('input[name="gender"]:checked');
    const genderError = document.getElementById('genderError');
    if (!gender) {
        genderError.textContent = 'Пожалуйста, выберите пол';
        isValid = false;
    } else {
        genderError.textContent = '';
    }

    // Проверка хобби
    const selectedHobbies = Array.from(hobbiesCheckboxes).filter(checkbox => checkbox.checked);
    const hobbiesError = document.getElementById('hobbiesError');
    if (selectedHobbies.length === 0) {
        hobbiesError.textContent = 'Пожалуйста, выберите хотя бы одно хобби';
        isValid = false;
    } else {
        hobbiesError.textContent = '';
    }

    return isValid;
}
