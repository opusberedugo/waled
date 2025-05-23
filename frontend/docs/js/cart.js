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
    
    async checkout() {
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
      
      console.log("Processing checkout", order);
      
      try {
        // Send POST request to the API endpoint
        const response = await fetch('http://localhost:3000/api/add-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log("Order submitted successfully:", result);
          alert("Thank you for your order! We'll contact you soon.");
          
          // Clear the cart and reset form after successful submission
          this.cart = [];
          this.updateCart();
          this.fullname = '';
          this.phone = '';
          this.fullnameError = '';
          this.phoneError = '';
        } else {
          const errorData = await response.json();
          console.error("Failed to submit order:", errorData);
          alert("Sorry, there was an error processing your order. Please try again.");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Sorry, there was a network error. Please check your connection and try again.");
      }
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