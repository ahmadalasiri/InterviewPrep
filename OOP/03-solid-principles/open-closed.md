# Open/Closed Principle (OCP)

## Overview

**"Software entities should be open for extension, but closed for modification."** - Bertrand Meyer

Classes should be designed so that new functionality can be added without changing existing code. This reduces the risk of breaking existing functionality.

## Key Concepts

- **Open for Extension**: Add new functionality
- **Closed for Modification**: Don't change existing code

## TypeScript Examples

### ❌ Bad: Violates OCP

```typescript
class PaymentProcessor {
  processPayment(type: string, amount: number): void {
    if (type === "credit") {
      console.log(`Processing credit card: $${amount}`);
    } else if (type === "paypal") {
      console.log(`Processing PayPal: $${amount}`);
    } else if (type === "crypto") {
      // Need to modify class to add new payment type!
      console.log(`Processing Crypto: $${amount}`);
    }
  }
}
```

### ✅ Good: Follows OCP

```typescript
interface PaymentMethod {
  process(amount: number): void;
}

class CreditCardPayment implements PaymentMethod {
  process(amount: number): void {
    console.log(`Processing credit card: $${amount}`);
  }
}

class PayPalPayment implements PaymentMethod {
  process(amount: number): void {
    console.log(`Processing PayPal: $${amount}`);
  }
}

// Easy to extend - no modification needed!
class CryptoPayment implements PaymentMethod {
  process(amount: number): void {
    console.log(`Processing Crypto: $${amount}`);
  }
}

class PaymentProcessor {
  processPayment(method: PaymentMethod, amount: number): void {
    method.process(amount);
  }
}
```

## Real-World Example: Discount System

```typescript
// Discount strategy interface
interface DiscountStrategy {
  calculate(price: number): number;
}

class NoDiscount implements DiscountStrategy {
  calculate(price: number): number {
    return price;
  }
}

class PercentageDiscount implements DiscountStrategy {
  constructor(private percent: number) {}

  calculate(price: number): number {
    return price * (1 - this.percent / 100);
  }
}

class FixedAmountDiscount implements DiscountStrategy {
  constructor(private amount: number) {}

  calculate(price: number): number {
    return Math.max(0, price - this.amount);
  }
}

// New discount type - no modification to existing code!
class BuyOneGetOneDiscount implements DiscountStrategy {
  calculate(price: number): number {
    return price / 2;
  }
}

class PriceCalculator {
  calculate(price: number, discount: DiscountStrategy): number {
    return discount.calculate(price);
  }
}

const calc = new PriceCalculator();
console.log(calc.calculate(100, new PercentageDiscount(20))); // 80
console.log(calc.calculate(100, new FixedAmountDiscount(15))); // 85
console.log(calc.calculate(100, new BuyOneGetOneDiscount())); // 50
```

## Summary

- Extend behavior through new classes, not modifying existing ones
- Use interfaces and abstract classes
- Strategy pattern is a common OCP implementation
- Reduces bugs by not touching working code

---

**Next Steps:**

- Learn [Liskov Substitution Principle](liskov-substitution.md)
- Study [Strategy Pattern](../04-design-patterns/behavioral/strategy.md)
