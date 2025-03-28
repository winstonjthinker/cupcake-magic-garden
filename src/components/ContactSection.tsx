
import React from 'react';
import { Instagram, Send, Facebook, Twitter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 bg-white relative overflow-hidden">
      {/* Decorative floating cupcake */}
      <div className="absolute right-10 top-20 hidden lg:block animate-float">
        <img 
          src="https://images.unsplash.com/photo-1599785209707-a456fc1337bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" 
          alt="Floating Cupcake" 
          className="w-24 h-24 rounded-full object-cover shadow-lg"
        />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-pacifico text-cupcake-darkPink mb-3">Get in Touch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or want to place a special order? Reach out to us!
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Send Us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input 
                    id="name" 
                    placeholder="Your name" 
                    className="border-cupcake-blue/50 focus:border-cupcake-blue focus:ring focus:ring-cupcake-blue/20"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Your email" 
                    className="border-cupcake-blue/50 focus:border-cupcake-blue focus:ring focus:ring-cupcake-blue/20"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <Input 
                  id="subject" 
                  placeholder="Message subject" 
                  className="border-cupcake-blue/50 focus:border-cupcake-blue focus:ring focus:ring-cupcake-blue/20"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <Textarea 
                  id="message" 
                  placeholder="Your message" 
                  rows={5}
                  className="border-cupcake-blue/50 focus:border-cupcake-blue focus:ring focus:ring-cupcake-blue/20"
                />
              </div>
              <Button className="bg-cupcake-darkPink hover:bg-cupcake-pink w-full">Send Message</Button>
            </form>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="bg-gradient-to-br from-cupcake-blue/10 to-cupcake-pink/10 p-6 rounded-xl shadow-sm mb-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Address</h4>
                  <p className="text-gray-600">123 Sweet Street, Bakery Lane, Cupcake City, CC 12345</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Phone</h4>
                  <p className="text-gray-600">(555) 123-4567</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Email</h4>
                  <p className="text-gray-600">info@lakeishascupcakery.com</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Hours</h4>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Connect With Us</h3>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F56040] text-white transition-transform hover:scale-110"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://wa.me/1234567890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-cupcake-green text-white transition-transform hover:scale-110"
              >
                <Send size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] text-white transition-transform hover:scale-110"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1DA1F2] text-white transition-transform hover:scale-110"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
