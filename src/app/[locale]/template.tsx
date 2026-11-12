import { RouteTransition } from "@/components/motion/MotionProviders";

export default function LocaleTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteTransition>{children}</RouteTransition>;
}
