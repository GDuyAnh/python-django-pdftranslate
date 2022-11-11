const dragArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header');

let btn_browse = document.querySelector('.button');
let input = document.querySelector('input');

let file;
const progressArea = document.querySelector('.Progress-area');
const uploadArea = document.querySelector('.Upload-area');

btn_browse.onclick = ()=>{
    console.log("POLLLLSADASD")
    input.click();
};

input.addEventListener('change',function(){
    file = this.files;
    let filetype = file[0].type;
    let valid = 'application/pdf';
    if(filetype == valid){
        uploadFile(file[0]);
    }
});

dragArea.addEventListener('dragover',(event)=>{
    event.preventDefault();
    dragText.textContent = 'Release to Upload';
    dragArea.classList.add('active');
});

dragArea.addEventListener('dragleave',(event)=>{
    event.preventDefault();
    dragText.textContent = 'Drag & Drop';
    dragArea.classList.remove('active');
});

dragArea.addEventListener('drop',(event)=>{
    event.preventDefault();
    dragText.textContent = 'Drag & Drop';
    dragArea.classList.remove('active');
    file = event.dataTransfer.files[0];
    let filetype = file.type;
    let valid = 'application/pdf';
    if(filetype == valid){
        uploadFile(file);
    }
});
function uploadFile(Files){
    let xhr = new XMLHttpRequest();
    let Name = Files.name;
    if(Name.length>=10){
        let splitName = Name.split('.');
        Name = splitName[0].substring(0, 10) +"... ." +splitName[splitName.length-1];
    }
    xhr.open("POST","add");
    xhr.upload.addEventListener("progress",({loaded, total})=>{
    let fileLoad = Math.floor((loaded/total)*100);
    let fileTotal = Math.floor(total/1000);
    let fileSize;
    (fileTotal < 1024)? fileSize = fileTotal +" KB" : fileSize = (loaded/(1024 *1024)).toFixed(2)+" MB";
    let progressHTML = `<li class="row">
                            <i class="fas fa-file-pdf"></i>
                            <div class="content">
                                <div class="details">
                                    <span class="name">${Name} &bull; Uploading</span>
                                </div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${fileLoad}%"></div>
                            </div>
                            <span class="percent">${fileLoad}%</span>
                        </li>`;
    progressArea.innerHTML = progressHTML;
    if(loaded == total){
        progressArea.innerHTML="";
        let uploadedHTML = `<li class="row">
                            <i class="fas fa-file-pdf"></i>
                            <div class="content">
                                <div class="details">
                                    <span class="name">${Name} &bull; Uploaded</span>
                                    <span class="size">${fileSize}</span>
                                </div>
                            </div>
                            <i class="fas fa-check"></i>
                        </li>`;   
    uploadArea.insertAdjacentHTML("afterbegin",uploadedHTML);
    }
    
    //uploadArea.innerHTML = uploadedHTML;
    });

    var formData = new FormData();
    formData.append('file', Files);
    formData.append('name', Files.name);
    

    xhr.send(formData);
}