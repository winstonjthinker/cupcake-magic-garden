import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook, Twitter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon!",
        variant: "default",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gradient-to-b from-white to-cupcake-pink/10">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-cupcake-pink to-cupcake-darkPink text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-pacifico mb-4">Get in Touch</h1>
            <p className="text-xl max-w-2xl mx-auto">We'd love to hear from you! Send us a message or visit our bakery.</p>
          </div>
        </div>

        {/* Contact Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cupcake-pink focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cupcake-pink focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cupcake-pink focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cupcake-pink focus:border-transparent"
                    placeholder="Tell us more about how we can help you..."
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-cupcake-pink hover:bg-cupcake-darkPink text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-cupcake-pink/10 p-3 rounded-full mr-4">
                    <MapPin className="text-cupcake-pink" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Our Bakery</h3>
                    <p className="text-gray-600">123 Sweet Street, Harare, Zimbabwe</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cupcake-pink/10 p-3 rounded-full mr-4">
                    <Mail className="text-cupcake-pink" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email Us</h3>
                    <a href="mailto:hello@lakeishascupcakery.com" className="text-cupcake-pink hover:underline">
                      hello@lakeishascupcakery.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cupcake-pink/10 p-3 rounded-full mr-4">
                    <Phone className="text-cupcake-pink" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Call Us</h3>
                    <a href="tel:+263771234567" className="text-gray-600 hover:text-cupcake-pink">
                      +263 77 123 4567
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cupcake-pink/10 p-3 rounded-full mr-4">
                    <Clock className="text-cupcake-pink" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Opening Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium text-gray-900 mb-3">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a 
                      href="https://instagram.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-cupcake-pink/10 hover:bg-cupcake-pink/20 text-cupcake-pink p-3 rounded-full transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                    <a 
                      href="https://facebook.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-cupcake-pink/10 hover:bg-cupcake-pink/20 text-cupcake-pink p-3 rounded-full transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook size={20} />
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-cupcake-pink/10 hover:bg-cupcake-pink/20 text-cupcake-pink p-3 rounded-full transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter size={20} />
                    </a>
                    <a 
                      href="https://wa.me/263771234567" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-cupcake-pink/10 hover:bg-cupcake-pink/20 text-cupcake-pink p-3 rounded-full transition-colors"
                      aria-label="WhatsApp"
                    >
                      <Send size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Section */}
          <div className="mt-16 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-96 w-full">
              <iframe 
                title="Our Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3799.461276382705!2d31.05405031538478!3d-17.78390078782952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDQ3JzAyLjAiUyAzMcKwMDMnMjEuMCJF!5e0!3m2!1sen!2szw!4v1620000000000!5m2!1sen!2szw" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
