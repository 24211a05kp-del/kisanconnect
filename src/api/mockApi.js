// Mock API layer for development
// OTP APIs
export const sendOTP = async (phone) => {
  return {
    success: true,
    message: 'OTP sent successfully',
    otp: '1234', // Mock OTP for testing
  };
};

export const verifyOTP = async (phone, otp) => {
  if (otp === '1234') {
    return {
      success: true,
      message: 'OTP verified successfully',
      token: `mock_token_${Date.now()}`,
    };
  }
  return {
    success: false,
    message: 'Invalid OTP',
  };
};

// Disease Detection API
export const detectDisease = async (imageFile) => {
  return {
    id: 'disease_1',
    name: {
      en: 'Healthy Crop',
      hi: 'स्वस्थ फसल',
      te: 'ఆరోగ్యకరమైన పంట'
    },
    severity: 'none',
    confidence: 99,
    description: {
      en: 'Your crop appears healthy based on the visual analysis.',
      hi: 'दृश्य विश्लेषण के आधार पर आपकी फसल स्वस्थ दिखाई दे रही है।',
      te: 'దృశ్య విశ్లేషణ ఆధారంగా మీ పంట ఆరోగ్యంగా ఉన్నట్లు కనిపిస్తోంది.'
    },
    cureSteps: {
      en: ['Continue regular monitoring', 'Ensure proper irrigation'],
      hi: ['नियमित निगरानी जारी रखें', 'उचित सिंचाई सुनिश्चित करें'],
      te: ['రెగ్యులర్ పర్యవేక్షణను కొనసాగించండి', 'సరైన నీటి పారుదలని నిర్ధారించుకోండి']
    },
  };
};

// Weather API
export const fetchWeather = async (lat, lon) => {
  return {
    temp: 32,
    condition: 'Sunny',
    forecast: [
      { day: 'Mon', temp: 32 },
    ],
  };
};

// News API
export const getNews = async () => {
  return [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1592982531416-04ca7277800c?q=80&w=2070&auto=format&fit=crop',
      category: 'scheme',
      title: {
        en: 'PM-Kisan Samman Nidhi Update',
        hi: 'पीएम-किसान सम्मान निधि अपडेट',
        te: 'పిఎం-కిసాన్ సమ్మాన్ నిధి అప్‌డేట్'
      },
      summary: {
        en: 'The government has released the latest installment for PM-Kisan scheme beneficiaries.',
        hi: 'सरकार ने पीएम-किसान योजना के लाभार्थियों के लिए नवीनतम किस्त जारी की है।',
        te: 'పిఎం-కిసాన్ పథకం లబ్ధిదారుల కోసం ప్రభుత్వం తాజా విడతను విడుదల చేసింది.'
      },
      date: '2024-03-20T10:00:00Z'
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1495107333217-fe9d80d22aa0?q=80&w=2070&auto=format&fit=crop',
      category: 'news',
      title: {
        en: 'Sustainable Farming Techniques 2024',
        hi: 'सतत खेती तकनीक 2024',
        te: 'స్థిరమైన వ్యవసాయ పద్ధతులు 2024'
      },
      summary: {
        en: 'New organic farming methods are proving to increase yields by 20% in dry regions.',
        hi: 'नई जैविक खेती के तरीके शुष्क क्षेत्रों में पैदावार में 20% की वृद्धि करने के लिए सिद्ध हो रहे हैं।',
        te: 'ఆధునిక సేంద్రీయ వ్యవసాయ పద్ధతులు పొడి ప్రాంతాలలో దిగుబడిని 20% పెంచుతున్నట్లు నిరూపిస్తున్నాయి.'
      },
      date: '2024-03-19T14:30:00Z'
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2072&auto=format&fit=crop',
      category: 'price',
      title: {
        en: 'Market Pulse: Cotton Prices Rise',
        hi: 'मार्केट पल्स: कपास की कीमतों में वृद्धि',
        te: 'మార్కెట్ పల్స్: పత్తి ధరలు పెరిగాయి'
      },
      summary: {
        en: 'Cotton prices see a steady climb in major mandis across India this week.',
        hi: 'इस सप्ताह भारत भर की प्रमुख मंडियों में कपास की कीमतों में निरंतर वृद्धि देखी गई है।',
        te: 'ఈ వారం భారతదేశవ్యాప్తంగా ప్రధాన మండీలలో పత్తి ధరలు స్థిరంగా పెరుగుతున్నాయి.'
      },
      date: '2024-03-18T09:15:00Z'
    }
  ];
};
