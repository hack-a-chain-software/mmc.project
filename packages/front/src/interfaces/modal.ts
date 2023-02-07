export interface BaseModalPropsInterface {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  isLoading?: boolean;
}
