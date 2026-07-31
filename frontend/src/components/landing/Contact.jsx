import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import ScrollReveal from '../common/ScrollReveal';
import publicService from '../../services/publicService';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async (values) => {
    try {
      await publicService.submitContact(values);
      setSent(true);
      reset();
      toast.success('Message sent! We will get back to you soon.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="relative bg-black py-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal className="mb-14 max-w-xl">
          <p className="eyebrow mb-4">Get In Touch</p>
          <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
            Visit us in <span className="text-crimson-light">Raichur</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ScrollReveal>
            <form onSubmit={handleSubmit(onSubmit)} className="glass space-y-5 p-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="label-field">Full Name</label>
                  <input className="input-field" placeholder="Your name" {...register('name', { required: 'Name is required' })} />
                  {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label-field">Email</label>
                  <input
                    className="input-field"
                    placeholder="you@example.com"
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' } })}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label className="label-field">Phone (optional)</label>
                <input className="input-field" placeholder="+91 98765 43210" {...register('phone')} />
              </div>
              <div>
                <label className="label-field">Message</label>
                <textarea
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Tell us what you're looking for..."
                  {...register('message', { required: 'Message is required' })}
                />
                {errors.message && <p className="mt-1.5 text-xs text-danger">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-cta w-full disabled:opacity-60">
                <Send size={16} /> {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              {sent && <p className="text-center text-xs text-success">Thanks — we'll be in touch shortly.</p>}
            </form>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="flex flex-col gap-5">
            <div className="glass overflow-hidden">
              <iframe
                title="Xtreme Fitness Location - Raichur"
                src="https://www.google.com/maps?q=Raichur,Karnataka,India&output=embed"
                width="100%"
                height="280"
                style={{ border: 0, filter: 'grayscale(0.3) invert(0.92) contrast(0.9)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="glass grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-crimson-light" />
                <p className="text-sm text-white/60">Station Road, Raichur, Karnataka 584101</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-crimson-light" />
                <p className="text-sm text-white/60">+91 98765 43210</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-crimson-light" />
                <p className="text-sm text-white/60">hello@xtremefitness.in</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
