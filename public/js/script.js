document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formTambah");
  const alertSuccess = document.getElementById("alertSuccess");
  const alertError = document.getElementById("alertError");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch("/api/gendang", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Berhasil
        alertSuccess.classList.remove("d-none");
        alertError.classList.add("d-none");
        form.reset();

        // (Opsional) refresh tabel data
        loadData();
      } else {
        throw new Error("Gagal menyimpan");
      }
    } catch (error) {
      alertError.classList.remove("d-none");
      alertSuccess.classList.add("d-none");
    }

    // Sembunyikan alert setelah 3 detik
    setTimeout(() => {
      alertSuccess.classList.add("d-none");
      alertError.classList.add("d-none");
    }, 3000);
  });

  // Fungsi untuk load data ke tabel (opsional, bisa ditambahkan)
  async function loadData() {
    const res = await fetch("/api/gendang");
    const data = await res.json();
    const tbody = document.querySelector("#tabelGendang tbody");

    tbody.innerHTML = ""; // kosongkan dulu

    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.nama_gendang_beleq}</td>
        <td>${item.alamat}</td>
        <td>${item.desa}</td>
        <td>${item.nomor_hp}</td>
        <td>${item.harga_sewa}</td>
        <td><img src="/uploads/${item.gambar}" width="80"/></td>
        <td>${item.latitude}</td>
        <td>${item.longitude}</td>
        <td>
          <button class="btn btn-danger btn-sm">Hapus</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // Panggil loadData() saat pertama kali
  loadData();
});
