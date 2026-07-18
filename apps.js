const WEB_APP_URL = "PASTE_URL_WEB_APP_ANDA_DI_SINI";

let html5QrCode = null;
let scanning = false;

const hasil = document.getElementById("hasil");
const btnScan = document.getElementById("btnScan");

btnScan.onclick = () => {

    if(scanning){
        stopScanner();
    }else{
        startScanner();
    }

};

function startScanner(){

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(cameras=>{

        if(cameras.length===0){

            hasil.innerHTML="<h2>Kamera tidak ditemukan</h2>";
            return;

        }

        scanning=true;
        btnScan.innerText="Stop Scan";

        html5QrCode.start(

            { facingMode:"environment" },

            {
                fps:10,
                qrbox:250
            },

            onScanSuccess

        );

    });

}

function stopScanner(){

    if(!html5QrCode) return;

    html5QrCode.stop().then(()=>{

        scanning=false;
        btnScan.innerText="Mulai Scan";

    });

}

function onScanSuccess(decodedText){

    stopScanner();

    hasil.innerHTML="<h2>Memproses...</h2>";

    fetch(
        WEB_APP_URL +
        "?action=scan&id=" +
        encodeURIComponent(decodedText)
    )

    .then(r=>r.json())

    .then(data=>{

        if(data.success){

            hasil.innerHTML=`
                <h2 style="color:green;">${data.message}</h2>
                <p><b>${data.nama}</b></p>
                <p>${data.kelas}</p>
                <p>${data.waktu}</p>
            `;

        }else{

            hasil.innerHTML=`
                <h2 style="color:red;">${data.message}</h2>
                <p>${data.nama||""}</p>
            `;

        }

        setTimeout(()=>{

            hasil.innerHTML="<h2>Siap Scan...</h2>";
            startScanner();

        },3000);

    })

    .catch(err=>{

        hasil.innerHTML="<h2>Server tidak dapat dihubungi</h2>";
        console.log(err);

        setTimeout(()=>{
            startScanner();
        },3000);

    });

}
