import { Component,ElementRef,OnInit, ViewChild } from '@angular/core';
import io from 'socket.io-client';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'chat-app';
  users: any[] = [];
  socketIo:any;
  typing = '';
  userId= Math.floor(Math.random() * 100) + 1;
  conntectedUser = [];
  @ViewChild('message') message: ElementRef;
  @ViewChild('usernameInput') usernameInput: ElementRef;
  isLogin = false;
  constructor(){

  }
  onNgModelChange(e):void {
     console.log(e);
  }
  ngOnInit(): void {
  this.socketIo = io('http://localhost:3000');
  this.registerEvent();
  }
  onKeydown(event: any): void {
       console.log(event.key);
       this.onTypeing(true);

  }
  onKeyup(event: any): void {
   //   this.onTypeing(false)
  }
  onTypeing(isTyping: boolean): void{
    this.socketIo.emit('typing', {type: isTyping, id: this.userId} );
  }
  registerEvent(): void{
     this.socketIo.on('typing',(data)=>{
       console.log(data)
       if(data.type == true && data.id != this.userId){
      this.typing = 'typing .....';
      }else {
        this.typing = '';
      }

     });
     this.socketIo.on('chat',(data)=>{
      this.conntectedUser.push({id:data.id, chat:data.chat});
  });
     this.socketIo.on('login', (data) =>{
        this.users =data;
  })
     this.socketIo.on('connect', ()=>{

  });
  }
  send(event: any): void {
    const msg = this.message.nativeElement.value;
    this.socketIo.emit('chat', {chat: msg, type: 'chat', id: this.userId});
    this.message.nativeElement.value = '';
    this.onTypeing(false);
  }
  onLogin(e:any):void {
    this.userId = this.usernameInput.nativeElement.value;
    this.socketIo.emit('login', {id:this.userId});
    this.isLogin = true;
  }
}
