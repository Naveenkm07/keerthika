const signupForm = document.getElementById("signupForm");

if (signupForm) {
  const fullNameInput = document.getElementById("full_name");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm_password");
  const nameError = document.getElementById("name-error");
  const usernameError = document.getElementById("username-error");
  const emailError = document.getElementById("email-error");
  const statusMessage = document.getElementById("signup-message");

  const passwordToggle = document.getElementById("togglePassword");
  const confirmPasswordToggle = document.getElementById("toggleConfirmPassword");

  const showMessage = (message, isError = true) => {
    if (!statusMessage) return;
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "#d32f2f" : "#2e7d32";
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return emailPattern.test(email.toLowerCase());
  };

  const hasNumber = (value) => /\d/.test(value);

  passwordToggle?.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      passwordToggle.innerHTML = '<i class="fa-solid fa-eye"></i>';
    } else {
      passwordInput.type = "password";
      passwordToggle.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    }
  });

  confirmPasswordToggle?.addEventListener("click", () => {
    if (confirmPasswordInput.type === "password") {
      confirmPasswordInput.type = "text";
      confirmPasswordToggle.innerHTML = '<i class="fa-solid fa-eye"></i>';
    } else {
      confirmPasswordInput.type = "password";
      confirmPasswordToggle.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    }
  });

  fullNameInput.addEventListener("input", () => {
    nameError.textContent = hasNumber(fullNameInput.value)
      ? "Numbers are not allowed!"
      : "";
  });

  usernameInput.addEventListener("input", () => {
    if (usernameInput.value.includes(" ")) {
      usernameError.textContent = "Username cannot contain spaces.";
      usernameInput.setCustomValidity("Username cannot contain spaces.");
    } else {
      usernameError.textContent = "";
      usernameInput.setCustomValidity("");
    }
  });

  phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 11);
  });

  emailInput.addEventListener("input", () => {
    const email = emailInput.value.toLowerCase();
    emailError.textContent = isValidEmail(email)
      ? ""
      : "Invalid email address (e.g., abc@gmail.com).";
  });

  signupForm.addEventListener("submit", (event) => {
    showMessage("");

    const fullName = fullNameInput.value.trim();
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (hasNumber(fullName)) {
      nameError.textContent = "Numbers are not allowed!";
      showMessage("Please remove numbers from your name.");
      return;
    }

    if (!isValidEmail(email)) {
      emailError.textContent = "Invalid email address (e.g., abc@gmail.com)!";
      showMessage("Please provide a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Password and Confirm Password must match.");
      event.preventDefault();
      return;
    }

    if (password.length < 8) {
      showMessage("Password must be at least 8 characters long.");
      event.preventDefault();
      return;
    }
  });
}

