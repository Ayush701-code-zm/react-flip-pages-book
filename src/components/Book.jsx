import React, { useState, useEffect, useRef } from 'react'
import HTMLFlipBook from "react-pageflip";

function Book() {
  const flipBookRef = useRef(null);
  const audioRef = useRef(null);

  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);
  const lastPlayTimeRef = useRef(0);

  // Initialize Web Audio API for instant playback
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        
        // Load and decode audio file
        const response = await fetch('/sounds/book_page-45210.mp3');
        const arrayBuffer = await response.arrayBuffer();
        audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
        
        console.log('Audio buffer loaded successfully');
      } catch (error) {
        console.log('Failed to load audio buffer:', error);
      }
    };
    
    initAudio();

    // Audio is now ready for use
  }, []);

  // Play page flip sound with Web Audio API (instant playback)
  const playPageFlipSound = () => {
    // Minimal debounce - prevent duplicate sounds within 100ms only
    const now = Date.now();
    if (now - lastPlayTimeRef.current < 100) {
      return;
    }
    lastPlayTimeRef.current = now;

    console.log('Playing page flip sound...'); // Debug log
    
    // Use setTimeout with negative delay concept - schedule immediately
    setTimeout(() => {
      try {
        if (audioContextRef.current && audioBufferRef.current) {
          const source = audioContextRef.current.createBufferSource();
          const gainNode = audioContextRef.current.createGain();
          
          source.buffer = audioBufferRef.current;
          gainNode.gain.value = 0.7;
          
          source.connect(gainNode);
          gainNode.connect(audioContextRef.current.destination);
          
          source.start(0);
          console.log('Audio played successfully with Web Audio API');
        } else {
          console.log('Audio buffer not ready, using fallback');
          playSyntheticPageFlipSound();
        }
      } catch (error) {
        console.log('Web Audio API failed:', error);
        playSyntheticPageFlipSound();
      }
    }, 0); // Execute immediately but asynchronously
  };

  // Fallback synthetic sound (in case audio file is missing)
  const playSyntheticPageFlipSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create multiple oscillators to simulate paper rustling
    const createNoise = () => {
      const bufferSize = audioContext.sampleRate * 0.2; // 0.2 seconds
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // White noise
      }
      
      const whiteNoise = audioContext.createBufferSource();
      whiteNoise.buffer = buffer;
      
      const filter = audioContext.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2000;
      filter.Q.value = 0.5;
      
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      whiteNoise.start(audioContext.currentTime);
      whiteNoise.stop(audioContext.currentTime + 0.2);
    };
    
    // Add a subtle low-frequency thump for the page impact
    const createThump = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(30, audioContext.currentTime + 0.05);
      
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    };
    
    // Play both sounds together for realistic page flip
    createNoise();
    createThump();
  };

  const bookChapters = [
    {
      id: "01",
      title: "The Beginning",
      chapter: "Chapter 1",
      pageHeader: "PAGE HEADER - 1",
      description: "In a small village nestled between rolling hills and ancient forests, a young adventurer named Alex discovered an old, mysterious book hidden in the attic of their grandmother's house. The leather-bound tome seemed to glow with an inner light, and strange symbols danced across its pages. As Alex carefully opened the book, the room filled with a warm, golden light that seemed to come from nowhere and everywhere at once."
    },
    {
      id: "02", 
      title: "The Journey Begins",
      chapter: "Chapter 2",
      pageHeader: "PAGE HEADER - 2",
      description: "As Alex opened the book, the room filled with swirling colors and the sound of distant music. The pages revealed a map of a magical realm, with floating islands, crystal caves, and enchanted forests. A voice whispered, 'The adventure awaits those brave enough to seek it.' The map was unlike anything Alex had ever seen - it showed continents that floated in the sky, connected by bridges of pure light."
    },
    {
      id: "03",
      title: "The Forest Guardian",
      chapter: "Chapter 3",
      pageHeader: "PAGE HEADER - 3", 
      description: "Deep in the Whispering Woods, Alex encountered the Forest Guardian, an ancient being made of living wood and starlight. 'You have been chosen,' it spoke in a voice like rustling leaves. 'The realm needs a hero to restore the balance between light and shadow.' The Forest Guardian was a magnificent sight - its body was formed from the trunk of the oldest tree in the forest."
    },
    {
      id: "04",
      title: "The Crystal Caves",
      chapter: "Chapter 4",
      pageHeader: "PAGE HEADER - 4",
      description: "Beneath the mountains lay the Crystal Caves, where gems sang with the voices of long-lost souls. Here, Alex learned the ancient art of crystal magic, discovering that each gem held a different power - healing, protection, or the ability to see through illusions. The caves were a wonder to behold, with walls that sparkled like a thousand stars."
    },
    {
      id: "05",
      title: "The Floating Islands",
      chapter: "Chapter 5",
      pageHeader: "PAGE HEADER - 5",
      description: "High above the clouds, Alex discovered the Floating Islands, where gravity worked differently and the sky was filled with flying creatures made of pure energy. The islands held the key to understanding the realm's greatest mystery - the source of all magic. The Floating Islands were a breathtaking sight, suspended in the sky like jewels in a crown."
    },
    {
      id: "06",
      title: "The Final Challenge",
      chapter: "Chapter 6",  
      pageHeader: "PAGE HEADER - 6",
      description: "At the realm's heart stood the Tower of Trials, where Alex faced their greatest challenge. The tower tested not just strength and magic, but wisdom, courage, and compassion. Only by proving worthy of all these virtues could the realm be saved. The Tower of Trials was a magnificent structure that seemed to reach beyond the clouds."
    },
    {
      id: "07",
      title: "The New Guardian",
      chapter: "Chapter 7",
      pageHeader: "PAGE HEADER - 7",
      description: "Having proven themselves worthy, Alex was chosen as the new Guardian of the Realm. With the ancient book as their guide, they would protect the magical world and help others discover their own adventures. The story was just beginning. The ceremony of becoming the new Guardian was a moment of pure magic."
    }
  ];

  return (
    <HTMLFlipBook 
      ref={flipBookRef}
      width={420} 
      height={580}
      maxShadowOpacity={0.5}
      drawShadow={true}
      showCover={true}
      size='fixed'
       onFlip={(e) => {
         // Play sound when page flip starts
         console.log('onFlip triggered - page:', e.data);
         playPageFlipSound();
       }}
       onFlipInit={(e) => {
         // Play sound immediately when flip initializes (earliest possible)
         console.log('onFlipInit triggered');
         playPageFlipSound();
       }}
    >
      <div className="page" style={{ background: 'transparent' }}>
        <div className="page-content cover">
          <div className="book-title">
            <h1>The Realm of Magic</h1>
            <h2>An Adventure Story</h2>
            <div className="book-author">by John Doe</div>
          </div>
        </div>
      </div>

      {bookChapters.map((chapter) => (
        <div className="page" key={chapter.id}>
          <div className="page-content">
            <div className="page-header">
              <span className="header-title">{chapter.title}</span>
              <span className="header-chapter">{chapter.chapter}</span>
            </div>
            <div className="chapter-container">
              <img 
                src={`https://picsum.photos/300/200?random=${chapter.id}`} 
                alt={chapter.title}
                className="chapter-image"
              />
              <div className="chapter-info">
                <p className="chapter-description">{chapter.description}</p>
              </div>
            </div>
            <div className="page-number">{parseInt(chapter.id) + 1}</div>
          </div>
        </div>
      ))}

      <div className="page">
        <div className="page-content ending">
          <div className="ending-content">
            <h1 className="ending-title">The End</h1>
            <div className="ending-text">
              <p>And so, Alex's journey came to a close, but their adventures were far from over. As the new Guardian of the Realm, they would continue to protect the magical world and guide future adventurers on their own quests.</p>
              <p>The ancient book had found its rightful keeper, and the realm would flourish under Alex's watchful care. The story of magic, friendship, and courage would live on forever.</p>
            </div>
            <div className="ending-signature">
              <p>Thank you for reading</p>
              <p className="author-name">John Doe</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page" style={{ background: 'transparent' }}>
        <div className="page-content back-cover">
          <div className="back-cover-content">
            <h2>The Realm of Magic</h2>
            <p>An Adventure Story</p>
            <p>by John Doe</p>
          </div>
        </div>
      </div>
    </HTMLFlipBook>
  );
}

export default Book