var app = new Vue({
  el: '#chat',
  data: {
    username: '',
    users: ['bob', 'rob'],
    messages: [],
    messageInput: '',
    hasInputUsername: false,
    events: []
  },
  methods: {
    chooseUsername: function () {
      if (this.username.length > 0) {
        this.hasInputUsername = true;
        this.users.push(this.username);
        this.showInfo(`${this.username} chose a username.`)
      }
      else{
        console.log("you need to add a username to proceed!! add this to the dom not the console");
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
        this.messageInput = '';
        this.messages.push(message);
      }
    }
  },
  
});