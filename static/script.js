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
  },
  mounted: function () {
    socket = io();   

    socket.on('get users', (users) => {
      this.users = users;
    });

    socket.on('info', ((info) => {
      this.showInfo(info)
    }));
    socket.on('send message', (message)=> {
      this.messages.push(message);
    })


  },
  methods: {
    chooseUsername: function () {
      if (this.username.length > 0) {
        this.hasInputUsername = true;
        socket.emit('set username', this.username);
        // this.showInfo(`${this.username} chose a username.`)
      }
      else{
        this.showInfo("You need to add a username to proceed!");
      }
    },

    showInfo: function (event) {
      this.events.push(event);
      setTimeout(()=>{
        this.events.pop();
      }, 2000)
    },

    sendMessage: function () {
      if (this.messageInput.length < 1){  
        this.showInfo("You can't send an empty message")
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
