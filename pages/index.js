import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Importar supabase apenas no lado do cliente
const ProtectedContent = dynamic(
  () => import('../components/ProtectedContent'),
  { ssr: false }
);

export default function Home() {
  const router = useRouter();
  
  return <ProtectedContent router={router} />;
