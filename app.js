const WEBAPP = "https://script.google.com/macros/s/AKfycbx_lq0cgllyIQoiULbhMWl1YwO2i4GmFshD6kc_NIlZIuJC1Tip4bajjJhDJ27w3PaP/exec";

const hasil = document.getElementById("hasil");
const tombol = document.getElementById("scanBtn");

let scanner = null;
let scanning = false;


tombol.addEventListener("click", mulaiScan);


function mulaiScan(){

    if(scanning){
        return;
    }

    scanning = true;

    tombol.style.display = "none";

    hasil.innerHTML = "Membuka kamera...";


    scanner = new Html5Qrcode("reader");


    Html5Qrcode.getCameras()
    .then(cameras => {


        if(cameras.length === 0){

            throw "Kamera tidak ditemukan";

        }


        // cari kamera belakang
        let cameraId = cameras[0].id;


        for(let i=0; i<cameras.length; i++){

            if(
              cameras[i].label.toLowerCase().includes("back") ||
              cameras[i].label.toLowerCase().includes("rear")
            ){

                cameraId = cameras[i].id;
                break;

            }

        }



        scanner.start(

            cameraId,

            {
                fps:10,
                qrbox:250
            },


            function(decodedText){


                prosesQR(decodedText);


            },


            function(errorMessage){

                // abaikan error scan

            }

        );


    })


    .catch(error=>{


        console.log(error);


        hasil.innerHTML =
        "❌ Kamera tidak bisa dibuka<br><br>" +
        error;


        tombol.style.display="block";

        scanning=false;


    });


}



// GANTI fungsi prosesQR yang lama dengan ini:
function prosesQR(id) {
    if (scanner) {
        scanner.stop().then((ignore) => {
            lanjutkanProses(id);
        }).catch((err) => {
            console.error("Gagal menghentikan scanner: ", err);
            lanjutkanProses(id);
        });
    }
}

// TAMBAHKAN fungsi baru ini tepat di bawahnya:
function lanjutkanProses(id) {
    hasil.innerHTML = "Mengirim absensi...";
    
    const url = WEBAPP + "?action=scan&id=" + encodeURIComponent(id);

    fetch(url)
    .then(response => response.json())
    .then(data => {
        if(data.success){
            hasil.className = "berhasil";
            hasil.innerHTML = "✅<br><br>" + data.nama + "<br><br>" + data.message;
        } else {
            hasil.className = "gagal";
            hasil.innerHTML = "❌<br><br>" + data.message;
        }

        setTimeout(() => {
            hasil.className = "";
            hasil.innerHTML = "Silakan scan QR berikutnya";
            tombol.style.display = "block";
            scanning = false;
        }, 2500);
    })
    .catch(error => {
        console.log(error);
        hasil.className = "gagal";
        hasil.innerHTML = "❌ Server tidak dapat dihubungi";
        tombol.style.display = "block";
        scanning = false;
    });
}
