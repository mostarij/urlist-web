// Submit form data using fetch API
export async function submitForm(
  form: HTMLFormElement,
  onSuccess?: () => void,
  onError?: (error: string) => void
): Promise<void> {
  try {
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Form submission failed');
    }

    onSuccess?.();
  } catch (error) {
    onError?.(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
}

// Show toast notification
export function showToast(
  message: string,
  type: 'success' | 'error' | 'info' = 'info',
  duration = 3000
): void {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-4 right-4 p-4 rounded-lg text-white shadow-lg transition-opacity duration-300';
  toast.classList.add(type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500');
  toast.textContent = message;
  
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
