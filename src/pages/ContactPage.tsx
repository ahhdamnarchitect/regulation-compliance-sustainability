import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { INQUIRY_MESSAGE_MAX_LENGTH, INQUIRY_NAME_MAX_LENGTH } from '@/lib/inquiryLimits';
import { RevealSection } from '@/components/ui/RevealSection';
import { ArrowLeft, HelpCircle, MessageSquare } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How do I upgrade or change my plan?',
    a: (
      <>
        Open{' '}
        <Link to="/account" className="text-earth-primary font-medium underline underline-offset-2">
          Account settings
        </Link>{' '}
        while signed in, or start checkout from the pricing section on the homepage. Paid plans unlock search, bookmarks, and export.
      </>
    ),
  },
  {
    q: 'Where is my billing or receipt handled?',
    a: (
      <>
        Subscription billing is processed securely through our payment provider at checkout. For invoice or card questions, mention them in the form below and we&apos;ll route your request.
      </>
    ),
  },
  {
    q: 'I forgot my password — how do I reset it?',
    a: (
      <>
        Use the sign-in flow on the homepage and choose password recovery, or open{' '}
        <Link to="/reset-password" className="text-earth-primary font-medium underline underline-offset-2">
          Reset password
        </Link>{' '}
        if linked from your email.
      </>
    ),
  },
  {
    q: 'What data do you collect?',
    a: (
      <>
        See our{' '}
        <Link to="/privacy" className="text-earth-primary font-medium underline underline-offset-2">
          Privacy Policy
        </Link>{' '}
        for how we handle account and usage data.
      </>
    ),
  },
  {
    q: 'Questions about a specific regulation or coverage?',
    a: (
      <>
        Use{' '}
        <Link to="/regulation-help" className="text-earth-primary font-medium underline underline-offset-2">
          Regulation help
        </Link>{' '}
        to ask about a rule or suggest one for monitoring — that keeps the right team on it.
      </>
    ),
  },
];

export default function ContactPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<string>('account');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please add your email and a message.',
        variant: 'destructive',
      });
      return;
    }
    if (message.length > INQUIRY_MESSAGE_MAX_LENGTH) {
      toast({
        title: 'Message too long',
        description: `Please keep your message under ${INQUIRY_MESSAGE_MAX_LENGTH} characters.`,
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('customer_inquiries').insert({
      inquiry_type: 'general',
      name: name.trim().slice(0, INQUIRY_NAME_MAX_LENGTH) || null,
      email: email.trim(),
      message: message.trim(),
      topic: null,
      category,
      location_hint: null,
      user_id: user?.id ?? null,
      page_path: '/contact',
      status: 'new',
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: 'Could not send',
        description: error.message || 'Please try again shortly.',
        variant: 'destructive',
      });
      return;
    }

    setMessage('');
    toast({
      title: 'Message sent',
      description: 'Thanks — we’ll get back to you as soon as we can.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full py-10 md:py-14 bg-white/70 border-y border-earth-sand/60">
        <div className="max-w-3xl mx-auto px-4">
          <RevealSection delay={0} variant="slide-up" className="mb-10">
            <Link
              to="/"
              className="inline-flex items-center text-earth-primary hover:text-earth-primary/90 transition-colors font-medium text-sm mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-earth-primary/10 p-2.5 text-earth-primary shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-title text-2xl md:text-3xl font-semibold text-earth-text mb-2">
                  Contact us
                </h1>
                <p className="text-earth-text/80 text-sm md:text-base">
                  Accounts, billing, subscriptions, and other general questions. For regulation-specific help, use{' '}
                  <Link to="/regulation-help" className="text-earth-primary font-medium underline underline-offset-2">
                    Regulation help
                  </Link>
                  .
                </p>
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={60} variant="slide-up" className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-earth-primary" />
              <h2 className="font-title text-lg font-semibold text-earth-text">Before you write</h2>
            </div>
            <Accordion type="single" collapsible className="w-full rounded-xl border border-earth-sand bg-white shadow-sm">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-earth-sand/80 px-4">
                  <AccordionTrigger className="text-left text-earth-text hover:no-underline hover:text-earth-primary">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-earth-text/80 text-sm leading-relaxed pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </RevealSection>

          <RevealSection delay={120} variant="slide-up">
            <div className="rounded-xl border border-earth-sand bg-white p-6 md:p-8 shadow-sm">
              <h2 className="font-title text-lg font-semibold text-earth-text mb-1">Send a message</h2>
              <p className="text-sm text-earth-text/70 mb-6">
                We typically reply within one to two business days.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-earth-text">Topic</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-1.5 border-earth-sand">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account">Account & login</SelectItem>
                      <SelectItem value="billing">Billing & invoices</SelectItem>
                      <SelectItem value="subscription">Subscription & plan</SelectItem>
                      <SelectItem value="technical">Technical issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, INQUIRY_NAME_MAX_LENGTH))}
                  placeholder="Your name (optional)"
                  maxLength={INQUIRY_NAME_MAX_LENGTH}
                  className="border-earth-sand focus-visible:ring-earth-primary"
                />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="border-earth-sand focus-visible:ring-earth-primary"
                />
                <div>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, INQUIRY_MESSAGE_MAX_LENGTH))}
                    placeholder="How can we help?"
                    className="min-h-[160px] border-earth-sand focus-visible:ring-earth-primary"
                    required
                    maxLength={INQUIRY_MESSAGE_MAX_LENGTH}
                  />
                  <p className="text-xs text-earth-text/60 mt-1.5 text-right">
                    {message.length} / {INQUIRY_MESSAGE_MAX_LENGTH}
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-earth-primary hover:opacity-90 text-white"
                >
                  {submitting ? 'Submitting…' : 'Submit'}
                </Button>
              </form>
            </div>
          </RevealSection>
        </div>
      </main>
      <Footer />
    </div>
  );
}
