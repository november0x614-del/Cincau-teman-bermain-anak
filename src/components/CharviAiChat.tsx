import React, { useState, useEffect, useRef } from 'react';
import { CharviMascot } from './CharviMascot';
import { CharviEmotion, MascotTheme } from '../types';
import { getThemeStyle } from '../utils/themeColors';
import { Mic, MicOff, Send, X, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface CharviAiChatProps {
  mascotTheme?: MascotTheme;
  onClose: () => void;
  notes?: any[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'charvi';
  text: string;
  emotion?: CharviEmotion;
}

export const CharviAiChat: React.FC<CharviAiChatProps> = ({
  mascotTheme = 'cyan-jelly',
  onClose,
}) => {
  const themeStyle = getThemeStyle(mascotTheme);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'charvi',
      text: 'Halo sahabat kecilku! Aku Cincau! Teman belajarmu. Ada pertanyaan atau hal seru yang ingin kita obrolkan hari ini?',
      emotion: 'happy',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState<CharviEmotion>('happy');

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'id-ID';

      recognition.onstart = () => {
        setIsListening(true);
        setCurrentEmotion('listening');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setCurrentEmotion('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Browser Anda tidak mendukung Speech Recognition langsung. Silakan ketik pesan Anda.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Speech recognition error:', err);
      }
    }
  };

  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.2;
    utterance.lang = 'id-ID';

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentEmotion('idle');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setCurrentEmotion('thinking');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'Aku senang mendengarnya! Yuk terus eksplorasi!';
      const emotion = (data.emotion as CharviEmotion) || 'happy';

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'charvi',
        text: replyText,
        emotion,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setCurrentEmotion(emotion);
      speakText(replyText);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'charvi',
        text: 'Wah seru sekali! Yuk kita selesaikan misi belajar dan kumpulkan makanan Cincau!',
        emotion: 'encouraging',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setCurrentEmotion('happy');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white border border-neutral-200 rounded-t-3xl sm:rounded-3xl w-full max-w-md h-[88vh] sm:h-[620px] flex flex-col overflow-hidden shadow-2xl text-neutral-900 animate-in slide-in-from-bottom duration-300">
        {/* Top Mascot Stage */}
        <div
          className={`relative px-6 pt-5 pb-3 border-b border-neutral-200/80 flex items-center justify-between bg-gradient-to-b ${themeStyle.gradientBg}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 relative flex items-center justify-center">
              <CharviMascot
                variant="compact-header"
                theme={mascotTheme}
                emotion={currentEmotion}
                isTalking={isSpeaking}
                isListening={isListening}
                className="w-14 h-14"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-neutral-900 text-base">Cincau AI</span>
                <Sparkles
                  className={`w-4 h-4 ${themeStyle.textColor}`}
                />
              </div>
              <span
                className={`text-xs font-semibold ${themeStyle.textColor}`}
              >
                {isListening
                  ? 'Mendengarkan suaramu...'
                  : isSpeaking
                  ? 'Sedang berbicara...'
                  : isLoading
                  ? 'Sedang berpikir...'
                  : 'Siap diajak ngobrol'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setVoiceEnabled(!voiceEnabled);
                if (voiceEnabled && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }
              }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                voiceEnabled ? 'text-[#ff5500] hover:bg-neutral-100' : 'text-neutral-400 hover:bg-neutral-100'
              }`}
              title={voiceEnabled ? 'Suara aktif' : 'Suara bisu'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#ff5500] text-white font-medium rounded-br-2xs shadow-2xs'
                    : 'bg-white text-neutral-800 rounded-bl-2xs border border-neutral-200/90 shadow-2xs'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'charvi' && (
                <div className="flex items-center gap-2 mt-1 px-1">
                  <button
                    onClick={() => speakText(msg.text)}
                    className="text-[11px] text-neutral-500 hover:text-[#ff5500] flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Dengarkan</span>
                  </button>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-neutral-500 text-xs pl-2">
              <div className="w-2 h-2 rounded-full bg-[#ff5500] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#ff5500] animate-bounce [animation-delay:0.15s]" />
              <div className="w-2 h-2 rounded-full bg-[#ff5500] animate-bounce [animation-delay:0.3s]" />
              <span className="ml-1 text-neutral-500">Cincau sedang memikirkan kuis seru...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-neutral-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-full transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                  : 'bg-neutral-100 text-neutral-600 hover:text-[#ff5500] hover:bg-neutral-200'
              }`}
              title={isListening ? 'Berhenti bicara' : 'Bicara dengan mikrofon'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? 'Katakan sesuatu pada Cincau...' : 'Tanya Cincau tentang materi belajar...'}
              className="flex-1 bg-neutral-100 border border-neutral-200 rounded-full px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-[#ff5500]"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-3 rounded-full bg-[#ff5500] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#ff6518] transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
