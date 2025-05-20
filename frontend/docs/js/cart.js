let app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    courses: [],
    cart: JSON.parse(sessionStorage.getItem('cart')) || [],
    fullname: '',
    phone: '',
    fullnameError: '',
    phoneError: '',
    orderObj: '',
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
    
    verifyFullName() {
      if (this.fullname.length < 3) {
        this.fullnameError = 'Full name must be at least 3 characters';
      } else if (!/^[a-zA-Z\s]*$/.test(this.fullname)) {
        this.fullnameError = 'Full name should contain only letters and spaces';
      } else {
        this.fullnameError = '';
      }
    },
    
    verifyPhone() {
      if (this.phone.length < 10) {
        this.phoneError = 'Phone number must be at least 10 digits';
      } else if (!/^\d+$/.test(this.phone)) {
        this.phoneError = 'Phone number should contain only digits';
      } else {
        this.phoneError = '';
      }
    },
    
    checkout() {
      // Verify all fields are valid before proceeding
      this.verifyFullName();
      this.verifyPhone();
      
      if (this.fullnameError || this.phoneError || this.cart.length === 0) {
        console.log("Cannot checkout - form has errors or cart is empty");
        return;
      }
      
      // Create order object with user details and cart items
      const order = {
        customerName: this.fullname,
        customerPhone: this.phone,
        items: this.cart,
        totalAmount: this.totalPrice,
        orderDate: new Date().toISOString()
      };
      
      // Stringify the order object and assign it to orderObj for form submission
      this.orderObj = JSON.stringify(order);
      
      console.log("Processing checkout", order);
      
      // You would typically submit this data to a server endpoint
      // For now, we'll simulate a successful order
      alert("Thank you for your order! We'll contact you soon.");
      
      // Clear the cart and reset form
      this.cart = [];
      this.updateCart();
      this.fullname = '';
      this.phone = '';
    },
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