// "use client";

// import ContinueListening from "@/src/components/HomeComponents/ContinueListening/index";
// import CricketArticles from "@/src/components/HomeComponents/CricketArticles/index";
// import Header from "@/src/components/HomeComponents/Header/index";
// import HomeBanners from "@/src/components/HomeComponents/HomeBanners/index";
// import HomeCardsSection from "@/src/components/HomeComponents/HomeCards";
// import Player360CardsSection from "@/src/components/HomeComponents/Player360Cards";
// import Team360CardsSection from "@/src/components/HomeComponents/Team360Cards";



// export default function HomePage() {
//   return (
//     <div className="flex flex-col w-full">
//       <Header />
//       <div className="flex flex-col gap-6 px-4 lg:px-6 py-4 w-full">
//         <HomeBanners />
//         {/* <ContinueListening /> */}
//         <HomeCardsSection />
//         <Team360CardsSection />
//         <Player360CardsSection  />
//         <CricketArticles />
//       </div>
//     </div>
//   );
// }





"use client";

import ContinueListening from "@/src/components/HomeComponents/ContinueListening/index";
import CricketArticles from "@/src/components/HomeComponents/CricketArticles/index";
import Header from "@/src/components/HomeComponents/Header/index";
import HomeBanners from "@/src/components/HomeComponents/HomeBanners/index";
import HomeCardsSection from "@/src/components/HomeComponents/HomeCards";
import Player360CardsSection from "@/src/components/HomeComponents/Player360Cards";
import Team360CardsSection from "@/src/components/HomeComponents/Team360Cards";
import { Pencil, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const defaultInviteMessage =
    "Hey! Join me on SportsFan360 for live matches, articles, and fan conversations.";
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteMessage, setInviteMessage] = useState(defaultInviteMessage);
  const [inviteEmails, setInviteEmails] = useState("");
  const [invitePhones, setInvitePhones] = useState("");

  const handleInviteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const messageToSend = inviteMessage.trim() || defaultInviteMessage;
    const emailRecipients = inviteEmails
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean)
      .join(",");
    const phoneRecipients = invitePhones
      .split(",")
      .map((phone) => phone.trim())
      .filter(Boolean);

    if (emailRecipients) {
      const mailtoLink = `mailto:${emailRecipients}?subject=${encodeURIComponent(
        "You are invited to SportsFan360"
      )}&body=${encodeURIComponent(messageToSend)}`;
      window.open(mailtoLink, "_blank");
    }

    if (phoneRecipients.length > 0) {
      const smsLink = `sms:${phoneRecipients[0]}?body=${encodeURIComponent(messageToSend)}`;
      window.open(smsLink, "_blank");
    }

    setIsInviteOpen(false);
  };

  // const handleFeedback = () => {
  //   // You can open a modal, redirect to a feedback form, or open email
  //   window.open("mailto:feedback@sportsfan360.com?subject=Feedback for SportsFan360", "_blank");
  //   // Or open a feedback form modal
  //   // setIsFeedbackOpen(true);
  // };

  return (
    <div className="flex flex-col w-full relative">
      <Header />
      <div className="flex flex-col gap-6 px-4 lg:px-6 py-4 w-full">
        <HomeBanners />
        {/* <ContinueListening /> */}
        <HomeCardsSection />
        <Team360CardsSection />
        <Player360CardsSection />
        <CricketArticles />
      </div>

      {/* Sticky Invite Friend Button */}
      <div className="fixed bottom-27 right-6 md:bottom-22 md:right-6 z-50">
        <button
          onClick={() => {
            setInviteMessage(defaultInviteMessage);
            setInviteEmails("");
            setInvitePhones("");
            setIsInviteOpen(true);
          }}
          className="group relative flex items-center justify-center w-7 h-7 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r from-[#C9115F] to-[#e85d04] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Invite a Friend"
        >
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Invite a Friend
          </span>

          <UserPlus className="text-white w-3 h-3 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Sticky Feedback Button */}
      <div className="fixed bottom-15 right-6 md:bottom-6 md:right-6 z-50">
        <Link href="/MainModules/Feedback">
        <button
          // onClick={handleFeedback}
          className="group relative flex items-center justify-center w-7 h-7 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r from-[#C9115F] to-[#e85d04] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Give Feedback"
        >
          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Give Feedback
          </span>
          
          {/* Icon */}
        <Pencil className="text-white w-3 h-3 md:w-6 md:h-6" />
          
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full animate-ping bg-[#C9115F] opacity-40"></span>
        </button>
        </Link>
      </div>

      {/* Optional: Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] rounded-2xl max-w-md w-full p-6 border border-white/10">
            <h3 className="text-white text-xl font-bold mb-2">Send Feedback</h3>
            <p className="text-gray-400 text-sm mb-4">We&apos;d love to hear your thoughts!</p>
            
            <textarea
              placeholder="Tell us what you think about SportsFan360..."
              rows={4}
              className="w-full bg-[#0d0d10] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#C9115F]/50 mb-4"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle feedback submission
                  setIsFeedbackOpen(false);
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#C9115F] to-[#e85d04] text-white font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Friend Dialog */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] rounded-2xl max-w-md w-full p-6 border border-white/10">
            <h3 className="text-white text-xl font-bold mb-2">Invite a Friend</h3>
            <p className="text-gray-400 text-sm mb-4">
              Enter the email addresses and phone numbers you want to invite. The message below can be personalized by the sender.
            </p>

            <form onSubmit={handleInviteSubmit}>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Email address(es)
              </label>
              <input
                type="text"
                required
                placeholder="friend1@example.com, friend2@example.com"
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
                className="w-full bg-[#0d0d10] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#0A7BFF]/60 mb-3"
              />

              <label className="block text-xs font-medium text-gray-300 mb-2">
                Phone number(s)
              </label>
              <input
                type="text"
                required
                placeholder="9876543210, 9988776655"
                value={invitePhones}
                onChange={(e) => setInvitePhones(e.target.value)}
                className="w-full bg-[#0d0d10] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#0A7BFF]/60 mb-3"
              />

              <div className="rounded-xl border border-white/10 bg-[#0d0d10] p-4 mb-3">
                <p className="text-xs font-medium text-gray-300 mb-2">Message from sender</p>
                <textarea
                  rows={4}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full bg-transparent text-white text-sm focus:outline-none resize-none placeholder:text-gray-500"
                />
              </div>

              <div className="rounded-xl border border-white/10 bg-[#101014] p-4 mb-4">
                <p className="text-xs font-medium text-gray-300 mb-2">Instructions</p>
                <ol className="space-y-2 text-sm text-gray-400 leading-6 list-decimal list-inside">
                  <li>Open the invite message from your email or phone.</li>
                  <li>Tap the SportsFan360 link in the message.</li>
                  <li>Sign up or log in with your email or phone number.</li>
                  <li>Verify your account if prompted.</li>
                  <li>Start using the app to explore matches, articles, and live updates.</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#C9115F] to-[#e85d04] text-white font-semibold"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}