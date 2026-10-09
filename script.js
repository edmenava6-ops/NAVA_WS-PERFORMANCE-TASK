
const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const togglePassword = document.getElementById("togglePassword");

const fields = [
    "studentId",
    "fullName",
    "email",
    "phone",
    "dob",
    "gender",
    "program",
    "yearLevel",
    "password",
    "confirmPassword",
    "address"
];

function getField(id) {
    return document.getElementById(id);
}

function showError(field, message) {
    field.classList.add("error");
    field.setAttribute("aria-invalid", "true");

    const error = field.parentElement.querySelector(".error-message");
    error.textContent = message;
}

function clearError(field) {
    field.classList.remove("error");
    field.removeAttribute("aria-invalid");

    const error = field.parentElement.querySelector(".error-message");
    error.textContent = "";
}

function validateField(field) {
    const id = field.id;
    const value = field.value.trim();

    field.value = value;
    clearError(field);

    if (value === "") {
        showError(field, field.dataset.label + " is required.");
        return false;
    }

    if (id === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {
            showError(field, "Please enter a valid email address.");
            return false;
        }
    }

    if (id === "phone") {
        // Philippine mobile number: 09 followed by 9 digits
        const phonePattern = /^09\d{9}$/;

        if (!phonePattern.test(value)) {
            showError(field, "Use the format 09XXXXXXXXX (11 digits).");
            return false;
        }
    }

    if (id === "dob") {
        const selectedDate = new Date(value + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            showError(field, "Date of birth cannot be in the future.");
            return false;
        }
    }

    if (id === "password" && value.length < 8) {
        showError(field, "Password must be at least 8 characters.");
        return false;
    }

    if (id === "confirmPassword" &&
        value !== getField("password").value.trim()) {
        showError(field, "Passwords do not match.");
        return false;
    }

    return true;
}

// Validate fields while the user types or changes a selection.
fields.forEach(function(id) {
    const field = getField(id);

    field.addEventListener("input", function() {
        if (field.classList.contains("error")) {
            validateField(field);
        }

        // Recheck confirmation when the password changes.
        if (id === "password" &&
            getField("confirmPassword").value !== "") {
            validateField(getField("confirmPassword"));
        }
    });

    field.addEventListener("change", function() {
        if (field.classList.contains("error")) {
            validateField(field);
        }
    });
});

// Validate the agreement checkbox.
const agreement = getField("agreement");
const agreementError = getField("agreementError");

agreement.addEventListener("change", function() {
    agreement.classList.toggle("error", !agreement.checked);
    agreementError.textContent = agreement.checked
        ? ""
        : "You must agree before registering.";
});

// Show or hide both password fields.
togglePassword.addEventListener("click", function() {
    const password = getField("password");
    const confirmPassword = getField("confirmPassword");

    const shouldShow = password.type === "password";

    password.type = shouldShow ? "text" : "password";
    confirmPassword.type = shouldShow ? "text" : "password";

    // Required classList.toggle() interaction.
    togglePassword.classList.toggle("password-visible", shouldShow);

    // Meaningfully update the button's accessible description.
    togglePassword.setAttribute(
        "aria-pressed",
        String(shouldShow)
    );

    togglePassword.textContent = shouldShow
        ? "Hide Password"
        : "Show Password";
});

// Handle form submission.
form.addEventListener("submit", function(event) {
    event.preventDefault();

    successMessage.textContent = "";

    let isValid = true;

    fields.forEach(function(id) {
        const field = getField(id);

        if (!validateField(field)) {
            isValid = false;
        }
    });

    if (!agreement.checked) {
        agreement.classList.add("error");
        agreementError.textContent =
            "You must agree before registering.";
        isValid = false;
    }

    if (isValid) {
        // All validations passed.
        successMessage.textContent =
            "Registration successful! Welcome, " +
            getField("fullName").value + "!";

        // Return all validation styling to its normal state.
        fields.forEach(function(id) {
            clearError(getField(id));
        });

        agreement.classList.remove("error");
        agreementError.textContent = "";
    } else {
        // Move the user to the first field that needs correction.
        const firstError = form.querySelector(".error");
        if (firstError) {
            firstError.focus();
        }
    }
});

// Reset all values, errors, and interactive states.
form.addEventListener("reset", function() {
    setTimeout(function() {
        fields.forEach(function(id) {
            clearError(getField(id));
        });

        agreement.classList.remove("error");
        agreementError.textContent = "";
        successMessage.textContent = "";

        getField("password").type = "password";
        getField("confirmPassword").type = "password";

        togglePassword.classList.remove("password-visible");
        togglePassword.setAttribute("aria-pressed", "false");
        togglePassword.textContent = "Show/Hide Password";
    }, 0);
});