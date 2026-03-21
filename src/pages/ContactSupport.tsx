import { useState, useEffect, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRegulations } from '@/hooks/useRegulations';
import { supabase } from '@/lib/supabase';
import { RevealSection } from '@/components/ui/RevealSection';
import { InquiryAutocompleteInput } from '@/components/inquiry/InquiryAutocompleteInput';
import { ArrowLeft } from 'lucide-react';

/**
 * Questions and regulation suggestions — forms with database-backed autocomplete.
 */
export default function ContactSupport() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { regulations } = useRegulations();
  const [searchParams] = useSearchParams();

  const [questionName, setQuestionName] = useState('');
  const [questionEmail, setQuestionEmail] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionRegulation, setQuestionRegulation] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  const [suggestionName, setSuggestionName] = useState('');
  const [suggestionEmail, setSuggestionEmail] = useState('');
  const [suggestionText, setSuggestionText] = useState('');
  const [suggestionRegulation, setSuggestionRegulation] = useState('');
  const [suggestionLocation, setSuggestionLocation] = useState('');
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    setQuestionEmail(user.email);
    setSuggestionEmail(user.email);
  }, [user?.email]);

  useEffect(() => {
    const raw = searchParams.get('regulation')?.trim();
    if (!raw) return;
    try {
      setQuestionRegulation(decodeURIComponent(raw));
    } catch {
      setQuestionRegulation(raw);
    }
  }, [searchParams]);

  const handleQuestionSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!questionEmail.trim() || !questionText.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please add your email and your regulation question.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingQuestion(true);
    const { error } = await supabase.from('customer_inquiries').insert({
      inquiry_type: 'question',
      name: questionName.trim() || null,
      email: questionEmail.trim(),
      message: questionText.trim(),
      topic: questionRegulation.trim() || null,
      location_hint: null,
      user_id: user?.id ?? null,
      page_path: '/contact',
      status: 'new',
    });
    setIsSubmittingQuestion(false);

    if (error) {
      toast({
        title: 'Could not send question',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
      return;
    }

    setQuestionText('');
    setQuestionRegulation('');
    toast({
      title: 'Question received',
      description: 'Thanks. We aim to respond within 24 hours.',
    });
  };

  const handleSuggestionSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!suggestionEmail.trim() || !suggestionText.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please add your email and your suggestion.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingSuggestion(true);
    const { error } = await supabase.from('customer_inquiries').insert({
      inquiry_type: 'suggestion',
      name: suggestionName.trim() || null,
      email: suggestionEmail.trim(),
      message: suggestionText.trim(),
      topic: suggestionRegulation.trim() || null,
      location_hint: suggestionLocation.trim() || null,
      user_id: user?.id ?? null,
      page_path: '/contact',
      status: 'new',
    });
    setIsSubmittingSuggestion(false);

    if (error) {
      toast({
        title: 'Could not send suggestion',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
      return;
    }

    setSuggestionText('');
    setSuggestionRegulation('');
    setSuggestionLocation('');
    toast({
      title: 'Suggestion received',
      description: 'Thanks. We will review it for monitoring.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full py-10 md:py-14 bg-white/70 border-y border-earth-sand/60">
        <div className="max-w-6xl mx-auto px-4">
          <RevealSection delay={0} variant="slide-up" className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-earth-primary hover:text-earth-primary/90 transition-colors font-medium text-sm mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            <h1 className="font-title text-2xl md:text-3xl font-semibold text-earth-text mb-2">
              Need help or see something missing?
            </h1>
            <p className="text-earth-text/80 text-sm md:text-base max-w-2xl">
              Send a regulation question or suggest a rule for us to monitor. We only use your details to respond to this request.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RevealSection delay={80} variant="slide-up">
              <form onSubmit={handleQuestionSubmit} className="rounded-xl border border-earth-sand bg-white p-5 md:p-6 shadow-sm space-y-3 h-full">
                <h2 className="font-title text-lg font-semibold text-earth-text">Regulation question</h2>
                <p className="text-sm text-earth-text/80">We aim to respond within 24 hours.</p>
                <Input
                  value={questionName}
                  onChange={(e) => setQuestionName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="border-earth-sand focus-visible:ring-earth-primary"
                />
                <Input
                  type="email"
                  value={questionEmail}
                  onChange={(e) => setQuestionEmail(e.target.value)}
                  placeholder="Your email"
                  className="border-earth-sand focus-visible:ring-earth-primary"
                  required
                />
                <InquiryAutocompleteInput
                  id="contact-question-regulation"
                  label="Regulation"
                  value={questionRegulation}
                  onChange={setQuestionRegulation}
                  regulations={regulations}
                  variant="regulation-title"
                  placeholder="Start typing — click a suggestion or finish typing"
                />
                <Textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Your question…"
                  className="min-h-[120px] border-earth-sand focus-visible:ring-earth-primary"
                  required
                />
                <Button type="submit" disabled={isSubmittingQuestion} className="w-full bg-earth-primary hover:opacity-90 text-white">
                  {isSubmittingQuestion ? 'Sending…' : 'Send question'}
                </Button>
              </form>
            </RevealSection>

            <RevealSection delay={120} variant="slide-up">
              <form onSubmit={handleSuggestionSubmit} className="rounded-xl border border-earth-sand bg-white p-5 md:p-6 shadow-sm space-y-3 h-full">
                <h2 className="font-title text-lg font-semibold text-earth-text">Suggest a regulation to monitor</h2>
                <p className="text-sm text-earth-text/80">If you don&apos;t see a regulation, tell us what to track.</p>
                <Input
                  value={suggestionName}
                  onChange={(e) => setSuggestionName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="border-earth-sand focus-visible:ring-earth-primary"
                />
                <Input
                  type="email"
                  value={suggestionEmail}
                  onChange={(e) => setSuggestionEmail(e.target.value)}
                  placeholder="Your email"
                  className="border-earth-sand focus-visible:ring-earth-primary"
                  required
                />
                <InquiryAutocompleteInput
                  id="contact-suggestion-regulation"
                  label="Regulation"
                  value={suggestionRegulation}
                  onChange={setSuggestionRegulation}
                  regulations={regulations}
                  variant="regulation-title"
                  placeholder="Related or similar regulation (optional)"
                />
                <InquiryAutocompleteInput
                  id="contact-suggestion-location"
                  label="Country or jurisdiction"
                  value={suggestionLocation}
                  onChange={setSuggestionLocation}
                  regulations={regulations}
                  variant="location"
                  placeholder="Start typing — e.g. EU, Japan, California"
                />
                <Textarea
                  value={suggestionText}
                  onChange={(e) => setSuggestionText(e.target.value)}
                  placeholder="What should we add?"
                  className="min-h-[120px] border-earth-sand focus-visible:ring-earth-primary"
                  required
                />
                <Button type="submit" disabled={isSubmittingSuggestion} className="w-full bg-earth-primary hover:opacity-90 text-white">
                  {isSubmittingSuggestion ? 'Sending…' : 'Send suggestion'}
                </Button>
              </form>
            </RevealSection>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
