const fs = require("fs");
const path = require("path");
const Cookie = require("@hapi/cookie");
const db = require("../models/db");

// halaman dasboard
exports.showDashboard = (request, h) => {
  const filePath = path.join(__dirname, "../views/dashboard.html");
  return fs.readFileSync(filePath, "utf8");
};

// Tampilkan halaman login
exports.showLoginPage = (request, h) => {
  const filePath = path.join(__dirname, "../views/login.html");
  return fs.readFileSync(filePath, "utf8");
};

// Tampilkan halaman register
exports.showRegisterPage = (request, h) => {
  const filePath = path.join(__dirname, "../views/register.html");
  return fs.readFileSync(filePath, "utf8");
};

// Proses login
exports.handleLogin = (request, h) => {
  const { email, password } = request.payload;

  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM admin WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, results) => {
      if (err) {
        console.error("LOGIN ERROR:", err); // Tambahkan ini
        return resolve(h.response("Terjadi kesalahan saat login.").code(500));
      }

      if (results.length > 0) {
        request.cookieAuth.set({ email });
        return resolve(h.redirect("/dashboard"));
      } else {
        return resolve(h.response("Email atau password salah.").code(401));
      }
    });
  });
};

// Proses register
exports.handleRegister = (request, h) => {
  const { name, email, password, phone } = request.payload;

  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO admin (name, email, password, phone) VALUES (?, ?, ?, ?)";
    db.query(query, [name, email, password, phone], (err, results) => {
      if (err) {
        console.error(err);
        return resolve(
          h
            .response("Gagal mendaftar. Email mungkin sudah digunakan.")
            .code(500)
        );
      }

      return resolve(
        h
          .response(
            `
          <script>
            alert('Registrasi berhasil! Silakan login.');
            window.location.href = '/login';
          </script>
        `
          )
          .type("text/html")
          .code(200)
      );
    });
  });
};
