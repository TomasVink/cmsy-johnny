import type { Block } from 'payload'

export const SignupBlock: Block = {
  slug: 'signup',
  labels: { singular: 'Signup', plural: ' Signup blocks' },
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      defaultValue: 'sign-up',
      admin: { description: 'HTML anchor id for nav linking' },
    },
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text', required: true },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Ik wil een Johnny serveren',
      admin: { description: 'Submit button label' },
    },
    {
      name: 'disclaimer',
      type: 'text',
      defaultValue: 'Geen verplichtingen. We contacteren je snel.',
    },
    {
      name: 'thankYou',
      type: 'textarea',
      required: true,
      defaultValue: 'Bedankt. We nemen snel contact met je op.',
    },
  ],
}
