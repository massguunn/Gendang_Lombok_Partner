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
        relativeTo: path.join(__dirname, "public"), // default folder public untuk assets
      },
    },
  });

  await server.register([Inert, Cookie]);

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

  // Route static dari folder public
  server.route([
    {
      method: "GET",
      path: "/assets/{param*}",
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
      handler: {
        directory: {
          path: "uploads",
          listing: false,
          index: false,
        },
      },
    },
  ]);

  // Tambahkan route untuk serve file HTML dari folder views
  server.route({
    method: "GET",
    path: "/gis",
    handler: (request, h) => {
      return h.file("gis.html"); // nama file di folder yang diatur di relativeTo
    },
  });

  server.auth.default("session");
  server.route([...authRoutes, ...dashboardRoutes]);

  await server.start();
  console.log("✅ Server running at:", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

init();
