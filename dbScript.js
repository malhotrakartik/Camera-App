let dbAccess;
let request = indexedDB.open("Camera", 1);
let container = document.querySelector(".container");

request.addEventListener("success", function () {
    dbAccess = request.result;
});

request.addEventListener("upgradeneeded", function () {
    let db = request.result;
    db.createObjectStore("gallery", { keyPath: "mId" });
});

request.addEventListener("error", function () {
    alert("some error occured");
});

function addMedia(type, media) {
    let tx = dbAccess.transaction("gallery", "readwrite");
    let galleryObjectStore = tx.objectStore("gallery");
    let data = {
        mId: Date.now(),
        type,
        media,
    };
    galleryObjectStore.add(data);
}
function viewMedia() {
    let tx = dbAccess.transaction("gallery", "readonly");
    let galleryObjectStore = tx.objectStore("gallery");
    let req = galleryObjectStore.openCursor();
    req.addEventListener("success", function () {
        let cursor = req.result;
        if (cursor) {
            let div = document.createElement("div");
            div.classList.add("media-card");
            div.innerHTML = `   
            <div class="media-container">
    
            </div>
            <div class="action-container">
                <div class="media-download">Download</div>
                <div class="media-delete" data-id="${cursor.value.mId}">Delete</div>
            </div>
        `;

            let downloadBtn = div.querySelector(".media-download");
            let deleteBtn = div.querySelector(".media-delete");
            deleteBtn.classList.add("action-button")
            deleteBtn.addEventListener("click",function(e){
                
                let mId = e.currentTarget.getAttribute("data-id");
                //deleting from dom
                deleteMediaFromDb(mId);
                e.currentTarget.parentElement.parentElement.remove();
                
            })
            downloadBtn.classList.add("action-button")
            if (cursor.value.type == "img") {
                let img = document.createElement("img");
                img.classList.add("img-gallery");
                img.src = cursor.value.media;
                let mediaContainer = div.querySelector(".media-container");
                mediaContainer.appendChild(img);
                downloadBtn.addEventListener("click", function (e){
                    let a = document.createElement("a");
                    a.download = "image.png";
                    a.href = img.src;
                    a.click();
                    a.remove();
                })


            } else {
                let video = document.createElement("video");
                video.autoplay = true;
                video.controls = true;
                video.loop = true;
                video.classList.add("video-gallery");
                video.src = window.URL.createObjectURL(cursor.value.media);                //accessing video url from blob object
                video.addEventListener("mouseenter", function (e) {
                    // video.currentTime = 0;
                    video.play();
                })
                video.addEventListener("mouseleave", function (e) {

                    video.pause();
                })


                let mediaContainer = div.querySelector(".media-container");
                mediaContainer.appendChild(video);
                downloadBtn.addEventListener("click", function (e){
                    let a = document.createElement("a");
                    a.download = "video.mp4";
                    a.href = video.src;
                    a.click();
                    a.remove();
                })
                

            }


            container.appendChild(div);
            cursor.continue();
        }
    })
}

function deleteMediaFromDb(mId){
    let tx = dbAccess.transaction("gallery", "readwrite");
    let galleryObjectStore = tx.objectStore("gallery");
    galleryObjectStore.delete(Number(mId));
}
