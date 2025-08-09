import Head from "next/head";

export default function DashboardHead() {
  // Simplified for SSR compatibility - no zustand dependency during static export
  // White label config can be handled client-side after hydration if needed

  return (
    <Head>
      <title>Dittofeed</title>
      <link rel="icon" type="image/png" href="/dashboard/favicon.png" />
      <meta name="description" content="Open Source Customer Engagement" />
    </Head>
  );
}
