/**
 * Safely copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Try modern Clipboard API first
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback method for browsers that block Clipboard API
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      return successful;
    } catch (fallbackErr) {
      console.error('Failed to copy text:', fallbackErr);
      return false;
    }
  }
}
