'use client';

import React, { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, BarChart3 } from 'lucide-react';
import { useLang } from '@/contexts/LanguageContext';
import { useToast } from '@/contexts/ToastContext';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { assessmentQuestions } from '@/lib/demoData';
import { cn } from '@/lib/utils';

export default function AssessmentPage() {
  const { t, lang, isRTL } = useLang();
  const toast = useToast();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = assessmentQuestions.length;
  const question = assessmentQuestions[currentQ];
  const progress = Math.round(((currentQ) / total) * 100);

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const calcScore = () => {
    const total = Object.values(answers).reduce((sum, v) => sum + parseInt(v), 0);
    return Math.round((total / (assessmentQuestions.length * 4)) * 100);
  };

  const handleNext = () => {
    if (currentQ < total - 1) setCurrentQ(currentQ + 1);
    else {
      setSubmitted(true);
      const s = calcScore();
      toast.success(`Assessment complete! Your score: ${s}%`);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  if (submitted) {
    const score = calcScore();
    const level = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Developing' : 'Needs Attention';
    const color = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-primary-600' : score >= 40 ? 'text-amber-600' : 'text-red-600';
    const bgColor = score >= 80 ? 'bg-green-50' : score >= 60 ? 'bg-primary-50' : score >= 40 ? 'bg-amber-50' : 'bg-red-50';

    return (
      <div className="flex-1 overflow-y-auto">
        <DashboardHeader title={t('careerAssessment')} />
        <div className="p-6 max-w-2xl mx-auto">
          <Card className="text-center py-10">
            <div className={cn('w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl font-bold', bgColor, color)}>
              {score}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Employability Score</h2>
            <p className={cn('text-lg font-semibold mb-4', color)}>{level}</p>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Based on your responses, we've generated a personalized career roadmap. Check it out to see your recommended next steps.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto">
              {assessmentQuestions.map((q, i) => (
                <div key={q.id} className="text-left p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">{q.category}</p>
                  <Progress value={parseInt(answers[q.id] ?? '0') * 25} color={parseInt(answers[q.id] ?? '0') >= 3 ? 'green' : 'amber'} size="sm" />
                </div>
              ))}
            </div>

            <div className={cn('flex gap-3 justify-center', isRTL ? 'flex-row-reverse' : '')}>
              <Button onClick={() => { setSubmitted(false); setCurrentQ(0); setAnswers({}); }} variant="outline">
                Retake Assessment
              </Button>
              <Button onClick={() => window.location.href = '/dashboard/job-seeker/roadmap'}>
                View My Roadmap <ArrowRight size={16} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHeader title={t('careerAssessment')} subtitle={t('assessmentSubtitle')} />

      <div className="p-6 max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className={cn('flex justify-between text-sm text-gray-500 mb-2', isRTL ? 'flex-row-reverse' : '')}>
            <span>Question {currentQ + 1} of {total}</span>
            <span>{progress}% complete</span>
          </div>
          <Progress value={progress} color="primary" size="md" />
        </div>

        {/* Question card */}
        <Card>
          <div className="mb-2">
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{question.category}</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {lang === 'fa' ? question.questionFa : question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((opt) => {
              const isSelected = answers[question.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className={cn(
                    'w-full text-left p-4 rounded-xl border-2 transition-all duration-150',
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                    isRTL ? 'text-right' : ''
                  )}
                >
                  <div className={cn('flex items-center gap-3', isRTL ? 'flex-row-reverse' : '')}>
                    <div className={cn('w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center', isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300')}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="text-sm text-gray-700">
                      {lang === 'fa' ? opt.labelFa : opt.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className={cn('flex justify-between mt-8', isRTL ? 'flex-row-reverse' : '')}>
            <Button variant="outline" onClick={handlePrev} disabled={currentQ === 0}>
              <ArrowLeft size={16} className={isRTL ? 'rotate-180' : ''} />
              {t('back')}
            </Button>
            <Button onClick={handleNext} disabled={!answers[question.id]}>
              {currentQ === total - 1 ? 'Submit' : t('next')}
              <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
            </Button>
          </div>
        </Card>

        {/* Question dots */}
        <div className={cn('flex justify-center gap-1.5 mt-6', isRTL ? 'flex-row-reverse' : '')}>
          {assessmentQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={cn('w-2.5 h-2.5 rounded-full transition-colors', i === currentQ ? 'bg-primary-600' : answers[assessmentQuestions[i].id] ? 'bg-primary-200' : 'bg-gray-200')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
