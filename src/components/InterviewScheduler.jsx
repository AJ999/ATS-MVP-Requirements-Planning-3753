```jsx
// Update the handleSubmit function in InterviewScheduler
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  setIsLoading(true);
  try {
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    const endTime = addMinutes(dateTime, parseInt(formData.duration));

    // Set the location/link based on the interview type and platform
    let locationValue = '';
    if (formData.interviewType === 'video') {
      if (formData.platform === 'zoom') {
        locationValue = 'Zoom (Link will be sent in calendar invitation)';
      } else if (formData.platform === 'teams') {
        locationValue = 'Microsoft Teams (Link will be sent in calendar invitation)';
      } else if (formData.platform === 'google') {
        locationValue = 'Google Meet (Link will be sent in calendar invitation)';
      } else {
        locationValue = formData.customLink;
      }
    } else if (formData.interviewType === 'in_person') {
      locationValue = formData.location;
    } else if (formData.interviewType === 'phone') {
      locationValue = 'Phone Interview';
    }

    const interviewData = {
      application_id: formData.application_id,
      interview_type: formData.interviewType,
      scheduled_date: dateTime.toISOString(),
      duration: parseInt(formData.duration),
      interviewer_id: formData.interviewer_id,
      location: locationValue,
      notes: formData.notes,
      send_invitation: formData.sendInvite,
      status: 'scheduled',
      company_id: user.company_id, // Add company_id
      interview_id: `interview_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await onSchedule(interviewData);
    onClose();
  } catch (error) {
    console.error('Error scheduling interview:', error);
    alert(`Failed to schedule interview: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};
```