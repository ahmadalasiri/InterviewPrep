# Composite Pattern

## Overview

Composes objects into tree structures to represent part-whole hierarchies. Lets clients treat individual objects and compositions uniformly.

## TypeScript Implementation

```typescript
interface FileSystemComponent {
  getName(): string;
  getSize(): number;
  display(indent: string): void;
}

class File implements FileSystemComponent {
  constructor(private name: string, private size: number) {}

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.size;
  }

  display(indent: string = ""): void {
    console.log(`${indent}📄 ${this.name} (${this.size}KB)`);
  }
}

class Directory implements FileSystemComponent {
  private children: FileSystemComponent[] = [];

  constructor(private name: string) {}

  add(component: FileSystemComponent): void {
    this.children.push(component);
  }

  remove(component: FileSystemComponent): void {
    const index = this.children.indexOf(component);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.children.reduce((sum, child) => sum + child.getSize(), 0);
  }

  display(indent: string = ""): void {
    console.log(`${indent}📁 ${this.name} (${this.getSize()}KB)`);
    this.children.forEach((child) => child.display(indent + "  "));
  }
}

// Usage
const root = new Directory("root");

const documents = new Directory("documents");
documents.add(new File("resume.pdf", 100));
documents.add(new File("coverletter.doc", 50));

const photos = new Directory("photos");
photos.add(new File("vacation.jpg", 200));
photos.add(new File("family.jpg", 150));

root.add(documents);
root.add(photos);
root.add(new File("readme.txt", 10));

root.display();
console.log(`\nTotal size: ${root.getSize()}KB`);
```

## Summary

- Treats individual and composite objects uniformly
- Simplifies client code
- Easy to add new component types
- Common in UI frameworks and file systems

---

**Next Steps:**

- Review [Structural Patterns](../README.md)
- Learn [Behavioral Patterns](../behavioral/)
