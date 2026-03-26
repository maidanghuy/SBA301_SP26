/**
 * Utility to parse backend error format: "{field1=error1, field2=error2}"
 * @param errorString The error string from backend
 * @returns A record of field names and error messages
 */
export const parseBackendErrors = (errorString: string): Record<string, string> => {
  if (!errorString || typeof errorString !== 'string') return {};
  
  // Remove the surrounding braces
  const content = errorString.trim().replace(/^\{|\}$/g, '');
  if (!content) return {};

  const errors: Record<string, string> = {};
  
  // Split by comma followed by space (assuming standard format)
  const pairs = content.split(/,\s*/);
  
  pairs.forEach(pair => {
    const [key, ...valueParts] = pair.split('=');
    if (key) {
      errors[key.trim()] = valueParts.join('=').trim();
    }
  });

  return errors;
};
