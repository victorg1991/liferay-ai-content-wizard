import ModalContent from '../../ModalContent';
import WizardEmptyState from '../WizardEmptyState';

type ContentWizardProps = {
  configured: boolean;
  isLoading: boolean;
  isLoadingContent: boolean;
  messages: any[];
  onSelectAsset: (asset: any) => void;
};

export default function ChatBody({
  configured,
  isLoading,
  isLoadingContent,
  messages,
  onSelectAsset,
}: ContentWizardProps) {
  if (isLoading) {
    return <b>Loading...</b>;
  }

  if (configured) {
    return (
      <ModalContent
        isLoadingContent={isLoadingContent}
        messages={messages}
        onSelectAsset={onSelectAsset}
      />
    );
  }

  return (
    <WizardEmptyState
      description='You must setting up the AI Wizard Settings.'
      title='Oops... Unable to continue'
    />
  );
}
