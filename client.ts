import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin.service';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-admin-upload',
  templateUrl: './admin-upload.component.html',
  styleUrls: ['./admin-upload.component.scss']
})
export class AdminUploadComponent implements OnInit {
  
   fileId : Guid;
   file : any;
   size : any;
   start : any = 0;
   end : any;
   sliceSize = 100000;
   type = "";

  constructor(public adminService : AdminService) { }

  ngOnInit() {
  }

  //handler to upload file
  handleFileUpload(fileEvent){
    let file = fileEvent.target.files[0];
    let size = file.size;
    let start = 0;
    let end = 0;
    let fileName = file.name;
    this.type = file.type;
    this.fileId = Guid.create();
  
    this.processFile(file,fileName,size,start,end);
}

processFile(file,fileName,size,start,end){
  end = start + this.sliceSize;
  if (size - end < 0) {
    end = size;
  }
  let piece = this.sliceFile(file,start,end);
  this.send(file,fileName,size,piece, start, end);

}

sliceFile(file,start,end){
  let slice = file.mozSlice ? file.mozSlice :
    file.webkitSlice ? file.webkitSlice :
    file.slice ? file.slice : "";

  return slice.bind(file)(start,end);
}


send(file,fileName,size,piece, start, end) {
  var formdata = new FormData();

  formdata.append('start', start);
  formdata.append('end', end);
  formdata.append('slicedFile', piece);
  formdata.append('orgFileName', fileName);
  formdata.append('orgFileSize', size);
  formdata.append('orgFileType', this.type);
  formdata.append('orgFileId', this.fileId.toString());
  if(end === size ){
    formdata.append('isLastBlob', 'true');
  }else{
    formdata.append('isLastBlob', 'false');
  }

  //call service to send the formData
  this.adminService.uploadAdminFiles(formdata).subscribe(response=>{
    if (end < size) {
      start += this.sliceSize;
      this.processFile(file,fileName,size,start,end);
    }
  },error=>{
    console.log("error"+error);
  });


  // setTimeout(()=>{
  //   if (end < size) {
  //     start += this.sliceSize;
  //     this.processFile(file,fileName,size,start,end);
  //   }
  // },1000);
}

}
