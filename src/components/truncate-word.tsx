export default function TruncateWord({ text, maxLength }: { text: string; maxLength: number }) {
  if (text.length <= maxLength) {
    return <span>{text}</span>;
  } else {
    const truncatedText =
      text.slice(0, maxLength) + '...' + text.slice(text.length - 5, text.length);
    return <span>{truncatedText}</span>;
  }
}
