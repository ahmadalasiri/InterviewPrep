# AI Services Used in DubbingHub ProcessVideoWorker

This document outlines the various AI services and tools integrated into the DubbingHub ProcessVideoWorker project, their purposes, and how they're utilized in our video dubbing workflow.

## Speech Recognition

### Deepgram

- **Purpose**: Automated Speech Recognition (ASR) for transcribing audio from videos
- **Usage**: Converts speech in videos to timestamped text transcriptions with word-level timings
- **Configuration**: Requires `DEEPGRAM_API_KEY` environment variable
- **File**: `internal/services/transcription.go`
- **API Endpoint**: `https://api.deepgram.com/v1/listen`
- **Features Used**:
  - Punctuation
  - Paragraphs
  - Multiple language support
  - Word-level timestamps

## Machine Translation

### DeepL

- **Purpose**: Neural machine translation of text content
- **Usage**: Translates video transcriptions from source language to target language
- **Configuration**: Requires `DEEPL_API_KEY` environment variable
- **File**: `internal/services/translation.go`
- **API Endpoint**: `https://api-free.deepl.com/v2/translate`
- **Features Used**:
  - High-quality neural machine translation
  - Support for multiple target languages
  - Sentence-level translation

## Text-to-Speech Synthesis

### Play.ht

- **Purpose**: Converts translated text into natural-sounding speech
- **Usage**: Creates voiced audio from translated sentences that match the original video timing
- **Configuration**: Requires `PLAY_HT_API_KEY` and `PLAY_HT_USER_ID` environment variables
- **File**: `internal/services/speech.go`
- **API Endpoint**: `https://api.play.ht/api/v2/tts/stream`
- **Features Used**:
  - Multiple voice options
  - Multiple language support
  - Speech rate adjustment (to match original timing)
  - High-quality neural voices

## Audio Separation

### Replicate (Demucs Model)

- **Purpose**: Separates vocals from background music in the original video
- **Usage**: Isolates speech audio from music/sound effects for better translation and dubbing
- **Configuration**: Requires `REPLICATE_API_TOKEN` environment variable
- **File**: `internal/services/audio.go`
- **API Endpoint**: `https://api.replicate.com/v1/predictions`
- **Model**: `cd128044253523c86abfd743dea680c88559ad975ccd72378c8433f067ab5d0a` (Demucs)
- **Features Used**:
  - Vocal isolation
  - Background music preservation
  - Multi-stem audio separation

## Media Processing Tools

### FFmpeg (Non-AI but integral to workflow)

- **Purpose**: Audio/video processing and manipulation
- **Usage**:
  - Extracting audio from videos
  - Combining audio tracks
  - Adjusting audio timing
  - Merging translated audio with video
- **File**: Multiple service files (`audio.go`, `video.go`)

### yt-dlp (Non-AI but integral to workflow)

- **Purpose**: Downloads videos from platforms like YouTube
- **Usage**: Retrieves source videos for processing
- **File**: `pkg/utils/utils.go`

## Workflow Integration

These AI services are orchestrated in a pipeline that:

1. Downloads source videos (`utils.DownloadFile`)
2. Transcribes audio to text (Deepgram)
3. Translates text to target language (DeepL)
4. Synthesizes speech from translated text (Play.ht)
5. Separates original audio (Replicate)
6. Combines new audio with original video (FFmpeg)

The entire process is managed by AWS SQS for message handling and AWS S3 for storage.

## Summary

DubbingHub ProcessVideoWorker combines multiple AI services to create an end-to-end video translation and dubbing pipeline:

| Service            | Type               | Purpose          | Key Features                                        |
| ------------------ | ------------------ | ---------------- | --------------------------------------------------- |
| Deepgram           | Speech-to-Text     | Transcription    | Word-level timing, multilingual support             |
| DeepL              | Neural Translation | Text translation | High-quality translations across multiple languages |
| Play.ht            | Text-to-Speech     | Voice synthesis  | Natural speech, timing adjustments, multiple voices |
| Replicate (Demucs) | Audio Separation   | Isolate speech   | Vocal & background separation                       |

The system handles the complete workflow from video acquisition to final dubbed video production, maintaining timing synchronization and audio quality throughout the process. This architecture allows for scalable, automated video translation with minimal human intervention while preserving the original video's audio characteristics.
