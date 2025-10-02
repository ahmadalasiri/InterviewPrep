# Proxy Pattern

## Overview

Provides a placeholder or surrogate for another object to control access to it.

## TypeScript Implementation

```typescript
interface Image {
  display(): void;
}

class RealImage implements Image {
  constructor(private filename: string) {
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    console.log(`Loading image: ${this.filename}`);
  }

  display(): void {
    console.log(`Displaying image: ${this.filename}`);
  }
}

class ProxyImage implements Image {
  private realImage: RealImage | null = null;

  constructor(private filename: string) {}

  display(): void {
    if (!this.realImage) {
      this.realImage = new RealImage(this.filename); // Lazy loading
    }
    this.realImage.display();
  }
}

// Usage
const image = new ProxyImage("photo.jpg");
console.log("Image created, but not loaded yet\n");

image.display(); // Loads and displays
console.log();
image.display(); // Just displays (already loaded)
```

## Summary

- Controls access to objects
- Lazy initialization
- Access control, caching, logging
- Virtual proxy, protection proxy, remote proxy

---

**Next Steps:**

- Learn [Composite Pattern](composite.md)
- Review [Structural Patterns](../README.md)
