import { Link as RedixLink } from "@radix-ui/themes";
import NextLink from "next/link";
interface Props {
  href: string;
  children: string;
}

const Link = ({ href, children }: Props) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <RedixLink>{children}</RedixLink>
    </NextLink>
  );
};

export default Link;
