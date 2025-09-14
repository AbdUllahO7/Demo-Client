// app/vcard/[name]/page.js (App Router)
// This will handle URLs like: /vcard/isa or /vcard/onur

import { notFound } from 'next/navigation';

// This makes the page dynamic
export const dynamic = 'force-dynamic';

// Available VCF files mapping
const vcardFiles = {
  'isa': 'İsa_Alomer (1).vcf',
  'onur': 'onur.vcf', // if you have this file
  // Add more mappings as needed
};

export default function VCardPage({ params }) {
  const { name } = params;
  
  // Check if the requested vcard exists
  if (!vcardFiles[name]) {
    notFound();
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p>Preparing contact card...</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Download will start automatically
        </p>
      </div>
      
      {/* Auto-download script */}
      <script 
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const link = document.createElement('a');
              link.href = '/assets/${vcardFiles[name]}';
              link.download = '${name}.vcf';
              link.style.display = 'none';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // Redirect to home after download
              setTimeout(() => {
                window.location.href = '/';
              }, 1000);
            })();
          `
        }} 
      />
    </div>
  );
}