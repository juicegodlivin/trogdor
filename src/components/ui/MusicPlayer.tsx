'use client';

import { useState, useRef, useEffect } from 'react';
import { MedievalIcon } from './MedievalIcon';

interface MusicPlayerProps {
  audioSrc: string;
  title?: string;
}

export function MusicPlayer({ audioSrc, title = 'Trogdor Theme' }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => setIsPlaying(false);

    // Add multiple event listeners to catch duration loading
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadeddata', updateDuration);
    audio.addEventListener('canplay', updateDuration);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);

    // Try to load the audio
    audio.load();

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadeddata', updateDuration);
      audio.removeEventListener('canplay', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      <div className="fixed bottom-4 right-4 z-50">
        {/* Compact button when collapsed */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="btn-sketch bg-white shadow-sketch-lg p-3 flex items-center gap-2 hover:bg-sketch"
            aria-label="Open music player"
          >
            <MedievalIcon name="trumpet" size={24} />
            {isPlaying && (
              <span className="flex gap-0.5">
                <span className="w-1 h-4 bg-accent-red animate-burn"></span>
                <span className="w-1 h-4 bg-accent-yellow animate-burn delay-75"></span>
                <span className="w-1 h-4 bg-accent-red animate-burn delay-150"></span>
              </span>
            )}
          </button>
        )}

        {/* Expanded player */}
        {isExpanded && (
          <div className="bg-white border-sketch border-2 border-pencil rounded-sketch shadow-sketch-lg p-4 w-80">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MedievalIcon name="trumpet" size={24} />
                <span className="font-hand text-lg text-pencil-dark">
                  {title}
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-pencil hover:text-pencil-dark transition-colors p-1"
                aria-label="Minimize player"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mb-3">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="btn-sketch bg-accent-green hover:bg-accent-green/90 text-white p-3 flex-shrink-0"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Time Display */}
              <div className="flex-1 text-sm font-mono text-pencil">
                <div className="flex justify-between mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                
                {/* Seek Slider */}
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-3 bg-sketch rounded-full appearance-none cursor-pointer
                    hover:h-3.5 transition-all
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-accent-red
                    [&::-webkit-slider-thumb]:cursor-grab
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-pencil
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-webkit-slider-thumb]:active:cursor-grabbing
                    [&::-webkit-slider-thumb]:active:scale-95
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-moz-range-thumb]:w-4
                    [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-accent-red
                    [&::-moz-range-thumb]:cursor-grab
                    [&::-moz-range-thumb]:border-2
                    [&::-moz-range-thumb]:border-pencil
                    [&::-moz-range-thumb]:shadow-md
                    [&::-moz-range-thumb]:hover:scale-110
                    [&::-moz-range-thumb]:active:cursor-grabbing
                    [&::-moz-range-thumb]:active:scale-95
                    [&::-moz-range-thumb]:transition-transform
                    [&::-webkit-slider-runnable-track]:rounded-full
                    [&::-webkit-slider-runnable-track]:cursor-pointer
                    [&::-moz-range-track]:rounded-full
                    [&::-moz-range-track]:cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #EF4444 0%, #EF4444 ${(currentTime / duration) * 100}%, #F5F5F5 ${(currentTime / duration) * 100}%, #F5F5F5 100%)`
                  }}
                />
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <svg 
                className="w-4 h-4 text-pencil flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                {volume === 0 ? (
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                ) : volume < 0.5 ? (
                  <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                ) : (
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                )}
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-sketch rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-accent-yellow
                  [&::-webkit-slider-thumb]:cursor-grab
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-pencil
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-webkit-slider-thumb]:active:cursor-grabbing
                  [&::-webkit-slider-thumb]:active:scale-95
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-runnable-track]:rounded-full
                  [&::-webkit-slider-runnable-track]:cursor-pointer
                  [&::-moz-range-thumb]:w-3
                  [&::-moz-range-thumb]:h-3
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-accent-yellow
                  [&::-moz-range-thumb]:cursor-grab
                  [&::-moz-range-thumb]:border-2
                  [&::-moz-range-thumb]:border-pencil
                  [&::-moz-range-thumb]:shadow-md
                  [&::-moz-range-thumb]:hover:scale-110
                  [&::-moz-range-thumb]:active:cursor-grabbing
                  [&::-moz-range-thumb]:active:scale-95
                  [&::-moz-range-thumb]:transition-transform
                  [&::-moz-range-track]:rounded-full
                  [&::-moz-range-track]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #F59E0B 0%, #F59E0B ${volume * 100}%, #F5F5F5 ${volume * 100}%, #F5F5F5 100%)`
                }}
              />
              <span className="text-xs font-mono text-pencil w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

