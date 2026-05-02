// Application guide step generator — parses application_process arrays into structured steps.
// Extracted from routes/schemeGuide.js to keep route handlers thin.

function generateStepTitle(stepText, index) {
  const lower = stepText.toLowerCase();

  if (lower.includes('register') || lower.includes('sign up')) return 'Registration';
  if (lower.includes('visit') && index === 0) return 'Visit Portal / Office';
  if (lower.includes('fill') || lower.includes('application')) return 'Fill Application';
  if (lower.includes('submit') || lower.includes('upload')) return 'Submit Documents';
  if (lower.includes('verif')) return 'Verification';
  if (lower.includes('evaluat') || lower.includes('review')) return 'Evaluation';
  if (lower.includes('approv') || lower.includes('sanction')) return 'Approval';
  if (lower.includes('disburs') || lower.includes('credit')) return 'Disbursement';
  if (lower.includes('select') || lower.includes('choose')) return 'Selection';
  if (lower.includes('counsell')) return 'Counselling';
  if (lower.includes('site visit') || lower.includes('due diligence')) return 'Due Diligence';
  if (lower.includes('connect') || lower.includes('bank')) return 'Bank Liaison';
  if (lower.includes('attend') || lower.includes('training')) return 'Training';
  if (lower.includes('appear') || lower.includes('exam')) return 'Examination';

  return `Step ${index + 1}`;
}

function getApplicationGuide(scheme) {
  const steps = [];
  const process = scheme.application_process || [];

  process.forEach((step, i) => {
    const stepObj = {
      stepNumber: i + 1,
      title: generateStepTitle(step, i),
      description: step,
      actionLink: null,
    };

    const urlMatch = step.match(
      /(?:visit\s+|at\s+|through\s+|via\s+)?((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?:\/[^\s,)]*)?)/i
    );

    if (urlMatch) {
      let url = urlMatch[1];
      if (!url.startsWith('http')) url = 'https://' + url;
      stepObj.actionLink = url;
    }

    steps.push(stepObj);
  });

  if (process.length > 0 && !process[process.length - 1].toLowerCase().includes('disburs')) {
    steps.push({
      stepNumber: process.length + 1,
      title: 'Track & Follow Up',
      description:
        'Monitor your application status through the respective portal. Keep copies of all submitted documents.',
      actionLink: scheme.website || null,
    });
  }

  return steps;
}

module.exports = { generateStepTitle, getApplicationGuide };
