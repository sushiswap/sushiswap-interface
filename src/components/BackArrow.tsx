import { ArrowLeft } from "react-feather";
import Link from "next/link";
import { classNames } from "../functions/styling";

function BackArrow({ to, className = "" }: { to: string; className: string }) {
  return (
    <Link href={to}>
      <a className={classNames("text-primary", className)}>
        <ArrowLeft />
      </a>
    </Link>
  );
}

export default BackArrow;
