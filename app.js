// URL Web App Anda
const URL_WEB_APP = "https://script.google.com/macros/s/AKfycbziYrjjBKv0zcdxee5paQVXBmDLbaF7FTYijWyLJAMwlRbdwjA_e3bHH2keicMjK0y4/exec";

// Inisialisasi scanner
const html5QrCode = new Html5QrCode("reader");

document.getElementById('scanBtn').addEventListener('click', async () => {
    const scanBtn = document.getElementById('scanBtn');
    const hasil = document.getElementById('hasil');

    try {
        scanBtn.disabled = true;
        hasil.innerText = "Membuka kamera...";

        await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                // Berhenti scan segera setelah QR terbaca
                html5QrCode.stop().then(() => {
                    scanBtn.disabled = false;
                    hasil.innerText = "Data terdeteksi, mengirim ke server...";

                    // Kirim ke Google Apps Script
                    fetch(`${URL_WEB_APP}?action=scan&id=${encodeURIComponent(decodedText)}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                hasil.innerHTML = `✅ <b>Berhasil!</b><br>Nama: ${data.nama}<br>${data.message}`;
                            } else {
                                hasil.innerHTML = `⚠️ <b>Gagal!</b><br>${data.message}`;
                            }
                        })
                        .catch(err => {
                            hasil.innerText = "Gagal terhubung ke server. Pastikan internet aktif.";
                        });
                });
            },
            (errorMessage) => {
                // Abaikan error saat proses scanning berlangsung (normal)
            }
        );
    } catch (err) {
        scanBtn.disabled = false;
        hasil.innerText = "Gagal membuka kamera: " + err;
    }
});
