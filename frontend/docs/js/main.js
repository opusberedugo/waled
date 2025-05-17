let app = new Vue({
  el: '#app',
  data: {
      message: 'Hello Vue!',
      courses: [],
    },
  methods: {
      reverseMessage: function () {}
    },
  beforeMount(){
    fetch("http://localhost:3000/api/get-courses").then((res)=>(res.json())).then((d) => this.courses = [...d]);
  }
})