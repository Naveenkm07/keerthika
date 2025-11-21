const USERS_KEY = "nhceUsers";
const signinForm = document.getElementById("signinForm");
const errorMessage = document.getElementById("error-message");

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  }
}

const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (error) {
    console.warn("Unable to parse stored users", error);
    return [];
  }
};

const showLoginMessage = (message, isError = true) => {
  if (!errorMessage) return;
  errorMessage.textContent = message;
  errorMessage.style.color = isError ? "#d32f2f" : "#2e7d32";
};

signinForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  showLoginMessage("");

  const email = signinForm.elements.email.value.trim().toLowerCase();
  const password = signinForm.elements.password.value;
  const users = getStoredUsers();
  const user = users.find(
    (storedUser) =>
      storedUser.email === email && storedUser.password === password
  );

  if (!user) {
    showLoginMessage("Invalid email or password.");
    return;
  }

  localStorage.setItem(
    "nhceCurrentUser",
    JSON.stringify({ fullName: user.fullName, email: user.email })
  );
  showLoginMessage("Login successful! Redirecting…", false);
  setTimeout(() => {
    window.location.href = "/index";
  }, 1000);
});