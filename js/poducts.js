document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.firestore();
    
    const categoryFilter = document.getElementById('category-filter');
    const productList = document.getElementById('product-list');

    // Load Products
    function loadProducts(category) {
        productList.innerHTML = '';
        let query = db.collection('products');

        if (category) {
            query = query.where('category', '==', category);
        }

        query.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                productList.innerHTML += `
                    <div class="product-card">
                        <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Available Quantity: ${product.quantity}</p>
                        <button onclick="addToCheckout('${doc.id}')">Add to Checkout</button>
                    </div>
                `;
            });
        }).catch((error) => {
            console.error("Error loading products: ", error);
        });
    }

    // Add to Checkout
    window.addToCheckout = function(productId) {
        // Logic for adding to checkout
        alert("Product added to checkout!");
    }

    // Event listener for category filter
    categoryFilter.addEventListener('change', function() {
        const selectedCategory = this.value;
        loadProducts(selectedCategory);
    });

    // Initial load of all products
    loadProducts();
});
