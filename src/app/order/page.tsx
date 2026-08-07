import { redirect } from 'next/navigation';

/**
 * The order form is now embedded directly on the home page above the footer.
 * Redirect any direct visits to /order back to the home page #order section.
 */
export default function OrderPage() {
  redirect('/#order');
}
