async function sendViaBrevo({ to, subject, htmlContent }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || process.env.EMAIL_USER;

  if (!apiKey || !senderEmail) {
    throw new Error('Missing BREVO_API_KEY or SENDER_EMAIL in environment variables.');
  }

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
      htmlContent,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Brevo API failed with status ${response.status}`);
  }

  return data;
}

const sendOTPEmail = async (email, otp) => {
  return sendViaBrevo({
    to: email,
    subject: 'Verification OTP - Code-a-Nova Portal',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Welcome to Code-a-Nova!</h2>
        <p>Your 6-digit OTP for email verification is:</p>
        <h1 style="color: #4F46E5; letter-spacing: 4px;">${otp}</h1>
        <p>This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
    `,
  });
};

const sendConfirmationEmail = async (email, details) => {
  const membersList =
    details.teamMembers && details.teamMembers.length > 0
      ? details.teamMembers.map((m) => `<li>${m.memberName} (${m.memberEmail})</li>`).join('')
      : '<li>Solo Participant</li>';

  return sendViaBrevo({
    to: email,
    subject: 'Hackathon Registration Confirmed - Code-a-Nova',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Hackathon Registration Confirmed!</h2>
        <p>Dear <strong>${details.fullName}</strong>,</p>
        <p>Congratulations! Your registration for Code-a-Nova Hackathon has been successfully submitted.</p>
        <h3>Registration Details:</h3>
        <ul>
          <li><strong>Project Name:</strong> ${details.projectName}</li>
          <li><strong>Domain/Track:</strong> ${details.domainTrack}</li>
          <li><strong>College:</strong> ${details.collegeName}</li>
          <li><strong>Team Size:</strong> ${details.teamSize}</li>
        </ul>
        <h3>Team Members:</h3>
        <ul>${membersList}</ul>
        <p>Good luck with your project build!</p>
        <br/>
        <p>Best Regards,<br/><strong>Team Code-a-Nova</strong></p>
      </div>
    `,
  });
};

module.exports = { sendOTPEmail, sendConfirmationEmail };