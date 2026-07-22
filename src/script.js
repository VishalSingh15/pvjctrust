console.log("JS is running");

// translator

// function googleTranslateElementInit() {
//   new google.translate.TranslateElement(
//     { pageLanguage: "en" },
//     "google_translate_element"
//   );
// }

document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-md', 'py-2');
      navbar.classList.remove('py-4');
    } else {
      navbar.classList.remove('shadow-md', 'py-2');
      navbar.classList.add('py-4');
    }
  });

  // Mobile menu toggle
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      if (menuIcon) menuIcon.classList.toggle('hidden');
      if (closeIcon) closeIcon.classList.toggle('hidden');
    });
  }

  // Close mobile menu on link click
  const mobileLinks = document.querySelectorAll('.mobile-link, #work-menu a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.add('hidden');
      if (menuIcon) menuIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
    });
  });

  // Mobile menu dropdown ('Our Work')
  const workBtn = document.getElementById('work-btn');
  const workMenu = document.getElementById('work-menu');
  const workIcon = document.getElementById('work-icon');

  if (workBtn && workMenu) {
    workBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      workMenu.classList.toggle('hidden');
      if (workIcon) {
        workIcon.classList.toggle('rotate-180');
      }
    });
  }

  // Scroll Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Google Translate Initialization

  //   function googleTranslateElementInit() {
  //   new google.translate.TranslateElement({
  //     pageLanguage: 'en',
  //     includedLanguages: 'hi,fr,de,es', // only these languages
  //     layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  //   }, 'google_translate_element');
  // }
  // window.googleTranslateElementInit = () => {
  //   new window.google.translate.TranslateElement(
  //     {
  //       pageLanguage: 'en',
  //       includedLanguages: 'en,hi,mr,gu,bn,ta,te,kn,ml,pa,ur',
  //       layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
  //     },
  //     'google_translate_element'
  //   );
  // };

  // if (!document.getElementById('google-translate-script')) {
  //   const script = document.createElement('script');
  //   script.id = 'google-translate-script';
  //   script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  //   script.async = true;
  //   document.body.appendChild(script);
  // }

  // Donation Form Logic (cause.html & donate.html)
  let selectedAmount = null;
  const donationForm = document.getElementById('donation-form');
  if (donationForm) {
    const presetBtns = document.querySelectorAll('.preset-amount-btn');
    const customAmountInput = document.getElementById('custom-amount');

    // Handle preset amount clicks
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        presetBtns.forEach(b => {
          b.classList.remove('bg-emerald-50', 'border-emerald-500', 'text-emerald-700');
          b.classList.add('border-slate-200', 'text-slate-700');
        });

        btn.classList.add('bg-emerald-50', 'border-emerald-500', 'text-emerald-700');

        selectedAmount = btn.dataset.amount; // ✅ store it
        customAmountInput.value = selectedAmount;
      });
    });

    // Handle custom amount input (clear preset selection)
    customAmountInput.addEventListener('input', () => {
      presetBtns.forEach(b => {
        b.classList.remove('bg-emerald-50', 'border-emerald-500', 'text-emerald-700');
        b.classList.add('border-slate-200', 'text-slate-700');
      });

      selectedAmount = customAmountInput.value; // ✅ store custom value
    });

    // Handle form submission
    donationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const amount = selectedAmount || customAmountInput.value;
      if (!amount || amount < 100) {
        alert('Please enter a valid amount (minimum ₹100).');
        return;
      }

      const donationData = {
        causeName: document.getElementById('cause-name').value,
        amount: amount,
        name: document.getElementById('donor-name').value,
        email: document.getElementById('donor-email').value,
        phone: document.getElementById('donor-phone').value,
        pan: document.getElementById('donor-pan').value,
        city: document.getElementById('donor-city').value
      };

      // Save to localStorage
      console.log("Saving data:", donationData);
      localStorage.setItem('donationData', JSON.stringify(donationData));

      // Redirect to confirmation page
      window.location.href = 'confirm-donation.html';
    });
  }

  // Confirmation Page Logic (confirm-donation.html)
  const confirmAmount = document.getElementById('confirm-amount');
  if (confirmAmount) {
    const dataString = localStorage.getItem('donationData');
    if (dataString) {
      const data = JSON.parse(dataString);

      document.getElementById('confirm-cause').textContent = data.causeName;
      document.getElementById('confirm-amount').value = data.amount;
      document.getElementById('confirm-name').value = data.name;
      document.getElementById('confirm-email').value = data.email;
      document.getElementById('confirm-phone').value = data.phone;
      document.getElementById('confirm-pan').value = data.pan;
      document.getElementById('confirm-city').value = data.city;
    } else {
      // Redirect back if no data found
      window.location.href = 'donate.html';
    }

    // Razorpay Placeholder Logic
    const payNowBtn = document.getElementById('pay-now-btn');
    if (payNowBtn) {
      payNowBtn.addEventListener('click', () => {
        initiateRazorpayCheckout();
      });
    }

    // Document Preview Modal logic
    const docModal = document.getElementById('doc-modal');
    const docModalBackdrop = document.getElementById('doc-modal-backdrop');
    const docModalContainer = document.getElementById('doc-modal-container');
    const docModalTitle = document.getElementById('doc-modal-title');
    const docModalClose = document.getElementById('doc-modal-close');
    const docModalIframe = document.getElementById('doc-modal-iframe');
    const docModalImg = document.getElementById('doc-modal-img');
    const docModalLoader = document.getElementById('doc-modal-loader');
    const docModalExternal = document.getElementById('doc-modal-external');

    let loaderTimeout = null;

    function openDocModal(title, url) {
      if (!docModal) return;

      docModalTitle.textContent = title;
      if (docModalExternal) {
        docModalExternal.href = url;
      }

      // Hide preview content and show loader
      docModalIframe.classList.add('hidden');
      docModalImg.classList.add('hidden');
      docModalLoader.classList.remove('hidden');

      if (loaderTimeout) {
        clearTimeout(loaderTimeout);
      }

      // Safety fallback: hide loader after 1.5 seconds if onload fails
      loaderTimeout = setTimeout(() => {
        docModalLoader.classList.add('hidden');
      }, 1500);

      const isPdf = url.toLowerCase().endsWith('.pdf');
      if (isPdf) {
        // Set onload handler BEFORE src to avoid cached load race conditions
        docModalIframe.onload = () => {
          if (loaderTimeout) clearTimeout(loaderTimeout);
          docModalLoader.classList.add('hidden');
        };
        docModalIframe.src = url;
        docModalIframe.classList.remove('hidden');
      } else {
        // Set onload handler BEFORE src to avoid cached load race conditions
        docModalImg.onload = () => {
          if (loaderTimeout) clearTimeout(loaderTimeout);
          docModalLoader.classList.add('hidden');
        };
        docModalImg.src = url;
        docModalImg.classList.remove('hidden');
      }

      // Show modal structure
      docModal.classList.remove('hidden');
      void docModal.offsetHeight; // force repaint

      // Transition styles
      docModalBackdrop.classList.remove('opacity-0');
      docModalBackdrop.classList.add('opacity-100');
      docModalContainer.classList.remove('scale-95', 'opacity-0');
      docModalContainer.classList.add('scale-100', 'opacity-100');

      document.body.classList.add('overflow-hidden');
    }

    function closeDocModal() {
      if (!docModal) return;

      if (loaderTimeout) {
        clearTimeout(loaderTimeout);
      }

      // Animate out
      docModalBackdrop.classList.remove('opacity-100');
      docModalBackdrop.classList.add('opacity-0');
      docModalContainer.classList.remove('scale-100', 'opacity-100');
      docModalContainer.classList.add('scale-95', 'opacity-0');

      document.body.classList.remove('overflow-hidden');

      setTimeout(() => {
        docModal.classList.add('hidden');
        docModalIframe.src = '';
        docModalImg.src = '';
        if (docModalExternal) {
          docModalExternal.href = '#';
        }
      }, 300);
    }

    // Attach event listener for buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.view-doc-btn');
      if (btn) {
        e.preventDefault();
        const title = btn.getAttribute('data-doc-title');
        const url = btn.getAttribute('data-doc-url') || btn.getAttribute('href');
        openDocModal(title, url);
      }
    });

    if (docModalClose) docModalClose.addEventListener('click', closeDocModal);
    if (docModalBackdrop) docModalBackdrop.addEventListener('click', closeDocModal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && docModal && !docModal.classList.contains('hidden')) {
        closeDocModal();
      }
    });
  }
});

async function initiateRazorpayCheckout() {
  const dataString = localStorage.getItem('donationData');
  if (!dataString) return;
  const data = JSON.parse(dataString);

  const payNowBtn = document.getElementById('pay-now-btn');
  if (payNowBtn) {
    payNowBtn.textContent = 'Processing...';
    payNowBtn.disabled = true;
  }

  try {
    // 1. Create Order on Backend
    const orderResponse = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: data.amount }),
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create order');
    }

    const orderData = await orderResponse.json();

    // 2. Initialize Razorpay Checkout
    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual Razorpay Key ID or fetch from backend
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Pratham Vijay Janseva Trust',
      description: `Donation for ${data.causeName}`,
      order_id: orderData.id,
      handler: async function (response) {
        try {
          if (payNowBtn) {
            payNowBtn.textContent = 'Verifying Payment...';
          }

          // 3. Verify Payment on Backend and Download PDF
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              donorDetails: {
                name: data.name,
                email: data.email,
                amount: data.amount,
                cause: data.causeName,
                phone: data.phone,
                pan: data.pan,
                city: data.city
              }
            }),
          });

          if (!verifyResponse.ok) {
            throw new Error('Payment verification failed');
          }

          // 4. Trigger PDF Download
          const blob = await verifyResponse.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = downloadUrl;
          a.download = `Donation_Receipt_${response.razorpay_payment_id}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(downloadUrl);

          alert('Payment Successful! Your 80G receipt has been downloaded and sent to your email.');
          localStorage.removeItem('donationData');

          // Optional: Redirect to a success page
          // window.location.href = 'success.html';

        } catch (verifyError) {
          console.error('Verification Error:', verifyError);
          alert('Payment verification failed. Please contact support.');
        } finally {
          if (payNowBtn) {
            payNowBtn.textContent = 'Pay Now';
            payNowBtn.disabled = false;
          }
        }
      },
      prefill: {
        name: data.name,
        email: data.email,
        contact: data.phone,
      },
      notes: {
        cause: data.causeName,
        pan: data.pan,
        city: data.city,
      },
      theme: {
        color: '#059669', // Emerald 600
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response) {
      console.error('Payment Failed:', response.error);
      alert(`Payment Failed: ${response.error.description}`);
      if (payNowBtn) {
        payNowBtn.textContent = 'Pay Now';
        payNowBtn.disabled = false;
      }
    });
    rzp1.open();

  } catch (error) {
    console.error('Checkout Error:', error);
    alert('Failed to initiate checkout. Please try again later.');
    if (payNowBtn) {
      payNowBtn.textContent = 'Pay Now';
      payNowBtn.disabled = false;
    }
  }
}