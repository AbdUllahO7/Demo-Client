'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CONTACTS = {
  isa: {
    fullName: "İsa Alomer",
    firstName: "İsa",
    lastName: "Alomer",
    organization: "iDIGITEK",
    title: "Operations Manager",
    phone: "+905317324731",
    email: "services@idigitek.com",
    website: "www.idigitek.com",
  },
};

export default function VCardPage() {
  const params = useParams();
  const router = useRouter();
  const name = params.name as string;
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [contact, setContact] = useState<typeof CONTACTS[keyof typeof CONTACTS] | null>(null);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  // Generate VCF content
  const generateVCF = (contactData: typeof CONTACTS[keyof typeof CONTACTS]) => {
    return `BEGIN:VCARD
VERSION:3.0
FN:${contactData.fullName}
N:${contactData.lastName};${contactData.firstName};;;
ORG:${contactData.organization}
TITLE:${contactData.title}
TEL;TYPE=CELL:${contactData.phone}
EMAIL;TYPE=HOME:${contactData.email}
URL:https://${contactData.website}
END:VCARD`;
  };

  // Download VCF file
  const downloadVCF = (contactData: typeof CONTACTS[keyof typeof CONTACTS]) => {
    const vcard = generateVCF(contactData);
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contactData.firstName}_${contactData.lastName}.vcf`;
    
    // Force download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setHasDownloaded(true);
  };

  useEffect(() => {
    if (!name) {
      router.push('https://idigitek.com');
      return;
    }

    const contactData = CONTACTS[name.toLowerCase() as keyof typeof CONTACTS];
    if (!contactData) {
      router.push('https://idigitek.com');
      return;
    }

    setContact(contactData);
    
    // Check device type
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      const isAndroidDevice = /android/.test(ua);
      const isIOSDevice = /iphone|ipad|ipod/.test(ua);
      
      setIsAndroid(isAndroidDevice);
      setIsIOS(isIOSDevice);

      // Auto-download VCF for all devices
      const timer = setTimeout(() => {
        downloadVCF(contactData);
        
        // Try to open contacts app after download
        setTimeout(() => {
          if (isIOSDevice) {
            try {
              window.location.href = 'contacts://';
            } catch (e) {
              console.log('iOS contacts app not available');
            }
          } else if (isAndroidDevice) {
            try {
              // Try to open Android contacts
              window.location.href = 'content://contacts/people/';
            } catch (e) {
              console.log('Android contacts app not available');
            }
          }
        }, 1000);

        // Redirect to main site after delay
        setTimeout(() => {
          if (!isAndroidDevice) { // Don't redirect on Android if we're showing the UI
            router.push('https://idigitek.com');
          }
        }, 3000);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [name, router]);

  const handleAndroidAction = (action: string, value: string) => {
    if (!contact) return;
    
    switch (action) {
      case 'call':
        window.location.href = `tel:${value}`;
        break;
      case 'sms':
        window.location.href = `sms:${value}`;
        break;
      case 'email':
        window.location.href = `mailto:${value}`;
        break;
      case 'website':
        window.open(`https://${value}`, '_blank');
        break;
      case 'downloadVCF':
        downloadVCF(contact);
        break;
      case 'addContact':
        // Method 1: Try modern Android intent
        const modernIntent = `intent:#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.dir/contact;S.name=${encodeURIComponent(contact.fullName)};S.phone=${encodeURIComponent(contact.phone)};S.email=${encodeURIComponent(contact.email)};end`;
        
        try {
          window.location.href = modernIntent;
          return;
        } catch (e) {
          console.log('Modern intent failed, trying alternatives');
        }

        // Method 2: Try simple contact intent
        try {
          const simpleIntent = `intent://contacts/people/#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.dir/contact;end`;
          window.location.href = simpleIntent;
          return;
        } catch (e) {
          console.log('Simple intent failed');
        }

        // Method 3: Try opening contacts app directly
        try {
          window.open('content://contacts/people/', '_self');
          return;
        } catch (e) {
          console.log('Direct contacts failed');
        }

        // Method 4: Fallback - download VCF
        alert('Unable to open contacts app directly. VCF file will be downloaded - you can import it manually in your contacts app.');
        downloadVCF(contact);
        break;
        
      case 'addToExisting':
        // Try to open contacts picker
        try {
          const pickerIntent = `intent://contacts/people/#Intent;action=android.intent.action.PICK;type=vnd.android.cursor.dir/contact;end`;
          window.location.href = pickerIntent;
          return;
        } catch (e) {
          console.log('Picker intent failed');
        }

        // Fallback - open contacts app
        try {
          window.open('content://contacts/people/', '_self');
          return;
        } catch (e) {
          console.log('Contacts app failed');
        }

        // Ultimate fallback
        alert('Unable to open contacts app. VCF file will be downloaded - you can import it manually.');
        downloadVCF(contact);
        break;
    }
  };

  const handleDoneClick = () => {
    router.push('https://idigitek.com');
  };

  // Show Android UI
  if (isAndroid && contact) {
    return (
      <div className="fixed inset-0 bg-gray-100 overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <button 
            onClick={handleDoneClick}
            className="text-white font-medium"
          >
            Done
          </button>
          <button 
            onClick={() => handleAndroidAction('addContact', contact.phone)}
            className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm font-medium"
          >
            Add Contact
          </button>
        </div>

        {/* Download Status */}
        {hasDownloaded && (
          <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-2 mx-4 mt-2 rounded-lg text-sm">
            ✓ Contact file downloaded! Check your downloads folder or import manually in contacts app.
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-blue-600 text-white text-center pb-8">
          <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-gray-600 text-3xl font-light">
              {contact.firstName.charAt(0)}
            </span>
          </div>
          <div className="text-sm opacity-80 mb-1">{contact.title} • {contact.organization}</div>
          <h1 className="text-2xl font-light">{contact.fullName}</h1>
        </div>

        {/* Action Buttons */}
        <div className="bg-white mx-4 -mt-4 rounded-lg shadow-lg p-4 mb-4">
          <div className="grid grid-cols-4 gap-4">
            <button 
              onClick={() => handleAndroidAction('sms', contact.phone)}
              className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">message</span>
            </button>

            <button 
              onClick={() => handleAndroidAction('call', contact.phone)}
              className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">call</span>
            </button>

            <button 
              onClick={() => handleAndroidAction('downloadVCF', '')}
              className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 mb-2 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">download</span>
            </button>

            <button 
              onClick={() => handleAndroidAction('email', contact.email)}
              className="flex flex-col items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 mb-2 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">mail</span>
            </button>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white mx-4 rounded-lg shadow-lg overflow-hidden">
          <button 
            onClick={() => handleAndroidAction('call', contact.phone)}
            className="w-full flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex-1">
              <div className="text-gray-500 text-sm">mobile</div>
              <div className="text-blue-600 font-medium">{contact.phone}</div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"/>
            </svg>
          </button>

          <button 
            onClick={() => handleAndroidAction('email', contact.email)}
            className="w-full flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex-1">
              <div className="text-gray-500 text-sm">Email</div>
              <div className="text-blue-600 font-medium">{contact.email}</div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"/>
            </svg>
          </button>

          <button 
            onClick={() => handleAndroidAction('website', contact.website)}
            className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex-1">
              <div className="text-gray-500 text-sm">Web site</div>
              <div className="text-blue-600 font-medium">https://{contact.website}</div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"/>
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          <button 
            onClick={() => handleAndroidAction('addContact', contact.phone)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create New Contact
          </button>
          
          <button 
            onClick={() => handleAndroidAction('addToExisting', contact.phone)}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Add to Existing Contact
          </button>
          
          <button 
            onClick={() => handleAndroidAction('downloadVCF', '')}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Download Contact File (.vcf)
          </button>
        </div>

        {/* Instructions */}
        <div className="mx-4 mb-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Having trouble adding the contact?</h3>
          <p className="text-blue-800 text-sm">
            1. Try the "Download Contact File" button<br/>
            2. Open your Contacts app<br/>
            3. Look for Import or Menu → Import<br/>
            4. Select the downloaded .vcf file
          </p>
        </div>

        {/* Footer */}
        <div className="h-8"></div>
      </div>
    );
  }

  // Loading/iOS state
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto p-6">
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
        
        {hasDownloaded ? (
          <div>
            <div className="text-green-600 mb-2">✓ Contact Downloaded!</div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              Check your downloads or Files app
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs">
              Import the .vcf file in your contacts app
            </p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              {isIOS ? 'Downloading contact...' : 'Loading contact...'}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs">
              You will be redirected to idigitek.com
            </p>
          </div>
        )}
      </div>
    </div>
  );
}