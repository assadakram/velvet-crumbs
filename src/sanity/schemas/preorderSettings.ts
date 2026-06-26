/**
 * Sanity schema for Pre-Order Settings.
 * Sara uses this to pause/resume pre-orders without touching code.
 *
 * Fields:
 *  - isPaused      : toggle to pause all orders
 *  - resumeAt      : the exact datetime when orders auto-resume (date + time picker)
 *  - pausedMessage : optional custom message shown to customers (EN)
 *  - pausedMessageFi : optional custom message shown to customers (FI)
 */
export const preorderSettings = {
  name: 'preorderSettings',
  title: 'Pre-Order Settings',
  type: 'document',
  // Once the first document is created, uncomment the line below to hide the '+' button
  // __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'isPaused',
      title: 'Pause Pre-Orders?',
      type: 'boolean',
      description:
        'Toggle ON to immediately pause all orders and show the paused banner. Toggle OFF to accept orders normally.',
      initialValue: false,
    },
    {
      name: 'resumeDate',
      title: 'Resume Date',
      type: 'date',
      description: 'Set the date when pre-orders will resume.',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
    },
    {
      name: 'resumeTime',
      title: 'Resume Time',
      type: 'string',
      description: 'Set the time in 24-hour format (e.g., 16:30 or 09:00) when pre-orders will resume.',
      placeholder: '16:30',
      validation: (Rule: any) =>
        Rule.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
          name: 'time format',
          message: 'Must be in 24-hour format HH:MM (e.g., 16:30)',
        }),
    },
    {
      name: 'pausedMessageEn',
      title: 'Paused Banner Message (English)',
      type: 'text',
      rows: 3,
      description:
        'Optional. Custom message shown to customers while orders are paused. Leave blank to use the default text that includes the resume date/time.',
      placeholder:
        'We are fully booked right now. New orders will open on [date]. Follow us on Instagram for updates!',
    },
    {
      name: 'pausedMessageFi',
      title: 'Paused Banner Message (Finnish)',
      type: 'text',
      rows: 3,
      description:
        'Optional. Finnish version of the paused message. Leave blank to use the default Finnish text.',
      placeholder:
        'Olemme tällä hetkellä täynnä. Uudet tilaukset avautuvat [päivämäärä]. Seuraa meitä Instagramissa!',
    },
  ],
};
