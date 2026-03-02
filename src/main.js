import './style.css'

document.addEventListener("DOMContentLoaded", () => {

  const toggleBtn = document.getElementById("toggle-btn")
  const formTitle = document.getElementById("form-title")
  const toggleText = document.getElementById("toggle-text")
  const usernameField = document.getElementById("username-field")
  const authForm = document.getElementById("auth-form")

  const usernameInput = document.getElementById("username")
  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")

  const errorDiv = document.getElementById("error-message")
  const successDiv = document.getElementById("success-message")
  const themeToggle = document.getElementById("theme-toggle")

  let isLogin = true

  // ======================
  // DARK MODE
  // ======================

  const savedTheme = localStorage.getItem("theme")

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark")
    themeToggle.textContent = "☀️"
  } else {
    themeToggle.textContent = "🌙"
  }

  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark")

    const isDark = document.documentElement.classList.contains("dark")

    localStorage.setItem("theme", isDark ? "dark" : "light")

    themeToggle.textContent = isDark ? "☀️" : "🌙"
  })

  // ======================
  // TOGGLE LOGIN/REGISTER
  // ======================

  toggleBtn.addEventListener("click", () => {
    isLogin = !isLogin

    errorDiv.classList.add("hidden")
    successDiv.classList.add("hidden")
    authForm.reset()

    if (isLogin) {
      formTitle.textContent = "Login"
      toggleText.textContent = "Não tem conta?"
      toggleBtn.textContent = "Registrar"
      usernameField.classList.add("hidden")
    } else {
      formTitle.textContent = "Registrar"
      toggleText.textContent = "Já tem conta?"
      toggleBtn.textContent = "Login"
      usernameField.classList.remove("hidden")
    }
  })

  // ======================
  // SUBMIT
  // ======================

  authForm.addEventListener("submit", (e) => {
    e.preventDefault()

    resetStyles()

    const username = usernameInput?.value.trim()
    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()

    if (!email || !password || (!isLogin && !username)) {
      showError("Preencha todos os campos.")
      highlightEmptyFields()
      return
    }

    if (!validateEmail(email)) {
      showError("Digite um email válido.")
      emailInput.classList.add("ring-2", "ring-red-500")
      return
    }

    if (password.length < 6) {
      showError("A senha deve ter pelo menos 6 caracteres.")
      passwordInput.classList.add("ring-2", "ring-red-500")
      return
    }

    const users = JSON.parse(localStorage.getItem("users")) || []

    if (isLogin) {
      const user = users.find(user => user.email === email && user.password === password)

      if (!user) {
        showError("Credenciais inválidas.")
        return
      }

      showSuccess("Login realizado com sucesso!")
    } else {
      const userExists = users.some(user => user.email === email)

      if (userExists) {
        showError("Este email já está cadastrado.")
        return
      }

      users.push({ username, email, password })
      localStorage.setItem("users", JSON.stringify(users))

      showSuccess("Conta criada com sucesso!")
    }

    authForm.reset()
  })

  // ======================
  // FUNÇÕES
  // ======================

  function showError(message) {
    errorDiv.textContent = message
    errorDiv.classList.remove("hidden")
  }

  function showSuccess(message) {
    successDiv.textContent = message
    successDiv.classList.remove("hidden")
  }

  function resetStyles() {
    errorDiv.classList.add("hidden")
    successDiv.classList.add("hidden")

    emailInput.classList.remove("ring-2", "ring-red-500")
    passwordInput.classList.remove("ring-2", "ring-red-500")
    usernameInput?.classList.remove("ring-2", "ring-red-500")
  }

  function highlightEmptyFields() {
    if (!emailInput.value.trim()) {
      emailInput.classList.add("ring-2", "ring-red-500")
    }

    if (!passwordInput.value.trim()) {
      passwordInput.classList.add("ring-2", "ring-red-500")
    }

    if (!isLogin && !usernameInput?.value.trim()) {
      usernameInput.classList.add("ring-2", "ring-red-500")
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  emailInput.addEventListener("input", () => {
    emailInput.classList.remove("ring-2", "ring-red-500")
    errorDiv.classList.add("hidden")
  })
  
  passwordInput.addEventListener("input", () => {
    passwordInput.classList.remove("ring-2", "ring-red-500")
    errorDiv.classList.add("hidden")
  })
  
  if (usernameInput) {
    usernameInput.addEventListener("input", () => {
      usernameInput.classList.remove("ring-2", "ring-red-500")
      errorDiv.classList.add("hidden")
    })
  }
})

