
let isRecording = false;
let chunks = [];
let vidBtn = document.querySelector("#record");
let capBtn = document.querySelector("#capture");
let innerRecord = document.getElementById("inner-record");
let innerCapture = document.getElementById("inner-capture");
let filter = document.querySelectorAll(".filter");
let body = document.querySelector("body");
let zoomIn = document.querySelector(".zoom-in");
let zoomOut = document.querySelector(".zoom-out");
let video = document.querySelector("video");
let btnGallery = document.querySelector(".btnGallery");


let filterColor = "";
let maxZoom = 3;
let currZoom = 1;
let minZoom = 1;


for(let i=0;i<filter.length;i++){
    filter[i].addEventListener("click",function(e){
        filterColor = e.currentTarget.style.backgroundColor;
        removeFilter();
        applyFilter(filterColor);

    })
}


zoomIn.addEventListener("click",function(e){
    console.log("hey");
    if(currZoom >= maxZoom){
       return; 
    }else{
        console.log("hey");

        currZoom = currZoom + 0.1 ;
        video.style.transform = `scale(${currZoom})`;

    }

})

zoomOut.addEventListener("click",function(e){

    if(currZoom <= minZoom ){
        return;

    }else{
        currZoom -= 0.1;
        video.style.transform = `scale(${currZoom})`;
    }

})



vidBtn.addEventListener("click", function () {
    if (isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        innerRecord.classList.remove("record-animation")



    } else {
        
        mediaRecorder.start();
        filterColor = "";
        removeFilter();
        if(currZoom != 1){
            video.style.transform = "scale(1)";
            currZoom = 1;
        }
        isRecording = true;

        innerRecord.classList.add("record-animation")


    }
})
capBtn.addEventListener("click",function(){
    innerCapture.classList.add("capture-animation");
    setTimeout(function(e){
        innerCapture.classList.remove("capture-animation");

    },500)
    capture();
})
let constraints = { video: true, audio: false };          //if audio and video are true both should be allowed to even run any one of them
let mediaRecorder;
let options = { mimeType: "video/webm; codecs=vp9" };             //without this video was not playing only audio was there

// let contraints2 = {audio : true};
navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {              //media stream is the object returned by the promise
    video.srcObject = mediaStream;

    mediaRecorder = new MediaRecorder(mediaStream, options);                //an object is saved in mediaRecorder
    mediaRecorder.addEventListener("dataavailable", function (e) {
        chunks.push(e.data);
    })

    mediaRecorder.addEventListener("stop", function (e) {
        let blob = new Blob(chunks, { type: "video/mp4" });
        addMedia("video",blob);
        chunks = [];
        // let url = URL.createObjectURL(blob);
        // let a = document.createElement("a");
        // a.href = url;
        // a.download = "video.mp4";
        // a.click();
        // a.remove();


    });
});


function capture() {
    let c = document.createElement("canvas");
    //its the height and widht of the video acc to the resolution of our camera
    c.width = video.videoWidth;               
    c.height = video.videoHeight;
    let ctx = c.getContext("2d");
    ctx.translate(c.width/2,c.height/2);            //as initially origin is at (0,0) and scale happens respect to origin
    ctx.scale(currZoom,currZoom);
    ctx.translate(-c.width/2,-c.height/2);

    ctx.drawImage(video,0,0);

    if(filterColor != ""){
        ctx.fillStyle = filterColor;
        ctx.fillRect(0,0,c.width,c.height);

    }
    // let a = document.createElement("a");
    // a.download = "image.png";
    // a.href = c.toDataURL();
    addMedia("img",c.toDataURL());
    // a.click();
    // a.remove();

}

function removeFilter(){
    console.log("r");
    let filterDiv = document.querySelector(".filter-div");
    if(filterDiv){
        filterDiv.remove();
    }
}

function applyFilter(filterC){
    console.log("a");
    let filterDiv = document.createElement("div");
    filterDiv.classList.add("filter-div");
    filterDiv.style.backgroundColor = filterC;
    body.appendChild(filterDiv);

}

btnGallery.addEventListener("click",function(){
    location.assign("gallery.html");
})




