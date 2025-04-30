export function validateUrlInput(input: HTMLInputElement) {
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  const errorElement = input.nextElementSibling as HTMLElement;
  
  if (!input.value) {
    input.classList.add('border-red-500');
    errorElement.textContent = 'URL is required';
    return false;
  }
  
  if (!urlPattern.test(input.value)) {
    input.classList.add('border-red-500');
    errorElement.textContent = 'Please enter a valid URL';
    return false;
  }
  
  input.classList.remove('border-red-500');
  input.classList.add('border-green-500');
  errorElement.textContent = '';
  return true;
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
