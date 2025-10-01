import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { contactAPI } from "@/lib/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    contactAPI.send(formData)
      .then(() => {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      info: "info@momore.com",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Call Us",
      info: "+250 788 123 456",
      description: "Mon-Fri from 8am to 5pm",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      info: "Kigali, Rwanda",
      description: "Come say hello at our office",
    },
    {
      icon: Clock,
      title: "Business Hours",
      info: "Mon-Fri: 8am-5pm",
      description: "Weekend: 10am-2pm",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50/30">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 1s ease-out forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }

        .golden-line {
          background: linear-gradient(90deg, transparent, #d97706, #b45309, #d97706, transparent);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .text-shadow-soft {
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
        }

        .contact-card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .contact-card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(217, 119, 6, 0.2);
        }
      `}</style>

      {/* Premium Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-block mb-6">
              <span className="text-sm font-bold text-amber-300 uppercase tracking-widest bg-amber-950/40 px-6 py-2.5 rounded-full border-2 border-amber-600/30 backdrop-blur-sm">
                Get In Touch
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-shadow-soft">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto animate-slide-up leading-relaxed">
              We'd love to hear from you. Let's start a conversation
            </p>
            <div className="w-32 h-1 golden-line mx-auto mt-8 rounded-full"></div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#fffbeb" fillOpacity="1"/>
          </svg>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <Card
                key={item.title}
                className="contact-card-hover border-0 shadow-lg bg-white rounded-2xl overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-amber-700" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-800 mb-2">{item.title}</h3>
                  <p className="text-lg font-semibold text-amber-700 mb-1">{item.info}</p>
                  <p className="text-sm text-stone-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16 bg-gradient-to-br from-white via-amber-50/30 to-stone-50 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-fade-in">
              <div className="mb-6">
                <span className="text-sm font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-4 py-2 rounded-full border border-amber-200">
                  Send Message
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 bg-clip-text text-transparent mb-6">
                Get in Touch
              </h2>
              <p className="text-stone-600 mb-8 leading-relaxed">
                Fill out the form below and we'll get back to you as soon as possible. We're here to help!
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-stone-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-stone-700 mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                    placeholder="What is this about?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-stone-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full border-2 border-amber-200 focus:border-amber-500 rounded-xl"
                    placeholder="Tell us more about how we can help you..."
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-lg"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Store Information */}
            <div className="animate-slide-up">
              <div className="bg-white rounded-2xl shadow-xl p-10 border-4 border-amber-100">
                <div className="mb-6">
                  <span className="text-sm font-bold text-green-700 uppercase tracking-widest bg-green-100 px-4 py-2 rounded-full border border-green-200">
                    Visit Us
                  </span>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 bg-clip-text text-transparent mb-6">
                  Our Store
                </h2>
                <p className="text-stone-600 mb-8 leading-relaxed">
                  Located in the heart of Kigali, our store offers a curated selection of premium handcrafted products.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 bg-amber-50 p-5 rounded-xl border-l-4 border-amber-600">
                    <MapPin className="h-6 w-6 text-amber-700 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-800 mb-1">Address</h4>
                      <p className="text-stone-600">Kigali, Rwanda</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 bg-amber-50 p-5 rounded-xl border-l-4 border-amber-600">
                    <Clock className="h-6 w-6 text-amber-700 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-800 mb-1">Store Hours</h4>
                      <p className="text-stone-600">
                        Monday - Friday: 8:00 AM - 5:00 PM<br />
                        Saturday - Sunday: 10:00 AM - 2:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 bg-amber-50 p-5 rounded-xl border-l-4 border-amber-600">
                    <Phone className="h-6 w-6 text-amber-700 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-800 mb-1">Phone</h4>
                      <p className="text-stone-600">+250 788 123 456</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 bg-amber-50 p-5 rounded-xl border-l-4 border-amber-600">
                    <Mail className="h-6 w-6 text-amber-700 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-800 mb-1">Email</h4>
                      <p className="text-stone-600">info@momore.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;