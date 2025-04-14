function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  
  
  function loadGA() {
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-56LGK2P0DR';
    document.head.appendChild(gaScript);
   
   
    gaScript.onload = function() {
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      window.gtag = gtag;  
      gtag('js', new Date());
      gtag('config', 'G-56LGK2P0DR');
    };
  }
  
  
  const consent = getCookie('analyticsConsent');
  
  if (consent === 'true') {
    loadGA();
  } else if (consent === 'false') {
  } else {
    document.getElementById('consent-banner').style.display = 'block';
  }
  
  
  document.getElementById('accept-cookies').addEventListener('click', function() {
    setCookie('analyticsConsent', 'true', 365);
    loadGA();
    document.getElementById('consent-banner').style.display = 'none';
  });
  
  
  document.getElementById('reject-cookies').addEventListener('click', function() {
    setCookie('analyticsConsent', 'false', 365);
    document.getElementById('consent-banner').style.display = 'none';
  });
  