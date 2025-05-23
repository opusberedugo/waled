let app = new Vue({
  el: '#app',
  data: {
    courses: [], // Missing: array to hold course data
    filteredCourses: [], // Missing: array for filtered results
    searchQuery: '', // Missing: search input binding
    sortBy: 'name', // Missing: sorting option
    sortOrder: 'asc', // Missing: sort direction
    cart: [], // Missing: cart data
    isSearching: false // Add loading state for search
  },
  mounted() {
    // Missing: fetch courses when component loads
    this.fetchCourses();
    // Missing: load cart from localStorage
    this.loadCart();
  },
  methods: {
    // Missing: method to fetch courses from API
    async fetchCourses() {
      try {
        const response = await fetch('http://localhost:3000/api/get-courses');
        const data = await response.json();
        this.courses = data;
        this.filteredCourses = data; // Initialize filtered courses
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    },
    
    // Missing: method referenced in HTML template
    addToCart(course) {
      // Check if course is already in cart
      const existingItem = this.cart.find(item => item.id === course._id);
      
      if (existingItem) {
        // If item exists, increment quantity
        existingItem.quantity += 1;
      } else {
        // Add new item to cart
        this.cart.push({
          id: course._id,
          name: course.name,
          price: course.price,
          quantity: 1
        });
      }
      
      // Save to localStorage
      this.saveCart();
      
      // Show confirmation (optional)
      console.log(`Added ${course.name} to cart`);
    },
    
    // Updated: search functionality to use API and handle form submission
    async searchCourses() {
      // Clear results first
      this.filteredCourses = [];
      
      // If search query is empty, show all courses
      if (!this.searchQuery.trim()) {
        this.filteredCourses = this.courses;
        return;
      }
      
      try {
        this.isSearching = true;
        const response = await fetch(`http://localhost:3000/api/search?query=${encodeURIComponent(this.searchQuery)}`);
        const data = await response.json();
        this.filteredCourses = data;
      } catch (error) {
        console.error('Error searching courses:', error);
        // Fallback to local search if API fails
        const query = this.searchQuery.toLowerCase();
        this.filteredCourses = this.courses.filter(course => 
          course.name.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query)
        );
      } finally {
        this.isSearching = false;
      }
    },
    
    // New method to handle form submission
    handleSearchSubmit() {
      this.searchCourses();
    },
    
    // Missing: sort functionality
    sortCourses(sortBy) {
      this.sortBy = sortBy;
      
      this.filteredCourses.sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];
        
        // Handle string comparison
        if (typeof valueA === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }
        
        if (this.sortOrder === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    },
    
    // Missing: toggle sort order
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      this.sortCourses(this.sortBy);
    },
    
    // Missing: save cart to localStorage
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    
    // Missing: load cart from localStorage
    loadCart() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
      }
    }
  },
  
  // Updated: watch for search query changes with debouncing
  watch: {
    searchQuery: {
      handler: function(newQuery) {
        // Debounce the search to avoid too many API calls
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.searchCourses();
        }, 300); // Wait 300ms after user stops typing
      },
      immediate: false
    }
  }
})