var socket = null;

var app = new Vue({
  el: '#chat',
  data: {
    username: '',
    users: [],
    messages: [],
    messageInput: '',
    hasInputUsername: false,
    events: [],
    lastWriteEvent: '',
  },
  mounted: function () {
    socket = io();   

    socket.on('get users', (users) => {
      this.users = users;
    });

    socket.on('info', ((info) => {
      this.showInfo(info);
    }));
    socket.on('write info', (writeInfo) => {
      this.showWriteInfo(writeInfo);
    })
    socket.on('send message', (message)=> {
      this.messages.push(message);
    })
    socket.on('check users', () => {
      socket.emit('update username list', this.username);
    })

  },
  methods: {
    chooseUsername: function () {
      if (this.username.length > 0) {
        this.hasInputUsername = true;
        socket.emit('set username', this.username);
      }
      else{
        this.showInfo("You need to add a username to proceed!");
      }
    },

    showInfo: function (event) {
      if(!this.events.includes(event)) {
        this.events.push(event);
        setTimeout(()=>{
          this.events.pop();
        }, 2000);
      };
    },
    showWriteInfo: function (writeEvent) {
      if(this.lastWriteEvent !== writeEvent) {
        let notice = {
          author: 'info',
          content: writeEvent
        };
        socket.emit('send message', notice);
        this.lastWriteEvent = writeEvent;
      }

    },

    sendMessage: function () {
      if (this.messageInput.length < 1){  
        this.showInfo("You can't send an empty message!")
      }
      else {
        let message = {
          author: this.username,
          content: this.messageInput
        };
        socket.emit('send message', message);
        this.messageInput = '';
      }
    },
  },
  
});
