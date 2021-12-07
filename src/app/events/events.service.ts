import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
// import { ApiService } from 'src/app/services/api.service';
@Injectable({
  providedIn: 'root'
})
export class EventsService {


  private fooSubject = new Subject<any>();
  constructor(
    // private api: ApiService,
  )
   { 
      
  }


  publishSomeData(data:any){

    this.fooSubject.next(data);
  
}
getObservable(): Subject<any> {
  return this.fooSubject; 
}
  
// getChatbadge(){

//   var getByGroup = JSON.parse(localStorage.getItem('getByGroup'))

//   // for (let index = 0; index < getByGroup.length; index++) {
    
//     var param = {

//       room_id: '3',
//       uid: '19_3',
//       type: 'store'
//     }
//     this.api.post('chats/getChatCountByRoomId', param).subscribe((data: any) => {
//       this.getdata = data.data.length;
 
//     }, error => {
//       console.log(error);
    
//     });
   
//   // }
  
// return this.getdata

// }

}