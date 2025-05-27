const fs = require("fs");
const path = require("path");
const db = require("../models/db");

// Helper untuk upload gambar
const uploadImage = (file, filename) => {
  return new Promise((resolve, reject) => {
    const uploadPath = path.join(__dirname, "../public/uploads/", filename);
    const fileStream = fs.createWriteStream(uploadPath);

    file.on("error", (err) => reject(err));
    file.pipe(fileStream);

    file.on("end", () => resolve(filename));
  });
};

// Tampilkan halaman dashboard
exports.showDashboard = (request, h) => {
  const filePath = path.join(__dirname, "../views/dashboard.html");
  return fs.readFileSync(filePath, "utf8");
};

// Ambil semua data gendang beleq
exports.getAllGendang = (request, h) => {
  return new Promise((resolve) => {
    db.query("SELECT * FROM data_gendang_beleq", (err, results) => {
      if (err) {
        console.error(err);
        return resolve(h.response("Gagal mengambil data").code(500));
      }
      return resolve(h.response(results).code(200));
    });
  });
};

// Ambil data berdasarkan id
exports.getGendangById = (request, h) => {
  const id = request.params.id;

  return new Promise((resolve) => {
    db.query(
      "SELECT * FROM data_gendang_beleq WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error(err);
          return resolve(h.response("Gagal mengambil data").code(500));
        }
        if (results.length === 0) {
          return resolve(h.response("Data tidak ditemukan").code(404));
        }
        return resolve(h.response(results[0]).code(200));
      }
    );
  });
};

// Buat data baru (create)
exports.createGendang = async (request, h) => {
  const {
    nama_gendang_beleq,
    alamat,
    deskripsi,
    nomor_hp,
    harga_sewa,
    latitude,
    longitude,
  } = request.payload;
  const file = request.payload.gambar;

  let filename = null;
  if (file && file.hapi && file._data) {
    // buat nama unik, misal timestamp + original filename
    filename = Date.now() + "_" + file.hapi.filename;
    try {
      await uploadImage(file, filename);
    } catch (error) {
      console.error("Upload image error:", error);
      return h.response("Gagal upload gambar").code(500);
    }
  }

  return new Promise((resolve) => {
    const query = `INSERT INTO data_gendang_beleq 
      (nama_gendang_beleq, alamat, deskripsi, nomor_hp, harga_sewa, gambar, latitude, longitude) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(
      query,
      [
        nama_gendang_beleq,
        alamat,
        deskripsi,
        nomor_hp,
        harga_sewa,
        filename,
        latitude,
        longitude,
      ],
      (err, results) => {
        if (err) {
          console.error(err);
          return resolve(h.response("Gagal menyimpan data").code(500));
        }
        return resolve(h.response("Data berhasil dibuat").code(201));
      }
    );
  });
};

// Update data berdasarkan id
exports.updateGendang = async (request, h) => {
  const id = request.params.id;
  const {
    nama_gendang_beleq,
    alamat,
    deskripsi,
    nomor_hp,
    harga_sewa,
    latitude,
    longitude,
  } = request.payload;
  const file = request.payload.gambar;

  let filename = null;

  if (file && file.hapi && file._data) {
    filename = Date.now() + "_" + file.hapi.filename;
    try {
      await uploadImage(file, filename);
    } catch (error) {
      console.error("Upload image error:", error);
      return h.response("Gagal upload gambar").code(500);
    }
  }

  // Jika ada gambar baru, update juga nama gambar, kalau tidak hanya update data lainnya
  let query, params;
  if (filename) {
    query = `UPDATE data_gendang_beleq SET 
      nama_gendang_beleq = ?, alamat = ?, deskripsi = ?, nomor_hp = ?, harga_sewa = ?, gambar = ?, latitude = ?, longitude = ? WHERE id = ?`;
    params = [
      nama_gendang_beleq,
      alamat,
      deskripsi,
      nomor_hp,
      harga_sewa,
      filename,
      latitude,
      longitude,
      id,
    ];
  } else {
    query = `UPDATE data_gendang_beleq SET 
      nama_gendang_beleq = ?, alamat = ?, deskripsi = ?, nomor_hp = ?, harga_sewa = ?, latitude = ?, longitude = ? WHERE id = ?`;
    params = [
      nama_gendang_beleq,
      alamat,
      deskripsi,
      nomor_hp,
      harga_sewa,
      latitude,
      longitude,
      id,
    ];
  }

  return new Promise((resolve) => {
    db.query(query, params, (err, results) => {
      if (err) {
        console.error(err);
        return resolve(h.response("Gagal mengupdate data").code(500));
      }
      if (results.affectedRows === 0) {
        return resolve(h.response("Data tidak ditemukan").code(404));
      }
      return resolve(h.response("Data berhasil diupdate").code(200));
    });
  });
};

// Hapus data berdasarkan id
exports.deleteGendang = (request, h) => {
  const id = request.params.id;

  return new Promise((resolve) => {
    db.query(
      "DELETE FROM data_gendang_beleq WHERE id = ?",
      [id],
      (err, results) => {
        if (err) {
          console.error(err);
          return resolve(h.response("Gagal menghapus data").code(500));
        }
        if (results.affectedRows === 0) {
          return resolve(h.response("Data tidak ditemukan").code(404));
        }
        return resolve(h.response("Data berhasil dihapus").code(200));
      }
    );
  });
};
