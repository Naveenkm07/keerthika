const signinForm = document.getElementById("signinForm");
const errorMessage = document.getElementById("error-message");

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");

  if (!passwordInput || !eyeIcon) {
    return;
  }

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

signinForm?.addEventListener("submit", () => {
  if (errorMessage) {
    errorMessage.textContent = "";
  }
});