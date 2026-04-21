import type { Block } from 'payload'
import { localeDefault } from '@/utils/localeDefault'

export const SignupBlock: Block = {
  slug: 'signup',
  labels: { singular: 'Signup', plural: 'Signup blocks' },
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      localized: true,
      defaultValue: localeDefault('sign-up', 'inscription'),
      admin: { description: 'HTML anchor id for nav linking' }
    },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'subtitle', type: 'text', required: true, localized: true },
    {
      name: 'description',
      type: 'textarea',
      localized: true
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media'
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      defaultValue: localeDefault('Ik wil een Johnny serveren', 'Je veux servir un Johnny'),
      admin: { description: 'Submit button label' }
    },
    {
      name: 'disclaimer',
      type: 'text',
      localized: true,
      defaultValue: localeDefault(
        'Geen verplichtingen. We contacteren je snel.',
        'Sans engagement. Nous vous contacterons rapidement.'
      )
    },
    {
      name: 'thankYou',
      type: 'textarea',
      required: true,
      localized: true,
      defaultValue: localeDefault(
        'Bedankt. We nemen snel contact met je op.',
        'Merci. Nous vous contacterons prochainement.'
      )
    },
    {
      name: 'thankYouLink',
      type: 'text'
    },
    {
      name: 'thankYouLinkText',
      type: 'text'
    },
    {
      name: 'labels',
      type: 'group',
      label: 'Form field labels',
      admin: {
        description:
          'Used as both label and placeholder for each field. Leave empty to use the default.'
      },
      fields: [
        {
          name: 'frituurName',
          type: 'text',
          localized: true,
          defaultValue: localeDefault('Naam frituur', 'Nom de la friterie')
        },
        { name: 'name', type: 'text', localized: true, defaultValue: localeDefault('Naam', 'Nom') },
        {
          name: 'address',
          type: 'text',
          localized: true,
          defaultValue: localeDefault('Adres', 'Adresse')
        },
        {
          name: 'postcode',
          type: 'text',
          localized: true,
          defaultValue: localeDefault('Postcode', 'Code postal')
        },
        {
          name: 'city',
          type: 'text',
          localized: true,
          defaultValue: localeDefault('Gemeente', 'Commune')
        },
        {
          name: 'phone',
          type: 'text',
          localized: true,
          defaultValue: localeDefault('Telefoonnummer', 'Numéro de téléphone')
        },
        {
          name: 'email',
          type: 'text',
          localized: true,
          defaultValue: localeDefault('E-mailadres', 'Adresse email')
        }
      ]
    }
  ]
}
