# Adapter Pattern

## Overview

Allows incompatible interfaces to work together by wrapping one interface with another.

## TypeScript Implementation

```typescript
// Target interface (what client expects)
interface MediaPlayer {
  play(filename: string): void;
}

// Adaptee (incompatible interface)
class VLCPlayer {
  playVLC(filename: string): void {
    console.log(`Playing VLC file: ${filename}`);
  }
}

class MP4Player {
  playMP4(filename: string): void {
    console.log(`Playing MP4 file: ${filename}`);
  }
}

// Adapter
class MediaAdapter implements MediaPlayer {
  constructor(private adaptee: VLCPlayer | MP4Player) {}

  play(filename: string): void {
    if (this.adaptee instanceof VLCPlayer) {
      this.adaptee.playVLC(filename);
    } else if (this.adaptee instanceof MP4Player) {
      this.adaptee.playMP4(filename);
    }
  }
}

// Client
class AudioPlayer implements MediaPlayer {
  play(filename: string): void {
    const extension = filename.split(".").pop()?.toLowerCase();

    if (extension === "mp3") {
      console.log(`Playing MP3 file: ${filename}`);
    } else if (extension === "vlc" || extension === "mp4") {
      const adapter =
        extension === "vlc"
          ? new MediaAdapter(new VLCPlayer())
          : new MediaAdapter(new MP4Player());
      adapter.play(filename);
    } else {
      console.log(`Unsupported format: ${extension}`);
    }
  }
}

// Usage
const player = new AudioPlayer();
player.play("song.mp3");
player.play("movie.mp4");
player.play("video.vlc");
```

## Summary

- Converts one interface to another
- Enables incompatible classes to work together
- Promotes reusability of existing code

---

**Next Steps:**

- Learn [Decorator Pattern](decorator.md)
- Learn [Facade Pattern](facade.md)
