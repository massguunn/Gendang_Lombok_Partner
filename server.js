const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Cookie = require("@hapi/cookie");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      files: {
        relativeTo: path.join(__dirname, "public"),
      },
    },
  });

  await server.register([Inert, Cookie]);

  // Route publik dulu (tanpa autentikasi)
  server.route([
    {
      method: "GET",
      path: "/assets/{param*}",
      options: { auth: false },
      handler: {
        directory: {
          path: ".",
          listing: false,
          index: false,
        },
      },
    },
    {
      method: "GET",
      path: "/uploads/{param*}",
      options: { auth: false },
      handler: {
        directory: {
          path: "uploads",
          listing: false,
          index: false,
        },
      },
    },
    {
      method: "GET",
      path: "/gis",
      options: { auth: false },
      handler: (request, h) => {
        return h.file("gis.html");
      },
    },
    // {
    //   method: "GET",
    //   path: "/",
    //   options: { auth: false },
    //   handler: (request, h) => {
    //     return h.file(path.join(__dirname, "views", "login.html"));
    //   },
    // },
  ]);

  // Setup autentikasi COOKIE
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: "sid-example",
      password: "aVeryLongSuperSecretPassword1234567",
      isSecure: false,
    },
    redirectTo: "/login",
    validate: async (request, session) => {
      if (session.email) {
        return { isValid: true, credentials: { email: session.email } };
      }
      return { isValid: false };
    },
  });

  // Set default autentikasi hanya setelah semua route publik dibuat
  server.auth.default("session");

  // Tambahkan route lain yang butuh autentikasi
  server.route([...authRoutes, ...dashboardRoutes]);

  await server.start();
  console.log("✅ Server running at:", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

init();
