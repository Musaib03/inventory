document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.firestore();
    const storage = firebase.storage();

    // Add Product
    document.getElementById('add-product-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('product-name').value;
        const description = document.getElementById('product-description').value;
        const category = document.getElementById('product-category').value;
        const quantity = parseInt(document.getElementById('product-quantity').value);
        const file = document.getElementById('product-image').files[0];

        const uploadTask = storage.ref(`images/${file.name}`).put(file);
        uploadTask.on('state_changed', null, function(error) {
            console.error("Error uploading image: ", error);
        }, function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                db.collection('products').add({
                    name: name,
                    description: description,
                    category: category,
                    quantity: quantity,
                    imageUrl: downloadURL
                }).then(() => {
                    alert("Product added!");
                    document.getElementById('add-product-form').reset();
                    loadProducts();
                }).catch((error) => {
                    console.error("Error adding product: ", error);
                });
            });
        });
    });

    // Load Products
    function loadProducts() {
        db.collection('products').get().then((querySnapshot) => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                productList.innerHTML += `
                    <div class="product-item">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Category: ${product.category}</p>
                        <p>Quantity: ${product.quantity}</p>
                        <img src="${product.imageUrl}" alt="${product.name}" style="width: 100px;">
                        <button onclick="deleteProduct('${doc.id}')">Delete</button>
                        <button onclick="editProduct('${doc.id}')">Edit</button>
                    </div>
                `;
            });
        });
    }

    loadProducts();  // Load products on page load

    // Delete Product
    window.deleteProduct = function(productId) {
        if (confirm("Are you sure you want to delete this product?")) {
            db.collection('products').doc(productId).delete().then(() => {
                alert("Product deleted!");
                loadProducts();
            }).catch((error) => {
                console.error("Error deleting product: ", error);
            });
        }
    }

    // Edit Product
    window.editProduct = function(productId) {
        const newName = prompt("Enter new product name:");
        const newDescription = prompt("Enter new product description:");
        const newCategory = prompt("Enter new product category:");
        const newQuantity = parseInt(prompt("Enter new product quantity:"));

        if (newName && newDescription && newCategory && !isNaN(newQuantity)) {
            db.collection('products').doc(productId).update({
                name: newName,
                description: newDescription,
                category: newCategory,
                quantity: newQuantity
            }).then(() => {
                alert("Product updated!");
                loadProducts();
            }).catch((error) => {
                console.error("Error updating product: ", error);
            });
        } else {
            alert("Please provide valid input.");
        }
    }
});
