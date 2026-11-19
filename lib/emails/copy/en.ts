import type { EmailCopy } from "../types";

export const en: EmailCopy = {
  footer: {
    reason: "You’re getting this email because you asked for the free weekly plan on studentplanlegger.no.",
    signature: "Best wishes, Studentplanlegger",
    unsubscribeSubject: "Unsubscribe",
  },
  leadMagnet: {
    subject: "Your Weekly Plan sample is ready",
    preheader: "Monday–Wednesday as a fillable PDF. Download it now – the link works for 7 days.",
    label: "FREE SAMPLE",
    heading: "Your weekly plan is ready",
    intro:
      "Hi! Great that you want to try Weekly Plan. Here’s the first page: goals, priorities, to-dos and habits, plus a schedule for Monday to Wednesday.",
    note: "It’s a sample, not the full product. But it’s a real page from the planner, with fields you can fill in right in the PDF.",
    imageAlt:
      "The sample: first page of Weekly Plan with goals, priorities, to-dos and Monday to Wednesday",
    button: "Download the weekly plan",
    buttonMeta: ["Fillable PDF", "A4", "link works for 7 days"],
    textDownload: "Download the weekly plan (fillable PDF, A4, link works for 7 days):",
    tipsHeading: "How to use it",
    tips: [
      {
        title: "Open it in Adobe Acrobat Reader.",
        body: "It’s free on computer and phone, and lets you type straight into the fields and save.",
      },
      {
        title: "Set aside ten minutes on Sunday evening.",
        body: "Write down the week’s goals and your three top priorities before you fill in the schedule.",
      },
      {
        title: "Save a blank copy first.",
        body: "Then you’ve got a fresh page ready for next week. Or print it out and grab a pen.",
      },
    ],
    upsellHeading: "Want the whole week?",
    upsellBody:
      "The full Weekly Plan has two pages, with Thursday to Sunday too, and costs {single}. If you want everything, you get all 25 planners in the complete bundle for {komplett}.",
    linkWeekly: "See Weekly Plan",
    linkKomplett: "See the complete bundle",
    closing: "Have a good week! Any questions? Just reply to this email.",
    footerUnsubscribe:
      "Don’t want any more emails? Reply “unsubscribe” or write to {email} and we’ll take you off the list.",
    footerPrivacy: "Read our {privacy}.",
    privacyLink: "privacy policy",
    textPrivacyLabel: "Privacy",
  },
  welcome: {
    unsubscribeLink: "Unsubscribe",
    privacyLink: "Privacy",
    emails: [
      {
        subject: "How to get the most out of your weekly plan",
        body: "Hi! Have you tried the weekly plan yet? A quick tip: spend ten minutes on Sunday evening filling in lectures, deadlines and work, then pick three things that <em>have</em> to get done. Monday feels a lot calmer that way. Feel free to reply to this email if you have any questions.",
      },
      {
        subject: "When exams are getting close",
        body: "Six weeks before your exams, it’s smart to spread your course material over the weeks you have left, so you don’t end up cramming everything in the last week. The complete bundle has a yearly planner, a monthly planner and a weekly plan that work together, and they’re all fillable PDFs you can use on a tablet or computer.",
        button: "See the bundle",
      },
      {
        subject: "All 25 planners in one bundle",
        body: "Enjoying the weekly plan? You can get the whole complete bundle for {bundlePrice}. It’s a one-off purchase with no subscription, and you can download it straight away. Are you in a student association in Norway? You might get 20% off with their code.",
        button: "Buy the complete bundle",
      },
    ],
  },
};
