# Strategy Pattern

## Overview

Defines a family of algorithms, encapsulates each one, and makes them interchangeable. Lets the algorithm vary independently from clients that use it.

## TypeScript Implementation

```typescript
interface PaymentStrategy {
  pay(amount: number): void;
}

class CreditCardStrategy implements PaymentStrategy {
  constructor(private cardNumber: string) {}

  pay(amount: number): void {
    console.log(
      `Paying $${amount} with Credit Card ending in ${this.cardNumber.slice(
        -4
      )}`
    );
  }
}

class PayPalStrategy implements PaymentStrategy {
  constructor(private email: string) {}

  pay(amount: number): void {
    console.log(`Paying $${amount} with PayPal account: ${this.email}`);
  }
}

class CryptoStrategy implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  pay(amount: number): void {
    console.log(
      `Paying $${amount} with Crypto wallet: ${this.walletAddress.substring(
        0,
        8
      )}...`
    );
  }
}

class ShoppingCart {
  private items: Array<{ name: string; price: number }> = [];

  addItem(name: string, price: number): void {
    this.items.push({ name, price });
  }

  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  checkout(strategy: PaymentStrategy): void {
    const total = this.calculateTotal();
    console.log(`\nTotal: $${total}`);
    strategy.pay(total);
  }
}

// Usage
const cart = new ShoppingCart();
cart.addItem("Laptop", 1000);
cart.addItem("Mouse", 50);

// Pay with different strategies
cart.checkout(new CreditCardStrategy("1234567890123456"));
cart.checkout(new PayPalStrategy("user@example.com"));
cart.checkout(new CryptoStrategy("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"));
```

## Summary

- Encapsulates algorithms
- Makes algorithms interchangeable
- Eliminates conditional statements
- Follows Open/Closed Principle

---

**Next Steps:**

- Learn [Command Pattern](command.md)
- Learn [State Pattern](state.md)
