import { useNavigation } from '@remix-run/react';

export default function LoadingBar() {
  const navigation = useNavigation();

  const isLoading = navigation.state === 'loading';

  if (isLoading) {
    return (
      <progress className="absolute top-0 lef-0 progress z-20 w-full transition-opacity delay-200"></progress>
    );
  }
}
