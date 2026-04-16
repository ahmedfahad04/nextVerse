# Audio API Integration - Implementation Guide

## Overview

This document describes the audio recitation feature integrated into the nextVerse application using the Quran.com API.

## Features Implemented

### 1. **Audio Fetching**
- Fetches audio recitations from Quran.com API
- Supports 12+ different reciters
- Automatically constructs audio URLs for fallback scenarios
- Error handling with graceful degradation

### 2. **Audio Player Component**
- Full-featured HTML5 audio player
- Play/pause controls
- Progress bar with seek functionality
- Time display (current/total)
- Volume control
- Loading indicators
- Error messages

### 3. **Reciter Selection**
- Dropdown menu to switch between reciters
- Dynamically loads available reciters
- Automatically refetches audio when reciter changes
- Default reciter: Al-Afasy (الشيخ مشاري بن راشد العفاسي)

### 4. **Settings Integration**
- Toggle audio player visibility in settings
- Remember user preferences

## Architecture

### File Structure

```
src/
├── types/
│   └── quran.ts              # Audio-related TypeScript types
├── lib/
│   └── quran-api.ts          # Audio API functions
│   └── __tests__/
│       └── audio-api.test.ts # Audio API tests
├── components/
│   └── AudioPlayer.tsx       # Audio player component
└── app/
    └── page.tsx              # Main app with audio integration
```

### API Functions

#### `getReciters(): Promise<Reciter[]>`
Fetches all available reciters from Quran.com API.

**Example:**
```typescript
const reciters = await getReciters();
// Returns: [
//   { id: 4, englishName: "Al-Afasy", ... },
//   { id: 1, englishName: "Abdullah al-Juhany", ... },
//   ...
// ]
```

#### `getVerseAudioUrl(surah: number, ayah: number, reciterId: number = 4): Promise<string | null>`
Constructs the audio URL for a specific verse.

**Example:**
```typescript
const url = await getVerseAudioUrl(2, 255, 4);
// Returns: "https://audio.quran.com/alafasy/002_255.mp3"
```

#### `getVerseRecitationByKey(verseKey: string, reciterId: number = 4): Promise<VerseRecitation | null>`
Fetches verse recitation data including the audio URL.

**Example:**
```typescript
const audio = await getVerseRecitationByKey("2:255", 4);
// Returns: {
//   verseKey: "2:255",
//   url: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6229.mp3",
//   format: "mp3",
//   duration: 25
// }
```

#### `getChapterRecitation(chapterId: number, reciterId: number = 4): Promise<ChapterRecitation | null>`
Fetches audio for an entire chapter.

#### `getVerseRecitationsByChapter(chapterId: number, reciterId: number = 4): Promise<VerseRecitationResponse>`
Fetches verse-by-verse audio for a chapter with pagination.

## Supported Reciters

The implementation supports the following reciters with their respective IDs:

| ID | Name | English Name |
|:--:|:-----|:-------------|
| 1 | عبدالباسط عبدالصمد | Abdul Basit Abdul Samad (Murattal) |
| 2 | عبدالباسط عبدالصمد | Abdul Basit Abdul Samad (Mujawwad) |
| 3 | عبدالواود الحنيف | Abdul Wadud Hanif |
| **4** | **مشاري بن راشد العفاسي** | **Al-Afasy (Default)** |
| 5 | الأيدروس | Al-Aydarous |
| 6 | الحصري | Al-Husary (Mujawwad) |
| 7 | المنشاوي | Al-Minshawi (Murattal) |

## Audio URL Format

Audio files are hosted on Quran.com and follow this URL pattern:

```
https://audio.quran.com/{reciter_name}/{surah_padded}_{ayah_padded}.mp3
```

Example:
```
https://audio.quran.com/alafasy/002_255.mp3
```

## Usage in Components

### AudioPlayer Component

```tsx
import AudioPlayer from "@/components/AudioPlayer";

export default function MyComponent() {
  return (
    <AudioPlayer
      audioUrl="https://audio.quran.com/alafasy/002_255.mp3"
      verseKey="2:255"
      surah={2}
      ayah={255}
      duration={25}
      onLoadingChange={(loading) => console.log("Loading:", loading)}
    />
  );
}
```

### Using Audio API

```tsx
import { getVerseRecitationByKey, getReciters } from "@/lib/quran-api";

export default function MyComponent() {
  const [audio, setAudio] = useState(null);
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(4);

  useEffect(() => {
    // Fetch reciters
    getReciters().then(setReciters);
  }, []);

  useEffect(() => {
    // Fetch audio when verse or reciter changes
    const fetchAudio = async () => {
      const result = await getVerseRecitationByKey("2:255", selectedReciter);
      setAudio(result);
    };
    
    fetchAudio();
  }, [selectedReciter]);

  return (
    <div>
      <select value={selectedReciter} onChange={(e) => setSelectedReciter(Number(e.target.value))}>
        {reciters.map((reciter) => (
          <option key={reciter.id} value={reciter.id}>
            {reciter.englishName}
          </option>
        ))}
      </select>
      
      {audio && (
        <AudioPlayer
          audioUrl={audio.url}
          verseKey="2:255"
          surah={2}
          ayah={255}
          duration={audio.duration}
        />
      )}
    </div>
  );
}
```

## Features of AudioPlayer Component

### Props

| Prop | Type | Required | Description |
|:-----|:-----|:--------:|:-----------|
| `audioUrl` | `string` | ✓ | URL of the audio file |
| `verseKey` | `string` | ✓ | Verse key (e.g., "2:255") |
| `surah` | `number` | ✓ | Surah number |
| `ayah` | `number` | ✓ | Ayah number |
| `duration` | `number` | ✗ | Audio duration in seconds |
| `onLoadingChange` | `(loading: boolean) => void` | ✗ | Callback when loading state changes |

### Controls

1. **Play/Pause Button**: Toggle audio playback
2. **Progress Bar**: Click to seek to a specific time
3. **Time Display**: Shows current time and total duration
4. **Volume Slider**: Adjust playback volume (0-100%)
5. **Status Indicator**: Shows loading/playing status

### Styling

The player is styled with:
- Tailwind CSS for responsive design
- Emerald color scheme matching the app theme
- Smooth transitions and hover effects
- Mobile-friendly layout

## Error Handling

The implementation includes comprehensive error handling:

1. **Network Errors**: Falls back to constructing URL directly
2. **API Errors**: Returns null and displays error message
3. **Audio Loading Errors**: Shows user-friendly error message
4. **Missing Reciters**: Returns default reciter (Al-Afasy)

## Performance Considerations

1. **Lazy Loading**: Audio is loaded only when needed
2. **Caching**: Browser caches audio files
3. **Async Operations**: API calls don't block UI
4. **Efficient Rendering**: Component only re-renders when audio URL changes

## Testing

### Running Tests

Execute the test function in browser console:

```javascript
testAudioAPI().then(console.log);
```

### Test Coverage

- Audio URL construction for various verses
- Reciter loading
- Verse recitation fetching
- Multiple reciter support

## Troubleshooting

### Audio Not Playing

1. Check browser console for error messages
2. Verify internet connection for external audio URLs
3. Try switching to a different reciter
4. Clear browser cache and reload

### Missing Reciters

If reciters don't load:
1. Check API endpoint availability
2. Verify network connection
3. App will use default reciter as fallback

### Slow Audio Loading

1. Check network speed
2. Try refreshing the page
3. Clear browser cache
4. Try a different reciter with potentially smaller files

## Browser Compatibility

- **Chrome/Chromium**: ✓ Full support
- **Firefox**: ✓ Full support
- **Safari**: ✓ Full support
- **Edge**: ✓ Full support
- **Mobile Browsers**: ✓ Full support with volume control on unsupported devices

## Future Enhancements

- [ ] Playlist support (all verses in a chapter)
- [ ] Bookmarks for favorite verses with audio
- [ ] Offline audio storage (Service Worker)
- [ ] Audio speed control
- [ ] Verse-by-verse highlighting with audio
- [ ] Share audio link feature
- [ ] User preferences for reciter and quality

## Dependencies

- React 19.2.4
- Next.js 16.2.3
- Tailwind CSS 4
- Native HTML5 Audio API

## API References

- **Quran.com API**: https://quran.com/api
- **Audio CDN**: https://audio.quran.com

## License

This implementation follows the same license as the nextVerse project.

## Support

For issues or questions regarding the audio implementation, please refer to:
- Quran.com API Documentation
- Tailwind CSS Documentation
- React Documentation
