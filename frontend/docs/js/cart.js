let app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    courses: [],
    cart: JSON.parse(sessionStorage.getItem('cart')) || [],
  },
  methods: {
    increaseQuantity(course){
      if(course.availableSpaces > course.quantity){
        course.quantity +=1 
      }
    },

    reduceQuantity(course){
      if(course.availableSpaces > course.quantity){
        course.quantity +=1 
      }
    },
  },
  beforeMount(){
    const storedCart = sessionStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
      console.log("The cart",this.cart);
    }
  }
})