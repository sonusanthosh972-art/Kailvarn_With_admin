export function useWhatsAppLink() {
  const phoneNumber = '918460150027';

  const generateLink = (serviceName = '', customMessage = '') => {
    let message = customMessage;
    
    if (!message) {
      if (serviceName) {
        message = `Hi KailVarn! I'm interested in ${serviceName}. Please share more details.`;
      } else {
        message = 'Hi KailVarn! I would like to know more about your interior design services.';
      }
    }

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  const openWhatsApp = (serviceName = '', customMessage = '') => {
    const link = generateLink(serviceName, customMessage);
    window.open(link, '_blank');
  };

  return { generateLink, openWhatsApp };
}