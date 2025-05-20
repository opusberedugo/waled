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
        course.quantity += 1;
        this.updateCart();
      }
    },

    reduceQuantity(course){
      if(course.quantity > 1){
        course.quantity -= 1;
        this.updateCart();
      }
    },
    
    removeFromCart(item) {
      const index = this.cart.findIndex(cartItem => cartItem === item);
      if (index !== -1) {
        this.cart.splice(index, 1);
        this.updateCart();
      }
    },
    
    updateCart() {
      // Update the session storage whenever cart changes
      sessionStorage.setItem('cart', JSON.stringify(this.cart));
    },
    
    checkout() {
      // Checkout logic
      console.log("Processing checkout");
      // Additional checkout logic can be added here
    }
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    }
  },
  beforeMount(){
    const storedCart = sessionStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
      console.log("The cart", this.cart);
    }
  }
});