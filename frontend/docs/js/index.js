
let app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    courses: [],
    cart:  JSON.parse(sessionStorage.getItem('cart'))||[],
  },
  methods: {
    addToCart(course) {
      if (!course) return;

      if (course.availableSpaces > 0){
        // Find if the course already exists in the cart
        const existingCourse = this.cart.find(item => item._id === course._id);

        if (existingCourse) {
          // If the course already exists, increase the quantity
          existingCourse.quantity++;
        } else {
          this.cart.unshift({
            _id: course._id,  // Make sure this property name matches what you're checking above
            name: course.name,
            price: course.price,
            quantity: 1,
            availableSpaces: course.availableSpaces,
            location: course.location,
          });
        }

        // Decrease the available spaces in the course
        course.availableSpaces--;

        // Save the updated cart to sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(this.cart));

        alert(`Course ${course.name} added to cart!`);
      } else {
        alert(`No available spaces for ${course.name}`);
      }
    }
  },
  beforeMount() {
    fetch("http://localhost:3000/api/get-courses").then((res)=>(res.json())).then((d) => this.courses = [...d]);
    
  },
})