export const textToSpeech = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.85;
  speechSynthesis.speak(utterance);
};
