const URL_WEB_APP = "https://script.google.com/macros/s/AKfycbziYrjjBKv0zcdxee5paQVXBmDLbaF7FTYijWyLJAMwlRbdwjA_e3bHH2keicMjK0y4/exec"; // Ganti ini!
const html5QrCode = new Html5QrCode("reader");

document.getElementById('scanBtn').addEventListener('click', () => {
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            html5QrCode.stop();
            document.getElementById('hasil').innerText = "Memproses...";

            // Memanggil API scanQR di Code.gs
            fetch(`${URL_WEB_APP}?action=scan&id=${decodedText}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('hasil').innerHTML = 
                            `✅ <b>Berhasil!</b><br>Nama: ${data.nama}<br>${data.message}`;
                    } else {
                        document.getElementById('hasil').innerHTML = 
                            `⚠️ <b>Gagal!</b><br>${data.message}`;
                    }
                })
                .catch(err => {
                    document.getElementById('hasil').innerText = "Error koneksi ke server.";
                });
        }
    );
});
