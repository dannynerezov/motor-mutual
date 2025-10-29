import { useSocialProof } from '@/hooks/useSocialProof';
import { SocialProofNotification } from '@/components/SocialProofNotification';

export const SocialProofManager = () => {
  const {
    currentNotification,
    isVisible,
    timeAgo,
    memberName,
    heading,
    actionPhrase,
    handleDismiss,
  } = useSocialProof();

  if (!currentNotification) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 pointer-events-none max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:bottom-20">
      <div className="pointer-events-auto">
        <SocialProofNotification
          vehicle={currentNotification}
          timeAgo={timeAgo}
          memberName={memberName}
          heading={heading}
          actionPhrase={actionPhrase}
          onClose={handleDismiss}
          isVisible={isVisible}
        />
      </div>
    </div>
  );
};
