// File: app/api/vcard/[name]/route.ts
// Forces VCF to open in contacts app using data URL with DYNAMIC content

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const vcardFiles: Record<string, string> = {
  'isa': 'İsa_Alomer (1).vcf',
  'Ahmad_Hamdan':'Ahmad_Hamdan.vcf'
};

interface RouteParams {
  params: {
    name: string;
  };
}

// Helper function to parse VCF content
function parseVCard(vcfContent: string) {
  const lines = vcfContent.split('\n');
  const data: {
    fullName?: string;
    organization?: string;
    title?: string;
    phone?: string;
    email?: string;
  } = {};

  lines.forEach(line => {
    // Full Name
    if (line.startsWith('FN:')) {
      data.fullName = line.substring(3).trim();
    }
    // Organization
    else if (line.startsWith('ORG:')) {
      data.organization = line.substring(4).trim();
    }
    // Title (handle both plain and encoded)
    else if (line.startsWith('TITLE')) {
      if (line.includes('ENCODING=QUOTED-PRINTABLE')) {
        // Extract the encoded part
        const encodedPart = line.split(':')[1];
        if (encodedPart) {
          data.title = decodeQuotedPrintable(encodedPart.trim());
        }
      } else {
        data.title = line.split(':')[1]?.trim();
      }
    }
    // Phone
    else if (line.startsWith('TEL')) {
      const phonePart = line.split(':')[1];
      if (phonePart) {
        data.phone = phonePart.trim();
      }
    }
    // Email
    else if (line.startsWith('EMAIL')) {
      const emailPart = line.split(':')[1];
      if (emailPart) {
        data.email = emailPart.trim();
      }
    }
  });

  return data;
}

// Helper function to decode quoted-printable encoding
function decodeQuotedPrintable(str: string): string {
  return str.replace(/=([0-9A-F]{2})/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { name } = params;
  const cleanName = name.replace('.vcf', '');
  
  if (!vcardFiles[cleanName]) {
    return NextResponse.redirect('https://idigitek.com');
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'assets', vcardFiles[cleanName]);
    const fileContent = await readFile(filePath, 'utf-8');

    // Parse VCF content to extract contact information
    const contactData = parseVCard(fileContent);

    // Create HTML that forces VCF to open in contacts app
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Opening Contact...</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .spinner {
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1.5rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .contact-info {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            color: white;
            text-decoration: none;
            margin: 10px;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="spinner"></div>
        <h2>Opening Contact Card</h2>
        <div class="contact-info">
            <strong>${contactData.fullName || 'Contact'}</strong><br>
            ${contactData.title ? `${contactData.title}${contactData.organization ? ', ' : ''}` : ''}${contactData.organization || ''}<br>
            ${contactData.phone ? `📞 ${contactData.phone}<br>` : ''}
            ${contactData.email ? `📧 ${contactData.email}` : ''}
        </div>
        
        <p>Tap the button below to add contact:</p>
        <a href="#" id="addContactBtn" class="btn">📱 Add to Contacts</a>
        
        <p style="font-size: 14px; margin-top: 2rem;">
            Redirecting to <strong>idigitek.com</strong> in <span id="countdown">5</span> seconds...
        </p>
    </div>
    
    <script>
        // VCF content
        const vcfContent = \`${fileContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
        
        // Function to try different methods to open VCF
        function openVCard() {
            // Method 1: Data URL approach
            const dataUrl = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(vcfContent);
            
            // Try to open with window.open first
            const newWindow = window.open(dataUrl, '_blank');
            
            // If popup blocked, use location.href
            setTimeout(() => {
                if (!newWindow || newWindow.closed) {
                    window.location.href = dataUrl;
                }
            }, 100);
        }
        
        // Auto-trigger on page load
        setTimeout(openVCard, 500);
        
        // Manual button trigger
        document.getElementById('addContactBtn').addEventListener('click', function(e) {
            e.preventDefault();
            openVCard();
        });
        
        // Countdown and redirect
        let countdown = 5;
        const countdownElement = document.getElementById('countdown');
        
        const timer = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(timer);
                window.location.href = 'https://idigitek.com';
            }
        }, 1000);
        
        // Also try iOS specific method for Safari
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            setTimeout(() => {
                // Create a temporary link for iOS
                const tempLink = document.createElement('a');
                tempLink.href = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(vcfContent);
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);
                
                // Trigger click
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                tempLink.dispatchEvent(clickEvent);
                
                // Clean up
                setTimeout(() => {
                    document.body.removeChild(tempLink);
                }, 100);
            }, 1000);
        }
    </script>
</body>
</html>`;

    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Error reading VCF file:', error);
    return NextResponse.redirect('https://idigitek.com');
  }
}