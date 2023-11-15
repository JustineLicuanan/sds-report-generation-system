export default function TruncateWord({
  text,
  maxLength,
  fontSize,
}: {
  text: string;
  maxLength: number;
  fontSize: string;
}) {
  if (text.length <= maxLength) {
    return <span className={`${fontSize}`}>{text}</span>;
  } else {
    const truncatedText =
      text.slice(0, maxLength) + '...' + text.slice(text.length - 5, text.length);
    return <span className={`${fontSize}`}>{truncatedText}</span>;
  }
}
