const dashboardController = require("../controllers/dashboardController");

module.exports = [
  {
    method: "GET",
    path: "/dashboard",
    options: {
      auth: "session",
      handler: dashboardController.showDashboard,
    },
  },
  {
    method: "GET",
    path: "/api/gendang",
    options: {
      auth: "session",
      handler: dashboardController.getAllGendang,
    },
  },
  {
    method: "GET",
    path: "/api/gendang/{id}",
    options: {
      auth: "session",
      handler: dashboardController.getGendangById,
    },
  },
  {
    method: "POST",
    path: "/api/gendang",
    options: {
      auth: "session",
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        maxBytes: 10485760, // 10MB limit
      },
      handler: dashboardController.createGendang,
    },
  },
  {
    method: "PUT",
    path: "/api/gendang/{id}",
    options: {
      auth: "session",
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
        maxBytes: 10485760,
      },
      handler: dashboardController.updateGendang,
    },
  },
  {
    method: "DELETE",
    path: "/api/gendang/{id}",
    options: {
      auth: "session",
      handler: dashboardController.deleteGendang,
    },
  },
];
