// API utility for submitting a complaint
export async function submitComplaint(complaintData) {
  const response = await fetch('/api/complaint/file', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(complaintData),
  });
  if (!response.ok) {
    throw new Error('Failed to submit complaint');
  }
  return await response.json();
}
