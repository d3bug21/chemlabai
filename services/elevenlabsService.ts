const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// Using a popular, versatile voice ID.
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; 

export const isElevenLabsConfigured = !!ELEVENLABS_API_KEY;

if (!isElevenLabsConfigured) {
  // We don't throw an error here, but the function below will.
  // This allows the app to run without the key if the TTS feature isn't used.
  console.warn("ELEVENLABS_API_KEY environment variable is not set. Text-to-speech will not work.");
}

export const textToSpeech = async (text: string): Promise<Blob> => {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ElevenLabs API key is not configured.");
  }
  
  // Clean up the text for better speech synthesis. 
  // Removes markdown bolding, list bullets, and section titles.
  const cleanedText = text
    .replace(/\*\*[^*]+\*\*/g, '') // Remove titles like **Reaction Name:**
    .replace(/^- /gm, '');         // Remove list bullets

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text: cleanedText,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`ElevenLabs API request failed: ${errorBody.detail?.message || response.statusText}`);
  }

  return response.blob();
};
