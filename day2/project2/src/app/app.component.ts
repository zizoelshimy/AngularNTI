import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule,NgIf,NgForOf,DecimalPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Product Management System';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  // Form properties using two-way data binding
  productForm: Product = {
    id: 0,
    productName: '',
    description: '',
    price: 0,
    category: '',
    availability: false
  };
  // Form validation errors
  formErrors: FormErrors = {
    productName: '',
    description: '',
    price: '',
    category: ''
  };
  // Search and filter properties
  searchTerm: string = '';
  selectedCategory: string = '';
  // Categories array for dropdown
  categories: string[] = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports'
  ];

  // UI state properties
  isEditing: boolean = false;
  editingId: number = 0;
  submitButtonText: string = 'Add Product';
  showNoProductsMessage: boolean = true;

  // Auto-increment ID counter
  private nextId: number = 1;

  constructor() {
    this.loadFromLocalStorage();
    this.updateFilteredProducts();
  }

  // Form submission handler
  onSubmit(): void {
    this.clearFormErrors();

    if (!this.validateForm()) {
      return;
    }

    if (this.isEditing) {
      this.updateProduct();
    } else {
      this.addProduct();
    }

    this.resetForm();
    this.updateFilteredProducts();
    this.saveToLocalStorage();
  }
  trackByProductId(index: number, product: any): any {
  return product.id || index;  // Use product.id if available, else fallback to index
}

  // Form validation method
  validateForm(): boolean {
    let isValid = true;

    // Validate product name
    if (!this.productForm.productName.trim()) {
      this.formErrors.productName = 'Product name cannot be empty.';
      isValid = false;
    }

    // Validate description
    if (!this.productForm.description.trim()) {
      this.formErrors.description = 'Description cannot be empty.';
      isValid = false;
    }

    // Validate price
    if (!this.productForm.price || this.productForm.price <= 0) {
      this.formErrors.price = 'Price should be a positive number.';
      isValid = false;
    }

    // Validate category
    if (!this.productForm.category) {
      this.formErrors.category = 'Category should be selected.';
      isValid = false;
    }

    return isValid;
  }

  // Add new product
  addProduct(): void {
    const newProduct: Product = {
      id: this.nextId++,
      productName: this.productForm.productName.trim(),
      description: this.productForm.description.trim(),
      price: this.productForm.price,
      category: this.productForm.category,
      availability: this.productForm.availability
    };

    this.products.push(newProduct);
    alert(`Product "${newProduct.productName}" has been added successfully!`);
    console.log('Product added:', newProduct);
  }

  // Update existing product
  updateProduct(): void {
    const index = this.products.findIndex(p => p.id === this.editingId);
    if (index !== -1) {
      this.products[index] = {
        id: this.editingId,
        productName: this.productForm.productName.trim(),
        description: this.productForm.description.trim(),
        price: this.productForm.price,
        category: this.productForm.category,
        availability: this.productForm.availability
      };

      alert(`Product "${this.products[index].productName}" has been updated successfully!`);
      console.log('Product updated:', this.products[index]);
    }
  }

  // Edit product handler
  editProduct(product: Product): void {
    this.productForm = { ...product }; // Copy product data
    this.isEditing = true;
    this.editingId = product.id;
    this.submitButtonText = 'Update Product';
    this.clearFormErrors();

    // Scroll to form
    setTimeout(() => {
      const formElement = document.querySelector('.form-container');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // Delete product handler
  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.productName}"?`)) {
      const index = this.products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        this.products.splice(index, 1);
        this.updateFilteredProducts();
        this.saveToLocalStorage();
        alert(`Product "${product.productName}" has been deleted successfully!`);
        console.log('Product deleted. Remaining products:', this.products);
      }
    }
  }

  // Search products
  onSearch(): void {
    this.updateFilteredProducts();
  }

  // Filter by category
  onCategoryFilter(): void {
    this.updateFilteredProducts();
  }

  // Clear search and filters
  clearSearch(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.updateFilteredProducts();
  }

  // Update filtered products based on search and category filter
  updateFilteredProducts(): void {
    let filtered = [...this.products];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product =>
        product.category === this.selectedCategory
      );
    }

    this.filteredProducts = filtered;
    this.showNoProductsMessage = this.filteredProducts.length === 0;
  }

  // Get row SCSS class based on category
  getRowClass(category: string): string {
    switch (category) {
      case 'Electronics': return 'electronics-row';
      case 'Clothing': return 'clothing-row';
      case 'Books': return 'books-row';
      case 'Home & Garden': return 'home-garden-row';
      case 'Sports': return 'sports-row';
      default: return '';
    }
  }

  // Get category SCSS class
  getCategoryClass(category: string): string {
    switch (category) {
      case 'Electronics': return 'electronics-category';
      case 'Clothing': return 'clothing-category';
      case 'Books': return 'books-category';
      case 'Home & Garden': return 'home-garden-category';
      case 'Sports': return 'sports-category';
      default: return '';
    }
  }

  // Get availability text and class
  getAvailabilityText(availability: boolean): string {
    return availability ? 'Available' : 'Not Available';
  }

  getAvailabilityClass(availability: boolean): string {
    return availability ? 'available' : 'unavailable';
  }

  // Reset form to initial state
  resetForm(): void {
    this.productForm = {
      id: 0,
      productName: '',
      description: '',
      price: 0,
      category: '',
      availability: false
    };

    this.isEditing = false;
    this.editingId = 0;
    this.submitButtonText = 'Add Product';
    this.clearFormErrors();
  }

  // Clear form validation errors
  clearFormErrors(): void {
    this.formErrors = {
      productName: '',
      description: '',
      price: '',
      category: ''
    };
  }

  // Local storage methods
  saveToLocalStorage(): void {
    localStorage.setItem('angular-products', JSON.stringify(this.products));
    localStorage.setItem('angular-next-id', this.nextId.toString());
  }

  loadFromLocalStorage(): void {
    const savedProducts = localStorage.getItem('angular-products');
    const savedNextId = localStorage.getItem('angular-next-id');

    if (savedProducts) {
      this.products = JSON.parse(savedProducts);
    }

    if (savedNextId) {
      this.nextId = parseInt(savedNextId);
    }

    console.log('Loaded products from localStorage:', this.products);
  }
}
// Product interface for type safety
export interface Product {
  id: number;
  productName: string;
  description: string;
  price: number;
  category: string;
  availability: boolean;
}

// Form validation interface
export interface FormErrors {
  productName: string;
  description: string;
  price: string;
  category: string;
}
