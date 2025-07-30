'use client';

import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Smile } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
  className?: string;
}

const EmojiPickerComponent: React.FC<EmojiPickerProps> = ({ 
  onEmojiClick, 
  className = '' 
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiClick(emojiData.emoji);
    setShowPicker(false);
  };

  // 处理鼠标进入事件
  const handleMouseEnter = () => {
    setIsHovering(true);
    // 清除之前的关闭定时器
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // 处理鼠标离开事件 - 延迟关闭
  const handleMouseLeave = () => {
    setIsHovering(false);
    // 设置延迟关闭，给用户更多时间操作
    closeTimeoutRef.current = setTimeout(() => {
      setShowPicker(false);
    }, 2000); // 2秒延迟
  };

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={`relative ${className}`} 
      ref={pickerRef} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="p-2 hover:bg-purple-200 rounded-lg transition-colors"
        type="button"
      >
        <Smile className="w-5 h-5 text-purple-500" />
      </button>
      
      {showPicker && (
        <div className="absolute bottom-full right-0 mb-2 z-50">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            searchPlaceholder="搜索表情..."
            width={350}
            height={400}
            skinTonesDisabled={true}
            searchDisabled={false}
            lazyLoadEmojis={true}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerComponent; 