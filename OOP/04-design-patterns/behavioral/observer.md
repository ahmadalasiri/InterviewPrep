# Observer Pattern

## Overview

Defines a one-to-many dependency between objects where when one object changes state, all its dependents are notified automatically.

## TypeScript Implementation

```typescript
interface Observer {
  update(data: any): void;
}

interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

class NewsAgency implements Subject {
  private observers: Observer[] = [];
  private news: string = "";

  attach(observer: Observer): void {
    this.observers.push(observer);
    console.log("Observer attached");
  }

  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
      console.log("Observer detached");
    }
  }

  notify(): void {
    console.log("\nNotifying all observers...");
    this.observers.forEach((observer) => observer.update(this.news));
  }

  setNews(news: string): void {
    console.log(`\nBreaking News: ${news}`);
    this.news = news;
    this.notify();
  }
}

class NewsChannel implements Observer {
  constructor(private name: string) {}

  update(news: string): void {
    console.log(`${this.name} received news: ${news}`);
  }
}

// Usage
const agency = new NewsAgency();

const cnn = new NewsChannel("CNN");
const bbc = new NewsChannel("BBC");
const fox = new NewsChannel("Fox News");

agency.attach(cnn);
agency.attach(bbc);
agency.attach(fox);

agency.setNews("Major event happened!");
agency.detach(fox);
agency.setNews("Another update!");
```

## Summary

- Loose coupling between subject and observers
- Dynamic relationships
- Broadcast communication
- Event-driven architectures

---

**Next Steps:**

- Learn [Strategy Pattern](strategy.md)
- Learn [Command Pattern](command.md)
