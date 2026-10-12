export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function isValidResumeFile(file: File): { valid: boolean; error?: string } {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB

  const fileName = file.name.toLowerCase();
  const hasValidExt = allowedExtensions.some((ext) => fileName.endsWith(ext));

  if (!hasValidExt) {
    return { valid: false, error: 'Only PDF, DOC, and DOCX files are allowed.' };
  }

  if (file.size > maxSizeBytes) {
    return { valid: false, error: 'File size must not exceed 10MB.' };
  }

  return { valid: true };
}
