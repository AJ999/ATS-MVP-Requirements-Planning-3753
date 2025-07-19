// Simulated email service for development
// In a real application, this would connect to a backend API or email service

/**
 * Sends an email to the specified recipient
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body (HTML format)
 * @param {object} options - Additional options (attachments, cc, etc.)
 * @returns {Promise} - Promise that resolves to a success message
 */
export const sendEmail = async (to, subject, body, options = {}) => {
  // In a real app, this would make an API call to send the email
  console.log(`Sending email to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  
  if (options.attachments) {
    console.log('Attachments:', options.attachments);
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return success
  return { success: true, message: 'Email sent successfully' };
};

/**
 * Generates an iCalendar (.ics) file content for calendar invitations
 * @param {object} event - Event details
 * @returns {string} - iCalendar formatted string
 */
export const generateCalendarInvite = (event) => {
  const {
    summary,
    description,
    location,
    startTime,
    endTime,
    organizer,
    attendees
  } = event;
  
  // Format dates for iCalendar
  const formatDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };
  
  // Create unique identifier
  const uid = `${Date.now()}@recruitpro.com`;
  
  // Build iCalendar content
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RecruitPro//Interview Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(new Date(startTime))}`,
    `DTEND:${formatDate(new Date(endTime))}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `ORGANIZER;CN=${organizer.name}:mailto:${organizer.email}`,
  ];
  
  // Add attendees
  if (attendees && attendees.length) {
    attendees.forEach(attendee => {
      icsContent.push(`ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=${attendee.name}:mailto:${attendee.email}`);
    });
  }
  
  // Close the event and calendar
  icsContent = icsContent.concat([
    'END:VEVENT',
    'END:VCALENDAR'
  ]);
  
  return icsContent.join('\r\n');
};

/**
 * Sends a calendar invitation email for an interview
 * @param {object} interviewDetails - Details of the interview
 * @param {object} candidate - Candidate information
 * @param {object} interviewer - Interviewer information
 * @returns {Promise} - Promise that resolves to a success message
 */
export const sendInterviewInvitation = async (interviewDetails, candidate, interviewer, job) => {
  const startTime = new Date(interviewDetails.scheduled_date);
  const endTime = new Date(startTime.getTime() + interviewDetails.duration * 60000);
  
  // Format times for display
  const formatTimeDisplay = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  // Create calendar event
  const event = {
    summary: `Interview: ${job.title} - ${candidate.first_name} ${candidate.last_name}`,
    description: `
      Interview for ${job.title} position.
      
      ${interviewDetails.notes ? `Notes: ${interviewDetails.notes}` : ''}
      
      Please be prepared 5 minutes before the scheduled time.
    `,
    location: interviewDetails.location || 'To be determined',
    startTime,
    endTime,
    organizer: {
      name: `${interviewer.first_name} ${interviewer.last_name}`,
      email: interviewer.email
    },
    attendees: [
      {
        name: `${candidate.first_name} ${candidate.last_name}`,
        email: candidate.email
      }
    ]
  };
  
  // Generate iCalendar content
  const icsContent = generateCalendarInvite(event);
  
  // Create email content
  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0284c7;">Interview Invitation</h2>
      <p>Dear ${candidate.first_name},</p>
      
      <p>We're pleased to invite you to an interview for the <strong>${job.title}</strong> position at our company.</p>
      
      <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Date and Time:</strong> ${formatTimeDisplay(startTime)}</p>
        <p style="margin: 5px 0;"><strong>Duration:</strong> ${interviewDetails.duration} minutes</p>
        <p style="margin: 5px 0;"><strong>Interview Type:</strong> ${interviewDetails.interview_type.replace('_', ' ')}</p>
        <p style="margin: 5px 0;"><strong>Location:</strong> ${interviewDetails.location || 'To be determined'}</p>
        <p style="margin: 5px 0;"><strong>Interviewer:</strong> ${interviewer.first_name} ${interviewer.last_name}</p>
      </div>
      
      ${interviewDetails.notes ? `<p><strong>Additional Notes:</strong> ${interviewDetails.notes}</p>` : ''}
      
      <p>Please confirm your attendance by accepting this calendar invitation. If you need to reschedule or have any questions, please reply to this email.</p>
      
      <p>We look forward to speaking with you!</p>
      
      <p>Best regards,<br>
      ${interviewer.first_name} ${interviewer.last_name}<br>
      Recruitment Team</p>
    </div>
  `;
  
  // Send the email with calendar attachment
  return sendEmail(
    candidate.email,
    `Interview Invitation: ${job.title}`,
    emailBody,
    {
      attachments: [
        {
          filename: 'interview.ics',
          content: icsContent
        }
      ]
    }
  );
};