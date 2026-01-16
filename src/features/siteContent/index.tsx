import React, { useState } from 'react';
import { FileText, Save } from 'lucide-react';

// Mock state management for site content
const useSiteContentStore = () => {
  const [heroData, setHeroData] = useState({
    title: "Welcome to Sports Ticket Booking",
    title_ar: "مرحبًا بك في حجز تذاكر الرياضة",
    description: "Book tickets for your favorite sports events and matches",
    description_ar: "احجز تذاكر لأحداثك ومبارياتك الرياضية المفضلة",
    buttonText: "Explore Matches",
    buttonText_ar: "استكشف المباريات",
    buttonUrl: "/matches",
  });

  const [contactData, setContactData] = useState({
    email: "support@sportstickets.com",
    phone: "+20 100 123 4567",
    address: "123 Sports Avenue, Cairo",
    address_ar: "123 شارع الرياضة، القاهرة",
    country: "Egypt",
    country_ar: "مصر",
    workingHours: "Sunday - Thursday, 9:00 AM - 6:00 PM",
    workingHours_ar: "الأحد - الخميس، 9:00 صباحًا - 6:00 مساءً",
    responseTime: "Within 24 hours",
    responseTime_ar: "خلال 24 ساعة",
  });

  const [cookiePolicyData, setCookiePolicyData] = useState({
    content_en: `<h2>Cookie Policy</h2>
<p>This Cookie Policy explains how we use cookies and similar technologies to recognize you when you visit our website.</p>

<h3>What are cookies?</h3>
<p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work more efficiently and to provide reporting information.</p>

<h3>Why do we use cookies?</h3>
<p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons for our website to operate. Other cookies enable us to track and target the interests of our users to enhance the experience on our website.</p>

<h3>Types of cookies we use:</h3>
<ul>
  <li><strong>Essential cookies:</strong> These cookies are strictly necessary to provide you with services available through our website.</li>
  <li><strong>Performance cookies:</strong> These cookies allow us to count visits and traffic sources to measure and improve the performance of our site.</li>
  <li><strong>Functional cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization.</li>
  <li><strong>Targeting cookies:</strong> These cookies may be set through our site by our advertising partners.</li>
</ul>

<h3>How can you control cookies?</h3>
<p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner.</p>`,
    content_ar: `<h2 dir="rtl">سياسة ملفات تعريف الارتباط</h2>
<p dir="rtl">توضح سياسة ملفات تعريف الارتباط هذه كيفية استخدامنا لملفات تعريف الارتباط والتقنيات المماثلة للتعرف عليك عند زيارتك لموقعنا الإلكتروني.</p>

<h3 dir="rtl">ما هي ملفات تعريف الارتباط؟</h3>
<p dir="rtl">ملفات تعريف الارتباط هي ملفات بيانات صغيرة يتم وضعها على جهاز الكمبيوتر أو الجهاز المحمول الخاص بك عند زيارة موقع ويب.</p>`
  });

  const [termsData, setTermsData] = useState({
    content_en: `<h2>Terms of Service</h2>
<p>Welcome to our Sports Ticket Booking platform. By accessing and using our services, you agree to be bound by these Terms of Service.</p>

<h3>1. Acceptance of Terms</h3>
<p>By creating an account or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.</p>

<h3>2. User Accounts</h3>
<p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.</p>

<h3>3. Ticket Purchases</h3>
<p>All ticket sales are final unless otherwise stated. Refunds may be available in accordance with our refund policy, typically up to 48 hours before the event.</p>

<h3>4. User Conduct</h3>
<p>You agree not to use our platform for any unlawful purpose or in any way that could damage, disable, overburden, or impair our services.</p>

<h3>5. Limitation of Liability</h3>
<p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>`,
    content_ar: `<h2 dir="rtl">شروط الخدمة</h2>
<p dir="rtl">مرحبًا بك في منصة حجز تذاكر الرياضة الخاصة بنا. باستخدام خدماتنا، فإنك توافق على الالتزام بشروط الخدمة هذه.</p>

<h3 dir="rtl">1. قبول الشروط</h3>
<p dir="rtl">من خلال إنشاء حساب أو استخدام خدماتنا، فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بشروط الخدمة وسياسة الخصوصية الخاصة بنا.</p>`
  });

  const [privacyData, setPrivacyData] = useState({
    content_en: `<h2>Privacy Policy</h2>
<p>This Privacy Policy describes how we collect, use, and protect your personal information when you use our Sports Ticket Booking platform.</p>

<h3>Information We Collect</h3>
<p>We collect information that you provide directly to us, including:</p>
<ul>
  <li>Name and contact information</li>
  <li>Payment information</li>
  <li>Account credentials</li>
  <li>Ticket purchase history</li>
  <li>Communication preferences</li>
</ul>

<h3>How We Use Your Information</h3>
<p>We use the information we collect to:</p>
<ul>
  <li>Process your ticket purchases and bookings</li>
  <li>Send you confirmations and notifications</li>
  <li>Improve our services and user experience</li>
  <li>Prevent fraud and maintain security</li>
  <li>Comply with legal obligations</li>
</ul>

<h3>Information Sharing</h3>
<p>We do not sell your personal information. We may share your information with:</p>
<ul>
  <li>Service providers who assist in our operations</li>
  <li>Event organizers for ticket validation</li>
  <li>Law enforcement when required by law</li>
</ul>

<h3>Data Security</h3>
<p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>

<h3>Your Rights</h3>
<p>You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data.</p>`,
    content_ar: `<h2 dir="rtl">سياسة الخصوصية</h2>
<p dir="rtl">توضح سياسة الخصوصية هذه كيفية جمع معلوماتك الشخصية واستخدامها وحمايتها عند استخدام منصة حجز التذاكر الرياضية الخاصة بنا.</p>

<h3 dir="rtl">المعلومات التي نجمعها</h3>
<p dir="rtl">نقوم بجمع المعلومات التي تقدمها لنا مباشرة، بما في ذلك:</p>
<ul dir="rtl">
  <li>الاسم ومعلومات الاتصال</li>
  <li>معلومات الدفع</li>
  <li>بيانات اعتماد الحساب</li>
  <li>سجل شراء التذاكر</li>
  <li>تفضيلات الاتصال</li>
</ul>`
  });

  return {
    heroData,
    setHeroData,
    contactData,
    setContactData,
    cookiePolicyData,
    setCookiePolicyData,
    termsData,
    setTermsData,
    privacyData,
    setPrivacyData,
  };
};

// Simple Rich Text Editor Component
const SimpleEditor = ({ value, onChange, placeholder = "Enter content..." }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={15}
      className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#00ff88] transition-colors resize-none"
      placeholder={placeholder}
    />
  );
};

export default function SiteContentManagement() {
  const {
    heroData,
    setHeroData,
    contactData,
    setContactData,
    cookiePolicyData,
    setCookiePolicyData,
    termsData,
    setTermsData,
    privacyData,
    setPrivacyData,
  } = useSiteContentStore();

  const [activeTab, setActiveTab] = useState('home');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      alert(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content saved successfully!`);
    }, 1000);
  };

  const tabs = [
    { id: 'home', label: 'Home Page' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'cookie', label: 'Cookie Policy' },
    { id: 'terms', label: 'Terms of Service' },
    { id: 'privacy', label: 'Privacy Policy' },
  ];

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">Site Content Settings</h1>
          </div>
          <p className="text-gray-400">Manage your website's content and static pages</p>
        </div>

        {/* Tabs */}
        <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#00ff88] text-[#00ff88] bg-[#0a1929]'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-[#0a1929]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6">
          {/* Home Page Content */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Hero Section</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title (English)</label>
                    <input
                      type="text"
                      value={heroData.title}
                      onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title (Arabic)</label>
                    <input
                      type="text"
                      value={heroData.title_ar}
                      onChange={(e) => setHeroData({ ...heroData, title_ar: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description (English)</label>
                    <textarea
                      value={heroData.description}
                      onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description (Arabic)</label>
                    <textarea
                      value={heroData.description_ar}
                      onChange={(e) => setHeroData({ ...heroData, description_ar: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors resize-none"
                      dir="rtl"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Button Text (English)</label>
                      <input
                        type="text"
                        value={heroData.buttonText}
                        onChange={(e) => setHeroData({ ...heroData, buttonText: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Button Text (Arabic)</label>
                      <input
                        type="text"
                        value={heroData.buttonText_ar}
                        onChange={(e) => setHeroData({ ...heroData, buttonText_ar: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                        dir="rtl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Button URL</label>
                    <input
                      type="text"
                      value={heroData.buttonUrl}
                      onChange={(e) => setHeroData({ ...heroData, buttonUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Page Content */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address (English)</label>
                  <input
                    type="text"
                    value={contactData.address}
                    onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address (Arabic)</label>
                  <input
                    type="text"
                    value={contactData.address_ar}
                    onChange={(e) => setContactData({ ...contactData, address_ar: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country (English)</label>
                  <input
                    type="text"
                    value={contactData.country}
                    onChange={(e) => setContactData({ ...contactData, country: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country (Arabic)</label>
                  <input
                    type="text"
                    value={contactData.country_ar}
                    onChange={(e) => setContactData({ ...contactData, country_ar: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Working Hours (English)</label>
                  <input
                    type="text"
                    value={contactData.workingHours}
                    onChange={(e) => setContactData({ ...contactData, workingHours: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Working Hours (Arabic)</label>
                  <input
                    type="text"
                    value={contactData.workingHours_ar}
                    onChange={(e) => setContactData({ ...contactData, workingHours_ar: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Response Time (English)</label>
                  <input
                    type="text"
                    value={contactData.responseTime}
                    onChange={(e) => setContactData({ ...contactData, responseTime: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Response Time (Arabic)</label>
                  <input
                    type="text"
                    value={contactData.responseTime_ar}
                    onChange={(e) => setContactData({ ...contactData, responseTime_ar: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-[#00ff88] transition-colors"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cookie Policy Content */}
          {activeTab === 'cookie' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Cookie Policy</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content (English)</label>
                <SimpleEditor
                  value={cookiePolicyData.content_en}
                  onChange={(value) => setCookiePolicyData({ ...cookiePolicyData, content_en: value })}
                  placeholder="Enter cookie policy content in English..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content (Arabic)</label>
                <SimpleEditor
                  value={cookiePolicyData.content_ar}
                  onChange={(value) => setCookiePolicyData({ ...cookiePolicyData, content_ar: value })}
                  placeholder="أدخل محتوى سياسة ملفات تعريف الارتباط بالعربية..."
                />
              </div>
            </div>
          )}

          {/* Terms of Service Content */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Terms of Service</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content (English)</label>
                <SimpleEditor
                  value={termsData.content_en}
                  onChange={(value) => setTermsData({ ...termsData, content_en: value })}
                  placeholder="Enter terms of service content in English..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content (Arabic)</label>
                <SimpleEditor
                  value={termsData.content_ar}
                  onChange={(value) => setTermsData({ ...termsData, content_ar: value })}
                  placeholder="أدخل محتوى شروط الخدمة بالعربية..."
                />
              </div>
            </div>
          )}

          {/* Privacy Policy Content */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content (English)</label>
                <SimpleEditor
                  value={privacyData.content_en}
                  onChange={(value) => setPrivacyData({ ...privacyData, content_en: value })}
                  placeholder="Enter privacy policy content in English..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content (Arabic)</label>
                <SimpleEditor
                  value={privacyData.content_ar}
                  onChange={(value) => setPrivacyData({ ...privacyData, content_ar: value })}
                  placeholder="أدخل محتوى سياسة الخصوصية بالعربية..."
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-[#1e3a52] flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-[#00ff88] text-[#0a1929] font-semibold rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0a1929]"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}