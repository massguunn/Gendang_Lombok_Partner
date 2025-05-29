const authController = require("../controllers/authController");

module.exports = [
  {
    method: "GET",
    path: "/",
    options: {
      auth: { mode: "try" },
      handler: authController.showLoginPage,
    },
  },
  {
    method: "GET",
    path: "/login",
    options: {
      auth: { mode: "try" },
      handler: authController.showLoginPage,
    },
  },
  {
    method: "POST",
    path: "/login",
    options: {
      auth: { mode: "try" },
      handler: authController.handleLogin,
    },
  },
  {
    method: "GET",
    path: "/register",
    options: {
      auth: { mode: "try" },
      handler: authController.showRegisterPage,
    },
  },
  {
    method: "POST",
    path: "/register",
    options: {
      auth: { mode: "try" },
      handler: authController.handleRegister,
    },
  },
  {
    method: "GET",
    path: "/logout",
    handler: (request, h) => {
      request.cookieAuth.clear();
      return h.redirect("/login");
    },
  },
];
