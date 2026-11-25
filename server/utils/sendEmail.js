async function sendEmail({ to, subject, html, text }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || process.env.EMAIL_USER;

  if (!apiKey || !senderEmail) {
    const err = new Error('Missing BREVO_API_KEY or SENDER_EMAIL in environment variables.');
    console.error('Confirmation email error:', err.message);
    throw err;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Code-a-Nova',
          email: senderEmail,
        },
        to: Array.isArray(to) ? to.map((email) => ({ email })) : [{ email: to }],
        subject,
        htmlContent: html || `<p>${text || ''}</p>`,
        ...(text ? { textContent: text } : {}),
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const apiErr = new Error(data.message || `Brevo API failed with status ${response.status}`);
      console.error('Confirmation email error:', apiErr.message);
      throw apiErr;
    }

    return data;
  } catch (err) {
    console.error('Confirmation email error:', err.message || err);
    throw err;
  }
}

module.exports = sendEmail;