import { useState, useEffect, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import type { Regulation } from '@/types/regulation';
import { InquiryAutocompleteInput } from '@/components/inquiry/InquiryAutocompleteInput';
import { MessageCircle } from 'lucide-react';

export interface RegulationQuestionPanelProps {
  regulations: Regulation[];
  /** Pre-filled regulation title (user can change; autocomplete helps). */
  defaultRegulationTitle: string;
  /** Stored on the inquiry for analytics (e.g. `/regulation/123`). */
  pagePath: string;
}

export function RegulationQuestionPanel({
  regulations,
  defaultRegulationTitle,
  pagePath,
}: RegulationQuestionPanelProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [regulationTitle, setRegulationTitle] = useState(defaultRegulationTitle);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setRegulationTitle(defaultRegulationTitle);
  }, [defaultRegulationTitle]);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please add your email and your question.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('customer_inquiries').insert({
      inquiry_type: 'question',
      name: name.trim() || null,
      email: email.trim(),
      message: message.trim(),
      topic: regulationTitle.trim() || defaultRegulationTitle || null,
      location_hint: null,
      user_id: user?.id ?? null,
      page_path: pagePath,
      status: 'new',
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: 'Could not send question',
        description: 'Please try again in a moment.',
        variant: 'destructive',
      });
      return;
    }

    setMessage('');
    toast({
      title: 'Question received',
      description: 'Thanks. We aim to respond within 24 hours.',
    });
  };

  return (
    <Card className="border-earth-sand bg-white/95 shadow-md">
      <CardHeader>
        <CardTitle className="font-title text-lg md:text-xl flex items-center gap-2 text-earth-text">
          <MessageCircle className="w-5 h-5 text-earth-primary shrink-0" />
          Have a question about this regulation?
        </CardTitle>
        <p className="text-sm text-earth-text/80 pt-1">
          Ask our team — the regulation below is pre-filled; you can adjust it or pick another from suggestions.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="border-earth-sand focus-visible:ring-earth-primary"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="border-earth-sand focus-visible:ring-earth-primary"
            required
          />
          <InquiryAutocompleteInput
            id="detail-question-regulation"
            label="Regulation"
            value={regulationTitle}
            onChange={setRegulationTitle}
            regulations={regulations}
            variant="regulation-title"
            placeholder="Start typing to search regulations…"
          />
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your question…"
            className="min-h-[100px] border-earth-sand focus-visible:ring-earth-primary"
            required
          />
          <Button type="submit" disabled={submitting} className="bg-earth-primary hover:opacity-90 text-white">
            {submitting ? 'Sending…' : 'Send question'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
