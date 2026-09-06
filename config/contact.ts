/**
 * Theekzu Mobile Contact Form Configuration
 * 
 * Formspree Endpoint for direct asynchronous contact form submissions.
 * Endpoint: https://formspree.io/f/mbgjaajy
 */

export const FORMSPREE_ENDPOINT =
  process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ||
  "https://formspree.io/f/mbgjaajy";

export const contactConfig = {
  formspreeEndpoint: FORMSPREE_ENDPOINT,
  emailReceiver: "pasindutheekshana21@gmail.com",
  whatsappNumber: "94740245749",
  phoneDisplay: "0740245749",
  sourceIdentifier: "Theekzu Mobile Website",
};

export default contactConfig;
