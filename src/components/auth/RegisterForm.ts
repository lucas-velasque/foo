// src/components/auth/RegisterForm.ts
import { createElement } from '../../utils/dom';

interface RegisterFormProps {
    onSubmit: (userData: any, userType: 'user' | 'provider') => void;
    onLoginClick: () => void;
}

export function createRegisterForm({ onSubmit, onLoginClick }: RegisterFormProps) {
    const form = createElement('form', { class: 'auth-form' });
    form.innerHTML = `
        <h2>Register</h2>
        <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
            <label for="cpf">CPF:</label>
            <input type="text" id="cpf" name="cpf" required>
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div class="form-group">
            <label for="userType">Register as:</label>
            <select id="userType" name="userType">
                <option value="user">User (Guest)</option>
                <option value="provider">Provider (Hotel/Community House)</option>
            </select>
        </div>
        <button type="submit">Register</button>
        <p style="text-align: center; margin-top: 20px;">
            Already have an account? <a href="#" id="loginLink">Login here</a>
        </p>
        <div id="registerError" class="error-message"></div>
    `;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const nameInput = form.querySelector<HTMLInputElement>('#name');
        const cpfInput = form.querySelector<HTMLInputElement>('#cpf');
        const emailInput = form.querySelector<HTMLInputElement>('#email');
        const passwordInput = form.querySelector<HTMLInputElement>('#password');
        const userTypeSelect = form.querySelector<HTMLSelectElement>('#userType');

        if (nameInput && cpfInput && emailInput && passwordInput && userTypeSelect) {
            const userData = {
                name: nameInput.value,
                cpf: cpfInput.value,
                email: emailInput.value,
                password: passwordInput.value,
            };
            onSubmit(userData, userTypeSelect.value as 'user' | 'provider');
        }
    });

    const loginLink = form.querySelector<HTMLAnchorElement>('#loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            onLoginClick();
        });
    }

    return form;
}