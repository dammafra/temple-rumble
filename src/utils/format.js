export default function formatTimer(timer) {
  const minutes = Math.floor(timer / 60)
  const secs = timer % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
